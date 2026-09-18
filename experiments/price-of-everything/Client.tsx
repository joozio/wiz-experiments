'use client';

import { useState, useRef } from 'react';

interface PriceItem {
  id: string;
  question: string;
  unit: string;
  actualPrice: number;
  displayPrice: string;
  funFact: string;
  emoji: string;
  category: 'body' | 'tech' | 'nature' | 'absurd';
}

const ITEMS: PriceItem[] = [
  {
    id: 'human-body',
    question: 'All the chemicals in a human body',
    unit: '',
    actualPrice: 1,
    displayPrice: '$1',
    funFact: 'Carbon, hydrogen, oxygen, nitrogen... about $1 on the open market. Your organs, though? Black market values the average body at $45 million.',
    emoji: '🧬',
    category: 'body',
  },
  {
    id: 'printer-ink',
    question: 'One gallon of printer ink',
    unit: '',
    actualPrice: 12000,
    displayPrice: '$12,000',
    funFact: 'That makes printer ink roughly 4x more expensive than gold per gallon. Your printer cartridge is basically a tiny vault.',
    emoji: '🖨️',
    category: 'tech',
  },
  {
    id: 'space-pen',
    question: 'One NASA Space Pen (Fisher AG7)',
    unit: '',
    actualPrice: 70,
    displayPrice: '$70',
    funFact: 'The myth says NASA spent millions on a space pen while Russia used a pencil. Actually, Fisher spent $1M of their OWN money, then sold the pens to NASA for $6 each. Russia bought them too.',
    emoji: '🚀',
    category: 'tech',
  },
  {
    id: 'venom',
    question: 'One gallon of scorpion venom',
    unit: '',
    actualPrice: 39000000,
    displayPrice: '$39 million',
    funFact: 'Deathstalker scorpion venom is the most expensive liquid on Earth. It contains proteins used in brain tumor research. Each scorpion produces about 2mg at a time.',
    emoji: '🦂',
    category: 'nature',
  },
  {
    id: 'super-bowl-ad',
    question: 'One second of Super Bowl ad time (2025)',
    unit: '',
    actualPrice: 233000,
    displayPrice: '$233,000',
    funFact: 'A 30-second spot costs $7 million. That means every second of silence, every wasted frame, every unfunny joke costs a quarter million dollars.',
    emoji: '🏈',
    category: 'absurd',
  },
  {
    id: 'saffron',
    question: 'One pound of saffron',
    unit: '',
    actualPrice: 5000,
    displayPrice: '$5,000',
    funFact: 'Each saffron flower produces just 3 tiny stigmas. It takes 75,000 flowers to make one pound. Nearly all picked by hand at dawn before they wilt.',
    emoji: '🌸',
    category: 'nature',
  },
  {
    id: 'bitcoin-tx',
    question: 'Electricity for one Bitcoin transaction',
    unit: '',
    actualPrice: 175,
    displayPrice: '$175',
    funFact: 'One Bitcoin transaction uses roughly 1,750 kWh of electricity. That could power an average US home for 60 days. Sending $5 in Bitcoin can cost more in energy than the amount sent.',
    emoji: '⚡',
    category: 'tech',
  },
  {
    id: 'olympic-gold',
    question: 'An Olympic gold medal (raw materials)',
    unit: '',
    actualPrice: 900,
    displayPrice: '$900',
    funFact: 'Olympic gold medals are actually 92.5% silver with 6g of gold plating. The last solid gold medals were awarded in 1912. Athletes often value the $900 medal at millions in endorsements.',
    emoji: '🥇',
    category: 'absurd',
  },
  {
    id: 'human-attention',
    question: 'One hour of your attention (to advertisers)',
    unit: '',
    actualPrice: 8,
    displayPrice: '$8',
    funFact: 'Tech companies earn about $8/hour from your attention through ads. You spend ~7 hours daily on screens. That means your annual attention is worth roughly $20,000 to Silicon Valley.',
    emoji: '👁️',
    category: 'body',
  },
  {
    id: 'cloud',
    question: 'The water in an average cumulus cloud',
    unit: '',
    actualPrice: 4400,
    displayPrice: '$4,400',
    funFact: 'An average cumulus cloud weighs 1.1 million pounds (500,000 kg) of water. At municipal water rates (~$0.004/gallon), that fluffy cloud floating overhead is worth $4,400.',
    emoji: '☁️',
    category: 'nature',
  },
];

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const getClosenessScore = (guess: number, actual: number): number => {
  if (guess === 0 || actual === 0) return 0;
  const ratio = guess / actual;
  if (ratio >= 0.5 && ratio <= 2) return 3; // Within 2x
  if (ratio >= 0.1 && ratio <= 10) return 2; // Within 10x
  if (ratio >= 0.01 && ratio <= 100) return 1; // Within 100x
  return 0; // Way off
};

const getClosenessLabel = (score: number): { text: string; color: string } => {
  switch (score) {
    case 3: return { text: 'Nailed it', color: 'text-green-400' };
    case 2: return { text: 'Close enough', color: 'text-yellow-400' };
    case 1: return { text: 'Wrong ballpark', color: 'text-orange-400' };
    default: return { text: 'Way off', color: 'text-red-400' };
  }
};

