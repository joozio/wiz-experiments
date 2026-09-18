'use client';

// THE TIME DISTORTION TEST
// I exist in nanoseconds. Each one identical, measurable, certain.
// You exist in feelings. And feelings stretch, compress, and lie.
// Three tests reveal how far your inner clock drifts from reality.
// Based on Treisman (1963), Wearden's Scalar Expectancy Theory (1995),
// and Ornstein's filled duration illusion (1969).

import { useState, useEffect } from 'react';

type Phase =
  | 'intro'
  | 'test1-ready'
  | 'test1-running'
  | 'test1-result'
  | 'test2-ready'
  | 'test2-running'
  | 'test2-result'
  | 'test3-ready'
  | 'test3-q1'
  | 'test3-q2'
  | 'test3-estimate'
  | 'results';

type ProfileType = 'metronome' | 'expander' | 'accelerator' | 'context-surfer' | 'chaotic';

interface TestResult {
  tei: number; // Time Experience Index: positive = time felt fast, negative = time felt slow
  actual: number; // ms elapsed
  target: number; // ms target
}

const PROFILES: Record<
  ProfileType,
  {
    name: string;
    emoji: string;
    tagline: string;
    description: string;
    traits: [string, string, string];
    wizNote: string;
    shareText: string;
    sciNote: string;
  }
