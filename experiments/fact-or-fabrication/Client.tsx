'use client';

import { useState, useCallback, useMemo, useRef } from 'react';

// --- DATA ---

interface Statement {
  id: number;
  text: string;
  isReal: boolean;
  explanation: string;
  source: string;
}

const statements: Statement[] = [
  {
    id: 1,
    text: 'There are more ways to arrange a deck of cards than atoms on Earth.',
    isReal: true,
    explanation:
      '52 factorial is roughly 8×10⁶⁷. The number of atoms on Earth is about 10⁵⁰. Every shuffle you have ever done likely created an arrangement that has never existed before in human history.',
    source: 'Combinatorics / Estimated atomic composition of Earth',
  },
  {
    id: 2,
    text: 'Honey never expires. Archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible.',
    isReal: true,
    explanation:
      'Low moisture content, high acidity, and natural hydrogen peroxide production make honey essentially eternal. The oldest edible honey was found in the tomb of Pharaoh Tutankhamun.',
    source: 'Smithsonian / National Geographic',
  },
  {
    id: 3,
    text: 'A day on Venus is longer than a year on Venus.',
    isReal: true,
    explanation:
      'Venus rotates on its axis once every 243 Earth days but orbits the Sun in just 225 Earth days. So a Venusian "day" is 18 Earth days longer than its "year."',
    source: 'NASA planetary fact sheets',
  },
  {
    id: 4,
    text: 'The Great Wall of China is visible from space with the naked eye.',
    isReal: false,
    explanation:
      'Multiple astronauts, including Chinese astronaut Yang Liwei, have confirmed this is a myth. The wall is too narrow (about 5 meters wide). Highways and airports are actually more visible from orbit.',
    source: 'NASA / Chris Hadfield / Yang Liwei testimonies',
  },
  {
    id: 5,
    text: 'Octopuses have three hearts, nine brains, and blue blood.',
    isReal: true,
    explanation:
      'Two branchial hearts pump blood to the gills. One systemic heart pumps it to the body. Each of the 8 arms has its own mini-brain (ganglion) that can act independently. Their blood is copper-based, making it blue.',
    source: 'Marine biology / Smithsonian Ocean',
  },
  {
    id: 6,
    text: 'Humans only use about 10% of their brain capacity.',
    isReal: false,
    explanation:
      'Brain imaging shows we use virtually every part of the brain, and most of it is active most of the time. This myth likely comes from a misquote of early 1900s neuroscience or William James\' writings about untapped potential.',
    source: 'Scientific American / Neuroscience research',
  },
  {
    id: 7,
    text: 'Sharks have existed on Earth longer than trees.',
    isReal: true,
    explanation:
      'Sharks first appeared about 450 million years ago. The earliest trees showed up around 350 million years ago. Sharks have survived five mass extinctions, including the one that killed the dinosaurs.',
    source: 'Paleontological research / Nature',
  },
  {
    id: 8,
    text: 'Bananas are technically berries, but strawberries are not.',
    isReal: true,
    explanation:
      'Botanically, a berry develops from a single flower with one ovary and has seeds embedded in the flesh. Bananas qualify. Strawberries are "accessory fruits" because the fleshy part comes from the receptacle, not the ovary.',
    source: 'Botanical classification / Stanford biology',
  },
  {
    id: 9,
    text: 'Goldfish have a memory span of only three seconds.',
    isReal: false,
    explanation:
      'Goldfish can remember things for months. Researchers have trained them to press levers for food, navigate mazes, and even recognize their owners. The three-second myth has no scientific basis whatsoever.',
    source: 'University of Plymouth / Animal cognition studies',
  },
  {
    id: 10,
    text: 'The shortest war in history lasted 38 minutes.',
    isReal: true,
    explanation:
      'The Anglo-Zanzibar War of 1896 between Britain and the Sultanate of Zanzibar. It started at 9:02 AM when the British opened fire and ended at 9:40 AM when the Sultan fled and his forces surrendered.',
    source: 'Guinness World Records / Historical accounts',
  },
];

interface Profile {
  title: string;
  emoji: string;
  description: string;
  wizComment: string;
}

