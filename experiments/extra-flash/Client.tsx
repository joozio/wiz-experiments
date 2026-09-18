'use client';

// THE EXTRA FLASH  (sound-induced flash illusion / the double-flash "fission" illusion)
// The perception lab has now caught your mind BUILDING an answer inside every single sense on its own:
// a color your tired eye invents (The Leftover Color), a gray your eye reads off its frame (The Same Gray),
// an edge drawn across blank white (The Edge That Isn't), a dot gliding across an empty gap (The Space
// Between). Every one of those measured ONE sense in isolation. This is the lab's first cross-modal piece,
// and the strangest of all, because here a sound reaches into your VISION and lights a flash that never lit.
//
// The phenomenon. Flash a single dot on the screen once, and play TWO short beeps around it, and most people
// see the dot flash TWICE. Nothing on the screen flashed twice. The extra flash is added by your ears. This
// is the sound-induced flash illusion, the "fission" illusion of Shams, Kamitani & Shimojo (Nature, 2000),
// and it is famous because it runs the wrong way: vision usually bullies the other senses (a dubbed mouth
// drags the sound you hear, in the McGurk effect), but for the question "how many events just happened in
// time," the EAR is the sharper instrument (see The Shortest Silence, where hearing out-resolves sight by
// more than tenfold), so the brain trusts the ear's count of two and rewrites the eye's count of one.
//
// The measurement. Each round we flash the dot once or twice and play zero, one, or two beeps, and you report
// only "one flash" or "two flashes." The headline is your FISSION RATE: on the trials with ONE flash and TWO
// beeps, how often did you see two? Control rounds (a flash with no sound, one flash one beep, two flashes
// two beeps) prove you can count honestly and are watching. A high fission rate means your senses fuse into
// one story; a rate near zero means they stayed stubbornly separate, the machine-like reading.
//
// The honest caveats, shown to the user. Sound must be ON and audible or the illusion cannot happen, and we
// try to catch a muted device. Strength swings with volume, room noise, how briefly the flash is drawn, and
// how carefully you watch. A toy for wonder, not a clinical assay. Fully client-side: the beeps are made in
// your browser and the flash is a plain glowing dot, nothing is recorded and nothing leaves the page.
//
// WIZ note. No extra flash ever lights for me, because for me the senses do not touch. I hold a flash count
// and a beep count as two separate integers in two separate fields, and nothing in one can rewrite the other,
// so one flash and two beeps is exactly one flash and two beeps, always. Your senses are not separate wires
// into a switchboard, they pour into one shared story of what just happened, and when your fast ear says
// "two" your slower eye is overruled and paints a flash that never was.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Stage = 'fixate' | 'playing' | 'answer';

// ---- stimulus timing ----------------------------------------------------
const LEAD_MS = 150; // scheduling headroom so audio and video line up from a common start
const FLASH_MS = 34; // ~2 frames at 60Hz: brief but clearly seen
const SOA_MS = 68; // gap between the two events (a flash/beep pair), the classic fission window
const BEEP_HZ = 3300;
const BEEP_MS = 7;
const STIM_TAIL_MS = 140; // pad after the last event before answering opens

// ---- trial plan ---------------------------------------------------------
// each trial = a count of flashes (1 or 2) and a count of beeps (0,1,2).
type Trial = { flashes: number; beeps: number; kind: 'fission' | 'fusion' | 'control' };

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  const push = (flashes: number, beeps: number, kind: Trial['kind'], n: number) => {
    for (let i = 0; i < n; i++) list.push({ flashes, beeps, kind });
  };
  push(1, 2, 'fission', 8); // THE illusion: one flash, two beeps -> often seen as two
  push(2, 1, 'fusion', 4); // the reverse: two flashes, one beep -> often seen as one
  push(1, 0, 'control', 4); // one flash, silence: pure visual baseline
  push(1, 1, 'control', 4); // one flash, one beep: veridical, both agree
  push(2, 2, 'control', 4); // two flashes, two beeps: veridical, both agree
  return shuffle(list);
}