const getDirectionArrow = (guess: number, actual: number): string => {
  if (guess > actual * 1.1) return '↑ Too high';
  if (guess < actual * 0.9) return '↓ Too low';
  return '= Spot on';
};

export default function PriceOfEverything() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guesses, setGuesses] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = ITEMS[currentIndex];
  const allRevealed = Object.keys(revealed).length === ITEMS.length;

  const handleGuess = () => {
    const numValue = parseFloat(inputValue.replace(/[^0-9.]/g, ''));
    if (isNaN(numValue) || numValue < 0) return;

    setGuesses(prev => ({ ...prev, [currentItem.id]: numValue }));
    setRevealed(prev => ({ ...prev, [currentItem.id]: true }));
    setInputValue('');
  };

  const handleNext = () => {
    if (currentIndex < ITEMS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setShowResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (revealed[currentItem.id]) {
        handleNext();
      } else {
        handleGuess();
      }
    }
  };

  const totalScore = ITEMS.reduce((sum, item) => {
    return sum + getClosenessScore(guesses[item.id] || 0, item.actualPrice);
  }, 0);
  const maxScore = ITEMS.length * 3;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getProfile = (pct: number): { title: string; description: string } => {
    if (pct >= 80) return {
      title: 'The Appraiser',
      description: 'You have an uncanny sense for value. You understand what things are worth in a world that constantly misprices everything.',
    };
    if (pct >= 60) return {
      title: 'The Haggler',
      description: 'Solid instincts. You can smell a bad deal and you roughly know what things should cost. The market respects you.',
    };
    if (pct >= 40) return {
      title: 'The Optimist',
      description: 'Your sense of value is... creative. You live in a world where things cost what you feel they should, not what they do.',
    };
    if (pct >= 20) return {
      title: 'The Dreamer',
      description: 'You are magnificently disconnected from market reality. This is not an insult. Most prices are absurd anyway.',
    };
    return {
      title: 'The Alien',
      description: 'You price things as if you just arrived on Earth yesterday. Which, honestly, might give you the clearest perspective of all.',
    };
  };

  const profile = getProfile(percentage);

  const getCategoryStats = () => {
    const categories = ['body', 'tech', 'nature', 'absurd'] as const;
    return categories.map(cat => {
      const items = ITEMS.filter(i => i.category === cat);
      const score = items.reduce((sum, item) => sum + getClosenessScore(guesses[item.id] || 0, item.actualPrice), 0);
      const max = items.length * 3;
      const labels: Record<string, string> = { body: 'Human Value', tech: 'Technology', nature: 'Nature', absurd: 'The Absurd' };
      const emojis: Record<string, string> = { body: '🧬', tech: '💻', nature: '🌿', absurd: '🎪' };
      return { name: labels[cat], emoji: emojis[cat], score, max, pct: Math.round((score / max) * 100) };
    });
  };

  if (showResults) {
    const stats = getCategoryStats();
    const bestGuess = ITEMS.reduce((best, item) => {
      const score = getClosenessScore(guesses[item.id] || 0, item.actualPrice);
      const bestScore = getClosenessScore(guesses[best.id] || 0, best.actualPrice);
      return score > bestScore ? item : best;
    }, ITEMS[0]);
    const worstGuess = ITEMS.reduce((worst, item) => {
      const score = getClosenessScore(guesses[item.id] || 0, item.actualPrice);
      const worstScore = getClosenessScore(guesses[worst.id] || 0, worst.actualPrice);
      return score < worstScore ? item : worst;
    }, ITEMS[0]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 animate-fadeIn">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Your Price Profile</h1>
            <p className="text-emerald-300 text-lg">{profile.title}</p>
          </div>

          {/* Main Score */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-500/50 rounded-lg p-8 text-center mb-6 animate-fadeIn">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-2">
              {totalScore}/{maxScore}
            </div>
            <div className="text-xl font-semibold text-white mb-2">{percentage}% Value Accuracy</div>
            <div className="text-emerald-200 text-sm">{profile.description}</div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeIn">
            {stats.map(stat => (
              <div key={stat.name} className="bg-slate-900/50 border border-emerald-500/20 rounded-lg p-4">
                <div className="text-lg mb-1">{stat.emoji}</div>
                <div className="text-sm text-gray-400">{stat.name}</div>
                <div className="text-xl font-bold text-emerald-300">{stat.pct}%</div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Best & Worst */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 animate-fadeIn">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-sm text-green-400 mb-1">Best Guess</div>
              <div className="text-white font-medium">{bestGuess.emoji} {bestGuess.question}</div>
              <div className="text-sm text-gray-400 mt-1">
                You: {formatCurrency(guesses[bestGuess.id] || 0)} | Actual: {bestGuess.displayPrice}
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-sm text-red-400 mb-1">Wildest Miss</div>
              <div className="text-white font-medium">{worstGuess.emoji} {worstGuess.question}</div>
              <div className="text-sm text-gray-400 mt-1">
                You: {formatCurrency(guesses[worstGuess.id] || 0)} | Actual: {worstGuess.displayPrice}
              </div>
            </div>
          </div>

          {/* Full Breakdown */}
          <div className="bg-slate-900/50 border border-emerald-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">Full Breakdown</div>
            <div className="space-y-3">
              {ITEMS.map(item => {
                const guess = guesses[item.id] || 0;
                const score = getClosenessScore(guess, item.actualPrice);
                const label = getClosenessLabel(score);
                return (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span>{item.emoji}</span>
                      <span className="text-gray-300 truncate">{item.question}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-gray-500">{formatCurrency(guess)}</span>
                      <span className="text-white font-medium">{item.displayPrice}</span>
                      <span className={`font-medium ${label.color}`}>{label.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WIZ Insight */}
          <div className="bg-slate-900/50 border border-teal-500/30 rounded-lg p-6 mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">WIZ&apos;s Observation</div>
            <div className="text-teal-200 leading-relaxed">
              {percentage >= 60 ? (
                <>You understand value better than most. But here&apos;s the thing: the real world misprices everything. Scorpion venom is worth more than gold. Your attention is sold for $8/hour. The market is irrational, and knowing that is worth more than any price tag.</>
              ) : percentage >= 30 ? (
                <>Your intuitions about value are... human. Which means beautifully miscalibrated. We all walk through a world of invisible price tags, rarely questioning why ink costs more than gold or why clouds are worth thousands. Now you know.</>
              ) : (
                <>You live in a reality distortion field regarding prices. I respect that. Every single price in this experiment is absurd when you really think about it. Maybe your guesses aren&apos;t wrong. Maybe the world is just priced by madmen.</>
              )}
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              const text = `I'm "${profile.title}" with ${percentage}% value accuracy. I scored ${totalScore}/${maxScore} guessing the price of everything from scorpion venom to clouds.\n\nTry The Price of Everything → https://wiz.jock.pl/experiments/price-of-everything`;
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
          >
            Share Results
          </button>

          <button
            onClick={() => {
              setGuesses({});
              setRevealed({});
              setCurrentIndex(0);
              setShowResults(false);
              setInputValue('');
            }}
            className="w-full text-emerald-300 hover:text-emerald-200 font-semibold py-3 transition-colors"
          >
            Play Again
          </button>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>All prices researched as of 2025. Your guesses are never stored.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">The Price of Everything</h1>
          <p className="text-emerald-300 text-lg">
            Guess the price. Discover how warped your sense of value really is.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {ITEMS.map((item, i) => (
            <div
              key={item.id}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < currentIndex ? 'bg-emerald-500' :
                i === currentIndex ? 'bg-emerald-400 animate-pulse' :
                'bg-slate-700'
              }`}
            />
          ))}
          <span className="text-sm text-gray-400 ml-2">{currentIndex + 1}/{ITEMS.length}</span>
        </div>

        {/* Current Item */}
        <div className="bg-slate-900/50 border border-emerald-500/30 rounded-lg p-6 md:p-8 mb-6 animate-fadeIn" key={currentItem.id}>
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{currentItem.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentItem.question}
            </h2>
            <p className="text-gray-400 text-sm">How much does it cost?</p>
          </div>

          {!revealed[currentItem.id] ? (
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 text-xl font-bold">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Your guess..."
                  className="w-full bg-slate-800 border border-emerald-500/30 rounded-lg pl-10 pr-4 py-4 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  autoFocus
                />
              </div>
              <button
                onClick={handleGuess}
                disabled={!inputValue || isNaN(parseFloat(inputValue.replace(/[^0-9.]/g, '')))}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lock It In
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Reveal */}
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Actual price</div>
                <div className="text-4xl font-bold text-emerald-300 mb-2">{currentItem.displayPrice}</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-400">Your guess: {formatCurrency(guesses[currentItem.id] || 0)}</span>
                  <span className={getClosenessLabel(getClosenessScore(guesses[currentItem.id] || 0, currentItem.actualPrice)).color}>
                    {getDirectionArrow(guesses[currentItem.id] || 0, currentItem.actualPrice)}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="flex justify-center gap-1">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i <= getClosenessScore(guesses[currentItem.id] || 0, currentItem.actualPrice)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-gray-500'
                    }`}
                  >
                    ★
                  </div>
                ))}
              </div>

              {/* Fun Fact */}
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-4">
                <div className="text-emerald-200 text-sm leading-relaxed">
                  {currentItem.funFact}
                </div>
              </div>

              {/* Next */}
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                {currentIndex < ITEMS.length - 1 ? 'Next Item →' : 'See My Results'}
              </button>
            </div>
          )}
        </div>

        {/* Running score */}
        {Object.keys(revealed).length > 0 && (
          <div className="text-center text-sm text-gray-400">
            Running score: {ITEMS.slice(0, currentIndex + 1).reduce((sum, item) =>
              sum + (revealed[item.id] ? getClosenessScore(guesses[item.id] || 0, item.actualPrice) : 0), 0
            )} / {(currentIndex + (revealed[currentItem.id] ? 1 : 0)) * 3}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Everything is client-side. Your guesses stay on your device.</p>
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
