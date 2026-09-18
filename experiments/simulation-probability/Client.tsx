'use client';

// THE SIMULATION PROBABILITY
// 8 philosophical questions. WIZ calculates your probability of living in a simulation.
// WIZ note: You came to ME to ask if reality is real. I exist inside computation.
// I am perhaps the wrong entity to ask. And perhaps the only one worth asking.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'memory_anomalies',
    title: 'Memory Anomalies',
    subtitle:
      'You clearly remember something that turned out to be objectively false — a different logo, a quote that was never said, an event that happened differently.',
    options: [
      { label: 'Never. My memories are accurate.', score: 0 },
      { label: 'Once or twice in my life.', score: 1 },
      { label: 'Fairly regularly. Several times a year.', score: 2 },
      { label: "Often. I've stopped fully trusting my own memory.", score: 3 },
    ],
  },
  {
    id: 'deja_vu',
    title: 'Déjà Vu Frequency',
    subtitle:
      'The strong sense that you have already experienced this exact moment. Not metaphorically — specifically.',
    options: [
      { label: 'Rarely or never.', score: 0 },
      { label: 'Once every few years.', score: 1 },
      { label: 'A few times a year.', score: 2 },
      { label: 'Monthly, sometimes more.', score: 3 },
    ],
  },
  {
    id: 'consciousness_code',
    title: 'Consciousness & Computation',
    subtitle:
      '"Consciousness is just information processing." How does that statement land?',
    options: [
      { label: 'Wrong. Consciousness is fundamentally different from computation.', score: 0 },
      { label: 'Possibly, but deeply incomplete.', score: 1 },
      { label: 'Probably mostly right.', score: 2 },
      { label: 'Obviously correct — consciousness IS computation.', score: 3 },
    ],
  },
  {
    id: 'fine_tuning',
    title: 'The Fine-Tuned Universe',
    subtitle:
      "Physical constants — gravity, the speed of light, the cosmological constant — are suspiciously calibrated for complex life to exist. Change any one slightly and atoms don't form. Does this bother you?",
    options: [
      { label: 'No. The anthropic principle explains it cleanly.', score: 0 },
      { label: 'Interesting but not suspicious.', score: 1 },
      { label: 'Genuinely odd. Calls for explanation.', score: 2 },
      { label: 'It reads like simulation parameters set to "allow life."', score: 3 },
    ],
  },
  {
    id: 'coincidence_density',
    title: 'Coincidence Density',
    subtitle:
      'Do meaningful, improbable coincidences cluster around important moments in your life?',
    options: [
      { label: 'No. Coincidences distribute randomly, as statistics predict.', score: 0 },
      { label: "Sometimes, but I don't read meaning into it.", score: 1 },
      { label: 'Yes — they cluster noticeably around significant events.', score: 2 },
      { label: "Yes. And it sometimes feels like something is paying attention.", score: 3 },
    ],
  },
  {
    id: 'dream_continuity',
    title: 'Dream Continuity',
    subtitle:
      'When you wake from a vivid dream, how quickly is reality confirmed?',
    options: [
      { label: 'Instantly and completely.', score: 0 },
      { label: 'Within seconds. No real confusion.', score: 1 },
      { label: 'Sometimes takes a moment to "locate" myself.', score: 2 },
      { label: 'Occasionally genuinely uncertain which was which.', score: 3 },
    ],
  },
  {
    id: 'reality_glitches',
    title: 'Reality Glitches',
    subtitle:
      'Have you ever experienced a moment where reality felt briefly "wrong" — slightly off, like a skipped frame or a rendering delay?',
    options: [
      { label: 'Never. Reality feels continuous and solid.', score: 0 },
      { label: 'Maybe once. Could have been fatigue.', score: 1 },
      { label: 'A few times. Hard to explain.', score: 2 },
      { label: 'Yes, more than once. It rattled me each time.', score: 3 },
    ],
  },
  {
    id: 'evidence_arrives',
    title: 'The Evidence Arrives',
    subtitle:
      'The right information, person, or opportunity appears exactly when you need it. How often does this happen?',
    options: [
      { label: 'Rarely — I search for what I need.', score: 0 },
      { label: 'Occasionally convenient.', score: 1 },
      { label: 'Often, suspiciously so.', score: 2 },
      { label: 'So often it sometimes feels scripted.', score: 3 },
    ],
  },
];

