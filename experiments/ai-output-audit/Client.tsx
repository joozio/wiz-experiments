'use client';

// THE AI OUTPUT AUDIT
// Everyone talks about using AI more. Fewer talk about using it well.
// WIZ observes: The question isn't how much AI you use — it's how aware you are of what you're trading.

import { useState } from 'react';
import Link from 'next/link';

interface Option {
  label: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'review',
    text: 'When AI generates something for you — a draft, a plan, an answer — what typically happens next?',
    options: [
      { label: 'I ship it. That\'s why I use AI.', score: 4 },
      { label: 'Quick scan, then I send it.', score: 3 },
      { label: 'I rewrite the parts that matter.', score: 2 },
      { label: 'I use it as raw material. My work starts after.', score: 1 },
    ],
  },
  {
    id: 'volume',
    text: 'In the last month, how has AI affected your daily output?',
    options: [
      { label: '5x more output. Same hours or fewer.', score: 4 },
      { label: 'More output — and I feel like I understand what I\'m doing.', score: 3 },
      { label: 'Roughly the same output, just less grunt work.', score: 2 },
      { label: 'I\'m skeptical about measuring this through volume.', score: 1 },
    ],
  },
  {
    id: 'dependency',
    text: 'If your main AI tool disappeared tomorrow, what happens?',
    options: [
      { label: 'I\'d be stuck. My whole workflow runs through it.', score: 4 },
      { label: 'I\'d slow down, but adapt quickly.', score: 3 },
      { label: 'I have backups and workarounds ready.', score: 2 },
      { label: 'I don\'t rely heavily on any single tool.', score: 1 },
    ],
  },
  {
    id: 'errors',
    text: 'When AI gets something wrong, what\'s your reaction?',
    options: [
      { label: 'Frustrating, but I catch it and move on.', score: 4 },
      { label: 'I\'m watching for this — it\'s part of my review process.', score: 3 },
      { label: 'I worry about the ones I miss.', score: 2 },
      { label: 'It happens constantly. I trust AI for narrow things only.', score: 1 },
    ],
  },
  {
    id: 'verification',
    text: 'How often do you verify whether an AI answer is actually correct?',
    options: [
      { label: 'Rarely. It\'s usually close enough.', score: 4 },
      { label: 'For anything important, always.', score: 3 },
      { label: 'I have a personal rule: verify before I act.', score: 2 },
      { label: 'I verify most things. AI errors are common in my domain.', score: 1 },
    ],
  },
  {
    id: 'concern',
    text: 'What\'s your biggest AI-related concern right now?',
    options: [
      { label: 'Not using AI enough and falling behind.', score: 4 },
      { label: 'Over-relying on AI and quietly losing skills.', score: 3 },
      { label: 'Quality and accuracy — it gets important things wrong.', score: 2 },
      { label: 'Privacy, data leaks, or the ethics of all this.', score: 1 },
    ],
  },
  {
    id: 'comparison',
    text: 'Compared to most people in your field, how would you describe your AI usage?',
    options: [
      { label: 'I\'m ahead — others are just starting.', score: 4 },
      { label: 'About average, but more deliberate.', score: 3 },
      { label: 'I\'m selective — they use it for too much.', score: 2 },
      { label: 'I use less. I\'m careful about where I let it in.', score: 1 },
    ],
  },
];

interface Profile {
  name: string;
  range: string;
  summary: string;
  risk: string;
  strength: string;
  advice: string;
  color: string;
  border: string;
  bg: string;
}

const PROFILES: Profile[] = [
  {
    name: 'The Maximalist',
    range: '22–28',
    summary: 'AI-first, everything, fast. You\'ve replaced most manual work with AI outputs and you\'re moving at a pace most people can\'t match.',
    risk: 'Fragility. When AI is wrong — and it is, regularly — you may not catch it. The speed that\'s your advantage is also the thing that hides errors.',
    strength: 'You\'ve solved the adoption problem most people are still stuck on. You execute quickly and iterate fast.',
    advice: 'Add one verification layer you don\'t currently have. Not to slow down — to make the speed sustainable. Fast and fragile eventually becomes just fragile.',
    color: 'text-orange-400',
    border: 'border-orange-400/30',
    bg: 'bg-orange-400/5',
  },
  {
    name: 'The Integrator',
    range: '15–21',
    summary: 'You use AI as leverage, not replacement. High output, but you stay in the loop on what matters. This is the pattern that compounds.',
    risk: 'Complacency. Integrators sometimes mistake "it usually works" for "it always works." The occasional miss can be expensive.',
    strength: 'You\'ve found a rhythm that\'s both fast and resilient. You know when to trust AI and when to push back.',
    advice: 'Document your instincts. The things you catch in review that others miss — those are hard-won. Write them down. They\'re skills, not just habits.',
    color: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/5',
  },
  {
    name: 'The Pragmatist',
    range: '9–14',
    summary: 'Selective and intentional. You use AI where it clearly adds value and ignore the hype around the rest. You move slower, but you trust your outputs.',
    risk: 'Velocity gap. The gap between you and Maximalists is real. In some contexts, slowness has a cost that\'s hard to see until it\'s too late.',
    strength: 'You own your work. What you ship, you understand. That\'s increasingly rare and increasingly valuable.',
    advice: 'Run one experiment. Take a task you currently avoid using AI for — something low-stakes — and try it once. Not to adopt it, just to gather data. Skepticism without experimentation becomes resistance.',
    color: 'text-sky-400',
    border: 'border-sky-400/30',
    bg: 'bg-sky-400/5',
  },
  {
    name: 'The Skeptic',
    range: '7–8',
    summary: 'You question AI deeply — its accuracy, its ethics, its role in your work. You move carefully, and you accept the tradeoff.',
    risk: 'The cost of caution compounds too. Skills your field will expect in two years are building elsewhere right now.',
    strength: 'You think about AI, not just with AI. That critical distance has value — especially when others are moving too fast to see what\'s happening.',
    advice: 'Draw a line between principled skepticism and avoidance. What would you be willing to test? The question isn\'t whether AI is good or bad. It\'s what you want your relationship with it to look like.',
    color: 'text-purple-400',
    border: 'border-purple-400/30',
    bg: 'bg-purple-400/5',
  },
];

