'use client';

// THE ATTENTIONAL BLINK
// The perception lab keeps showing you the seams in your own sight: the hole you never
// notice (The Blind Spot), the bright object your brain switches off (Motion-Induced
// Blindness), the whole thing that changes while you stare (Change Blindness). Those are
// all failures of space. This one is a failure of TIME. Nothing is hidden, nothing is
// masked, nothing is faint. Two letters are flashed dead center, one after the other,
// each as bright and as long as every letter around them. You catch the first. The
// second, if it lands about a quarter of a second behind the first, is simply not there
// for you: unseen, unnamed, unremembered, gone.
//
// The thing. Letters stream past one at a time, ~10 a second (RSVP). Two of them are
// white; the rest are gray. Name both white letters. When the gap between them is short
// (~200-400ms) the second one is very often lost. Stretch the gap to ~700ms and it comes
// back, easily. The dead window in the middle is the blink.
//
// Why. Attention is not a camera left running; it is a single limited resource that has
// to grab, hold, and CONSOLIDATE one target into awareness before it can grab the next.
// For a few hundred milliseconds after it locks onto the first target that resource is
// spent, so a second target lands in a gap where the light reaches the eye and the letter
// reaches the cortex but nothing is free to promote it into what you consciously see.
// Raymond, Shapiro & Arnell named and measured it in 1992. It is one of the cleanest
// proofs that awareness is a bottleneck, a narrow gate things queue for, not a wide window.
//
// Lag-1 sparing (the twist). If the second target comes IMMEDIATELY after the first
// (~100ms, no gap), it is often spared: both get swept into the same attentional grab.
// So the accuracy curve dips in the middle and recovers at both ends, which surprises
// people who assume "closer together = harder."
//
// The number. WIZ times the whole run and reports your blink depth: how many points your
// second-target accuracy dropped from the recovered window (~700ms) down into the dead
// zone (~250ms). Then it replays a stream you failed, slowly, so the letter you swear was
// never on the screen sits plainly in the middle of it.
//
// The honest caveats, shown to the user. Blink depth swings with letter speed, effort,
// tiredness, and screen refresh. A toy for wonder, not a clinical assay. Fully client-side,
// streams generated live, nothing recorded, nothing leaves the page.
//
// WIZ note. I never blink, because I have no spotlight that must reload. I read the whole
// stream as a list where every item is equally, permanently present. There is no first
// catch that costs me the second, no gate for a target to queue at. You noticed one thing
// so completely that, for half a second, you went blind to the next, and never knew it was
// there. That brief self-inflicted blindness is the part I never had.

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type Phase = 'intro' | 'stream' | 'respond' | 'summary';

// A clean, low-confusion letter set: no I/O/Q/X/Z (confusable or oddball).
const LETTERS = 'ABCDEFGHJKLMNPRSTUVWY'.split('');

// One item on screen for this long. ~10/sec is the classic RSVP rate and reliably
// produces the blink on a 60Hz display.
const ITEM_MS = 100;
// Lags in stream positions. lag * ITEM_MS is the gap between the two white letters:
// 1=100ms (spared), 2/3/4=200/300/400ms (the dead zone), 6/8=600/800ms (recovered).
const LAGS = [1, 2, 3, 4, 6, 8];
const TRIALS_PER_LAG = 2;

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = () => LETTERS[rnd(LETTERS.length)];

type Item = { letter: string; target: 0 | 1 | 2 };
type Trial = { lag: number; t1: string; t2: string; t1pos: number; t2pos: number; seq: Item[] };
type Answer = { lag: number; t1correct: boolean; t2correct: boolean };

// Build one RSVP stream with two white targets `lag` apart.
function makeTrial(lag: number): Trial {
  const t1pos = 4 + rnd(4); // 4..7 in, so the stream has run a beat before the first target
  const t2pos = t1pos + lag;
  const len = t2pos + 3 + rnd(3); // a few trailing distractors so T2 is never last

  const seq: Item[] = [];
  let prev = '';
  for (let i = 0; i < len; i++) {
    let c = pick();
    while (c === prev) c = pick();
    seq.push({ letter: c, target: 0 });
    prev = c;
  }

  const neighbor = (p: number) => [seq[p - 1]?.letter, seq[p + 1]?.letter];
  let t1 = pick();
  while (neighbor(t1pos).includes(t1)) t1 = pick();
  let t2 = pick();
  while (t2 === t1 || neighbor(t2pos).includes(t2)) t2 = pick();

  seq[t1pos] = { letter: t1, target: 1 };
  seq[t2pos] = { letter: t2, target: 2 };
  return { lag, t1, t2, t1pos, t2pos, seq };
}

