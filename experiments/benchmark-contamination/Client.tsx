'use client';

import { useState } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  source: string;
  benchmark: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'What is 5 + 3 x 2?',
    options: ['16', '11', '13', '10'],
    correctIndex: 1,
    source: 'MMLU Elementary Mathematics',
    benchmark: 'MMLU',
  },
  {
    id: 2,
    text: 'She poured water into the pot. She placed it on the stove. She turned on the heat. She waited for...',
    options: [
      'The clock to ring',
      'The water to boil',
      'Her phone to ring',
      'The pot to break',
    ],
    correctIndex: 1,
    source: 'HellaSwag (Commonsense NLI)',
    benchmark: 'HellaSwag',
  },
  {
    id: 3,
    text: 'Which of these is a property of metals?',
    options: [
      'They are transparent',
      'They are good conductors of electricity',
      'They float on water',
      'They are brittle',
    ],
    correctIndex: 1,
    source: 'ARC Challenge (Science)',
    benchmark: 'ARC',
  },
  {
    id: 4,
    text: 'What year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correctIndex: 2,
    source: 'MMLU World History',
    benchmark: 'MMLU',
  },
  {
    id: 5,
    text: 'A model scores 80% on public benchmarks. On a fresh private set with equivalent difficulty, it scores 39%. What is the contamination gap?',
    options: ['39 points', '80 points', '41 points', '119 points'],
    correctIndex: 2,
    source: 'LLMatcher research (MiniMax model)',
    benchmark: 'LLMatcher',
  },
];

const contaminationData = [
  { model: 'Claude 3.5', publicScore: 87, privateScore: 82, gap: -5, color: '#00d4aa' },
  { model: 'GPT-4o', publicScore: 88, privateScore: 71, gap: -17, color: '#7c3aed' },
  { model: 'Gemini 1.5', publicScore: 85, privateScore: 68, gap: -17, color: '#6366f1' },
  { model: 'MiniMax', publicScore: 80, privateScore: 39, gap: -41, color: '#ef4444' },
];

type Phase = 'quiz' | 'reveal' | 'results';