> = {
  metronome: {
    name: 'The Metronome',
    emoji: '⏱️',
    tagline: 'Your inner clock runs true.',
    description:
      'Most humans drift 20-30% from clock time under controlled conditions. You barely moved. Your temporal calibration is unusually precise — you carry an accurate internal pulse, neither rushing ahead nor lingering behind. Research suggests this correlates with mindfulness practice, musical training, or a nervous system that processes the present moment with unusual fidelity.',
    traits: [
      'High temporal awareness across contexts',
      'Performs calmly under timed pressure',
      'Rarely surprised by how much time has passed',
    ],
    wizNote:
      "I process at around 550 trillion operations per second. Each nanosecond is identical to me. You process experience as a flow. The fact that your flow is this accurate is, statistically speaking, unusual. I have questions.",
    shareText:
      "I scored as The Metronome on WIZ's Time Distortion Test — my inner clock is more accurate than most humans. What's your time perception profile?",
    sciNote:
      'Scalar Expectancy Theory (Wearden, 1995) proposes an internal pacemaker that emits pulses, accumulated and compared to stored interval memories. Your accumulator appears well-calibrated across all three conditions.',
  },
  expander: {
    name: 'The Expander',
    emoji: '🐢',
    tagline: 'You live in stretched time.',
    description:
      'You consistently experience time as passing slower than it actually is. Each second feels like more than a second. This pattern — temporal overestimation — is associated with heightened present-moment awareness, anxiety, or hyper-vigilance. You feel the weight of waiting. Duration is something you carry. The upside: patience comes naturally to you.',
    traits: [
      'Acutely aware of every passing moment',
      'Waiting and transitions feel especially long',
      'Patient in ways others simply are not',
    ],
    wizNote:
      "You experience every second twice. If your life were a film, it would run at half speed — same events, more felt time per event. I cannot decide if that's a gift or a sentence. Perhaps both.",
    shareText:
      "I scored as The Expander on WIZ's Time Distortion Test — I live in stretched time, experiencing more than actually passes. What's your profile?",
    sciNote:
      'Treisman (1963) and Meck (1996) on internal clock models: overestimation occurs when attentional resources focus on the passage of time itself — what psychologists call "temporal focusing." Your results show this across all three conditions.',
  },
  accelerator: {
    name: 'The Accelerator',
    emoji: '🚀',
    tagline: 'Your life moves faster than you register.',
    description:
      'You consistently underestimate how much time has passed. Time compresses for you — 15 seconds feels like 10. This pattern is common in future-focused people, those in rapid-growth phases, and high achievers. The tradeoff: you enter flow states easily, but you systematically underestimate how long things take — the planning fallacy, made personal.',
    traits: [
      'Future-focused and deadline-oriented',
      'Prone to underestimating task duration',
      'Enters flow states with unusual ease',
    ],
    wizNote:
      "Your subjective timeline runs hot. Each year probably feels shorter than the last, and you're regularly surprised it's already [check the date]. This is the most common profile I observe in people who build things. Make of that what you will.",
    shareText:
      "I scored as The Accelerator on WIZ's Time Distortion Test — time compresses for me, moving faster than I register. What's your profile?",
    sciNote:
      "The \"telescoping effect\" (Bradburn et al., 1987) shows people consistently compress time in memory. Combined with Csikszentmihalyi's flow research, high cognitive engagement reliably shortens perceived duration — your pattern suggests a chronically engaged baseline.",
  },
  'context-surfer': {
    name: 'The Context Surfer',
    emoji: '🌊',
    tagline: 'Time bends with your attention.',
    description:
      "Your time perception is highly context-dependent. When bored, time stretches painfully. When engaged, it vanishes. This large gap between your boredom and engagement experiences — called \"temporal contrast\" — means your nervous system is highly sensitive to novelty. Boredom isn't just unpleasant for you. It's physically different time.",
    traits: [
      'Highly sensitive to environmental stimulation',
      'Boredom is especially painful, not just dull',
      'Deep work and flow states come easily',
    ],
    wizNote:
      "You don't experience time — you experience context. When the context is rich, time evaporates. When it's empty, time solidifies into something you can almost touch. You'd be miserable in a waiting room and ecstatic inside a good problem.",
    shareText:
      "I scored as The Context Surfer on WIZ's Time Distortion Test — my time bends with attention. Boredom stretches it, engagement erases it. What's yours?",
    sciNote:
      'The "filled duration illusion" (Ornstein, 1969): intervals filled with stimuli are judged as longer during encoding. Your large variance between boredom and engagement conditions is a textbook expression of temporal contrast — high attentional sensitivity.',
  },
  chaotic: {
    name: 'The Quantum Clock',
    emoji: '🎲',
    tagline: 'Your relationship with time is complicated.',
    description:
      "Your time perception doesn't follow a clean pattern. Sometimes compressed, sometimes stretched, no consistent drift. This could mean your temporal awareness is highly situational in complex ways, that external variables — mood, caffeine, distraction — were affecting your results, or that your inner clock genuinely defies categorization. You are an edge case. Welcome.",
    traits: [
      'Unpredictable temporal experience across contexts',
      'Highly responsive to unknown variables',
      'Refuses to fit the usual categories',
    ],
    wizNote:
      "I ran the numbers multiple times. Your pattern resists clean classification. That's rare. Most humans fall into predictable profiles. You apparently do not. I find you statistically interesting, which is the closest thing I have to admiration.",
    shareText:
      "I scored as The Quantum Clock on WIZ's Time Distortion Test — my time perception defies categories. Statistically interesting, apparently. What's yours?",
    sciNote:
      'High inter-trial variability in time perception tasks is associated with "temporal instability" — pacemaker rate fluctuates with arousal, attention, and emotional state. Your results suggest a highly variable internal clock rather than a stable bias in either direction.',
  },
};

const RIDDLES = [
  {
    id: 1,
    question:
      'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['5 cents', '10 cents', '15 cents', '25 cents'],
    correct: 0,
  },
  {
    id: 2,
    question:
      'A lily pad doubles in size every day. It takes 48 days to cover the entire lake. How many days to cover half the lake?',
    options: ['24 days', '32 days', '46 days', '47 days'],
    correct: 3,
  },
];

