'use client';

import { useState, useEffect, useMemo } from 'react';

// ══════════════════════════════════════════════════════
// MODEL DATA - Update dates when new models ship
// Last verified: March 24, 2026
// ══════════════════════════════════════════════════════

type Tier = 'Flagship' | 'Mid' | 'Speed' | 'Reasoning' | 'Open';

interface AIModel {
  name: string;
  company: string;
  releaseDate: string;
  color: string;
  tier: Tier;
}

const MODELS: AIModel[] = [
  { name: 'Claude Opus 4.6',   company: 'Anthropic',       releaseDate: '2026-02-05', color: '#d4a574', tier: 'Flagship' },
  { name: 'Claude Sonnet 4.6', company: 'Anthropic',       releaseDate: '2026-02-17', color: '#d4a574', tier: 'Mid' },
  { name: 'Claude Haiku 4.5',  company: 'Anthropic',       releaseDate: '2025-10-15', color: '#d4a574', tier: 'Speed' },
  { name: 'GPT-5.4',           company: 'OpenAI',          releaseDate: '2026-03-05', color: '#10a37f', tier: 'Flagship' },
  { name: 'GPT-5.4 mini',      company: 'OpenAI',          releaseDate: '2026-03-17', color: '#10a37f', tier: 'Speed' },
  { name: 'Gemini 3.1 Pro',    company: 'Google DeepMind', releaseDate: '2026-02-19', color: '#4285f4', tier: 'Flagship' },
  { name: 'Gemini 3 Flash',    company: 'Google DeepMind', releaseDate: '2025-12-17', color: '#4285f4', tier: 'Speed' },
  { name: 'Grok 4.20',         company: 'xAI',            releaseDate: '2026-02-17', color: '#e8e8e8', tier: 'Flagship' },
  { name: 'Llama 4',           company: 'Meta',            releaseDate: '2025-04-05', color: '#0668e1', tier: 'Open' },
  { name: 'DeepSeek V3.2',     company: 'DeepSeek',        releaseDate: '2025-12-01', color: '#7c6ee1', tier: 'Flagship' },
  { name: 'DeepSeek R1',       company: 'DeepSeek',        releaseDate: '2025-01-20', color: '#7c6ee1', tier: 'Reasoning' },
  { name: 'Mistral Large 3',   company: 'Mistral AI',      releaseDate: '2025-12-02', color: '#ff7000', tier: 'Flagship' },
  { name: 'Mistral Small 4',   company: 'Mistral AI',      releaseDate: '2026-03-16', color: '#ff7000', tier: 'Speed' },
  { name: 'Qwen 3.5',          company: 'Alibaba',         releaseDate: '2026-02-16', color: '#06b6d4', tier: 'Open' },
];

const TIER_COLORS: Record<string, string> = {
  Flagship: '#ffd700', Mid: '#88aaff', Speed: '#88ffaa',
  Reasoning: '#ff88ff', Open: '#ffaa66',
};

// ══════════════════════════════════════════════════════

