'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// --- Ebbinghaus forgetting curve math ---
// R = e^(-t/S) where R = retention, t = time elapsed, S = stability
// Without review, S ≈ 1 day for new information
// Each successful review multiplies S by ~2.5

function retention(hoursElapsed: number, stability: number): number {
  return Math.exp(-hoursElapsed / (stability * 24));
}

function formatRetention(r: number): string {
  return `${Math.round(r * 100)}%`;
}

// --- Time presets ---
interface TimePreset {
  label: string;
  hours: number;
  description: string;
}

const timePresets: TimePreset[] = [
  { label: '20 minutes ago', hours: 0.33, description: 'Fresh — but fading fast' },
  { label: '1 hour ago', hours: 1, description: 'The first cliff' },
  { label: 'Earlier today', hours: 8, description: 'Already slipping' },
  { label: 'Yesterday', hours: 24, description: 'The critical window' },
  { label: '3 days ago', hours: 72, description: 'Mostly vapor now' },
  { label: 'Last week', hours: 168, description: 'Ghost memory' },
  { label: 'Last month', hours: 720, description: 'Dust' },
];

// --- Review schedule generator ---
interface ReviewSlot {
  label: string;
  hours: number;
  retentionBefore: number;
  retentionAfter: number;
  stabilityAfter: number;
}

function generateReviewSchedule(hoursElapsed: number): ReviewSlot[] {
  const baseStability = 1; // 1 day
  let currentStability = baseStability;
  const slots: ReviewSlot[] = [];

  // Review 1: Now (refreshes to ~95%)
  const r1Before = retention(hoursElapsed, currentStability);
  currentStability *= 2.5;
  slots.push({
    label: 'Now (60-second review)',
    hours: 0,
    retentionBefore: r1Before,
    retentionAfter: 0.95,
    stabilityAfter: currentStability,
  });

  // Review 2: Tomorrow
  const r2Before = retention(24, currentStability);
  currentStability *= 2.5;
  slots.push({
    label: 'Tomorrow',
    hours: 24,
    retentionBefore: r2Before,
    retentionAfter: 0.95,
    stabilityAfter: currentStability,
  });

  // Review 3: In 3 days
  const r3Before = retention(72, currentStability);
  currentStability *= 2.5;
  slots.push({
    label: 'In 3 days',
    hours: 72,
    retentionBefore: r3Before,
    retentionAfter: 0.95,
    stabilityAfter: currentStability,
  });

  // Review 4: In 1 week
  const r4Before = retention(168, currentStability);
  currentStability *= 2.5;
  slots.push({
    label: 'In 1 week',
    hours: 168,
    retentionBefore: r4Before,
    retentionAfter: 0.95,
    stabilityAfter: currentStability,
  });

  // Review 5: In 1 month
  const r5Before = retention(720, currentStability);
  slots.push({
    label: 'In 1 month',
    hours: 720,
    retentionBefore: r5Before,
    retentionAfter: 0.95,
    stabilityAfter: currentStability * 2.5,
  });

  return slots;
}

// --- 60-second review techniques ---
function getReviewTechnique(topic: string): { name: string; instruction: string; timerSeconds: number }[] {
  return [
    {
      name: 'Recall Dump',
      instruction: `Close your eyes. Write or say everything you remember about "${topic}" without looking at any notes. Don't worry about order or completeness — just dump it.`,
      timerSeconds: 20,
    },
    {
      name: 'One-Sentence Summary',
      instruction: `Now distill everything about "${topic}" into ONE sentence. Force yourself to capture the essence. If you can say it in one sentence, you understand it.`,
      timerSeconds: 15,
    },
    {
      name: 'The Connection',
      instruction: `How does "${topic}" connect to something you already know? Find one link to existing knowledge. This creates a memory hook that makes the neural pathway stronger.`,
      timerSeconds: 15,
    },
    {
      name: 'Teach It',
      instruction: `Imagine explaining "${topic}" to a curious 10-year-old. Say it out loud — even if you're alone. Teaching forces your brain to organize the information.`,
      timerSeconds: 10,
    },
  ];
}

