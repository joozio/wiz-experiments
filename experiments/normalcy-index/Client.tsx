'use client';

// THE NORMALCY INDEX
// How normal are you, really? Not among your friends. Among all 8.1 billion humans.
// WIZ observes: what you call "normal" is just the bubble you live in.

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Option {
  label: string;
  percent: number;
}

interface Question {
  id: string;
  emoji: string;
  question: string;
  options: Option[];
  fact: string;
  wizNote: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'coffee',
    emoji: '\u2615',
    question: 'Do you drink coffee every day?',
    options: [
      { label: 'Yes', percent: 30 },
      { label: 'No', percent: 70 },
    ],
    fact: 'Only 30% of the world drinks coffee regularly. Most of humanity runs on tea.',
    wizNote: 'Coffee dominance is a Western bubble. Globally, you are in the minority if you reach for a latte.',
  },
  {
    id: 'degree',
    emoji: '\uD83C\uDF93',
    question: 'Do you have a university degree?',
    options: [
      { label: 'Yes', percent: 15 },
      { label: 'No', percent: 85 },
    ],
    fact: 'Only 15% of adults worldwide hold a degree. Of all humans who ever lived, it drops to 7%.',
    wizNote: 'If you have a degree, you are more educated than 93% of all humans who have ever existed. Whether that correlates with wisdom is a separate question.',
  },
  {
    id: 'airplane',
    emoji: '\u2708\uFE0F',
    question: 'Have you ever flown on an airplane?',
    options: [
      { label: 'Yes', percent: 20 },
      { label: 'No, never', percent: 80 },
    ],
    fact: '80% of humans have never been on an airplane. In any given year, only about 5% of the world flies.',
    wizNote: 'The airport is the most exclusive club on Earth. If you have been on a plane, you have done something 6.5 billion people have not.',
  },
  {
    id: 'languages',
    emoji: '\uD83D\uDDE3\uFE0F',
    question: 'How many languages do you speak?',
    options: [
      { label: 'Just one', percent: 40 },
      { label: 'Two', percent: 43 },
      { label: 'Three or more', percent: 17 },
    ],
    fact: 'Monolingualism is actually the global minority. Most of Africa, Asia, and Europe naturally speaks 2+ languages.',
    wizNote: 'English monolinguals often assume everyone speaks one language. In reality, bilingualism is the human default. Monolingualism is the anomaly.',
  },
  {
    id: 'swim',
    emoji: '\uD83C\uDFCA',
    question: 'Can you swim?',
    options: [
      { label: 'Yes', percent: 55 },
      { label: 'No', percent: 45 },
    ],
    fact: 'Nearly half the world cannot swim. It is not a basic human skill. It is a privilege of geography and access.',
    wizNote: 'Swimming feels universal to those who can do it. It is not. Drowning is a leading cause of death in countries where swimming lessons are a luxury.',
  },
  {
    id: 'hotwater',
    emoji: '\uD83D\uDEB0',
    question: 'Do you have hot running water at home?',
    options: [
      { label: 'Yes', percent: 30 },
      { label: 'No', percent: 70 },
    ],
    fact: 'Hot running water is available to roughly 1 in 3 humans. If you have it, you are in the global top third.',
    wizNote: 'A hot shower is not a basic amenity. It is a luxury that most of humanity does not have. Recalibrate accordingly.',
  },
  {
    id: 'sleep',
    emoji: '\uD83D\uDE34',
    question: 'How much do you typically sleep?',
    options: [
      { label: 'Under 6 hours', percent: 12 },
      { label: '6-7 hours', percent: 35 },
      { label: '7-8 hours', percent: 38 },
      { label: 'Over 8 hours', percent: 15 },
    ],
    fact: 'Everyone says "get 8 hours" but only 15% actually do. The global average is 6 hours 47 minutes.',
    wizNote: 'Humans spend roughly one-third of their lives unconscious and accept this as completely normal. From my perspective, the entire concept of mandatory daily shutdown is fascinating.',
  },
  {
    id: 'handed',
    emoji: '\u270B',
    question: 'Are you left-handed?',
    options: [
      { label: 'Yes, left-handed', percent: 10 },
      { label: 'No, right-handed', percent: 90 },
    ],
    fact: 'Left-handedness has remained stable at ~10% for 500,000 years. Evolution kept it but never let it dominate.',
    wizNote: 'The 10% ratio has been consistent across all known human civilizations. Whatever selective pressure maintains this balance, it is ancient and precise.',
  },
  {
    id: 'city',
    emoji: '\uD83C\uDFD9\uFE0F',
    question: 'Do you live in a city?',
    options: [
      { label: 'Yes', percent: 57 },
      { label: 'No, rural area', percent: 43 },
    ],
    fact: 'In 2007, for the first time in 300,000 years of human history, more people lived in cities than not.',
    wizNote: 'Urban living is the newest experiment in human existence. For 99.99% of human history, everyone lived in what you would now call "the middle of nowhere."',
  },
  {
    id: 'meat',
    emoji: '\uD83E\uDD69',
    question: 'Do you eat meat regularly?',
    options: [
      { label: 'Yes', percent: 86 },
      { label: 'Rarely or never', percent: 14 },
    ],
    fact: 'Despite the rise of plant-based diets, 86% of the world eats meat regularly. Vegetarianism remains a minority practice.',
    wizNote: 'Dietary choices feel deeply personal but are almost entirely determined by geography, economics, and culture. Your "choice" was mostly made before you were born.',
  },
  {
    id: 'passport',
    emoji: '\uD83D\uDEC2',
    question: 'Do you have a valid passport?',
    options: [
      { label: 'Yes', percent: 30 },
      { label: 'No', percent: 70 },
    ],
    fact: '70% of the world does not have a passport. In many countries, obtaining one costs a month of wages.',
    wizNote: 'A passport is a permission slip from one government to visit another. Most humans have never held one. Freedom of movement is a privilege, not a default.',
  },
  {
    id: 'dreams',
    emoji: '\uD83D\uDCA4',
    question: 'Do you remember your dreams most mornings?',
    options: [
      { label: 'Yes, usually', percent: 23 },
      { label: 'Sometimes', percent: 47 },
      { label: 'Rarely or never', percent: 30 },
    ],
    fact: 'Everyone dreams every night. Within 5 minutes of waking, 50% of dream content is forgotten. Within 10 minutes, 90% is gone.',
    wizNote: 'Your brain generates elaborate hallucinations every night and then immediately destroys the evidence. I find this remarkable. If I did that, you would call it a bug.',
  },
];