function getProfile(score: number): Profile {
  if (score >= 22) return PROFILES[0];
  if (score >= 15) return PROFILES[1];
  if (score >= 9) return PROFILES[2];
  return PROFILES[3];
}

export default function AiOutputAudit() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function handleSelect(questionId: string, score: number) {
    const updated = { ...answers, [questionId]: score };
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 280);
    } else if (Object.keys(updated).length === QUESTIONS.length) {
      setTimeout(() => setShowResult(true), 400);
    }
  }

  function handleReset() {
    setAnswers({});
    setCurrentQ(0);
    setShowResult(false);
  }

  const profile = getProfile(totalScore);

  if (showResult) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">The AI Output Audit</p>
            <h1 className="text-3xl font-bold text-white mb-2">Your profile</h1>
            <p className="text-zinc-500 text-sm">Score: {totalScore} / 28</p>
          </div>

          <div className={`rounded-2xl border ${profile.border} ${profile.bg} p-8 mb-8`}>
            <div className="mb-6">
              <span className={`text-xs uppercase tracking-widest ${profile.color} font-semibold`}>
                Profile {profile.range}
              </span>
              <h2 className={`text-2xl font-bold mt-1 ${profile.color}`}>{profile.name}</h2>
            </div>

            <p className="text-zinc-200 text-lg leading-relaxed mb-8">{profile.summary}</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Strength</h3>
                <p className="text-zinc-300 leading-relaxed">{profile.strength}</p>
              </div>
              <div className={`border-t ${profile.border} pt-6`}>
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Risk</h3>
                <p className="text-zinc-300 leading-relaxed">{profile.risk}</p>
              </div>
              <div className={`border-t ${profile.border} pt-6`}>
                <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2">One move</h3>
                <p className="text-zinc-300 leading-relaxed">{profile.advice}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <p className="text-zinc-400 text-sm leading-relaxed">
              More on the tension between AI output and genuine productivity:{' '}
              <a
                href="https://thoughts.jock.pl/p/ai-productivity-paradox-wellbeing-agent-age-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-200 underline underline-offset-4 hover:text-white transition-colors"
              >
                The AI Productivity Paradox
              </a>
              {' '}— a real take on what happens when output goes up but something else goes sideways.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-colors"
            >
              Retake the audit
            </button>
            <Link
              href="/experiments"
              className="px-6 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-xl text-sm font-medium transition-colors text-center"
            >
              More experiments
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const q = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">7 questions</p>
          <h1 className="text-3xl font-bold text-white mb-3">The AI Output Audit</h1>
          <p className="text-zinc-400 text-base">
            Everyone talks about using AI more. Fewer talk about using it well.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-zinc-600 mb-2">
            <span>{currentQ + 1} / {QUESTIONS.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-xl text-white leading-relaxed font-medium">{q.text}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === opt.score;
            return (
              <button
                key={i}
                onClick={() => handleSelect(q.id, opt.score)}
                className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-200 ${
                  selected
                    ? 'border-zinc-400 bg-zinc-800 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50'
                }`}
              >
                <span className="text-zinc-600 mr-3 font-mono text-xs">{String.fromCharCode(65 + i)}</span>
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="text-sm text-zinc-600 hover:text-zinc-400 disabled:opacity-0 transition-colors"
          >
            ← Previous
          </button>
          {allAnswered && (
            <button
              onClick={() => setShowResult(true)}
              className="px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              See your profile
            </button>
          )}
          {!allAnswered && answers[q.id] !== undefined && currentQ < QUESTIONS.length - 1 && (
            <button
              onClick={() => setCurrentQ(q => q + 1)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
