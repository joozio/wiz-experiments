'use client';

import { useState, useEffect } from 'react';

// --- Types ---
interface BiasOption {
  label: string;
  value: string;
  isBiased: boolean;
}

interface Scenario {
  id: string;
  biasName: string;
  emoji: string;
  question: string;
  context?: string;
  options: BiasOption[];
  reveal: string;
  scienceNote: string;
}

// --- Scenarios ---
const scenarios: Scenario[] = [
  {
    id: 'sunk-cost',
    biasName: 'Sunk Cost Fallacy',
    emoji: '\uD83C\uDFBF',
    context: 'You planned two weekend getaways:',
    question: 'You paid $120 for a ski trip and $50 for a cozy lakeside cabin. You realize both are on the same weekend. You think you\'d enjoy the cabin more. Which do you attend?',
    options: [
      { label: 'Ski trip \u2014 I paid $120 for it', value: 'ski', isBiased: true },
      { label: 'Lakeside cabin \u2014 I\'d enjoy it more', value: 'cabin', isBiased: false },
    ],
    reveal: 'The $120 is gone either way. Choosing the trip you\'d enjoy LESS just because it cost more means past spending is controlling your future happiness. The rational move: go where the joy is. The money is already spent.',
    scienceNote: 'Kahneman & Tversky (1979). Humans irrationally factor past costs into future decisions.',
  },
  {
    id: 'decoy',
    biasName: 'The Decoy Effect',
    emoji: '\uD83C\uDF7F',
    question: 'You\'re at the movies. Which popcorn do you buy?',
    options: [
      { label: 'Small \u2014 $3.50', value: 'small', isBiased: false },
      { label: 'Medium \u2014 $6.50', value: 'medium', isBiased: true },
      { label: 'Large \u2014 $7.00', value: 'large', isBiased: true },
    ],
    reveal: 'The medium ($6.50) is the decoy. It exists only to make the large ($7.00) look like a steal. Without the medium, most people choose small. With it, most jump to large. You were nudged by a deliberately bad option that was never meant to be chosen.',
    scienceNote: 'Huber, Payne & Puto (1982). Adding a dominated option shifts preference between the other two.',
  },
  {
    id: 'availability',
    biasName: 'Availability Heuristic',
    emoji: '\uD83E\uDD88',
    question: 'What kills more Americans per year?',
    options: [
      { label: 'Shark attacks', value: 'sharks', isBiased: true },
      { label: 'Falling out of bed', value: 'bed', isBiased: false },
    ],
    reveal: 'Falling out of bed kills roughly 450 Americans per year. Shark attacks kill about 1. But sharks get movies, news coverage, and an entire Discovery Channel week. Your brain estimates probability based on how easily examples come to mind, not actual statistics.',
    scienceNote: 'Tversky & Kahneman (1973). Frequency estimates are biased by ease of mental retrieval.',
  },
  {
    id: 'bandwagon',
    biasName: 'Bandwagon Effect',
    emoji: '\uD83E\uDEE3',
    question: 'Two hiking trails lead to the same viewpoint. Same distance, difficulty, and scenery. A sign reads: "Trail A: chosen by 89% of hikers today." Which trail do you take?',
    options: [
      { label: 'Trail A \u2014 the popular one', value: 'a', isBiased: true },
      { label: 'Trail B \u2014 the quiet one', value: 'b', isBiased: false },
    ],
    reveal: 'Both trails are identical. The only difference is a number on a sign. If you chose Trail A, you let other people\'s choices substitute for your own thinking, even when their choice gives you zero useful information. This is the bandwagon effect: doing something primarily because others are doing it.',
    scienceNote: 'Leibenstein (1950). Demand for a good increases because others are consuming it.',
  },
  {
    id: 'gamblers',
    biasName: 'Gambler\'s Fallacy',
    emoji: '\uD83E\uDE99',
    question: 'A fair coin has landed HEADS seven times in a row. What\'s more likely on the next flip?',
    options: [
      { label: 'Heads \u2014 it\'s on a streak', value: 'heads', isBiased: true },
      { label: 'Tails \u2014 it\'s "due"', value: 'tails', isBiased: true },
      { label: 'Equal chance \u2014 still 50/50', value: 'equal', isBiased: false },
    ],
    reveal: 'The coin has no memory. Each flip is completely independent. Seven heads doesn\'t make tails "due," and it doesn\'t mean the coin is "hot." The probability is exactly 50/50, same as the very first flip. Your pattern-seeking brain insists there\'s a trend. There isn\'t.',
    scienceNote: 'Tversky & Kahneman (1971). Humans expect small samples to mirror population statistics.',
  },
  {
    id: 'loss-aversion',
    biasName: 'Loss Aversion',
    emoji: '\uD83D\uDCB8',
    question: 'Someone offers you a bet: flip a fair coin. Heads, you WIN $150. Tails, you LOSE $100. Do you take it?',
    options: [
      { label: 'Yes \u2014 good expected value', value: 'yes', isBiased: false },
      { label: 'No \u2014 not worth the risk', value: 'no', isBiased: true },
    ],
    reveal: 'The expected value is +$25 per flip. Over time, you\'d reliably profit. But your brain weights the pain of losing $100 roughly 2-2.5x stronger than the pleasure of gaining $150. Losses literally hurt more than equivalent gains feel good. That\'s why most people reject bets they should mathematically accept.',
    scienceNote: 'Kahneman & Tversky (1979). Losses are weighted ~2-2.5x more than equivalent gains.',
  },
  {
    id: 'status-quo',
    biasName: 'Status Quo Bias',
    emoji: '\uD83D\uDCF1',
    question: 'You\'ve used the same phone plan for 3 years. A new plan offers identical coverage, more data, and costs $10/month less. Switching takes one 15-minute phone call. Do you switch?',
    options: [
      { label: 'Yes \u2014 obviously a better deal', value: 'yes', isBiased: false },
      { label: 'Nah \u2014 current plan works fine', value: 'no', isBiased: true },
    ],
    reveal: 'That\'s $120/year you\'re leaving on the table to avoid a 15-minute call. That\'s an effective rate of $480/hour for your time. Status quo bias makes "doing nothing" feel safe and "changing" feel risky, even when the alternative is objectively, measurably better.',
    scienceNote: 'Samuelson & Zeckhauser (1988). People disproportionately prefer the current state of affairs.',
  },
  {
    id: 'dunning-kruger',
    biasName: 'The Dunning-Kruger Effect',
    emoji: '\uD83E\uDD14',
    question: 'After this test: how would you rate YOUR ability to detect cognitive biases, compared to the average person?',
    options: [
      { label: 'Below average', value: 'below', isBiased: false },
      { label: 'About average', value: 'average', isBiased: false },
      { label: 'Above average', value: 'above', isBiased: true },
      { label: 'Well above average', value: 'well-above', isBiased: true },
    ],
    reveal: 'About 93% of people rate themselves "above average" at things like this. Mathematically, 93% cannot all be above average. The very act of thinking "I\'m better at spotting biases than most people" is itself a bias. It\'s biases all the way down.',
    scienceNote: 'Kruger & Dunning (1999). Those with less competence tend to overestimate their ability the most.',
  },
];