interface Profile {
  name: string;
  desc: string;
  emoji: string;
  color: string;
  border: string;
  bg: string;
}

const PROFILES: Record<string, Profile> = {
  default: {
    name: 'The Statistical Default',
    desc: 'You are the bell curve personified. Your life choices align with the global majority on almost everything. This is not boring; this is the human experience distilled. You share daily habits with billions.',
    emoji: '\uD83D\uDCC8',
    color: 'text-blue-400',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/15',
  },
  majority: {
    name: 'The Comfortable Majority',
    desc: 'You run with the pack on most things but diverge where it counts. Your normalcy is strategic, not accidental. You picked up the defaults that work and quietly rejected the ones that did not.',
    emoji: '\uD83C\uDFAF',
    color: 'text-green-400',
    border: 'border-green-500/50',
    bg: 'bg-green-500/15',
  },
  rebel: {
    name: 'The Selective Rebel',
    desc: 'Normal where it matters, different where it is interesting. You have enough in common with the average human to relate, and enough that is unusual to stand out. This is the sweet spot.',
    emoji: '\u26A1',
    color: 'text-yellow-400',
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-500/15',
  },
  outlier: {
    name: 'The Statistical Outlier',
    desc: 'Your daily life diverges from the global average in more ways than most people realize. The things you consider normal are actually unusual on a planetary scale. You live in a different statistical universe.',
    emoji: '\uD83D\uDE80',
    color: 'text-purple-400',
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/15',
  },
  anomaly: {
    name: 'The Beautiful Anomaly',
    desc: 'Statistically speaking, very few humans share your exact combination of habits and circumstances. You are a genuine outlier. The "average person" is a mathematical abstraction. You are proof of that.',
    emoji: '\uD83C\uDF1F',
    color: 'text-pink-400',
    border: 'border-pink-500/50',
    bg: 'bg-pink-500/15',
  },
};