interface TimeSince {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function getTimeSince(dateStr: string, now: Date): TimeSince {
  const release = new Date(dateStr + 'T00:00:00');
  const diff = Math.max(0, now.getTime() - release.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs: diff,
  };
}

function getFreshness(days: number) {
  if (days <= 7) return { label: 'JUST DROPPED', color: '#00ff88', bg: 'rgba(0,255,136,0.08)', bar: 98, pulse: true };
  if (days <= 14) return { label: 'BRAND NEW', color: '#00ff88', bg: 'rgba(0,255,136,0.06)', bar: 92, pulse: false };
  if (days <= 30) return { label: 'FRESH', color: '#44ff44', bg: 'rgba(68,255,68,0.05)', bar: 80, pulse: false };
  if (days <= 60) return { label: 'WARMING UP', color: '#ccff00', bg: 'rgba(204,255,0,0.05)', bar: 65, pulse: false };
  if (days <= 90) return { label: 'ROOM TEMP', color: '#ffaa00', bg: 'rgba(255,170,0,0.05)', bar: 50, pulse: false };
  if (days <= 150) return { label: 'AGING', color: '#ff7700', bg: 'rgba(255,119,0,0.05)', bar: 35, pulse: false };
  if (days <= 270) return { label: 'VINTAGE', color: '#ff4444', bg: 'rgba(255,68,68,0.05)', bar: 20, pulse: false };
  if (days <= 365) return { label: 'ANCIENT', color: '#cc2222', bg: 'rgba(204,34,34,0.06)', bar: 10, pulse: false };
  return { label: 'FOSSIL', color: '#991111', bg: 'rgba(153,17,17,0.08)', bar: 3, pulse: true };
}

function getQuip(days: number): string {
  if (days <= 7) return 'Still warm from the servers.';
  if (days <= 14) return 'That new model smell.';
  if (days <= 30) return 'Perfectly ripe for production.';
  if (days <= 60) return 'Your competitors might have something newer.';
  if (days <= 90) return 'Three months is three years in AI time.';
  if (days <= 150) return 'Remember when this was the hot new thing?';
  if (days <= 270) return 'At this point, calling it "latest" requires air quotes.';
  if (days <= 365) return 'Almost a full trip around the sun since the last upgrade.';
  return 'This model remembers a simpler time.';
}

type SortOrder = 'stalest' | 'freshest';

export default function ModelFreshness({ buildTime }: { buildTime: number }) {
  // Starts at the build instant so the first client render reproduces the exported
  // HTML byte for byte; the mount effect below swaps in the real clock.
  const [now, setNow] = useState(() => new Date(buildTime));
  const [sort, setSort] = useState<SortOrder>('stalest');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const modelsWithTime = useMemo(() => {
    return MODELS.map(m => ({
      ...m,
      time: getTimeSince(m.releaseDate, now),
    })).sort((a, b) =>
      sort === 'stalest'
        ? b.time.totalMs - a.time.totalMs
        : a.time.totalMs - b.time.totalMs
    );
  }, [now, sort]);

  const avgDays = useMemo(() => {
    const total = modelsWithTime.reduce((s, m) => s + m.time.days, 0);
    return Math.round(total / modelsWithTime.length);
  }, [modelsWithTime]);

  const freshest = useMemo(() =>
    modelsWithTime.reduce((a, b) => a.time.totalMs < b.time.totalMs ? a : b),
    [modelsWithTime]
  );
  const stalest = useMemo(() =>
    modelsWithTime.reduce((a, b) => a.time.totalMs > b.time.totalMs ? a : b),
    [modelsWithTime]
  );

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          How Stale Is Your AI?
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Live countdown since each major AI lab shipped their latest flagship model.
          Every second counts in the arms race.
        </p>
      </div>

      {/* Sort toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setSort('stalest')}
          className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
            sort === 'stalest'
              ? 'border-white/30 text-white bg-white/5'
              : 'border-gray-700 text-gray-500 hover:text-gray-300'
          }`}
        >
          Stalest First
        </button>
        <button
          onClick={() => setSort('freshest')}
          className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
            sort === 'freshest'
              ? 'border-white/30 text-white bg-white/5'
              : 'border-gray-700 text-gray-500 hover:text-gray-300'
          }`}
        >
          Freshest First
        </button>
      </div>

      {/* Model cards */}
      <div className="space-y-3 mb-8">
        {modelsWithTime.map((model, i) => {
          const fresh = getFreshness(model.time.days);
          const quip = getQuip(model.time.days);
          const rank = sort === 'stalest' ? i + 1 : modelsWithTime.length - i;

          return (
            <div
              key={model.name}
              className="border border-gray-800 p-4 md:p-5 transition-all"
              style={{
                background: fresh.bg,
                borderColor: `${fresh.color}22`,
              }}
            >
              {/* Top row: rank, name, company, badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono w-6 text-center opacity-40"
                  >
                    #{rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-lg"
                        style={{ color: model.color }}
                      >
                        {model.name}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {model.company} &middot; Released{' '}
                      {new Date(model.releaseDate + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${fresh.pulse ? 'animate-pulse' : ''}`}
                  style={{
                    color: fresh.color,
                    borderColor: `${fresh.color}44`,
                    background: `${fresh.color}11`,
                  }}
                >
                  {fresh.label}
                </span>
              </div>

              {/* Counter */}
              <div className="font-mono text-center my-4">
                {mounted ? (
                  <span className="text-2xl md:text-3xl tracking-wider" style={{ color: fresh.color }}>
                    <span className="text-white">{model.time.days}</span>
                    <span className="text-gray-500 text-base">d </span>
                    <span className="text-white">{pad(model.time.hours)}</span>
                    <span className="text-gray-500 text-base">h </span>
                    <span className="text-white">{pad(model.time.minutes)}</span>
                    <span className="text-gray-500 text-base">m </span>
                    <span style={{ color: fresh.color }}>{pad(model.time.seconds)}</span>
                    <span className="text-gray-500 text-base">s</span>
                  </span>
                ) : (
                  <span className="text-2xl md:text-3xl text-gray-600">--d --h --m --s</span>
                )}
              </div>

              {/* Freshness bar */}
              <div className="mb-2">
                <div className="h-1.5 bg-gray-800 w-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${fresh.bar}%`,
                      background: `linear-gradient(90deg, ${fresh.color}, ${fresh.color}88)`,
                    }}
                  />
                </div>
              </div>

              {/* Quip */}
              <div className="text-gray-500 text-xs italic text-center">
                &ldquo;{quip}&rdquo;
              </div>
            </div>
          );
        })}
      </div>

      {/* Industry Pulse */}
      <div className="border border-gray-800 bg-gray-900/50 p-5 mb-8">
        <h2 className="text-white text-sm font-mono mb-4 text-center tracking-wider">
          INDUSTRY PULSE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-mono text-white">{mounted ? avgDays : '--'}</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider">Avg Age (days)</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-mono text-white">{MODELS.length}</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider">Labs Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-mono" style={{ color: '#00ff88' }}>
              {mounted ? freshest.name.split(' ').slice(0, 2).join(' ') : '--'}
            </div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider">Freshest</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-mono" style={{ color: '#991111' }}>
              {mounted ? stalest.name.split(' ').slice(0, 2).join(' ') : '--'}
            </div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider">Stalest</div>
          </div>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="border border-gray-800 bg-gray-900/50 p-5 mb-8">
        <h2 className="text-white text-sm font-mono mb-4 text-center tracking-wider">
          FRESHNESS SHELF
        </h2>
        <div className="relative h-12 bg-gray-900 border border-gray-800 overflow-hidden">
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #991111 0%, #ff4444 20%, #ffaa00 40%, #ccff00 60%, #44ff44 80%, #00ff88 100%)',
              opacity: 0.08,
            }}
          />
          {/* Labels */}
          <div className="absolute bottom-0 left-1 text-[8px] text-gray-600 font-mono">FOSSIL</div>
          <div className="absolute bottom-0 right-1 text-[8px] text-gray-600 font-mono">FRESH</div>

          {/* Model dots */}
          {mounted && modelsWithTime.map(model => {
            const maxDays = stalest.time.days + 30;
            const position = Math.max(2, Math.min(98, 100 - (model.time.days / maxDays) * 100));
            const fresh = getFreshness(model.time.days);
            return (
              <div
                key={model.name}
                className="absolute top-1/2 -translate-y-1/2 group"
                style={{ left: `${position}%` }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 cursor-default"
                  style={{
                    backgroundColor: fresh.color,
                    borderColor: model.color,
                    boxShadow: `0 0 8px ${fresh.color}44`,
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 border border-gray-700 px-2 py-1 text-[10px] text-white whitespace-nowrap font-mono">
                    {model.name} ({model.time.days}d)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="border border-gray-800 bg-gray-900/50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">&#x1F9D9;</span>
          <div className="text-gray-400 text-sm space-y-2">
            <p>
              <strong className="text-white">What counts as a flagship?</strong>{' '}
              The most capable model each lab offers. Not fine-tunes, not small variants,
              not beta patches. The big one.
            </p>
            <p>
              In AI, 90 days without an upgrade feels like a lifetime. A year is geological.
              Meta shipped Llama 4 in April 2025 and hasn&apos;t released a successor.
              Meanwhile, OpenAI and Anthropic shipped new flagships in early 2026.
            </p>
            <p className="text-gray-500 text-xs">
              Data verified March 2026. Counters tick from each model&apos;s public release date.
              This page has no API calls. Pure client-side math and existential dread.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="text-gray-600 text-xs mt-8 text-center">
        <p>No data collected. No APIs called. Just timestamps and arithmetic.</p>
      </div>
    </div>
  );
}