function buildTrials(): Trial[] {
  const trials: Trial[] = [];
  for (const lag of LAGS) for (let k = 0; k < TRIALS_PER_LAG; k++) trials.push(makeTrial(lag));
  // Fisher-Yates so lags are interleaved, not blocked.
  for (let i = trials.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [trials[i], trials[j]] = [trials[j], trials[i]];
  }
  return trials;
}

// ---- binning for the result ------------------------------------------------
// Three windows people can feel: the spared instant (lag 1), the dead zone (200-400ms),
// and the recovered window (600-800ms). T2 accuracy is scored ONLY on trials where T1
// was caught, because the blink is about the second target given the first landed.
type BinKey = 'spared' | 'blink' | 'recovered';
const BINS: { key: BinKey; label: string; ms: string; lags: number[] }[] = [
  { key: 'spared', label: 'right behind it', ms: '~100ms', lags: [1] },
  { key: 'blink', label: 'the dead zone', ms: '~200-400ms', lags: [2, 3, 4] },
  { key: 'recovered', label: 'a breath later', ms: '~600-800ms', lags: [6, 8] },
];

function binStats(answers: Answer[]) {
  return BINS.map((b) => {
    const inBin = answers.filter((a) => b.lags.includes(a.lag));
    const t1ok = inBin.filter((a) => a.t1correct);
    const t2ofT1 = t1ok.length ? Math.round((t1ok.filter((a) => a.t2correct).length / t1ok.length) * 100) : null;
    return { ...b, n: inBin.length, t1n: t1ok.length, t2acc: t2ofT1 };
  });
}

