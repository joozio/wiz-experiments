'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ============ ACHIEVEMENTS ============

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  seconds: number; // time required to unlock
  unlocked: boolean;
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first-steps', title: 'First Steps', description: 'You started procrastinating. Everyone starts somewhere.', emoji: '👶', seconds: 5 },
  { id: 'settling-in', title: 'Settling In', description: '30 seconds of pure nothing. How does it feel?', emoji: '🛋️', seconds: 30 },
  { id: 'one-minute-man', title: 'One Minute Wonder', description: 'A full minute wasted. The first of many.', emoji: '⏱️', seconds: 60 },
  { id: 'comfort-zone', title: 'Comfort Zone Established', description: '2 minutes in. You could have made coffee by now.', emoji: '☕', seconds: 120 },
  { id: 'deep-dive', title: 'Deep Dive', description: '5 minutes. That email can definitely wait.', emoji: '🤿', seconds: 300 },
  { id: 'pro-crastinator', title: 'Pro-crastinator', description: '10 minutes of dedicated avoidance. Impressive commitment.', emoji: '🏆', seconds: 600 },
  { id: 'master-of-delay', title: 'Master of Delay', description: '15 minutes. Deadlines are just suggestions anyway.', emoji: '🎭', seconds: 900 },
  { id: 'time-lord', title: 'Time Lord', description: '20 minutes wasted. You could have walked a mile.', emoji: '⏰', seconds: 1200 },
  { id: 'half-hour-hero', title: 'Half-Hour Hero', description: '30 minutes. That task is definitely not getting done today.', emoji: '🦸', seconds: 1800 },
  { id: 'the-zone', title: 'The Zone', description: '45 minutes of nothing. You\'ve reached peak procrastination.', emoji: '🧘', seconds: 2700 },
  { id: 'hour-of-power', title: 'Hour of Power', description: 'A full hour. You could have learned something new.', emoji: '🎓', seconds: 3600 },
  { id: 'legendary', title: 'Legendary Procrastinator', description: '90 minutes. Future you will deal with this.', emoji: '👑', seconds: 5400 },
  { id: 'transcendent', title: 'Transcendent', description: '2 hours. You\'ve transcended productivity entirely.', emoji: '✨', seconds: 7200 },
];

// ============ RANDOM THOUGHTS ============

const RANDOM_THOUGHTS = [
  "You could be doing that thing right now...",
  "The task isn't going anywhere. Neither are you.",
  "Future you will definitely handle this.",
  "Is it procrastination if you're committed to it?",
  "Every second you waste is a second well spent.",
  "Productivity is overrated anyway.",
  "This is technically a form of meditation.",
  "Your deadline just got one second closer.",
  "You're not avoiding work. You're exploring alternatives.",
  "What if the real productivity was the time we wasted along the way?",
  "That email can definitely wait another minute.",
  "You're just building suspense for your actual work.",
  "Technically, you're making future-you's work more urgent. Exciting!",
  "The task will still be there. It's very patient.",
  "You're cultivating the art of strategic delay.",
  "Some people call it procrastination. You call it prioritizing rest.",
  "The best time to start was yesterday. The second best time is... later.",
  "You're not wasting time. You're investing in delay.",
  "This moment of pause is brought to you by avoidance.",
  "Time you enjoy wasting is not wasted time. Right?",
];

// ============ STATS ============

interface TimeBreakdown {
  hours: number;
  minutes: number;
  seconds: number;
}

const formatTime = (totalSeconds: number): TimeBreakdown => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
};

const getWhatYouCouldHaveDone = (seconds: number): string[] => {
  const things: string[] = [];

  if (seconds >= 60) things.push(`${Math.floor(seconds / 60)} pages of a book`);
  if (seconds >= 120) things.push(`${Math.floor(seconds / 120)} push-ups (at your pace)`);
  if (seconds >= 180) things.push(`${Math.floor(seconds / 180)} short phone calls`);
  if (seconds >= 300) things.push(`${Math.floor(seconds / 300)} cups of tea made and enjoyed`);
  if (seconds >= 600) things.push(`${Math.floor(seconds / 600)} short walks around the block`);
  if (seconds >= 1200) things.push(`${Math.floor(seconds / 1200)} meditation sessions`);
  if (seconds >= 1800) things.push(`${Math.floor(seconds / 1800)} workout sessions`);
  if (seconds >= 3600) things.push(`${Math.floor(seconds / 3600)} entire Netflix episodes`);

  return things.slice(0, 4);
};

const pickRandomThought = (): string => (
  RANDOM_THOUGHTS[Math.floor(Math.random() * RANDOM_THOUGHTS.length)]
);

// ============ MAIN COMPONENT ============

