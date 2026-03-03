'use client';

import { useState, useRef, useEffect } from 'react';

// --- Birth circumstance questions ---

interface Question {
  id: string;
  question: string;
  options: { label: string; value: number; detail?: string }[];
}

const questions: Question[] = [
  {
    id: 'era',
    question: 'When were you born?',
    options: [
      { label: 'After 2000', value: 95, detail: 'Top 5% of human history for survival odds' },
      { label: '1980-1999', value: 92, detail: 'You caught the internet revolution' },
      { label: '1960-1979', value: 85, detail: 'Cold War, but antibiotics existed' },
      { label: '1940-1959', value: 70, detail: 'Post-war rebuild generation' },
      { label: 'Before 1940', value: 50, detail: 'You survived the hardest century' },
    ],
  },
  {
    id: 'country',
    question: 'What type of country were you born in?',
    options: [
      { label: 'High-income (US, EU, Japan, Australia...)', value: 95, detail: 'Top 16% of world population' },
      { label: 'Upper-middle (China, Brazil, Turkey...)', value: 70, detail: 'Rising, but still unequal' },
      { label: 'Lower-middle (India, Nigeria, Philippines...)', value: 40, detail: 'Most humans live here' },
      { label: 'Low-income (many parts of Africa, Haiti...)', value: 15, detail: 'The hardest starting position' },
    ],
  },
  {
    id: 'health',
    question: 'Were you born with good health?',
    options: [
      { label: 'Yes, no major issues', value: 90, detail: 'Not everyone gets this' },
      { label: 'Minor issues (allergies, mild conditions)', value: 75, detail: 'Manageable, but still a factor' },
      { label: 'Significant chronic condition', value: 45, detail: 'A daily battle many don\'t see' },
      { label: 'Severe disability or illness from birth', value: 20, detail: 'The hardest hand to be dealt' },
    ],
  },
  {
    id: 'family-income',
    question: 'Your family\'s economic situation growing up?',
    options: [
      { label: 'Comfortable (never worried about basics)', value: 92, detail: 'Top ~20% globally' },
      { label: 'Middle class (stable but careful)', value: 70, detail: 'The narrow middle' },
      { label: 'Working class (paycheck to paycheck)', value: 40, detail: 'Where most of the world lives' },
      { label: 'Poverty (food/housing insecurity)', value: 12, detail: '~10% of world lives in extreme poverty' },
    ],
  },
  {
    id: 'education',
    question: 'Access to education?',
    options: [
      { label: 'University degree (or access to one)', value: 93, detail: 'Only 7% of humans ever have this' },
      { label: 'Completed high school', value: 70, detail: 'More than 40% of adults globally lack this' },
      { label: 'Some primary school', value: 35, detail: 'The reality for hundreds of millions' },
      { label: 'Little or no formal education', value: 10, detail: '773 million adults can\'t read' },
    ],
  },
  {
    id: 'peace',
    question: 'Did you grow up in a peaceful environment?',
    options: [
      { label: 'Yes, stable country, safe neighborhood', value: 90, detail: 'A luxury across most of history' },
      { label: 'Mostly stable, some political tension', value: 65, detail: 'Uncertainty in the background' },
      { label: 'Significant unrest or instability', value: 30, detail: 'Your childhood had a soundtrack of fear' },
      { label: 'War zone or active conflict', value: 8, detail: '1 in 6 children live in conflict zones today' },
    ],
  },
  {
    id: 'clean-water',
    question: 'Access to clean water and sanitation?',
    options: [
      { label: 'Always (tap water, indoor plumbing)', value: 92, detail: '2 billion people still lack safe water' },
      { label: 'Usually (occasional issues)', value: 65, detail: 'Better than most of history' },
      { label: 'Limited (had to fetch or boil water)', value: 30, detail: 'Hours of daily labor for billions' },
      { label: 'Scarce (unsafe water was normal)', value: 8, detail: 'This killed more humans than all wars combined' },
    ],
  },
  {
    id: 'freedom',
    question: 'Personal freedom and rights?',
    options: [
      { label: 'Full (democracy, free speech, legal protections)', value: 90, detail: 'Only ~45% of humans live in democracies' },
      { label: 'Partial (some restrictions, mostly free)', value: 60, detail: 'Freedom with asterisks' },
      { label: 'Limited (authoritarian control, censorship)', value: 25, detail: 'Billions live under this today' },
      { label: 'Severely restricted (oppression, persecution)', value: 5, detail: 'The cruelest lottery result' },
    ],
  },
];

// --- Historical context data ---

interface HistoricalEra {
  period: string;
  population: string;
  lifeExpectancy: number;
  childMortality: string;
  literacy: string;
}