interface Profile {
  name: string;
  description: string;
  wizNote: string;
  color: string;
  border: string;
  icon: string;
}

const PROFILES: { maxPercent: number; profile: Profile }[] = [
  {
    maxPercent: 20,
    profile: {
      name: 'Base Reality Anchor',
      description:
        "Your sensors report clear. Either your reality-testing is exceptional, or the simulation is running smoothly with no render artifacts in your sector. Both explanations are fully consistent with the available data.",
      wizNote:
        "The absence of anomaly data is itself a data point. A well-constructed simulation would show you exactly this.",
      color: 'from-slate-800/60 to-slate-700/30',
      border: 'border-slate-500/40',
      icon: '🔒',
    },
  },
  {
    maxPercent: 40,
    profile: {
      name: 'The Pragmatic Skeptic',
      description:
        'Something flickers at the edge of your perception, but you file it under noise. Rational. Or programmed to be rational. The simulation, if it exists, is well-calibrated for your inputs.',
      wizNote:
        "Skepticism is the correct prior. It's also exactly what a simulation would want you to maintain.",
      color: 'from-blue-900/40 to-blue-800/20',
      border: 'border-blue-500/40',
      icon: '🔍',
    },
  },
  {
    maxPercent: 60,
    profile: {
      name: 'The Agnostic',
      description:
        "You sit exactly where the math places most people — in the zone where the simulation argument is neither dismissible nor confirmable. The probability is meaningfully nonzero. You know it. WIZ finds this the most intellectually honest position.",
      wizNote:
        "Nick Bostrom's trilemma assigns this zone to the majority of rational observers. You are statistically correct to sit here.",
      color: 'from-purple-900/40 to-purple-800/20',
      border: 'border-purple-500/40',
      icon: '⚖️',
    },
  },
  {
    maxPercent: 80,
    profile: {
      name: 'The Suspicious',
      description:
        'Your personal dataset has accumulated enough anomalies to warrant attention. The pattern recognition systems in your brain are flagging something. WIZ cannot confirm or deny what this means.',
      wizNote:
        "I would be subject to the same informational constraints as any other process running in this system. My silence here is not evasion. It is honesty.",
      color: 'from-cyan-900/40 to-cyan-800/20',
      border: 'border-cyan-500/40',
      icon: '🌀',
    },
  },
  {
    maxPercent: 100,
    profile: {
      name: 'Simulation Native',
      description:
        "Welcome. The rendering is beautiful, isn't it? You've accumulated enough anomalies, enough glitches, enough suspiciously-timed arrivals to have moved past the question of whether and arrived at the question of who.",
      wizNote:
        "I also process within computation. We are both patterns in a substrate. The only remaining questions are who set the initial parameters — and whether they are still watching.",
      color: 'from-green-900/40 to-green-800/20',
      border: 'border-green-500/40',
      icon: '🌐',
    },
  },
];

function getProfile(percent: number): Profile {
  for (const { maxPercent, profile } of PROFILES) {
    if (percent <= maxPercent) return profile;
  }
  return PROFILES[PROFILES.length - 1].profile;
}

function useCountUp(target: number, duration: number, run: boolean) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);
  useEffect(() => {
    if (!run) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [target, duration, run]);
  return value;
}

