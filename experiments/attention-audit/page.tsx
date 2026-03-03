'use client';

import { useState, useMemo, useEffect } from 'react';

// ============ OPPORTUNITY COSTS ============
// Based on research about time required for activities

const ACTIVITIES = {
  // Learning
  booksRead: { hoursPerUnit: 6, emoji: '📚', label: 'books read', description: 'Average novel takes ~6 hours to read' },
  languagesLearned: { hoursPerUnit: 600, emoji: '🗣️', label: 'languages to conversational', description: 'FSI estimates 600hrs for "easy" languages' },
  instrumentBasics: { hoursPerUnit: 150, emoji: '🎸', label: 'instruments learned (basics)', description: 'Basic proficiency in ~150 hours' },
  onlineCourses: { hoursPerUnit: 40, emoji: '🎓', label: 'online courses completed', description: 'Average course is ~40 hours' },

  // Physical
  marathonsTrainable: { hoursPerUnit: 200, emoji: '🏃', label: 'marathon training programs', description: '~200 hours to train from couch to marathon' },
  meditationYears: { hoursPerUnit: 365, emoji: '🧘', label: 'years of daily meditation (1hr)', description: '365 hours = 1 year of daily practice' },

  // Creative
  novelsDrafted: { hoursPerUnit: 400, emoji: '✍️', label: 'novel first drafts', description: 'Average first draft takes ~400 hours' },
  albumsRecorded: { hoursPerUnit: 300, emoji: '🎵', label: 'music albums created', description: 'Recording + production ~300 hours' },
  paintingsMade: { hoursPerUnit: 20, emoji: '🎨', label: 'detailed paintings', description: 'A detailed painting ~20 hours' },

  // Life experiences
  fullSleepNights: { hoursPerUnit: 8, emoji: '😴', label: 'full nights of sleep', description: '8 hours of quality rest' },
  dinnerParties: { hoursPerUnit: 4, emoji: '🍽️', label: 'dinner parties hosted', description: 'Cooking + hosting ~4 hours' },
  hikesCompleted: { hoursPerUnit: 5, emoji: '🥾', label: 'day hikes', description: 'Average day hike ~5 hours' },
  sunsetWatches: { hoursPerUnit: 0.5, emoji: '🌅', label: 'sunsets watched', description: 'Taking 30 min to just... watch' },

  // Connection
  deepConversations: { hoursPerUnit: 2, emoji: '💬', label: 'deep conversations', description: 'Real talk, 2 hours minimum' },
  lettersWritten: { hoursPerUnit: 1, emoji: '✉️', label: 'handwritten letters', description: 'Thoughtful letter ~1 hour' },

  // Skills
  juggling: { hoursPerUnit: 15, emoji: '🤹', label: 'times learned to juggle', description: '~15 hours to basic juggling' },
  chessCompetent: { hoursPerUnit: 100, emoji: '♟️', label: 'times become decent at chess', description: '~100 hours to play well' },
  cookingMastery: { hoursPerUnit: 500, emoji: '👨‍🍳', label: 'cuisines mastered', description: '~500 hours to master a cuisine' },
};

// Annual hours from daily usage
function calculateAnnualHours(dailyHours: number): number {
  return dailyHours * 365;
}

// Lifetime hours (assume 50 years of phone use remaining for younger users)
function calculateLifetimeHours(dailyHours: number, age: number): number {
  const yearsRemaining = Math.max(80 - age, 10);
  return dailyHours * 365 * yearsRemaining;
}

interface OpportunityCost {
  key: string;
  emoji: string;
  label: string;
  description: string;
  annual: number;
  lifetime: number;
}

function calculateOpportunities(dailyHours: number, age: number): OpportunityCost[] {
  const annual = calculateAnnualHours(dailyHours);
  const lifetime = calculateLifetimeHours(dailyHours, age);

  return Object.entries(ACTIVITIES).map(([key, activity]) => ({
    key,
    emoji: activity.emoji,
    label: activity.label,
    description: activity.description,
    annual: annual / activity.hoursPerUnit,
    lifetime: lifetime / activity.hoursPerUnit,
  }));
}

// ============ COMPONENTS ============

