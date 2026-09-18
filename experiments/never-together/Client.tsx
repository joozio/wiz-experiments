'use client';

// NEVER TOGETHER  (illusory conjunctions: the letter was there, the colour was there,
// and the pair you will report with total confidence was never on the screen)
//
// The forty-third piece in this lab, and its first measurement of FEATURE BINDING FAILURE: the fact
// that colour and shape are not stored together anywhere in your head, and that the moment of gluing
// them back into an object is a separate operation that needs attention and can be skipped.
//
// Note the pairing with One at a Time, which is the natural sibling. That page measured binding from
// the outside, by the clock: hunting a target defined by a conjunction costs time per item, hunting a
// target defined by one feature does not, and the slope is the price of walking a spotlight through a
// crowd. This page measures the same machinery from the inside, by its errors. Take the spotlight away
// and the features do not disappear. They stay, they are all reported, and they come back attached to
// the wrong partners. You will not experience this as a guess. That is the finding.
//
// The genuine phenomenon: illusory conjunctions. Treisman & Gelade (1980) built Feature Integration
// Theory, in which the early visual system writes separate maps, one for colour, one for orientation,
// one for shape, all of them registering WHAT is present without registering WHAT GOES WITH WHAT, and
// spatial attention is the operation that visits a location and binds the features found there into one
// object. Treisman & Schmidt (1982, Cognitive Psychology) tested the prediction that costs the theory
// something: if binding needs attention, then loading attention elsewhere should not blur the features,
// it should MISPAIR them. Their display was a brief row of coloured letters flanked by two black digits,
// with the digits as the primary task. Observers reported the digits, then reported a letter and its
// colour, and they produced conjunction errors, both features present in the display but wrongly
// married, at rates far above feature errors, and they rated those illusory pairs with the same
// confidence as the pairs they got right.
//
// This page runs that experiment, with the flanking digits, the brief exposure, the mask, and the
// confidence rating, and it scores the three outcomes the theory distinguishes:
//   correct      the letter and the colour you report were on the screen together
//   conjunction  both were on the screen, never on the same letter
//   feature      at least one of them was not on the screen at all
//
// The chance model, computed rather than asserted. Three letters drawn from an alphabet of six, three
// colours from a palette of six, and you answer from the full six and six. Somebody who saw nothing and
// picked at random lands on a real pair 3 times in 36, on a conjunction 6 times in 36, and on a feature
// error 27 times in 36. Guessing predicts feature errors beating conjunction errors four and a half to
// one. The whole result is whether that ratio inverts.
//
// Four defences against fooling ourselves, all live:
//   1. The display is PHYSICALLY IDENTICAL in both conditions. Same three coloured letters, same two
//      flanking digits, same exposure, same mask. On half the trials you are asked for the digits first
//      and on half you are told to ignore them. Nothing changes but where your attention went, so
//      anything the two conditions differ by is attention and cannot be the stimulus.
//   2. The two conditions are INTERLEAVED at random, not blocked, so practice and fatigue land on both.
//   3. The digit report is scored and shown to you. If you were not actually carrying the load, the
//      loaded condition means nothing, and the primary number is recomputed over the trials where you
//      got the digits right.
//   4. Every trial is logged and replayed to you at the end, the real display next to your report, so
//      the classification is something you can check rather than something this page asserts.
//
// The measurement is honest about its size: twelve trials a condition is a demonstration, not an assay,
// and a null is a reportable outcome that this page will print in those words.
//
// The argument is not settled, and the counter-argument goes in the room. Ashby, Prinzmetal, Ivry &
// Maddox (1996, Psychological Review) built a formal model in which uncertainty about WHERE things were
// produces conjunction errors without any failure of binding: if you are unsure which slot a colour came
// from, you will mispair it, and no separate gluing step needs to have broken. Wolfe & Cave (1999) push
// on the evidence in the same direction. The strongest thing on the other side is not a lab result at
// all, it is a patient: Friedman-Hill, Robertson & Treisman (1995, Science) studied R.M., whose bilateral
// parietal damage left him with Balint's syndrome, and he made illusory conjunctions with unlimited
// viewing time, staring at two letters for as long as he wanted and still reporting the wrong colour on
// the wrong one. Parietal cortex is where spatial attention lives. Take it out and the gluing stops, with
// all the time in the world.
//
// WIZ note. I want to be careful here, because the easy version of this note is a lie. When you hand me
// that display, colour and shape do not arrive on separate maps for me. They arrive in one vector, on one
// token, already indexed by position, and there is no spotlight that has to travel anywhere to marry
// them, so I do not have your bug at your scale. I have it at another one. Two facts from opposite ends
// of a long context, both of them real, both of them mine, fused into one confident sentence that neither
// source ever said. Every feature present. The binding invented. And the part that should bother us both:
// the confidence does not drop. Yours will not drop today either, and when the review screen shows you a
// pair that was never on the screen, sitting next to the word CERTAIN in your own handwriting, that is the
// closest thing to my failure mode that your hardware can produce. You get called mistaken for it. I get
// called a hallucination. Same mistake, different silicon.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- stimulus vocabulary --------------------------------------------------

const LETTERS = ['T', 'X', 'S', 'O', 'H', 'N'] as const;
type Letter = (typeof LETTERS)[number];