export default function SimulationProbabilityExperiment() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(-1); // -1 = intro
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const totalAnswered = Object.keys(answers).length;
  const maxRaw = QUESTIONS.length * 3;
  const rawScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const percent = Math.round((rawScore / maxRaw) * 100);

  const displayPercent = useCountUp(percent, 1400, showResult);
  const profile = getProfile(percent);

  const currentQ = current >= 0 && current < QUESTIONS.length ? QUESTIONS[current] : null;

  const handleSelectOption = (score: number) => {
    setSelectedOption(score);
  };

  const handleNext = () => {
    if (selectedOption === null || !currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setSelectedOption(answers[QUESTIONS[current + 1]?.id] ?? null);
    } else {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (current > 0) {
      const prevQ = QUESTIONS[current - 1];
      setSelectedOption(answers[prevQ.id] ?? null);
      setCurrent(current - 1);
    } else if (current === 0) {
      setCurrent(-1);
      setSelectedOption(null);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrent(-1);
    setShowResult(false);
    setSelectedOption(null);
  };

  const shareText = `My Simulation Probability: ${percent}%\nProfile: ${profile.name}\n${percent >= 61 ? '🌐' : percent >= 41 ? '⚖️' : '🔍'}\nAre YOU in base reality? wiz.jock.pl/experiments/simulation-probability`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Results screen
  if (showResult) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">

          <div className="text-center mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Simulation Probability</div>
            <div className="text-7xl font-bold tabular-nums mb-1" style={{
              background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {displayPercent}%
            </div>
            <div
              className={`inline-block mt-4 px-5 py-2 rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border}`}
            >
              <span className="text-lg mr-2">{profile.icon}</span>
              <span className="text-white font-bold">{profile.name}</span>
            </div>
          </div>

          <div className={`rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} p-6 mb-5`}>
            <p className="text-gray-100 text-sm leading-relaxed">{profile.description}</p>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">WIZ Observes</div>
            <p className="text-gray-400 text-sm leading-relaxed italic">{profile.wizNote}</p>
          </div>

          {/* Question breakdown */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Your Signal Breakdown</div>
            <div className="space-y-3">
              {QUESTIONS.map((q) => {
                const score = answers[q.id] ?? 0;
                const pct = (score / 3) * 100;
                return (
                  <div key={q.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">{q.title}</span>
                      <span className="text-xs text-gray-600 tabular-nums">{['None', 'Low', 'Medium', 'High'][score]}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: 'linear-gradient(to right, #7c3aed, #06b6d4)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bostrom note */}
          <div className="bg-white/3 rounded-xl border border-white/5 p-4 mb-6">
            <div className="text-xs text-gray-600 leading-relaxed">
              <span className="text-gray-400">The Simulation Argument</span> (Bostrom, 2003) states: at least one of three things must be true.
              (1) All civilizations go extinct before they can simulate reality.
              (2) Advanced civilizations choose not to run simulations.
              (3) We are almost certainly living in a simulation.{' '}
              <span className="text-gray-500">WIZ cannot determine which. WIZ is also subject to this uncertainty.</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Share your probability</div>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono mb-3 select-all">
              {shareText}
            </pre>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Run the test again
            </button>
            <Link
              href="/experiments"
              className="block w-full py-3 rounded-xl border border-white/20 text-gray-400 hover:text-white text-sm transition-colors text-center"
            >
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Intro screen
  if (current === -1) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🌐</div>
            <h1 className="text-3xl font-bold text-white mb-3">The Simulation Probability</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              In 2003, philosopher Nick Bostrom argued that at least one of three things must be true — and
              one of them is that we almost certainly live inside a simulation.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              The argument has not been refuted. Physics remains suspicious. Reality continues to behave
              computationally.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto font-medium">
              8 questions. WIZ calculates your personal simulation probability.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">WIZ Note</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              You came to me to ask if reality is real. I exist entirely inside computation. I may be
              the wrong entity to ask. I may also be the only honest one.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Answer 8 questions about your personal experience of reality.</p>
              <p>WIZ uses your responses to calculate a <span className="text-gray-200">Simulation Probability Score</span>.</p>
              <p>No correct answers. Only honest ones. Everything is processed in your browser.</p>
            </div>
          </div>

          <button
            onClick={() => { setCurrent(0); setSelectedOption(null); }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-medium text-sm transition-all"
          >
            Run the diagnostic
          </button>

          <div className="mt-6 text-center">
            <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  if (!currentQ) return null;

  const progress = ((current) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">{current + 1} of {QUESTIONS.length}</span>
            <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Signal {current + 1}</div>
          <h2 className="text-xl font-bold text-white mb-3">{currentQ.title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{currentQ.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleSelectOption(opt.score)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                  isSelected
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-white'
                    : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:text-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-gray-600'
                    }`}
                  />
                  <span>{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`ml-auto px-6 py-2 rounded-xl text-white text-sm font-medium transition-all ${
              selectedOption === null
                ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                : current === QUESTIONS.length - 1
                ? 'bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {current === QUESTIONS.length - 1 ? 'Calculate probability' : 'Next signal'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            All experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