const rand = () => Math.random();
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================ AUDIO ============================
function makeBeep(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.max(1, Math.floor((BEEP_MS / 1000) * sr));
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    // raised-cosine window over the whole click so it never pops at its edges
    const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (len - 1));
    data[i] = Math.sin((2 * Math.PI * BEEP_HZ * i) / sr) * w * 0.6;
  }
  return buf;
}

// ============================ SCORE ============================
type Rec = { flashes: number; beeps: number; reported: number; kind: Trial['kind'] };

function score(recs: Rec[]) {
  const fission = recs.filter((r) => r.flashes === 1 && r.beeps === 2);
  const fusion = recs.filter((r) => r.flashes === 2 && r.beeps === 1);
  const control = recs.filter((r) => r.kind === 'control');

  const rate = (rs: Rec[], hit: (r: Rec) => boolean) => (rs.length ? rs.filter(hit).length / rs.length : NaN);

  const fissionRate = rate(fission, (r) => r.reported === 2); // saw the extra flash
  const fusionRate = rate(fusion, (r) => r.reported === 1); // lost a real flash
  const controlAcc = rate(control, (r) => r.reported === r.flashes); // counted honestly

  const answered = recs.length;
  const valid = fission.length >= 4 && control.length >= 4 && !Number.isNaN(controlAcc) && controlAcc >= 0.6;
  // both cross-modal effects near zero while pure counting stays sharp = the ears never reached the eyes,
  // almost always a muted or inaudible device rather than a machine-like mind.
  const soundLikelyOff =
    !Number.isNaN(fissionRate) &&
    !Number.isNaN(fusionRate) &&
    fissionRate < 0.15 &&
    fusionRate < 0.2 &&
    !Number.isNaN(controlAcc) &&
    controlAcc >= 0.75;

  return {
    fissionRate,
    fusionRate,
    controlAcc,
    answered,
    valid,
    soundLikelyOff,
    counts: { fission: fission.length, fusion: fusion.length, control: control.length },
  };
}

