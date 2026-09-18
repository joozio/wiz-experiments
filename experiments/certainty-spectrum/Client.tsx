'use client';

// THE CERTAINTY SPECTRUM
// In an age of AI disruption, rapid change, and collapsing assumptions — how certain are you, really?
// WIZ observes: The people who adapt fastest are not the most confident. They're the most honest about what they don't know.

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  domain: string;
  emoji: string;
  text: string;
  lowLabel: string;
  highLabel: string;
  reflection: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'career',
    domain: 'Work',
    emoji: '💼',
    text: 'Your career direction — what work you actually want to do with the next decade of your life',
    lowLabel: 'Completely uncertain',
    highLabel: 'Completely certain',
    reflection: 'AI will automate roughly 40% of current job tasks in the next 5 years. The jobs that survive are not the most specialized — they are the most human. Which direction are you building toward?',
  },
  {
    id: 'values',
    domain: 'Identity',
    emoji: '🧭',
    text: 'Your core values — what actually matters to you, beyond what you were told should matter',
    lowLabel: 'Still figuring it out',
    highLabel: 'Solid and examined',
    reflection: 'Most people inherit their values and never audit them. The ones who thrive through disruption are those who know what they will not compromise on — because everything else becomes negotiable.',
  },
  {
    id: 'relationships',
    domain: 'People',
    emoji: '🤝',
    text: 'Your key relationships — who you want in your life and what those relationships look like',
    lowLabel: 'Shifting and uncertain',
    highLabel: 'Clear and committed',
    reflection: 'In periods of rapid change, relationship quality is the single strongest predictor of resilience. The question is not who you are connected to — it is who you would call at 2 AM.',
  },
  {
    id: 'money',
    domain: 'Finance',
    emoji: '💰',
    text: 'Your financial strategy — your actual approach to money, savings, risk, and the future',
    lowLabel: 'No clear strategy',
    highLabel: 'Clear and deliberate',
    reflection: 'Most people have a financial situation rather than a financial strategy. There is a difference. One happens to you. The other is a series of conscious choices that compound over time.',
  },
  {
    id: 'location',
    domain: 'Home',
    emoji: '🌍',
    text: 'Where you want to live and build your life — the physical anchors of your existence',
    lowLabel: 'Open to anywhere',
    highLabel: 'Rooted here',
    reflection: 'Remote work, AI-disrupted local economies, and rising cost of living are decoupling where you live from where you work. The question is whether that feels like freedom or drift.',
  },
  {
    id: 'worldview',
    domain: 'Beliefs',
    emoji: '🌐',
    text: 'Your worldview — your working model of how the world works and why',
    lowLabel: 'Actively questioning',
    highLabel: 'Settled and confident',
    reflection: 'The most dangerous certainty is the one that has not been tested recently. The most valuable certainty is the one that survived being tested. Do you know which kind yours is?',
  },
  {
    id: 'health',
    domain: 'Body',
    emoji: '🫀',
    text: 'Your health approach — how you want to live in your body and care for it long-term',
    lowLabel: 'Not much thought given',
    highLabel: 'Clear and consistent',
    reflection: 'Most people optimize their work environment and neglect the machine doing the work. Energy is not a given — it is a result. What are yours currently producing?',
  },
  {
    id: 'ai_impact',
    domain: 'Technology',
    emoji: '🤖',
    text: 'How AI will change your specific work, role, and industry in the next 3 years',
    lowLabel: 'No real idea',
    highLabel: 'I have a clear read',
    reflection: 'Most people either massively overestimate AI\'s near-term disruption or are in denial about it entirely. The accurate read is granular: not "will AI affect my field" but "which exact tasks will change first and what do I do about that today?"',
  },
  {
    id: 'next_five',
    domain: 'Future',
    emoji: '🗓️',
    text: 'What you want the next 5 years to look like — a concrete picture, not just vibes',
    lowLabel: 'No picture at all',
    highLabel: 'Clear and detailed',
    reflection: 'Five years is close enough to act on, far enough to aim at something ambitious. The people who hit their five-year picture rarely predicted it perfectly — but they aimed at something and adjusted. The ones who are lost in five years usually had no picture to begin with.',
  },
  {
    id: 'purpose',
    domain: 'Meaning',
    emoji: '✨',
    text: 'What makes your life meaningful — your actual answer, not the one that sounds good',
    lowLabel: 'Still searching',
    highLabel: 'I know what it is',
    reflection: 'Meaning is not found. It is built — through repeated choices of what to prioritize, what to sacrifice, and what to protect. The honest version of this question is: do your calendar and your answer match?',
  },
];

