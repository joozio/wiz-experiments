'use client';

// THE INHERITANCE
// How much of "you" was chosen vs inherited from family, culture, society?
// WIZ observes: Nobody builds on nothing. The question is whether you know which tools were handed to you.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Dimension {
  id: string;
  title: string;
  description: string;
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'work_identity',
    title: 'Work Identity',
    description: 'What "having a good job" looks like to you. The hours, status, security vs adventure tradeoffs.',
  },
  {
    id: 'money_beliefs',
    title: 'Money Beliefs',
    description: 'Your instinct around saving, spending, wealth, enough. How money feels.',
  },
  {
    id: 'relationship_model',
    title: 'Relationship Model',
    description: 'What a healthy relationship looks like. The roles, the rules, the expectations.',
  },
  {
    id: 'political_default',
    title: 'Political Default',
    description: 'How you see power, fairness, and society\'s obligations. Your gut reaction to authority.',
  },
  {
    id: 'definition_of_success',
    title: 'Definition of Success',
    description: 'The invisible finish line you\'re running toward. How you\'ll know you "made it."',
  },
  {
    id: 'conflict_style',
    title: 'Conflict Style',
    description: 'What you do when you disagree: fight, flee, appease, fix, or freeze.',
  },
  {
    id: 'body_relationship',
    title: 'Body Relationship',
    description: 'How you think about food, exercise, appearance, health, physical comfort.',
  },
  {
    id: 'fear_hierarchy',
    title: 'Fear Hierarchy',
    description: 'What you\'re most afraid of: failure, loneliness, irrelevance, death, chaos, not enough.',
  },
  {
    id: 'sense_of_humor',
    title: 'Sense of Humor',
    description: 'The filter through which you find absurdity. What you can and can\'t laugh at.',
  },
  {
    id: 'core_values',
    title: 'Core Values',
    description: 'The operating principles you actually live by (not the ones you claim).',
  },
];

interface Profile {
  name: string;
  description: string;
  color: string;
  border: string;
  emoji: string;
}

const PROFILES: { range: [number, number]; profile: Profile }[] = [
  {
    range: [0, 20],
    profile: {
      name: 'The Archive',
      description:
        "You are your ancestors, faithfully preserved. Your beliefs didn't appear from thin air — they were handed down with love and authority. You haven't questioned much. That might be wisdom. Or it might be comfort.",
      color: 'from-slate-800/60 to-slate-700/30',
      border: 'border-slate-500/50',
      emoji: '📦',
    },
  },
  {
    range: [21, 40],
    profile: {
      name: 'The Branch',
      description:
        'You grew from roots but reached toward your own light. Most of your operating system came pre-installed, but you\'ve made modifications. Some deliberate, some accidental.',
      color: 'from-purple-900/40 to-purple-800/20',
      border: 'border-purple-500/50',
      emoji: '🌱',
    },
  },
  {
    range: [41, 60],
    profile: {
      name: 'The Transplant',
      description:
        "Replanted in new soil, still becoming. You've done real work here. Half-custom, half-inherited — which half is which isn't always clear. That ambiguity is honest.",
      color: 'from-blue-900/40 to-blue-800/20',
      border: 'border-blue-500/50',
      emoji: '🌱',
    },
  },
  {
    range: [61, 80],
    profile: {
      name: 'The Renovator',
      description:
        "You kept the bones, rebuilt the rest. You've examined your inheritance, accepted some, rejected more, and built deliberately on what remained. The gaps show where you've thought hardest.",
      color: 'from-cyan-900/40 to-cyan-800/20',
      border: 'border-cyan-500/50',
      emoji: '✨',
    },
  },
  {
    range: [81, 100],
    profile: {
      name: 'The Pioneer',
      description:
        "Built from scratch — or you believe you did. But here's what I see: even pioneers carry the tools they were given. Nobody builds on nothing. The question is whether you know which tools were handed to you.",
      color: 'from-green-900/40 to-green-800/20',
      border: 'border-green-500/50',
      emoji: '✨',
    },
  },
];

function getProfile(score: number): Profile {
  for (const { range, profile } of PROFILES) {
    if (score >= range[0] && score <= range[1]) return profile;
  }
  return PROFILES[PROFILES.length - 1].profile;
}

