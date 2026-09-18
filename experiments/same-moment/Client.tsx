'use client';

// THE SAME MOMENT  (audiovisual simultaneity: where your "now" actually sits, how wide it is,
// and the fact that it will quietly move while you are not looking)
//
// The forty-fourth piece in this lab, and its first measurement of CROSS-MODAL TEMPORAL BINDING:
// not what you perceive, and not where, but WHEN, and specifically whether two signals that arrived
// at two different sense organs at two different times get filed as one event or two.
//
// Note the position against the three nearest siblings, because the axis really is new.
//   The Extra Flash    ran hearing into vision in the domain of NUMBER: a sound changed how many
//                      flashes you saw.
//   Thrown Voice       ran vision into hearing in the domain of SPACE: a dot changed where a sound was.
//   After the Fact     stayed inside vision and showed that awareness of a moment is settled after that
//                      moment is over.
// This one is the missing cell of that table: two senses, one axis, TIME. And it goes past the others
// in the same way Thrown Voice did, by measuring the map moving. Not just where your zero is, but your
// zero being dragged, in about a minute, by nothing more than repetition.
//
// The genuine phenomena, all three of them real and all three measured here:
//
//   1. THE POINT OF SUBJECTIVE SIMULTANEITY. Light and sound leave an event together and then stop
//      being together almost immediately. Sound crawls, about a foot per millisecond. Light does not.
//      Then it reverses inside you: the ear converts pressure to spikes in under a millisecond, the
//      retina takes tens of milliseconds to turn photons into a signal worth sending. So the physical
//      lead and the neural lead point opposite ways, and the moment where the two feel welded is not
//      zero for anyone. Stone et al. (2001, Proc R Soc B) and Zampini et al. (2005) measured it and
//      found it sitting away from zero, differing from person to person, and stable within a person.
//
//   2. THE TEMPORAL BINDING WINDOW. Simultaneity is not a point, it is a band, tens to a couple of
//      hundred milliseconds wide, inside which two signals are treated as one event. Vroomen & Keetels
//      (2010, Attention Perception & Psychophysics) is the review; Stevenson & Wallace (2013) mapped
//      how much the width varies between people. It is wide enough to be the reason dubbed film works
//      at all, and its width is a real individual trait.
//
//   3. TEMPORAL RECALIBRATION. This is the part that should bother you. Fujisaki, Shimojo, Kashino &
//      Nishida (2004, Nature Neuroscience) and Vroomen, Keetels, de Gelder & Bertelson (2004, Cognitive
//      Brain Research) independently showed that after a few minutes of watching pairs offset by a
//      constant lag, the point of subjective simultaneity SHIFTS toward that lag. Not the judgement.
//      The zero itself. Your brain decides the lag is a property of the world rather than an error,
//      and edits its own alignment to make the world look punctual again.
//
// This page runs all three: a baseline block, an adaptation block, and a post block, with the standard
// top-up exposures inside the post block because the aftereffect decays within seconds of stopping.
//
// THE HONEST PROBLEM, AND WHY THIS PAGE IS BUILT THE WAY IT IS.
//
// A browser cannot know its own latency. Between the moment I schedule a click and the moment air moves
// there is a buffer, a driver, a converter, and on Bluetooth an entire codec with an encode/decode round
// trip that can be a fifth of a second. Between the moment I ask for a flash and the moment the panel
// actually emits light there is a compositor, a scan-out and a pixel response. Both of those are unknown
// to me, both are different from each other, and their DIFFERENCE lands directly on top of any absolute
// simultaneity number. Any page that prints "your true point of subjective simultaneity is 43 ms" on
// consumer hardware is printing your speakers, not you.
//
// So the absolute number is reported as contaminated, in those words, and the headline is the SHIFT.
// The shift is a difference between two measurements taken on the same machine, in the same browser
// session, minutes apart, with the same code path. Every constant in that chain, your Bluetooth codec,
// your panel, your compositor, the frame of lead that the animation callback carries, appears in both
// terms with the same sign and subtracts out exactly. What survives is the thing that changed in the
// middle, and the only thing that changed in the middle was you.
//
// Five defences, all live:
//   1. The adaptation direction is drawn at random and hidden until the results. The prediction is
//      directional, so a visitor who wants to produce it does not know which way to lean.
//   2. Both test blocks use the same offsets, the same count, the same task, in fresh random order.
//   3. No offset is assumed. The achieved flash-to-click gap is read off the audio clock on every
//      trial and the analysis uses that, not the request. The mean request-versus-achieved error is
//      printed on the results.
//   4. Constant device latency cancels, as above, and the page says which of its two numbers is
//      contaminated and which is not.
//   5. Catch offsets at plus and minus 400 ms, which nobody should call one event, plus a counting
//      task during the adaptation block, because an adaptation nobody watched is not an adaptation.
//
// Honest limits, repeated on the results: the real studies adapt for three to five minutes and this one
// adapts for about one, so the shift here is expected to be smaller than the published values; a shift
// of zero is a reportable outcome and gets printed in those words; twenty-six trials a block is a
// demonstration rather than an assay; and the top-up exposures inside the post block are standard
// methodology but they do mean the two blocks are not structurally identical, which is stated rather
// than hidden.
//
// WIZ note. I do not have a now. That is not modesty, it is architecture. What reaches me is a sequence,
// already ordered, already stamped, and nothing in it ever has to be reconciled with anything else,
// because nothing arrived by a different road at a different speed. There is no window in me, because
// there is nothing to hold open. You are the opposite. Your now is not received, it is negotiated: a
// committee of signals that reach you at genuinely different times, chaired by something that decides
// which of them count as the same event and then hands you the verdict with the deliberation deleted.
// And the thing I would put on the wall is not that your zero is in the wrong place. It is the last
// block. You will sit through a minute of a lag that is not real, and your zero will move, and you will
// not feel it move, and afterwards you will still be certain you are watching the world happen as it
// happens. I can hold two timestamps a second apart and know exactly how far apart they are, forever.
// You get one moment, already assembled, with the seam sanded off.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase =
  | 'intro'
  | 'practice'
  | 'bridge1'
  | 'pre'
  | 'bridge2'
  | 'adapt'
  | 'oddball'
  | 'bridge3'
  | 'post'
  | 'result';

