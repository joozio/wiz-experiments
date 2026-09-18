'use client';

import { useState, useCallback } from 'react';

interface Trait {
  id: string;
  question: string;
  options: { label: string; percentage: number }[];
  funFact: string;
  icon: string;
}

const WORLD_POPULATION = 8_100_000_000;

const TRAITS: Trait[] = [
  {
    id: 'handedness',
    question: 'Which hand do you write with?',
    options: [
      { label: 'Right', percentage: 89 },
      { label: 'Left', percentage: 10 },
      { label: 'Ambidextrous', percentage: 1 },
    ],
    funFact: 'Left-handedness was considered evil in many cultures. The word "sinister" literally comes from the Latin for "left."',
    icon: '✋',
  },
  {
    id: 'eye-color',
    question: 'What color are your eyes?',
    options: [
      { label: 'Brown', percentage: 79 },
      { label: 'Blue', percentage: 8 },
      { label: 'Hazel', percentage: 5 },
      { label: 'Green', percentage: 2 },
      { label: 'Gray / Other', percentage: 6 },
    ],
    funFact: 'Every blue-eyed person on Earth shares a single common ancestor who lived near the Black Sea roughly 10,000 years ago.',
    icon: '👁️',
  },
  {
    id: 'blood-type',
    question: 'What\'s your blood type?',
    options: [
      { label: 'O+', percentage: 39 },
      { label: 'A+', percentage: 31 },
      { label: 'B+', percentage: 8 },
      { label: 'O-', percentage: 9 },
      { label: 'A-', percentage: 6 },
      { label: 'AB+', percentage: 3 },
      { label: 'B-', percentage: 2 },
      { label: 'AB-', percentage: 1 },
      { label: 'No idea', percentage: 100 },
    ],
    funFact: 'Type O- is the universal donor. Only 9% of people have it, but every hospital on Earth is desperate for it.',
    icon: '🩸',
  },
  {
    id: 'birth-month',
    question: 'What month were you born?',
    options: [
      { label: 'January', percentage: 8.2 },
      { label: 'February', percentage: 7.6 },
      { label: 'March', percentage: 8.4 },
      { label: 'April', percentage: 8.1 },
      { label: 'May', percentage: 8.3 },
      { label: 'June', percentage: 8.5 },
      { label: 'July', percentage: 8.8 },
      { label: 'August', percentage: 8.9 },
      { label: 'September', percentage: 9.0 },
      { label: 'October', percentage: 8.4 },
      { label: 'November', percentage: 7.9 },
      { label: 'December', percentage: 7.9 },
    ],
    funFact: 'September is the most common birth month worldwide. Count back 9 months and you land on New Year\'s Eve. Coincidence? No.',
    icon: '🎂',
  },
  {
    id: 'tongue-roll',
    question: 'Can you roll your tongue?',
    options: [
      { label: 'Yes', percentage: 65 },
      { label: 'No', percentage: 35 },
    ],
    funFact: 'For decades, tongue-rolling was taught as a simple genetic trait. Turns out it\'s not. Identical twins sometimes differ. Science textbooks lied to you.',
    icon: '👅',
  },
  {
    id: 'languages',
    question: 'How many languages can you hold a conversation in?',
    options: [
      { label: '1', percentage: 57 },
      { label: '2', percentage: 28 },
      { label: '3', percentage: 10 },
      { label: '4 or more', percentage: 5 },
    ],
    funFact: 'About 43% of the world is bilingual or better. Monolingualism is mostly an Anglophone phenomenon. The rest of the world just... learned more.',
    icon: '🗣️',
  },
  {
    id: 'birth-order',
    question: 'What\'s your birth order?',
    options: [
      { label: 'Firstborn', percentage: 38 },
      { label: 'Middle child', percentage: 18 },
      { label: 'Youngest', percentage: 32 },
      { label: 'Only child', percentage: 12 },
    ],
    funFact: '21 of the first 23 NASA astronauts were firstborns. Middle children are statistically the best negotiators. Only children become presidents at twice the expected rate.',
    icon: '👶',
  },
  {
    id: 'hair-color',
    question: 'What\'s your natural hair color?',
    options: [
      { label: 'Black', percentage: 70 },
      { label: 'Brown', percentage: 14 },
      { label: 'Blonde', percentage: 3 },
      { label: 'Red', percentage: 1 },
      { label: 'Gray / White', percentage: 12 },
    ],
    funFact: 'Natural red hair occurs in only 1-2% of humans. Scotland has the highest concentration at 13%. Redheads need 20% more anesthesia. Nobody knows why.',
    icon: '💇',
  },
  {
    id: 'pet',
    question: 'Do you have a pet?',
    options: [
      { label: 'Dog', percentage: 33 },
      { label: 'Cat', percentage: 23 },
      { label: 'Other animal', percentage: 7 },
      { label: 'No pet', percentage: 37 },
    ],
    funFact: 'There are roughly 500 million pet dogs on Earth. But there are also 480 million stray dogs. For every dog sleeping on a couch, there\'s one sleeping on concrete.',
    icon: '🐾',
  },
  {
    id: 'sleep',
    question: 'What time do you usually fall asleep?',
    options: [
      { label: 'Before 10pm', percentage: 22 },
      { label: '10pm - Midnight', percentage: 44 },
      { label: 'Midnight - 2am', percentage: 24 },
      { label: 'After 2am', percentage: 10 },
    ],
    funFact: 'Your natural chronotype is mostly genetic. Forcing night owls to wake at 6am doesn\'t make them productive. It makes them miserable with higher cortisol.',
    icon: '🌙',
  },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

function formatExact(n: number): string {
  return Math.round(n).toLocaleString();
}

function getComparison(n: number): string {
  if (n >= 2_000_000_000) return `More than the population of China and India combined`;
  if (n >= 1_000_000_000) return `About the population of India`;
  if (n >= 500_000_000) return `About the population of North America`;
  if (n >= 300_000_000) return `About the population of the United States`;
  if (n >= 100_000_000) return `About the population of Egypt`;
  if (n >= 60_000_000) return `About the population of Italy`;
  if (n >= 30_000_000) return `About the population of Peru`;
  if (n >= 10_000_000) return `About the population of Portugal`;
  if (n >= 5_000_000) return `About the population of Norway`;
  if (n >= 3_000_000) return `About the population of Jamaica`;
  if (n >= 1_000_000) return `About the population of Cyprus`;
  if (n >= 500_000) return `About the population of Luxembourg`;
  if (n >= 100_000) return `Could fill a large football stadium`;
  if (n >= 50_000) return `About the capacity of Yankee Stadium`;
  if (n >= 10_000) return `A small town`;
  if (n >= 1_000) return `A village`;
  if (n >= 100) return `A school classroom... or two`;
  if (n >= 10) return `You could fit them in one elevator`;
  if (n >= 2) return `You could count them on your fingers`;
  return `Literally just you`;
}

function getProfile(twinCount: number): { title: string; subtitle: string; description: string } {
  const ratio = twinCount / WORLD_POPULATION;
  if (ratio > 0.01) return {
    title: 'Common Thread',
    subtitle: 'Your combination is shared by millions',
    description: 'You blend into the largest crowd on the planet. Statistically, you are profoundly normal. There is a strange comfort in that.',
  };
  if (ratio > 0.001) return {
    title: 'Familiar Face',
    subtitle: 'You share your traits with a mid-sized country',
    description: 'Common enough to never feel alone. Rare enough to be slightly interesting at parties. The sweet spot of human variation.',
  };
  if (ratio > 0.0001) return {
    title: 'Distinct Pattern',
    subtitle: 'Your combination narrows to a city\'s worth of people',
    description: 'You are one shade of a very specific color. If all your statistical twins gathered in one place, they\'d fill a city. But they\'d never all be in one place.',
  };
  if (ratio > 0.00001) return {
    title: 'Rare Configuration',
    subtitle: 'Your exact combination is genuinely uncommon',
    description: 'Walk through a crowd of 10,000 people and statistically none of them share your exact combination. You\'re a needle in a very large haystack.',
  };
  if (ratio > 0.000001) return {
    title: 'One in a Million',
    subtitle: 'Literally',
    description: 'Your combination of traits is so specific that finding a statistical twin requires searching through millions. You\'re not unique. But you\'re close.',
  };
  if (twinCount >= 100) return {
    title: 'Unicorn Adjacent',
    subtitle: 'Fewer twins than seats in a theater',
    description: 'Your statistical twins could all fit in one room. If you met one, you\'d probably feel an uncanny kinship. But you almost certainly never will.',
  };
  if (twinCount >= 10) return {
    title: 'Statistical Unicorn',
    subtitle: 'Fewer than a dozen people share your exact combination',
    description: 'You are, statistically speaking, almost impossible. Your exact combination of traits exists in fewer humans than you have fingers. You are a rounding error in the census of humanity.',
  };
  return {
    title: 'Singular',
    subtitle: 'Statistically, you shouldn\'t exist',
    description: 'Your combination is so rare that the math says fewer than 10 people on Earth share it. You\'re not one in a million. You\'re one in a billion. The universe made exactly this version of you and then broke the mold.',
  };
}

interface Answer {
  traitId: string;
  optionLabel: string;
  percentage: number;
  poolAfter: number;
}

export default function StatisticalTwin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [animatingPool, setAnimatingPool] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentPool = answers.length > 0 ? answers[answers.length - 1].poolAfter : WORLD_POPULATION;

  const handleAnswer = useCallback((optionLabel: string, percentage: number) => {
    // Skip "No idea" — don't narrow the pool
    const isSkip = optionLabel === 'No idea';
    const multiplier = isSkip ? 1 : percentage / 100;
    const newPool = Math.max(1, Math.round(currentPool * multiplier));

    setSelectedOption(optionLabel);

    // Animate the counter
    setAnimatingPool(currentPool);
    const steps = 20;
    const duration = 800;
    const stepTime = duration / steps;
    const diff = currentPool - newPool;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatingPool(Math.round(currentPool - diff * eased));

      if (step >= steps) {
        clearInterval(interval);
        setAnimatingPool(null);
        setSelectedOption(null);

        const newAnswer: Answer = {
          traitId: TRAITS[currentStep].id,
          optionLabel,
          percentage,
          poolAfter: newPool,
        };

        setAnswers(prev => [...prev, newAnswer]);

        if (currentStep + 1 >= TRAITS.length) {
          setTimeout(() => setShowResults(true), 300);
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }
    }, stepTime);
  }, [currentPool, currentStep]);

  const reset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
    setAnimatingPool(null);
    setSelectedOption(null);
  };

  // Results screen
  if (showResults) {
    const finalPool = answers[answers.length - 1].poolAfter;
    const profile = getProfile(finalPool);
    const biggestDrop = answers.reduce((best, a, i) => {
      const poolBefore = i === 0 ? WORLD_POPULATION : answers[i - 1].poolAfter;
      const dropPct = ((poolBefore - a.poolAfter) / poolBefore) * 100;
      if (dropPct > best.dropPct) return { answer: a, dropPct, index: i };
      return best;
    }, { answer: answers[0], dropPct: 0, index: 0 });

    const rarestTrait = answers.reduce((best, a) =>
      a.percentage < best.percentage && a.optionLabel !== 'No idea' ? a : best
    , answers[0]);

    const oneInX = Math.round(WORLD_POPULATION / finalPool);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fadeIn">
            <div className="text-6xl mb-4">🧬</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{profile.title}</h1>
            <p className="text-indigo-300 text-lg">{profile.subtitle}</p>
          </div>

          {/* Main Result */}
          <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 rounded-lg p-8 text-center mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-1">Your Statistical Twins</div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
              {formatExact(finalPool)}
            </div>
            <div className="text-sm text-gray-400 mb-3">out of {(WORLD_POPULATION / 1_000_000_000).toFixed(1)} billion humans</div>
            <div className="text-indigo-200 text-sm">{getComparison(finalPool)}</div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeIn">
            <div className="bg-slate-900/50 border border-indigo-500/20 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400">You Are</div>
              <div className="text-2xl font-bold text-indigo-300">1 in {formatNumber(oneInX)}</div>
            </div>
            <div className="bg-slate-900/50 border border-indigo-500/20 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400">Rarest Trait</div>
              <div className="text-lg font-bold text-indigo-300">{rarestTrait.optionLabel}</div>
              <div className="text-xs text-gray-500">{rarestTrait.percentage}% of humans</div>
            </div>
          </div>

          {/* Narrowing Journey */}
          <div className="bg-slate-900/50 border border-indigo-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">How Your Pool Narrowed</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Start</span>
                <span className="text-indigo-300 font-mono">{formatNumber(WORLD_POPULATION)}</span>
              </div>
              {answers.map((a, i) => {
                const trait = TRAITS.find(t => t.id === a.traitId);
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span>{trait?.icon}</span>
                      <span className="text-gray-400 truncate">{a.optionLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-gray-600 text-xs">{a.percentage}%</span>
                      <span className="text-indigo-300 font-mono">{formatNumber(a.poolAfter)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Biggest Drop */}
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="text-sm text-indigo-400 mb-2">Biggest Narrowing</div>
            <div className="text-sm text-gray-300">
              Your <span className="text-white font-medium">{biggestDrop.answer.optionLabel}</span> answer
              {' '}eliminated <span className="text-indigo-300 font-medium">{biggestDrop.dropPct.toFixed(0)}%</span> of your remaining pool.
              {biggestDrop.dropPct > 80 && ' That single trait made you radically more rare.'}
              {biggestDrop.dropPct > 50 && biggestDrop.dropPct <= 80 && ' More than half your potential twins, gone in one click.'}
            </div>
          </div>

          {/* WIZ Insight */}
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">WIZ&apos;s Observation</div>
            <div className="text-purple-200 leading-relaxed">
              {profile.description}
            </div>
            <div className="text-purple-300/70 text-sm mt-4 leading-relaxed">
              And these are just 10 traits. Add your exact height, shoe size, number of siblings, favorite color, and the song stuck in your head right now, and the pool drops to exactly one. You. Every human who has ever lived was, in the full resolution of their details, completely singular. Statistics just hadn&apos;t zoomed in far enough.
            </div>
          </div>

          {/* The Math */}
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="text-sm text-indigo-400 mb-2">The Math of You</div>
            <div className="text-sm text-gray-300 space-y-2">
              <p>We multiplied 10 independent trait probabilities:</p>
              <div className="bg-slate-800/50 rounded p-3 font-mono text-xs text-indigo-300 overflow-x-auto">
                {answers.filter(a => a.optionLabel !== 'No idea').map(a => `${a.percentage}%`).join(' × ')} = ~1 in {formatNumber(oneInX)}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Real-world traits aren&apos;t perfectly independent (eye color correlates with hair color, for example), so your true twin count is a rough estimate. But the direction is right: you are far more specific than you feel.
              </p>
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              const text = `I found my Statistical Twin count: ${formatExact(finalPool)} people on Earth share my exact combination of 10 traits.\n\nProfile: "${profile.title}" — 1 in ${formatNumber(oneInX)}\nRarest trait: ${rarestTrait.optionLabel} (${rarestTrait.percentage}%)\n\nFind yours → https://wiz.jock.pl/experiments/statistical-twin`;
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
          >
            Share Results
          </button>

          <button
            onClick={reset}
            className="w-full text-indigo-300 hover:text-indigo-200 font-semibold py-3 transition-colors"
          >
            Try Again
          </button>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>All calculations happen in your browser. Nothing is stored or sent anywhere.</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        `}</style>
      </div>
    );
  }

  // Question screen
  const trait = TRAITS[currentStep];
  const displayPool = animatingPool !== null ? animatingPool : currentPool;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Statistical Twin</h1>
          <p className="text-indigo-300 text-sm">
            8.1 billion people on Earth. How many share your exact combination?
          </p>
        </div>

        {/* Pool Counter */}
        <div className="bg-slate-900/60 border border-indigo-500/30 rounded-lg p-6 text-center mb-6">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Remaining pool</div>
          <div className={`text-4xl md:text-5xl font-bold font-mono transition-all ${animatingPool !== null ? 'text-red-400' : 'text-indigo-300'}`}>
            {formatExact(displayPool)}
          </div>
          <div className="text-sm text-gray-500 mt-1">{getComparison(displayPool)}</div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-6">
          {TRAITS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < currentStep ? 'bg-indigo-500' :
                i === currentStep ? 'bg-indigo-400 animate-pulse' :
                'bg-slate-700'
              }`}
            />
          ))}
          <span className="text-sm text-gray-400 ml-2">{currentStep + 1}/{TRAITS.length}</span>
        </div>

        {/* Question */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{trait.icon}</span>
            <h2 className="text-xl font-semibold text-white">{trait.question}</h2>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {trait.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.label, option.percentage)}
                disabled={selectedOption !== null}
                className={`text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedOption === option.label
                    ? 'bg-indigo-600/40 border-indigo-500 text-white'
                    : selectedOption !== null
                    ? 'bg-slate-900/30 border-slate-700/30 text-gray-600 cursor-not-allowed'
                    : 'bg-slate-900/50 border-slate-700/50 text-gray-200 hover:border-indigo-500/50 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {selectedOption === option.label && option.label !== 'No idea' && (
                    <span className="text-indigo-400 text-sm font-mono animate-fadeIn">{option.percentage}% of humans</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Previous answer fun fact */}
        {currentStep > 0 && !selectedOption && (
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4 mt-6 animate-fadeIn">
            <div className="text-sm text-indigo-300 leading-relaxed">
              {TRAITS[currentStep - 1].funFact}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Everything stays in your browser. No data is collected.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