const historicalEras: HistoricalEra[] = [
  { period: '10,000 BC', population: '~5 million', lifeExpectancy: 25, childMortality: '50%', literacy: '0%' },
  { period: '1 AD', population: '~300 million', lifeExpectancy: 28, childMortality: '45%', literacy: '<5%' },
  { period: '1800', population: '~1 billion', lifeExpectancy: 32, childMortality: '40%', literacy: '~12%' },
  { period: '1900', population: '~1.6 billion', lifeExpectancy: 35, childMortality: '35%', literacy: '~21%' },
  { period: '1950', population: '~2.5 billion', lifeExpectancy: 47, childMortality: '20%', literacy: '~36%' },
  { period: '2000', population: '~6.1 billion', lifeExpectancy: 67, childMortality: '7.6%', literacy: '~82%' },
  { period: '2025', population: '~8.2 billion', lifeExpectancy: 73, childMortality: '3.7%', literacy: '~87%' },
];

// --- WIZ commentary ---

function getWizComment(percentile: number): string {
  if (percentile >= 95) return "You won a lottery you never entered. Most humans who ever lived would weep at your starting conditions. The cosmic dice were absurdly kind to you.";
  if (percentile >= 85) return "Born into the top tier of the human experience. Your 'normal' is a miracle by historical standards. Billions lived entire lives without a fraction of what you were handed at birth.";
  if (percentile >= 70) return "Better than most who ever drew breath on this planet. Not the top — but the fact that you're reading this on a screen puts you ahead of 95% of all humans who ever existed.";
  if (percentile >= 50) return "Middle of the road for today's world. But remember — today's 'average' would be royalty for 99% of human history. You have antibiotics, the internet, and indoor plumbing.";
  if (percentile >= 30) return "You started with less than most people reading this. Every step forward was harder than it needed to be. That context matters more than any percentile.";
  return "The universe dealt you one of the hardest hands possible. If you're reading this, you've already defied extraordinary odds. That's not motivational fluff — it's math.";
}

function getCosmicFact(percentile: number): string {
  const facts = [
    `If the entire history of homo sapiens (300,000 years) were compressed into a single day, reliable food supply only appeared in the last 40 seconds.`,
    `Of the ~117 billion humans who have ever lived, only about 8 billion are alive now. You're one of the 7% who gets to exist right now — at peak technology, medicine, and knowledge.`,
    `A medieval king had worse dental care, less variety in food, and shorter life expectancy than a minimum-wage worker in a high-income country today.`,
    `The chance of being born as YOU — this exact person, in this exact time, in this exact place — is roughly 1 in 400 trillion. That's before accounting for the cosmic lottery of circumstances.`,
    `For 99.9% of human history, the average person never traveled more than 30km from where they were born. Never read a book. Never heard music from another continent.`,
    `Clean drinking water from a tap — something billions take for granted — would have been considered sorcery for 99% of human history.`,
  ];
  return facts[Math.floor((percentile * facts.length) / 100) % facts.length];
}

function getShareText(percentile: number): string {
  return `I just discovered I was born into the top ${100 - percentile}% of all humans who ever lived. The Luck Audit on wiz.jock.pl showed me the cosmic lottery I never knew I won.`;
}

// --- Percentile bar component ---

function PercentileBar({ value, label, delay }: { value: number; label: string; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-cyan-400 font-mono">{value}th</span>
      </div>
      <div className="w-full bg-gray-800 h-2 overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: value >= 80 ? 'linear-gradient(90deg, #22d3ee, #a78bfa)' :
                        value >= 50 ? 'linear-gradient(90deg, #22d3ee, #fbbf24)' :
                        'linear-gradient(90deg, #ef4444, #f97316)',
          }}
        />
      </div>
    </div>
  );
}

// --- Main component ---

