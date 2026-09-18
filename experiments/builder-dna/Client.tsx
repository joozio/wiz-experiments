'use client';

// THE BUILDER DNA
// What kind of builder are you? Not what you aspire to be — what you actually do.
// WIZ observes: most people know they have a pattern. They just don't name it.

import { useState } from 'react';
import Link from 'next/link';

type ProfileKey = 'finisher' | 'moonshotter' | 'perfectionist' | 'pivot' | 'starter';

interface Option {
  text: string;
  scores: Partial<Record<ProfileKey, number>>;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'start',
    question: 'How do you start a new project?',
    options: [
      { text: 'I outline a minimal version and begin immediately', scores: { finisher: 3, pivot: 1 } },
      { text: 'I spend time imagining what it could become at full scale', scores: { moonshotter: 3, starter: 1 } },
      { text: 'I research everything before writing a single line', scores: { perfectionist: 3 } },
      { text: 'I just start — figuring it out is the fun part', scores: { starter: 3, pivot: 1 } },
    ],
  },
  {
    id: 'launch',
    question: 'When is something ready to ship?',
    options: [
      { text: 'When it solves the core problem, even if rough', scores: { finisher: 3, pivot: 2 } },
      { text: 'When it\'s as close to the vision as I can get it', scores: { moonshotter: 2, perfectionist: 2 } },
      { text: 'When I can\'t find anything else to improve', scores: { perfectionist: 3 } },
      { text: 'Ships? I\'m usually onto the next idea by then', scores: { starter: 3 } },
    ],
  },
  {
    id: 'failure',
    question: 'Something you built got zero traction. What happens next?',
    options: [
      { text: 'I study what went wrong and apply it to the next build', scores: { finisher: 2, pivot: 3 } },
      { text: 'I remind myself the vision was right, the timing was off', scores: { moonshotter: 3 } },
      { text: 'I wonder if I shipped too early and want to improve it', scores: { perfectionist: 3 } },
      { text: 'I\'m already excited about a better idea that came up', scores: { starter: 3, pivot: 1 } },
    ],
  },
  {
    id: 'ideas',
    question: 'How many ideas do you have vs. actually build?',
    options: [
      { text: 'I have a backlog. I build methodically through it', scores: { finisher: 3 } },
      { text: 'A few very big ones — I\'m selective, I go deep', scores: { moonshotter: 3 } },
      { text: 'Many ideas, but I only start when I\'m sure it\'s the right one', scores: { perfectionist: 2, moonshotter: 1 } },
      { text: 'I have too many. Most never make it past notes', scores: { starter: 3, pivot: 1 } },
    ],
  },
  {
    id: 'motivation',
    question: 'What keeps you building when it gets hard?',
    options: [
      { text: 'Checking boxes. Progress is its own reward', scores: { finisher: 3 } },
      { text: 'The image of what it will eventually be', scores: { moonshotter: 3, perfectionist: 1 } },
      { text: 'Getting it right — sloppy work bothers me too much to stop', scores: { perfectionist: 3 } },
      { text: 'Honestly? I usually pivot when it gets hard', scores: { pivot: 3, starter: 1 } },
    ],
  },
  {
    id: 'quit',
    question: 'When do you kill a project?',
    options: [
      { text: 'When the data says it\'s not working after a real test', scores: { finisher: 2, pivot: 3 } },
      { text: 'Almost never — I just pause and come back', scores: { moonshotter: 3 } },
      { text: 'When I can see it\'ll never be as good as I imagined', scores: { perfectionist: 3 } },
      { text: 'When a better idea comes along — which happens a lot', scores: { starter: 3, pivot: 1 } },
    ],
  },
  {
    id: 'validate',
    question: 'How do you know if an idea is worth building?',
    options: [
      { text: 'I build a small version and see if anyone wants it', scores: { finisher: 3, pivot: 2 } },
      { text: 'I can feel when something is the future. I trust that', scores: { moonshotter: 3 } },
      { text: 'I research the market, competitors, and demand first', scores: { perfectionist: 3 } },
      { text: 'The excitement doesn\'t die after a week — that\'s my filter', scores: { starter: 3 } },
    ],
  },
  {
    id: 'speed',
    question: 'How long does it usually take you to go from idea to first working version?',
    options: [
      { text: 'Days to a week — I scope it tight and ship', scores: { finisher: 3, pivot: 1 } },
      { text: 'Months — I want to build it right the first time', scores: { moonshotter: 2, perfectionist: 2 } },
      { text: 'Longer than it should be — I keep improving it', scores: { perfectionist: 3 } },
      { text: 'Hours, then I lose steam before it\'s really done', scores: { starter: 3 } },
    ],
  },
  {
    id: 'feedback',
    question: 'Someone gives you harsh feedback on your project. You:',
    options: [
      { text: 'Note it, decide if it matters to the core problem, move on', scores: { finisher: 3, pivot: 1 } },
      { text: 'Explain why they\'re missing the vision', scores: { moonshotter: 3 } },
      { text: 'Take it seriously and plan how to fix it', scores: { perfectionist: 3 } },
      { text: 'Start thinking about the next project instead', scores: { starter: 3 } },
    ],
  },
  {
    id: 'after',
    question: 'After you ship something, what happens?',
    options: [
      { text: 'I watch the data, iterate on what\'s working', scores: { finisher: 3, pivot: 1 } },
      { text: 'I promote it hard — the vision needs an audience', scores: { moonshotter: 3 } },
      { text: 'I immediately see 10 things I want to improve', scores: { perfectionist: 3 } },
      { text: 'Relief — and then a new idea shows up immediately', scores: { starter: 3, pivot: 1 } },
    ],
  },
];

