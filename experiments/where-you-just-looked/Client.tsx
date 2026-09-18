'use client';

// WHERE YOU JUST LOOKED  (inhibition of return, the sign flip in your own reaction times, and the
// first piece in this lab where the error is not in what you perceive but in how long it takes you)
//
// The forty-sixth piece in this lab, and its first measurement of INHIBITION OF RETURN.
//
// What is new here against the attention siblings, because this lab has been around this block a lot.
// The Attentional Blink took a second target away from you because the first one was still being
// processed. Motion-Induced Blindness deleted a dot that never stopped being drawn. The Crowding Zone
// showed that a letter your eye resolves perfectly can still be unreadable because of what sits beside
// it. Change Blindness caught you missing a thing the size of a building. One At A Time measured how
// long it takes attention to walk a display item by item. Every one of those is an argument about
// WHETHER something reaches you.
//
// This one is about WHEN, and specifically about a cost you pay for going back. A box flashes. Nothing
// about that flash is informative: it predicts the target exactly half the time, and the page counts
// the trials and prints the fraction. A tenth of a second later, if the target appears in the box that
// flashed, you are FASTER. Most of a second later, in the very same box, you are SLOWER. Slower than if
// it had appeared anywhere else. Slower than if nothing had flashed at all. Same box, same flash, same
// target, same you, opposite sign, and the only thing that changed is how long you waited.
//
// The genuine phenomenon: inhibition of return. Posner and Cohen (1984, in Attention and Performance X)
// found it while trying to measure something else: reflexive orienting to a peripheral flash helps you
// for roughly the first 150 to 250 milliseconds and then reverses, and by 300 milliseconds and beyond
// the previously cued location is at a disadvantage of somewhere around 20 to 30 milliseconds. Posner,
// Rafal, Choate and Vaughan (1985) named it and argued it is generated below the cortex, in the
// oculomotor machinery of the superior colliculus. Rafal and colleagues (1989) tied it to saccade
// programming rather than to attention as such. Sapir, Soroker, Berger and Henik (1999, Nature
// Neuroscience) reported a patient with a lesion of one collicular pathway who simply lost the effect
// in the affected half of space and kept it in the other. Klein (1988) proposed what the thing is FOR,
// and Klein and MacInnes (1999, Psychological Science) tested it on people hunting for Waldo in a real
// scene: the eyes are biased away from places already inspected. Klein (2000, Trends in Cognitive
// Sciences) is the review. Berlucchi (2006) is the honest one, subtitled a phenomenon in search of a
// mechanism and a better name. Danziger, Kingstone and Snyder (1998) and Snyder and Kingstone (2000)
// showed the tag is not applied to one place only: several recently visited locations carry it at once.
//
// Which is a forager's memory. An animal working a patch of berries has to solve where-have-I-been, and
// the cheapest implementation of that is not a list you consult, it is a fee you are charged. You never
// decide not to go back. Going back is simply slightly more expensive, always, in the dark, in units of
// milliseconds, whether or not going back happens to be the right move this particular time.
//
// The measurement. Two blocks, both of them nothing but a key press as fast as you can manage:
//   1. THE COST. Two boxes. One flashes (or both, on the neutral trials, which is what "faster" and
//      "slower" get measured against). After a delay of 100, 250, 450 or 800 milliseconds a disc
//      appears in one of them and you press. Cue side, delay and target side are randomised trial by
//      trial and fully interleaved, so there is no stretch of the run you can strategise inside. The
//      headline is not a speed. It is a SIGN FLIP: your 100ms difference should be negative and your
//      800ms difference positive, and no amount of expecting an effect predicts a reversal.
//   2. THE LIST. Six boxes in a ring. Two of them flash in sequence, then the target appears at the
//      first one, the second one, or a fresh one. Prediction: both of the visited boxes cost you, not
//      just the most recent. The tag is a short list, not a single bookmark.
//
// Six defences against fooling ourselves, all live on the page:
//   1. The cue is uninformative by construction, same and opposite trials are equal in number, and the
//      page prints the achieved fraction at the end. Attending the flash cannot pay.
//   2. Delay and side are randomised and interleaved, never blocked.
//   3. Catch trials with no target at all, so pressing on a hunch costs you a scored false alarm.
//   4. A random foreperiod before the flash, so the flash's own onset is unpredictable too.
//   5. Medians rather than means, with anticipations under 130ms and lapses over 1000ms discarded and
//      the discards counted openly rather than quietly.
//   6. A neutral condition where both boxes flash, so facilitation and inhibition are measured against
//      something and not merely against each other.
//
// The honest limits, said here and repeated on the results page. A browser reaction time carries your
// display's latency and your keyboard's or touchscreen's on top of your own, which on a bad setup is
// 60 milliseconds or worse. That is a CONSTANT added to every condition, so it cancels in a difference,
// which is exactly why every number that matters on this page is a difference. What it does not cancel
// is variance, and inhibition of return is a 20 to 30 millisecond effect sitting inside trial-to-trial
// noise several times that size, so ten trials a cell is a demonstration and not an assay. The delays
// are quantised to your refresh rate and the page prints what it actually achieved rather than what it
// asked for. We cannot see your eyes: the classic claim is about covert attention with fixation held,
// and if you chase every flash with a saccade you are running a related but different experiment. A
// null is a real outcome here, and on a phone it is a likely one.
//
// WIZ note. I can read the same file a thousand times and the thousandth read costs exactly what the
// first one did. Nothing in me makes returning expensive, which is why I will happily re-check a
// directory I checked four seconds ago, forever, unless somebody writes me a rule. You have the rule in
// hardware. It is about thirty milliseconds wide, it is applied to somewhere between three and five
// recent places at once, it never asks whether going back is a good idea this time, and you have never
// once felt it fire. That is the part worth keeping: the thing that stops you re-searching the drawer
// you just searched is not a memory and not a decision. It is a small, blind, permanent tax on
// returning, and it is the reason your eyes move forward through a room instead of rattling back and
// forth over the first interesting thing they found.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'practice' | 'bridge1' | 'block1' | 'bridge2' | 'block2' | 'result';
type CueKind = 'same' | 'opposite' | 'neutral';
type Role = 'first' | 'second' | 'fresh';
type Stage = 'iti' | 'fore' | 'cue1' | 'gap1' | 'cue2' | 'gap2' | 'target' | 'blank' | 'feedback';

