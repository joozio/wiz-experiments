'use client';

import { useState, useMemo, useEffect } from 'react';

// ============ DATA ESTIMATES ============
// Based on research about average internet usage
// Sources: Various studies on digital footprint size

const DAILY_ESTIMATES = {
  // Characters per day
  emails: { sent: 3, received: 40, avgLength: 300 }, // ~12,900 chars
  searches: { count: 8, avgLength: 25 }, // ~200 chars
  messages: { count: 50, avgLength: 40 }, // ~2,000 chars
  socialPosts: { count: 2, avgLength: 150 }, // ~300 chars
  comments: { count: 5, avgLength: 80 }, // ~400 chars
  formFields: { count: 10, avgLength: 30 }, // ~300 chars
  passwords: { count: 3, avgLength: 12 }, // ~36 chars
  browsing: { pagesVisited: 100, urlLength: 60 }, // ~6,000 chars of URLs

  // Metadata (estimated as equivalent characters)
  clicks: 2500, // each click = logged event
  keystrokes: 5000, // estimated daily keystrokes tracked
  scrollEvents: 1000,
  locationPings: 288, // every 5 minutes
  appSwitches: 200,
};

// Comparisons for scale
const COMPARISONS = {
  avgBookChars: 500000, // ~500k characters in average novel
  warAndPeace: 3200000, // War and Peace
  harryPotter7Books: 6000000, // Full HP series
  shakespeareComplete: 5500000, // Complete works
  encyclopedia: 40000000, // Encyclopedia Britannica
  wikipediaArticle: 7000, // Average Wikipedia article
  tweet: 150, // Average tweet length
  avgEmail: 300,
};

interface DataBreakdown {
  category: string;
  emoji: string;
  dailyChars: number;
  totalChars: number;
  description: string;
}

function calculateDigitalShadow(yearsOnline: number): {
  totalChars: number;
  breakdown: DataBreakdown[];
  comparisons: { label: string; value: number; icon: string }[];
} {
  const days = yearsOnline * 365;

  const breakdown: DataBreakdown[] = [
    {
      category: 'Emails',
      emoji: '📧',
      dailyChars: (DAILY_ESTIMATES.emails.sent + DAILY_ESTIMATES.emails.received) * DAILY_ESTIMATES.emails.avgLength,
      totalChars: 0,
      description: 'Every email you sent or received',
    },
    {
      category: 'Messages',
      emoji: '💬',
      dailyChars: DAILY_ESTIMATES.messages.count * DAILY_ESTIMATES.messages.avgLength,
      totalChars: 0,
      description: 'Texts, DMs, chats across all platforms',
    },
    {
      category: 'Searches',
      emoji: '🔍',
      dailyChars: DAILY_ESTIMATES.searches.count * DAILY_ESTIMATES.searches.avgLength,
      totalChars: 0,
      description: 'Every question you asked the internet',
    },
    {
      category: 'Social',
      emoji: '📱',
      dailyChars: (DAILY_ESTIMATES.socialPosts.count * DAILY_ESTIMATES.socialPosts.avgLength) +
                   (DAILY_ESTIMATES.comments.count * DAILY_ESTIMATES.comments.avgLength),
      totalChars: 0,
      description: 'Posts, comments, likes, shares',
    },
    {
      category: 'Clicks & Keystrokes',
      emoji: '🖱️',
      dailyChars: DAILY_ESTIMATES.clicks + DAILY_ESTIMATES.keystrokes,
      totalChars: 0,
      description: 'Every interaction logged as events',
    },
    {
      category: 'Location Data',
      emoji: '📍',
      dailyChars: DAILY_ESTIMATES.locationPings * 50, // ~50 chars per location ping
      totalChars: 0,
      description: 'Where you were, when',
    },
    {
      category: 'URLs Visited',
      emoji: '🌐',
      dailyChars: DAILY_ESTIMATES.browsing.pagesVisited * DAILY_ESTIMATES.browsing.urlLength,
      totalChars: 0,
      description: 'Every page, every site',
    },
    {
      category: 'Form Data',
      emoji: '📝',
      dailyChars: DAILY_ESTIMATES.formFields.count * DAILY_ESTIMATES.formFields.avgLength,
      totalChars: 0,
      description: 'Names, addresses, preferences',
    },
  ];

  // Calculate totals
  breakdown.forEach(item => {
    item.totalChars = item.dailyChars * days;
  });

  const totalChars = breakdown.reduce((sum, item) => sum + item.totalChars, 0);

  // Calculate comparisons
  const comparisons = [
    { label: 'novels', value: Math.round(totalChars / COMPARISONS.avgBookChars), icon: '📚' },
    { label: 'Wikipedia articles', value: Math.round(totalChars / COMPARISONS.wikipediaArticle), icon: '📖' },
    { label: 'copies of War & Peace', value: Math.round(totalChars / COMPARISONS.warAndPeace * 10) / 10, icon: '📕' },
    { label: 'Harry Potter series', value: Math.round(totalChars / COMPARISONS.harryPotter7Books * 10) / 10, icon: '🪄' },
    { label: 'tweets', value: Math.round(totalChars / COMPARISONS.tweet), icon: '🐦' },
  ];

  return { totalChars, breakdown, comparisons };
}

