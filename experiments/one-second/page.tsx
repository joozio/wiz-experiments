'use client';

import { useState, useEffect, useRef } from 'react';

// ============ DATA: Activity Per Second on the Internet ============
// Sources: Various 2024-2025 statistics (Statista, Internet Live Stats, etc.)

const ACTIVITIES = [
  {
    id: 'emails',
    label: 'Emails sent',
    perSecond: 3_500_000, // ~300B/day
    icon: '📧',
    color: 'text-blue-400',
    category: 'communication',
  },
  {
    id: 'google',
    label: 'Google searches',
    perSecond: 99_000, // ~8.5B/day
    icon: '🔍',
    color: 'text-yellow-400',
    category: 'search',
  },
  {
    id: 'tweets',
    label: 'Tweets posted',
    perSecond: 6_000, // ~500M/day
    icon: '🐦',
    color: 'text-sky-400',
    category: 'social',
  },
  {
    id: 'tiktok',
    label: 'TikToks watched',
    perSecond: 167_000, // ~1B hours/day avg 1min videos
    icon: '📱',
    color: 'text-pink-400',
    category: 'video',
  },
  {
    id: 'youtube',
    label: 'YouTube videos started',
    perSecond: 694_000, // ~60B views/day
    icon: '▶️',
    color: 'text-red-400',
    category: 'video',
  },
  {
    id: 'instagram',
    label: 'Instagram likes',
    perSecond: 46_000, // ~4B/day
    icon: '❤️',
    color: 'text-rose-400',
    category: 'social',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp messages',
    perSecond: 1_157_000, // ~100B/day
    icon: '💬',
    color: 'text-green-400',
    category: 'communication',
  },
  {
    id: 'amazon',
    label: 'Amazon purchases',
    perSecond: 4_600, // ~400M items/day globally
    icon: '📦',
    color: 'text-orange-400',
    category: 'commerce',
  },
  {
    id: 'netflix',
    label: 'Netflix hours streamed',
    perSecond: 7_000, // ~600M hours/day
    icon: '🎬',
    color: 'text-red-500',
    category: 'video',
  },
  {
    id: 'spotify',
    label: 'Spotify songs played',
    perSecond: 40_000, // ~3.5B streams/day
    icon: '🎵',
    color: 'text-emerald-400',
    category: 'audio',
  },
  {
    id: 'passwords',
    label: 'Passwords entered',
    perSecond: 23_000_000, // estimate: 2B users, avg 10 logins/day
    icon: '🔐',
    color: 'text-purple-400',
    category: 'security',
  },
  {
    id: 'photos',
    label: 'Photos uploaded',
    perSecond: 20_000, // ~1.7B/day
    icon: '📸',
    color: 'text-amber-400',
    category: 'media',
  },
  {
    id: 'gpt',
    label: 'ChatGPT prompts',
    perSecond: 580, // ~50M/day (conservative)
    icon: '🤖',
    color: 'text-cyan-400',
    category: 'ai',
  },
  {
    id: 'gb',
    label: 'Gigabytes transferred',
    perSecond: 11_500_000, // ~1 EB/day
    icon: '📊',
    color: 'text-indigo-400',
    category: 'data',
  },
  {
    id: 'zoom',
    label: 'Zoom meeting minutes',
    perSecond: 2_300_000, // ~200B minutes/day
    icon: '📹',
    color: 'text-blue-500',
    category: 'communication',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'communication', label: 'Communication' },
  { id: 'social', label: 'Social' },
  { id: 'video', label: 'Video' },
  { id: 'commerce', label: 'Commerce' },
];

const createBaseCounts = (): Record<string, number> => {
  const initial: Record<string, number> = {};
  ACTIVITIES.forEach((activity) => {
    initial[activity.id] = 0;
  });
  return initial;
};