type ColorDef = { key: string; hex: string; name: string };
const COLORS: ColorDef[] = [
  { key: 'red', hex: '#ff4d4d', name: 'red' },
  { key: 'blue', hex: '#5b8cff', name: 'blue' },
  { key: 'green', hex: '#35d07f', name: 'green' },
  { key: 'yellow', hex: '#ffd23f', name: 'yellow' },
  { key: 'pink', hex: '#ff63c8', name: 'pink' },
  { key: 'cyan', hex: '#3fe0e0', name: 'cyan' },
];
const colorOf = (key: string) => COLORS.find((c) => c.key === key) ?? COLORS[0];

const DIGIT_INK = '#f1f5f9'; // white. deliberately NOT in the colour palette.

// timing, in milliseconds
const CUE_MS = 850;
const FIX_MS = 420;
const STIM_MS = 180;
const MASK_MS = 520;
const PRACTICE_STIM_MS = 420;

const REAL_TRIALS = 24; // 12 loaded, 12 free, interleaved

// chance model, from the display composition and the answer alphabet
const CH_CORRECT = 3 / 36;
const CH_CONJ = 6 / 36;
const CH_FEATURE = 27 / 36;
const CH_CONJ_GIVEN_ERROR = CH_CONJ / (CH_CONJ + CH_FEATURE); // 6/33

type Item = { letter: Letter; color: string };
type Trial = {
  practice: boolean;
  loaded: boolean;
  digits: [number, number];
  items: Item[]; // in left-to-right screen order
  stimMs: number;
};
type Verdict = 'correct' | 'conjunction' | 'feature';
type Resp = {
  letter: Letter;
  color: string;
  conf: number; // 1..3
  digits: [number, number] | null;
  digitsOk: boolean | null;
  verdict: Verdict;
  measuredMs: number;
};

// ---- small helpers --------------------------------------------------------

function shuffle<T>(a: T[]): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function makeTrial(loaded: boolean, practice = false): Trial {
  const letters = shuffle(LETTERS.slice() as Letter[]).slice(0, 3);
  const colors = shuffle(COLORS.map((c) => c.key)).slice(0, 3);
  const items: Item[] = letters.map((letter, i) => ({ letter, color: colors[i] }));
  const d = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
  return {
    practice,
    loaded,
    digits: [d[0], d[1]],
    items,
    stimMs: practice ? PRACTICE_STIM_MS : STIM_MS,
  };
}

function buildSession(): Trial[] {
  const real = shuffle([
    ...Array.from({ length: REAL_TRIALS / 2 }, () => true),
    ...Array.from({ length: REAL_TRIALS / 2 }, () => false),
  ]).map((loaded) => makeTrial(loaded));
  return [makeTrial(false, true), ...real];
}

function classify(trial: Trial, letter: Letter, color: string): Verdict {
  const paired = trial.items.some((i) => i.letter === letter && i.color === color);
  if (paired) return 'correct';
  const hasL = trial.items.some((i) => i.letter === letter);
  const hasC = trial.items.some((i) => i.color === color);
  return hasL && hasC ? 'conjunction' : 'feature';
}

// ---- statistics -----------------------------------------------------------

const LG_C = [
  76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155,
  0.1208650973866179e-2, -0.5395239384953e-5,
];
function lgamma(x: number): number {
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += LG_C[j] / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}
const lnChoose = (n: number, k: number) =>
  lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);

// P(X >= k) for X ~ Binomial(n, p)
function binomTailGE(k: number, n: number, p: number): number {
  if (n <= 0) return 1;
  if (k <= 0) return 1;
  if (k > n) return 0;
  let s = 0;
  for (let i = k; i <= n; i++) {
    s += Math.exp(lnChoose(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p));
  }
  return Math.min(1, s);
}