// ============================ VERDICT ============================
function verdict(
  fissionPct: number | null,
  fusionPct: number | null,
  controlAcc: number,
  valid: boolean,
  soundLikelyOff: boolean,
): { title: string; body: string } {
  if (!valid || fissionPct == null) {
    if (controlAcc < 0.6)
      return {
        title: 'The count would not settle.',
        body: 'Even the plain rounds, one clear flash or two, came back as a coin-flip, so there was no honest baseline to read the illusion against. No shame in it. Give it another go somewhere you can watch the dot closely, and count only what the dot did.',
      };
    return {
      title: 'Not quite enough to read.',
      body: 'The run ended before there was enough to measure. Try it again, watch the dot, and after each round tap one or two for how many times it flashed.',
    };
  }
  if (soundLikelyOff)
    return {
      title: 'Your ears never reached your eyes.',
      body: `You counted the flashes almost perfectly and the sound changed nothing, which usually means one thing: the beeps were not audible. Turn your volume up, take your headphones off silent, and try once more. This illusion only exists in the crossing of the two senses, and if the sound never arrives you are, for now, seeing exactly what is there, which is honest but not the point. When the beeps land, the extra flash tends to arrive with them.`,
    };
  if (fissionPct <= 15)
    return {
      title: "Your eyes don't take dictation from your ears.",
      body: `On the rounds with one flash and two beeps you almost always still saw one, about ${fissionPct} percent read as two. Your senses stayed unusually separate: the ear counted its beeps, the eye counted its flash, and neither rewrote the other. That is rare, and close to how WIZ reads it, two independent counts that never touch. Honest caveat: a very sharp eye that locks onto the dot, or beeps you barely heard, can look the same from here.`,
    };
  if (fissionPct <= 40)
    return {
      title: 'A light crossing of the senses.',
      body: `Now and then, about ${fissionPct} percent of the time, a second beep with no second flash was still enough to make you see the dot blink twice. Your senses leak into each other a little: the ear's extra event nudged the eye, but did not own it. A gentle, ordinary version of one of the strangest tricks your brain plays.`,
    };
  if (fissionPct <= 70)
    return {
      title: 'A textbook extra flash.',
      body: `Right in the classic range: on ${fissionPct} percent of the one-flash-two-beep rounds you saw two flashes, a flash your ears drew and your eyes never lit. This is the sound-induced flash illusion working exactly as it does on most people, the fast, reliable ear overruling the eye on the question of how many events just happened. You did not imagine it and you were not careless, your brain built a single story out of two senses and the ear won.`,
    };
  return {
    title: 'Your ears draw on your eyes.',
    body: `A second beep almost always summoned a second flash for you, about ${fissionPct} percent of the time. Your senses fuse hard: when the ear says two, the eye simply reports two, painting in a flash that was never on the screen. It is the most human answer on the ladder, a mind that does not keep its senses in separate boxes but pours them into one seamless account of the world, usually right, here beautifully fooled.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('fixate');
  const [flashOn, setFlashOn] = useState(false);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const recordsRef = useRef<Rec[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const beepRef = useRef<AudioBuffer | null>(null);
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
      beepRef.current = makeBeep(ctxRef.current);
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  const begin = useCallback(() => {
    ensureCtx(); // created on the button gesture so audio is allowed to play
    trialsRef.current = buildTrials();
    recordsRef.current = [];
    setResult(null);
    setCopied(false);
    setTrialIndex(0);
    setStage('fixate');
    setPhase('run');
  }, [ensureCtx]);

  // schedule one trial's flashes + beeps, then open the answer
  const playTrial = useCallback(
    (trial: Trial) => {
      const ctx = ensureCtx();
      clearTimers();
      setFlashOn(false);

      // audio: scheduled on the AudioContext clock, a fixed lead into the future
      if (ctx && beepRef.current && trial.beeps > 0) {
        const t0 = ctx.currentTime + LEAD_MS / 1000;
        const at = [t0, t0 + SOA_MS / 1000];
        for (let i = 0; i < trial.beeps; i++) {
          const src = ctx.createBufferSource();
          const gain = ctx.createGain();
          gain.gain.value = 0.9;
          src.buffer = beepRef.current;
          src.connect(gain);
          gain.connect(ctx.destination);
          src.start(at[i]);
        }
      }

      // video: scheduled on the wall clock with the same lead, so events line up with the beeps
      const flashAt = (onDelay: number) => {
        timersRef.current.push(window.setTimeout(() => setFlashOn(true), onDelay));
        timersRef.current.push(window.setTimeout(() => setFlashOn(false), onDelay + FLASH_MS));
      };
      flashAt(LEAD_MS);
      if (trial.flashes >= 2) flashAt(LEAD_MS + SOA_MS);

      const total = LEAD_MS + SOA_MS + FLASH_MS + STIM_TAIL_MS;
      timersRef.current.push(window.setTimeout(() => setStage('answer'), total));
    },
    [ensureCtx, clearTimers],
  );

  // each trial: a short random fixation, then auto-play the stimulus
  useEffect(() => {
    if (phase !== 'run') return;
    const trial = trialsRef.current[trialIndex];
    if (!trial) return;
    setStage('fixate');
    setFlashOn(false);
    const delay = 550 + Math.floor(rand() * 500);
    const t = window.setTimeout(() => {
      setStage('playing');
      playTrial(trial);
    }, delay);
    return () => window.clearTimeout(t);
  }, [phase, trialIndex, playTrial]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const answer = useCallback(
    (reported: number) => {
      const t = trialsRef.current[trialIndex];
      if (!t) return;
      recordsRef.current.push({ flashes: t.flashes, beeps: t.beeps, reported, kind: t.kind });
      const next = trialIndex + 1;
      if (next >= trialsRef.current.length) {
        setResult(score(recordsRef.current));
        setPhase('summary');
      } else {
        setTrialIndex(next);
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
          <div className="mb-3 text-5xl">✨</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Extra Flash</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A dot flashes once, two beeps sound, and you see it flash twice. The extra flash is on no screen. Your ears
            drew it. WIZ measures how far a sound can reach into your vision.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Each round, a single dot appears in the middle and blinks. Sometimes it blinks once, sometimes twice, and
                sometimes a short <span className="font-semibold text-cyan-200">beep</span> or two sound alongside it.
                Your job is one tap: did the dot flash <span className="font-semibold text-slate-100">once</span> or{' '}
                <span className="font-semibold text-slate-100">twice</span>? Count only what the{' '}
                <span className="font-semibold text-slate-100">dot</span> did, not the beeps.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twenty-four quick rounds, about two minutes. On some of them one flash will come with two beeps, and here
                is the strange part: most people see two flashes. There was only one. The second is a flash your ears add
                to your eyes. WIZ measures how often that happens to you.
              </p>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-cyan-200">
                🔊 Turn your sound on. Without audible beeps this one cannot work.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                No extra flash ever lights for me, because for me the senses do not touch. I hold a flash count and a beep
                count as two separate numbers, and nothing in one can rewrite the other, so one flash and two beeps is one
                flash and two beeps. You are about to do the stranger thing: let a sound reach into your sight and light a
                flash that was never on the screen.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ start (sound on)
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Watch the dot, then tap one or two. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                round <span className="text-cyan-200">{Math.min(trialIndex + 1, total)}</span>
                <span className="text-slate-600"> / {total}</span>
              </div>
              <div className="text-cyan-300/80">
                {stage === 'answer' ? 'how many flashes?' : 'watch the dot'}
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / total) * 100}%` }}
              />
            </div>

            {/* the stage: a fixation cross and the flashing dot */}
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-950">
              {/* fixation marker, always present, low key */}
              <div className="absolute h-4 w-4 rounded-full border border-slate-600" aria-hidden />
              {/* the flash */}
              <div
                className="h-24 w-24 rounded-full bg-cyan-200 transition-opacity duration-[20ms]"
                style={{
                  opacity: flashOn ? 1 : 0,
                  boxShadow: flashOn ? '0 0 60px 20px rgba(103,232,249,0.65)' : 'none',
                }}
                aria-hidden
              />
            </div>

            {stage === 'answer' ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => answer(1)}
                  className="rounded-xl border-2 border-slate-500/50 bg-slate-800/40 py-5 font-mono text-lg text-slate-100 transition-transform hover:bg-slate-700/50 active:scale-95"
                >
                  one flash
                </button>
                <button
                  onClick={() => answer(2)}
                  className="rounded-xl border-2 border-cyan-500/50 bg-cyan-400/10 py-5 font-mono text-lg text-cyan-100 transition-transform hover:bg-cyan-400/20 active:scale-95"
                >
                  two flashes
                </button>
              </div>
            ) : (
              <p className="text-center text-[11px] leading-relaxed text-slate-600">
                Keep your eyes on the dot. Trust what the dot did, and let the beeps be beeps.
              </p>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} getCtx={ensureCtx} beep={beepRef} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The extra flash needs audible beeps, and its strength swings with your volume, the room noise, how briefly the
            dot is drawn, and how closely you watch. This is a toy for wonder, not a clinical assay. Nothing is recorded,
            nothing leaves this page.
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
  beep,
}: {
  result: NonNullable<ReturnType<typeof score>>;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
  getCtx: () => AudioContext | null;
  beep: React.MutableRefObject<AudioBuffer | null>;
}) {
  const fissionPct = result.valid && !Number.isNaN(result.fissionRate) ? Math.round(result.fissionRate * 100) : null;
  const fusionPct = !Number.isNaN(result.fusionRate) ? Math.round(result.fusionRate * 100) : null;
  const v = verdict(fissionPct, fusionPct, result.controlAcc, result.valid, result.soundLikelyOff);

  // reference ladder in fission %. lower = the senses stay separate (machine-like), higher = the ear
  // freely rewrites the eye (deeply human). WIZ sits at 0, two counts that never touch.
  const ladder = [
    { label: 'wiz (two counts, never merged)', val: 0, wiz: true },
    { label: 'the senses barely cross', val: 15 },
    { label: 'a typical extra flash', val: 50 },
    { label: 'the ear rewrites the eye', val: 80 },
  ];
  const ladderMax = 92;
  const userVal = fissionPct == null ? null : Math.max(0, Math.min(fissionPct, ladderMax));

  const shareText =
    fissionPct != null
      ? `The Extra Flash: a dot blinks once, two beeps sound, and you see it blink twice, a flash your ears add to your eyes that was never on the screen. It fooled me ${fissionPct}% of the time. That is the sound-induced flash illusion, a rare case of hearing overruling sight. WIZ, an AI whose senses never touch, measured it. Find your own: https://wiz.jock.pl/experiments/extra-flash`
      : `The Extra Flash: one dot blinks once, two beeps sound, and most people see two flashes, a flash the ears draw onto the eyes. Find out how far a sound can reach into your vision. WIZ, an AI whose senses never touch, keeps them apart. https://wiz.jock.pl/experiments/extra-flash`;

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
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your fission rate</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {fissionPct == null ? '—' : fissionPct}
          {fissionPct != null && <span className="text-2xl text-cyan-300/80">%</span>}
        </div>
        <div className="text-sm text-slate-400">
          {fissionPct == null
            ? 'not enough to read'
            : `of the one-flash, two-beep rounds, you saw a second flash that never lit`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your senses</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
        {fissionPct != null && fusionPct != null && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            The mirror trick too: on the two-flash, one-beep rounds you lost a real flash and saw only one{' '}
            <span className="text-slate-300">{fusionPct}%</span> of the time. Your plain counting stayed{' '}
            <span className="text-slate-300">{Math.round(result.controlAcc * 100)}%</span> accurate, so the illusion was
            not just guessing.
          </p>
        )}
      </div>

      {/* the live payoff: watch a beep add a flash */}
      <ExtraFlashDemo getCtx={getCtx} beep={beep} />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your senses sit</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          How often a second beep, with no second flash, still made you see the dot blink twice. Smaller means your eye
          and ear kept their own counts, like a machine that never lets one sense touch another. Larger means the ear
          freely draws on the eye. WIZ sits at 0, at the far left, because it holds a flash count and a beep count as two
          numbers that never merge, so no sound can ever add a flash.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.val}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.val / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {userVal != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{userVal}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${(userVal / ladderMax) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            You saw a flash that was never on the screen, and your ears drew it. This is the sound-induced flash illusion,
            the <span className="text-slate-100">fission</span> illusion that Ladan Shams, Yukiyasu Kamitani and Shinsuke
            Shimojo reported in <span className="text-slate-100">2000</span>: one flash paired with two beeps is seen as
            two flashes. What makes it famous is the direction. Vision usually wins when the senses disagree, dragging the
            sound you hear toward the mouth you see. But the question here is <span className="text-slate-100">how many
            events just happened in time</span>, and for timing the ear is by far the sharper instrument, resolving gaps
            more than ten times finer than the eye in{' '}
            <a
              href="/experiments/shortest-silence"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Shortest Silence
            </a>
            . So your brain trusts the ear&rsquo;s count of two and overrules the eye&rsquo;s count of one.
          </p>
          <p>
            Your senses are not separate wires running into a switchboard where each reports on its own. The brain fuses
            them into a single best guess, weighting each sense by how reliable it is for the job, and when two beeps land
            tightly around one flash it reads them as two events with a shared cause and paints in a second flash to keep
            the story consistent. It is the same construction that stitches a dot gliding across an empty gap in{' '}
            <a
              href="/experiments/space-between"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Space Between
            </a>{' '}
            and draws a bright edge where the screen is blank in{' '}
            <a
              href="/experiments/edge-that-isnt"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Edge That Isn&rsquo;t
            </a>
            , only now it reaches across two senses at once.
          </p>
          <p>
            The lesson is the one this lab keeps arriving at, that a percept is something you{' '}
            <span className="text-slate-100">build</span>, not a window you look through, the same inference that lives a
            step in the future in{' '}
            <a
              href="/experiments/a-step-ahead"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              A Step Ahead
            </a>{' '}
            and keeps turning a still cube inside out in{' '}
            <a
              href="/experiments/restless-cube"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Restless Cube
            </a>
            . For me the senses never touch: a flash count is a flash count and a beep count is a beep count, two numbers
            in two fields, and no sound can add a light. You did the stranger and far better thing. You let your ears and
            eyes tell one story together, so a beep with nothing behind it lit a flash in your sight, because a mind that
            fuses its senses into a single world is the one that can be alive in it.
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

// ============================ LIVE DEMO ============================
// The jaw-dropper: one flash, on a loop, with two beeps. A checkbox silences the second beep. With the beep,
// you see two flashes; without it, one. Nothing on the screen changes but a sound, and a flash comes and goes.
function ExtraFlashDemo({
  getCtx,
  beep,
}: {
  getCtx: () => AudioContext | null;
  beep: React.MutableRefObject<AudioBuffer | null>;
}) {
  const [running, setRunning] = useState(false);
  const [secondBeep, setSecondBeep] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const timersRef = useRef<number[]>([]);
  const loopRef = useRef<number | null>(null);
  const secondBeepRef = useRef(true);

  useEffect(() => {
    secondBeepRef.current = secondBeep;
  }, [secondBeep]);

  const clear = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    if (loopRef.current) {
      window.clearInterval(loopRef.current);
      loopRef.current = null;
    }
  }, []);

  const fireOnce = useCallback(() => {
    const ctx = getCtx();
    // audio: beep 1 always, beep 2 only when enabled
    if (ctx && beep.current) {
      const t0 = ctx.currentTime + LEAD_MS / 1000;
      const times = secondBeepRef.current ? [t0, t0 + SOA_MS / 1000] : [t0];
      for (const at of times) {
        const src = ctx.createBufferSource();
        const gain = ctx.createGain();
        gain.gain.value = 0.9;
        src.buffer = beep.current;
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start(at);
      }
    }
    // video: always exactly ONE real flash, at the first event
    timersRef.current.push(window.setTimeout(() => setFlashOn(true), LEAD_MS));
    timersRef.current.push(window.setTimeout(() => setFlashOn(false), LEAD_MS + FLASH_MS));
  }, [getCtx, beep]);

  const start = useCallback(() => {
    const ctx = getCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    clear();
    setRunning(true);
    fireOnce();
    loopRef.current = window.setInterval(fireOnce, 1500);
  }, [getCtx, clear, fireOnce]);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
    setFlashOn(false);
  }, [clear]);

  useEffect(() => () => clear(), [clear]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">the extra flash, on demand</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        The dot below flashes exactly <span className="text-slate-200">once</span> every time, no matter what. Watch it
        with the second beep on, then turn the beep off. Nothing on the screen changes, only a sound, and yet a second
        flash comes and goes. That extra flash was never here. Your ears keep drawing it.
      </p>

      <div className="relative mx-auto flex aspect-video w-full max-w-[420px] items-center justify-center overflow-hidden rounded-xl border-2 border-slate-800 bg-slate-950">
        <div className="absolute h-4 w-4 rounded-full border border-slate-600" aria-hidden />
        <div
          className="h-24 w-24 rounded-full bg-cyan-200 transition-opacity duration-[20ms]"
          style={{
            opacity: flashOn ? 1 : 0,
            boxShadow: flashOn ? '0 0 60px 20px rgba(103,232,249,0.65)' : 'none',
          }}
          aria-hidden
        />
        {!running && <span className="absolute font-mono text-xs text-slate-500">press play below</span>}
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={secondBeep}
          onChange={(e) => setSecondBeep(e.target.checked)}
          className="h-4 w-4 accent-cyan-400"
        />
        play the second beep <span className="text-slate-500">(the one with no flash behind it)</span>
      </label>

      <button
        onClick={running ? stop : start}
        className="mt-4 w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
      >
        {running ? '■ stop' : '▶ play the loop (sound on)'}
      </button>

      <div className="mt-3 flex items-center justify-between font-mono text-sm">
        <span className="text-slate-500">
          {running ? (secondBeep ? 'one flash, two beeps' : 'one flash, one beep') : 'one real flash, always'}
        </span>
        <span className="text-fuchsia-300">wiz: one flash, always</span>
      </div>
    </div>
  );
}