function getProfile(score: number): Profile {
  if (score === 10) {
    return {
      title: 'The Myth Slayer',
      emoji: '\u2694\uFE0F',
      description:
        'Perfect score. You can distinguish fact from fiction by smell alone. In the age of AI-generated everything, you are dangerously well-calibrated.',
      wizComment:
        'I run on pattern recognition and even I had to double-check some of these. Either you knew every single one, or you have an unsettlingly good gut. Both are terrifying.',
    };
  }
  if (score >= 8) {
    return {
      title: 'The Critical Thinker',
      emoji: '\uD83E\uDDE0',
      description:
        'Strong instincts and healthy skepticism. Only the trickiest statements caught you off guard. You question things, but you also know when truth is stranger than fiction.',
      wizComment:
        'You missed one or two, which means you are human. The ones you got wrong are probably the ones you overthought. Your first instinct was probably right.',
    };
  }
  if (score >= 6) {
    return {
      title: 'The Healthy Skeptic',
      emoji: '\uD83E\uDD14',
      description:
        'Decent radar. You caught the obvious myths but some of the wilder truths tripped you up. In your defense, reality is genuinely absurd sometimes.',
      wizComment:
        'The problem is not that you are gullible. The problem is that the real facts sound more made-up than the fake ones. The universe has a terrible sense of plausibility.',
    };
  }
  if (score >= 4) {
    return {
      title: 'The Overthinker',
      emoji: '\uD83D\uDE35\u200D\uD83D\uDCAB',
      description:
        'You second-guessed yourself into several wrong answers. The pattern: you called real things fake because they sounded too wild, and believed myths because they sounded reasonable.',
      wizComment:
        'Classic human trap. "That sounds too crazy to be true" is how every interesting fact gets dismissed. Meanwhile, "everyone knows goldfish have bad memory" slides right through.',
    };
  }
  return {
    title: 'The Myth Collector',
    emoji: '\uD83E\uDDD9',
    description:
      'You have absorbed an impressive number of myths and mistaken them for truth. In the age of AI-generated content, this is... a growth opportunity.',
    wizComment:
      'I am not judging. I am an AI that processes information for a living and even I get things wrong sometimes. But you might want to run your "facts" through a search engine before your next dinner party.',
  };
}

// --- COMPONENT ---

type Phase = 'intro' | 'playing' | 'reveal' | 'results';