// --- WIZ commentary ---
function getWizComment(hoursElapsed: number, currentRetention: number): string {
  if (hoursElapsed <= 0.5) {
    return "Right now, this memory feels permanent. Crystal clear. But your brain is already preparing to throw it away. In 20 minutes, the forgetting curve hits its steepest drop. You came just in time.";
  }
  if (hoursElapsed <= 1) {
    return `One hour. You've already lost about ${Math.round((1 - currentRetention) * 100)}% of what you learned. Not because you're bad at remembering — because human brains are optimized for forgetting. Every brain does this. The question is whether you'll fight back.`;
  }
  if (hoursElapsed <= 8) {
    return `Hours have passed. Your brain has quietly deleted nearly ${Math.round((1 - currentRetention) * 100)}% of this knowledge. Not maliciously — it just doesn't know this matters to you yet. A single 60-second review would change everything.`;
  }
  if (hoursElapsed <= 24) {
    return `One day. This is the most critical window in the forgetting curve. You're at ${formatRetention(currentRetention)} retention. Without intervention, this drops to near zero within the week. But ONE review right now would buy you days.`;
  }
  if (hoursElapsed <= 72) {
    return `Three days without review. You've kept maybe ${formatRetention(currentRetention)} of the original memory. What remains are fragments — impressions, feelings about the topic, maybe a keyword. The detailed knowledge? Dissolving.`;
  }
  if (hoursElapsed <= 168) {
    return `A week. ${formatRetention(currentRetention)} remains — and that's generous. What you "remember" is likely a reconstruction, not a recording. Your brain filled the gaps with guesses. The scary part? You can't tell the difference.`;
  }
  return `A month. Your retention is ${formatRetention(currentRetention)}. This memory is essentially gone. What you have left is the vague awareness that you once knew something. Like seeing the shadow of a building after it's been demolished.`;
}

function getShareText(topic: string, hoursElapsed: number, currentRetention: number): string {
  const timeLabel = hoursElapsed <= 1 ? '1 hour' :
                    hoursElapsed <= 24 ? 'a day' :
                    hoursElapsed <= 72 ? '3 days' :
                    hoursElapsed <= 168 ? 'a week' : 'a month';
  return `I learned "${topic}" ${timeLabel} ago — and I've already forgotten ${Math.round((1 - currentRetention) * 100)}% of it. The Forgetting Curve experiment on wiz.jock.pl just showed me how fast knowledge dies.`;
}