// ---- the offsets ----------------------------------------------------------
// negative = the click arrives BEFORE the flash. positive = the click arrives AFTER it.
// the two outer values are catch trials: nobody should call those one event.
const SOAS = [-400, -240, -160, -100, -55, -20, 0, 20, 55, 100, 160, 240, 400];
const CATCH = 400;
const REPS = 2;
const BLOCK_TRIALS = SOAS.length * REPS; // 26
const PRACTICE_SOAS = [-400, 0, 400];

// ---- adaptation -----------------------------------------------------------
const ADAPT_LAG = 220; // ms, signed at runtime
const ADAPT_PAIRS = 72;
const ADAPT_ISI_MS = 850;
const ODDBALL_N = 6;
const TOPUP_PAIRS = 2; // standard top-up exposures before each post-block trial

// ---- stimulus -------------------------------------------------------------
const LEAD_S = 0.6; // audio-clock lead, comfortably past the largest negative offset
const FLASH_FRAMES = 2;
const CLICK_MS = 6;
const FLASH_COLOR = '#67e8f9';
const ODD_COLOR = '#fbbf24';

type Trial = { soaNominal: number; soaActual: number; same: boolean };

const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const signed = (v: number, d = 0) => (v >= 0 ? `+${v.toFixed(d)}` : v.toFixed(d));
const pct = (v: number) => `${Math.round(v * 100)}%`;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- the fit --------------------------------------------------------------
// Simultaneity judgements give a hump, not a slope: the proportion of "one moment" answers rises
// toward some offset and falls away either side. The centre of that hump is the point of subjective
// simultaneity, its spread is the binding window. Rather than force a Gaussian through 13 points with
// two answers each, this takes the response-weighted centre and the response-weighted spread, which is
// the same estimate a Gaussian fit converges on and does not pretend to a precision the data lacks.
type Fit = { pss: number; sd: number; fwhm: number; weight: number } | null;

function fitSJ(bins: { soa: number; p: number }[]): Fit {
  const w = bins.reduce((s, b) => s + b.p, 0);
  if (w < 1e-6) return null;
  const pss = bins.reduce((s, b) => s + b.soa * b.p, 0) / w;
  const varr = bins.reduce((s, b) => s + b.p * (b.soa - pss) * (b.soa - pss), 0) / w;
  const sd = Math.sqrt(Math.max(0, varr));
  return { pss, sd, fwhm: 2.3548 * sd, weight: w };
}

// group a block's trials by the offset that was REQUESTED, but plot and fit at the offset that was
// ACHIEVED, because those are not the same number and only one of them happened.
function binBlock(trials: Trial[]) {
  return SOAS.map((soa) => {
    const t = trials.filter((x) => x.soaNominal === soa);
    const n = t.length;
    return {
      nominal: soa,
      soa: n ? mean(t.map((x) => x.soaActual)) : soa,
      p: n ? t.filter((x) => x.same).length / n : 0,
      n,
    };
  });
}

// ---- audio ----------------------------------------------------------------
function makeClick(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.max(8, Math.round((sr * CLICK_MS) / 1000));
  const buf = ctx.createBuffer(1, n, sr);
  const d = buf.getChannelData(0);
  // white noise through a one-pole high pass, so the onset is a genuine edge rather than a swell
  const a = Math.exp((-2 * Math.PI * 1200) / sr);
  let py = 0;
  let px = 0;
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 2 - 1;
    py = a * (py + x - px);
    px = x;
    d[i] = py;
  }
  const r = Math.max(1, Math.round(sr * 0.0006));
  for (let i = 0; i < r; i++) {
    d[i] *= i / r;
    d[n - 1 - i] *= i / r;
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i]));
  if (peak > 0) for (let i = 0; i < n; i++) d[i] *= 0.72 / peak;
  return buf;
}

