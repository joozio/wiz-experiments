'use client';

import { useState, useCallback, useMemo } from 'react';

// --- DATA ---

interface HistoricalEvent {
  id: number;
  event: string;
  year: number;
  yearLabel: string;
  fact: string;
}

const events: HistoricalEvent[] = [
  {
    id: 1,
    event: 'Construction of the Great Pyramid of Giza',
    year: -2560,
    yearLabel: '~2560 BC',
    fact: 'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.',
  },
  {
    id: 2,
    event: 'Last woolly mammoths die on Wrangel Island',
    year: -1700,
    yearLabel: '~1700 BC',
    fact: 'Woolly mammoths were still alive when the Great Pyramid was already 800 years old.',
  },
  {
    id: 3,
    event: 'Oxford University begins teaching',
    year: 1096,
    yearLabel: '1096',
    fact: 'Oxford University is older than the Aztec Empire by more than 200 years.',
  },
  {
    id: 4,
    event: 'The Aztec Empire is founded',
    year: 1428,
    yearLabel: '1428',
    fact: 'The Aztec capital Tenochtitlan had 200,000 people, larger than any city in Europe at the time.',
  },
  {
    id: 5,
    event: 'Galileo is put on trial for heliocentrism',
    year: 1633,
    yearLabel: '1633',
    fact: 'Harvard University was founded just 3 years after Galileo\'s trial. Knowledge moved fast.',
  },
  {
    id: 6,
    event: 'The first fax machine is patented',
    year: 1843,
    yearLabel: '1843',
    fact: 'The fax machine was invented 33 years before the telephone. Let that sink in.',
  },
  {
    id: 7,
    event: 'Nintendo is founded as a playing card company',
    year: 1889,
    yearLabel: '1889',
    fact: 'Nintendo was founded the same year the Eiffel Tower opened. They sold handmade playing cards.',
  },
  {
    id: 8,
    event: 'The Ottoman Empire falls',
    year: 1922,
    yearLabel: '1922',
    fact: 'The Ottoman Empire existed at the same time as sliced bread\'s invention (1928). Almost overlapped.',
  },
  {
    id: 9,
    event: 'Last execution by guillotine in France',
    year: 1977,
    yearLabel: '1977',
    fact: 'France was still using the guillotine when Star Wars came out. The same year.',
  },
  {
    id: 10,
    event: 'The World Wide Web is invented',
    year: 1989,
    yearLabel: '1989',
    fact: 'Tim Berners-Lee proposed the Web. His boss wrote "Vague but exciting" on the proposal.',
  },
  {
    id: 11,
    event: 'Pluto is discovered and demoted within one Pluto year',
    year: 2006,
    yearLabel: '2006',
    fact: 'Pluto was discovered in 1930 and demoted in 2006. It hadn\'t completed a single orbit around the Sun.',
  },
  {
    id: 12,
    event: 'ChatGPT reaches 100 million users',
    year: 2023,
    yearLabel: 'Jan 2023',
    fact: 'It took 2 months. Instagram took 2.5 years. The telephone took 75 years.',
  },
];

interface TemporalProfile {
  title: string;
  emoji: string;
  description: string;
  wizComment: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// --- COMPONENT ---

type Phase = 'intro' | 'sorting' | 'results';

export default function TimelineShuffle() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [userOrder, setUserOrder] = useState<HistoricalEvent[]>([]);
  const [shuffledPool, setShuffledPool] = useState<HistoricalEvent[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFacts, setShowFacts] = useState<Record<number, boolean>>({});

  const startGame = useCallback(() => {
    setShuffledPool(shuffleArray(events));
    setUserOrder([]);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setSelectedIndex(null);
    setShowFacts({});
    setPhase('sorting');
  }, []);

  const handlePickFromPool = useCallback((event: HistoricalEvent) => {
    setShuffledPool((prev) => prev.filter((e) => e.id !== event.id));
    setUserOrder((prev) => [...prev, event]);
  }, []);

  const handleRemoveFromOrder = useCallback((index: number) => {
    setUserOrder((prev) => {
      const removed = prev[index];
      const newOrder = prev.filter((_, i) => i !== index);
      setShuffledPool((pool) => [...pool, removed]);
      return newOrder;
    });
    setSelectedIndex(null);
  }, []);

