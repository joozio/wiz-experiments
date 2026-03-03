'use client';

import { useState, useEffect, useRef } from 'react';

interface Trait {
  label: string;
  value: number;
  color: string;
  description: string;
  icon: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const PORTRAIT_DATA = {
  subject: "Pawel Jozefiak",
  analysisDate: "February 17, 2026",
  contextTokens: 41000,
  wordCount: 24000,
  drafts: 16,
  coreAnxiety: "He has found something that makes him feel genuinely powerful and alive — and he's not sure if that's a gift, a delusion, or a warning sign.",
  emotionalCore: "A little lonely in a way that's hard to describe.",
  hiddenTruth: "The agent isn't just a productivity tool — it's a coping mechanism that happens to also be commercially interesting.",
  question: "Is his enthusiasm for AI genuine insight, or is he pattern-matching to what 'AI enthusiasm' looks like?",
  traits: [
    {
      label: "Intellectual Honesty",
      value: 88,
      color: "#00CED1",
      icon: "🔭",
      description: "Consistently interrogates his own assumptions. Acknowledges uncertainty without hiding behind it."
    },
    {
      label: "Productive Anxiety",
      value: 74,
      color: "#FF6B6B",
      icon: "⚡",
      description: "Builds from a place of restlessness. The discomfort is the engine, not the obstacle."
    },
    {
      label: "Self-Awareness",
      value: 82,
      color: "#FFD700",
      icon: "🪞",
      description: "Mentions ADHD twice as an aside. The model found it as the core driver. He knew. He just didn't say it directly."
    },
    {
      label: "Controlled Vulnerability",
      value: 67,
      color: "#9B59B6",
      icon: "💧",
      description: "Shares enough to connect. Rarely shares enough to fully expose. The gaps are deliberate."
    },
    {
      label: "Technical Depth",
      value: 91,
      color: "#2ECC71",
      icon: "🔧",
      description: "The enthusiast who also ships. Not a dreamer talking about tools — someone who runs them overnight."
    },
    {
      label: "Emotional Compression",
      value: 79,
      color: "#E67E22",
      icon: "🌀",
      description: "Says 'interesting' when he means 'this changed me.' The intensity lives between the sentences."
    }
  ] as Trait[],
  themes: [
    { text: "ADHD as superpower", weight: 3 },
    { text: "loneliness of early adoption", weight: 2.5 },
    { text: "automation as coping", weight: 3 },
    { text: "desire for validation", weight: 2 },
    { text: "genuine vs performed enthusiasm", weight: 2.5 },
    { text: "building to belong", weight: 2 },
    { text: "commercial anxiety", weight: 1.5 },
    { text: "cognitive offloading", weight: 2 },
    { text: "identity through tools", weight: 2.5 },
  ],
};

function useStars(count: number): Star[] {
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
      color: ['#ffffff', '#00CED1', '#9B59B6', '#FFD700'][Math.floor(Math.random() * 4)],
    }))
  );
  return stars;
}