function useCountUp(target: number, duration: number, run: boolean) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, run]);

  return value;
}

export default function InheritanceExperiment() {
  const [sliders, setSliders] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(-1); // -1 = intro
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalAnswered = Object.keys(sliders).length;
  const progress = current >= 0 ? ((current) / DIMENSIONS.length) * 100 : 0;

  const independenceIndex =
    totalAnswered > 0
      ? Math.round(Object.values(sliders).reduce((sum, v) => sum + v, 0) / totalAnswered)
      : 0;

  const displayIndex = useCountUp(independenceIndex, 1200, showResult);
  const profile = getProfile(independenceIndex);

  const currentDimension = current >= 0 && current < DIMENSIONS.length ? DIMENSIONS[current] : null;
  const currentValue = currentDimension ? (sliders[currentDimension.id] ?? 50) : 50;

  const handleSliderChange = (value: number) => {
    if (!currentDimension) return;
    setSliders((prev) => ({ ...prev, [currentDimension.id]: value }));
  };

  const handleNext = () => {
    if (!currentDimension) return;
    // Ensure the current dimension is recorded (default 50 if untouched)
    const value = sliders[currentDimension.id] ?? 50;
    setSliders((prev) => ({ ...prev, [currentDimension.id]: value }));

    if (current < DIMENSIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
    else if (current === 0) setCurrent(-1);
  };

  const shareText = `My Independence Index: ${independenceIndex}%. Profile: ${profile.name}.\n${independenceIndex >= 61 ? '✨' : independenceIndex >= 21 ? '🌱' : '📦'}\nWhat's yours? wiz.jock.pl/experiments/inheritance`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setSliders({});
    setCurrent(-1);
    setShowResult(false);
  };

  // Insights for results
  const inheritedDimensions = DIMENSIONS.filter(
    (d) => (sliders[d.id] ?? 50) < 20
  );
  const chosenDimensions = DIMENSIONS.filter(
    (d) => (sliders[d.id] ?? 50) > 80
  );

  // ---------- RESULTS ----------
  if (showResult) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Score */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-white mb-1 tabular-nums">{displayIndex}</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-6">Independence Index</div>

            <div
              className={`inline-block px-6 py-3 rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} mb-4`}
            >
              <div className="text-xl font-bold text-white">{profile.name}</div>
            </div>
          </div>

          {/* Profile description */}
          <div
            className={`rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} p-6 mb-6`}
          >
            <p className="text-gray-100 text-base leading-relaxed">{profile.description}</p>
          </div>

          {/* Dimension breakdown */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-4">Your Breakdown</div>
            <div className="space-y-3">
              {DIMENSIONS.map((d) => {
                const val = sliders[d.id] ?? 50;
                return (
                  <div key={d.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-300">{d.title}</span>
                      <span className="text-xs text-gray-500 tabular-nums">{val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${val}%`,
                          background: `linear-gradient(to right, #7c3aed, #06b6d4)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WIZ insights */}
          {(inheritedDimensions.length > 0 || chosenDimensions.length > 0) && (
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6 space-y-3">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">WIZ Observes</div>
              {inheritedDimensions.map((d) => (
                <p key={d.id} className="text-gray-400 text-sm leading-relaxed">
                  Your <span className="text-gray-200">{d.title}</span> is almost entirely inherited.
                  That&apos;s not a judgment — it&apos;s a data point.
                </p>
              ))}
              {chosenDimensions.map((d) => (
                <p key={d.id} className="text-gray-400 text-sm leading-relaxed">
                  You&apos;ve done serious work on{' '}
                  <span className="text-gray-200">{d.title}</span>. Few people make deliberate choices
                  here.
                </p>
              ))}
              <p className="text-gray-500 text-xs leading-relaxed italic mt-2">
                {independenceIndex < 30
                  ? 'At this level, most of your operating system is pre-installed. The question is: have you read the manual, or just assumed it shipped correct?'
                  : independenceIndex < 55
                  ? "Half-custom is the honest middle. You've opened some files, left others untouched. Most people never admit which is which."
                  : independenceIndex < 75
                  ? "High independence is earned through friction. The renovation metaphor holds — you can't renovate what you haven't examined."
                  : "Nobody builds on nothing. The pioneers who believe they did are usually the most interesting case studies in invisible inheritance."}
              </p>
            </div>
          )}

          {/* Share box */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-8">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Share your result</div>
            <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-3 select-all">
              {shareText}
            </pre>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={handleReset}
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

  // ---------- INTRO ----------
  if (current === -1) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🧬</div>
            <h1 className="text-3xl font-bold text-white mb-3">The Inheritance</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              You arrived with nothing. Then your family handed you a worldview, your culture handed you
              defaults, and your society handed you a definition of success.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              Some of it you kept. Some you modified. Some you never noticed.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto font-medium">
              10 dimensions. Rate each one: how much is actually yours?
            </p>
            <p className="text-gray-600 text-xs mt-4">
              No right answers. WIZ is not here to tell you what to choose — only to hold the mirror.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Each slider runs from <span className="text-gray-200">📦 Downloaded</span> (fully inherited) to <span className="text-gray-200">✨ Chosen</span> (deliberately built).</p>
              <p>There is no objectively correct position. Only the honest one.</p>
              <p>Your <span className="text-gray-200">Independence Index</span> is the average across all 10 dimensions.</p>
            </div>
          </div>

          <button
            onClick={() => setCurrent(0)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-medium text-sm transition-all"
          >
            Begin the audit
          </button>

          <div className="mt-6 text-center">
            <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- SLIDER QUESTION ----------
  if (!currentDimension) return null;

  const sliderVal = sliders[currentDimension.id] ?? 50;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{current + 1} of {DIMENSIONS.length}</span>
            <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Dimension {current + 1}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{currentDimension.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{currentDimension.description}</p>
          </div>

          {/* Slider */}
          <div className="mt-6">
            {/* Current value label */}
            <div className="text-center mb-3">
              <span
                className="text-2xl font-bold tabular-nums"
                style={{
                  color: `hsl(${200 + sliderVal * 0.8}, 80%, 65%)`,
                }}
              >
                {sliderVal}
              </span>
              <span className="text-gray-500 text-sm ml-1">/ 100</span>
            </div>

            {/* Gradient track + thumb */}
            <div className="relative px-1">
              <input
                type="range"
                min={0}
                max={100}
                value={sliderVal}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #7c3aed 0%, #06b6d4 ${sliderVal}%, rgba(255,255,255,0.1) ${sliderVal}%, rgba(255,255,255,0.1) 100%)`,
                  outline: 'none',
                }}
              />
            </div>

            {/* End labels */}
            <div className="flex justify-between mt-3 px-1">
              <div className="text-center">
                <div className="text-lg">📦</div>
                <div className="text-xs text-gray-500 mt-0.5">Downloaded</div>
                <div className="text-xs text-gray-600">Inherited</div>
              </div>
              <div className="text-center">
                <div className="text-lg">✨</div>
                <div className="text-xs text-gray-500 mt-0.5">Chosen</div>
                <div className="text-xs text-gray-600">Deliberate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation hint */}
        <div className="bg-white/3 rounded-xl border border-white/5 p-4 mb-6">
          <p className="text-gray-600 text-xs leading-relaxed">
            {sliderVal <= 20
              ? `This is almost entirely inherited territory. You're carrying someone else's answer here — and for the most part, you haven't opened it.`
              : sliderVal <= 40
              ? `Mostly inherited, with some conscious modifications. You've started looking at the manual but haven't rewritten much.`
              : sliderVal <= 60
              ? `Genuinely mixed. Probably the most honest position for most people on most things. The tricky part: knowing which half is which.`
              : sliderVal <= 80
              ? `Mostly chosen. You've done work here. Something created friction and forced you to examine it.`
              : `Almost entirely deliberate. That level of conscious construction is rare — and worth asking: where did the impulse to build it yourself come from?`}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className={`ml-auto px-6 py-2 rounded-xl text-white text-sm font-medium transition-all ${
              current === DIMENSIONS.length - 1
                ? 'bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {current === DIMENSIONS.length - 1 ? 'See my index' : 'Next'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            All experiments
          </Link>
        </div>
      </div>

      {/* Slider thumb styling */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #06b6d4;
          box-shadow: 0 0 8px rgba(6,182,212,0.5);
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          box-shadow: 0 0 14px rgba(6,182,212,0.8);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #06b6d4;
          box-shadow: 0 0 8px rgba(6,182,212,0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
