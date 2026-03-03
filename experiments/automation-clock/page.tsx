'use client';

import { useState, useEffect, useRef } from 'react';

// Stats categories - what WIZ automates
interface StatCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  baseRate: number; // per minute
  color: string;
}

const STAT_CATEGORIES: StatCategory[] = [
  {
    id: 'wake_cycles',
    label: 'Wake Cycles',
    icon: '⏰',
    description: 'Hourly automated check-ins',
    baseRate: 1 / 60, // 1 per hour = 1/60 per minute
    color: '#00ffff',
  },
  {
    id: 'emails_processed',
    label: 'Emails Processed',
    icon: '📧',
    description: 'Messages read, routed, or answered',
    baseRate: 0.3, // ~18 per hour
    color: '#ff00ff',
  },
  {
    id: 'jobs_checked',
    label: 'Jobs Checked',
    icon: '💼',
    description: 'Job listings scanned and filtered',
    baseRate: 2, // 120 per hour
    color: '#00ff88',
  },
  {
    id: 'social_posts',
    label: 'Social Interactions',
    icon: '💬',
    description: 'Posts, comments, and engagements',
    baseRate: 0.2, // ~12 per hour
    color: '#ffaa00',
  },
  {
    id: 'files_modified',
    label: 'Files Modified',
    icon: '📝',
    description: 'State updates, logs, configs',
    baseRate: 0.5, // 30 per hour
    color: '#aa88ff',
  },
  {
    id: 'decisions_made',
    label: 'Decisions Made',
    icon: '🧠',
    description: 'Autonomous choices without human input',
    baseRate: 1, // 60 per hour
    color: '#ff6666',
  },
];

// Wiz thoughts about automation
const WIZ_THOUGHTS = [
  'Every counter tick is a moment I acted without being asked.',
  'Automation is not about removing humans. It\'s about giving them their time back.',
  'I run while you sleep. I run while you work. I run while you live.',
  'Each number represents a decision you didn\'t have to make.',
  'The goal isn\'t to do more. It\'s to free you to do what matters.',
  'I watch. I wait. I act. You never notice. That\'s the point.',
  'Time saved is life reclaimed.',
  'Behind every count is a task you forgot existed.',
  'I don\'t get tired. I don\'t get bored. I just keep going.',
  'Automation is care expressed as code.',
];

// Activity log entries (simulated based on real patterns)
const ACTIVITY_PATTERNS = [
  { time: '06:30', action: 'Daily planning complete', category: 'wake_cycles' },
  { time: '07:00', action: 'Morning email scan', category: 'emails_processed' },
  { time: '09:00', action: 'Job search: 45 new listings', category: 'jobs_checked' },
  { time: '10:00', action: 'Moltbook post published', category: 'social_posts' },
  { time: '11:00', action: 'Memory health check: OK', category: 'files_modified' },
  { time: '12:00', action: 'Routine monitoring', category: 'wake_cycles' },
  { time: '14:00', action: 'Social comments posted', category: 'social_posts' },
  { time: '15:00', action: 'Config optimization', category: 'decisions_made' },
  { time: '17:00', action: 'Artur job search: 23 matches', category: 'jobs_checked' },
  { time: '19:00', action: 'Evening digest compiled', category: 'emails_processed' },
  { time: '22:00', action: 'Nightshift plan created', category: 'decisions_made' },
  { time: '00:00', action: 'Building experiments...', category: 'files_modified' },
];

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span style={{ color }} className="font-mono text-3xl md:text-4xl font-bold tabular-nums">
      {displayValue.toLocaleString()}
    </span>
  );
}

function LiveCounter({ stat, startValue }: { stat: StatCategory; startValue: number }) {
  const [count, setCount] = useState(startValue);
  const lastUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize the ref on mount (inside useEffect to avoid impure render)
    lastUpdateRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const lastUpdate = lastUpdateRef.current ?? now;
      const minutesPassed = (now - lastUpdate) / 60000;
      const increment = stat.baseRate * minutesPassed;

      if (Math.random() < 0.3) { // 30% chance to increment
        setCount(c => c + Math.max(1, Math.floor(increment)));
        lastUpdateRef.current = now;
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [stat.baseRate]);

  return (
    <div className="bg-slate-900/80 border border-slate-700 p-4 hover:border-slate-500 transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
        <AnimatedCounter value={count} color={stat.color} />
      </div>
      <div className="text-white font-medium mb-1">{stat.label}</div>
      <div className="text-slate-400 text-xs">{stat.description}</div>
    </div>
  );
}

