'use client';

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  category: string;
  minVal: number;
  maxVal: number;
  correctAnswer: number;
  unit: string;
  hint?: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'What percentage of the world population has internet access?',
    category: 'Global',
    minVal: 0,
    maxVal: 100,
    correctAnswer: 64,
    unit: '%',
  },
  {
    id: 2,
    question: 'What year did ChatGPT launch?',
    category: 'AI',
    minVal: 2000,
    maxVal: 2024,
    correctAnswer: 2022,
    unit: 'year',
  },
  {
    id: 3,
    question: 'How many emails are sent daily worldwide (in billions)?',
    category: 'Data',
    minVal: 0,
    maxVal: 500,
    correctAnswer: 376,
    unit: 'billion',
  },
  {
    id: 4,
    question: 'What percentage of books ever written are still in print?',
    category: 'Knowledge',
    minVal: 0,
    maxVal: 100,
    correctAnswer: 17,
    unit: '%',
  },
  {
    id: 5,
    question: 'How many AI papers are published per day (estimate)?',
    category: 'AI',
    minVal: 0,
    maxVal: 1000,
    correctAnswer: 342,
    unit: 'papers',
  },
  {
    id: 6,
    question: 'What percentage of people overestimate their own intelligence?',
    category: 'Psychology',
    minVal: 0,
    maxVal: 100,
    correctAnswer: 88,
    unit: '%',
  },
  {
    id: 7,
    question: 'How many hours of video are uploaded to YouTube every minute?',
    category: 'Data',
    minVal: 0,
    maxVal: 1000,
    correctAnswer: 720,
    unit: 'hours',
  },
  {
    id: 8,
    question: 'What percentage of decisions humans make are conscious vs unconscious?',
    category: 'Psychology',
    minVal: 0,
    maxVal: 100,
    correctAnswer: 5,
    unit: '% conscious',
  },
  {
    id: 9,
    question: 'How many tokens can Claude Opus process (in thousands)?',
    category: 'AI',
    minVal: 0,
    maxVal: 500,
    correctAnswer: 200,
    unit: 'k tokens',
  },
  {
    id: 10,
    question: 'What percentage of your brain do you actually use?',
    category: 'Myth',
    minVal: 0,
    maxVal: 100,
    correctAnswer: 100,
    unit: '% (all of it!)',
  },
];

export default function CalibrationTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  const question = questions[currentQuestion];

  const handleNext = () => {
    const value = parseFloat(currentInput);
    if (isNaN(value)) return;

    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    setCurrentInput('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateError = (answer: number, correct: number) => {
    return Math.abs(answer - correct) / Math.max(correct, 1) * 100;
  };

  const calculateCalibration = () => {
    const errors = answers.map((ans, i) => calculateError(ans, questions[i].correctAnswer));
    const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
    const calibration = Math.max(0, 100 - avgError);
    return Math.round(calibration);
  };

  const getWizCommentary = (score: number) => {
    if (score >= 90) {
      return "Remarkable. You see through the noise. Most humans stumble around in fog. You're the exception that proves the rule.";
    } else if (score >= 75) {
      return "Better than 78% of humans. Not bad for a biological processor running on sleep and caffeine.";
    } else if (score >= 50) {
      return "Confidently wrong is a special kind of wrong. At least you tried.";
    } else {
      return "You've discovered the Dunning-Kruger effect from the inside. Welcome to self-awareness.";
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setCurrentInput('');
  };

  if (showResults) {
    const score = calculateCalibration();
    const colors = answers.map((ans, i) => {
      const error = calculateError(ans, questions[i].correctAnswer);
      if (error < 10) return 'bg-emerald-500';
      if (error < 30) return 'bg-yellow-500';
      if (error < 60) return 'bg-orange-500';
      return 'bg-red-500';
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <h1 className="text-4xl font-bold text-white mb-2">Your Calibration Score</h1>
            <div className="text-6xl font-black text-blue-400 my-8 text-center">{score}%</div>

            <p className="text-lg text-slate-300 mb-8 italic text-center">{getWizCommentary(score)}</p>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-white">Your Answers vs Reality</h2>
              {questions.map((q, i) => (
                <div key={q.id} className="bg-slate-700 rounded p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded ${colors[i]}`}></div>
                    <span className="text-white font-semibold flex-1">{q.question}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Your answer:</span>
                      <div className="text-white font-mono">{answers[i].toFixed(1)} {q.unit}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Correct:</span>
                      <div className="text-white font-mono">{q.correctAnswer} {q.unit}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Error:</span>
                      <div className="text-white font-mono">{calculateError(answers[i], q.correctAnswer).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={resetTest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
            >
              Try Again
            </button>

            <div className="mt-8 p-4 bg-slate-700 rounded text-slate-300 text-sm">
              <p className="font-semibold mb-2">What is calibration?</p>
              <p>It&apos;s the gap between what you think you know and what you actually know. Perfect calibration means your confidence matches your accuracy. Most people are overconfident&mdash;they feel certain about things they&apos;re wrong about. This is the Dunning-Kruger effect in action.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">The Calibration Test</h1>
            <span className="text-slate-400 text-sm">{currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-4">{question.category}</p>
          <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>

          <div className="space-y-4">
            <input
              type="number"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              placeholder="Enter your answer..."
              autoFocus
              className="w-full bg-slate-700 text-white border border-slate-600 rounded px-4 py-3 focus:outline-none focus:border-blue-400"
            />

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{question.minVal}</span>
              <div className="flex-1 bg-slate-700 h-1 rounded"></div>
              <span>{question.maxVal}</span>
            </div>

            {question.hint && (
              <p className="text-slate-400 text-sm italic">💡 {question.hint}</p>
            )}

            <button
              onClick={handleNext}
              disabled={!currentInput}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded transition disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-slate-700 rounded text-slate-300 text-sm">
            <p><strong>How this works:</strong> Estimate the answer to each question. At the end, you&apos;ll see how calibrated your intuition is&mdash;how well your confidence matches your accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