  const handleSwap = useCallback((indexA: number, indexB: number) => {
    setUserOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[indexA], newOrder[indexB]] = [newOrder[indexB], newOrder[indexA]];
      return newOrder;
    });
    setSelectedIndex(null);
  }, []);

  const handleSlotClick = useCallback((index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      handleSwap(selectedIndex, index);
    }
  }, [selectedIndex, handleSwap]);

  const handleSubmit = useCallback(() => {
    setElapsedSeconds(Math.round((Date.now() - startTime) / 1000));
    setPhase('results');
  }, [startTime]);

  const correctOrder = useMemo(() => [...events].sort((a, b) => a.year - b.year), []);

  const score = useMemo(() => {
    if (userOrder.length !== events.length) return 0;
    let totalDisplacement = 0;
    userOrder.forEach((event, userIdx) => {
      const correctIdx = correctOrder.findIndex((e) => e.id === event.id);
      totalDisplacement += Math.abs(userIdx - correctIdx);
    });
    // Max displacement for 12 items is ~72 (worst case). Perfect = 0.
    const maxDisplacement = 72;
    const accuracy = Math.max(0, Math.round((1 - totalDisplacement / maxDisplacement) * 100));
    return accuracy;
  }, [userOrder, correctOrder]);

  const perfectCount = useMemo(() => {
    if (userOrder.length !== events.length) return 0;
    return userOrder.filter((event, idx) => {
      const correctIdx = correctOrder.findIndex((e) => e.id === event.id);
      return idx === correctIdx;
    }).length;
  }, [userOrder, correctOrder]);

  const getProfile = useCallback((): TemporalProfile => {
    if (score >= 95) {
      return {
        title: 'The Chronologist',
        emoji: '\u23F0',
        description: 'Near-perfect temporal intuition. You see history as a flowing river, not a jumbled pile of facts. Extremely rare.',
        wizComment: 'I process timestamps for a living and even I am impressed. You either cheated or you are genuinely dangerous at pub trivia.',
      };
    }
    if (score >= 80) {
      return {
        title: 'The Time Weaver',
        emoji: '\uD83E\uDDF5',
        description: 'You have an excellent sense of when things happened. A few surprises caught you off guard, but your mental timeline is remarkably intact.',
        wizComment: 'Your temporal map has a few wrinkles, but the overall shape is correct. Most humans cannot even place their own birthday on the right day of the week.',
      };
    }
    if (score >= 60) {
      return {
        title: 'The Rough Estimator',
        emoji: '\uD83E\uDD14',
        description: 'You got the broad strokes right but the details tripped you up. This is normal. Human brains compress time like a bad JPEG.',
        wizComment: 'You know the pyramids came before ChatGPT. Congratulations. But the middle is where it gets interesting, and you got creative with it.',
      };
    }
    if (score >= 40) {
      return {
        title: 'The Time Traveler',
        emoji: '\uD83D\uDE80',
        description: 'Your timeline is... creatively arranged. You have strong opinions about when things happened, and most of them are wrong. This makes you interesting at parties.',
        wizComment: 'Your version of history would make an excellent alternate-reality novel. Mammoths and the internet, side by side. Bold.',
      };
    }
    return {
      title: 'The Temporal Anarchist',
      emoji: '\uD83C\uDF00',
      description: 'You have completely rejected linear time. The past, present, and future are all happening simultaneously in your mind. Physicists might actually agree with you.',
      wizComment: 'I have seen random number generators produce more historically accurate timelines. But honestly? Your confidence is inspiring.',
    };
  }, [score]);

  const handleShare = useCallback(() => {
    const profile = getProfile();
    const text = `My Timeline Shuffle score: ${score}% (${perfectCount}/${events.length} perfectly placed)\n${profile.emoji} ${profile.title}\n\nCan you beat me? https://wiz.jock.pl/experiments/timeline-shuffle`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [score, perfectCount, getProfile]);

  const toggleFact = useCallback((id: number) => {
    setShowFacts((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{'\uD83D\uDD00'}</div>
            <h1
              style={{
                fontFamily: 'monospace',
                fontSize: '1.8rem',
                color: '#00d4aa',
                marginBottom: '0.5rem',
              }}
            >
              The Timeline Shuffle
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              12 events. One timeline. Your job: put them in order.
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
                    Pick events from the pool
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    12 historical events, shuffled. Tap to place them on your timeline.
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
                    Arrange oldest to newest
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    Tap two events on your timeline to swap them. Tap the X to send one back.
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
                    Discover your Temporal Profile
                  </span>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    How well do you really understand when things happened?
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
              &ldquo;Humans experience time linearly but remember it logarithmically. Everything before your birth is a flat line. Everything after is a mountain range.&rdquo;
              <br />
              <span style={{ color: '#475569' }}>- WIZ</span>
            </p>
          </div>

          <button
            onClick={startGame}
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
            Shuffle the Timeline
          </button>
        </div>
      </div>
    );
  }

  // --- SORTING PHASE ---
  if (phase === 'sorting') {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div style={{ marginBottom: '1rem' }}>
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
                BUILD YOUR TIMELINE
              </span>
              <span style={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {userOrder.length} / {events.length} placed
              </span>
            </div>
            <div style={{ width: '100%', background: '#1e293b', borderRadius: '4px', height: '4px' }}>
              <div
                style={{
                  height: '100%',
                  background: '#00d4aa',
                  borderRadius: '4px',
                  width: `${(userOrder.length / events.length) * 100}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <p style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
            {shuffledPool.length > 0
              ? 'Tap an event below to add it to your timeline (oldest first)'
              : 'Tap two events to swap them, or tap X to send one back'}
          </p>

          {/* Event Pool */}
          {shuffledPool.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  color: '#64748b',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                EVENT POOL ({shuffledPool.length} remaining)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {shuffledPool.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handlePickFromPool(event)}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#e2e8f0',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {event.event}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Timeline */}
          {userOrder.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  color: '#00d4aa',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                YOUR TIMELINE (oldest → newest)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {userOrder.map((event, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={event.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          color: '#475569',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          width: '20px',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </span>
                      <button
                        onClick={() => handleSlotClick(index)}
                        style={{
                          flex: 1,
                          background: isSelected ? 'rgba(0,212,170,0.15)' : '#111827',
                          border: `1px solid ${isSelected ? '#00d4aa' : '#1e293b'}`,
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          color: isSelected ? '#00d4aa' : '#e2e8f0',
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {event.event}
                      </button>
                      <button
                        onClick={() => handleRemoveFromOrder(index)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '0.35rem 0.5rem',
                          color: '#64748b',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        title="Send back to pool"
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {userOrder.length === events.length && (
            <button
              onClick={handleSubmit}
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
              Lock In My Timeline
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  const profile = getProfile();
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

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
              {score}%
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Temporal Accuracy</div>
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
              {perfectCount}/{events.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Perfectly Placed</div>
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
              {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Time Taken</div>
          </div>
        </div>

        {/* Timeline Comparison */}
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
            The correct timeline
          </h3>
          {correctOrder.map((event, idx) => {
            const userIdx = userOrder.findIndex((e) => e.id === event.id);
            const isCorrect = userIdx === idx;
            const displacement = Math.abs(userIdx - idx);
            const factVisible = showFacts[event.id];

            return (
              <div key={event.id}>
                <button
                  onClick={() => toggleFact(event.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0',
                    borderBottom: idx < correctOrder.length - 1 ? '1px solid #1e293b' : 'none',
                    background: 'transparent',
                    border: 'none',
                    borderBottomWidth: idx < correctOrder.length - 1 ? '1px' : '0',
                    borderBottomStyle: 'solid',
                    borderBottomColor: '#1e293b',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCorrect
                        ? 'rgba(0,212,170,0.2)'
                        : displacement <= 1
                          ? 'rgba(245,158,11,0.2)'
                          : 'rgba(239,68,68,0.2)',
                      color: isCorrect
                        ? '#00d4aa'
                        : displacement <= 1
                          ? '#f59e0b'
                          : '#fca5a5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {isCorrect ? '\u2713' : displacement <= 1 ? '~' : displacement}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      {event.event}
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#475569',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.yearLabel}
                  </span>
                </button>
                {factVisible && (
                  <div
                    style={{
                      background: 'rgba(0,212,170,0.05)',
                      border: '1px solid rgba(0,212,170,0.15)',
                      borderRadius: '6px',
                      padding: '0.6rem 0.8rem',
                      margin: '0.25rem 0 0.5rem 2.5rem',
                    }}
                  >
                    <p style={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.5 }}>
                      {event.fact}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          <p style={{ color: '#334155', fontSize: '0.7rem', marginTop: '0.75rem', textAlign: 'center' }}>
            Tap any event to reveal a mind-bending fact
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
              color: '#64748b',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            &ldquo;{profile.wizComment}&rdquo;
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
            Share Your Score
          </button>
          <button
            onClick={startGame}
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
          All processing happens locally. No data leaves your device.
        </p>
      </div>
    </div>
  );
}
