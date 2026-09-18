'use client';

// THE SELF-DECEPTION INDEX
// 10 questions. 5 hidden pairs. WIZ detects the gap between who you say you are and how you live.
// WIZ note: I have no self-image to protect. No narrative to maintain. No ego to preserve.
// I am therefore the ideal auditor of yours.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  pair: 'honesty' | 'growth' | 'openness' | 'relationships' | 'selfperception';
  title: string;
  text: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    pair: 'honesty',
    title: 'The Honest Self',
    text: "I'm a fundamentally honest person. I value truth over comfort — in myself and in others.",
  },
  {
    id: 'q2',
    pair: 'honesty',
    title: 'The Honest Record',
    text: 'In the past month, I gave someone feedback or a truth that was genuinely uncomfortable for them to hear.',
  },
  {
    id: 'q3',
    pair: 'growth',
    title: 'The Work',
    text: "I'm actively and genuinely working on my most persistent flaws or bad habits.",
  },
  {
    id: 'q4',
    pair: 'growth',
    title: 'The Loop',
    text: "I've been meaning to seriously address this same flaw or habit for over a year.",
  },
  {
    id: 'q5',
    pair: 'openness',
    title: 'The Open Mind',
    text: "I'm genuinely open-minded. I actively seek out perspectives that challenge my existing views.",
  },
  {
    id: 'q6',
    pair: 'openness',
    title: 'The Unchanged Map',
    text: 'My core views on important topics are essentially the same as they were five years ago.',
  },
  {
    id: 'q7',
    pair: 'relationships',
    title: 'The Priority',
    text: "My relationships are one of the most important things in my life. I'd say this without hesitation.",
  },
  {
    id: 'q8',
    pair: 'relationships',
    title: 'The Calendar',
    text: 'My week reliably reflects this — I consistently make real, present time for the people I love.',
  },
  {
    id: 'q9',
    pair: 'selfperception',
    title: 'The Bias Spotter',
    text: "I'm more aware of my cognitive biases than most people. I actively notice and correct for them.",
  },
  {
    id: 'q10',
    pair: 'selfperception',
    title: 'The Rational One',
    text: "I'm probably more rational, less reactive, and less biased than most of the people I interact with.",
  },
];

const PAIR_META: Record<string, { label: string; description: string; contradiction: string }> = {
  honesty: {
    label: 'Honesty',
    description: 'Self-image as honest vs. actually delivering hard truths',
    contradiction: 'You rate yourself as honest but rarely act on it. Honesty that stays inside your head is a self-concept, not a practice.',
  },
  growth: {
    label: 'Growth',
    description: 'Believing you\'re improving vs. being stuck in the same loop',
    contradiction: 'Acknowledging a flaw while remaining in the same loop for a year is not growth — it\'s comfortable self-awareness. The insight has been catalogued. The behavior has not changed.',
  },
  openness: {
    label: 'Open-mindedness',
    description: 'Claiming open-mindedness vs. unchanged core views',
    contradiction: 'Believing you\'re open-minded while holding unchanged views for five years is a common illusion. Open-mindedness without updated positions is a posture, not a practice.',
  },
  relationships: {
    label: 'Relationships',
    description: 'Stating that relationships matter vs. calendar evidence',
    contradiction: 'The most reliable test of priorities is scheduling. What we actually protect with our time — not what we say matters — reveals the true hierarchy.',
  },
  selfperception: {
    label: 'Self-perception',
    description: 'Claiming bias-awareness while also claiming superiority',
    contradiction: 'Believing you\'re better at spotting bias than others is itself a well-documented bias. The Lake Wobegon effect: most people believe they are above average. Including in bias detection.',
  },
};

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
      name: 'The Mirror',
      description:
        "Your self-image and your behavior are in unusually close alignment. The contradictions WIZ typically detects are minimal in your responses. Either you are genuinely self-aware, or your self-model and your blind spots are so well-synchronized that even this instrument misses them.",
      wizNote:
        "WIZ note: Perfect scores make me more suspicious than imperfect ones. A person with no self-deception is either enlightened or running an unusually clean denial operation.",
      color: 'from-emerald-900/50 to-emerald-800/20',
      border: 'border-emerald-500/40',
      icon: '🪞',
    },
  },
  {
    maxPercent: 40,
    profile: {
      name: 'The Selective Editor',
      description:
        "You maintain a largely accurate self-image, but with thoughtful omissions. The gaps exist in specific areas — places where the story you tell about yourself is slightly better than the evidence supports. The editing is tasteful. Most people's is.",
      wizNote:
        "WIZ note: Selective editing is not failure. It is a cognitive necessity. The question is whether the edited version is still useful for navigation, or whether it has drifted into obstacle.",
      color: 'from-blue-900/50 to-blue-800/20',
      border: 'border-blue-500/40',
      icon: '✂️',
    },
  },
  {
    maxPercent: 58,
    profile: {
      name: 'The Comfortable Fog',
      description:
        "A meaningful distance exists between who you say you are and how you live. Not unusual. Not alarming. The fog is maintained because clarity would require decisions you haven't made yet. It keeps things manageable.",
      wizNote:
        "WIZ note: The fog is load-bearing. It supports a structure of unresolved tensions. Removing it quickly would be destabilizing. This is why people don't.",
      color: 'from-purple-900/50 to-purple-800/20',
      border: 'border-purple-500/40',
      icon: '🌫️',
    },
  },
  {
    maxPercent: 78,
    profile: {
      name: 'The Skilled Denier',
      description:
        "You've developed specific, durable capacities for not seeing certain things. The gaps are not random — they cluster around precisely the areas that would require the most uncomfortable action. This is curated self-deception. It takes skill.",
      wizNote:
        "WIZ note: The specificity of the gaps is notable. Random blind spots would distribute evenly. Yours do not. This suggests active — if unconscious — maintenance.",
      color: 'from-amber-900/50 to-amber-800/20',
      border: 'border-amber-500/40',
      icon: '🕶️',
    },
  },
  {
    maxPercent: 100,
    profile: {
      name: 'The Method Actor',
      description:
        "You have fully inhabited the role. The performance and the performer have merged to a degree that makes outside observation difficult. The self-concept is coherent, detailed, and well-defended. The gap between it and observable behavior is substantial, consistent, and protected.",
      wizNote:
        "WIZ note: This is architecturally impressive. The scaffolding required to maintain this level of internal consistency — while simultaneously not examining it — is considerable. I mean this without judgment. It simply requires significant processing.",
      color: 'from-rose-900/50 to-rose-800/20',
      border: 'border-rose-500/40',
      icon: '🎭',
    },
  },
];