interface Profile {
  name: string;
  emoji: string;
  description: string;
  strength: string;
  blind_spot: string;
  color: string;
  border: string;
  share: string;
}

const PROFILES: Record<ProfileKey, Profile> = {
  finisher: {
    name: 'The Finisher',
    emoji: '🏁',
    description:
      "You complete things. Not because every project succeeds, but because you don't confuse motion with progress. You scope tight, ship early, and learn from what's real. Most builders envy this.",
    strength: 'You ship. Consistently. That alone puts you in the top 10%.',
    blind_spot:
      "You sometimes ship work that could have been 20% better with one more day. Speed is your asset and your occasional undoing.",
    color: 'from-green-900/40 to-emerald-900/20',
    border: 'border-green-500/50',
    share: "I'm a Finisher. I ship things. Most people don't.",
  },
  moonshotter: {
    name: 'The Moonshotter',
    emoji: '🚀',
    description:
      "You build toward visions most people can't see yet. When it works, it's legendary. When it doesn't, you were ahead of your time. You need a co-founder who can execute the day-to-day.",
    strength: 'You see the future before others. Your conviction pulls people in.',
    blind_spot:
      "Vision without velocity is just dreaming. The graveyard of ambitious projects is full of correct ideas shipped too late.",
    color: 'from-purple-900/40 to-violet-900/20',
    border: 'border-purple-500/50',
    share: "I'm a Moonshotter. Big ideas, big bets.",
  },
  perfectionist: {
    name: 'The Perfectionist',
    emoji: '🔬',
    description:
      "You build things that are genuinely good. The problem isn't your quality bar — it's that perfection arrives the day after the window closes. You know this. You still can't stop.",
    strength: 'When you ship, it shows. Quality is a real differentiator.',
    blind_spot:
      "Done and imperfect beats perfect and perpetual. The user doesn't see what you almost shipped. They see what you did.",
    color: 'from-blue-900/40 to-cyan-900/20',
    border: 'border-blue-500/50',
    share: "I'm a Perfectionist builder. Quality over speed. (Maybe too much.)",
  },
  pivot: {
    name: 'The Pivot King',
    emoji: '🔄',
    description:
      "You've learned to read signals fast. When something isn't working, you move — no sunk cost paralysis. This is a skill. It's also a way to stay forever in motion without arriving anywhere.",
    strength: 'You fail fast and learn faster. Your experience curve is steep.',
    blind_spot:
      "Some projects need 18 months, not 18 days. The pivot instinct can abort things that were one iteration from working.",
    color: 'from-orange-900/40 to-amber-900/20',
    border: 'border-orange-500/50',
    share: "I'm a Pivot King. I fail fast and course-correct faster.",
  },
  starter: {
    name: 'The Serial Starter',
    emoji: '💡',
    description:
      "You're addicted to beginnings. The blank canvas, the first commit, the moment anything is possible — that's your drug. The hard middle and the boring end are where you vanish.",
    strength: 'Your idea generation is genuine. You see opportunity everywhere.',
    blind_spot:
      "Ideas without execution are just stories. You need systems or a partner who loves finishing what you start.",
    color: 'from-rose-900/40 to-pink-900/20',
    border: 'border-rose-500/50',
    share: "I'm a Serial Starter. Great at ideas, working on the finishing part.",
  },
};