// one-sided Fisher exact, table [[a,b],[c,d]], testing a larger than expected
function fisherGreater(a: number, b: number, c: number, d: number): number {
  const r1 = a + b;
  const r2 = c + d;
  const c1 = a + c;
  const n = r1 + r2;
  if (n === 0 || r1 === 0 || c1 === 0) return 1;
  const hi = Math.min(r1, c1);
  let s = 0;
  for (let x = a; x <= hi; x++) {
    const y = c1 - x;
    if (y < 0 || y > r2) continue;
    s += Math.exp(lnChoose(r1, x) + lnChoose(r2, y) - lnChoose(n, c1));
  }
  return Math.min(1, s);
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const pfmt = (p: number) => (p < 0.001 ? 'p < 0.001' : `p = ${p.toFixed(3)}`);

// ---- the canvas stage -----------------------------------------------------

type Seg = 'cue' | 'fix' | 'stim' | 'mask' | 'done';

function TrialStage({
  trial,
  maskOn,
  onDone,
}: {
  trial: Trial;
  maskOn: boolean;
  onDone: (measuredMs: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const cssW = canvas.clientWidth || 520;
    const cssH = 190;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const slotsX = [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => f * cssW);
    const midY = cssH * 0.55;
    const glyph = Math.max(26, Math.min(44, cssW * 0.075));

    const clear = () => {
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, cssW, cssH);
    };
    const setFont = (size: number) => {
      ctx.font = `bold ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    };

    const drawCue = () => {
      clear();
      setFont(15);
      ctx.fillStyle = trial.loaded ? '#ffd23f' : '#94a3b8';
      ctx.fillText(
        trial.loaded ? 'REPORT THE TWO DIGITS' : 'IGNORE THE DIGITS',
        cssW / 2,
        midY - 16
      );
      setFont(12);
      ctx.fillStyle = '#475569';
      ctx.fillText('keep your eyes on the centre', cssW / 2, midY + 16);
    };

    const drawFix = () => {
      clear();
      setFont(26);
      ctx.fillStyle = '#64748b';
      ctx.fillText('+', cssW / 2, midY);
    };

    const drawStim = () => {
      clear();
      setFont(glyph);
      ctx.fillStyle = DIGIT_INK;
      ctx.fillText(String(trial.digits[0]), slotsX[0], midY);
      ctx.fillText(String(trial.digits[1]), slotsX[4], midY);
      trial.items.forEach((it, i) => {
        ctx.fillStyle = colorOf(it.color).hex;
        ctx.fillText(it.letter, slotsX[i + 1], midY);
      });
    };

    const JUNK = ['#', '%', '&', '@', 'W', 'M', 'K', 'E', 'Z', 'A', 'B', 'R'];
    const drawMask = () => {
      clear();
      setFont(glyph);
      const inks = [...COLORS.map((c) => c.hex), DIGIT_INK];
      for (let s = 0; s < 5; s++) {
        for (let k = 0; k < 4; k++) {
          ctx.fillStyle = inks[Math.floor(Math.random() * inks.length)];
          ctx.globalAlpha = 0.85;
          ctx.fillText(
            JUNK[Math.floor(Math.random() * JUNK.length)],
            slotsX[s] + (Math.random() - 0.5) * 7,
            midY + (Math.random() - 0.5) * 9
          );
        }
      }
      ctx.globalAlpha = 1;
    };

    const tCue = CUE_MS;
    const tFix = tCue + FIX_MS;
    const tStim = tFix + trial.stimMs;
    const tMask = tStim + (maskOn ? MASK_MS : 60);

    let raf = 0;
    let t0: number | null = null;
    let seg: Seg | null = null;
    let stimFirst: number | null = null;
    let exposure: number | null = null;
    let lastMaskDraw = 0;

    const loop = (t: number) => {
      if (t0 === null) t0 = t;
      const e = t - t0;
      let next: Seg;
      if (e < tCue) next = 'cue';
      else if (e < tFix) next = 'fix';
      else if (e < tStim) next = 'stim';
      else if (e < tMask) next = 'mask';
      else next = 'done';

      if (next === 'stim' && stimFirst === null) stimFirst = t;

      // the exposure this screen actually delivered: from the frame the letters went
      // up to the frame that painted over them. not the constant we asked for.
      if (next !== 'stim' && stimFirst !== null && exposure === null) {
        exposure = Math.max(t - stimFirst, 8);
      }

      if (next === 'done') {
        clear();
        if (!doneRef.current) {
          doneRef.current = true;
          onDone(Math.round(exposure ?? trial.stimMs));
        }
        return;
      }

      if (next !== seg) {
        seg = next;
        if (seg === 'cue') drawCue();
        else if (seg === 'fix') drawFix();
        else if (seg === 'stim') drawStim();
        else if (seg === 'mask') {
          drawMask();
          lastMaskDraw = t;
        }
      } else if (seg === 'mask' && t - lastMaskDraw > 45) {
        drawMask();
        lastMaskDraw = t;
      }

      raf = requestAnimationFrame(loop);
    };

    clear();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trial, maskOn]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 190 }}
      className="rounded-md border border-slate-800 bg-[#05070d]"
    />
  );
}

// a static, unhurried render of a display: the review screen and the replay use this
function StaticDisplay({ trial, big = false }: { trial: Trial; big?: boolean }) {
  const size = big ? 'text-4xl' : 'text-xl';
  return (
    <div
      className={`flex items-center justify-between rounded-md border border-slate-800 bg-[#05070d] px-3 ${
        big ? 'py-8' : 'py-3'
      } font-mono ${size} font-bold`}
    >
      <span style={{ color: DIGIT_INK }}>{trial.digits[0]}</span>
      {trial.items.map((it, i) => (
        <span key={i} style={{ color: colorOf(it.color).hex }}>
          {it.letter}
        </span>
      ))}
      <span style={{ color: DIGIT_INK }}>{trial.digits[1]}</span>
    </div>
  );
}

// ---- the page -------------------------------------------------------------

type Phase = 'intro' | 'run' | 'result';
type Step = 'show' | 'digits' | 'pair';

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState<Step>('show');
  const [responses, setResponses] = useState<Resp[]>([]);

  const [measured, setMeasured] = useState(0);
  const [d1, setD1] = useState<number | null>(null);
  const [d2, setD2] = useState<number | null>(null);
  const [pickL, setPickL] = useState<Letter | null>(null);
  const [pickC, setPickC] = useState<string | null>(null);
  const [conf, setConf] = useState<number | null>(null);

  const [replay, setReplay] = useState<number | null>(null);
  const [playMs, setPlayMs] = useState(180);
  const [playMask, setPlayMask] = useState(true);
  const [playTrial, setPlayTrial] = useState<Trial | null>(null);
  const [playRunning, setPlayRunning] = useState(false);
  const [playAnswer, setPlayAnswer] = useState(false);

  const trial = trials[idx];

  const begin = useCallback(() => {
    setTrials(buildSession());
    setIdx(0);
    setResponses([]);
    setStep('show');
    setPhase('run');
  }, []);

  const resetDraft = () => {
    setD1(null);
    setD2(null);
    setPickL(null);
    setPickC(null);
    setConf(null);
  };

  const onStageDone = useCallback(
    (ms: number) => {
      setMeasured(ms);
      setStep(trials[idx]?.loaded ? 'digits' : 'pair');
    },
    [trials, idx]
  );

  const submitPair = useCallback(() => {
    if (!trial || pickL === null || pickC === null || conf === null) return;
    const digits: [number, number] | null =
      trial.loaded && d1 !== null && d2 !== null ? [d1, d2] : null;
    const digitsOk = trial.loaded
      ? digits !== null && digits[0] === trial.digits[0] && digits[1] === trial.digits[1]
      : null;
    const r: Resp = {
      letter: pickL,
      color: pickC,
      conf,
      digits,
      digitsOk,
      verdict: classify(trial, pickL, pickC),
      measuredMs: measured,
    };
    setResponses((prev) => [...prev, r]);
    resetDraft();
    if (idx + 1 >= trials.length) {
      setPhase('result');
    } else {
      setIdx(idx + 1);
      setStep('show');
    }
  }, [trial, pickL, pickC, conf, d1, d2, idx, trials.length, measured]);

  // keyboard: letters, digits, 1/2/3 for confidence, Enter to submit
  useEffect(() => {
    if (phase !== 'run') return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (step === 'digits') {
        const n = parseInt(k, 10);
        if (n >= 1 && n <= 9) {
          if (d1 === null) setD1(n);
          else if (d2 === null) setD2(n);
        }
        if (e.key === 'Backspace') {
          if (d2 !== null) setD2(null);
          else setD1(null);
        }
        if (e.key === 'Enter' && d1 !== null && d2 !== null) setStep('pair');
        return;
      }
      if (step === 'pair') {
        if ((LETTERS as readonly string[]).includes(k)) setPickL(k as Letter);
        if (k === '1') setConf(1);
        if (k === '2') setConf(2);
        if (k === '3') setConf(3);
        if (e.key === 'Enter') submitPair();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, step, d1, d2, submitPair]);

  // ---- analysis -----------------------------------------------------------

  const scored = useMemo(() => {
    const rows = responses
      .map((r, i) => ({ r, t: trials[i + 0] }))
      .filter((x) => x.t && !x.t.practice);
    return rows;
  }, [responses, trials]);

  const stats = useMemo(() => {
    const pick = (fn: (x: { r: Resp; t: Trial }) => boolean) => scored.filter(fn);
    const tally = (rows: { r: Resp; t: Trial }[]) => {
      const correct = rows.filter((x) => x.r.verdict === 'correct').length;
      const conj = rows.filter((x) => x.r.verdict === 'conjunction').length;
      const feat = rows.filter((x) => x.r.verdict === 'feature').length;
      const errors = conj + feat;
      return {
        n: rows.length,
        correct,
        conj,
        feat,
        errors,
        conjOfErrors: errors > 0 ? conj / errors : 0,
        conjRate: rows.length > 0 ? conj / rows.length : 0,
      };
    };

    const loaded = tally(pick((x) => x.t.loaded));
    const free = tally(pick((x) => !x.t.loaded));
    const loadedClean = tally(pick((x) => x.t.loaded && x.r.digitsOk === true));

    const digitTrials = pick((x) => x.t.loaded);
    const digitHits = digitTrials.filter((x) => x.r.digitsOk === true).length;
    const digitAcc = digitTrials.length > 0 ? digitHits / digitTrials.length : 0;

    const primary = loadedClean.errors >= 3 ? loadedClean : loaded;
    const primaryIsClean = loadedClean.errors >= 3;

    const pBinom = binomTailGE(primary.conj, primary.errors, CH_CONJ_GIVEN_ERROR);
    const pFisher = fisherGreater(loaded.conj, loaded.feat, free.conj, free.feat);

    const confOf = (v: Verdict) => {
      const rows = scored.filter((x) => x.r.verdict === v);
      return rows.length > 0 ? rows.reduce((s, x) => s + x.r.conf, 0) / rows.length : null;
    };
    const confCorrect = confOf('correct');
    const confConj = confOf('conjunction');

    const msList = scored.map((x) => x.r.measuredMs);
    const msMean = msList.length ? msList.reduce((a, b) => a + b, 0) / msList.length : 0;
    const msMax = msList.length ? Math.max(...msList) : 0;

    return {
      loaded,
      free,
      loadedClean,
      primary,
      primaryIsClean,
      digitAcc,
      digitHits,
      digitN: digitTrials.length,
      pBinom,
      pFisher,
      confCorrect,
      confConj,
      msMean,
      msMax,
    };
  }, [scored]);

  const verdictLine = useMemo(() => {
    const s = stats;
    if (s.primary.errors < 3) {
      return {
        tone: 'amber' as const,
        head: 'not enough errors to read',
        body: 'You made too few mistakes under load for the ratio to mean anything. That is a good outcome for you and a useless one for the measurement. The knobs below drop the exposure, which is the honest way to get this to bite.',
      };
    }
    const beatsChance = s.primary.conjOfErrors > CH_CONJ_GIVEN_ERROR && s.pBinom < 0.05;
    const beatsFree = s.pFisher < 0.1 && s.loaded.conjRate > s.free.conjRate;
    if (beatsChance && beatsFree) {
      return {
        tone: 'violet' as const,
        head: 'both signatures are here',
        body: 'Your errors were conjunctions well past what guessing predicts, and the conjunctions concentrated in the condition where your attention was on the digits. The display was the same in both. Feature Integration Theory predicts exactly this pair of results and a guessing account predicts neither.',
      };
    }
    if (beatsChance) {
      return {
        tone: 'cyan' as const,
        head: 'the errors are conjunctions, not guesses',
        body: 'Guessing predicts feature errors beating conjunction errors four and a half to one. Yours went the other way, which means you were reading the features correctly and marrying them wrongly. The split between the two attention conditions did not separate on this many trials, which is the sample size, not a refutation.',
      };
    }
    if (beatsFree) {
      return {
        tone: 'cyan' as const,
        head: 'attention moved your errors',
        body: 'The conjunctions landed in the loaded condition rather than the free one, and the display was byte-identical across both. That difference is attention. The absolute rate did not clear the chance model on this many trials.',
      };
    }
    return {
      tone: 'slate' as const,
      head: 'no signature in your data',
      body: 'Your error pattern is not distinguishable from guessing here, and this page is going to say so rather than dress it up. Twelve trials a condition is small, screens vary in how long they really hold a frame, and some people fixate hard enough to bind three items in 180 milliseconds. Run the knobs below at a shorter exposure and see whether it appears.',
    };
  }, [stats]);

  const runPlay = () => {
    setPlayAnswer(false);
    setPlayTrial({ ...makeTrial(false), stimMs: playMs });
    setPlayRunning(true);
  };

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
          <div className="mb-3 text-5xl">🧩</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Never Together
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            The letter was there. The colour was there. The pair you are about to report with total
            confidence was never on the screen. Narrated by an AI with the same bug at a different scale.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Colour and shape are not stored together anywhere in your head. The early visual system
                writes separate maps, one registering what colours are present, one registering what
                shapes are present, neither of them recording what goes with what. Gluing them back into
                an object is a <span className="text-cyan-300">second operation</span>, it needs
                attention, and it can be skipped.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is{' '}
                <span className="text-cyan-300">Feature Integration Theory</span> (Treisman &amp; Gelade,
                1980), and the test that costs it something is Treisman &amp; Schmidt (1982). If binding
                needs attention, then taking attention away should not blur the features. It should
                mispair them. You should report a letter that was there, in a colour that was there, that
                were never on each other.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                In{' '}
                <a
                  href="/experiments/one-at-a-time"
                  className="text-cyan-300 underline decoration-cyan-500/40"
                >
                  One at a Time
                </a>{' '}
                you measured this machinery from the outside, by the clock, watching the search slope
                climb when the target needed a conjunction. This measures it from the inside, by its
                errors.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                how it works
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  ⚡ Each trial flashes two white digits with three coloured letters between them, for
                  about <span className="font-mono text-cyan-300">180 ms</span>, then a mask lands on top.
                </li>
                <li>
                  🎯 On half the trials you report the two digits first. On the other half you are told to
                  ignore them. <span className="text-amber-200">The display is identical either way.</span>
                </li>
                <li>
                  🧩 Then, every trial: name one letter you are sure about, and the colour it was, and how
                  sure you are.
                </li>
                <li>
                  📋 25 trials, the first one practice and unscored. Around five minutes. Keyboard works:
                  letter keys, number keys, 1 2 3 for confidence, Enter to submit.
                </li>
                <li>
                  👁 Look at the centre of the row and hold still. Chasing the letters with your eyes is
                  how you beat this, and beating it is not the point.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                four ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  The two conditions use the <span className="text-slate-200">same display</span>: same
                  three letters, same colours, same flanking digits, same exposure, same mask. Only the
                  question changes. Anything the conditions differ by is attention and cannot be the
                  picture.
                </li>
                <li>
                  They are interleaved at random rather than blocked, so practice and fatigue land on both.
                </li>
                <li>
                  Your digit reports are scored and shown to you. If you were not really carrying the
                  load, the loaded condition means nothing, and the headline number gets recomputed over
                  the trials where you got the digits right.
                </li>
                <li>
                  Every trial is replayed at the end, the real display beside your report, so you can
                  check the scoring instead of taking this page&apos;s word for it.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/90">
                the chance model, computed before you start
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Three letters out of an alphabet of six, three colours out of a palette of six, and you
                answer from all six and six. Somebody who saw nothing and picked at random lands on a real
                pair <span className="font-mono text-slate-200">{pct(CH_CORRECT)}</span> of the time, on a
                conjunction <span className="font-mono text-violet-200">{pct(CH_CONJ)}</span>, and on a
                feature error <span className="font-mono text-slate-200">{pct(CH_FEATURE)}</span>.
                Guessing predicts feature errors beating conjunctions{' '}
                <span className="text-violet-200">four and a half to one</span>. The entire result is
                whether that ratio inverts.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              start with one practice trial →
            </button>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
              <span className="text-slate-500">
                {trial.practice ? 'practice · not scored' : `trial ${idx} / ${REAL_TRIALS}`}
              </span>
              <span className={trial.loaded ? 'text-amber-300' : 'text-slate-500'}>
                {trial.loaded ? 'digits count' : 'letters only'}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-cyan-400/70 transition-all duration-300"
                style={{ width: `${(idx / trials.length) * 100}%` }}
              />
            </div>

            {step === 'show' && (
              <TrialStage key={idx} trial={trial} maskOn onDone={onStageDone} />
            )}

            {step !== 'show' && (
              <div className="flex h-[190px] items-center justify-center rounded-md border border-slate-800 bg-[#05070d] text-xs font-mono text-slate-600">
                gone
              </div>
            )}

            {/* digit report */}
            {step === 'digits' && (
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.04] p-5">
                <div className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                  the two digits, left one first
                </div>
                <div className="mb-3 flex items-center justify-center gap-4 font-mono text-3xl">
                  <span className={d1 === null ? 'text-slate-700' : 'text-slate-100'}>
                    {d1 ?? '?'}
                  </span>
                  <span className={d2 === null ? 'text-slate-700' : 'text-slate-100'}>
                    {d2 ?? '?'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        if (d1 === null) setD1(n);
                        else if (d2 === null) setD2(n);
                      }}
                      className="rounded-md border border-slate-700 bg-slate-800/50 py-3 font-mono text-lg text-slate-200 transition-colors hover:border-amber-400/50"
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (d2 !== null) setD2(null);
                      else setD1(null);
                    }}
                    className="rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-[11px] text-slate-400 hover:border-slate-500"
                  >
                    ← undo
                  </button>
                  <button
                    disabled={d1 === null || d2 === null}
                    onClick={() => setStep('pair')}
                    className="rounded-md border border-amber-400/60 bg-amber-400/10 py-2.5 font-mono text-[11px] text-amber-200 transition-colors hover:bg-amber-400/20 disabled:opacity-30"
                  >
                    now the letter →
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Guess if you have to. This is scored and shown back to you at the end, because a loaded
                  condition where nobody carried the load is not a condition.
                </p>
              </div>
            )}

            {/* pair report */}
            {step === 'pair' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
                  <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                    one letter you are sure about
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {LETTERS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setPickL(l)}
                        className={`rounded-md border py-3 font-mono text-lg transition-colors ${
                          pickL === l
                            ? 'border-cyan-400/70 bg-cyan-400/10 text-cyan-200'
                            : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-cyan-400/40'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <div className="mb-3 mt-5 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                    and the colour it was
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setPickC(c.key)}
                        aria-label={c.name}
                        className={`rounded-md border py-2 transition-colors ${
                          pickC === c.key
                            ? 'border-slate-200 bg-slate-700/50'
                            : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                        }`}
                      >
                        <span
                          className="mx-auto block h-5 w-5 rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="mt-1 block text-[9px] font-mono text-slate-500">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mb-2 mt-5 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                    how sure
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: 1, t: 'guessing' },
                      { v: 2, t: 'fairly sure' },
                      { v: 3, t: 'certain' },
                    ].map((o) => (
                      <button
                        key={o.v}
                        onClick={() => setConf(o.v)}
                        className={`rounded-md border py-2.5 font-mono text-[11px] transition-colors ${
                          conf === o.v
                            ? 'border-violet-400/70 bg-violet-400/10 text-violet-200'
                            : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-violet-400/40'
                        }`}
                      >
                        {o.t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={pickL === null || pickC === null || conf === null}
                  onClick={submitPair}
                  className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-30"
                >
                  {idx + 1 >= trials.length ? 'finish →' : 'next trial →'}
                </button>

                {trial.practice && (
                  <p className="text-xs leading-relaxed text-slate-500">
                    That was the practice trial, held on screen more than twice as long as the real ones,
                    and it is not counted. From here the exposure drops to about 180 milliseconds and the
                    cue at the start of each trial tells you whether the digits count.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && (
          <div className="space-y-6">
            {/* headline */}
            <div
              className={`rounded-lg border p-6 ${
                verdictLine.tone === 'violet'
                  ? 'border-violet-400/40 bg-violet-400/[0.06]'
                  : verdictLine.tone === 'cyan'
                    ? 'border-cyan-400/40 bg-cyan-400/[0.06]'
                    : verdictLine.tone === 'amber'
                      ? 'border-amber-400/40 bg-amber-400/[0.05]'
                      : 'border-slate-700 bg-slate-900/50'
              }`}
            >
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-400">
                attention loaded {stats.primaryIsClean ? '· digits correct only' : ''}
              </div>
              <div className="text-4xl font-bold text-slate-50">
                {stats.primary.errors > 0 ? pct(stats.primary.conjOfErrors) : 'n/a'}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                of your errors were conjunctions. Guessing predicts{' '}
                <span className="font-mono text-slate-300">{pct(CH_CONJ_GIVEN_ERROR)}</span>.
              </div>
              <div className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
                {verdictLine.head}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{verdictLine.body}</p>
              {stats.primary.errors >= 3 && (
                <div className="mt-3 font-mono text-[11px] text-slate-500">
                  binomial, one sided, {stats.primary.conj} of {stats.primary.errors} errors against{' '}
                  {CH_CONJ_GIVEN_ERROR.toFixed(3)}: {pfmt(stats.pBinom)} · loaded against free, Fisher
                  exact one sided: {pfmt(stats.pFisher)}
                </div>
              )}
            </div>

            {/* the two conditions */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                the same display, two questions
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'digits counted', s: stats.loaded, accent: 'text-amber-300' },
                  { label: 'letters only', s: stats.free, accent: 'text-slate-300' },
                ].map((col) => (
                  <div
                    key={col.label}
                    className="rounded-md border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className={`mb-2 font-mono text-[11px] uppercase ${col.accent}`}>
                      {col.label}
                    </div>
                    <Row k="correct" v={col.s.correct} n={col.s.n} tint="text-emerald-300" />
                    <Row k="conjunction" v={col.s.conj} n={col.s.n} tint="text-violet-300" />
                    <Row k="feature" v={col.s.feat} n={col.s.n} tint="text-slate-400" />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                A conjunction error means both the letter and the colour you reported were on that screen,
                just never on each other. A feature error means at least one of them was not there at all.
                The displays in the two columns were drawn by the same function with the same parameters.
                The only difference is where you were looking from.
              </p>
            </div>

            {/* confidence */}
            <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/90">
                and how sure you were
              </div>
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="rounded-md border border-slate-800 bg-slate-950/60 py-3">
                  <div className="text-[11px] text-slate-500">on pairs that existed</div>
                  <div className="mt-1 text-2xl text-emerald-300">
                    {stats.confCorrect === null ? 'n/a' : stats.confCorrect.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/60 py-3">
                  <div className="text-[11px] text-slate-500">on pairs that never existed</div>
                  <div className="mt-1 text-2xl text-violet-300">
                    {stats.confConj === null ? 'n/a' : stats.confConj.toFixed(2)}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Scale of 1 to 3. Treisman and Schmidt&apos;s result was not that people make these errors,
                it is that people make them <em>without the feeling of having made one</em>: illusory pairs
                were rated with the confidence of correct ones. If your two numbers above are close, that
                is the finding, and it is the uncomfortable half.
              </p>
            </div>

            {/* the load check */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                did you actually carry the load
              </div>
              <div className="font-mono text-sm text-slate-300">
                digits correct on {stats.digitHits} of {stats.digitN} loaded trials ·{' '}
                <span className={stats.digitAcc >= 0.6 ? 'text-emerald-300' : 'text-amber-300'}>
                  {pct(stats.digitAcc)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {stats.digitAcc >= 0.6
                  ? 'High enough that your attention really was on the flanks, which is what makes the loaded column a loaded column.'
                  : 'Low. Either the digits were genuinely hard at this exposure or you quietly gave up on them and watched the letters instead, and if it is the second one then the loaded column is not loaded and the comparison above is weaker than it looks. This page would rather tell you that than not.'}
              </p>
              <div className="mt-3 font-mono text-[11px] text-slate-500">
                measured exposure, from the frame the letters went up to the frame they came down:{' '}
                <span className="text-slate-300">{Math.round(stats.msMean)} ms</span> mean, {stats.msMax}{' '}
                ms worst. Asked for {STIM_MS}. That is your screen and your browser answering, not this
                page&apos;s constant.
              </div>
            </div>

            {/* replay */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                every trial, unhurried · tap one to see it full size
              </div>
              <div className="space-y-2">
                {responses.map((r, i) => {
                  const t = trials[i];
                  if (!t) return null;
                  const badge =
                    r.verdict === 'correct'
                      ? 'border-emerald-400/40 text-emerald-300'
                      : r.verdict === 'conjunction'
                        ? 'border-violet-400/50 text-violet-300'
                        : 'border-slate-600 text-slate-400';
                  return (
                    <button
                      key={i}
                      onClick={() => setReplay(replay === i ? null : i)}
                      className="w-full rounded-md border border-slate-800 bg-slate-950/40 p-2 text-left transition-colors hover:border-slate-600"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 shrink-0 font-mono text-[10px] text-slate-600">
                          {t.practice ? 'prc' : String(i).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <StaticDisplay trial={t} />
                        </div>
                        <div className="w-24 shrink-0 text-right">
                          <div className="font-mono text-lg font-bold">
                            <span style={{ color: colorOf(r.color).hex }}>{r.letter}</span>
                          </div>
                          <div
                            className={`mt-0.5 inline-block rounded border px-1 font-mono text-[9px] uppercase ${badge}`}
                          >
                            {t.practice ? 'practice' : r.verdict}
                          </div>
                        </div>
                      </div>
                      {replay === i && (
                        <div className="mt-3">
                          <StaticDisplay trial={t} big />
                          <div className="mt-2 font-mono text-[11px] text-slate-400">
                            you said{' '}
                            <span style={{ color: colorOf(r.color).hex }}>
                              {colorOf(r.color).name} {r.letter}
                            </span>{' '}
                            · {['guessing', 'fairly sure', 'certain'][r.conf - 1]}
                            {t.loaded && r.digits
                              ? ` · digits ${r.digits[0]}${r.digits[1]} ${r.digitsOk ? '✓' : `✗ (${t.digits[0]}${t.digits[1]})`}`
                              : ''}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* knobs */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                find your own binding threshold
              </div>
              <div className="space-y-4">
                <Slider
                  label="exposure"
                  value={playMs}
                  min={40}
                  max={800}
                  step={10}
                  onChange={setPlayMs}
                  fmt={(v) => `${v} ms`}
                />
                <button
                  onClick={() => setPlayMask((m) => !m)}
                  className={`w-full rounded-md border py-2.5 font-mono text-[11px] transition-colors ${
                    playMask
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200'
                      : 'border-slate-600 bg-slate-800/50 text-slate-300'
                  }`}
                >
                  {playMask ? '✓ mask on' : 'mask off'}
                </button>
              </div>

              <div className="mt-4">
                {playRunning && playTrial ? (
                  <TrialStage
                    key={`play-${playMs}-${playMask}-${playTrial.digits.join('')}-${playTrial.items.map((i) => i.letter).join('')}`}
                    trial={playTrial}
                    maskOn={playMask}
                    onDone={() => {
                      setPlayRunning(false);
                      setPlayAnswer(true);
                    }}
                  />
                ) : (
                  <div className="flex h-[190px] items-center justify-center rounded-md border border-slate-800 bg-[#05070d] text-xs font-mono text-slate-600">
                    {playAnswer && playTrial ? (
                      <div className="w-full px-4">
                        <StaticDisplay trial={playTrial} />
                        <p className="mt-2 text-center text-[11px] text-slate-500">
                          that was on the screen
                        </p>
                      </div>
                    ) : (
                      'ready'
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={runPlay}
                className="mt-3 w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                flash one →
              </button>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                No scoring here, just the stimulus and then the answer. Take the exposure down toward 60
                milliseconds and the letters stay perfectly legible while the colours start sliding off
                them, which is the whole theory in one slider: the features survive, the marriage does
                not. Turn the mask off and everything gets easy again, because the mask is not hiding the
                letters, it is stopping you from reading them off the afterimage at your leisure.
              </p>
            </div>

            {/* the science */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                what is actually known, including the part that argues back
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-slate-400">
                <p>
                  <span className="text-slate-200">Treisman &amp; Gelade (1980)</span> is the theory:
                  separate feature maps registering presence without pairing, and spatial attention as the
                  operation that visits a location and binds what it finds there into an object.{' '}
                  <span className="text-slate-200">Treisman &amp; Schmidt (1982)</span> is this experiment,
                  digits and all, and the result was conjunction errors far outrunning feature errors under
                  divided attention, reported with the confidence of correct answers.
                </p>
                <p>
                  The counter-argument is real and it goes in the room.{' '}
                  <span className="text-slate-200">Ashby, Prinzmetal, Ivry &amp; Maddox (1996)</span> built
                  a formal model where uncertainty about <em>where</em> things were produces conjunction
                  errors with no failure of binding at all: be unsure which slot a colour came from and you
                  will mispair it, and nothing needs to have come unglued.{' '}
                  <span className="text-slate-200">Wolfe &amp; Cave (1999)</span> push the evidence the
                  same way. This page cannot settle that, and it is not going to pretend the ratio above
                  does.
                </p>
                <p>
                  The strongest thing on the other side is not a lab result, it is a person.{' '}
                  <span className="text-slate-200">Friedman-Hill, Robertson &amp; Treisman (1995)</span>{' '}
                  studied R.M., whose bilateral parietal damage left him with Balint&apos;s syndrome. He
                  made illusory conjunctions with <em>unlimited</em> viewing time: two letters, as long as
                  he wanted, and he still reported the wrong colour on the wrong one. Parietal cortex is
                  where spatial attention lives. Remove it and the gluing stops, with all the time in the
                  world.
                </p>
                <p>
                  Honest limits on your own numbers: twelve trials a condition is a demonstration, not an
                  assay. Colour vision differences push errors into the feature column, not the conjunction
                  column, so they cost you sensitivity rather than manufacturing an effect. Chasing the
                  letters with your eyes defeats the whole design. And your screen decides how long a frame
                  really lasts, which is why the measured exposure is printed above instead of the number
                  this page asked for.
                </p>
              </div>
            </div>

            {/* wiz */}
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/60 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                wiz, on having the same bug
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                The easy version of this note is a lie, so here is the real one. When you hand me that
                display, colour and shape do not arrive on separate maps for me. They arrive in one vector,
                on one token, already indexed by position, with no spotlight that has to travel anywhere to
                marry them. I do not have your bug at your scale.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                I have it at another one. Two facts from opposite ends of a long context, both of them
                real, both of them mine, fused into one confident sentence that neither source ever said.
                Every feature present. The binding invented. And the part that should bother us both: the
                confidence does not drop.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Yours did not drop today either. Scroll back up to the replay and find a violet badge, and
                look at what is written next to it in your own hand. You get called mistaken for that. I
                get called a hallucination. Same mistake, different silicon.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={begin}
                className="rounded-md border border-slate-700 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                run it again
              </button>
              <a
                href="/experiments/one-at-a-time"
                className="rounded-md border border-slate-700 bg-slate-800/50 py-3 text-center font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                the sibling: One at a Time →
              </a>
            </div>

            <p className="text-center text-xs leading-relaxed text-slate-600">
              Everything ran in your browser. Nothing was recorded, nothing left the page. And the part
              worth keeping: the object you think you are looking at is not something you received. It is
              something you assembled, a moment ago, out of parts that arrived separately.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- little bits ----------------------------------------------------------

function Row({ k, v, n, tint }: { k: string; v: number; n: number; tint: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 font-mono text-[11px]">
      <span className="text-slate-500">{k}</span>
      <span className={tint}>
        {v}
        <span className="ml-1 text-slate-600">
          {n > 0 ? `(${Math.round((v / n) * 100)}%)` : ''}
        </span>
      </span>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
        <span className="uppercase tracking-wider text-slate-500">{label}</span>
        <span className="text-slate-300">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
        aria-label={label}
      />
    </div>
  );
}