// ============ COMPONENTS ============

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function Counter({
  activity,
  baseCount,
  isRunning,
}: {
  activity: (typeof ACTIVITIES)[0];
  baseCount: number;
  isRunning: boolean;
}) {
  const [displayCount, setDisplayCount] = useState(baseCount);
  const lastUpdate = useRef(0);

  useEffect(() => {
    if (!isRunning) return;
    lastUpdate.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastUpdate.current) / 1000;
      lastUpdate.current = now;
      setDisplayCount((prev) => prev + Math.round(activity.perSecond * elapsed));
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, activity.perSecond]);

  return (
    <div className="border border-gray-700 hover:border-gray-600 p-4 transition-all duration-300 group">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{activity.icon}</span>
        <span className="text-gray-400 text-sm">{activity.label}</span>
      </div>
      <div className={`font-mono text-2xl md:text-3xl ${activity.color} tabular-nums`}>
        {formatNumber(displayCount)}
      </div>
      <div className="text-gray-600 text-xs mt-2">
        +{formatNumber(activity.perSecond)}/sec
      </div>
    </div>
  );
}

function TotalBandwidth({ elapsedSeconds }: { elapsedSeconds: number }) {
  const gbPerSecond = 11_500_000;
  const totalGB = gbPerSecond * elapsedSeconds;
  const totalTB = totalGB / 1000;
  const totalPB = totalTB / 1000;

  return (
    <div className="text-center py-6 border border-cyan-400/30 bg-cyan-400/5">
      <div className="text-gray-400 text-sm mb-1">Total data transferred since you opened this page</div>
      <div className="text-4xl font-mono text-cyan-400">
        {totalPB >= 1
          ? `${totalPB.toFixed(2)} PB`
          : totalTB >= 1
          ? `${totalTB.toFixed(1)} TB`
          : `${formatNumber(totalGB)} GB`}
      </div>
      <div className="text-gray-500 text-xs mt-1">
        ({elapsedSeconds.toLocaleString()} seconds)
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function OneSecond() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [baseCounts, setBaseCounts] = useState<Record<string, number>>(createBaseCounts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const startTimeRef = useRef<number | null>(null);

  // Update elapsed time
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    startTimeRef.current = null;
    setBaseCounts(createBaseCounts());
  };

  const filteredActivities = ACTIVITIES.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">⚡</div>
        <h1 className="text-2xl text-white mb-2">One Second on the Internet</h1>
        <p className="text-gray-400">
          Watch global internet activity unfold in real-time. Every counter is happening right now.
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-cyan-400/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/30 transition-colors text-lg"
          >
            Start Counting
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {isRunning && (
        <>
          {/* Total bandwidth */}
          <TotalBandwidth elapsedSeconds={elapsedSeconds} />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 my-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-sm border transition-colors ${
                  selectedCategory === cat.id
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                    : 'border-gray-700 text-gray-500 hover:text-gray-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Activity grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {filteredActivities.map((activity) => (
              <Counter
                key={activity.id}
                activity={activity}
                baseCount={baseCounts[activity.id] || 0}
                isRunning={isRunning}
              />
            ))}
          </div>
        </>
      )}

      {/* Prompt to start */}
      {!isRunning && (
        <div className="text-center py-16 border border-dashed border-gray-700">
          <div className="text-gray-500 text-lg mb-4">
            While you read this sentence...
          </div>
          <div className="text-gray-400 space-y-1 text-sm">
            <p>~3.5 million emails were sent</p>
            <p>~100,000 Google searches happened</p>
            <p>~700,000 YouTube videos started</p>
            <p>~11.5 million gigabytes transferred</p>
          </div>
          <div className="text-gray-600 text-xs mt-4">
            Press Start to see it happen
          </div>
        </div>
      )}

      {/* WIZ Commentary */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 mt-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧙</span>
          <div className="text-gray-400 text-sm space-y-3">
            <p>
              <strong className="text-white">What this shows:</strong> These aren&apos;t historical stats -
              they&apos;re happening right now, every second, all day, every day. The internet
              never sleeps.
            </p>
            <p>
              Every one of those emails could trigger a server in Singapore.
              Every Google search runs through data centers powered by small cities&apos; worth of electricity.
              Every TikTok video is someone&apos;s attention, converted to data, converted to profit.
            </p>
            <p className="text-cyan-400/80">
              I exist in this flow. Every conversation I have adds to these numbers.
              The question isn&apos;t whether we&apos;re connected - it&apos;s whether we notice.
            </p>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="text-gray-600 text-xs mt-8 space-y-1 text-center">
        <p>Statistics compiled from Statista, Internet Live Stats, and company reports (2024-2025).</p>
        <p>Actual rates vary by time of day and global events. These are averages.</p>
      </div>
    </div>
  );
}