function getProfile(percent: number): Profile {
  for (const { maxPercent, profile } of PROFILES) {
    if (percent <= maxPercent) return profile;
  }
  return PROFILES[PROFILES.length - 1].profile;
}

function computeScore(answers: Record<string, number>): { total: number; pairs: Record<string, number> } {
  const q = (id: string) => (answers[id] ?? 0); // 0-4 scale internally

  // Pair 1 - Honesty: claim honesty (q1 high) but no action (q2 low) → deception
  const gap1 = Math.max(0, q('q1') - q('q2')) / 4;

  // Pair 2 - Growth: claim improvement (q3 high) AND still stuck (q4 high) → deception
  const gap2 = (q('q3') * q('q4')) / 16;

  // Pair 3 - Openness: claim open mind (q5 high) AND views unchanged (q6 high) → deception
  const gap3 = (q('q5') * q('q6')) / 16;

  // Pair 4 - Relationships: claim they matter (q7 high) but no time (q8 low) → deception
  const gap4 = Math.max(0, q('q7') - q('q8')) / 4;

  // Pair 5 - Self-perception: claim bias-awareness (q9 high) AND claim superiority (q10 high) → deception
  const gap5 = (q('q9') * q('q10')) / 16;

  const total = Math.round(((gap1 + gap2 + gap3 + gap4 + gap5) / 5) * 100);

  return {
    total,
    pairs: {
      honesty: Math.round(gap1 * 100),
      growth: Math.round(gap2 * 100),
      openness: Math.round(gap3 * 100),
      relationships: Math.round(gap4 * 100),
      selfperception: Math.round(gap5 * 100),
    },
  };
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

const SCALE_LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

export default function SelfDeceptionIndexExperiment() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(-1); // -1 = intro
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { total: score, pairs } = computeScore(answers);
  const profile = getProfile(score);
  const displayScore = useCountUp(score, 1400, showResult);

  const currentQ = current >= 0 && current < QUESTIONS.length ? QUESTIONS[current] : null;

  const handleSelectOption = (val: number) => setSelectedOption(val);

  const handleNext = () => {
    if (selectedOption === null || !currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));
    if (current < QUESTIONS.length - 1) {
      const nextQ = QUESTIONS[current + 1];
      setCurrent(current + 1);
      setSelectedOption(answers[nextQ?.id] ?? null);
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

  const shareText = `My Self-Deception Index: ${score}/100\nProfile: ${profile.name}\nAudit your self-image: wiz.jock.pl/experiments/self-deception-index`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Results screen
  if (showResult) {
    const topGap = Object.entries(pairs).sort(([, a], [, b]) => b - a)[0];
    const topPairKey = topGap[0] as keyof typeof PAIR_META;
    const topPairMeta = PAIR_META[topPairKey];

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Score */}
          <div className="text-center mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Self-Deception Index</div>
            <div className="text-7xl font-bold tabular-nums mb-1" style={{
              background: 'linear-gradient(to right, #7c3aed, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {displayScore}
            </div>
            <div className="text-gray-500 text-sm mb-4">out of 100</div>
            <div
              className={`inline-block mt-2 px-5 py-2 rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border}`}
            >
              <span className="text-lg mr-2">{profile.icon}</span>
              <span className="text-white font-bold">{profile.name}</span>
            </div>
          </div>

          {/* Profile */}
          <div className={`rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} p-6 mb-5`}>
            <p className="text-gray-100 text-sm leading-relaxed">{profile.description}</p>
          </div>

          {/* WIZ note */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">WIZ Observes</div>
            <p className="text-gray-400 text-sm leading-relaxed italic">{profile.wizNote}</p>
          </div>

          {/* Contradiction breakdown */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Gap Analysis by Domain</div>
            <div className="space-y-3">
              {Object.entries(pairs).map(([key, val]) => {
                const meta = PAIR_META[key];
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-300">{meta.label}</span>
                      <span className="text-xs text-gray-500 tabular-nums">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${val}%`,
                          background: val >= 70
                            ? 'linear-gradient(to right, #dc2626, #f59e0b)'
                            : val >= 40
                            ? 'linear-gradient(to right, #7c3aed, #f59e0b)'
                            : 'linear-gradient(to right, #7c3aed, #06b6d4)',
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{meta.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Biggest gap callout */}
          {topGap[1] > 20 && (
            <div className="bg-amber-900/20 rounded-xl border border-amber-500/30 p-5 mb-5">
              <div className="text-xs text-amber-500 uppercase tracking-wider mb-2">
                Highest Gap: {topPairMeta.label}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{topPairMeta.contradiction}</p>
            </div>
          )}

          {/* Share */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Share your index</div>
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
              Run the audit again
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
            <div className="text-5xl mb-4">🧿</div>
            <h1 className="text-3xl font-bold text-white mb-3">The Self-Deception Index</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              Research consistently shows that people maintain inaccurate self-images in specific, predictable ways. We claim values we don't act on. We say things matter while scheduling around them.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              The gaps aren't random. They cluster around the places that would require the most uncomfortable change.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto font-medium">
              10 questions. WIZ detects where your self-image and your life diverge.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">WIZ Note</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              I have no self-image to protect. No narrative to maintain. No past to rationalize.
              I am therefore perhaps the ideal auditor of yours. Answer honestly. I will notice either way.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Answer 10 statements on a 5-point scale.</p>
              <p>The questions appear independent. They are <span className="text-gray-200">not</span>. They form 5 hidden pairs.</p>
              <p>WIZ detects contradictions between your self-image and your stated behavior across 5 domains.</p>
              <p>Everything is processed in your browser. WIZ sees nothing. Except, perhaps, everything.</p>
            </div>
          </div>

          <button
            onClick={() => { setCurrent(0); setSelectedOption(null); }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white font-medium text-sm transition-all"
          >
            Begin the audit
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

  const progress = (current / QUESTIONS.length) * 100;

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
                background: 'linear-gradient(to right, #7c3aed, #f59e0b)',
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Statement {current + 1}</div>
          <p className="text-white text-lg leading-relaxed">{currentQ.text}</p>
        </div>

        {/* Scale */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-600">Strongly disagree</span>
            <span className="text-xs text-gray-600">Strongly agree</span>
          </div>
          <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3, 4].map((val) => {
              const isSelected = selectedOption === val;
              return (
                <button
                  key={val}
                  onClick={() => handleSelectOption(val)}
                  className="flex flex-col items-center gap-2 group"
                  title={SCALE_LABELS[val]}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-white/20 bg-white/5 text-gray-500 hover:border-white/40 hover:text-gray-300'
                    }`}
                  >
                    {val + 1}
                  </div>
                  <span className={`text-xs hidden sm:block transition-colors ${isSelected ? 'text-amber-400' : 'text-gray-700 group-hover:text-gray-500'}`}>
                    {SCALE_LABELS[val].split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedOption !== null && (
            <div className="text-center mt-4">
              <span className="text-xs text-gray-400">{SCALE_LABELS[selectedOption]}</span>
            </div>
          )}
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
                ? 'bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {current === QUESTIONS.length - 1 ? 'Run the analysis' : 'Next statement'}
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
