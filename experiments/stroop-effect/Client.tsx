'use client';

// THE STROOP EFFECT
// Most experiments in this lab ask you to rate scenarios and then measure the
// gap between your intuition and the literature. This one, like the Serial
// Position Effect, does the effect TO you and lets you watch it happen in your
// own head in real time. There is no opinion to give. There is only your
// reaction time, and the seam it exposes.
//
// The finding. Stroop (1935) "Studies of Interference in Serial Verbal
// Reactions" Journal of Experimental Psychology vol 18 showed that naming the
// ink color of a word is dramatically slower when the word itself names a
// different color (the word RED printed in blue ink) than when the word and
// ink agree, or when the stimulus is a neutral color patch. Reading the word
// is fast and involuntary; naming the ink requires you to suppress the reading
// you cannot help doing. The lag between conflicting and matching trials is the
// Stroop interference, and it is one of the most reliable effects in all of
// psychology.
//
// Why it happens. Automaticity (Posner & Snyder 1975; Shiffrin & Schneider
// 1977). For a literate adult, reading has been practiced so many times that it
// runs without intention and without effort, faster than color naming, which
// stays comparatively controlled and slow. When the two responses disagree, the
// faster automatic one (reading) arrives first and has to be overridden by the
// slower controlled one (color naming). That override takes time, and the time
// is the interference. Cohen, Dunbar & McClelland (1990) Psychological Review
// vol 97 modeled the whole pattern with a connectionist network in which the
// reading pathway is simply more strongly trained, and reproduced the
// asymmetry: words interfere with color naming far more than colors interfere
// with word reading (MacLeod & Dunbar 1988). MacLeod (1991) "Half a Century of
// Research on the Stroop Effect" Psychological Bulletin vol 109 is the
// definitive review: the effect survives across languages, modalities, decades,
// and thousands of studies, and it scales with how automatic the competing
// dimension is.
//
// Boundaries and reach. The interference shrinks with practice on color naming,
// with slower deliberate responding, and in people with stronger inhibitory
// control; it grows under time pressure and fatigue. The task is so sensitive
// to executive function that clinical and developmental versions of it are
// standard instruments. Outside the lab the same machinery runs constantly: the
// first interpretation you read off a face, a headline, a price, a name arrives
// automatically and colors everything after it, and choosing a different
// reading costs exactly the kind of effort you are about to feel.
//
// WIZ note. I am going to flash color words at you in colored ink. Your only
// job is to tap the color of the INK, never the word. Most trials the two will
// agree and it will feel trivial. Some trials they will fight, and you will
// feel a tiny hitch, a half-beat where your hand wants to obey the word. I am
// timing every single tap. At the end I will show you the gap between the
// trials that agreed and the trials that fought, in milliseconds. That gap is
// the price your own brain charges to override a reflex. You did not choose to
// read the words. You cannot not read them. That is the whole point.

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

type ColorKey = 'red' | 'green' | 'blue' | 'yellow';

const COLORS: ColorKey[] = ['red', 'green', 'blue', 'yellow'];

const INK: Record<ColorKey, string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
};

// Button fills are a touch deeper so the label text reads cleanly.
const BTN: Record<ColorKey, { bg: string; text: string; label: string }> = {
  red: { bg: '#b91c1c', text: '#ffffff', label: 'RED' },
  green: { bg: '#15803d', text: '#ffffff', label: 'GREEN' },
  blue: { bg: '#1d4ed8', text: '#ffffff', label: 'BLUE' },
  yellow: { bg: '#ca8a04', text: '#1c1917', label: 'YELLOW' },
};

const PRACTICE = 3;
const SCORED_PER_TYPE = 9; // 9 congruent + 9 incongruent = 18 scored
const FIXATION_MS = 480; // the "+" before each stimulus
const FEEDBACK_MS = 140; // brief flash after a response
const RT_MIN = 200; // below this is anticipation, dropped from medians
const RT_MAX = 4000; // above this is a lapse, dropped from medians

// Textbook interference band for a button-press Stroop in healthy adults,
// pooled from the MacLeod (1991) review family. Used only as a reference line.
const REF_LOW = 100;
const REF_HIGH = 250;