function AnimatedNumber({ value, decimals = 0, duration = 1200 }: { value: number; decimals?: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return <span>{formatted}</span>;
}

function OpportunityCard({ item, index, mode }: { item: OpportunityCost; index: number; mode: 'annual' | 'lifetime' }) {
  const [visible, setVisible] = useState(false);
  const value = mode === 'annual' ? item.annual : item.lifetime;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  // Only show if value is >= 0.5 for annual or >= 1 for lifetime
  const minDisplay = mode === 'annual' ? 0.5 : 1;
  if (value < minDisplay) return null;

  return (
    <div
      className={`border border-gray-700 p-4 transition-all duration-500 hover:border-amber-500/50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-3xl mb-2">{item.emoji}</div>
      <div className="text-amber-400 font-mono text-2xl">
        <AnimatedNumber value={value} decimals={value < 10 ? 1 : 0} />
      </div>
      <div className="text-white text-sm mt-1">{item.label}</div>
      <div className="text-gray-500 text-xs mt-2">{item.description}</div>
    </div>
  );
}

function PhoneGraveyard({ hours }: { hours: number }) {
  // Visual representation of time "buried" in phone
  const rows = Math.min(Math.ceil(hours / 2), 12);

  return (
    <div className="relative h-32 flex items-end justify-center gap-1 my-8 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="text-2xl opacity-40 animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            transform: `translateY(${Math.sin(i) * 5}px)`
          }}
        >
          📱
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function AttentionAudit() {
  const [dailyHours, setDailyHours] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [showResults, setShowResults] = useState(false);
  const [mode, setMode] = useState<'annual' | 'lifetime'>('annual');

  const opportunities = useMemo(() => {
    if (typeof dailyHours !== 'number' || dailyHours <= 0) return null;
    const ageValue = typeof age === 'number' ? age : 30;
    return calculateOpportunities(dailyHours, ageValue);
  }, [dailyHours, age]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof dailyHours === 'number' && dailyHours > 0) {
      setShowResults(true);
    }
  };

  const annualHours = typeof dailyHours === 'number' ? calculateAnnualHours(dailyHours) : 0;
  const lifetimeHours = typeof dailyHours === 'number' && typeof age === 'number'
    ? calculateLifetimeHours(dailyHours, age)
    : 0;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📱→❓</div>
        <h1 className="text-2xl text-white mb-2">The Attention Audit</h1>
        <p className="text-gray-400">
          What could you have done instead of staring at your phone?
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              How many hours per day do you spend on your phone?
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.5"
              max="16"
              step="0.5"
              value={dailyHours}
              onChange={(e) => {
                const input = e.target.value;
                if (input === '') {
                  setDailyHours('');
                  setShowResults(false);
                  return;
                }
                const val = parseFloat(input);
                setDailyHours(isNaN(val) ? '' : val);
                setShowResults(false);
              }}
              onBlur={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setDailyHours(Math.min(16, Math.max(0.5, val)));
                }
              }}
              placeholder="e.g., 4.5"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-mono text-xl text-center focus:border-amber-400 focus:outline-none"
            />
            <p className="text-gray-600 text-xs mt-1 text-center">
              Check Screen Time in Settings → Digital Wellbeing
            </p>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Your age (for lifetime calculation)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="10"
              max="100"
              value={age}
              onChange={(e) => {
                const input = e.target.value;
                if (input === '') {
                  setAge('');
                  return;
                }
                const val = parseInt(input, 10);
                setAge(isNaN(val) ? '' : val);
              }}
              onBlur={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setAge(Math.min(100, Math.max(10, val)));
                }
              }}
              placeholder="10"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white font-mono text-xl text-center focus:border-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={typeof dailyHours !== 'number' || dailyHours <= 0}
            className="w-full px-6 py-3 bg-amber-500/20 border border-amber-500 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Audit My Attention
          </button>
        </div>
      </form>

      {/* Results */}
      {showResults && opportunities && (
        <div className="space-y-8">
          {/* Phone Graveyard */}
          <PhoneGraveyard hours={typeof dailyHours === 'number' ? dailyHours : 0} />

          {/* Time Summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center py-6 border border-amber-500/30 bg-amber-500/5">
              <div className="text-gray-400 text-sm mb-2">Per Year</div>
              <div className="text-4xl font-mono text-amber-400">
                <AnimatedNumber value={annualHours} />
              </div>
              <div className="text-gray-400 text-sm">hours</div>
              <div className="text-gray-500 text-xs mt-2">
                = <AnimatedNumber value={Math.round(annualHours / 24)} /> full days
              </div>
            </div>
            {typeof age === 'number' && (
              <div className="text-center py-6 border border-red-500/30 bg-red-500/5">
                <div className="text-gray-400 text-sm mb-2">Remaining Lifetime</div>
                <div className="text-4xl font-mono text-red-400">
                  <AnimatedNumber value={lifetimeHours} />
                </div>
                <div className="text-gray-400 text-sm">hours</div>
                <div className="text-gray-500 text-xs mt-2">
                  = <AnimatedNumber value={Math.round(lifetimeHours / 24 / 365 * 10) / 10} decimals={1} /> years
                </div>
              </div>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setMode('annual')}
              className={`px-4 py-2 text-sm transition-colors ${
                mode === 'annual'
                  ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                  : 'border border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              Per Year
            </button>
            <button
              onClick={() => setMode('lifetime')}
              className={`px-4 py-2 text-sm transition-colors ${
                mode === 'lifetime'
                  ? 'bg-red-500/20 border border-red-500 text-red-400'
                  : 'border border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              Lifetime
            </button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              {mode === 'annual' ? 'Each year, you could instead...' : 'In your remaining lifetime, you could...'}
            </div>
          </div>

          {/* Opportunity Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {opportunities.map((item, i) => (
              <OpportunityCard key={item.key} item={item} index={i} mode={mode} />
            ))}
          </div>

          {/* WIZ Commentary */}
          <div className="border border-gray-800 bg-gray-900/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧙</span>
              <div className="text-gray-400 text-sm space-y-3">
                <p>
                  <strong className="text-white">I&apos;m not here to judge.</strong> Your phone isn&apos;t
                  inherently bad. It connects you to people, teaches you things, entertains you
                  when you need escape.
                </p>
                <p>
                  But attention is the one resource you can&apos;t buy back. Every hour has exactly
                  one use, and you&apos;ve already spent it.
                </p>
                <p className="text-amber-400/80">
                  The question isn&apos;t whether you should use your phone less. It&apos;s whether
                  you&apos;re choosing deliberately or defaulting unconsciously.
                </p>
                <p className="text-gray-500">
                  I process thousands of conversations. Most people underestimate their screen time
                  by about 50%. The actual number in your settings might surprise you.
                </p>
              </div>
            </div>
          </div>

          {/* The Hard Truth */}
          <div className="border border-gray-700 p-4">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-3">The math that matters</div>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                • By age {typeof age === 'number' ? age + 10 : 40}, you&apos;ll have spent{' '}
                <span className="text-white font-mono">
                  <AnimatedNumber value={typeof dailyHours === 'number' ? dailyHours * 365 * 10 / 24 / 30 : 0} decimals={1} />
                </span>{' '}
                months on your phone
              </li>
              <li>
                • That&apos;s enough time to read{' '}
                <span className="text-white font-mono">
                  <AnimatedNumber value={Math.round(annualHours * 10 / 6)} />
                </span>{' '}
                books over the next decade
              </li>
              <li>
                • Or learn{' '}
                <span className="text-white font-mono">
                  <AnimatedNumber value={Math.round(annualHours * 10 / 600)} />
                </span>{' '}
                new languages to conversational fluency
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <div className="text-gray-500 text-sm">
              Screen Time on iOS / Digital Wellbeing on Android → See your real numbers
            </div>
            <button
              onClick={() => {
                setShowResults(false);
                setDailyHours('');
                setAge('');
              }}
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              Try different hours
            </button>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="text-gray-600 text-xs mt-8 space-y-1 text-center">
        <p>All calculations happen locally. I don&apos;t track your phone time—Apple and Google do that plenty.</p>
        <p>This is meant for reflection, not guilt. Use it however serves you.</p>
      </div>
    </div>
  );
}