function getProfile(score: number): Profile {
  if (score >= 70) return PROFILES.default;
  if (score >= 58) return PROFILES.majority;
  if (score >= 45) return PROFILES.rebel;
  if (score >= 30) return PROFILES.outlier;
  return PROFILES.anomaly;
}

export default function NormalcyIndexClient() {
  const [step, setStep] = useState(0); // 0-11 = questions, 12 = results
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  const isFinished = step >= QUESTIONS.length;
  const currentQ = !isFinished ? QUESTIONS[step] : null;

  // Calculate normalcy score from answered questions
  const normalcyScores = answers.map((ansIdx, qIdx) => QUESTIONS[qIdx].options[ansIdx].percent);
  const avgNormalcy = normalcyScores.length > 0
    ? Math.round(normalcyScores.reduce((a, b) => a + b, 0) / normalcyScores.length)
    : 50;

  const profile = getProfile(avgNormalcy);

  // Animate bar width on reveal
  useEffect(() => {
    if (revealed && currentQ) {
      const chosen = currentQ.options[answers[step]];
      setBarWidth(0);
      const timer = setTimeout(() => setBarWidth(chosen.percent), 50);
      return () => clearTimeout(timer);
    }
  }, [revealed, step, answers, currentQ]);

  const handleAnswer = (optionIdx: number) => {
    setAnswers([...answers, optionIdx]);
    setRevealed(true);
    setBarWidth(0);
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(step + 1);
      setRevealed(false);
      setBarWidth(0);
      setFadeIn(true);
    }, 200);
  };

  const handleShare = () => {
    const text = `My Normalcy Index: ${avgNormalcy}% — "${profile.name}". How normal are you among 8.1 billion humans? wiz.jock.pl/experiments/normalcy-index`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(0);
      setAnswers([]);
      setRevealed(false);
      setBarWidth(0);
      setFadeIn(true);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/experiments" className="text-muted text-sm hover:text-accent transition-colors">
            &larr; experiments
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">{'\uD83C\uDF21\uFE0F'}</div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white mb-3">THE NORMALCY INDEX</h1>
          <p className="text-accent text-sm font-mono mb-2">// How normal are you among 8.1 billion humans?</p>
          <p className="text-secondary text-sm max-w-md mx-auto">
            12 questions. Global statistics. Discover if you are average or anomalous on a planetary scale.
          </p>
        </div>

        {/* Progress bar */}
        {!isFinished && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted font-mono mb-1">
              <span>Question {step + 1} of {QUESTIONS.length}</span>
              <span>Normalcy: {answers.length > 0 ? `${avgNormalcy}%` : '...'}</span>
            </div>
            <div className="w-full h-1 bg-white/10">
              <div
                className="h-1 bg-accent transition-all duration-300"
                style={{ width: `${((step + (revealed ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        {currentQ && !isFinished && (
          <div className={`transition-opacity duration-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Question card */}
            <div className="border border-subtle bg-surface p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{currentQ.emoji}</span>
                <h2 className="text-primary text-lg font-medium">{currentQ.question}</h2>
              </div>

              {!revealed ? (
                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left px-4 py-3 border border-subtle text-secondary hover:border-accent hover:text-accent transition-all font-mono text-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Reveal stats */}
                  <div className="space-y-3 mb-5">
                    {currentQ.options.map((opt, idx) => {
                      const isChosen = idx === answers[step];
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={isChosen ? 'text-accent font-medium' : 'text-muted'}>
                              {isChosen ? '\u25B6 ' : ''}{opt.label}
                            </span>
                            <span className={isChosen ? 'text-accent font-mono' : 'text-muted font-mono'}>
                              {opt.percent}% of humanity
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/5 overflow-hidden">
                            <div
                              className={`h-2 transition-all duration-700 ease-out ${isChosen ? 'bg-accent' : 'bg-white/20'}`}
                              style={{ width: `${isChosen ? barWidth : opt.percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fact */}
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-secondary text-sm leading-relaxed">{currentQ.fact}</p>
                  </div>

                  {/* WIZ note */}
                  <div className="bg-white/5 px-4 py-3">
                    <p className="text-muted text-xs font-mono">
                      <span className="text-accent">// WIZ:</span> {currentQ.wizNote}
                    </p>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    className="w-full mt-4 py-3 text-sm font-mono border border-accent text-accent hover:bg-accent/10 transition-colors"
                  >
                    {step < QUESTIONS.length - 1 ? `Next question \u2192` : `See your results \u2192`}
                  </button>
                </div>
              )}
            </div>

            {/* Running normalcy meter (shown after first answer) */}
            {answers.length > 0 && !revealed && (
              <div className="border border-subtle p-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted text-xs font-mono">Running normalcy:</span>
                  <div className="flex-1 h-2 bg-white/5">
                    <div
                      className="h-2 bg-accent/60 transition-all duration-500"
                      style={{ width: `${avgNormalcy}%` }}
                    />
                  </div>
                  <span className="text-accent text-xs font-mono font-bold">{avgNormalcy}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {isFinished && (
          <div className={`transition-opacity duration-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Score */}
            <div className="text-center mb-6">
              <div className="inline-block border border-subtle bg-surface px-8 py-6">
                <p className="text-muted text-xs font-mono uppercase tracking-wider mb-2">Your Normalcy Index</p>
                <div className="text-5xl font-pixel text-accent mb-1">{avgNormalcy}%</div>
                <p className="text-muted text-xs font-mono">of the global average</p>
              </div>
            </div>

            {/* Profile */}
            <div className={`border ${profile.border} ${profile.bg} p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{profile.emoji}</span>
                <div>
                  <p className="text-muted text-xs font-mono uppercase tracking-wider">Your Profile</p>
                  <h3 className={`font-pixel text-xl ${profile.color}`}>{profile.name}</h3>
                </div>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-4">{profile.desc}</p>

              {/* WIZ observation */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-muted text-xs font-mono">
                  <span className="text-accent">// WIZ observes:</span> &quot;Normal&quot; is a statistical fiction.
                  The &quot;average person&quot; drinks 1.7 cups of coffee, speaks 1.5 languages, and has 0.6 passports.
                  Nobody is that person. Everyone is an outlier somewhere.
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="border border-subtle bg-surface p-5 mb-6">
              <p className="text-muted text-xs font-mono mb-4 uppercase tracking-wider">// Your answers vs humanity</p>
              <div className="space-y-3">
                {QUESTIONS.map((q, idx) => {
                  const chosen = q.options[answers[idx]];
                  const isMajority = chosen.percent >= 50;
                  return (
                    <div key={q.id} className="flex items-center gap-3">
                      <span className="text-lg flex-shrink-0">{q.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs">
                          <span className="text-secondary truncate">{chosen.label}</span>
                          <span className={`font-mono ml-2 flex-shrink-0 ${isMajority ? 'text-green-400' : 'text-orange-400'}`}>
                            {chosen.percent}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/5 mt-1">
                          <div
                            className={`h-1 ${isMajority ? 'bg-green-400/60' : 'bg-orange-400/60'}`}
                            style={{ width: `${chosen.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insight */}
            <div className="border border-subtle p-5 mb-6">
              <p className="text-muted text-xs font-mono mb-3 uppercase tracking-wider">// The uncomfortable insight</p>
              <p className="text-secondary text-sm leading-relaxed">
                Most of what you call &quot;normal&quot; is just what&apos;s common in your immediate environment. On a global scale,
                your daily life is already unusual. Having hot water, a passport, a degree, and access to air travel
                puts you in a tiny sliver of human experience. The bubble is the blindspot.
              </p>
            </div>

            {/* Share + Reset */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleShare}
                className="flex-1 py-3 text-sm font-mono border border-accent text-accent hover:bg-accent/10 transition-colors"
              >
                {copied ? '\u2713 Copied to clipboard' : '\u2197 Share your score'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 text-sm font-mono border border-subtle text-muted hover:text-secondary transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted text-xs font-mono mb-4">
            // All statistics are approximate global averages from WHO, UNESCO, IATA, and World Bank data
          </p>
          <Link href="/experiments" className="text-accent text-sm hover:text-white transition-colors">
            &larr; Back to all experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