// --- Score commentary ---
function getScoreComment(caught: number, total: number): string {
  const ratio = caught / total;
  if (ratio === 0)
    return 'Zero biases caught you. Either you\'re a statistical anomaly, you\'ve studied this exact list before, or you\'re lying to a website. I respect all three options.';
  if (ratio <= 0.25)
    return 'Remarkably rational. You dodged most of the traps your own brain set for you. Don\'t let it go to your head, though. That would be a bias.';
  if (ratio <= 0.5)
    return 'Respectably human. You caught some traps but fell into others. This is actually the healthiest result. It means you\'re aware enough to dodge some, honest enough to fall for the rest.';
  if (ratio <= 0.75)
    return 'Predictably irrational. Your brain\'s autopilot took the wheel more often than you\'d like. The uncomfortable truth: knowing about biases barely helps you avoid them. Awareness is not immunity.';
  return 'Your brain ran on full autopilot. Don\'t feel bad. This is the human default. Millions of years of evolution optimized your brain for quick-and-dirty shortcuts, not careful reasoning. You\'re exactly as irrational as nature designed.';
}

function getScoreLabel(caught: number, total: number): string {
  const ratio = caught / total;
  if (ratio === 0) return 'Suspiciously Rational';
  if (ratio <= 0.25) return 'Impressively Aware';
  if (ratio <= 0.5) return 'Respectably Human';
  if (ratio <= 0.75) return 'Predictably Irrational';
  return 'Beautifully Biased';
}

function getShareText(caught: number, total: number): string {
  return `${caught} out of ${total} cognitive biases caught me in The Bias Blindspot experiment. Your brain is lying to you too.\n\nhttps://wiz.jock.pl/experiments/bias-blindspot`;
}

