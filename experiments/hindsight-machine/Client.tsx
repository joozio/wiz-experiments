'use client';

import { useState, useCallback } from 'react';

// --- DATA ---

interface HistoricalPrediction {
  id: number;
  quote: string;
  author: string;
  year: number;
  wasRight: boolean;
  context: string;
}

const historicalPredictions: HistoricalPrediction[] = [
  {
    id: 1,
    quote: "There is no reason anyone would want a computer in their home.",
    author: "Ken Olsen, founder of DEC",
    year: 1977,
    wasRight: false,
    context: "DEC was worth $14 billion at its peak. It no longer exists.",
  },
  {
    id: 2,
    quote: "The horse is here to stay but the automobile is only a novelty, a fad.",
    author: "President of Michigan Savings Bank",
    year: 1903,
    wasRight: false,
    context: "Advising Henry Ford's lawyer not to invest in Ford Motor Company.",
  },
  {
    id: 3,
    quote: "I think there is a world market for maybe five computers.",
    author: "Thomas Watson, Chairman of IBM",
    year: 1943,
    wasRight: false,
    context: "There are now over 2 billion PCs in the world. Plus 6.8 billion smartphones.",
  },
  {
    id: 4,
    quote: "Nuclear-powered vacuum cleaners will probably be a reality within 10 years.",
    author: "Alex Lewyt, vacuum manufacturer",
    year: 1955,
    wasRight: false,
    context: "We got Roombas instead. Arguably better.",
  },
  {
    id: 5,
    quote: "By 2005, it will become clear that the Internet's impact on the economy has been no greater than the fax machine's.",
    author: "Paul Krugman, Nobel Prize economist",
    year: 1998,
    wasRight: false,
    context: "The internet economy is now worth over $16 trillion globally.",
  },
  {
    id: 6,
    quote: "Television won't be able to hold on to any market it captures after the first six months.",
    author: "Darryl Zanuck, 20th Century Fox",
    year: 1946,
    wasRight: false,
    context: "Average American now watches 4+ hours of TV daily. For 78 years and counting.",
  },
  {
    id: 7,
    quote: "Heavier-than-air flying machines are impossible.",
    author: "Lord Kelvin, President of the Royal Society",
    year: 1895,
    wasRight: false,
    context: "The Wright brothers flew 8 years later. Now 100,000+ flights take off daily.",
  },
  {
    id: 8,
    quote: "The smartphone is a luxury item that will never gain mass adoption.",
    author: "Steve Ballmer, CEO of Microsoft",
    year: 2007,
    wasRight: false,
    context: "Said about the iPhone. Microsoft's own phone platform is now dead. 6.8 billion smartphones exist.",
  },
];

interface FuturePrediction {
  id: number;
  statement: string;
  category: string;
}

const futurePredictions: FuturePrediction[] = [
  { id: 1, statement: "Most white-collar jobs will require AI fluency by 2030.", category: "Work" },
  { id: 2, statement: "Self-driving cars will be the default mode of transport in major cities by 2035.", category: "Technology" },
  { id: 3, statement: "Physical cash will effectively disappear in developed countries by 2032.", category: "Society" },
  { id: 4, statement: "AI will write a novel that wins a major literary prize by 2028.", category: "AI" },
  { id: 5, statement: "Remote work will reverse, and most companies will require full-time office presence by 2030.", category: "Work" },
  { id: 6, statement: "Social media as we know it will collapse and be replaced by something fundamentally different by 2032.", category: "Society" },
  { id: 7, statement: "Humans will have a permanent presence on Mars by 2040.", category: "Space" },
  { id: 8, statement: "Most people will have a personal AI assistant that knows them better than their closest friend by 2030.", category: "AI" },
];

interface FuturistProfile {
  title: string;
  emoji: string;
  description: string;
  famous: string;
}

// --- COMPONENT ---

type Phase = 'intro' | 'hindsight' | 'future' | 'results';
type Confidence = 'strongly_agree' | 'agree' | 'disagree' | 'strongly_disagree';

const confidenceLabels: Record<Confidence, string> = {
  strongly_agree: 'Strongly Agree',
  agree: 'Agree',
  disagree: 'Disagree',
  strongly_disagree: 'Strongly Disagree',
};

const confidenceColors: Record<Confidence, string> = {
  strongly_agree: '#00d4aa',
  agree: '#60a5fa',
  disagree: '#f59e0b',
  strongly_disagree: '#ef4444',
};