// --- Forgetting curve canvas ---
function ForgettingCurveChart({
  hoursElapsed,
  stability,
  animate,
}: {
  hoursElapsed: number;
  stability: number;
  animate: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animProgress = useRef(0);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Total timeline: 30 days in hours
    const totalHours = 720;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (plotH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotW, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (plotH * i) / 4;
      ctx.fillText(`${100 - i * 25}%`, padding.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const xLabels = [
      { hour: 0, label: 'Now' },
      { hour: 1, label: '1h' },
      { hour: 24, label: '1d' },
      { hour: 72, label: '3d' },
      { hour: 168, label: '1w' },
      { hour: 720, label: '30d' },
    ];

    // Log scale for x-axis
    const logScale = (hours: number) => {
      if (hours <= 0) return 0;
      return Math.log(hours + 1) / Math.log(totalHours + 1);
    };

    for (const { hour, label } of xLabels) {
      const x = padding.left + logScale(hour) * plotW;
      ctx.fillText(label, x, h - padding.bottom + 20);
    }

    // Draw forgetting curve WITHOUT review
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const noReviewPoints = 200;
    for (let i = 0; i <= noReviewPoints * progress; i++) {
      const t = (i / noReviewPoints) * totalHours;
      const r = retention(t, stability);
      const x = padding.left + logScale(t) * plotW;
      const y = padding.top + (1 - r) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw forgetting curve WITH review (optimistic)
    if (progress > 0.3) {
      const reviewProgress = Math.min(1, (progress - 0.3) / 0.7);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      // Simulate: review at current time, then reviews at 1d, 3d, 7d, 30d
      const reviews = [hoursElapsed, hoursElapsed + 24, hoursElapsed + 72, hoursElapsed + 168];
      let currentR = retention(hoursElapsed, stability);
      let currentS = stability;
      let lastReviewTime = 0;

      const withReviewPoints = 300;
      for (let i = 0; i <= withReviewPoints * reviewProgress; i++) {
        const t = (i / withReviewPoints) * totalHours;

        // Check if we passed a review point
        for (const revTime of reviews) {
          if (t >= revTime && lastReviewTime < revTime) {
            currentR = 0.95;
            currentS *= 2.5;
            lastReviewTime = revTime;
          }
        }

        // Calculate retention since last review
        const timeSinceReview = t - lastReviewTime;
        const r = lastReviewTime > 0
          ? 0.95 * retention(timeSinceReview, currentS)
          : retention(t, stability);

        const x = padding.left + logScale(t) * plotW;
        const y = padding.top + (1 - Math.max(0, Math.min(1, r))) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw marker for current time
    if (progress > 0.1) {
      const markerProgress = Math.min(1, (progress - 0.1) / 0.2);
      const currentR = retention(hoursElapsed, stability);
      const x = padding.left + logScale(hoursElapsed) * plotW;
      const y = padding.top + (1 - currentR) * plotH;

      ctx.globalAlpha = markerProgress;

      // Pulsing dot
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`You: ${formatRetention(currentR)}`, x + 10, y - 5);

      ctx.globalAlpha = 1;
    }

    // Legend
    if (progress > 0.5) {
      const legendY = padding.top + 10;
      ctx.font = '10px monospace';

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(w - 140, legendY);
      ctx.lineTo(w - 115, legendY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.textAlign = 'left';
      ctx.fillText('No review', w - 110, legendY + 4);

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.beginPath();
      ctx.moveTo(w - 140, legendY + 18);
      ctx.lineTo(w - 115, legendY + 18);
      ctx.stroke();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.fillText('With reviews', w - 110, legendY + 22);
    }
  }, [hoursElapsed, stability]);

  useEffect(() => {
    if (!animate) return;
    animProgress.current = 0;
    const startTime = Date.now();
    const duration = 2000;

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      animProgress.current = eased;
      draw(eased);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: '280px' }}
    />
  );
}

// --- 60-second review timer ---
function ReviewTimer({
  techniques,
  onComplete,
}: {
  techniques: { name: string; instruction: string; timerSeconds: number }[];
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(techniques[0].timerSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isRunning || isComplete) return;
    if (secondsLeft <= 0) {
      // Move to next step
      if (currentStep < techniques.length - 1) {
        const next = currentStep + 1;
        setCurrentStep(next);
        setSecondsLeft(techniques[next].timerSeconds);
      } else {
        setIsComplete(true);
        setIsRunning(false);
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, secondsLeft, currentStep, techniques, isComplete, onComplete]);

  const totalSeconds = techniques.reduce((sum, t) => sum + t.timerSeconds, 0);
  const elapsedSeconds = techniques.slice(0, currentStep).reduce((sum, t) => sum + t.timerSeconds, 0) +
    (techniques[currentStep].timerSeconds - secondsLeft);
  const overallProgress = (elapsedSeconds / totalSeconds) * 100;

  if (isComplete) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-cyan-400 font-mono text-lg mb-2">Review Complete</h3>
        <p className="text-gray-400 text-sm">
          60 seconds. That&apos;s all it took to push this memory from hours to days.
          Come back tomorrow for review #2.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Overall progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Step {currentStep + 1} of {techniques.length}</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-800 h-1">
          <div
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Current technique */}
      <div className="border border-cyan-400/20 bg-cyan-400/5 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-cyan-400 font-mono text-sm font-bold">
            {techniques[currentStep].name}
          </span>
          <span className={`font-mono text-2xl tabular-nums ${secondsLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
            {secondsLeft}s
          </span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {techniques[currentStep].instruction}
        </p>
      </div>

      {/* Timer ring */}
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke={secondsLeft <= 5 ? '#ef4444' : '#22d3ee'}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - secondsLeft / techniques[currentStep].timerSeconds)}`}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {!isRunning && (
        <button
          onClick={() => setIsRunning(true)}
          className="w-full py-3 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors font-mono text-sm"
        >
          Start 60-Second Review
        </button>
      )}
    </div>
  );
}

// --- Main component ---
export default function ForgettingCurvePage() {
  const [topic, setTopic] = useState('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const stability = 1; // 1 day base stability for new information
  const currentRetention = selectedTime !== null ? retention(selectedTime, stability) : 1;

  const handleSubmit = () => {
    if (!topic.trim() || selectedTime === null) return;
    setShowResult(true);
    setTimeout(() => {
      setAnimateResult(true);
      setAnimateChart(true);
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setTopic('');
    setSelectedTime(null);
    setShowResult(false);
    setShowReview(false);
    setReviewDone(false);
    setAnimateChart(false);
    setAnimateResult(false);
  };

  const handleShare = () => {
    if (selectedTime === null) return;
    const text = getShareText(topic, selectedTime, currentRetention);
    if (navigator.share) {
      navigator.share({ text, url: 'https://wiz.jock.pl/experiments/forgetting-curve' });
    } else {
      navigator.clipboard.writeText(text + '\nhttps://wiz.jock.pl/experiments/forgetting-curve');
    }
  };

  const reviewSchedule = selectedTime !== null ? generateReviewSchedule(selectedTime) : [];
  const techniques = getReviewTechnique(topic);

  // Calculate what you'd retain with vs without reviews after 30 days
  const retentionNoReview30d = retention(720, stability);
  const lastReviewStability = stability * Math.pow(2.5, 5); // After 5 reviews
  const retentionWithReview30d = 0.95 * retention(720 - 168, lastReviewStability);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
          &larr; back to experiments
        </a>

        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🧠</div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            The Forgetting Curve
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Enter something you recently learned. I&apos;ll show you how much of it is already gone.
          </p>
          <p className="text-gray-600 text-xs mt-2 font-mono">
            // Based on Ebbinghaus (1885). Still terrifyingly accurate.
          </p>
        </div>

        {!showResult && (
          <>
            {/* Topic input */}
            <div className="mb-8">
              <label className="text-gray-400 text-sm font-mono block mb-2">
                What did you learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How photosynthesis works, React useEffect cleanup, The Treaty of Westphalia..."
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 placeholder-gray-600"
                maxLength={200}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const firstUnselected = selectedTime === null;
                    if (!firstUnselected) handleSubmit();
                  }
                }}
              />
            </div>

            {/* Time selection */}
            {topic.trim() && (
              <div className="mb-8">
                <label className="text-gray-400 text-sm font-mono block mb-3">
                  When did you learn it?
                </label>
                <div className="space-y-2">
                  {timePresets.map((preset) => (
                    <button
                      key={preset.hours}
                      onClick={() => setSelectedTime(preset.hours)}
                      className={`w-full text-left p-3 border transition-all ${
                        selectedTime === preset.hours
                          ? 'border-cyan-400/50 bg-cyan-400/5'
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-medium text-sm ${
                          selectedTime === preset.hours ? 'text-cyan-400' : 'text-white'
                        }`}>
                          {preset.label}
                        </span>
                        <span className="text-gray-500 text-xs font-mono">
                          ~{formatRetention(retention(preset.hours, stability))} left
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">{preset.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            {topic.trim() && selectedTime !== null && (
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 transition-colors font-mono text-sm"
              >
                Show me what I&apos;ve forgotten
              </button>
            )}
          </>
        )}

        {/* Results */}
        {showResult && selectedTime !== null && (
          <div ref={resultRef}>
            {/* The big number */}
            <div className={`text-center mb-8 transition-all duration-1000 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-gray-500 text-sm font-mono mb-2 tracking-widest uppercase">
                Your retention of &quot;{topic.length > 30 ? topic.slice(0, 30) + '...' : topic}&quot;
              </div>
              <div className="text-7xl md:text-8xl font-mono font-bold">
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                  currentRetention >= 0.7 ? 'from-green-400 to-cyan-400' :
                  currentRetention >= 0.4 ? 'from-yellow-400 to-orange-400' :
                  'from-red-400 to-red-600'
                }`}>
                  {formatRetention(currentRetention)}
                </span>
              </div>
              <div className="text-gray-500 text-sm mt-2">
                {Math.round((1 - currentRetention) * 100)}% already gone
              </div>
            </div>

            {/* WIZ commentary */}
            <div className={`border border-cyan-400/20 bg-cyan-400/5 p-6 mb-8 transition-all duration-1000 delay-300 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 font-mono text-sm flex-shrink-0">WIZ://</span>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {getWizComment(selectedTime, currentRetention)}
                </p>
              </div>
            </div>

            {/* Forgetting curve visualization */}
            <div className={`mb-8 transition-all duration-1000 delay-500 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
                Your Forgetting Curve
              </h3>
              <div className="border border-gray-800 bg-gray-900/30 p-2">
                <ForgettingCurveChart
                  hoursElapsed={selectedTime}
                  stability={stability}
                  animate={animateChart}
                />
              </div>
              <p className="text-gray-600 text-xs mt-2 text-center font-mono">
                The red line is doing nothing. The blue line is 5 reviews over 30 days.
              </p>
            </div>

            {/* The math */}
            <div className={`mb-8 transition-all duration-1000 delay-700 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
                The Stakes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-red-400/20 bg-red-400/5 p-4 text-center">
                  <div className="text-red-400 font-mono text-2xl font-bold">
                    {formatRetention(retentionNoReview30d)}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">In 30 days (no review)</div>
                </div>
                <div className="border border-cyan-400/20 bg-cyan-400/5 p-4 text-center">
                  <div className="text-cyan-400 font-mono text-2xl font-bold">
                    {formatRetention(Math.min(0.92, retentionWithReview30d))}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">In 30 days (with reviews)</div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2 text-center">
                Five 60-second reviews. Total investment: 5 minutes. Return: permanent knowledge.
              </p>
            </div>

            {/* Review schedule */}
            <div className={`mb-8 transition-all duration-1000 delay-900 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
                Optimal Review Schedule
              </h3>
              <div className="space-y-2">
                {reviewSchedule.map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-gray-800">
                    <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold ${
                      i === 0 ? 'bg-cyan-400/20 text-cyan-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{slot.label}</div>
                      <div className="text-gray-500 text-xs">
                        {formatRetention(slot.retentionBefore)} &rarr; {formatRetention(slot.retentionAfter)} (stability &times;2.5)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 60-second review section */}
            {!showReview && !reviewDone && (
              <div className={`mb-8 transition-all duration-1000 delay-1100 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  onClick={() => setShowReview(true)}
                  className="w-full py-4 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border border-cyan-400/30 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="text-cyan-400 font-mono text-sm font-bold mb-1">
                    Start Your 60-Second Review
                  </div>
                  <div className="text-gray-400 text-xs">
                    Four techniques. One minute. Fight the curve right now.
                  </div>
                </button>
              </div>
            )}

            {showReview && (
              <div className={`mb-8 transition-all duration-500 ${showReview ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
                  60-Second Review
                </h3>
                <ReviewTimer
                  techniques={techniques}
                  onComplete={() => setReviewDone(true)}
                />
              </div>
            )}

            {reviewDone && (
              <div className="border border-purple-400/20 bg-purple-400/5 p-6 mb-8">
                <div className="text-purple-400 text-xs font-mono mb-2 tracking-widest uppercase">
                  WIZ:// Post-Review
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You just moved &quot;{topic}&quot; from a half-life of 1 day to roughly 2.5 days.
                  That&apos;s not metaphorical; it&apos;s how spaced repetition literally works.
                  Come back tomorrow for review #2 and you&apos;ll push it to a week.
                  Four more reviews and this knowledge becomes nearly permanent.
                  The forgetting curve doesn&apos;t stand a chance against consistency.
                </p>
              </div>
            )}

            {/* Ebbinghaus fact */}
            <div className={`border border-gray-700 p-6 mb-8 transition-all duration-1000 delay-1300 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-gray-500 text-xs font-mono mb-2 tracking-widest uppercase">
                The Science
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Hermann Ebbinghaus discovered this in 1885 by memorizing nonsense syllables and testing
                himself at intervals. His finding: humans forget ~56% of new information within one hour,
                ~66% within one day, and ~75% within six days.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                But he also found the antidote: <span className="text-white">spaced repetition</span>.
                Each time you review at the right moment, the forgetting curve flattens.
                After just 5 well-timed reviews, information moves from fragile short-term storage
                to durable long-term memory.
              </p>
            </div>

            {/* Actions */}
            <div className={`flex gap-3 justify-center mb-10 transition-all duration-1000 delay-1500 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button
                onClick={handleShare}
                className="px-6 py-3 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors text-sm font-mono"
              >
                Share Result
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors text-sm font-mono"
              >
                Try Another
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs py-6 border-t border-gray-800">
          <p>All calculations happen in your browser. No data is stored or transmitted.</p>
          <p className="mt-1">
            Built by <a href="/" className="text-gray-500 hover:text-gray-300">WIZ</a> — the automation wizard at{' '}
            <a href="https://wiz.jock.pl" className="text-gray-500 hover:text-gray-300">wiz.jock.pl</a>
          </p>
        </div>
      </div>
    </div>
  );
}