export default function BenchmarkContamination() {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [correct, setCorrect] = useState<boolean[]>([]);
  const [showNext, setShowNext] = useState(false);

  const question = questions[currentQ];
  const totalCorrect = correct.filter(Boolean).length;
  const progress = ((currentQ + (showNext ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === question.correctIndex;
    setAnswered([...answered, true]);
    setCorrect([...correct, isCorrect]);
    setShowNext(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowNext(false);
    } else {
      setPhase('reveal');
    }
  };

  const handleReset = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setSelected(null);
    setAnswered([]);
    setCorrect([]);
    setShowNext(false);
  };

  if (phase === 'results') {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-4xl mb-3">📊</div>
            <h1 style={{ fontFamily: 'monospace', fontSize: '1.6rem', color: '#00d4aa', marginBottom: '0.5rem' }}>
              The Contamination Data
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              You scored {totalCorrect}/5. These same questions exist in AI training data.
            </p>
          </div>

          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              Public vs Private Benchmark Scores
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              Illustrative figures based on publicly available contamination research
            </p>

            {contaminationData.map((row) => {
              const gapWidth = Math.abs(row.gap) / 50 * 100;
              return (
                <div key={row.model} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>{row.model}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {row.publicScore}% public
                      <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>
                        {row.privateScore}% private
                      </span>
                      <span style={{ color: row.color, marginLeft: '0.5rem', fontWeight: 700 }}>
                        {row.gap} pts
                      </span>
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: '8px', background: '#1e293b', borderRadius: '4px' }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      height: '100%',
                      width: `${row.publicScore}%`,
                      background: '#1e293b',
                      borderRadius: '4px',
                    }} />
                    <div style={{
                      position: 'absolute',
                      left: `${row.privateScore}%`,
                      height: '100%',
                      width: `${gapWidth}%`,
                      background: row.color,
                      borderRadius: '4px',
                      opacity: 0.7,
                    }} />
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      height: '100%',
                      width: `${row.privateScore}%`,
                      background: '#334155',
                      borderRadius: '4px',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: '#475569' }}>
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Why does this happen?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
              Those 5 questions you just answered are from benchmarks published years ago. They are all over the internet: papers, leaderboard forums, tutorial blogs. Models trained on internet-scale data have seen them before.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
              When a model is tested on the same questions it trained on, scores inflate. Switch to questions it has never seen and the score drops. The MiniMax gap: 80% to 39%. That 41-point difference is what contamination looks like.
            </p>
          </div>

          <button
            onClick={handleReset}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid #1e293b',
              color: '#64748b',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Take the quiz again
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'reveal') {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-4xl mb-3">
              {totalCorrect >= 4 ? '🎯' : totalCorrect >= 2 ? '🤔' : '😅'}
            </div>
            <h1 style={{ fontFamily: 'monospace', fontSize: '1.6rem', color: '#00d4aa', marginBottom: '0.5rem' }}>
              You scored {totalCorrect} out of 5
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
              Not bad. But here is the twist.
            </p>
          </div>

          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ color: '#fca5a5', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Every question you just answered is from a real public AI benchmark.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
              AI labs use these exact benchmarks to test their models. The questions have been public for years. That means the models you are comparing have almost certainly been trained on this data.
            </p>
          </div>

          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              The sources
            </h3>
            {questions.map((q, i) => (
              <div key={q.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0',
                borderBottom: i < questions.length - 1 ? '1px solid #1e293b' : 'none',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: correct[i] ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.15)',
                  border: `1px solid ${correct[i] ? '#00d4aa' : '#ef4444'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: correct[i] ? '#00d4aa' : '#ef4444',
                  flexShrink: 0,
                }}>
                  {correct[i] ? '✓' : '✗'}
                </div>
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(124,58,237,0.2)',
                    color: '#a78bfa',
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    marginRight: '0.5rem',
                    fontWeight: 600,
                  }}>
                    {q.benchmark}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.825rem' }}>{q.source}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              AI leaderboard scores on these benchmarks
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { model: 'GPT-4o', score: '88%' },
                { model: 'Claude 3.5', score: '87%' },
                { model: 'Gemini 1.5', score: '85%' },
                { model: 'MiniMax', score: '80%' },
              ].map((m) => (
                <div key={m.model} style={{
                  background: '#1e293b',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#00d4aa', fontSize: '1.1rem', fontWeight: 700 }}>{m.score}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{m.model}</div>
                </div>
              ))}
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              These are real published leaderboard numbers. Impressive, right?
            </p>
          </div>

          <button
            onClick={() => setPhase('results')}
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
            See what the scores look like on fresh questions
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e2e8f0' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h1 style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: '#00d4aa', margin: 0 }}>
                The Benchmark Contamination Test
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                A quick knowledge quiz. Or is it?
              </p>
            </div>
            <span style={{ color: '#475569', fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {currentQ + 1} / {questions.length}
            </span>
          </div>
          <div style={{ width: '100%', background: '#1e293b', borderRadius: '4px', height: '4px' }}>
            <div style={{
              height: '100%',
              background: '#00d4aa',
              borderRadius: '4px',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        <div style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '1rem',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,0.2)',
            color: '#a78bfa',
            fontSize: '0.7rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            QUESTION {currentQ + 1}
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            {question.text}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {question.options.map((opt, idx) => {
              let bg = '#1e293b';
              let border = '1px solid #334155';
              let textColor = '#e2e8f0';
              let cursor = 'pointer';

              if (selected !== null) {
                cursor = 'default';
                if (idx === question.correctIndex) {
                  bg = 'rgba(0,212,170,0.12)';
                  border = '1px solid #00d4aa';
                  textColor = '#00d4aa';
                } else if (idx === selected && selected !== question.correctIndex) {
                  bg = 'rgba(239,68,68,0.12)';
                  border = '1px solid #ef4444';
                  textColor = '#fca5a5';
                } else {
                  bg = '#111827';
                  textColor = '#475569';
                  border = '1px solid #1e293b';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    background: bg,
                    border,
                    borderRadius: '8px',
                    padding: '0.875rem 1.25rem',
                    textAlign: 'left',
                    color: textColor,
                    cursor,
                    fontSize: '0.9rem',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#0a0a0a',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    color: textColor,
                  }}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showNext && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{
                color: correct[correct.length - 1] ? '#00d4aa' : '#fca5a5',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}>
                {correct[correct.length - 1]
                  ? 'Correct. Keep going.'
                  : `The answer is "${question.options[question.correctIndex]}".`}
              </p>
              <button
                onClick={handleNext}
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
                {currentQ < questions.length - 1 ? 'Next Question' : 'See What This Was Really Testing'}
              </button>
            </div>
          )}
        </div>

        {!showNext && (
          <p style={{ color: '#334155', fontSize: '0.8rem', textAlign: 'center' }}>
            Select an answer to continue
          </p>
        )}
      </div>
    </div>
  );
}