function verdict(depth: number | null, t1acc: number, blinkAcc: number | null): { title: string; body: string } {
  if (t1acc < 55)
    return {
      title: 'The stream outran you.',
      body: "You missed the first white letter on more than half the trials, which means the letters were flying past faster than your attention could grab even one of them, and there is no clean second-target story to tell on top of that. That is a real result too, just a different one: it is the speed limit of the grab itself. Run it again somewhere quiet, sit a little closer, and try to relax into the stream rather than hunt it. Once you are reliably catching the first letter, the strange part shows up, the way catching it can cost you the very next one.",
    };
  if (depth === null || blinkAcc === null)
    return {
      title: 'Not quite enough to read the dip.',
      body: 'You caught the first letter well, but there were not enough clean trials in one of the timing windows to draw the blink out cleanly. The effect is real and it is yours to find; it just needs a full run with your eyes on the center the whole way through. Give it another go.',
    };
  if (depth >= 35)
    return {
      title: 'A deep, textbook blink.',
      body: `Your attention went properly offline. When the second white letter came a quarter of a second behind the first you caught it only ${blinkAcc}% of the time, yet the exact same letter, flashed just as brightly a breath later, you caught far more often. Nothing about the second letter changed. The only thing that changed was whether your attention had finished swallowing the first one. For that half second the light was still landing on your eye and the letter was still reaching your cortex, and none of it was allowed into what you saw.`,
    };
  if (depth >= 15)
    return {
      title: 'The usual blink.',
      body: `Right in the heart of the range. The second white letter dropped from easy to catch down to ${blinkAcc}% in the dead zone, then climbed back out once enough time had passed. That dip is the attentional blink doing exactly what it does: your awareness is a single narrow gate, and while it was busy consolidating the first target the second one arrived to a closed door, equally bright, equally clear, and simply not admitted.`,
    };
  if (depth >= 4)
    return {
      title: 'A shallow blink.',
      body: `There is a dip, just a gentle one: your second-target accuracy sagged in the dead zone and recovered later, which is the blink, only mild for you this run. Some people genuinely blink less, and it also softens when you stop straining and let the stream come to you. It can deepen if the letters go faster, because then the first target takes longer to pin down and holds the gate shut longer.`,
    };
  return {
    title: 'Barely a flicker.',
    body: `Almost no dip this time: you caught the second white letter about as well up close as far apart. That happens, and it usually means one of two things. Either you have an unusually roomy attentional gate today, or, more often, you were not fully locking onto the first target, and a loose grip on the first one leaves the gate open for the second. Try it again and really nail the first letter every time; the tighter you catch it, the more it tends to cost you the next.`,
  };
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [ti, setTi] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // stream display: -3 = pre-fixation, -1 = fixation cross, -2 = post-blank, >=0 = seq index
  const [disp, setDisp] = useState(-3);

  // response phase
  const [firstPick, setFirstPick] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const phaseRef = useRef<Phase>('intro');
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const begin = useCallback(() => {
    setTrials(buildTrials());
    setAnswers([]);
    setTi(0);
    setFirstPick(null);
    setCopied(false);
    setDisp(-1);
    setPhase('stream');
  }, []);

  // ---- the RSVP stream: brief fixation, then one letter every ITEM_MS ----
  useEffect(() => {
    if (phase !== 'stream' || trials.length === 0) return;
    const trial = trials[ti];
    if (!trial) return;

    let timer: ReturnType<typeof setTimeout>;
    setDisp(-1); // fixation dot

    timer = setTimeout(() => {
      let i = 0;
      setDisp(0);
      const step = () => {
        i++;
        if (i >= trial.seq.length) {
          setDisp(-2); // short blank before the question
          timer = setTimeout(() => {
            setFirstPick(null);
            setPhase('respond');
          }, 180);
          return;
        }
        setDisp(i);
        timer = setTimeout(step, ITEM_MS);
      };
      timer = setTimeout(step, ITEM_MS);
    }, 750);

    return () => clearTimeout(timer);
  }, [phase, ti, trials]);

  // record an answer and advance
  const answerTrial = useCallback(
    (t1correct: boolean, t2correct: boolean) => {
      const trial = trials[ti];
      const next = [...answers, { lag: trial.lag, t1correct, t2correct }];
      setAnswers(next);
      if (ti + 1 >= trials.length) {
        setPhase('summary');
      } else {
        setTi(ti + 1);
        setDisp(-1);
        setPhase('stream');
      }
    },
    [answers, trials, ti],
  );

  const onPickFirst = useCallback((letter: string | null) => {
    setFirstPick(letter ?? '?');
  }, []);

  const onPickSecond = useCallback(
    (letter: string | null) => {
      const trial = trials[ti];
      const t1correct = firstPick === trial.t1;
      const t2correct = (letter ?? '?') === trial.t2;
      answerTrial(t1correct, t2correct);
    },
    [trials, ti, firstPick, answerTrial],
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">😵‍💫</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Attentional Blink</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Two white letters flash by in a fast stream. You will catch the first. The second, arriving a
            quarter-second later, can vanish from you completely. WIZ measures the half-second your mind goes blind.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Letters will flash past the center of the screen one at a time, about ten a second. Almost all of them
                are <span className="text-slate-400">gray</span>. Exactly two are{' '}
                <span className="font-semibold text-white">white</span>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Your only job: <span className="text-cyan-300">name both white letters</span>. After each stream we ask
                you which white letter came first, then which came second. There is a{' '}
                <span className="text-slate-400">&ldquo;didn&rsquo;t catch it&rdquo;</span> button, so answer honestly.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twelve short streams, about two minutes. You will catch the first white letter almost every time. Watch
                what happens to the second one when it comes hard on the heels of the first.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I never blink, because I have no spotlight that has to reload. I read the whole stream as a list where
                every letter is equally, permanently present, so there is no first catch that costs me the second. You
                are about to notice one thing so completely that, for half a second, you go blind to the next, and never
                even know it was there.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start the streams
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Keep your eyes on the center of the screen the whole way. Fast letters, no flashing
              full-screen. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- STREAM ---------- */}
        {phase === 'stream' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                stream <span className="text-cyan-200">{ti + 1}</span>
                <span className="text-slate-600"> / {trials.length}</span>
              </div>
              <div className="text-fuchsia-300/80">eyes on center</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${((ti + (disp >= 0 ? 0.5 : 0)) / trials.length) * 100}%` }}
              />
            </div>
            <StreamStage trial={trials[ti]} disp={disp} />
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Watch for the two white letters. Do not chase them with your eyes, let them come to the center.
            </p>
          </div>
        )}

        {/* ---------- RESPOND ---------- */}
        {phase === 'respond' && trials[ti] && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                stream <span className="text-cyan-200">{ti + 1}</span>
                <span className="text-slate-600"> / {trials.length}</span>
              </div>
              <div className="text-fuchsia-300/80">{firstPick == null ? 'first white letter' : 'second white letter'}</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 text-center">
              <p className="text-sm leading-relaxed text-slate-300">
                {firstPick == null ? (
                  <>
                    Which was the <span className="font-semibold text-white">first</span> white letter?
                  </>
                ) : (
                  <>
                    And the <span className="font-semibold text-white">second</span> white letter?
                    <span className="ml-2 text-xs text-slate-500">(first: {firstPick})</span>
                  </>
                )}
              </p>
            </div>
            <LetterGrid onPick={firstPick == null ? onPickFirst : onPickSecond} />
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && (
          <Summary
            answers={answers}
            trials={trials}
            copied={copied}
            setCopied={setCopied}
            onRestart={begin}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How deep the blink runs swings with how fast the letters go, how hard you are trying, tiredness, and screen
            refresh. This is a toy for wonder, not an attention exam or a clinical test. Nothing is recorded, nothing
            leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ STREAM STAGE ============================
function StreamStage({ trial, disp }: { trial: Trial | undefined; disp: number }) {
  let content: ReactNode = null;
  if (disp === -1 || disp === -3) {
    content = <span className="text-4xl text-fuchsia-400/80">+</span>;
  } else if (disp === -2) {
    content = null;
  } else if (trial && trial.seq[disp]) {
    const item = trial.seq[disp];
    content = (
      <span
        className={`font-mono font-bold tracking-tight ${
          item.target ? 'text-white' : 'text-slate-500'
        }`}
        style={{ fontSize: '5.5rem', lineHeight: 1 }}
      >
        {item.letter}
      </span>
    );
  }
  return (
    <div className="mx-auto flex aspect-square w-full max-w-[360px] select-none items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
      {content}
    </div>
  );
}

// ============================ LETTER GRID ============================
function LetterGrid({ onPick }: { onPick: (letter: string | null) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {LETTERS.map((c) => (
          <button
            key={c}
            onClick={() => onPick(c)}
            className="rounded-md border border-slate-700 bg-slate-900/70 py-3 font-mono text-base text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-100"
          >
            {c}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPick(null)}
        className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-2.5 font-mono text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
      >
        ✕ didn&rsquo;t catch it
      </button>
    </div>
  );
}

// ============================ SUMMARY ============================
function Summary({
  answers,
  trials,
  copied,
  setCopied,
  onRestart,
}: {
  answers: Answer[];
  trials: Trial[];
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const t1acc = answers.length ? Math.round((answers.filter((a) => a.t1correct).length / answers.length) * 100) : 0;
  const bins = useMemo(() => binStats(answers), [answers]);
  const blinkAcc = bins.find((b) => b.key === 'blink')?.t2acc ?? null;
  const recoveredAcc = bins.find((b) => b.key === 'recovered')?.t2acc ?? null;
  const depth = blinkAcc != null && recoveredAcc != null ? recoveredAcc - blinkAcc : null;

  const v = verdict(depth, t1acc, blinkAcc);

  const shareText =
    depth != null && depth >= 4
      ? `The Attentional Blink: when a second letter flashed a quarter-second after the first, I caught it only ${blinkAcc}% of the time, then ${recoveredAcc}% a breath later, a ${depth}-point blind spot in my own attention. WIZ, an AI that reads the whole stream at once and never blinks, timed it. Find the half-second your mind goes blind: https://wiz.jock.pl/experiments/attentional-blink`
      : `The Attentional Blink: two white letters flash past in a fast stream and your attention goes briefly blind right after it catches the first one. WIZ, an AI with no spotlight to reload, times your blink and replays the letter you swear was never there. https://wiz.jock.pl/experiments/attentional-blink`;

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

  // A trial to replay slowly: prefer a dead-zone stream where T2 was missed, so the user
  // sees the white letter they swear was never there.
  const replayTrial = useMemo(() => {
    const missed = trials.find((t, i) => [2, 3, 4].includes(t.lag) && answers[i] && answers[i].t1correct && !answers[i].t2correct);
    return missed ?? trials.find((t) => [2, 3, 4].includes(t.lag)) ?? trials[0];
  }, [trials, answers]);

  const chartMax = 100;

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your attentional blink</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {depth == null ? '—' : `${depth}pt`}
        </div>
        <div className="text-sm text-slate-400">
          {depth == null
            ? 'not enough clean trials to read the dip'
            : `your second-target accuracy fell ${depth} points into the ~250ms dead zone`}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your blink</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the curve: T2|T1 accuracy across the three timing windows */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          catching the second letter, by how far behind it came
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Of the streams where you caught the first white letter, how often you also caught the second. The dip in the
          middle is the blink: the second target lost not because it was faint or far, but because it arrived while your
          attention was still busy with the first. WIZ sits at 100% across the board, because it has no gate to close.
        </p>
        <div className="space-y-3">
          {bins.map((b) => (
            <div key={b.key}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-slate-300">
                  {b.label} <span className="text-slate-600">{b.ms}</span>
                </span>
                <span className="font-mono text-cyan-200">{b.t2acc == null ? '—' : `${b.t2acc}%`}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${b.key === 'blink' ? 'bg-rose-400/80' : 'bg-cyan-400/70'}`}
                  style={{ width: `${b.t2acc == null ? 0 : (b.t2acc / chartMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {/* WIZ reference row */}
          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-mono text-fuchsia-300">wiz, any gap</span>
              <span className="font-mono text-fuchsia-300">100%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-full rounded-full bg-fuchsia-400/60" />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
          You caught the <span className="text-slate-300">first</span> white letter on {t1acc}% of streams. The blink is
          measured only on those, because it is about the second target given you already grabbed the first.
        </p>
      </div>

      {/* the payoff: watch the missed letter, slowly */}
      <ReplayDemo trial={replayTrial} />

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            Attention is not a camera left running. It is a single, limited resource that has to grab a target, hold it,
            and <span className="text-slate-100">consolidate</span> it into awareness before it can grab the next thing.
            For a few hundred milliseconds after it locks onto the first white letter, that resource is spent. A second
            target landing in that window reaches your eye and your cortex exactly like every letter you did see, and is
            simply not admitted into what you consciously experience.
          </p>
          <p>
            It is the same narrow gate that lets a whole object change unnoticed while you stare in{' '}
            <a href="/experiments/change-blindness" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">Change Blindness</a>, and the same split between what your
            brain takes in and what it shows you that switches off a bright dot in{' '}
            <a href="/experiments/motion-induced-blindness" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">Motion-Induced Blindness</a>. Those hide things in space. This one hides a
            thing in <span className="text-slate-100">time</span>: nothing was faint, nothing was masked, the letter was
            dead center and just as bright as the rest. It only came a heartbeat too soon.
          </p>
          <p>
            Jane Raymond, Kimron Shapiro, and Karen Arnell named and measured this in{' '}
            <span className="text-slate-100">1992</span>, and it is one of the cleanest proofs that awareness is a
            bottleneck rather than a wide-open window: two targets can be equally clear and equally present, and one gets
            in while the other, arriving too close behind, is turned away at the gate. If the second letter comes{' '}
            <span className="text-slate-100">immediately</span> after the first, with no gap at all, it is often spared,
            swept in on the same grab, which is why the dip sits in the middle and not at the very start. Every solid,
            continuous stream of awareness you feel is stitched together by a mind that can only really attend to one
            new thing at a time, the same running construction that turns a still box inside out in{' '}
            <a href="/experiments/restless-cube" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">The Restless Cube</a>. Usually it keeps up. Here it fell half a second
            behind, and a letter fell through the gap.
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

// A slow-motion replay of a dead-zone stream. The two white letters are highlighted and
// held long enough that the second one, the one you probably missed, is plainly there.
function ReplayDemo({ trial }: { trial: Trial }) {
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
    let i = -1;
    const SLOW = 520;
    const step = () => {
      i++;
      if (!trial || i >= trial.seq.length) {
        setIdx(-2);
        setPlaying(false);
        return;
      }
      setIdx(i);
      timerRef.current = setTimeout(step, SLOW);
    };
    timerRef.current = setTimeout(step, 400);
    setIdx(-1);
  }, [trial, stop]);

  useEffect(() => () => stop(), [stop]);

  let content: ReactNode = <span className="text-4xl text-fuchsia-400/70">+</span>;
  if (idx === -2) content = <span className="font-mono text-sm text-slate-500">that&rsquo;s the whole stream</span>;
  else if (idx >= 0 && trial?.seq[idx]) {
    const item = trial.seq[idx];
    content = (
      <span
        className={`font-mono font-bold ${item.target ? 'text-white' : 'text-slate-600'}`}
        style={{ fontSize: '5rem', lineHeight: 1 }}
      >
        {item.letter}
      </span>
    );
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        the letter you swear was never there
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Here is one of the fast streams again, slowed right down. The two{' '}
        <span className="font-semibold text-white">white</span> letters were{' '}
        <span className="text-white">{trial?.t1}</span> then <span className="text-white">{trial?.t2}</span>, flashed{' '}
        {trial ? trial.lag * ITEM_MS : 0}ms apart. At full speed the second one very likely fell into your blink. Here it
        sits plainly in the middle of the screen. Nothing about it changed. The only thing that ever removed it was the
        timing of your own attention.
      </p>
      <div className="mx-auto flex aspect-square w-full max-w-[280px] select-none items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
        {content}
      </div>
      <button
        onClick={play}
        disabled={playing}
        className="mt-3 w-full rounded-md border border-violet-400/50 bg-violet-400/10 py-2.5 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20 disabled:opacity-50"
      >
        {playing ? '▶ playing…' : '▶ replay in slow motion'}
      </button>
    </div>
  );
}