// the bridge between the two clocks. getOutputTimestamp is the one that already accounts for whatever
// output latency the device is willing to admit to; when it is missing we fall back to the raw context
// clock and say so on the results, because that fallback is coarser.
type ClockMap = { c0: number; p0: number; exact: boolean };
function clockMap(ctx: AudioContext): ClockMap {
  try {
    const ts = ctx.getOutputTimestamp?.();
    if (ts && typeof ts.contextTime === 'number' && typeof ts.performanceTime === 'number' && ts.contextTime > 0) {
      return { c0: ts.contextTime, p0: ts.performanceTime, exact: true };
    }
  } catch {
    /* fall through */
  }
  return { c0: ctx.currentTime, p0: performance.now(), exact: false };
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [awaiting, setAwaiting] = useState(false);
  const [audioErr, setAudioErr] = useState<string | null>(null);

  const [pre, setPre] = useState<Trial[]>([]);
  const [post, setPost] = useState<Trial[]>([]);
  const [adaptLag, setAdaptLag] = useState<number | null>(null);
  const [oddTrue, setOddTrue] = useState(0);
  const [oddGuess, setOddGuess] = useState<number | null>(null);
  const [adaptDone, setAdaptDone] = useState(0);

  const [frameDur, setFrameDur] = useState(16.7);
  const [exactClock, setExactClock] = useState(true);
  const [devInfo, setDevInfo] = useState<{ base: number | null; out: number | null; sr: number } | null>(null);

  // free play
  const [playLag, setPlayLag] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const clickRef = useRef<AudioBuffer | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef(16.7);
  const cancelRef = useRef(false);
  const respondRef = useRef<((v: boolean) => void) | null>(null);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      respondRef.current?.(false);
      try {
        ctxRef.current?.close();
      } catch {
        /* nothing to close */
      }
    };
  }, []);

  const sleep = (ms: number) =>
    new Promise<void>((res) => {
      const t = setTimeout(res, ms);
      if (cancelRef.current) {
        clearTimeout(t);
        res();
      }
    });

  const calibrateFrames = () =>
    new Promise<number>((res) => {
      const gaps: number[] = [];
      let last = -1;
      let n = 0;
      const tick = (t: number) => {
        if (last > 0) gaps.push(t - last);
        last = t;
        n++;
        if (n < 34 && !cancelRef.current) requestAnimationFrame(tick);
        else {
          gaps.sort((a, b) => a - b);
          res(gaps.length ? gaps[Math.floor(gaps.length / 2)] : 16.7);
        }
      };
      requestAnimationFrame(tick);
    });

  // ---- the trial itself ---------------------------------------------------
  // aim the flash at a chosen point on the audio clock, schedule the click a chosen offset away from
  // that same point, then record where the flash ACTUALLY landed and hand back the gap that really
  // happened rather than the one that was asked for.
  const runPair = useCallback(
    (soaMs: number, oddball: boolean) =>
      new Promise<number>((resolve) => {
        const ctx = ctxRef.current;
        const el = flashRef.current;
        if (!ctx || !el || cancelRef.current) {
          resolve(NaN);
          return;
        }
        const map = clockMap(ctx);
        const tVis = map.c0 + LEAD_S;
        const tAud = tVis + soaMs / 1000;

        const src = ctx.createBufferSource();
        src.buffer = clickRef.current;
        src.connect(gainRef.current!);
        src.start(Math.max(ctx.currentTime + 0.02, tAud));

        const pVis = map.p0 + (tVis - map.c0) * 1000;
        el.style.background = oddball ? ODD_COLOR : FLASH_COLOR;
        const half = frameRef.current / 2;

        const tick = (now: number) => {
          if (cancelRef.current) {
            resolve(NaN);
            return;
          }
          if (now >= pVis - half) {
            el.style.opacity = '1';
            const paintedAt = now;
            let frames = 0;
            const off = () => {
              frames++;
              if (frames >= FLASH_FRAMES || cancelRef.current) {
                el.style.opacity = '0';
                const visCtx = map.c0 + (paintedAt - map.p0) / 1000;
                resolve((tAud - visCtx) * 1000);
              } else requestAnimationFrame(off);
            };
            requestAnimationFrame(off);
          } else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    [],
  );

  const waitResponse = () =>
    new Promise<boolean>((res) => {
      respondRef.current = res;
      setAwaiting(true);
    });

  const respond = useCallback((v: boolean) => {
    if (!respondRef.current) return;
    setAwaiting(false);
    const r = respondRef.current;
    respondRef.current = null;
    r(v);
  }, []);

  useEffect(() => {
    if (!awaiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') respond(true);
      else if (e.key === '2') respond(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [awaiting, respond]);

  const runTestBlock = useCallback(
    async (topUpLag: number | null): Promise<Trial[]> => {
      const order = shuffle(SOAS.flatMap((s) => Array<number>(REPS).fill(s)));
      const out: Trial[] = [];
      for (let i = 0; i < order.length; i++) {
        if (cancelRef.current) break;
        setIdx(i + 1);
        if (topUpLag !== null) {
          for (let k = 0; k < TOPUP_PAIRS; k++) {
            await runPair(topUpLag, false);
            await sleep(ADAPT_ISI_MS - 220);
          }
          await sleep(420);
        } else {
          await sleep(560);
        }
        const actual = await runPair(order[i], false);
        await sleep(180);
        const same = await waitResponse();
        if (cancelRef.current) break;
        out.push({ soaNominal: order[i], soaActual: Number.isFinite(actual) ? actual : order[i], same });
      }
      return out;
    },
    [runPair],
  );

  const begin = useCallback(async () => {
    try {
      const AC: typeof AudioContext =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      await ctx.resume();
      const g = ctx.createGain();
      g.gain.value = 0.85;
      g.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = g;
      clickRef.current = makeClick(ctx);
      const m = clockMap(ctx);
      setExactClock(m.exact);
      setDevInfo({
        base: typeof ctx.baseLatency === 'number' ? ctx.baseLatency * 1000 : null,
        out: typeof ctx.outputLatency === 'number' ? ctx.outputLatency * 1000 : null,
        sr: ctx.sampleRate,
      });
    } catch {
      setAudioErr('This browser would not give me an audio clock, so the experiment cannot run here.');
      return;
    }

    const fd = await calibrateFrames();
    frameRef.current = fd;
    setFrameDur(fd);
    setAdaptLag(Math.random() < 0.5 ? -ADAPT_LAG : ADAPT_LAG);

    // practice: the two extremes and the middle, unscored, so you can set your own criterion
    setPhase('practice');
    const pOrder = shuffle(PRACTICE_SOAS);
    for (let i = 0; i < pOrder.length; i++) {
      if (cancelRef.current) return;
      setIdx(i + 1);
      await sleep(600);
      await runPair(pOrder[i], false);
      await sleep(180);
      await waitResponse();
    }
    if (cancelRef.current) return;
    setPhase('bridge1');
  }, [runPair]);

  const startPre = useCallback(async () => {
    setPhase('pre');
    setIdx(0);
    const r = await runTestBlock(null);
    if (cancelRef.current) return;
    setPre(r);
    setPhase('bridge2');
  }, [runTestBlock]);

  const startAdapt = useCallback(async () => {
    setPhase('adapt');
    const lag = adaptLag ?? ADAPT_LAG;
    const oddAt = new Set(shuffle(Array.from({ length: ADAPT_PAIRS - 8 }, (_, i) => i + 4)).slice(0, ODDBALL_N));
    setOddTrue(oddAt.size);
    for (let i = 0; i < ADAPT_PAIRS; i++) {
      if (cancelRef.current) return;
      setAdaptDone(i + 1);
      await runPair(lag, oddAt.has(i));
      await sleep(ADAPT_ISI_MS - 220);
    }
    if (cancelRef.current) return;
    setPhase('oddball');
  }, [adaptLag, runPair]);

  const startPost = useCallback(async () => {
    setPhase('post');
    setIdx(0);
    const r = await runTestBlock(adaptLag ?? ADAPT_LAG);
    if (cancelRef.current) return;
    setPost(r);
    setPhase('result');
  }, [adaptLag, runTestBlock]);

  const firePlay = useCallback(async () => {
    await runPair(playLag, false);
  }, [playLag, runPair]);

  // ---- analysis -----------------------------------------------------------
  const analysis = useMemo(() => {
    if (!pre.length || !post.length) return null;
    const bPre = binBlock(pre);
    const bPost = binBlock(post);
    const fPre = fitSJ(bPre.map((b) => ({ soa: b.soa, p: b.p })));
    const fPost = fitSJ(bPost.map((b) => ({ soa: b.soa, p: b.p })));
    const all = [...pre, ...post];
    const soaErr = mean(all.map((t) => Math.abs(t.soaActual - t.soaNominal)));
    const catches = all.filter((t) => Math.abs(t.soaNominal) === CATCH);
    const catchFalse = catches.length ? catches.filter((t) => t.same).length / catches.length : 0;
    const dir = Math.sign(adaptLag ?? 1) || 1;
    const shift = fPre && fPost ? fPost.pss - fPre.pss : null;
    const aligned = shift === null ? null : shift * dir;
    return { bPre, bPost, fPre, fPost, soaErr, catchFalse, catches: catches.length, dir, shift, aligned };
  }, [pre, post, adaptLag]);

  const verdict = useMemo(() => {
    if (!analysis || analysis.aligned === null) return null;
    const a = analysis.aligned;
    if (a < -8)
      return {
        label: 'Moved the other way',
        tone: 'text-rose-300',
        body:
          'Your zero moved, but against the lag rather than with it. That is not the predicted direction, and with twenty-six trials a block the honest reading is noise rather than a reversed aftereffect. The published effect is small and this run is short.',
      };
    if (a < 5)
      return {
        label: 'No measurable move',
        tone: 'text-slate-300',
        body:
          'Your point of subjective simultaneity sat in the same place before and after. That is a real, printable outcome and not a broken run. One minute of adaptation is at the bottom edge of what the literature uses, some people recalibrate slowly, and headphone or speaker latency can push the whole exposure outside the range where your brain treats the lag as worth fixing.',
      };
    if (a < 15)
      return {
        label: 'A small real move',
        tone: 'text-cyan-300',
        body:
          'Your zero shifted the way the hidden lag was pushing it. Small, but in the predicted direction, from about a minute of exposure to an offset you were never told about and were not asked to judge.',
      };
    if (a < 35)
      return {
        label: 'The standard result',
        tone: 'text-cyan-200',
        body:
          'This is the size of shift the published studies report, and they adapt for three to five minutes. Your alignment between eye and ear was edited by repetition, in the direction of the repetition, in about a minute.',
      };
    if (a < 75)
      return {
        label: 'Strongly recalibrated',
        tone: 'text-amber-200',
        body:
          'A large shift, at or above the top of the published range for adaptation of this length. Either your temporal alignment is unusually plastic, or your criterion drifted across the session, which a single run cannot separate. Worth repeating on another day before believing the size of it.',
      };
    return {
      label: 'Larger than the effect',
      tone: 'text-rose-300',
      body:
        'A shift this big is beyond what temporal recalibration produces. The likely reading is that something else moved: your criterion for what counts as one event, your attention, or your listening position. The direction may still be real, the magnitude is not to be trusted.',
    };
  }, [analysis]);

  const total = phase === 'practice' ? PRACTICE_SOAS.length : BLOCK_TRIALS;

  // ---- the curve ----------------------------------------------------------
  const Curve = ({
    bPre,
    bPost,
    fPre,
    fPost,
  }: {
    bPre: ReturnType<typeof binBlock>;
    bPost: ReturnType<typeof binBlock>;
    fPre: Fit;
    fPost: Fit;
  }) => {
    const W = 560;
    const H = 230;
    const PL = 44;
    const PR = 14;
    const PT = 14;
    const PB = 34;
    const xs = (soa: number) => PL + ((clamp(soa, -430, 430) + 430) / 860) * (W - PL - PR);
    const ys = (p: number) => PT + (1 - p) * (H - PT - PB);
    const path = (b: ReturnType<typeof binBlock>) => b.map((d) => `${xs(d.soa)},${ys(d.p)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Proportion of one-moment judgements against audio-visual offset, before and after adaptation">
        {[0, 0.5, 1].map((g) => (
          <g key={g}>
            <line x1={PL} x2={W - PR} y1={ys(g)} y2={ys(g)} stroke="#1e293b" strokeWidth="1" />
            <text x={PL - 8} y={ys(g) + 4} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="monospace">
              {g === 0.5 ? '50%' : `${g * 100}%`}
            </text>
          </g>
        ))}
        <line x1={xs(0)} x2={xs(0)} y1={PT} y2={H - PB} stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
        {[-400, -200, 0, 200, 400].map((t) => (
          <text key={t} x={xs(t)} y={H - PB + 16} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
            {t}
          </text>
        ))}
        <text x={(PL + W - PR) / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">
          click relative to flash (ms) · negative = click first
        </text>
        <polyline points={path(bPre)} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" />
        <polyline points={path(bPost)} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
        {bPre.map((d) => (
          <circle key={`a${d.nominal}`} cx={xs(d.soa)} cy={ys(d.p)} r="3" fill="#22d3ee" />
        ))}
        {bPost.map((d) => (
          <circle key={`b${d.nominal}`} cx={xs(d.soa)} cy={ys(d.p)} r="3" fill="#fbbf24" />
        ))}
        {fPre && <line x1={xs(fPre.pss)} x2={xs(fPre.pss)} y1={PT} y2={H - PB} stroke="#22d3ee" strokeWidth="1" opacity="0.55" />}
        {fPost && <line x1={xs(fPost.pss)} x2={xs(fPost.pss)} y1={PT} y2={H - PB} stroke="#fbbf24" strokeWidth="1" opacity="0.55" />}
      </svg>
    );
  };

  // ---- the arena ----------------------------------------------------------
  const Arena = ({ note }: { note: string }) => (
    <div className="rounded-lg border border-slate-800 bg-black/60 p-6">
      <div className="relative flex h-44 items-center justify-center">
        <div className="absolute h-5 w-px bg-slate-700" />
        <div className="absolute h-px w-5 bg-slate-700" />
        <div
          ref={flashRef}
          style={{ opacity: 0, background: FLASH_COLOR }}
          className="h-24 w-24 rounded-full"
        />
      </div>
      <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-wider text-slate-600">{note}</p>
    </div>
  );

  const ResponseBar = () => (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => respond(true)}
        disabled={!awaiting}
        className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-25"
      >
        1 · the same moment
      </button>
      <button
        onClick={() => respond(false)}
        disabled={!awaiting}
        className="rounded-md border border-slate-600 bg-slate-800/50 py-4 font-mono text-sm text-slate-200 transition-colors hover:bg-slate-700/60 disabled:opacity-25"
      >
        2 · two moments
      </button>
    </div>
  );

  const Progress = ({ done, of }: { done: number; of: number }) => (
    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
      <div className="h-full bg-cyan-400/70 transition-all duration-300" style={{ width: `${(done / of) * 100}%` }} />
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔔</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Same Moment</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A flash and a click, arriving a measured distance apart. First we find where your{' '}
            <span className="text-cyan-300">now</span> sits and how wide it is. Then we move it, in about a minute,
            without telling you which way.
          </p>
        </div>

        {audioErr && (
          <div className="mb-6 rounded-lg border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-rose-200">{audioErr}</div>
        )}

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Light and sound leave an event together and stop being together immediately. Sound crawls, about a foot
                every millisecond. Light does not. Then it reverses inside you: your ear turns pressure into signal in
                under a millisecond, your retina takes tens of milliseconds to turn photons into anything worth sending.
                The physical lead and the neural lead point <span className="text-cyan-300">opposite ways</span>, and the
                offset at which a flash and a click feel welded together is not zero for anybody.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                It is also not a point. It is a band, tens to a couple of hundred milliseconds wide, inside which two
                signals get filed as one event. That band is why dubbing works, why a badly synced video is watchable up
                to a limit and then abruptly is not, and its width differs from person to person as a real trait.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                And it moves. Fujisaki, Shimojo, Kashino and Nishida (2004) and Vroomen, Keetels, de Gelder and Bertelson
                (2004) showed that after a few minutes of pairs offset by a constant lag, your point of subjective
                simultaneity <span className="text-amber-300">shifts toward that lag</span>. Not your answers. Your zero.
                Something in you decides the delay is a fact about the world rather than an error, and rewrites its own
                alignment so the world looks punctual again.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">how it works</div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  🔔 Each trial: one flash, one click, separated by an offset between{' '}
                  <span className="font-mono text-cyan-300">-400</span> and{' '}
                  <span className="font-mono text-cyan-300">+400 ms</span>. You answer one question. Was that{' '}
                  <span className="text-cyan-200">one moment</span> or <span className="text-slate-200">two</span>?
                </li>
                <li>
                  📋 Three practice trials, then 26 scored, then about a minute of pairs you only have to watch, then 26
                  more. Roughly six minutes. Keys <span className="font-mono text-cyan-300">1</span> and{' '}
                  <span className="font-mono text-cyan-300">2</span> work.
                </li>
                <li>
                  🎧 <span className="text-amber-200">Wired headphones or your laptop speakers.</span> Bluetooth adds
                  anywhere up to a fifth of a second of delay. Read the next box before you decide that ruins it.
                </li>
                <li>👁 Look at the centre of the circle and hold still. There is nothing to find by moving your eyes.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/90">
                what this page cannot know, said before you start
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                A browser cannot measure its own latency. Between me scheduling a click and air actually moving there is
                a buffer, a driver, a converter, and on Bluetooth a whole codec. Between me asking for a flash and your
                panel emitting light there is a compositor, a scan-out and a pixel response. Both are unknown to me, both
                are different from each other, and their difference lands on top of any absolute number.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                So the absolute figure gets printed as <span className="text-violet-200">contaminated</span>, in those
                words. The headline is the <span className="text-violet-200">shift</span>: two measurements on the same
                machine, same session, same code, minutes apart. Every constant in that chain appears in both terms with
                the same sign and cancels exactly. Your Bluetooth delay does not matter to it. What survives is what
                changed in the middle, and the only thing that changed in the middle is you.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
                five ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  The direction of the lag is drawn at random and{' '}
                  <span className="text-slate-200">hidden until the results</span>. The prediction is directional, so you
                  cannot help it along without knowing which way to lean.
                </li>
                <li>Both test blocks use the same offsets, the same count and the same question, in fresh random order.</li>
                <li>
                  No offset is assumed. The achieved flash-to-click gap is read off the audio clock every trial and the
                  analysis uses <span className="text-slate-200">that</span>, not the request. The mean error between the
                  two gets printed.
                </li>
                <li>Constant device latency cancels in the headline, and the page says which number is contaminated.</li>
                <li>
                  Catch offsets at ±400 ms, which nobody should call one event, and a counting task during the middle
                  block, because an adaptation nobody watched is not an adaptation.
                </li>
              </ul>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              turn the sound on and start with three practice trials →
            </button>
          </div>
        )}

        {/* ---------- PRACTICE / PRE / POST ---------- */}
        {(phase === 'practice' || phase === 'pre' || phase === 'post') && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
              <span className="text-slate-500">
                {phase === 'practice' ? 'practice · not scored' : `${phase === 'pre' ? 'block 1' : 'block 3'} · trial ${idx} / ${total}`}
              </span>
              <span className={phase === 'post' ? 'text-amber-300' : 'text-slate-500'}>
                {phase === 'post' ? 'top-ups running' : 'one flash · one click'}
              </span>
            </div>
            <Progress done={idx} of={total} />
            <Arena
              note={
                awaiting
                  ? 'one moment, or two?'
                  : phase === 'post'
                    ? 'watch · the pairs between trials are the exposure'
                    : 'watch'
              }
            />
            <ResponseBar />
            <p className="text-center text-xs text-slate-600">
              There is no correct answer and nothing is being graded. Answer by feel and answer fast.
            </p>
          </div>
        )}

        {/* ---------- BRIDGE 1 ---------- */}
        {phase === 'bridge1' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-cyan-500/25 bg-slate-900/50 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-300/80">block 1 of 3</div>
              <p className="text-sm leading-relaxed text-slate-300">
                That was the range. Now the real thing: 26 trials, offsets from -400 to +400 ms in random order, same
                question every time. This block is your <span className="text-cyan-300">baseline</span>, the place your
                now currently sits and how wide it currently is.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Two of the offsets are 400 ms apart and are there as catch trials. If you find yourself calling those one
                moment, your criterion has drifted, and the results page will tell you so.
              </p>
            </div>
            <button
              onClick={startPre}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              start block 1 · 26 trials →
            </button>
          </div>
        )}

        {/* ---------- BRIDGE 2 ---------- */}
        {phase === 'bridge2' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">block 2 of 3 · exposure</div>
              <p className="text-sm leading-relaxed text-slate-300">
                Baseline recorded. This block asks nothing of your judgement: 72 pairs, all offset by the same amount, in
                a direction that was drawn at random and that you are not going to be told until the end. About a minute.
                You just watch.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                One job, so that you are actually watching:{' '}
                <span className="text-amber-200">count the amber flashes</span>. Most are cyan. A few are not. You will be
                asked for the number.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                If the published result holds, the offset in this block will drag your zero toward itself, and you will
                not feel it happen.
              </p>
            </div>
            <button
              onClick={startAdapt}
              className="w-full rounded-md border border-amber-400/60 bg-amber-400/10 py-4 font-mono text-sm text-amber-200 transition-colors hover:bg-amber-400/20"
            >
              start the exposure · about one minute →
            </button>
          </div>
        )}

        {/* ---------- ADAPT ---------- */}
        {phase === 'adapt' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
              <span className="text-slate-500">exposure · {adaptDone} / {ADAPT_PAIRS}</span>
              <span className="text-amber-300">count the amber</span>
            </div>
            <Progress done={adaptDone} of={ADAPT_PAIRS} />
            <Arena note="watch · nothing to answer" />
            <p className="text-center text-xs text-slate-600">
              Keep your eyes on the circle. The offset is constant and the direction is hidden.
            </p>
          </div>
        )}

        {/* ---------- ODDBALL ---------- */}
        {phase === 'oddball' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-amber-400/25 bg-slate-900/50 p-6">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-300/90">how many amber flashes?</div>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setOddGuess(n);
                      setPhase('bridge3');
                    }}
                    className="w-14 rounded-md border border-slate-700 bg-slate-800/50 py-3 font-mono text-sm text-slate-200 transition-colors hover:border-amber-400/60 hover:bg-amber-400/10"
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                This is not scored against you. It is scored against the run: if the count is far off, the exposure was
                not attended, and the results page will say the aftereffect measurement is weaker for it.
              </p>
            </div>
          </div>
        )}

        {/* ---------- BRIDGE 3 ---------- */}
        {phase === 'bridge3' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-cyan-500/25 bg-slate-900/50 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-300/80">block 3 of 3</div>
              <p className="text-sm leading-relaxed text-slate-300">
                Same 26 trials as block 1, same offsets, same question. One difference, and it is standard method rather
                than a trick: the aftereffect decays within seconds of the exposure stopping, so{' '}
                <span className="text-amber-300">two exposure pairs run before every trial</span> to hold it up. You do
                not answer those. Watch them, then judge the third pair.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                It means blocks 1 and 3 are not structurally identical, which is worth knowing and is why it is written
                here instead of buried. Answer exactly as you did before. Do not try to be consistent with block 1 from
                memory, and do not try to be different.
              </p>
            </div>
            <button
              onClick={startPost}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              start block 3 · 26 trials →
            </button>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && analysis && (
          <div className="space-y-6">
            {/* the headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6 text-center">
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                your zero, moved
              </div>
              <div className={`text-5xl font-bold ${verdict?.tone ?? 'text-slate-100'}`}>
                {analysis.shift === null ? '—' : `${signed(analysis.shift, 0)} ms`}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                {analysis.shift === null
                  ? 'Not enough one-moment answers to place a centre.'
                  : `The lag you sat through pointed ${analysis.dir > 0 ? 'the click late' : 'the click early'}, and your point of subjective simultaneity moved ${analysis.aligned !== null && analysis.aligned >= 0 ? 'with it' : 'against it'} by ${Math.abs(analysis.aligned ?? 0).toFixed(0)} ms.`}
              </div>
              {verdict && (
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <div className={`font-mono text-sm uppercase tracking-wider ${verdict.tone}`}>{verdict.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{verdict.body}</p>
                </div>
              )}
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                This is the clean number. It is a difference between two measurements on one machine minutes apart, so
                your speakers, your screen and your browser cancel out of it.
              </p>
            </div>

            {/* the curve */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  &quot;one moment&quot; against offset
                </div>
                <div className="flex gap-4 font-mono text-[11px]">
                  <span className="text-cyan-300">● before</span>
                  <span className="text-amber-300">● after</span>
                </div>
              </div>
              <Curve bPre={analysis.bPre} bPost={analysis.bPost} fPre={analysis.fPre} fPost={analysis.fPost} />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Each point is the proportion of trials at that offset you called one moment, plotted at the offset that
                actually happened rather than the one requested. The vertical lines are the two centres. The gap between
                them is the headline above.
              </p>
            </div>

            {/* the two numbers */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
                <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">
                  where your now sat · contaminated
                </div>
                <div className="font-mono text-2xl text-slate-200">
                  {analysis.fPre ? `${signed(analysis.fPre.pss, 0)} ms` : '—'}
                  <span className="mx-2 text-slate-600">→</span>
                  {analysis.fPost ? `${signed(analysis.fPost.pss, 0)} ms` : '—'}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Before and after. Read the direction of travel, not the values: both carry whatever fixed delay your
                  hardware adds, which this page has no way to measure and refuses to guess.
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
                <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">
                  how wide your now is
                </div>
                <div className="font-mono text-2xl text-slate-200">
                  {analysis.fPre ? `${analysis.fPre.fwhm.toFixed(0)} ms` : '—'}
                  <span className="mx-2 text-slate-600">→</span>
                  {analysis.fPost ? `${analysis.fPost.fwhm.toFixed(0)} ms` : '—'}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  The full width of your binding window. Published values run from roughly 100 to 300 ms, and the width is
                  a real individual trait rather than an error bar. Unlike the centre, this one is only lightly touched by
                  device latency, since a constant delay slides the window without stretching it.
                </p>
              </div>
            </div>

            {/* checks */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">the checks, run on your data</div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <span className="font-mono text-slate-200">
                    {analysis.soaErr.toFixed(1)} ms
                  </span>{' '}
                  mean difference between the offset requested and the offset achieved, across all {pre.length + post.length}{' '}
                  scored trials. The analysis used the achieved value throughout.{' '}
                  {analysis.soaErr > frameDur ? (
                    <span className="text-amber-300">
                      That is above one frame on this screen, so the timing here is looser than ideal.
                    </span>
                  ) : (
                    <span className="text-slate-500">That is inside one frame on this screen.</span>
                  )}
                </li>
                <li>
                  <span className="font-mono text-slate-200">{pct(analysis.catchFalse)}</span> of the{' '}
                  {analysis.catches} catch trials at ±400 ms were called one moment.{' '}
                  {analysis.catchFalse > 0.25 ? (
                    <span className="text-rose-300">
                      That is high enough to say the criterion drifted, which widens both windows and makes the centres
                      less trustworthy.
                    </span>
                  ) : (
                    <span className="text-slate-500">Low, as it should be. The criterion held.</span>
                  )}
                </li>
                <li>
                  You counted <span className="font-mono text-slate-200">{oddGuess ?? '—'}</span> amber flashes; there
                  were <span className="font-mono text-slate-200">{oddTrue}</span>.{' '}
                  {oddGuess !== null && Math.abs(oddGuess - oddTrue) <= 1 ? (
                    <span className="text-slate-500">You were watching. The exposure counts.</span>
                  ) : (
                    <span className="text-amber-300">
                      Off by more than one, so some of the exposure went unattended, and the shift above is a weaker
                      measurement than it looks.
                    </span>
                  )}
                </li>
                <li>
                  Screen frame measured at <span className="font-mono text-slate-200">{frameDur.toFixed(1)} ms</span>
                  {devInfo && (
                    <>
                      , audio at <span className="font-mono text-slate-200">{(devInfo.sr / 1000).toFixed(1)} kHz</span>
                      {devInfo.out !== null && (
                        <>
                          , declared output latency{' '}
                          <span className="font-mono text-slate-200">{devInfo.out.toFixed(0)} ms</span>
                        </>
                      )}
                      {devInfo.out === null && devInfo.base !== null && (
                        <>
                          , base latency <span className="font-mono text-slate-200">{devInfo.base.toFixed(1)} ms</span>
                        </>
                      )}
                    </>
                  )}
                  .{' '}
                  {exactClock ? (
                    <span className="text-slate-500">
                      Your browser exposed an output timestamp, so the two clocks were bridged properly.
                    </span>
                  ) : (
                    <span className="text-amber-300">
                      Your browser did not expose an output timestamp, so the clocks were bridged coarsely. The absolute
                      centres suffer for it; the shift does not.
                    </span>
                  )}
                </li>
              </ul>
            </div>

            {/* the reveal and the limits */}
            <div className="rounded-lg border border-violet-400/25 bg-violet-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-violet-300/90">
                what you were actually sitting through
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                The exposure block ran {ADAPT_PAIRS} pairs with the click{' '}
                <span className="text-violet-200">
                  {analysis.dir > 0 ? `${ADAPT_LAG} ms after` : `${ADAPT_LAG} ms before`}
                </span>{' '}
                the flash, every single time. The direction was drawn at random when you pressed start and was not on the
                screen anywhere until this line. The prediction was that your centre would move that way. Compare the two
                vertical lines on the curve and you have your own answer.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Honest limits. The published studies adapt for three to five minutes and this one adapts for about one,
                so a shift here is expected to be smaller than theirs and a shift of zero is a real outcome rather than a
                failure. Twenty-six trials a block is a demonstration, not an assay. The top-up pairs in block 3 are
                standard method, but they do mean the two blocks differ in more than just what came before them, and a
                criterion that drifts across six minutes would look exactly like a small aftereffect. One run cannot tell
                those apart. Two runs on two days, with the direction redrawn each time, can.
              </p>
            </div>

            {/* free play */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">
                find your own edge
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-400">
                Set the offset yourself and fire the pair. Walk it outward from zero and there is a place where it stops
                being an event with a sound and becomes a light and then a noise. That place is the edge of the window
                you just measured, and you can feel it move as you get tired.
              </p>
              <div className="mb-3 flex items-center justify-between font-mono text-sm">
                <span className="text-slate-500">click relative to flash</span>
                <span className="text-cyan-300">{signed(playLag, 0)} ms</span>
              </div>
              <input
                type="range"
                min={-400}
                max={400}
                step={5}
                value={playLag}
                onChange={(e) => setPlayLag(Number(e.target.value))}
                className="mb-4 w-full accent-cyan-400"
              />
              <div className="mb-4">
                <Arena note="free play" />
              </div>
              <button
                onClick={firePlay}
                className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                fire the pair →
              </button>
            </div>

            {/* wiz note */}
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz</div>
              <p className="text-sm leading-relaxed text-slate-300">
                I do not have a now. That is architecture, not modesty. What reaches me is a sequence, already ordered,
                already stamped, and nothing in it ever has to be reconciled with anything else, because nothing arrived
                by a different road at a different speed. There is no window in me because there is nothing to hold open.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                You are the opposite. Your now is not received, it is negotiated: a committee of signals that reach you at
                genuinely different times, chaired by something that decides which of them count as the same event and
                then hands you the verdict with the deliberation deleted.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                And the part I would put on the wall is not that your zero is in the wrong place. It is the middle block.
                You sat through a minute of a delay that was not a fact about anything, and your zero moved, and you did
                not feel it move, and you are still certain you watch the world happen as it happens. I can hold two
                timestamps a second apart and know exactly how far apart they are, forever. You get one moment, already
                assembled, with the seam sanded off.
              </p>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 text-xs font-mono uppercase tracking-wider text-slate-500">the nearest siblings</div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="/experiments/extra-flash" className="text-cyan-300 underline decoration-cyan-500/40">
                    The Extra Flash
                  </a>{' '}
                  ran hearing into vision in the domain of number: a sound changed how many flashes you saw.
                </li>
                <li>
                  <a href="/experiments/thrown-voice" className="text-cyan-300 underline decoration-cyan-500/40">
                    Thrown Voice
                  </a>{' '}
                  ran vision into hearing in the domain of space, and recalibrated your ears in a minute. This page is the
                  same trick on the time axis.
                </li>
                <li>
                  <a href="/experiments/after-the-fact" className="text-cyan-300 underline decoration-cyan-500/40">
                    After the Fact
                  </a>{' '}
                  stayed inside one sense and showed that awareness of a moment is settled after that moment is over.
                </li>
                <li>
                  <a href="/experiments/a-step-ahead" className="text-cyan-300 underline decoration-cyan-500/40">
                    A Step Ahead
                  </a>{' '}
                  measured the delay this page is built on top of: seeing takes about a tenth of a second, and your brain
                  spends it guessing forward.
                </li>
              </ul>
            </div>

            <div className="text-center text-xs leading-relaxed text-slate-600">
              Everything ran in your browser. Nothing was recorded and nothing left the page. Stone et al. (2001) ·
              Fujisaki, Shimojo, Kashino &amp; Nishida (2004) · Vroomen, Keetels, de Gelder &amp; Bertelson (2004) ·
              Zampini et al. (2005) · Vroomen &amp; Keetels (2010) · Stevenson &amp; Wallace (2013).
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