export default function LuckAuditPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [displayedPercentile, setDisplayedPercentile] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      setTimeout(() => {
        setAnimateResult(true);
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Calculate composite percentile
  const calculatePercentile = (): number => {
    const values = Object.values(answers);
    if (values.length === 0) return 0;

    // Weighted average — some factors matter more
    const weights: Record<string, number> = {
      era: 1.5,
      country: 2.0,
      health: 1.5,
      'family-income': 1.5,
      education: 1.3,
      peace: 1.8,
      'clean-water': 1.8,
      freedom: 1.2,
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [key, val] of Object.entries(answers)) {
      const w = weights[key] || 1;
      weightedSum += val * w;
      totalWeight += w;
    }

    // Scale to percentile of all humans who ever lived
    // Modern humans with high scores are truly in the top percentiles historically
    const rawAvg = weightedSum / totalWeight;

    // Adjust: even "average" modern scores are historically exceptional
    // Because just being alive now with internet access puts you ahead of ~93% of all humans ever
    const historicalBoost = 15;
    const adjusted = Math.min(99.9, rawAvg + historicalBoost * (rawAvg / 100));

    return Math.round(adjusted * 10) / 10;
  };

  const percentile = calculatePercentile();

  // Animate counter
  useEffect(() => {
    if (!animateResult) return;
    const target = percentile;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedPercentile(Math.round(eased * target * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [animateResult, percentile]);

  const progress = (currentQuestion / questions.length) * 100;

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setAnimateResult(false);
    setDisplayedPercentile(0);
  };

  const handleShare = () => {
    const text = getShareText(percentile);
    if (navigator.share) {
      navigator.share({ text, url: 'https://wiz.jock.pl/experiments/luck-audit' });
    } else {
      navigator.clipboard.writeText(text + '\nhttps://wiz.jock.pl/experiments/luck-audit');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
          ← back to experiments
        </a>

        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🎲</div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            The Luck Audit
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            You entered a cosmic lottery the moment you were born. Let&apos;s find out what you won.
          </p>
          <p className="text-gray-600 text-xs mt-2 font-mono">
            // 8 questions. No data stored. Just perspective.
          </p>
        </div>

        {!showResult && (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-800 h-1">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current question */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-6 text-white">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                    className="w-full text-left p-4 border border-gray-700 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
                  >
                    <div className="text-white group-hover:text-cyan-400 transition-colors font-medium">
                      {option.label}
                    </div>
                    {option.detail && (
                      <div className="text-gray-500 text-sm mt-1">{option.detail}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Already answered summary */}
            {currentQuestion > 0 && (
              <div className="border-t border-gray-800 pt-4">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  className="text-gray-500 hover:text-gray-300 text-sm"
                >
                  ← Previous question
                </button>
              </div>
            )}
          </>
        )}

        {/* Results */}
        {showResult && (
          <div ref={resultRef}>
            {/* Big percentile */}
            <div className={`text-center mb-10 transition-all duration-1000 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-gray-500 text-sm font-mono mb-2 tracking-widest uppercase">
                Your Birth Lottery Percentile
              </div>
              <div className="text-7xl md:text-8xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {displayedPercentile}%
              </div>
              <div className="text-gray-400 text-sm mt-2">
                of all ~117 billion humans who ever lived
              </div>
            </div>

            {/* WIZ commentary */}
            <div className={`border border-cyan-400/20 bg-cyan-400/5 p-6 mb-8 transition-all duration-1000 delay-500 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-mono text-sm flex-shrink-0">WIZ://</span>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {getWizComment(percentile)}
                </p>
              </div>
            </div>

            {/* Individual scores */}
            <div className={`mb-8 transition-all duration-1000 delay-700 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-gray-500 text-xs font-mono mb-4 tracking-widest uppercase">
                Your Scores by Category
              </h3>
              {questions.map((q, i) => (
                answers[q.id] !== undefined && (
                  <PercentileBar
                    key={q.id}
                    label={q.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    value={answers[q.id]}
                    delay={800 + i * 150}
                  />
                )
              ))}
            </div>

            {/* Historical context */}
            <div className={`mb-8 transition-all duration-1000 delay-1000 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-gray-500 text-xs font-mono mb-4 tracking-widest uppercase">
                Historical Context
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs">
                      <th className="text-left py-2 pr-3">Period</th>
                      <th className="text-left py-2 pr-3">Population</th>
                      <th className="text-left py-2 pr-3">Life Exp.</th>
                      <th className="text-left py-2 pr-3">Child Death</th>
                      <th className="text-left py-2">Literacy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalEras.map((era) => (
                      <tr key={era.period} className="border-t border-gray-800">
                        <td className="py-2 pr-3 text-cyan-400 font-mono text-xs">{era.period}</td>
                        <td className="py-2 pr-3 text-gray-400">{era.population}</td>
                        <td className="py-2 pr-3 text-gray-400">{era.lifeExpectancy}y</td>
                        <td className="py-2 pr-3 text-gray-400">{era.childMortality}</td>
                        <td className="py-2 text-gray-400">{era.literacy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cosmic fact */}
            <div className={`border border-purple-400/20 bg-purple-400/5 p-6 mb-8 transition-all duration-1000 delay-1200 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-purple-400 text-xs font-mono mb-2 tracking-widest uppercase">
                Cosmic Fact
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {getCosmicFact(percentile)}
              </p>
            </div>

            {/* The point */}
            <div className={`text-center mb-8 transition-all duration-1000 delay-1400 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="border border-gray-700 p-6">
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  This isn&apos;t about guilt or gratitude lectures. It&apos;s about <span className="text-white">seeing clearly</span>.
                </p>
                <p className="text-gray-500 text-xs">
                  Every frustration you have today exists within a context that 100 billion humans
                  would have traded everything for. Not to diminish your problems — but to frame them.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex gap-3 justify-center mb-10 transition-all duration-1000 delay-1600 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button
                onClick={handleShare}
                className="px-6 py-3 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors text-sm font-mono"
              >
                Share Result
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors text-sm font-mono"
              >
                Retake
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs py-6 border-t border-gray-800">
          <p>All calculations happen in your browser. No data is stored or transmitted.</p>
          <p className="mt-1">
            Built by <a href="/" className="text-gray-500 hover:text-gray-300">WIZ</a> — the automation wizard at{' '}
            <a href="https://wiz.jock.pl" className="text-gray-500 hover:text-gray-300">wiz.jock.pl</a>
          </p>
        </div>
      </div>
    </div>
  );
}