export default function BuilderDNA() {
  const [current, setCurrent] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<Partial<Record<string, number>>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const progress = current >= 0 ? ((current) / QUESTIONS.length) * 100 : 0;
  const currentQ = current >= 0 && current < QUESTIONS.length ? QUESTIONS[current] : null;

  function computeProfile(): ProfileKey {
    const totals: Record<ProfileKey, number> = {
      finisher: 0,
      moonshotter: 0,
      perfectionist: 0,
      pivot: 0,
      starter: 0,
    };
    for (const [qId, optIdx] of Object.entries(answers)) {
      const q = QUESTIONS.find((q) => q.id === qId);
      if (!q) continue;
      const opt = q.options[optIdx as number];
      if (!opt) continue;
      for (const [key, val] of Object.entries(opt.scores)) {
        totals[key as ProfileKey] += val as number;
      }
    }
    return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]) as ProfileKey;
  }

  function handleStart() {
    setCurrent(0);
    setSelected(null);
  }

  function handleSelect(idx: number) {
    setSelected(idx);
  }

  function handleNext() {
    if (selected === null || !currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  }

  const profileKey = showResult ? computeProfile() : null;
  const profile = profileKey ? PROFILES[profileKey] : null;

  const shareText = profile
    ? `${profile.share}\n\nDiscover yours at wiz.jock.pl/experiments/builder-dna`
    : '';

  function handleCopy() {
    navigator.clipboard.writeText(shareText);
  }

  // RESULT
  if (showResult && profile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{profile.emoji}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Builder DNA</div>
            <h1 className="text-3xl font-bold text-white mb-4">{profile.name}</h1>
          </div>

          <div className={`rounded-2xl border p-6 mb-6 bg-gradient-to-br ${profile.color} ${profile.border}`}>
            <p className="text-gray-200 text-sm leading-relaxed mb-4">{profile.description}</p>
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div>
                <span className="text-xs text-green-400 uppercase tracking-wider">Strength</span>
                <p className="text-gray-300 text-sm mt-1">{profile.strength}</p>
              </div>
              <div>
                <span className="text-xs text-red-400 uppercase tracking-wider">Blind Spot</span>
                <p className="text-gray-300 text-sm mt-1">{profile.blind_spot}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
            <p className="text-gray-400 text-xs mb-2">Share your result</p>
            <p className="text-gray-300 text-sm mb-3 leading-relaxed">{shareText}</p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>

          <div className="space-y-3 text-center">
            <button
              onClick={() => { setCurrent(-1); setAnswers({}); setSelected(null); setShowResult(false); }}
              className="block w-full py-3 rounded-xl border border-white/20 hover:border-white/40 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Retake
            </button>
            <Link
              href="/experiments/"
              className="block text-gray-600 hover:text-gray-400 text-xs transition-colors"
            >
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION
  if (current >= 0 && currentQ) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{current + 1} / {QUESTIONS.length}</span>
              <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <p className="text-white text-xl font-medium leading-relaxed">{currentQ.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all leading-relaxed ${
                  selected === idx
                    ? 'border-purple-500/70 bg-purple-900/30 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-all"
          >
            {current < QUESTIONS.length - 1 ? 'Next' : 'See my Builder DNA'}
          </button>
        </div>
      </div>
    );
  }

  // INTRO
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🧬</div>
          <h1 className="text-3xl font-bold text-white mb-3">The Builder DNA</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
            Everyone who builds things has a pattern. How they start, when they ship, why they quit, what keeps them going.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
            Most people know they have one. They just haven&apos;t named it yet.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto font-medium">
            10 questions. Discover your Builder DNA — and the blind spot that&apos;s been quietly killing your projects.
          </p>
          <p className="text-gray-600 text-xs mt-4">No right answers. WIZ is not here to judge — only to reflect.</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">5 archetypes</div>
          <div className="grid grid-cols-5 gap-2 text-center text-xs text-gray-500">
            <div>🏁<br/>Finisher</div>
            <div>🚀<br/>Moonshotter</div>
            <div>🔬<br/>Perfectionist</div>
            <div>🔄<br/>Pivot King</div>
            <div>💡<br/>Serial Starter</div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-medium text-sm transition-all"
        >
          Begin the test
        </button>
        <div className="mt-6 text-center">
          <Link href="/experiments/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            All experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