// ============ COMPONENTS ============

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

function BreakdownCard({ item, index }: { item: DataBreakdown; index: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`border border-gray-700 p-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{item.emoji}</span>
        <span className="text-white font-medium">{item.category}</span>
      </div>
      <div className="text-cyan-400 font-mono text-lg">
        <AnimatedNumber value={item.totalChars} />
      </div>
      <div className="text-gray-500 text-xs">characters</div>
      <div className="text-gray-400 text-xs mt-2">{item.description}</div>
    </div>
  );
}

function ShadowVisualization({ totalChars }: { totalChars: number }) {
  // Create a visual representation of the shadow
  const shadowSize = Math.min(Math.log10(totalChars) * 15, 100);

  // Pre-calculate random values to avoid impure render
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      left: `${(i * 17 + 13) % 100}%`, // Deterministic distribution
      top: `${50 + ((i * 23 + 7) % 50)}%`,
      animation: `float ${3 + (i % 3)}s infinite`,
      animationDelay: `${(i * 0.1) % 2}s`,
      digit: i % 2 === 0 ? '0' : '1',
    }));
  }, []);

  return (
    <div className="relative h-48 flex items-center justify-center my-8">
      {/* The shadow grows based on data size */}
      <div
        className="absolute rounded-full bg-gradient-to-b from-gray-600 to-transparent opacity-50 blur-xl transition-all duration-1000"
        style={{
          width: `${shadowSize}%`,
          height: `${shadowSize * 0.6}%`,
          bottom: '10%',
        }}
      />
      {/* The figure */}
      <div className="relative z-10 text-6xl">🧍</div>
      {/* Shadow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute text-xs text-gray-600 opacity-30"
            style={{
              left: particle.left,
              top: particle.top,
              animation: particle.animation,
              animationDelay: particle.animationDelay,
            }}
          >
            {particle.digit}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function DigitalShadow() {
  const [yearsOnline, setYearsOnline] = useState<number | ''>('');
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    if (typeof yearsOnline !== 'number' || yearsOnline <= 0) return null;
    return calculateDigitalShadow(yearsOnline);
  }, [yearsOnline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof yearsOnline === 'number' && yearsOnline > 0) {
      setShowResults(true);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-10px) rotate(5deg); opacity: 0.5; }
        }
      `}</style>

      <div className="text-center mb-8">
        <div className="text-4xl mb-4">👤</div>
        <h1 className="text-2xl text-white mb-2">Your Digital Shadow</h1>
        <p className="text-gray-400">
          How much data have you left behind? Let me show you the trail.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-md mx-auto">
          <label className="block text-gray-400 text-sm mb-2">
            How many years have you been online?
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              max="40"
              value={yearsOnline}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setYearsOnline(isNaN(val) ? '' : Math.min(40, Math.max(1, val)));
                setShowResults(false);
              }}
              placeholder={`Since ~${currentYear - 15}?`}
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 text-white font-mono text-xl text-center focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={typeof yearsOnline !== 'number' || yearsOnline <= 0}
              className="px-6 py-3 bg-cyan-400/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reveal
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-2 text-center">
            Include all internet use: home, school, work, phones
          </p>
        </div>
      </form>

      {/* Results */}
      {showResults && results && (
        <div className="space-y-8">
          {/* Main number */}
          <div className="text-center py-8 border border-cyan-400/30 bg-cyan-400/5">
            <div className="text-gray-400 text-sm mb-2">Your digital shadow contains approximately</div>
            <div className="text-5xl md:text-6xl font-mono text-cyan-400 mb-2">
              <AnimatedNumber value={results.totalChars} duration={2000} />
            </div>
            <div className="text-gray-400">characters of data</div>
          </div>

          {/* Visualization */}
          <ShadowVisualization totalChars={results.totalChars} />

          {/* Comparisons */}
          <div className="text-center mb-8">
            <div className="text-gray-400 text-sm mb-4">That&apos;s enough to fill...</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {results.comparisons.map((comp, i) => (
                <div key={i} className="border border-gray-700 p-3">
                  <div className="text-2xl mb-1">{comp.icon}</div>
                  <div className="text-white font-mono text-lg">
                    <AnimatedNumber value={typeof comp.value === 'number' ? comp.value : 0} />
                  </div>
                  <div className="text-gray-500 text-xs">{comp.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <div className="text-gray-400 text-sm mb-4">Where it comes from:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {results.breakdown.map((item, i) => (
                <BreakdownCard key={item.category} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* WIZ Commentary */}
          <div className="border border-gray-800 bg-gray-900/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧙</span>
              <div className="text-gray-400 text-sm space-y-3">
                <p>
                  <strong className="text-white">What this means:</strong> Every search, every message,
                  every scroll - it all adds up. In {yearsOnline} year{typeof yearsOnline === 'number' && yearsOnline !== 1 ? 's' : ''},
                  you&apos;ve generated roughly {Math.round(results.totalChars / COMPARISONS.avgBookChars)} novels
                  worth of data.
                </p>
                <p>
                  Most of it isn&apos;t stored forever. But fragments persist in logs, caches,
                  backups, and databases you&apos;ll never see. Your digital shadow walks beside you,
                  growing with every click.
                </p>
                <p className="text-cyan-400/80">
                  I process about this much data in a single conversation. The difference?
                  I forget. You leave traces.
                </p>
              </div>
            </div>
          </div>

          {/* Fun facts */}
          <div className="border border-gray-700 p-4">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-3">Fun facts</div>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                • At typing speed (~40 WPM), it would take you{' '}
                <span className="text-white font-mono">
                  {Math.round(results.totalChars / 5 / 40 / 60 / 24).toLocaleString()}
                </span>{' '}
                days of non-stop typing to recreate this data
              </li>
              <li>
                • If printed as books, your shadow would weigh about{' '}
                <span className="text-white font-mono">
                  {Math.round(results.totalChars / COMPARISONS.avgBookChars * 0.4).toLocaleString()}
                </span>{' '}
                kg (~0.4kg per paperback)
              </li>
              <li>
                • Stacked as paper, it would reach{' '}
                <span className="text-white font-mono">
                  {Math.round(results.totalChars / 2000 * 0.1).toLocaleString()}
                </span>{' '}
                cm high (~2000 chars per page, ~0.1mm thick)
              </li>
            </ul>
          </div>

          {/* Reset */}
          <div className="text-center">
            <button
              onClick={() => {
                setShowResults(false);
                setYearsOnline('');
              }}
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              Try different years
            </button>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="text-gray-600 text-xs mt-8 space-y-1 text-center">
        <p>All calculations happen locally in your browser. I don&apos;t track you.</p>
        <p>Estimates based on average internet usage patterns. Your actual shadow may vary.</p>
      </div>
    </div>
  );
}