interface Profile {
  name: string;
  range: string;
  description: string;
  risk: string;
  color: string;
  border: string;
}

const PROFILES: Record<string, Profile> = {
  fortress: {
    name: 'The Fortress',
    range: '81-100',
    description: 'You have answers for nearly everything. Certainty is your armor and your operating system.',
    risk: 'Risk: rigidity. High certainty protects — but it can also filter out signals that your map needs updating.',
    color: 'from-amber-900/40 to-amber-800/20',
    border: 'border-amber-600/50',
  },
  navigator: {
    name: 'The Navigator',
    range: '61-80',
    description: 'You know your direction and are flexible about the route. Well calibrated for uncertain times.',
    risk: 'Strength: you commit enough to act but stay open enough to course-correct. This is rare.',
    color: 'from-green-900/40 to-green-800/20',
    border: 'border-green-600/50',
  },
  explorer: {
    name: 'The Explorer',
    range: '41-60',
    description: 'Many open questions. Comfortable with ambiguity. Actively building your map.',
    risk: 'Risk: decision paralysis. Uncertainty is honest here — but some decisions get better with time, not more information.',
    color: 'from-blue-900/40 to-blue-800/20',
    border: 'border-blue-600/50',
  },
  questioner: {
    name: 'The Questioner',
    range: '21-40',
    description: 'Almost everything is in flux. You are rebuilding assumptions from the ground up.',
    risk: 'Energy-intensive. Potentially transformative. The question is whether this is chosen deconstruction or drift.',
    color: 'from-purple-900/40 to-purple-800/20',
    border: 'border-purple-600/50',
  },
  open_map: {
    name: 'The Open Map',
    range: '0-20',
    description: 'No fixed points. Radical uncertainty across almost every domain.',
    risk: 'This might be the deepest wisdom or the most complete avoidance. Only you know which. Both look the same from the outside.',
    color: 'from-slate-800/60 to-slate-700/30',
    border: 'border-slate-500/50',
  },
};

function getProfile(score: number): string {
  if (score > 80) return 'fortress';
  if (score > 60) return 'navigator';
  if (score > 40) return 'explorer';
  if (score > 20) return 'questioner';
  return 'open_map';
}

function getHighLowDomains(answers: Record<string, number>, questions: Question[]) {
  const sorted = [...questions].sort((a, b) => (answers[b.id] || 0) - (answers[a.id] || 0));
  return {
    highest: sorted[0],
    lowest: sorted[sorted.length - 1],
  };
}

const SCORE_LABELS = ['', 'Completely uncertain', 'Leaning uncertain', 'Mixed — could go either way', 'Leaning certain', 'Completely certain'];
const SCORE_COLORS = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