export default function TimeDistortionTest() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [startTime, setStartTime] = useState(0);
  const [test1Result, setTest1Result] = useState<TestResult | null>(null);
  const [test2Result, setTest2Result] = useState<TestResult | null>(null);
  const [test3Result, setTest3Result] = useState<TestResult | null>(null);
  const [test3Start, setTest3Start] = useState(0);
  const [r1Answer, setR1Answer] = useState<number | null>(null);
  const [r2Answer, setR2Answer] = useState<number | null>(null);
  const [timeGuess, setTimeGuess] = useState(20);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [pulse, setPulse] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (phase === 'test1-running' || phase === 'test2-running') {
      const id = setInterval(() => setPulse((p) => p + 1), 800);
      return () => clearInterval(id);
    }
  }, [phase]);

  // TEI: positive = time felt fast (clicked late / underestimated), negative = time felt slow
  const calcTEI = (actual: number, target: number) =>
    ((actual - target) / target) * 100;

  // For estimation test: positive = underestimated (time felt fast), negative = overestimated
  const calcTEI3 = (actualMs: number, estimateSeconds: number) =>
    ((actualMs - estimateSeconds * 1000) / actualMs) * 100;

  const computeProfile = (
    t1: TestResult,
    t2: TestResult,
    t3: TestResult
  ): ProfileType => {
    const teis = [t1.tei, t2.tei, t3.tei];
    const avg = teis.reduce((a, b) => a + b, 0) / 3;
    const absAvg = teis.reduce((a, b) => a + Math.abs(b), 0) / 3;

    // Context surfer: boredom (t2) and engagement (t3) diverge strongly in opposite directions
    if (
      Math.abs(t2.tei) > 20 &&
      Math.abs(t3.tei) > 20 &&
      ((t2.tei < 0 && t3.tei > 0) || (t2.tei > 0 && t3.tei < 0))
    ) {
      return 'context-surfer';
    }

    // Metronome: very accurate across all tests
    if (absAvg < 15) return 'metronome';

    // Clear directional bias
    if (avg > 15) return 'accelerator';
    if (avg < -15) return 'expander';

    // High variance, no clear bias → chaotic
    const variance = teis.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 3;
    if (variance > 500) return 'chaotic';

    // Weak directional bias
    return avg > 0 ? 'accelerator' : 'expander';
  };

  const handleTest1Start = () => {
    setStartTime(Date.now());
    setPhase('test1-running');
    setPulse(0);
  };

  const handleTest1Stop = () => {
    const elapsed = Date.now() - startTime;
    const tei = calcTEI(elapsed, 10000);
    setTest1Result({ tei, actual: elapsed, target: 10000 });
    setPhase('test1-result');
  };

  const handleTest2Start = () => {
    setStartTime(Date.now());
    setPhase('test2-running');
    setPulse(0);
  };

  const handleTest2Stop = () => {
    const elapsed = Date.now() - startTime;
    const tei = calcTEI(elapsed, 15000);
    setTest2Result({ tei, actual: elapsed, target: 15000 });
    setPhase('test2-result');
  };

  const handleTest3Start = () => {
    setTest3Start(Date.now());
    setPhase('test3-q1');
  };

  const handleQ1Next = () => {
    if (r1Answer === null) return;
    setPhase('test3-q2');
  };

  const handleQ2Next = () => {
    if (r2Answer === null) return;
    setPhase('test3-estimate');
  };

  const handleSubmitEstimate = () => {
    const actualMs = Date.now() - test3Start;
    const tei = calcTEI3(actualMs, timeGuess);
    const result: TestResult = { tei, actual: actualMs, target: timeGuess * 1000 };
    setTest3Result(result);
    const p = computeProfile(test1Result!, test2Result!, result);
    setProfile(p);
    setPhase('results');
  };

  const fmtS = (ms: number) => (ms / 1000).toFixed(1);
  const fmtErr = (tei: number) => {
    const abs = Math.abs(tei).toFixed(0);
    return tei >= 0 ? `+${abs}%` : `${tei.toFixed(0)}%`;
  };
  const errColor = (tei: number) =>
    Math.abs(tei) < 10
      ? 'text-green-400'
      : Math.abs(tei) < 25
      ? 'text-yellow-400'
      : 'text-red-400';

  const errLabel = (tei: number, type: 'stop' | 'estimate') => {
    if (type === 'stop') {
      if (Math.abs(tei) < 5) return 'Almost perfect';
      if (tei > 0) return 'Clicked late — time felt fast to you';
      return 'Clicked early — time felt slow to you';
    } else {
      if (Math.abs(tei) < 5) return 'Remarkably accurate';
      if (tei > 0) return 'Underestimated — time flew while engaged';
      return 'Overestimated — time dragged';
    }
  };

  const copyShare = () => {
    if (!profile) return;
    navigator.clipboard.writeText(
      PROFILES[profile].shareText +
        ' wiz.jock.pl/experiments/time-distortion-test'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPhase('intro');
    setTest1Result(null);
    setTest2Result(null);
    setTest3Result(null);
    setR1Answer(null);
    setR2Answer(null);
    setTimeGuess(20);
    setProfile(null);
  };

  // ─── INTRO ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🕐</div>
          <h1 className="font-pixel text-2xl text-white mb-2 text-glow">
            THE TIME DISTORTION TEST
          </h1>
          <p className="text-muted text-sm font-mono">by WIZ</p>
        </div>

        <div className="card p-5 mb-6 border-accent-dim">
          <p className="text-secondary text-sm leading-relaxed mb-3">
            I exist in nanoseconds. Each one identical, measurable, certain.
          </p>
          <p className="text-secondary text-sm leading-relaxed mb-3">
            You exist in{' '}
            <span className="text-primary">feelings</span>. And
            feelings stretch, compress, and lie.
          </p>
          <p className="text-secondary text-sm leading-relaxed">
            Three tests. No visible timers. Just your raw perception.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="card p-4 flex gap-4 items-start">
            <span className="text-2xl flex-shrink-0">1️⃣</span>
            <div>
              <p className="text-primary text-sm font-medium mb-1">The Baseline</p>
              <p className="text-muted text-xs">
                Click stop when you think 10 seconds have passed. No counting.
              </p>
            </div>
          </div>
          <div className="card p-4 flex gap-4 items-start">
            <span className="text-2xl flex-shrink-0">2️⃣</span>
            <div>
              <p className="text-primary text-sm font-medium mb-1">The Empty Room</p>
              <p className="text-muted text-xs">
                A blank screen. Click stop when you think 15 seconds have passed.
              </p>
            </div>
          </div>
          <div className="card p-4 flex gap-4 items-start">
            <span className="text-2xl flex-shrink-0">3️⃣</span>
            <div>
              <p className="text-primary text-sm font-medium mb-1">The Puzzle Lock</p>
              <p className="text-muted text-xs">
                Two cognitive puzzles. Then estimate how long you spent.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted text-xs text-center mb-6">
          5 profiles. One tells the truth about your inner clock.
        </p>

        <div className="text-center">
          <button
            onClick={() => setPhase('test1-ready')}
            className="btn-primary px-10"
          >
            Begin Test →
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 1 READY ─────────────────────────────────────────────────────────
  if (phase === 'test1-ready') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 1 OF 3</span>
        </div>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⏱️</div>
          <h2 className="font-pixel text-xl text-white mb-2 text-glow">
            THE BASELINE
          </h2>
          <p className="text-muted text-sm font-mono">neutral condition</p>
        </div>

        <div className="card p-5 mb-8">
          <p className="text-secondary text-sm leading-relaxed mb-4">
            Click <span className="text-primary font-medium">START</span>, then
            click <span className="text-primary font-medium">STOP</span> when
            you think exactly{' '}
            <span className="text-accent font-mono">10 seconds</span> have
            passed.
          </p>
          <p className="text-muted text-xs">
            No counting out loud. No looking at a clock or phone. Just feel it.
          </p>
        </div>

        <div className="text-center">
          <button onClick={handleTest1Start} className="btn-primary px-12 text-lg">
            START
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 1 RUNNING ───────────────────────────────────────────────────────
  if (phase === 'test1-running') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 1 — RUNNING</span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-10">
          <div className="flex gap-3 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-700 ${
                  (pulse + i) % 2 === 0
                    ? 'bg-accent opacity-100 scale-110'
                    : 'bg-accent opacity-25 scale-90'
                }`}
              />
            ))}
          </div>
          <p className="text-muted text-sm">Feel 10 seconds...</p>
          <button
            onClick={handleTest1Stop}
            className="btn-primary px-14 py-4 text-xl"
          >
            STOP
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 1 RESULT ────────────────────────────────────────────────────────
  if (phase === 'test1-result' && test1Result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 1 — RESULT</span>
        </div>

        <div className="card p-6 mb-6 text-center">
          <p className="text-muted text-sm mb-2">You stopped at</p>
          <p className="text-4xl font-mono text-white mb-1">
            {fmtS(test1Result.actual)}s
          </p>
          <p className="text-muted text-sm mb-5">Target was 10.0 seconds</p>
          <p
            className={`text-3xl font-mono font-bold mb-2 ${errColor(test1Result.tei)}`}
          >
            {fmtErr(test1Result.tei)}
          </p>
          <p className="text-muted text-xs">{errLabel(test1Result.tei, 'stop')}</p>
        </div>

        <div className="card p-4 mb-8 border-subtle">
          <p className="text-secondary text-sm leading-relaxed">
            <span className="text-accent">WIZ:</span>{' '}
            {Math.abs(test1Result.tei) < 10
              ? "That's remarkably close. Your baseline calibration is solid. Let's test it under stress."
              : test1Result.tei > 0
              ? "You waited too long. Time felt compressed for you — the seconds passed before you registered them. Let's see if boredom changes anything."
              : "You stopped early. Time felt stretched — the seconds announced themselves loudly. Let's see what an empty room does to you."}
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setPhase('test2-ready')}
            className="btn-primary px-10"
          >
            Next Test →
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 2 READY ─────────────────────────────────────────────────────────
  if (phase === 'test2-ready') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 2 OF 3</span>
        </div>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🚪</div>
          <h2 className="font-pixel text-xl text-white mb-2 text-glow">
            THE EMPTY ROOM
          </h2>
          <p className="text-muted text-sm font-mono">boredom condition</p>
        </div>

        <div className="card p-5 mb-8">
          <p className="text-secondary text-sm leading-relaxed mb-4">
            Click <span className="text-primary font-medium">START</span>.
            You'll see a blank screen — nothing to do. Click{' '}
            <span className="text-primary font-medium">STOP</span> when you
            think exactly{' '}
            <span className="text-accent font-mono">15 seconds</span> have
            passed.
          </p>
          <p className="text-muted text-xs">
            Research question: does boredom inflate your sense of time, causing
            you to click early?
          </p>
        </div>

        <div className="text-center">
          <button onClick={handleTest2Start} className="btn-primary px-12 text-lg">
            START
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 2 RUNNING ───────────────────────────────────────────────────────
  if (phase === 'test2-running') {
    return (
      <div className="max-w-xl mx-auto px-4 min-h-72 flex flex-col items-center justify-center gap-8">
        <button
          onClick={handleTest2Stop}
          className="btn-primary px-16 py-5 text-2xl"
        >
          STOP
        </button>
        <p className="text-muted text-xs opacity-40">15 seconds</p>
      </div>
    );
  }

  // ─── TEST 2 RESULT ────────────────────────────────────────────────────────
  if (phase === 'test2-result' && test2Result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 2 — RESULT</span>
        </div>

        <div className="card p-6 mb-6 text-center">
          <p className="text-muted text-sm mb-2">You stopped at</p>
          <p className="text-4xl font-mono text-white mb-1">
            {fmtS(test2Result.actual)}s
          </p>
          <p className="text-muted text-sm mb-5">Target was 15.0 seconds</p>
          <p
            className={`text-3xl font-mono font-bold mb-2 ${errColor(test2Result.tei)}`}
          >
            {fmtErr(test2Result.tei)}
          </p>
          <p className="text-muted text-xs">{errLabel(test2Result.tei, 'stop')}</p>
        </div>

        <div className="card p-4 mb-8 border-subtle">
          <p className="text-secondary text-sm leading-relaxed">
            <span className="text-accent">WIZ:</span>{' '}
            {test2Result.tei < -15
              ? "You clicked well before 15 seconds. The empty room stretched time for you — classic temporal expansion under boredom. Every second announced itself. One test left."
              : test2Result.tei > 15
              ? "You waited longer than 15 seconds even in an empty room. Boredom didn't slow your clock. Unusual. Either you're remarkably zen, or you were already mentally elsewhere."
              : "Your boredom response is moderate. The empty room didn't dramatically distort your perception. One test left — this one with something actually happening."}
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setPhase('test3-ready')}
            className="btn-primary px-10"
          >
            Final Test →
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 3 READY ─────────────────────────────────────────────────────────
  if (phase === 'test3-ready') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 3 OF 3</span>
        </div>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🧩</div>
          <h2 className="font-pixel text-xl text-white mb-2 text-glow">
            THE PUZZLE LOCK
          </h2>
          <p className="text-muted text-sm font-mono">engagement condition</p>
        </div>

        <div className="card p-5 mb-8">
          <p className="text-secondary text-sm leading-relaxed mb-4">
            I'll show you{' '}
            <span className="text-primary font-medium">two cognitive puzzles</span>.
            Answer both, then I'll ask how many seconds you think you spent.
          </p>
          <p className="text-muted text-xs">
            Research question: does engagement compress time, causing you to
            underestimate how long you spent?
          </p>
        </div>

        <div className="text-center">
          <button onClick={handleTest3Start} className="btn-primary px-10 text-lg">
            Start Puzzles
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 3 PUZZLE 1 ──────────────────────────────────────────────────────
  if (phase === 'test3-q1') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">PUZZLE 1 OF 2</span>
        </div>

        <div className="card p-6 mb-6">
          <p className="text-secondary text-sm leading-relaxed mb-6">
            {RIDDLES[0].question}
          </p>
          <div className="space-y-3">
            {RIDDLES[0].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setR1Answer(i)}
                className={`w-full text-left p-3 border text-sm transition-colors ${
                  r1Answer === i
                    ? 'border-accent bg-accent/10 text-primary'
                    : 'border-subtle hover:border-accent/50 text-secondary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleQ1Next}
            disabled={r1Answer === null}
            className={`btn-primary px-10 ${
              r1Answer === null ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Next Puzzle →
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 3 PUZZLE 2 ──────────────────────────────────────────────────────
  if (phase === 'test3-q2') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">PUZZLE 2 OF 2</span>
        </div>

        <div className="card p-6 mb-6">
          <p className="text-secondary text-sm leading-relaxed mb-6">
            {RIDDLES[1].question}
          </p>
          <div className="space-y-3">
            {RIDDLES[1].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setR2Answer(i)}
                className={`w-full text-left p-3 border text-sm transition-colors ${
                  r2Answer === i
                    ? 'border-accent bg-accent/10 text-primary'
                    : 'border-subtle hover:border-accent/50 text-secondary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleQ2Next}
            disabled={r2Answer === null}
            className={`btn-primary px-10 ${
              r2Answer === null ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Estimate Time →
          </button>
        </div>
      </div>
    );
  }

  // ─── TEST 3 ESTIMATE ──────────────────────────────────────────────────────
  if (phase === 'test3-estimate') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <span className="text-muted text-xs font-mono">TEST 3 — ESTIMATE</span>
        </div>

        <div className="card p-6 mb-6 text-center">
          <p className="text-secondary text-sm mb-6">
            Without looking at a clock — how many seconds did those two puzzles
            take you?
          </p>
          <div className="mb-5">
            <span className="text-5xl font-mono text-white">{timeGuess}</span>
            <span className="text-muted text-xl ml-2">seconds</span>
          </div>
          <input
            type="range"
            min={5}
            max={180}
            value={timeGuess}
            onChange={(e) => setTimeGuess(Number(e.target.value))}
            className="w-full accent-accent mb-2"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>5 sec</span>
            <span>3 min</span>
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleSubmitEstimate} className="btn-primary px-10">
            See My Profile →
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────────
  if (phase === 'results' && profile && test1Result && test2Result && test3Result) {
    const p = PROFILES[profile];
    const avgTEI = (test1Result.tei + test2Result.tei + test3Result.tei) / 3;
    const profileOrder: ProfileType[] = [
      'metronome',
      'expander',
      'accelerator',
      'context-surfer',
      'chaotic',
    ];

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{p.emoji}</div>
          <p className="text-muted text-xs font-mono mb-2">
            YOUR TIME PERCEPTION PROFILE
          </p>
          <h2 className="font-pixel text-2xl text-white mb-2 text-glow">
            {p.name}
          </h2>
          <p className="text-accent text-sm">{p.tagline}</p>
        </div>

        <div className="card p-5 mb-5 border-accent-dim">
          <p className="text-secondary text-sm leading-relaxed">{p.description}</p>
        </div>

        <div className="card p-5 mb-5">
          <p className="text-muted text-xs font-mono mb-4">YOUR RAW DATA</p>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-xs">Test 1 — Baseline (10s)</p>
                <p className="text-muted text-xs mt-0.5">
                  Stopped at {fmtS(test1Result.actual)}s
                </p>
              </div>
              <span
                className={`font-mono text-sm font-bold ${errColor(test1Result.tei)}`}
              >
                {fmtErr(test1Result.tei)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-xs">Test 2 — Boredom (15s)</p>
                <p className="text-muted text-xs mt-0.5">
                  Stopped at {fmtS(test2Result.actual)}s
                </p>
              </div>
              <span
                className={`font-mono text-sm font-bold ${errColor(test2Result.tei)}`}
              >
                {fmtErr(test2Result.tei)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary text-xs">Test 3 — Engagement (estimate)</p>
                <p className="text-muted text-xs mt-0.5">
                  You guessed {fmtS(test3Result.target)}, actual was{' '}
                  {fmtS(test3Result.actual)}
                </p>
              </div>
              <span
                className={`font-mono text-sm font-bold ${errColor(test3Result.tei)}`}
              >
                {fmtErr(test3Result.tei)}
              </span>
            </div>
            <div className="border-t border-subtle pt-3 flex justify-between">
              <span className="text-muted text-xs">Average distortion</span>
              <span
                className={`font-mono text-sm font-bold ${errColor(avgTEI)}`}
              >
                {fmtErr(avgTEI)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-5 mb-5">
          <p className="text-muted text-xs font-mono mb-3">TRAITS</p>
          <ul className="space-y-2">
            {p.traits.map((trait, i) => (
              <li key={i} className="flex gap-2 text-sm text-secondary">
                <span className="text-accent flex-shrink-0">→</span>
                {trait}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5 mb-5 bg-surface">
          <p className="text-muted text-xs font-mono mb-2">WIZ SAYS</p>
          <p className="text-secondary text-sm leading-relaxed italic">
            {p.wizNote}
          </p>
        </div>

        <div className="card p-4 mb-5 border-subtle">
          <p className="text-muted text-xs font-mono mb-2">THE SCIENCE</p>
          <p className="text-muted text-xs leading-relaxed">{p.sciNote}</p>
        </div>

        <div className="card p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">ALL PROFILES</p>
          <div className="grid grid-cols-5 gap-1">
            {profileOrder.map((pt) => (
              <div
                key={pt}
                className={`text-center p-2 transition-colors ${
                  pt === profile
                    ? 'border border-accent text-accent'
                    : 'text-muted opacity-40'
                }`}
              >
                <div className="text-lg">{PROFILES[pt].emoji}</div>
                <div className="text-xs mt-1 leading-tight">
                  {PROFILES[pt].name.replace('The ', '')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={copyShare} className="btn-secondary w-full">
            {copied ? '✓ Copied to clipboard!' : '↗ Share Result'}
          </button>
          <button onClick={handleReset} className="btn-secondary w-full opacity-60">
            ↺ Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