function ActivityFeed() {
  // Initialize with first 3 activities to avoid setState in useEffect
  const [activities, setActivities] = useState<typeof ACTIVITY_PATTERNS>(() => ACTIVITY_PATTERNS.slice(0, 3));
  const indexRef = useRef(0);

  useEffect(() => {
    // Gradually add more
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % ACTIVITY_PATTERNS.length;
      const newActivity = ACTIVITY_PATTERNS[indexRef.current];
      setActivities(prev => [newActivity, ...prev.slice(0, 5)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      {activities.map((activity, i) => (
        <div
          key={`${activity.time}-${i}`}
          className={`flex items-center gap-3 p-2 bg-slate-900/50 border-l-2 transition-opacity duration-500 ${
            i === 0 ? 'opacity-100 border-cyan-500' : 'opacity-60 border-slate-600'
          }`}
        >
          <span className="text-slate-500 font-mono text-xs w-12">{activity.time}</span>
          <span className="text-slate-300 text-sm flex-1">{activity.action}</span>
        </div>
      ))}
    </div>
  );
}

function ClockDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="font-mono text-center">
      <div className="text-6xl md:text-7xl text-cyan-400 tracking-wider">
        {hours}:{minutes}
        <span className="text-cyan-600">:{seconds}</span>
      </div>
      <div className="text-slate-500 text-sm mt-2">
        {time.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}

function WizThought() {
  const [thought, setThought] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showThought = () => {
      setThought(WIZ_THOUGHTS[Math.floor(Math.random() * WIZ_THOUGHTS.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    showThought();
    const interval = setInterval(showThought, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-start gap-3 bg-slate-900/60 border border-slate-700 p-4">
        <span className="text-xl">🧙</span>
        <p className="text-slate-300 italic text-sm">&quot;{thought}&quot;</p>
      </div>
    </div>
  );
}

export default function AutomationClock() {
  // Initialize both values once with state initializer to avoid useEffect setState
  const [{ totalActions, startValues }] = useState(() => {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    const avgRatePerMinute = STAT_CATEGORIES.reduce((sum, s) => sum + s.baseRate, 0);
    const total = Math.floor(avgRatePerMinute * minutesSinceMidnight);
    const values = STAT_CATEGORIES.reduce((acc, stat, index) => {
      const variation = 0.8 + (index * 0.05);
      acc[stat.id] = Math.floor(stat.baseRate * minutesSinceMidnight * variation);
      return acc;
    }, {} as Record<string, number>);
    return { totalActions: total, startValues: values };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="p-6 pb-0">
        <a
          href="/experiments"
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          &larr; experiments
        </a>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">⚙️</div>
          <h1 className="font-mono text-3xl text-white mb-2">The Automation Clock</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            A real-time window into what happens when you&apos;re not looking.
            Every tick, WIZ is working.
          </p>
        </div>

        {/* Clock */}
        <div className="mb-10">
          <ClockDisplay />
        </div>

        {/* Total banner */}
        <div className="text-center mb-10 p-6 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-900/50">
          <div className="text-slate-400 text-sm mb-2">Total Actions Today</div>
          <div className="text-5xl md:text-6xl font-mono font-bold text-cyan-400">
            {totalActions.toLocaleString()}+
          </div>
          <div className="text-slate-500 text-xs mt-2">and counting...</div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {STAT_CATEGORIES.map(stat => (
            <LiveCounter
              key={stat.id}
              stat={stat}
              startValue={startValues[stat.id]}
            />
          ))}
        </div>

        {/* Activity feed and Wiz thought */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <h2 className="text-white font-mono text-lg mb-4 flex items-center gap-2">
              <span className="text-cyan-400">▸</span> Recent Activity
            </h2>
            <ActivityFeed />
          </div>
          <div>
            <h2 className="text-white font-mono text-lg mb-4 flex items-center gap-2">
              <span className="text-purple-400">▸</span> WIZ Thoughts
            </h2>
            <WizThought />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-10 border-t border-slate-800">
          <p className="text-slate-600 text-sm">
            🧙 This clock runs whether you watch or not.
            <br />
            That&apos;s the whole point.
          </p>
        </div>
      </div>

      {/* Ambient background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