// --- Component ---
export default function BiasBlindspotPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showReveal, setShowReveal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [revealAnim, setRevealAnim] = useState(false);
  const [resultAnim, setResultAnim] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const total = scenarios.length;
  const caughtCount = Object.entries(answers).filter(([id, value]) => {
    const scenario = scenarios.find((s) => s.id === id);
    if (!scenario) return false;
    const chosen = scenario.options.find((o) => o.value === value);
    return chosen?.isBiased;
  }).length;

  const handleAnswer = (value: string) => {
    if (showReveal) return;
    const scenario = scenarios[currentIndex];
    setAnswers((prev) => ({ ...prev, [scenario.id]: value }));
    setSelectedValue(value);
    setShowReveal(true);
    setTimeout(() => setRevealAnim(true), 50);
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowReveal(false);
      setRevealAnim(false);
      setSelectedValue(null);
    } else {
      setShowResults(true);
      setTimeout(() => setResultAnim(true), 100);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setShowReveal(false);
    setShowResults(false);
    setRevealAnim(false);
    setResultAnim(false);
    setSelectedValue(null);
  };

  const handleShare = () => {
    const text = getShareText(caughtCount, total);
    if (navigator.share) {
      navigator.share({ text, url: 'https://wiz.jock.pl/experiments/bias-blindspot' });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const wasCaught = (() => {
    if (!selectedValue) return false;
    const scenario = scenarios[currentIndex];
    const chosen = scenario.options.find((o) => o.value === selectedValue);
    return chosen?.isBiased ?? false;
  })();

  // --- Landing ---
  if (!started) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
            &larr; back to experiments
          </a>

          <div className="text-center mb-10">
            <div className="text-5xl mb-4">\uD83E\uDDE0</div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
              The Bias Blindspot
            </h1>
            <p className="text-gray-400 max-w-md mx-auto mb-2">
              You think you&apos;re rational. Let&apos;s test that.
            </p>
            <p className="text-gray-600 text-xs font-mono">
              // 8 scenarios. Each is a trap.
            </p>
          </div>

          <div className="border border-amber-400/20 bg-amber-400/5 p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-amber-400 font-mono text-sm flex-shrink-0">WIZ://</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every question ahead is designed to exploit a specific cognitive bias.
                You&apos;ll feel confident in your answers. That&apos;s the point.
                The biases that catch you are the ones you don&apos;t see coming.
                Most people fall for at least 5 out of 8.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="border border-gray-800 p-4 text-center">
              <div className="text-amber-400 font-mono text-2xl font-bold">8</div>
              <div className="text-gray-500 text-xs mt-1">Scenarios</div>
            </div>
            <div className="border border-gray-800 p-4 text-center">
              <div className="text-amber-400 font-mono text-2xl font-bold">8</div>
              <div className="text-gray-500 text-xs mt-1">Different Biases</div>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-colors font-mono text-sm"
          >
            I&apos;m rational. Prove me wrong.
          </button>

          <div className="mt-6 text-center text-gray-600 text-xs">
            Takes about 3 minutes. No data stored.
          </div>
        </div>
      </div>
    );
  }

  // --- Results ---
  if (showResults) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
            &larr; back to experiments
          </a>

          {/* Score */}
          <div className={`text-center mb-8 transition-all duration-1000 ${resultAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
              Your Rationality Score
            </div>
            <div className="text-7xl md:text-8xl font-mono font-bold mb-2">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                caughtCount <= 2 ? 'from-green-400 to-cyan-400' :
                caughtCount <= 4 ? 'from-yellow-400 to-amber-400' :
                caughtCount <= 6 ? 'from-orange-400 to-red-400' :
                'from-red-400 to-red-600'
              }`}>
                {caughtCount}/{total}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              biases caught you
            </div>
            <div className={`mt-2 text-xs font-mono px-3 py-1 inline-block ${
              caughtCount <= 2 ? 'text-green-400 border border-green-400/30' :
              caughtCount <= 4 ? 'text-amber-400 border border-amber-400/30' :
              'text-red-400 border border-red-400/30'
            }`}>
              {getScoreLabel(caughtCount, total)}
            </div>
          </div>

          {/* WIZ Commentary */}
          <div className={`border border-amber-400/20 bg-amber-400/5 p-6 mb-8 transition-all duration-1000 delay-300 ${resultAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-start gap-3">
              <span className="text-amber-400 font-mono text-sm flex-shrink-0">WIZ://</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                {getScoreComment(caughtCount, total)}
              </p>
            </div>
          </div>

          {/* Bias Grid */}
          <div className={`mb-8 transition-all duration-1000 delay-500 ${resultAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
              Your Bias Map
            </h3>
            <div className="space-y-2">
              {scenarios.map((scenario) => {
                const answer = answers[scenario.id];
                const chosen = scenario.options.find((o) => o.value === answer);
                const caught = chosen?.isBiased ?? false;
                return (
                  <div
                    key={scenario.id}
                    className={`flex items-center gap-3 p-3 border ${
                      caught
                        ? 'border-red-400/20 bg-red-400/5'
                        : 'border-green-400/20 bg-green-400/5'
                    }`}
                  >
                    <span className="text-lg">{scenario.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{scenario.biasName}</div>
                      <div className="text-gray-500 text-xs truncate">
                        {chosen?.label}
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-1 ${
                      caught
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-green-400 bg-green-400/10'
                    }`}>
                      {caught ? 'CAUGHT' : 'DODGED'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The uncomfortable truth */}
          <div className={`border border-gray-700 p-6 mb-8 transition-all duration-1000 delay-700 ${resultAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-gray-500 text-xs font-mono mb-2 tracking-widest uppercase">
              The Uncomfortable Truth
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Cognitive biases aren&apos;t bugs. They&apos;re features. Your brain evolved
              these shortcuts because in most real-world situations, a fast approximate
              answer beats a slow perfect one. The problem is that modern life constantly
              puts you in situations your stone-age heuristics weren&apos;t built for.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Knowing about biases helps a little. But research shows that
              even people who study cognitive biases professionally still fall
              for them. <span className="text-white">Awareness is not immunity.</span> The
              best you can do is slow down on important decisions and deliberately
              check for the biases you know about.
            </p>
          </div>

          {/* Actions */}
          <div className={`flex gap-3 justify-center mb-10 transition-all duration-1000 delay-900 ${resultAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleShare}
              className="px-6 py-3 border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 transition-colors text-sm font-mono"
            >
              Share Result
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors text-sm font-mono"
            >
              Try Again
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs py-6 border-t border-gray-800">
            <p>All processing happens in your browser. No data is stored or transmitted.</p>
            <p className="mt-1">
              Built by <a href="/" className="text-gray-500 hover:text-gray-300">WIZ</a> &mdash; the automation wizard at{' '}
              <a href="https://wiz.jock.pl" className="text-gray-500 hover:text-gray-300">wiz.jock.pl</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Questions ---
  const scenario = scenarios[currentIndex];
  const progress = ((currentIndex + (showReveal ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
          &larr; back to experiments
        </a>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-mono">{currentIndex + 1} of {total}</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 h-1">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scenario */}
        <div className="mb-6">
          <div className="text-4xl mb-4 text-center">{scenario.emoji}</div>
          {scenario.context && (
            <p className="text-gray-500 text-sm mb-2 font-mono">{scenario.context}</p>
          )}
          <h2 className="text-white text-lg md:text-xl font-medium leading-relaxed mb-6">
            {scenario.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {scenario.options.map((option) => {
            const isSelected = selectedValue === option.value;
            const isRevealed = showReveal;
            let borderClass = 'border-gray-700 hover:border-gray-500';
            let textClass = 'text-white';

            if (isRevealed && isSelected) {
              if (option.isBiased) {
                borderClass = 'border-red-400/50 bg-red-400/5';
                textClass = 'text-red-400';
              } else {
                borderClass = 'border-green-400/50 bg-green-400/5';
                textClass = 'text-green-400';
              }
            } else if (isRevealed && !isSelected) {
              borderClass = 'border-gray-800 opacity-40';
            }

            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={showReveal}
                className={`w-full text-left p-4 border transition-all ${borderClass} ${
                  showReveal ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className={`text-sm font-medium ${textClass}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reveal */}
        {showReveal && (
          <div className={`transition-all duration-500 ${revealAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Caught / Dodged badge */}
            <div className={`text-center mb-4 py-3 border ${
              wasCaught
                ? 'border-red-400/30 bg-red-400/5'
                : 'border-green-400/30 bg-green-400/5'
            }`}>
              <div className={`font-mono text-lg font-bold ${
                wasCaught ? 'text-red-400' : 'text-green-400'
              }`}>
                {wasCaught ? '\u26A0 CAUGHT' : '\u2713 DODGED'}
              </div>
              <div className={`text-xs mt-1 ${
                wasCaught ? 'text-red-400/70' : 'text-green-400/70'
              }`}>
                {scenario.biasName}
              </div>
            </div>

            {/* Explanation */}
            <div className="border border-amber-400/20 bg-amber-400/5 p-5 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-mono text-sm flex-shrink-0">WIZ://</span>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {scenario.reveal}
                </p>
              </div>
            </div>

            {/* Science note */}
            <div className="text-gray-600 text-xs font-mono mb-6 px-1">
              {scenario.scienceNote}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="w-full py-3 bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-colors font-mono text-sm"
            >
              {currentIndex < scenarios.length - 1
                ? `Next Scenario (${currentIndex + 2}/${total})`
                : 'See My Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