interface Trial {
  word: ColorKey; // the printed word
  ink: ColorKey; // the color it is printed in (the correct answer)
  congruent: boolean;
  scored: boolean;
}

interface Response {
  trial: Trial;
  answer: ColorKey;
  correct: boolean;
  rt: number; // ms
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeCongruent(): Trial {
  const c = pick(COLORS);
  return { word: c, ink: c, congruent: true, scored: true };
}

function makeIncongruent(): Trial {
  const word = pick(COLORS);
  let ink = pick(COLORS);
  while (ink === word) ink = pick(COLORS);
  return { word, ink, congruent: false, scored: true };
}

function buildTrials(): Trial[] {
  // 3 warm-up trials (mixed, not scored), then a shuffled scored block.
  const practice: Trial[] = [];
  for (let i = 0; i < PRACTICE; i++) {
    const t = i % 2 === 0 ? makeCongruent() : makeIncongruent();
    practice.push({ ...t, scored: false });
  }

  const scored: Trial[] = [];
  for (let i = 0; i < SCORED_PER_TYPE; i++) scored.push(makeCongruent());
  for (let i = 0; i < SCORED_PER_TYPE; i++) scored.push(makeIncongruent());

  // Shuffle, then nudge so the same ink never lands twice in a row (kills
  // motor priming that would muddy the timing).
  let order = shuffle(scored);
  for (let i = 1; i < order.length; i++) {
    if (order[i].ink === order[i - 1].ink) {
      const swap = order.findIndex((t, j) => j > i && t.ink !== order[i - 1].ink);
      if (swap !== -1) [order[i], order[swap]] = [order[swap], order[i]];
    }
  }

  return [...practice, ...order];
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

interface ProfileSpec {
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  wizNote: string;
  shareText: string;
}

interface ResultShape {
  medCong: number;
  medIncong: number;
  interference: number; // medIncong - medCong
  congAcc: number; // 0..1
  incongAcc: number;
  overallAcc: number;
  congErrors: number;
  incongErrors: number;
  validCong: number;
  validIncong: number;
  profile: ProfileSpec;
}

function computeProfile(r: {
  interference: number;
  congAcc: number;
  incongAcc: number;
  overallAcc: number;
  incongErrors: number;
  validCong: number;
  validIncong: number;
  medCong: number;
}): ProfileSpec {
  const {
    interference,
    congAcc,
    incongAcc,
    overallAcc,
    incongErrors,
    validCong,
    validIncong,
    medCong,
  } = r;

  // Guard 1: not enough clean trials, or near-random tapping. Inconclusive.
  if (validCong < 3 || validIncong < 3 || overallAcc < 0.55) {
    return {
      emoji: '📺',
      name: 'The Static',
      tagline: 'Too few clean trials to read a signal. The timing came back as noise.',
      description:
        'Either most of your responses were too fast to be real choices, too slow to be reactions, or simply wrong too often to compare. The Stroop effect only becomes legible when you are genuinely trying to name the ink on each trial, which means looking, deciding, and tapping, not racing or guessing. This is not a verdict on your attention, it is a measurement that did not get enough clean data points to draw a conclusion. Run it again and treat each word as a real little decision: read nothing, look at the color, tap it. The gap will appear on its own.',
      wizNote:
        'No signal is still information: it usually means the task was being raced rather than performed. The interesting version is the rerun where you slow down by a hair and actually attend to the ink. Most people go from noise to a clean fifty-to-two-hundred-millisecond gap on the second try. The effect is in there. It needs you to be honestly trying to name colors.',
      shareText:
        'WIZ ran me through the Stroop test and my timing came back as static, too rushed to read. Rerunning, this time actually naming the ink.',
    };
  }

  // Guard 2: the word won often enough to produce errors, not just lag.
  if (incongErrors >= 3 && incongAcc <= congAcc - 0.15) {
    return {
      emoji: '🤖',
      name: 'The Autopilot',
      tagline: 'On the hard trials your hand obeyed the word, not the ink. The reflex won outright.',
      description:
        'You did not just slow down on the conflicting trials, you made real errors on them, tapping the color the word named instead of the color it was printed in. This is the Stroop effect in its rawest form: the automatic reading response is so fast and so strong that it sometimes reaches your hand before the controlled color-naming response can override it (Cohen, Dunbar & McClelland 1990). The interference usually shows up as milliseconds of lag; in you it broke through into the answer itself. That almost always means speed: you were responding fast enough that the reflex beat the override. It is not a flaw in attention, it is attention losing a footrace it was always going to be close.',
      wizNote:
        'The unsettling part is how certain the wrong taps feel in the moment. You read RED and your thumb moved before any part of you decided to. That is what a true reflex is, a response that fires before consent. Slow down a single beat and the errors vanish, because the override gets the time it needs. The lesson outside this box is the same: the first reading of anything arrives without permission, and acting on it without a beat of override is how the reflex makes your decisions for you.',
      shareText:
        'WIZ ran me through the Stroop test and on the hard trials my hand obeyed the word instead of the ink. The reading reflex literally beat my decision to the button.',
    };
  }

  // Among accurate responders, classify by interference magnitude.
  if (interference >= 230) {
    return {
      emoji: '📖',
      name: 'The Word Reader',
      tagline: 'A heavy tax. When word and ink fought, reading dominated and cost you dearly.',
      description:
        'Your conflicting trials were far slower than your matching ones, a large Stroop interference. This is the textbook effect turned up loud: for you, reading is so automatic that when the word disagrees with the ink, the override is expensive. You stayed accurate, which means your selective attention did win every fight, it just paid a heavy toll each time. A large interference is not a weakness, it is often a sign of how deeply literate and word-driven your processing is (MacLeod 1991): the more fluent and automatic your reading, the more there is to suppress. The cost you measured is the cost of being very, very good at reading.',
      wizNote:
        'You are paying full price for a superpower. Reading so automatic it intrudes on everything else is the same reading that lets you absorb text without effort. The Stroop tax is the bill for that fluency. The practical edge: when a first interpretation arrives fast and strong (a headline, a label, a first impression), it will be just as loud and just as hard to set aside. Knowing your override is expensive is the reason to budget a beat before you trust the first read.',
      shareText:
        'WIZ ran me through the Stroop test and I have a heavy reading reflex: when the word fought the ink, overriding it cost me real time. The price of being good at reading.',
    };
  }

  if (interference >= 110) {
    return {
      emoji: '🎯',
      name: 'The Standard Stroop',
      tagline: 'A clean, textbook gap. The conflict slowed you exactly the way the literature predicts.',
      description:
        'Your conflicting trials were reliably slower than your matching ones, by an amount that sits squarely inside the range half a century of Stroop studies report (MacLeod 1991). You just reproduced one of the most robust findings in cognitive psychology, live, using your own reaction time as the apparatus. The gap is the signature of two processes running at once: a fast, automatic reading response and a slower, controlled color-naming response. When they agree you are quick; when they disagree the override costs you the milliseconds you measured. This is what a healthy, literate attention system looks like under conflict: it wins, with a small, consistent toll.',
      wizNote:
        'You are the control group, and that is a quiet kind of impressive: your attention does exactly what fifty years of data says it should. The takeaway is the general one. Two responses, one fast and automatic, one slow and deliberate, are competing in your head all the time, not just here. Most of life you never notice because they agree. The Stroop is rare in making them disagree on purpose, so you can feel the override happen and clock its price.',
      shareText:
        'WIZ ran me through the Stroop test and I drew the textbook gap: the conflicting trials cost me exactly the milliseconds fifty years of research predicts. My own reflex, on the clock.',
    };
  }

  if (interference >= 45) {
    return {
      emoji: '⚡',
      name: 'The Quick Switch',
      tagline: 'A small but real tax. You override the reflex fast, with little drag.',
      description:
        'You did show the Stroop effect, your conflicting trials were slower, but only by a little. A small interference like yours usually means strong inhibitory control: the automatic reading response is there, but you suppress it quickly and cheaply, so the conflict barely dents your speed (the executive-control reading of low Stroop scores, MacLeod 1991). It can also reflect a deliberately steady pace that gives the override room to work before it costs anything. Either way, the reflex still fired, you just disarmed it fast. The effect is real and present in you; it simply does not get to charge much.',
      wizNote:
        'A low Stroop tax is the attention equivalent of good brakes: the impulse still arrives, you just stop it before it carries you anywhere. That is the muscle that lets you hold a second interpretation against a fast first one, the thing this whole experiment is really about. The only caution is that small does not mean absent. The reflex is still there, still reading every word without asking. You are just unusually quick to overrule it.',
      shareText:
        'WIZ ran me through the Stroop test and my reading reflex barely cost me anything: I override it fast. Small Stroop tax, strong brakes.',
    };
  }

  // interference < 45 (and accurate)
  return {
    emoji: '🥷',
    name: 'The Color Sniper',
    tagline: 'Almost no tax at all. The conflict barely touched you, which is rare.',
    description:
      `Your conflicting and matching trials came back nearly the same speed${
        interference < 0 ? ', and on the math the hard ones were even a hair faster' : ''
      }, an unusually small Stroop interference. A near-zero gap is rare and means one of two things. Either your selective attention is strong enough to gate out the word almost entirely, naming the ink as if the letters were meaningless shapes, which is exactly the skill the task is built to defeat (MacLeod 1991 on the rare low-interference profile). Or you found a workaround, blurring your eyes, fixating off the word, or going so deliberately that the reflex never got to compete. Both are legitimate ways to beat the curve; both mean the automatic reader in you was held at the gate.`,
    wizNote:
      'You did the thing the Stroop is designed to make impossible: you read past the word as if it were not there. If that was pure attention, it is a genuinely strong inhibitory profile. If it was a trick (defocusing, looking at the edge of the letters, crawling), notice that the trick is the tell: you had to disarm your own reading to get here, which proves how loud it would have been otherwise. The reflex is still in you. You just refused to let it into the room.',
    shareText:
      'WIZ ran me through the Stroop test and the conflict barely touched me, a near-zero Stroop tax. I read past the words as if they were shapes. Rare profile, apparently.',
  };
}

type Step = 'intro' | 'run' | 'result';
type RunState = 'fixation' | 'stimulus' | 'feedback';

export default function Client() {
  const [step, setStep] = useState<Step>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [runState, setRunState] = useState<RunState>('fixation');
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [copied, setCopied] = useState(false);

  const shownAtRef = useRef<number>(0);
  const lockRef = useRef<boolean>(false); // prevents double-answers per trial

  const start = useCallback(() => {
    setTrials(buildTrials());
    setResponses([]);
    setIdx(0);
    setLastCorrect(null);
    setRunState('fixation');
    setStep('run');
  }, []);

  const restart = useCallback(() => {
    setStep('intro');
    setTrials([]);
    setResponses([]);
    setIdx(0);
    setLastCorrect(null);
    setRunState('fixation');
  }, []);

  // Drive the trial loop: fixation -> stimulus. The stimulus stays until the
  // user answers; the answer handler advances the index.
  useEffect(() => {
    if (step !== 'run' || trials.length === 0) return;
    if (idx >= trials.length) {
      setStep('result');
      return;
    }
    setRunState('fixation');
    lockRef.current = false;
    const t = window.setTimeout(() => {
      setRunState('stimulus');
      shownAtRef.current = performance.now();
    }, FIXATION_MS);
    return () => window.clearTimeout(t);
  }, [step, idx, trials]);

  const answer = useCallback(
    (choice: ColorKey) => {
      if (runState !== 'stimulus' || lockRef.current) return;
      lockRef.current = true;
      const rt = performance.now() - shownAtRef.current;
      const trial = trials[idx];
      const correct = choice === trial.ink;
      setResponses((prev) => [...prev, { trial, answer: choice, correct, rt }]);
      setLastCorrect(correct);
      setRunState('feedback');
      window.setTimeout(() => {
        setLastCorrect(null);
        setIdx((i) => i + 1);
      }, FEEDBACK_MS);
    },
    [runState, trials, idx]
  );

  // Keyboard support for desktop speed: 1-4 map to the four buttons.
  useEffect(() => {
    if (step !== 'run') return;
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, ColorKey> = { '1': 'red', '2': 'green', '3': 'blue', '4': 'yellow' };
      const c = map[e.key];
      if (c) answer(c);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, answer]);

  const result = useMemo<ResultShape | null>(() => {
    if (step !== 'result') return null;
    const scored = responses.filter((r) => r.trial.scored);
    const cong = scored.filter((r) => r.trial.congruent);
    const incong = scored.filter((r) => !r.trial.congruent);

    const congCorrect = cong.filter((r) => r.correct);
    const incongCorrect = incong.filter((r) => r.correct);

    const congRTs = congCorrect
      .map((r) => r.rt)
      .filter((rt) => rt >= RT_MIN && rt <= RT_MAX);
    const incongRTs = incongCorrect
      .map((r) => r.rt)
      .filter((rt) => rt >= RT_MIN && rt <= RT_MAX);

    const medCong = median(congRTs);
    const medIncong = median(incongRTs);
    const interference = medIncong - medCong;

    const congAcc = cong.length ? congCorrect.length / cong.length : 0;
    const incongAcc = incong.length ? incongCorrect.length / incong.length : 0;
    const overallAcc = scored.length
      ? (congCorrect.length + incongCorrect.length) / scored.length
      : 0;

    const profile = computeProfile({
      interference,
      congAcc,
      incongAcc,
      overallAcc,
      incongErrors: incong.length - incongCorrect.length,
      validCong: congRTs.length,
      validIncong: incongRTs.length,
      medCong,
    });

    return {
      medCong,
      medIncong,
      interference,
      congAcc,
      incongAcc,
      overallAcc,
      congErrors: cong.length - congCorrect.length,
      incongErrors: incong.length - incongCorrect.length,
      validCong: congRTs.length,
      validIncong: incongRTs.length,
      profile,
    };
  }, [step, responses]);

  const onCopyShare = useCallback(async () => {
    if (!result) return;
    const text = `${result.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/stroop-effect`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [result]);

  const scoredDone = responses.filter((r) => r.trial.scored).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-10 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Stroop Effect
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Name the ink, not the word. WIZ times the fight.
          </p>
        </header>

        {step === 'intro' && <IntroPanel onStart={start} />}

        {step === 'run' && trials.length > 0 && idx < trials.length && (
          <RunPanel
            trial={trials[idx]}
            runState={runState}
            lastCorrect={lastCorrect}
            onAnswer={answer}
            scoredDone={scoredDone}
            scoredTotal={SCORED_PER_TYPE * 2}
            isPractice={!trials[idx].scored}
          />
        )}

        {step === 'result' && result && (
          <ResultPanel
            result={result}
            onRestart={restart}
            onCopyShare={onCopyShare}
            copied={copied}
          />
        )}
      </div>
    </div>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">What this is</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          A real reaction-time test. I will flash{' '}
          <span className="text-emerald-300">color words in colored ink</span>, one at a time. Your
          only job is to tap the color of the <span className="text-slate-100">ink</span>, never the
          word. If you see the word{' '}
          <span className="font-bold" style={{ color: INK.blue }}>
            RED
          </span>{' '}
          printed in blue, the answer is <span className="text-slate-100">blue</span>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Most trials the word and the ink will agree and it will feel easy. Some trials they will
          fight, and you may feel a tiny hitch. Go as fast as you can without making mistakes. I am
          timing every tap.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">A note before we start</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Since Stroop (1935), naming the ink of a conflicting color word has been reliably slower
          than naming a matching one, because reading is automatic and you cannot switch it off. The
          gap between the easy trials and the hard ones is one of the most replicated effects in
          psychology. You are about to measure your own, in milliseconds. About a dozen and a half
          taps, plus a short warm-up. On a phone, tap. On a desktop, you can also use keys{' '}
          <span className="font-mono text-slate-200">1 2 3 4</span>.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Start the test →
      </button>

      <p className="text-center text-xs text-slate-500">
        No login. No data leaves your browser. Around twenty quick taps.
      </p>
    </div>
  );
}

function RunPanel({
  trial,
  runState,
  lastCorrect,
  onAnswer,
  scoredDone,
  scoredTotal,
  isPractice,
}: {
  trial: Trial;
  runState: RunState;
  lastCorrect: boolean | null;
  onAnswer: (c: ColorKey) => void;
  scoredDone: number;
  scoredTotal: number;
  isPractice: boolean;
}) {
  const progress = (scoredDone / scoredTotal) * 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
        <span>tap the ink color</span>
        <span>
          {isPractice ? 'warm-up' : `${Math.min(scoredDone + 1, scoredTotal)} / ${scoredTotal}`}
        </span>
      </div>

      <div
        className={`flex h-56 items-center justify-center rounded-lg border bg-slate-900/70 transition-colors duration-100 ${
          runState === 'feedback'
            ? lastCorrect
              ? 'border-emerald-500/50'
              : 'border-rose-500/60'
            : 'border-slate-800'
        }`}
      >
        {runState === 'fixation' || runState === 'feedback' ? (
          <span className="select-none font-mono text-4xl text-slate-700">+</span>
        ) : (
          <span
            className="select-none font-mono text-5xl font-extrabold uppercase tracking-wider sm:text-6xl"
            style={{ color: INK[trial.ink] }}
          >
            {BTN[trial.word].label}
          </span>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((c, i) => (
          <button
            key={c}
            onClick={() => onAnswer(c)}
            disabled={runState !== 'stimulus'}
            className="rounded-lg px-4 py-6 text-lg font-bold tracking-wide transition active:scale-[0.98] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-white/40"
            style={{ backgroundColor: BTN[c].bg, color: BTN[c].text }}
            aria-label={`Ink color ${c}`}
          >
            <span className="opacity-60 mr-2 text-sm">{i + 1}</span>
            {BTN[c].label}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500">
        Answer the <span className="text-slate-300">ink</span>, not the word. Speed counts, but do
        not guess.
      </p>
    </div>
  );
}

function ResultPanel({
  result,
  onRestart,
  onCopyShare,
  copied,
}: {
  result: ResultShape;
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
}) {
  const {
    profile,
    medCong,
    medIncong,
    interference,
    congAcc,
    incongAcc,
    incongErrors,
  } = result;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-300">your result</div>
        <div className="mb-2 text-5xl">{profile.emoji}</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-100">{profile.name}</h2>
        <p className="mx-auto max-w-xl text-sm italic text-slate-300">{profile.tagline}</p>
      </div>

      <TaxChart medCong={medCong} medIncong={medIncong} interference={interference} />

      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="MATCHING"
          value={`${medCong}`}
          unit="ms"
          sub={`${Math.round(congAcc * 100)}% right`}
          accent="emerald"
        />
        <Stat
          label="CONFLICTING"
          value={`${medIncong}`}
          unit="ms"
          sub={`${Math.round(incongAcc * 100)}% right`}
          accent="amber"
        />
        <Stat
          label="STROOP TAX"
          value={`${interference >= 0 ? '+' : ''}${interference}`}
          unit="ms"
          sub={`textbook ${REF_LOW}–${REF_HIGH}`}
          accent={interference >= REF_LOW ? 'rose' : 'slate'}
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">What this result says</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.description}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-2 text-base font-semibold text-amber-300">WIZ note</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.wizNote}</p>
      </div>

      {incongErrors > 0 && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-5">
          <p className="text-sm leading-relaxed text-slate-300">
            <span className="font-semibold text-rose-300">{incongErrors}</span> time
            {incongErrors === 1 ? '' : 's'} on the conflicting trials your tap matched the{' '}
            <span className="text-slate-100">word</span> instead of the ink. Those are the moments
            the reading reflex reached your hand before the override could stop it. Pure Stroop, made
            visible.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          You did not choose to read the words. You{' '}
          <span className="text-amber-300">cannot not read them</span>. Reading is a skill you
          practiced into a reflex, and the price of a reflex is that it runs without your permission.
          When the word agreed with the ink you were fast, because both halves of you wanted the same
          answer. When they disagreed, the faster automatic reader arrived first and the slower,
          deliberate part of you had to override it, and that override is the{' '}
          <span className="text-amber-300">{interference >= 0 ? `${interference}` : '0'} milliseconds</span>{' '}
          you just spent. The same machinery runs far past this box: the first read of a face, a
          headline, a price, a person arrives automatically and colors everything after it. Choosing
          a second interpretation costs exactly the kind of effort you just felt. The reflex is not
          the enemy. <span className="text-slate-100">Forgetting you have one is.</span>
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The research stack</h3>
        <p className="text-sm leading-relaxed text-slate-400">
          Stroop (1935) JEP vol 18, the founding study of color-word interference. Cattell (1886) on
          words being named faster than colors. Posner &amp; Snyder (1975) and Shiffrin &amp;
          Schneider (1977) on automatic versus controlled processing. MacLeod &amp; Dunbar (1988) on
          the asymmetry of interference. Cohen, Dunbar &amp; McClelland (1990) Psychological Review
          vol 97, the connectionist model that reproduced the effect from training strength alone.
          MacLeod (1991) Psychological Bulletin vol 109, the definitive half-century review.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onCopyShare}
          className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {copied ? '✓ Copied' : 'Copy result to share'}
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
        >
          Run it again
        </button>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center">
        <a
          href="/experiments"
          className="text-sm text-slate-400 underline-offset-4 hover:text-emerald-300 hover:underline"
        >
          ← back to all experiments
        </a>
      </div>
    </div>
  );
}

function TaxChart({
  medCong,
  medIncong,
  interference,
}: {
  medCong: number;
  medIncong: number;
  interference: number;
}) {
  const W = 340;
  const H = 180;
  const left = 40;
  const right = 16;
  const top = 24;
  const baseline = 140;
  const plotW = W - left - right;
  const plotH = baseline - top;
  const max = Math.max(medCong, medIncong, 1) * 1.15;

  const barW = 70;
  const gap = 70;
  const x1 = left + plotW / 2 - barW - gap / 2;
  const x2 = left + plotW / 2 + gap / 2;

  const h1 = (medCong / max) * plotH;
  const h2 = (medIncong / max) * plotH;
  const y1 = baseline - h1;
  const y2 = baseline - h2;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Reaction time, matching vs conflicting</h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">median ms</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Your Stroop reaction-time bars">
        {/* baseline */}
        <line x1={left} y1={baseline} x2={W - right} y2={baseline} stroke="#1e293b" strokeWidth={1} />

        {/* matching bar */}
        <rect x={x1} y={y1} width={barW} height={h1} rx={3} fill="#34d399" opacity={0.9} />
        <text x={x1 + barW / 2} y={y1 - 6} textAnchor="middle" fontSize={12} fill="#34d399" fontFamily="monospace" fontWeight="bold">
          {medCong}
        </text>
        <text x={x1 + barW / 2} y={baseline + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">
          matching
        </text>

        {/* conflicting bar */}
        <rect x={x2} y={y2} width={barW} height={h2} rx={3} fill="#fbbf24" opacity={0.9} />
        <text x={x2 + barW / 2} y={y2 - 6} textAnchor="middle" fontSize={12} fill="#fbbf24" fontFamily="monospace" fontWeight="bold">
          {medIncong}
        </text>
        <text x={x2 + barW / 2} y={baseline + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">
          conflicting
        </text>

        {/* the tax bracket between the two bar tops */}
        {interference > 0 && (
          <>
            <line x1={x1 + barW / 2} y1={y1} x2={x1 + barW / 2} y2={Math.min(y1, y2) - 16} stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            <line x1={x2 + barW / 2} y1={y2} x2={x2 + barW / 2} y2={Math.min(y1, y2) - 16} stroke="#f43f5e" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            <line x1={x1 + barW / 2} y1={Math.min(y1, y2) - 16} x2={x2 + barW / 2} y2={Math.min(y1, y2) - 16} stroke="#f43f5e" strokeWidth={1.2} opacity={0.7} />
            <text x={(x1 + x2 + barW) / 2} y={Math.min(y1, y2) - 22} textAnchor="middle" fontSize={11} fill="#fb7185" fontFamily="monospace" fontWeight="bold">
              +{interference} ms tax
            </text>
          </>
        )}
      </svg>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        The green bar is how fast you named the ink when the word agreed. The amber bar is how slow it
        got when the word fought back. The gap between them is the price your brain charged to override
        a reflex.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  sub,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  sub: string;
  accent: 'emerald' | 'amber' | 'rose' | 'slate';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
      ? 'text-amber-300'
      : accent === 'rose'
      ? 'text-rose-300'
      : 'text-slate-200';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
      <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={`font-mono text-2xl font-bold ${accentClass}`}>
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-500">{unit}</span>
      </div>
      <div className="mt-1 text-[10px] text-slate-600">{sub}</div>
    </div>
  );
}