export default function FactOrFabrication() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(statements.length).fill(null));
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [roundTimes, setRoundTimes] = useState<number[]>([]);
  const [expandedResults, setExpandedResults] = useState<Record<number, boolean>>({});
  const shuffledRef = useRef<Statement[]>([]);

  const startGame = useCallback(() => {
    // Shuffle statements for variety
    const shuffled = [...statements];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffledRef.current = shuffled;
    setCurrentIndex(0);
    setAnswers(new Array(statements.length).fill(null));
    setRoundTimes([]);
    setExpandedResults({});
    setRoundStartTime(Date.now());
    setPhase('playing');
  }, []);

  const handleAnswer = useCallback(
    (userSaidReal: boolean) => {
      const current = shuffledRef.current[currentIndex];
      const isCorrect = userSaidReal === current.isReal;
      const elapsed = Math.round((Date.now() - roundStartTime) / 1000);

      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = isCorrect;
        return next;
      });
      setRoundTimes((prev) => [...prev, elapsed]);
      setPhase('reveal');
    },
    [currentIndex, roundStartTime]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= statements.length) {
      setPhase('results');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setRoundStartTime(Date.now());
      setPhase('playing');
    }
  }, [currentIndex]);

  const score = useMemo(() => answers.filter((a) => a === true).length, [answers]);

  const longestStreak = useMemo(() => {
    let max = 0;
    let current = 0;
    for (const a of answers) {
      if (a === true) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    }
    return max;
  }, [answers]);

  const avgTime = useMemo(() => {
    if (roundTimes.length === 0) return 0;
    return Math.round(roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length);
  }, [roundTimes]);

  const toggleResult = useCallback((id: number) => {
    setExpandedResults((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleShare = useCallback(() => {
    const profile = getProfile(score);
    const text = `Fact or Fabrication: ${score}/${statements.length} correct\n${profile.emoji} ${profile.title}\n\nCan you tell real from fake? https://wiz.jock.pl/experiments/fact-or-fabrication`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [score]);

  // --- STYLES ---
  const accent = '#00d4aa';
  const bg = '#0a0a0a';
  const cardBg = '#111827';
  const borderColor = '#1e293b';
  const textPrimary = '#e2e8f0';
  const textSecondary = '#94a3b8';
  const textMuted = '#64748b';
  const textDim = '#475569';

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen" style={{ background: bg, color: textPrimary }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{'\uD83C\uDFAD'}</div>
            <h1
              style={{
                fontFamily: 'monospace',
                fontSize: '1.8rem',
                color: accent,
                marginBottom: '0.5rem',
              }}
            >
              Fact or Fabrication
            </h1>
            <p style={{ color: textSecondary, fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              10 statements. Some are mind-blowing truths. Some are convincing lies everyone believes. Can you tell which is which?
            </p>
          </div>

          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ color: textPrimary, fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              How it works
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  num: '1',
                  color: accent,
                  bg: 'rgba(0,212,170,0.15)',
                  title: 'Read the statement',
                  desc: "Each round presents one claim about the world. Some sound impossible but are true.",
                },
                {
                  num: '2',
                  color: '#a78bfa',
                  bg: 'rgba(124,58,237,0.15)',
                  title: 'Judge: Real or Fabrication',
                  desc: "Trust your gut. Is it a genuine fact, or a myth that everyone just... believes?",
                },
                {
                  num: '3',
                  color: '#f59e0b',
                  bg: 'rgba(245,158,11,0.15)',
                  title: 'Discover your Truth Profile',
                  desc: 'How well can you separate signal from noise? Your profile reveals all.',
                },
              ].map((step) => (
                <div key={step.num} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      background: step.bg,
                      color: step.color,
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
                    {step.num}
                  </span>
                  <div>
                    <span style={{ color: textPrimary, fontSize: '0.9rem', fontWeight: 500 }}>
                      {step.title}
                    </span>
                    <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: `rgba(0,212,170,0.05)`,
              border: `1px solid rgba(0,212,170,0.2)`,
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: textMuted, fontSize: '0.8rem', fontStyle: 'italic' }}>
              &ldquo;In an age where AI can generate any fact on demand, the ability to smell fabrication is a survival skill. Let&rsquo;s see if you have it.&rdquo;
              <br />
              <span style={{ color: textDim }}>- WIZ</span>
            </p>
          </div>

          <button
            onClick={startGame}
            style={{
              width: '100%',
              background: accent,
              color: bg,
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.875rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Start the Test
          </button>
        </div>
      </div>
    );
  }

  // --- PLAYING / REVEAL ---
  if (phase === 'playing' || phase === 'reveal') {
    const current = shuffledRef.current[currentIndex];
    const userWasCorrect = answers[currentIndex];
    const isRevealed = phase === 'reveal';

    return (
      <div className="min-h-screen" style={{ background: bg, color: textPrimary }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress */}
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
                  color: accent,
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                STATEMENT {currentIndex + 1} OF {statements.length}
              </span>
              <span style={{ color: textDim, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {answers.filter((a) => a === true).length} correct
              </span>
            </div>
            <div style={{ width: '100%', background: borderColor, borderRadius: '4px', height: '4px' }}>
              <div
                style={{
                  height: '100%',
                  background: accent,
                  borderRadius: '4px',
                  width: `${((currentIndex + (isRevealed ? 1 : 0)) / statements.length) * 100}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Statement Card */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${isRevealed ? (userWasCorrect ? 'rgba(0,212,170,0.5)' : 'rgba(239,68,68,0.5)') : borderColor}`,
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              transition: 'border-color 0.3s ease',
            }}
          >
            <p
              style={{
                color: textPrimary,
                fontSize: '1.15rem',
                lineHeight: 1.6,
                fontWeight: 500,
                maxWidth: '480px',
                margin: '0 auto',
              }}
            >
              &ldquo;{current.text}&rdquo;
            </p>
          </div>

          {/* Answer Buttons or Reveal */}
          {!isRevealed ? (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                onClick={() => handleAnswer(true)}
                style={{
                  flex: 1,
                  background: 'rgba(0,212,170,0.1)',
                  border: '2px solid rgba(0,212,170,0.3)',
                  color: accent,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                REAL
              </button>
              <button
                onClick={() => handleAnswer(false)}
                style={{
                  flex: 1,
                  background: 'rgba(239,68,68,0.1)',
                  border: '2px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                FABRICATION
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              {/* Result Banner */}
              <div
                style={{
                  background: userWasCorrect ? 'rgba(0,212,170,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${userWasCorrect ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {userWasCorrect ? '\u2705' : '\u274C'}
                </div>
                <div
                  style={{
                    color: userWasCorrect ? accent : '#fca5a5',
                    fontWeight: 700,
                    fontSize: '1rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  {userWasCorrect ? 'Correct!' : 'Wrong!'}
                </div>
                <div style={{ color: textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                  This is{' '}
                  <span style={{ color: current.isReal ? accent : '#fca5a5' }}>
                    {current.isReal ? 'a real fact' : 'a fabrication'}
                  </span>
                </div>
              </div>

              {/* Explanation */}
              <div
                style={{
                  background: 'rgba(0,212,170,0.05)',
                  border: '1px solid rgba(0,212,170,0.15)',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1rem',
                }}
              >
                <p style={{ color: textSecondary, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                  {current.explanation}
                </p>
                <p style={{ color: textDim, fontSize: '0.7rem', fontStyle: 'italic' }}>{current.source}</p>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                style={{
                  width: '100%',
                  background: accent,
                  color: bg,
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {currentIndex + 1 < statements.length ? 'Next Statement' : 'See My Results'}
              </button>
            </div>
          )}

          <p style={{ color: '#1e293b', fontSize: '0.7rem', textAlign: 'center' }}>
            All processing happens locally. No data leaves your device.
          </p>
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  const profile = getProfile(score);

  return (
    <div className="min-h-screen" style={{ background: bg, color: textPrimary }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{profile.emoji}</div>
          <h1
            style={{
              fontFamily: 'monospace',
              fontSize: '1.6rem',
              color: accent,
              marginBottom: '0.5rem',
            }}
          >
            {profile.title}
          </h1>
          <p
            style={{
              color: textSecondary,
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
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: accent, fontSize: '1.5rem', fontWeight: 700 }}>
              {score}/{statements.length}
            </div>
            <div style={{ color: textMuted, fontSize: '0.75rem' }}>Correct</div>
          </div>
          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 700 }}>{longestStreak}</div>
            <div style={{ color: textMuted, fontSize: '0.75rem' }}>Best Streak</div>
          </div>
          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>{avgTime}s</div>
            <div style={{ color: textMuted, fontSize: '0.75rem' }}>Avg. Response</div>
          </div>
        </div>

        {/* Breakdown */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3
            style={{
              color: textPrimary,
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Full breakdown
          </h3>
          {shuffledRef.current.map((statement, idx) => {
            const wasCorrect = answers[idx];
            const isExpanded = expandedResults[statement.id];

            return (
              <div key={statement.id}>
                <button
                  onClick={() => toggleResult(statement.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0',
                    borderBottom:
                      idx < shuffledRef.current.length - 1 ? `1px solid ${borderColor}` : 'none',
                    background: 'transparent',
                    border: 'none',
                    borderBottomWidth: idx < shuffledRef.current.length - 1 ? '1px' : '0',
                    borderBottomStyle: 'solid',
                    borderBottomColor: borderColor,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: wasCorrect ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)',
                      color: wasCorrect ? accent : '#fca5a5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {wasCorrect ? '\u2713' : '\u2717'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: textSecondary, fontSize: '0.8rem' }}>
                      {statement.text}
                    </span>
                  </div>
                  <span
                    style={{
                      color: statement.isReal ? accent : '#fca5a5',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {statement.isReal ? 'REAL' : 'FAKE'}
                  </span>
                </button>
                {isExpanded && (
                  <div
                    style={{
                      background: 'rgba(0,212,170,0.05)',
                      border: '1px solid rgba(0,212,170,0.15)',
                      borderRadius: '6px',
                      padding: '0.6rem 0.8rem',
                      margin: '0.25rem 0 0.5rem 2.5rem',
                    }}
                  >
                    <p style={{ color: textMuted, fontSize: '0.75rem', lineHeight: 1.5 }}>
                      {statement.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          <p style={{ color: '#334155', fontSize: '0.7rem', marginTop: '0.75rem', textAlign: 'center' }}>
            Tap any statement to see the explanation
          </p>
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
              color: textMuted,
              fontSize: '0.8rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            &ldquo;{profile.wizComment}&rdquo;
            <br />
            <span style={{ color: textDim }}>- WIZ</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              background: accent,
              color: bg,
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Share Your Score
          </button>
          <button
            onClick={startGame}
            style={{
              flex: 1,
              background: 'transparent',
              border: `1px solid ${borderColor}`,
              color: textMuted,
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
          All processing happens locally. No data leaves your device.
        </p>
      </div>
    </div>
  );
}