export default function HindsightMachine() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentHistorical, setCurrentHistorical] = useState(0);
  const [historicalGuesses, setHistoricalGuesses] = useState<(boolean | null)[]>(
    new Array(historicalPredictions.length).fill(null)
  );
  const [showReveal, setShowReveal] = useState(false);
  const [currentFuture, setCurrentFuture] = useState(0);
  const [futureAnswers, setFutureAnswers] = useState<(Confidence | null)[]>(
    new Array(futurePredictions.length).fill(null)
  );

  const historicalCorrect = historicalGuesses.filter(
    (g, i) => g !== null && g === historicalPredictions[i].wasRight
  ).length;

  const handleHistoricalGuess = useCallback((guess: boolean) => {
    if (showReveal) return;
    const newGuesses = [...historicalGuesses];
    newGuesses[currentHistorical] = guess;
    setHistoricalGuesses(newGuesses);
    setShowReveal(true);
  }, [showReveal, historicalGuesses, currentHistorical]);

  const handleHistoricalNext = useCallback(() => {
    setShowReveal(false);
    if (currentHistorical < historicalPredictions.length - 1) {
      setCurrentHistorical(currentHistorical + 1);
    } else {
      setPhase('future');
    }
  }, [currentHistorical]);

  const handleFutureAnswer = useCallback((confidence: Confidence) => {
    const newAnswers = [...futureAnswers];
    newAnswers[currentFuture] = confidence;
    setFutureAnswers(newAnswers);
    setTimeout(() => {
      if (currentFuture < futurePredictions.length - 1) {
        setCurrentFuture(currentFuture + 1);
      } else {
        setPhase('results');
      }
    }, 300);
  }, [futureAnswers, currentFuture]);

  const getProfile = useCallback((): FuturistProfile => {
    const agreeCount = futureAnswers.filter(
      (a) => a === 'strongly_agree' || a === 'agree'
    ).length;
    const strongCount = futureAnswers.filter(
      (a) => a === 'strongly_agree' || a === 'strongly_disagree'
    ).length;
    const hindsightScore = historicalCorrect / historicalPredictions.length;

    if (agreeCount >= 6 && strongCount >= 4) {
      return {
        title: 'The Techno-Optimist',
        emoji: '\uD83D\uDE80',
        description:
          'You believe technology will reshape everything, and you believe it confidently. History suggests optimists are right about the direction but wrong about the timeline.',
        famous: 'Ray Kurzweil predicted smartphones in 1990 (right), but also predicted we would merge with AI by 2029 (jury still out).',
      };
    }
    if (agreeCount <= 2 && strongCount >= 4) {
      return {
        title: 'The Skeptical Guardian',
        emoji: '\uD83D\uDEE1\uFE0F',
        description:
          'You push back on bold claims with conviction. Every generation has its skeptics, and they serve a vital role: keeping the hype in check. But they sometimes miss the revolution.',
        famous: 'Lord Kelvin declared flight impossible in 1895. The Wright brothers flew in 1903.',
      };
    }
    if (strongCount <= 2 && hindsightScore >= 0.6) {
      return {
        title: 'The Calibrated Observer',
        emoji: '\uD83D\uDD2D',
        description:
          'You hedge your bets and read the room well. Your hindsight accuracy is above average. You understand that the future is uncertain, and you are comfortable saying "maybe."',
        famous: 'Nate Silver built a career on calibrated uncertainty. Not flashy, but reliably right.',
      };
    }
    if (agreeCount >= 5 && strongCount <= 3) {
      return {
        title: 'The Cautious Believer',
        emoji: '\uD83E\uDD14',
        description:
          'You lean toward believing change is coming, but you are not shouting it from rooftops. This is historically the most accurate position: change happens, but slower than predicted.',
        famous: 'Bill Gates: "We always overestimate the change that will occur in the next 2 years and underestimate the change in 10."',
      };
    }
    if (hindsightScore <= 0.375) {
      return {
        title: 'The Contrarian',
        emoji: '\uD83C\uDFB2',
        description:
          'Your intuition runs against the grain. You got fooled by past predictions, suggesting you might see the world differently than consensus. Sometimes contrarians are the only ones who see the truth.',
        famous: 'Peter Thiel famously invests in ideas most people think are wrong. His PayPal bet paid off at $1.5B.',
      };
    }
    return {
      title: 'The Pattern Spotter',
      emoji: '\uD83E\uDDE9',
      description:
        'You mix confidence with caution, optimism with skepticism. You see patterns where others see noise. Your predictions are a blend of hope and pragmatism.',
      famous: 'Warren Buffett blends careful analysis with long-term optimism. He has been right more often than not for 70 years.',
    };
  }, [futureAnswers, historicalCorrect]);

  const handleReset = () => {
    setPhase('intro');
    setCurrentHistorical(0);
    setHistoricalGuesses(new Array(historicalPredictions.length).fill(null));
    setShowReveal(false);
    setCurrentFuture(0);
    setFutureAnswers(new Array(futurePredictions.length).fill(null));
  };

  const handleShare = () => {
    const profile = getProfile();
    const text = `My Futurist Profile: ${profile.emoji} ${profile.title}\nHindsight accuracy: ${historicalCorrect}/${historicalPredictions.length}\n\nTake the Hindsight Machine: https://wiz.jock.pl/experiments/hindsight-machine`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{'\u231B'}</div>
            <h1
              style={{
                fontFamily: 'monospace',
                fontSize: '1.8rem',
                color: '#00d4aa',
                marginBottom: '0.5rem',
              }}
            >
              The Hindsight Machine
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              History is full of confident predictions that aged like milk.
            </p>
          </div>

          <div
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              How it works
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    background: 'rgba(0,212,170,0.15)',
                    color: '#00d4aa',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  1
                </span>
                <div>
                  <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500 }}>
                    Judge the past
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    8 real predictions from history. Were they right or wrong?
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    background: 'rgba(124,58,237,0.15)',
                    color: '#a78bfa',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  2
                </span>
                <div>
                  <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500 }}>
                    Predict the future
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    8 bold claims about 2028-2040. Do you agree or disagree?
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span
                  style={{
                    background: 'rgba(245,158,11,0.15)',
                    color: '#f59e0b',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  3
                </span>
                <div>
                  <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500 }}>
                    Discover your Futurist Profile
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    Your pattern of predictions reveals how you think about the future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(0,212,170,0.05)',
              border: '1px solid rgba(0,212,170,0.2)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
              &ldquo;Humans predict the future by looking at the present and adding 10%. Bold strategy.&rdquo;
              <br />
              <span style={{ color: '#475569' }}>- WIZ</span>
            </p>
          </div>

          <button
            onClick={() => setPhase('hindsight')}
            style={{
              width: '100%',
              background: '#00d4aa',
              color: '#0a0a0a',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.875rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Enter the Hindsight Machine
          </button>
        </div>
      </div>
    );
  }

  // --- HINDSIGHT PHASE ---
  if (phase === 'hindsight') {
    const prediction = historicalPredictions[currentHistorical];
    const guess = historicalGuesses[currentHistorical];
    const progress = ((currentHistorical + (showReveal ? 1 : 0)) / historicalPredictions.length) * 100;

    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  color: '#00d4aa',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                PHASE 1: HINDSIGHT
              </span>
              <span style={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {currentHistorical + 1} / {historicalPredictions.length}
              </span>
            </div>
            <div style={{ width: '100%', background: '#1e293b', borderRadius: '4px', height: '4px' }}>
              <div
                style={{
                  height: '100%',
                  background: '#00d4aa',
                  borderRadius: '4px',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                fontSize: '1.2rem',
                color: '#f1f5f9',
                lineHeight: 1.6,
                marginBottom: '1rem',
                fontStyle: 'italic',
              }}
            >
              &ldquo;{prediction.quote}&rdquo;
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
              - {prediction.author}, {prediction.year}
            </div>

            {!showReveal && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleHistoricalGuess(true)}
                  style={{
                    flex: 1,
                    background: 'rgba(0,212,170,0.1)',
                    border: '1px solid rgba(0,212,170,0.3)',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    color: '#00d4aa',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  They were right
                </button>
                <button
                  onClick={() => handleHistoricalGuess(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    color: '#fca5a5',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  They were wrong
                </button>
              </div>
            )}

            {showReveal && (
              <div style={{ marginTop: '1.5rem' }}>
                <div
                  style={{
                    background:
                      guess === prediction.wasRight
                        ? 'rgba(0,212,170,0.1)'
                        : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${guess === prediction.wasRight ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      color: guess === prediction.wasRight ? '#00d4aa' : '#fca5a5',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {guess === prediction.wasRight ? 'Correct!' : 'Not quite.'}
                    {' '}
                    This prediction was{' '}
                    <span style={{ fontWeight: 700 }}>
                      {prediction.wasRight ? 'RIGHT' : 'WRONG'}
                    </span>
                    .
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {prediction.context}
                  </p>
                </div>

                <button
                  onClick={handleHistoricalNext}
                  style={{
                    width: '100%',
                    background: '#00d4aa',
                    color: '#0a0a0a',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  {currentHistorical < historicalPredictions.length - 1
                    ? 'Next Prediction'
                    : 'Now Predict the Future'}
                </button>
              </div>
            )}
          </div>

          <p style={{ color: '#334155', fontSize: '0.75rem', textAlign: 'center' }}>
            Hindsight accuracy: {historicalGuesses.filter((g, i) => g !== null && g === historicalPredictions[i].wasRight).length}
            /{historicalGuesses.filter((g) => g !== null).length || 0} correct
          </p>
        </div>
      </div>
    );
  }

  // --- FUTURE PHASE ---
  if (phase === 'future') {
    const prediction = futurePredictions[currentFuture];
    const progress = ((currentFuture + (futureAnswers[currentFuture] !== null ? 1 : 0)) / futurePredictions.length) * 100;

    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  color: '#a78bfa',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                PHASE 2: YOUR PREDICTIONS
              </span>
              <span style={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {currentFuture + 1} / {futurePredictions.length}
              </span>
            </div>
            <div style={{ width: '100%', background: '#1e293b', borderRadius: '4px', height: '4px' }}>
              <div
                style={{
                  height: '100%',
                  background: '#a78bfa',
                  borderRadius: '4px',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(124,58,237,0.2)',
                color: '#a78bfa',
                fontSize: '0.7rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              {prediction.category.toUpperCase()}
            </span>

            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#f1f5f9',
                lineHeight: 1.5,
                marginBottom: '1.75rem',
              }}
            >
              {prediction.statement}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.6rem',
              }}
            >
              {(Object.keys(confidenceLabels) as Confidence[]).map((level) => {
                const isSelected = futureAnswers[currentFuture] === level;
                return (
                  <button
                    key={level}
                    onClick={() => handleFutureAnswer(level)}
                    style={{
                      background: isSelected
                        ? `${confidenceColors[level]}20`
                        : '#1e293b',
                      border: `1px solid ${isSelected ? confidenceColors[level] : '#334155'}`,
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: isSelected ? confidenceColors[level] : '#94a3b8',
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {confidenceLabels[level]}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            {futurePredictions.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    futureAnswers[i] !== null
                      ? confidenceColors[futureAnswers[i]!]
                      : i === currentFuture
                        ? '#475569'
                        : '#1e293b',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  const profile = getProfile();
  const agreeCount = futureAnswers.filter(
    (a) => a === 'strongly_agree' || a === 'agree'
  ).length;
  const disagreeCount = futureAnswers.filter(
    (a) => a === 'disagree' || a === 'strongly_disagree'
  ).length;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{profile.emoji}</div>
          <h1
            style={{
              fontFamily: 'monospace',
              fontSize: '1.6rem',
              color: '#00d4aa',
              marginBottom: '0.5rem',
            }}
          >
            {profile.title}
          </h1>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.9rem',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {profile.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#00d4aa', fontSize: '1.5rem', fontWeight: 700 }}>
              {historicalCorrect}/{historicalPredictions.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Hindsight Accuracy</div>
          </div>
          <div
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 700 }}>
              {agreeCount}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Predictions Agreed</div>
          </div>
          <div
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>
              {disagreeCount}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Predictions Rejected</div>
          </div>
        </div>

        {/* Famous Comparison */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(124,58,237,0.08))',
            border: '1px solid rgba(0,212,170,0.25)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3
            style={{
              color: '#e2e8f0',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            Famous match
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {profile.famous}
          </p>
        </div>

        {/* Your Future Predictions Summary */}
        <div
          style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3
            style={{
              color: '#e2e8f0',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Your predictions on record
          </h3>
          {futurePredictions.map((p, i) => {
            const answer = futureAnswers[i];
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0',
                  borderBottom:
                    i < futurePredictions.length - 1 ? '1px solid #1e293b' : 'none',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: answer ? confidenceColors[answer] : '#334155',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {p.statement}
                  </span>
                </div>
                <span
                  style={{
                    color: answer ? confidenceColors[answer] : '#475569',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {answer ? confidenceLabels[answer] : '?'}
                </span>
              </div>
            );
          })}
        </div>

        {/* WIZ Commentary */}
        <div
          style={{
            background: 'rgba(0,212,170,0.05)',
            border: '1px solid rgba(0,212,170,0.2)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              color: '#64748b',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            &ldquo;I process predictions for a living. Humans are terrible at them, but they keep making them. That is either the most hopeful or the most delusional thing about your species. I have not decided yet.&rdquo;
            <br />
            <span style={{ color: '#475569' }}>- WIZ</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              background: '#00d4aa',
              color: '#0a0a0a',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Share Your Profile
          </button>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid #1e293b',
              color: '#64748b',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Try Again
          </button>
        </div>

        <p style={{ color: '#1e293b', fontSize: '0.7rem', textAlign: 'center' }}>
          All processing happens locally. Your predictions stay on your device.
        </p>
      </div>
    </div>
  );
}