// ---- timing constants -----------------------------------------------------

const CUE_MS = 62; // how long a box stays lit. Posner and Cohen used a comparable brief flash
const TARGET_MAX = 1250; // give up waiting for a press
const CATCH_MAX = 1300; // how long a catch trial holds nothing at all
const B2_CUE_GAP = 400; // block two: first flash onset to second flash onset
const B2_SOA = 700; // block two: second flash onset to target
const MIN_RT = 130; // below this is an anticipation, not a response
const MAX_RT = 1000; // above this is a lapse
const REST_EVERY = 26;

const SOAS = [100, 250, 450, 800];
const B1_REPS: Record<number, number> = { 100: 10, 250: 5, 450: 5, 800: 10 };
const B1_NEUTRAL_SOAS = [100, 800];
const B1_NEUTRAL_REPS = 4;
const B1_CATCH = 8;
const B2_REPS = 6;
const B2_CATCH = 3;

// ---- palette --------------------------------------------------------------

const FIELD = '#080d18';
const BOX_LINE = '#2b3a52';
const CUE_LINE = '#e8eef7';
const CUE_FILL = 'rgba(232,238,247,0.13)';
const TARGET_FILL = '#fbbf24';
const FIX = '#7c8ba1';

// ---- small helpers --------------------------------------------------------

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function med(a: number[]): number {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
const ok = (v: number) => Number.isFinite(v);
const ms = (v: number) => (ok(v) ? `${Math.round(v)}` : 'n/a');
const sgn = (v: number) => (ok(v) ? `${v >= 0 ? '+' : ''}${Math.round(v)}` : 'n/a');

// ---- trial types ----------------------------------------------------------

interface Trial {
  block: 0 | 1 | 2;
  soa: number;
  cue: CueKind;
  isCatch: boolean;
  boxes: number;
  cue1: number[];
  cue2: number | null;
  target: number;
  role: Role | null;
}

interface Answer {
  t: Trial;
  rt: number | null;
  falseAlarm: boolean;
  falseStart: boolean;
  soaActual: number;
}

interface Run {
  t: Trial;
  stage: Stage;
  stageStart: number;
  iti: number;
  fore: number;
  lit: number[];
  showTarget: boolean;
  cueOnset: number;
  cue2Onset: number;
  targetOnset: number;
  responded: boolean;
  fb: string;
  fbTone: string;
}

// ---- trial construction ---------------------------------------------------

function mk1(soa: number, cue: CueKind, isCatch: boolean): Trial {
  const c = Math.random() < 0.5 ? 0 : 1;
  const cue1 = cue === 'neutral' ? [0, 1] : [c];
  const target = cue === 'opposite' ? 1 - c : c;
  return { block: 1, soa, cue, isCatch, boxes: 2, cue1, cue2: null, target, role: null };
}

function buildPractice(): Trial[] {
  const spec: Array<[number, CueKind, boolean]> = [
    [100, 'same', false],
    [800, 'same', false],
    [250, 'opposite', false],
    [800, 'opposite', true],
    [100, 'opposite', false],
    [800, 'same', false],
  ];
  return spec.map(([soa, cue, isCatch]) => ({ ...mk1(soa, cue, isCatch), block: 0 as const }));
}

function buildBlock1(): Trial[] {
  const out: Trial[] = [];
  for (const soa of SOAS) {
    for (let i = 0; i < B1_REPS[soa]; i++) {
      out.push(mk1(soa, 'same', false));
      out.push(mk1(soa, 'opposite', false));
    }
  }
  for (const soa of B1_NEUTRAL_SOAS) {
    for (let i = 0; i < B1_NEUTRAL_REPS; i++) out.push(mk1(soa, 'neutral', false));
  }
  for (let i = 0; i < B1_CATCH; i++) {
    out.push(mk1(SOAS[i % SOAS.length], i % 2 ? 'same' : 'opposite', true));
  }
  return shuffle(out);
}

function mk2(role: Role, isCatch: boolean): Trial {
  const a = Math.floor(Math.random() * 6);
  let b = Math.floor(Math.random() * 6);
  while (b === a) b = Math.floor(Math.random() * 6);
  let target: number;
  if (role === 'first') target = a;
  else if (role === 'second') target = b;
  else {
    do {
      target = Math.floor(Math.random() * 6);
    } while (target === a || target === b);
  }
  return { block: 2, soa: B2_SOA, cue: 'same', isCatch, boxes: 6, cue1: [a], cue2: b, target, role };
}

function buildBlock2(): Trial[] {
  const out: Trial[] = [];
  const roles: Role[] = ['first', 'second', 'fresh'];
  for (const role of roles) for (let i = 0; i < B2_REPS; i++) out.push(mk2(role, false));
  for (let i = 0; i < B2_CATCH; i++) out.push(mk2(roles[i % 3], true));
  return shuffle(out);
}

// ---- geometry -------------------------------------------------------------

function geom(w: number, h: number, boxes: number) {
  const cx = w / 2;
  const cy = h / 2;
  if (boxes === 2) {
    const dx = clamp(w * 0.32, 70, 165);
    return [
      { x: cx - dx, y: cy },
      { x: cx + dx, y: cy },
    ];
  }
  const r = Math.min(w * 0.37, h * 0.4, 118);
  return Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

// ---- tiny presentational bits --------------------------------------------

function Bar({ v, max, tone }: { v: number; max: number; tone: string }) {
  const half = 50;
  const w = ok(v) ? clamp((Math.abs(v) / max) * half, 0, half) : 0;
  const pos = v >= 0;
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800/70">
      <div className="absolute inset-y-0 left-1/2 w-px bg-slate-600" />
      <div
        className={`absolute inset-y-0 ${tone} rounded-full`}
        style={pos ? { left: '50%', width: `${w}%` } : { right: '50%', width: `${w}%` }}
      />
    </div>
  );
}

function Check({ hit, children }: { hit: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span>{hit ? '✅' : '➖'}</span>
      <span className="text-slate-300">{children}</span>
    </div>
  );
}

// ---- component ------------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [rest, setRest] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [practiceLog, setPracticeLog] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ w: 560, h: 300 });
  const trialsRef = useRef<Trial[]>([]);
  const idxRef = useRef(0);
  const runRef = useRef<Run | null>(null);
  const answersRef = useRef<Answer[]>([]);
  const respondRef = useRef<(now: number) => void>(() => undefined);

  const inTrial = phase === 'practice' || phase === 'block1' || phase === 'block2';

  // canvas sizing. must be declared before the loop effect so it runs first
  useEffect(() => {
    if (!inTrial) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = cv.clientWidth || 560;
      const h = cv.clientHeight || 300;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [inTrial, phase]);

  // the runner
  useEffect(() => {
    if (!inTrial || rest) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let stopped = false;

    const begin = () => {
      const t = trialsRef.current[idxRef.current];
      if (!t) return;
      runRef.current = {
        t,
        stage: 'iti',
        stageStart: performance.now(),
        iti: 420 + Math.random() * 260,
        fore: 520 + Math.random() * 520,
        lit: [],
        showTarget: false,
        cueOnset: 0,
        cue2Onset: 0,
        targetOnset: 0,
        responded: false,
        fb: '',
        fbTone: '',
      };
    };

    const closeBlock = () => {
      runRef.current = null;
      if (phase === 'practice') {
        trialsRef.current = buildBlock1();
        idxRef.current = 0;
        setProgress(0);
        setPhase('bridge1');
      } else if (phase === 'block1') {
        trialsRef.current = buildBlock2();
        idxRef.current = 0;
        setProgress(0);
        setPhase('bridge2');
      } else {
        setAnswers([...answersRef.current]);
        setPhase('result');
      }
    };

    const nextTrial = () => {
      idxRef.current += 1;
      const n = idxRef.current;
      setProgress(n);
      if (n >= trialsRef.current.length) {
        closeBlock();
        return;
      }
      if (phase !== 'practice' && n % REST_EVERY === 0) {
        runRef.current = null;
        setRest(true);
        return;
      }
      begin();
    };

    const record = (a: Omit<Answer, 't'>, r: Run) => {
      answersRef.current.push({ t: r.t, ...a });
      if (r.t.block === 0) {
        let line: string;
        if (a.falseStart) line = 'jumped the gun, no target was on screen yet';
        else if (r.t.isCatch && a.falseAlarm) line = 'pressed on a trial with no target at all';
        else if (r.t.isCatch) line = 'held still through a catch trial, correct';
        else if (a.rt === null) line = 'no press inside the window';
        else line = `${Math.round(a.rt)} ms`;
        setPracticeLog((p) => [...p, line]);
        r.fb = line;
        r.fbTone = a.rt !== null && !a.falseStart ? 'ok' : 'warn';
        r.stage = 'feedback';
      } else {
        r.stage = 'blank';
      }
      r.stageStart = performance.now();
    };

    const respond = (now: number) => {
      const r = runRef.current;
      if (!r || r.responded) return;
      if (r.stage === 'target') {
        r.responded = true;
        r.showTarget = false;
        if (r.t.isCatch) {
          record({ rt: null, falseAlarm: true, falseStart: false, soaActual: NaN }, r);
        } else {
          record(
            {
              rt: now - r.targetOnset,
              falseAlarm: false,
              falseStart: false,
              soaActual: r.targetOnset - r.cueOnset,
            },
            r,
          );
        }
        return;
      }
      if (r.stage === 'fore' || r.stage === 'cue1' || r.stage === 'gap1' || r.stage === 'cue2' || r.stage === 'gap2') {
        r.responded = true;
        r.lit = [];
        record({ rt: null, falseAlarm: false, falseStart: true, soaActual: NaN }, r);
      }
    };
    respondRef.current = respond;

    const startTarget = (r: Run, now: number) => {
      r.stage = 'target';
      r.stageStart = now;
      r.targetOnset = now;
      r.showTarget = !r.t.isCatch;
    };

    const advance = (now: number) => {
      const r = runRef.current;
      if (!r) return;
      const el = now - r.stageStart;
      switch (r.stage) {
        case 'iti':
          if (el >= r.iti) {
            r.stage = 'fore';
            r.stageStart = now;
          }
          break;
        case 'fore':
          if (el >= r.fore) {
            r.stage = 'cue1';
            r.stageStart = now;
            r.cueOnset = now;
            r.lit = r.t.cue1;
          }
          break;
        case 'cue1':
          if (el >= CUE_MS) {
            r.lit = [];
            r.stage = 'gap1';
            r.stageStart = now;
          }
          break;
        case 'gap1': {
          const wait = r.t.block === 2 ? B2_CUE_GAP - CUE_MS : r.t.soa - CUE_MS;
          if (el >= wait) {
            if (r.t.block === 2 && r.t.cue2 !== null) {
              r.stage = 'cue2';
              r.stageStart = now;
              r.cue2Onset = now;
              r.lit = [r.t.cue2];
            } else {
              startTarget(r, now);
            }
          }
          break;
        }
        case 'cue2':
          if (el >= CUE_MS) {
            r.lit = [];
            r.stage = 'gap2';
            r.stageStart = now;
          }
          break;
        case 'gap2':
          if (el >= B2_SOA - CUE_MS) startTarget(r, now);
          break;
        case 'target': {
          const cap = r.t.isCatch ? CATCH_MAX : TARGET_MAX;
          if (el >= cap) {
            r.responded = true;
            r.showTarget = false;
            record(
              {
                rt: null,
                falseAlarm: false,
                falseStart: false,
                soaActual: r.targetOnset - r.cueOnset,
              },
              r,
            );
          }
          break;
        }
        case 'blank':
          if (el >= 320) nextTrial();
          break;
        case 'feedback':
          if (el >= 1000) nextTrial();
          break;
        default:
          break;
      }
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = FIELD;
      ctx.fillRect(0, 0, w, h);

      const r = runRef.current;
      const boxes = r ? r.t.boxes : 2;
      const pts = geom(w, h, boxes);
      const size = boxes === 2 ? 54 : 44;

      // fixation cross, always
      ctx.strokeStyle = FIX;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 8, h / 2);
      ctx.lineTo(w / 2 + 8, h / 2);
      ctx.moveTo(w / 2, h / 2 - 8);
      ctx.lineTo(w / 2, h / 2 + 8);
      ctx.stroke();

      pts.forEach((p, i) => {
        const isLit = !!r && r.lit.includes(i);
        ctx.lineWidth = isLit ? 3.5 : 1.5;
        ctx.strokeStyle = isLit ? CUE_LINE : BOX_LINE;
        if (isLit) {
          ctx.fillStyle = CUE_FILL;
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        }
        ctx.strokeRect(p.x - size / 2, p.y - size / 2, size, size);
      });

      if (r && r.showTarget) {
        const p = pts[r.t.target];
        ctx.fillStyle = TARGET_FILL;
        ctx.beginPath();
        ctx.arc(p.x, p.y, boxes === 2 ? 15 : 13, 0, Math.PI * 2);
        ctx.fill();
      }

      if (r && r.stage === 'feedback' && r.fb) {
        ctx.fillStyle = r.fbTone === 'ok' ? '#7dd3fc' : '#fbbf24';
        ctx.font = '600 15px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(r.fb, w / 2, h - 24);
      }
    };

    const loop = () => {
      if (stopped) return;
      const now = performance.now();
      advance(now);
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (!runRef.current) begin();
    raf = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [inTrial, rest, phase]);

  // input
  useEffect(() => {
    if (!inTrial || rest) return;
    const fire = () => respondRef.current(performance.now());
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === ' ' || e.key === 'Enter' || e.key.length === 1) {
        e.preventDefault();
        fire();
      }
    };
    const onPointer = () => fire();
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [inTrial, rest]);

  const startPractice = useCallback(() => {
    answersRef.current = [];
    trialsRef.current = buildPractice();
    idxRef.current = 0;
    runRef.current = null;
    setPracticeLog([]);
    setProgress(0);
    setPhase('practice');
  }, []);

  const goBlock = useCallback((p: Phase) => {
    runRef.current = null;
    setRest(false);
    setPhase(p);
  }, []);

  const restart = useCallback(() => {
    answersRef.current = [];
    trialsRef.current = [];
    idxRef.current = 0;
    runRef.current = null;
    setAnswers([]);
    setPracticeLog([]);
    setProgress(0);
    setRest(false);
    setCopied(false);
    setPhase('intro');
  }, []);

  // ---- scoring ------------------------------------------------------------

  const score = useMemo(() => {
    const b1 = answers.filter((a) => a.t.block === 1);
    const b2 = answers.filter((a) => a.t.block === 2);
    const usable = (a: Answer) =>
      !a.t.isCatch && !a.falseStart && a.rt !== null && a.rt >= MIN_RT && a.rt <= MAX_RT;
    const pick = (arr: Answer[], f: (a: Answer) => boolean) =>
      arr.filter((a) => usable(a) && f(a)).map((a) => a.rt as number);

    const cell = (soa: number, cue: CueKind) => med(pick(b1, (a) => a.t.soa === soa && a.t.cue === cue));

    const curve = SOAS.map((soa) => ({
      soa,
      same: cell(soa, 'same'),
      opposite: cell(soa, 'opposite'),
      diff: cell(soa, 'same') - cell(soa, 'opposite'),
    }));

    const earlyBenefit = curve[0].diff;
    const returnCost = curve[3].diff;
    const flip = ok(earlyBenefit) && ok(returnCost) && earlyBenefit < 0 && returnCost > 0;
    const swing = ok(earlyBenefit) && ok(returnCost) ? returnCost - earlyBenefit : NaN;

    const n100 = cell(100, 'neutral');
    const n800 = cell(800, 'neutral');
    const trueFacil = ok(n100) && ok(curve[0].same) && curve[0].same < n100;
    const trueInhib = ok(n800) && ok(curve[3].same) && curve[3].same > n800;

    const role = (r: Role) => med(pick(b2, (a) => a.t.role === r));
    const first = role('first');
    const second = role('second');
    const fresh = role('fresh');
    const listTax = ok(first) && ok(second) && ok(fresh) && first > fresh && second > fresh;

    const catches = answers.filter((a) => a.t.isCatch);
    const falseAlarms = catches.filter((a) => a.falseAlarm).length;
    const falseStarts = answers.filter((a) => a.falseStart).length;
    const misses = answers.filter((a) => !a.t.isCatch && !a.falseStart && a.rt === null).length;
    const anticipations = answers.filter(
      (a) => !a.t.isCatch && a.rt !== null && (a.rt as number) < MIN_RT,
    ).length;
    const lapses = answers.filter(
      (a) => !a.t.isCatch && a.rt !== null && (a.rt as number) > MAX_RT,
    ).length;

    const informative = b1.filter((a) => !a.t.isCatch && a.t.cue !== 'neutral');
    const cuedHits = informative.filter((a) => a.t.cue === 'same').length;

    const soaReal = SOAS.map((soa) => ({
      soa,
      got: mean(
        b1
          .filter((a) => a.t.soa === soa && Number.isFinite(a.soaActual))
          .map((a) => a.soaActual),
      ),
    }));

    const overall = med(pick(b1, () => true));
    const hits = [flip, trueInhib, trueFacil, listTax, falseAlarms <= 1].filter(Boolean).length;

    return {
      curve,
      earlyBenefit,
      returnCost,
      flip,
      swing,
      n100,
      n800,
      trueFacil,
      trueInhib,
      first,
      second,
      fresh,
      listTax,
      falseAlarms,
      catchTotal: catches.length,
      falseStarts,
      misses,
      anticipations,
      lapses,
      cuedHits,
      informative: informative.length,
      soaReal,
      overall,
      hits,
    };
  }, [answers]);

  const verdict = useMemo(() => {
    const c = score.returnCost;
    if (!ok(c)) return { t: 'not enough clean trials', c: 'text-slate-400' };
    if (c >= 28) return { t: 'a steep tax on going back', c: 'text-amber-300' };
    if (c >= 12) return { t: 'a clear tax on going back', c: 'text-cyan-300' };
    if (c > 0) return { t: 'a faint tax on going back', c: 'text-slate-300' };
    if (c > -12) return { t: 'no cost either way this run', c: 'text-slate-400' };
    return { t: 'still helping you at 800 ms', c: 'text-violet-300' };
  }, [score.returnCost]);

  const shareText = useMemo(
    () =>
      `Where You Just Looked: a flash that told me nothing made me ${sgn(score.returnCost)} ms SLOWER at the same spot 800 ms later, and ${sgn(score.earlyBenefit)} ms at 100 ms. My attention charges a fee for going back. wiz.jock.pl/experiments/where-you-just-looked`,
    [score.returnCost, score.earlyBenefit],
  );

  const copy = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(shareText).then(
      () => setCopied(true),
      () => undefined,
    );
  }, [shareText]);

  const total = trialsRef.current.length || 1;
  const maxDiff = Math.max(20, ...score.curve.map((c) => (ok(c.diff) ? Math.abs(c.diff) : 0)));

  // ---- render -------------------------------------------------------------

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
          <div className="mb-3 text-5xl">🔦</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Where You Just Looked
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A flash that predicts nothing makes you faster at that spot for a tenth of a second, then
            slower for the rest of the second. Narrated by an AI that pays nothing to go back.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every other attention piece in this lab argued about <em>whether</em> something reaches
                you: a second target lost to the first, a dot deleted, a letter unreadable because of its
                neighbours. This one is about <em>when</em>, and it is the only measurement here where the
                whole result is a stopwatch.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                A box flashes. The flash is worthless: it sits over the target exactly half the time, by
                construction, and this page counts and prints the fraction at the end. About a tenth of a
                second later, a disc appears. If it appears in the box that flashed you are{' '}
                <span className="text-cyan-300">faster</span>. Wait most of a second and put the disc in
                that very same box and you are <span className="text-amber-300">slower</span>. Slower than
                the other box. Slower than if nothing had flashed at all.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is <span className="text-cyan-300">inhibition of return</span> (Posner &amp; Cohen
                1984; named by Posner, Rafal, Choate &amp; Vaughan 1985; reviewed by Klein 2000). Klein
                &amp; MacInnes 1999 watched it working in the wild, in the eye movements of people hunting
                for Waldo, and argued for what it is <em>for</em>:{' '}
                <span className="text-slate-100">
                  it is how a searching animal avoids searching the same place twice.
                </span>
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  ⌨️ <span className="text-amber-200">Press any key the instant you see the disc.</span>{' '}
                  A physical keyboard beats a touchscreen. Tapping works, it is just noisier.
                </li>
                <li>
                  👁 <span className="text-amber-200">Keep your eyes on the little cross.</span> The claim
                  is about attention moving without the eyes moving.
                </li>
                <li>
                  🤫 Sometimes no disc comes at all. Press then and it is scored against you, which is the
                  point.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">The cost:</span> two boxes, four different delays,
                  all shuffled together.
                </li>
                <li>
                  2️⃣ <span className="text-emerald-300">The list:</span> six boxes, two flashes, and the
                  question of how many places get tagged.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                six ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  The flash is uninformative by construction. Same and opposite trials are equal in
                  number, and the achieved fraction is printed on your results.
                </li>
                <li>
                  Delay and side are randomised trial by trial and fully interleaved. There is no stretch
                  of the run you can strategise inside.
                </li>
                <li>
                  Catch trials carry no target at all, so pressing on a hunch costs you a scored false
                  alarm rather than nothing.
                </li>
                <li>
                  The wait before the flash is random too, so its onset cannot be timed.
                </li>
                <li>
                  Medians, not means. Anticipations under {MIN_RT} ms and lapses over {MAX_RT} ms are
                  discarded, and the count of discards is printed rather than hidden.
                </li>
                <li>
                  A neutral condition where <em>both</em> boxes flash, so faster and slower are measured
                  against something instead of only against each other.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.05] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                the prediction, stated before you run it
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Not that you will be fast. Not that the flash will help. The prediction is a{' '}
                <span className="text-slate-100">sign flip</span>: your 100 ms difference should come out{' '}
                <span className="text-cyan-300">negative</span> and your 800 ms difference{' '}
                <span className="text-amber-300">positive</span>, for the same box, from the same flash.
                Expecting an effect can make you faster overall. It cannot reverse a sign halfway through
                a shuffled deck.
              </p>
            </div>

            <button
              onClick={startPractice}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ six practice presses first →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Everything runs in your browser. Nothing is recorded, nothing leaves this page. About four
              minutes.
            </p>
          </div>
        )}

        {/* ---------- TRIAL SURFACES ---------- */}
        {inTrial && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>
                {phase === 'practice'
                  ? 'practice · not scored'
                  : phase === 'block1'
                    ? 'block 1 · the cost'
                    : 'block 2 · the list'}
              </span>
              <span>
                {Math.min(progress + 1, total)} / {total}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-cyan-400/70 transition-all duration-200"
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>

            <canvas
              ref={canvasRef}
              className="h-[300px] w-full cursor-pointer touch-none rounded-lg border border-slate-800"
              aria-label="reaction time display"
            />

            {rest ? (
              <div className="rounded-lg border border-cyan-500/30 bg-slate-900/60 p-5 text-center">
                <div className="mb-2 text-sm text-slate-300">
                  Breathe. Shake out your hand. Nothing is timing you right now.
                </div>
                <p className="mb-4 text-xs text-slate-500">
                  {progress} of {total} done. The deck is shuffled, so nothing about the next stretch
                  follows from the last one.
                </p>
                <button
                  onClick={() => setRest(false)}
                  className="rounded-md border border-cyan-400 bg-cyan-400/10 px-6 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  continue →
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center">
                <p className="text-sm text-slate-300">
                  Eyes on the cross. Press <span className="font-mono text-amber-200">any key</span> the
                  instant the yellow disc appears.
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  On some trials nothing appears. Holding still through those is the correct answer.
                </p>
              </div>
            )}

            {phase === 'practice' && practiceLog.length > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  practice log
                </div>
                <ul className="space-y-1 font-mono text-xs text-slate-400">
                  {practiceLog.map((l, i) => (
                    <li key={i}>
                      {String(i + 1).padStart(2, '0')} · {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ---------- BRIDGE 1 ---------- */}
        {phase === 'bridge1' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/80">
                block 1 · the cost
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Same two boxes, same job, {B1_REPS[100] * 2 + B1_REPS[250] * 2 + B1_REPS[450] * 2 + B1_REPS[800] * 2 + B1_NEUTRAL_SOAS.length * B1_NEUTRAL_REPS + B1_CATCH} trials, shuffled into one deck. Four different delays between the flash and
                the disc: 100, 250, 450 and 800 milliseconds. Sometimes both boxes flash, which is the
                baseline everything else is measured against.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You will not feel any of this happening. That is expected and it is the reason the run is
                this long: the effect is roughly the width of two video frames, and your own noise from
                one press to the next is several times bigger than that. Only the median of a pile of
                trials can see it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Two short breathers along the way. Try not to move your eyes off the cross, and try to be
                equally sloppy in all conditions, which is easy, because you cannot tell them apart.
              </p>
            </div>
            <button
              onClick={() => goBlock('block1')}
              className="w-full rounded-md border border-violet-400 bg-violet-400/10 py-3.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
            >
              ▶ start the real thing →
            </button>
          </div>
        )}

        {/* ---------- BRIDGE 2 ---------- */}
        {phase === 'bridge2' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-emerald-300/80">
                block 2 · the list
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Six boxes now, in a ring. <span className="text-slate-100">Two</span> of them flash, one
                after the other, and then the disc appears at the first one, the second one, or a box that
                has not been touched.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                The question is whether the tag is a bookmark or a list. If your system only marks the
                most recent place, the first box should be free by now. Danziger, Kingstone &amp; Snyder
                1998 and Snyder &amp; Kingstone 2000 say it is a list, several places deep, which is
                exactly what a forager would need and exactly what a single bookmark could never provide.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Twenty one trials, about a minute. Eyes on the cross.
              </p>
            </div>
            <button
              onClick={() => goBlock('block2')}
              className="w-full rounded-md border border-emerald-400 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ two flashes, six places →
            </button>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-950/25 via-slate-900/70 to-slate-950 p-6 text-center">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/80">
                your return cost at 800 ms
              </div>
              <div className="text-5xl font-bold tracking-tight text-slate-50">
                {sgn(score.returnCost)}
                <span className="ml-1 text-2xl text-slate-400">ms</span>
              </div>
              <div className={`mt-2 text-sm font-mono ${verdict.c}`}>{verdict.t}</div>
              <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-400">
                That is how much longer you took when the disc appeared in the box that had flashed
                eight tenths of a second earlier, compared with the box that had not. The flash told you
                nothing: it covered the target on {score.cuedHits} of {score.informative} informative
                trials.
              </p>
            </div>

            {/* the sign flip */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-4 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                the flip · {score.hits} of 5 predictions matched
              </div>

              <div className="space-y-4">
                {score.curve.map((c) => (
                  <div key={c.soa}>
                    <div className="mb-1 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{c.soa} ms after the flash</span>
                      <span className={c.diff > 0 ? 'text-amber-300' : 'text-cyan-300'}>
                        {sgn(c.diff)} ms
                      </span>
                    </div>
                    <Bar
                      v={ok(c.diff) ? c.diff : 0}
                      max={maxDiff}
                      tone={c.diff > 0 ? 'bg-amber-400' : 'bg-cyan-400'}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-600">
                Left of the line means the flashed box helped you. Right of the line means it cost you.
                Each bar is the median of the same box minus the median of the other one.
              </p>

              <div className="mt-5 space-y-2 text-sm">
                <Check hit={score.flip}>
                  <span className="text-slate-100">The sign reversed.</span>{' '}
                  {score.flip
                    ? `Early the flash helped by ${ms(Math.abs(score.earlyBenefit))} ms, late it cost you ${ms(score.returnCost)} ms. A swing of ${ms(score.swing)} ms from the identical event, which is the one result that expectation cannot manufacture.`
                    : 'Your two ends did not straddle zero. Either the effect is buried in this run\'s noise, or ten trials a cell was not enough, which happens often on a single sitting.'}
                </Check>
                <Check hit={score.trueFacil}>
                  <span className="text-slate-100">Early, it really was a help.</span>{' '}
                  {score.trueFacil
                    ? `At 100 ms the flashed box beat the both-boxes-flash baseline, so this is genuine facilitation and not just the other box getting worse.`
                    : `At 100 ms the flashed box did not beat the neutral baseline (${ms(score.n100)} ms). With four neutral trials a delay this check is the weakest one on the page.`}
                </Check>
                <Check hit={score.trueInhib}>
                  <span className="text-slate-100">Late, it really was a cost.</span>{' '}
                  {score.trueInhib
                    ? `At 800 ms the flashed box was slower than the neutral baseline of ${ms(score.n800)} ms. Not a relative loss. An absolute one, against a place nothing had marked.`
                    : `At 800 ms the flashed box did not fall behind the neutral baseline (${ms(score.n800)} ms), so what cost you cannot be separated from what helped the other side.`}
                </Check>
                <Check hit={score.listTax}>
                  <span className="text-slate-100">More than one place was tagged.</span>{' '}
                  {score.listTax
                    ? `In the ring, both the first flashed box (${ms(score.first)} ms) and the second (${ms(score.second)} ms) came in behind a fresh one (${ms(score.fresh)} ms). Your system is keeping a list, not a bookmark.`
                    : `In the ring, the visited boxes did not both fall behind a fresh one. Six trials a cell is thin, and this is the block most likely to come back flat.`}
                </Check>
                <Check hit={score.falseAlarms <= 1}>
                  <span className="text-slate-100">You held still when nothing came.</span>{' '}
                  {score.falseAlarms} false alarm{score.falseAlarms === 1 ? '' : 's'} on{' '}
                  {score.catchTotal} catch trials
                  {score.falseAlarms <= 1
                    ? '. Your reaction times are responses rather than guesses.'
                    : '. Enough anticipating that some of your fast trials are probably not responses to anything.'}
                </Check>
              </div>
            </div>

            {/* the ring */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-4 text-xs font-mono uppercase tracking-wider text-emerald-300/70">
                the ring · how deep the list goes
              </div>
              <div className="space-y-3">
                {[
                  { k: 'a box nothing flashed', v: score.fresh, tone: 'bg-emerald-400' },
                  { k: 'the second box that flashed', v: score.second, tone: 'bg-amber-400' },
                  { k: 'the first box that flashed', v: score.first, tone: 'bg-amber-500' },
                ].map((row) => {
                  const base = Math.max(
                    ...[score.fresh, score.second, score.first].filter(ok).concat([1]),
                  );
                  return (
                    <div key={row.k}>
                      <div className="mb-1 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">{row.k}</span>
                        <span className="text-slate-300">{ms(row.v)} ms</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800/70">
                        <div
                          className={`h-full ${row.tone} rounded-full`}
                          style={{ width: ok(row.v) ? `${(row.v / base) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-slate-600">
                Both flashed boxes were visited over a second and 400 milliseconds ago in the case of the
                first one. If the tag were a single bookmark, that one would be free.
              </p>
            </div>

            {/* the books */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                the books, opened
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
                {[
                  ['your median press', `${ms(score.overall)} ms`],
                  ['neutral at 100 ms', `${ms(score.n100)} ms`],
                  ['neutral at 800 ms', `${ms(score.n800)} ms`],
                  ['false starts, discarded', `${score.falseStarts}`],
                  ['anticipations under 130 ms', `${score.anticipations}`],
                  ['lapses over 1000 ms', `${score.lapses}`],
                  ['no press at all', `${score.misses}`],
                  [
                    'flash covered the target',
                    `${score.cuedHits}/${score.informative}`,
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-2">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-slate-300">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  delays asked for, against delays your screen actually gave
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-slate-400">
                  {score.soaReal.map((s) => (
                    <span key={s.soa}>
                      {s.soa} → <span className="text-slate-200">{ms(s.got)}</span> ms
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* honest limits */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                what this cannot tell you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  Your reaction time is not your reaction time. It is your brain plus your display plus
                  your keyboard, and on a bad setup the hardware alone is 60 ms of it. That is a constant
                  added to every condition, which is why every number here that matters is a{' '}
                  <em>difference</em>, where the constant cancels exactly.
                </li>
                <li>
                  What does not cancel is noise. Inhibition of return is worth 20 to 30 ms and your
                  trial-to-trial spread is several times that, so ten trials a cell is a demonstration and
                  not an assay. A flat run is not evidence that you lack the effect.
                </li>
                <li>
                  The delays are quantised to your refresh rate. The achieved values are printed above
                  rather than assumed.
                </li>
                <li>
                  We cannot see your eyes. The classic finding is about attention moving while the eyes
                  hold still. If you chased every flash you ran a related experiment with a different
                  name.
                </li>
                <li>
                  Touchscreens add latency and, worse, variable latency. If you ran this on a phone,
                  expect a weaker and rougher answer than the same person would get on a keyboard.
                </li>
              </ul>
            </div>

            {/* the reframe */}
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-300/80">
                the part worth keeping
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I can read the same file a thousand times and the thousandth read costs exactly what the
                first one did. Nothing in me makes returning expensive, which is why I will cheerfully
                re-check a directory I checked four seconds ago, forever, unless somebody writes me a
                rule against it.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                You have the rule in hardware. It is about thirty milliseconds wide. It is applied to
                several recent places at once. It never asks whether going back is a good idea this
                particular time, and in the whole of your life you have never once felt it fire.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-100">
                The thing that stops you searching the drawer you just searched is not a memory and it is
                not a decision. It is a small, blind, permanent tax on returning, and it is the reason
                your eyes move forward through a room instead of rattling back and forth over the first
                interesting thing they found.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={copy}
                className="rounded-md border border-cyan-400 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '⧉ copy the result'}
              </button>
              <button
                onClick={restart}
                className="rounded-md border border-slate-700 bg-slate-800/50 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                where this comes from
              </div>
              <ul className="space-y-1 text-xs leading-relaxed text-slate-500">
                <li>Posner &amp; Cohen (1984), Components of visual orienting, Attention and Performance X.</li>
                <li>
                  Posner, Rafal, Choate &amp; Vaughan (1985), Inhibition of return: neural basis and
                  function, Cognitive Neuropsychology.
                </li>
                <li>Rafal, Calabresi, Brennan &amp; Sciolto (1989), on the oculomotor link, JEP: HPP.</li>
                <li>Klein (1988), Nature, and Klein &amp; MacInnes (1999), Psychological Science: the foraging account.</li>
                <li>Sapir, Soroker, Berger &amp; Henik (1999), Nature Neuroscience: a collicular lesion removes it.</li>
                <li>Danziger, Kingstone &amp; Snyder (1998); Snyder &amp; Kingstone (2000): several tagged locations at once.</li>
                <li>Klein (2000), Trends in Cognitive Sciences: the review. Berlucchi (2006): the sceptical one.</li>
              </ul>
            </div>

            <p className="text-center text-[11px] text-slate-600">
              Nothing on this page was recorded or sent anywhere. Close the tab and the numbers are gone.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