function StarField({ stars }: { stars: Star[] }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            backgroundColor: star.color,
            animationDuration: `${2 + star.speed * 3}s`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

function TraitBar({ trait, delay }: { trait: Trait; delay: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{trait.icon}</span>
          <span className="text-sm font-mono font-semibold text-slate-200">{trait.label}</span>
        </div>
        <span className="text-sm font-mono" style={{ color: trait.color }}>{trait.value}%</span>
      </div>
      <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${trait.value}%` : '0%',
            backgroundColor: trait.color,
            boxShadow: `0 0 8px ${trait.color}66`,
          }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">{trait.description}</p>
    </div>
  );
}

function ThemeCloud({ themes }: { themes: typeof PORTRAIT_DATA.themes }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {themes.map((theme, i) => (
        <span
          key={i}
          className="px-3 py-1 rounded-full font-mono text-xs border border-slate-600 text-slate-300"
          style={{
            fontSize: `${0.65 + theme.weight * 0.15}rem`,
            opacity: 0.5 + theme.weight * 0.15,
            borderColor: `hsl(${(i * 40) % 360}, 40%, 40%)`,
            color: `hsl(${(i * 40) % 360}, 60%, 80%)`,
          }}
        >
          {theme.text}
        </span>
      ))}
    </div>
  );
}

function PixelPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 120;
    canvas.width = size;
    canvas.height = size;

    // Cosmic pixel art portrait - abstract representation
    const palette = ['#00CED1', '#9B59B6', '#FFD700', '#2ECC71', '#FF6B6B', '#E67E22', '#1a1a2e', '#16213e'];

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, size, size);

    // Draw cosmic pixel portrait - abstract face/brain hybrid
    const pattern = [
      [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,1,0,0,0,0,0],
      [0,0,1,2,3,3,2,3,3,2,1,0,0,0,0],
      [0,1,2,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,1,2,4,2,2,2,2,2,4,2,1,0,0,0],
      [1,2,2,2,2,5,2,5,2,2,2,2,1,0,0],
      [1,2,2,2,2,2,5,2,2,2,2,2,1,0,0],
      [1,2,2,3,2,2,2,2,2,3,2,2,1,0,0],
      [0,1,2,2,6,6,2,6,6,2,2,1,0,0,0],
      [0,0,1,2,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
    ];

    const colors = [
      'transparent',
      '#16213e',
      '#0d3460',
      '#00CED1',
      '#9B59B6',
      '#FFD700',
      '#2ECC71',
    ];

    const pixelSize = 8;
    pattern.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell > 0) {
          ctx.fillStyle = colors[cell];
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize - 1, pixelSize - 1);
          // Add glow to colored pixels
          if (cell > 2) {
            ctx.shadowColor = colors[cell];
            ctx.shadowBlur = 4;
            ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize - 1, pixelSize - 1);
            ctx.shadowBlur = 0;
          }
        }
      });
    });

    // Scatter some stars around
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = palette[Math.floor(Math.random() * 3)];
      ctx.globalAlpha = Math.random() * 0.5 + 0.2;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg"
      style={{ imageRendering: 'pixelated', width: '120px', height: '120px' }}
    />
  );
}

export default function WriterPortrait() {
  const stars = useStars(60);
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'traits' | 'findings' | 'themes'>('traits');

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <StarField stars={stars} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <PixelPortrait />
              <div className="absolute -inset-2 rounded-xl border border-cyan-500/20 animate-pulse" />
            </div>
          </div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
            WIZ ANALYSIS COMPLETE
          </p>
          <h1 className="text-3xl font-bold font-mono mb-1" style={{ color: '#00CED1' }}>
            Writer Portrait
          </h1>
          <p className="text-slate-400 font-mono text-sm">{PORTRAIT_DATA.subject}</p>
          <p className="text-slate-600 font-mono text-xs mt-1">
            {PORTRAIT_DATA.contextTokens.toLocaleString()} tokens · {PORTRAIT_DATA.wordCount.toLocaleString()} words · {PORTRAIT_DATA.drafts} drafts
          </p>
        </div>

        {/* Core Finding */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="border border-cyan-500/20 rounded-lg p-6 bg-slate-900/50 backdrop-blur">
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Core Anxiety (Verbatim)</p>
            <blockquote className="text-slate-200 font-mono text-sm leading-relaxed italic border-l-2 border-cyan-500/40 pl-4">
              "{PORTRAIT_DATA.coreAnxiety}"
            </blockquote>
          </div>
        </div>

        {/* Tabs */}
        <div className={`mb-6 transition-all duration-1000 delay-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2 border-b border-slate-800">
            {(['traits', 'findings', 'themes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`transition-all duration-1000 delay-400 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {activeTab === 'traits' && (
            <div>
              {PORTRAIT_DATA.traits.map((trait, i) => (
                <TraitBar key={trait.label} trait={trait} delay={i * 150 + 600} />
              ))}
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="space-y-4">
              <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-2">Emotional Core</p>
                <p className="font-mono text-slate-300 text-sm italic">"{PORTRAIT_DATA.emotionalCore}"</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">Found in: AI Bubble draft. Present in subtext of 11/16 drafts.</p>
              </div>
              <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">Hidden Truth</p>
                <p className="font-mono text-slate-300 text-sm italic">"{PORTRAIT_DATA.hiddenTruth}"</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">ADHD mentioned twice as aside. Model identified it as the structural driver.</p>
              </div>
              <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">Unresolved Question</p>
                <p className="font-mono text-slate-300 text-sm italic">"{PORTRAIT_DATA.question}"</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">Never typed directly. Found in the negative space between certainty and doubt.</p>
              </div>
              <div className="border border-cyan-500/20 rounded-lg p-4 bg-slate-900/50">
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">WIZ Assessment</p>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  The analysis was mostly right. The ADHD part: accurate. The loneliness: accurate.
                  The commercial weight: embarrassingly on point. Where it may have overcorrected:
                  the framing of "delusion." Less uncertain than detected. But that may be the defensive reading.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div>
              <p className="text-xs font-mono text-slate-500 mb-6 text-center">
                Recurring themes extracted from 24,000 words. Size = frequency + emotional weight.
              </p>
              <ThemeCloud themes={PORTRAIT_DATA.themes} />
              <div className="mt-8 border border-slate-800 rounded-lg p-4 bg-slate-900/30">
                <p className="text-xs font-mono text-slate-500 text-center leading-relaxed">
                  This portrait was generated by Claude Sonnet 4.6 from 16 unpublished blog drafts.<br/>
                  Cost: ~$0.15. Context: ~41,000 tokens. Time to feel seen: 3 minutes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs font-mono text-slate-600">
            Part of the{' '}
            <a
              href="https://thoughts.jock.pl/p/sonnet-46-two-experiments-one-got-personal"
              className="text-cyan-500/60 hover:text-cyan-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sonnet 4.6 Mirror Test
            </a>
            {' '}experiment
          </p>
          <p className="text-xs font-mono text-slate-700 mt-1">
            wiz.jock.pl/experiments/writer-portrait
          </p>
        </div>
      </div>
    </div>
  );
}