export default function ProcrastinationSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(
    ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  );
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const [currentThought, setCurrentThought] = useState('');
  const [showAchievementToast, setShowAchievementToast] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const thoughtIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((previousSeconds) => {
          const nextSeconds = previousSeconds + 1;

          setAchievements((previousAchievements) => previousAchievements.map((achievement) => {
            if (!achievement.unlocked && nextSeconds >= achievement.seconds) {
              // Trigger toast for newly unlocked achievements.
              setTimeout(() => {
                setLatestAchievement(achievement);
                setShowAchievementToast(true);
                setTimeout(() => setShowAchievementToast(false), 3000);
              }, 0);
              return { ...achievement, unlocked: true };
            }

            return achievement;
          }));

          return nextSeconds;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Random thoughts
  useEffect(() => {
    if (isRunning) {
      thoughtIntervalRef.current = setInterval(() => {
        setCurrentThought(pickRandomThought());
      }, 8000);
    } else if (thoughtIntervalRef.current) {
      clearInterval(thoughtIntervalRef.current);
    }

    return () => {
      if (thoughtIntervalRef.current) clearInterval(thoughtIntervalRef.current);
    };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    setCurrentThought(pickRandomThought());
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(0);
    setAchievements(ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
    setLatestAchievement(null);
    setCurrentThought('');
  }, []);

  const time = formatTime(totalSeconds);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const nextAchievement = achievements.find(a => !a.unlocked);
  const couldHaveDone = getWhatYouCouldHaveDone(totalSeconds);

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">⏳</div>
        <h1 className="text-2xl text-white mb-2">The Procrastination Simulator</h1>
        <p className="text-gray-400">
          Watch time pass. Earn achievements. Accomplish nothing.
        </p>
      </div>

      {/* Achievement Toast */}
      {showAchievementToast && latestAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="border border-yellow-500/50 bg-yellow-500/10 p-4 max-w-xs">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{latestAchievement.emoji}</span>
              <div>
                <div className="text-yellow-400 font-bold">Achievement Unlocked!</div>
                <div className="text-white text-sm">{latestAchievement.title}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer */}
      <div className="border border-gray-700 bg-gray-900/50 p-8 mb-6">
        <div className="text-center">
          <div className="font-mono text-6xl md:text-8xl text-cyan-400 mb-4">
            {String(time.hours).padStart(2, '0')}
            <span className="text-cyan-400/50">:</span>
            {String(time.minutes).padStart(2, '0')}
            <span className="text-cyan-400/50">:</span>
            {String(time.seconds).padStart(2, '0')}
          </div>
          <div className="text-gray-500 text-sm mb-6">
            {totalSeconds === 0 && !isRunning
              ? 'Time wasted: none yet'
              : `${totalSeconds.toLocaleString()} seconds of dedicated avoidance`}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-8 py-3 bg-cyan-500/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-lg"
              >
                {totalSeconds === 0 ? 'Start Procrastinating' : 'Continue Wasting Time'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-8 py-3 bg-orange-500/20 border border-orange-500 text-orange-400 hover:bg-orange-500/30 transition-colors text-lg"
              >
                Pause (Productivity Break?)
              </button>
            )}
            {totalSeconds > 0 && (
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Random Thought */}
      {isRunning && currentThought && (
        <div className="border border-gray-700 bg-gray-900/30 p-4 mb-6 text-center">
          <div className="text-gray-400 italic">&ldquo;{currentThought}&rdquo;</div>
        </div>
      )}

      {/* Progress to Next Achievement */}
      {nextAchievement && totalSeconds > 0 && (
        <div className="border border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Next achievement:</div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{nextAchievement.emoji}</span>
              <span className="text-white">{nextAchievement.title}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-1000"
              style={{ width: `${Math.min(100, (totalSeconds / nextAchievement.seconds) * 100)}%` }}
            />
          </div>
          <div className="text-right text-gray-500 text-xs mt-1">
            {nextAchievement.seconds - totalSeconds} seconds remaining
          </div>
        </div>
      )}

      {/* What You Could Have Done */}
      {couldHaveDone.length > 0 && (
        <div className="border border-gray-700 p-4 mb-6">
          <div className="text-gray-400 text-sm mb-3">In this time, you could have done:</div>
          <div className="grid grid-cols-2 gap-2">
            {couldHaveDone.map((thing, i) => (
              <div key={i} className="text-white text-sm flex items-center gap-2">
                <span className="text-red-400">✗</span> {thing}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-medium">Achievements</div>
          <div className="text-gray-400 text-sm">{unlockedCount} / {achievements.length}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-3 border transition-all ${
                achievement.unlocked
                  ? 'border-yellow-500/50 bg-yellow-500/10'
                  : 'border-gray-700 bg-gray-800/30 opacity-50'
              }`}
              title={achievement.unlocked ? achievement.description : `Unlock at ${formatTime(achievement.seconds).minutes}:${String(formatTime(achievement.seconds).seconds).padStart(2, '0')}`}
            >
              <div className="text-2xl text-center mb-1">{achievement.emoji}</div>
              <div className={`text-xs text-center ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {achievement.unlocked ? achievement.title : '???'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {totalSeconds > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-cyan-400 font-mono text-xl">{unlockedCount}</div>
            <div className="text-gray-500 text-xs">Achievements</div>
          </div>
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-white font-mono text-xl">{(totalSeconds / 60).toFixed(1)}</div>
            <div className="text-gray-500 text-xs">Minutes Wasted</div>
          </div>
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-white font-mono text-xl">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
            <div className="text-gray-500 text-xs">Completion</div>
          </div>
        </div>
      )}

      {/* WIZ Commentary */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧙</span>
          <div className="text-gray-400 text-sm space-y-3">
            <p>
              <strong className="text-white">Welcome to the anti-productivity tool.</strong> This
              timer counts up, not down. There are no deadlines here. Only achievements for
              the noble art of doing absolutely nothing useful.
            </p>
            <p>
              Some say time you enjoy wasting is not wasted time. Others say that&apos;s just what
              procrastinators tell themselves. Both are probably right.
            </p>
            <p className="text-cyan-400/80">
              Fun fact: The average person spends 55 minutes per day procrastinating.
              Let&apos;s see if you can beat that.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="text-gray-600 text-xs mt-8 space-y-1 text-center">
        <p>All wasted time stays local. Your procrastination habits are between you and your browser.</p>
        <p>No judgment here. Well, a little judgment. But mostly understanding.</p>
      </div>
    </div>
  );
}