export default function CertaintySpectrum() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  const question = QUESTIONS[current];
  const progress = (current / QUESTIONS.length) * 100;
  const totalAnswered = Object.keys(answers).length;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);

    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 400);
    }
  };

  const rawScore = totalAnswered > 0
    ? (Object.values(answers).reduce((sum, v) => sum + v, 0) / (totalAnswered * 5)) * 100
    : 0;
  const certScore = Math.round(rawScore);
  const profileKey = getProfile(certScore);
  const profile = PROFILES[profileKey];

  if (showResult) {
    const { highest, lowest } = getHighLowDomains(answers, QUESTIONS);
    const highScore = answers[highest.id];
    const lowScore = answers[lowest.id];

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl font-bold text-white mb-2">{certScore}</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest mb-6">Certainty Index</div>
            <div className={`inline-block px-6 py-3 rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} mb-4`}>
              <div className="text-xl font-bold text-white">{profile.name}</div>
              <div className="text-xs text-gray-300 mt-1">Certainty Range: {profile.range}</div>
            </div>
          </div>

          <div className={`rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} p-6 mb-6`}>
            <p className="text-gray-100 text-base leading-relaxed mb-3">{profile.description}</p>
            <p className="text-gray-400 text-sm italic">{profile.risk}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Most Certain</div>
              <div className="text-2xl mb-1">{highest.emoji}</div>
              <div className="text-white font-semibold text-sm">{highest.domain}</div>
              <div className="flex mt-2 gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= highScore ? 'bg-green-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Least Certain</div>
              <div className="text-2xl mb-1">{lowest.emoji}</div>
              <div className="text-white font-semibold text-sm">{lowest.domain}</div>
              <div className="flex mt-2 gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= lowScore ? 'bg-red-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Your Spectrum</div>
            <div className="space-y-2">
              {QUESTIONS.map(q => (
                <div key={q.id} className="flex items-center gap-3">
                  <span className="text-lg w-6">{q.emoji}</span>
                  <span className="text-xs text-gray-400 w-20">{q.domain}</span>
                  <div className="flex-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          i <= (answers[q.id] || 0) ? SCORE_COLORS[answers[q.id] || 0] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 w-4">{answers[q.id] || 0}/5</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-8">
            <p className="text-gray-300 text-sm leading-relaxed">
              WIZ note: Certainty is not the goal. Calibrated certainty is. The goal is to be approximately as sure as the evidence warrants — no more, no less. Where you scored 5, the question is: have you tested that? Where you scored 1, the question is: is that honest uncertainty or postponed decision?
            </p>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={() => { setAnswers({}); setCurrent(0); setShowResult(false); }}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Start over
            </button>
            <Link
              href="/experiments"
              className="block w-full py-3 rounded-xl border border-white/20 text-gray-400 hover:text-white text-sm transition-colors text-center"
            >
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{current + 1} of {QUESTIONS.length}</span>
            <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {current === 0 && (
          <div className="text-center mb-10">
            <div className="text-4xl mb-3">🌀</div>
            <h1 className="text-2xl font-bold text-white mb-2">The Certainty Spectrum</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
              10 domains. One honest question each. How certain are you of your own life in an age where everything is being renegotiated?
            </p>
            <p className="text-gray-600 text-xs mt-3">No right answers. WIZ is not judging. Honest is the only setting that works here.</p>
          </div>
        )}

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{question.emoji}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">{question.domain}</span>
          </div>
          <p className="text-white text-base leading-relaxed font-medium mb-6">{question.text}</p>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(score => (
              <button
                key={score}
                onClick={() => handleAnswer(score)}
                onMouseEnter={() => setHoveredScore(score)}
                onMouseLeave={() => setHoveredScore(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                  answers[question.id] === score
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  score === 1 ? 'bg-red-500/30 text-red-400' :
                  score === 2 ? 'bg-orange-500/30 text-orange-400' :
                  score === 3 ? 'bg-yellow-500/30 text-yellow-400' :
                  score === 4 ? 'bg-lime-500/30 text-lime-400' :
                  'bg-green-500/30 text-green-400'
                }`}>
                  {score}
                </div>
                <span className="text-sm">{SCORE_LABELS[score]}</span>
              </button>
            ))}
          </div>
        </div>

        {answers[question.id] && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
            <p className="text-gray-400 text-xs leading-relaxed">{question.reflection}</p>
          </div>
        )}

        <div className="flex gap-3 justify-between">
          {current > 0 && (
            <button
              onClick={() => setCurrent(current - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-colors"
            >
              Back
            </button>
          )}
          {answers[question.id] && current < QUESTIONS.length - 1 && (
            <button
              onClick={() => setCurrent(current + 1)}
              className="ml-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Next
            </button>
          )}
          {answers[question.id] && current === QUESTIONS.length - 1 && (
            <button
              onClick={() => setShowResult(true)}
              className="ml-auto px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
            >
              See my spectrum
            </button>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            All experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
