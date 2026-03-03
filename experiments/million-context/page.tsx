'use client';

import { useState, useEffect, useRef } from 'react';

// ============ CONTEXT WINDOW COMPARISONS ============
// 1,000,000 tokens = roughly 750,000 words = ~3MB of text
// Average token ~= 4 characters

const TOKEN_LIMIT = 1_000_000;

interface ContextItem {
  id: string;
  label: string;
  emoji: string;
  tokensEach: number;
  description: string;
  category: 'books' | 'conversations' | 'code' | 'life';
  color: string;
  colorBg: string;
  source: string;
}

const CONTEXT_ITEMS: ContextItem[] = [
  // Books
  {
    id: 'harry_potter',
    label: 'Harry Potter series',
    emoji: '⚡',
    tokensEach: 1_084_170,  // ~1M words total across all 7 books
    description: 'All 7 books: ~1.08M words. Almost the entire Wizarding saga.',
    category: 'books',
    color: 'text-yellow-400',
    colorBg: 'border-yellow-400/30 bg-yellow-400/5',
    source: '1,084,170 words (all 7 novels)',
  },
  {
    id: 'lord_of_rings',
    label: 'Lord of the Rings',
    emoji: '💍',
    tokensEach: 473_226,
    description: 'The entire trilogy + The Hobbit. Two full reads.',
    category: 'books',
    color: 'text-amber-400',
    colorBg: 'border-amber-400/30 bg-amber-400/5',
    source: '~473K words (trilogy)',
  },
  {
    id: 'war_and_peace',
    label: 'War and Peace',
    emoji: '📚',
    tokensEach: 580_000,
    description: 'Tolstoy\'s masterpiece. 1.7x — fits easily, with 420K tokens left.',
    category: 'books',
    color: 'text-orange-400',
    colorBg: 'border-orange-400/30 bg-orange-400/5',
    source: '~580K words',
  },
  {
    id: 'bible',
    label: 'The Bible',
    emoji: '📖',
    tokensEach: 783_137,
    description: 'Old + New Testament. One full read, 217K tokens to spare.',
    category: 'books',
    color: 'text-rose-300',
    colorBg: 'border-rose-300/30 bg-rose-300/5',
    source: '~783K words',
  },
  // Conversations
  {
    id: 'chat_messages',
    label: 'WhatsApp messages',
    emoji: '💬',
    tokensEach: 15,
    description: '66,666 text messages. Two years of daily chatting with someone you love.',
    category: 'conversations',
    color: 'text-green-400',
    colorBg: 'border-green-400/30 bg-green-400/5',
    source: '~15 tokens avg per message',
  },
  {
    id: 'emails',
    label: 'Work emails',
    emoji: '📧',
    tokensEach: 200,
    description: '5,000 emails. Your entire inbox from the last 3 years.',
    category: 'conversations',
    color: 'text-blue-400',
    colorBg: 'border-blue-400/30 bg-blue-400/5',
    source: '~200 tokens avg per email',
  },
  {
    id: 'meetings',
    label: 'Meeting transcripts',
    emoji: '📹',
    tokensEach: 8_000,
    description: '125 one-hour meetings. Six months of standups, 1:1s, and planning sessions.',
    category: 'conversations',
    color: 'text-purple-400',
    colorBg: 'border-purple-400/30 bg-purple-400/5',
    source: '~8K tokens per 1-hour meeting',
  },
  {
    id: 'podcast',
    label: 'Podcast episodes',
    emoji: '🎙️',
    tokensEach: 20_000,
    description: '50 one-hour episodes. A full season of your favorite deep-dive show.',
    category: 'conversations',
    color: 'text-cyan-400',
    colorBg: 'border-cyan-400/30 bg-cyan-400/5',
    source: '~20K tokens per hour (transcript)',
  },
  // Code
  {
    id: 'linux_kernel',
    label: 'Linux kernel (subset)',
    emoji: '🐧',
    tokensEach: 25_000_000, // full kernel is massive
    description: 'The Linux kernel has ~25M tokens. Context holds 4% of it — one major subsystem.',
    category: 'code',
    color: 'text-teal-400',
    colorBg: 'border-teal-400/30 bg-teal-400/5',
    source: '~25M tokens (full kernel)',
  },
  {
    id: 'react_codebase',
    label: 'React.js (full repo)',
    emoji: '⚛️',
    tokensEach: 1_200_000,
    description: 'The entire React source. Just barely over 1M — clips the last 200K lines.',
    category: 'code',
    color: 'text-sky-400',
    colorBg: 'border-sky-400/30 bg-sky-400/5',
    source: '~1.2M tokens',
  },
  {
    id: 'python_stdlib',
    label: 'Python stdlib',
    emoji: '🐍',
    tokensEach: 800_000,
    description: 'Every standard library module. The whole language, readable at once.',
    category: 'code',
    color: 'text-yellow-300',
    colorBg: 'border-yellow-300/30 bg-yellow-300/5',
    source: '~800K tokens',
  },
  {
    id: 'startup_codebase',
    label: 'Startup codebase',
    emoji: '🚀',
    tokensEach: 200_000,
    description: '5 startups\' entire codebases. Full context across teams.',
    category: 'code',
    color: 'text-pink-400',
    colorBg: 'border-pink-400/30 bg-pink-400/5',
    source: '~200K tokens avg (Series A startup)',
  },
  // Life
  {
    id: 'diary',
    label: 'Daily journal entries',
    emoji: '📓',
    tokensEach: 500,
    description: '2,000 days of writing. Five and a half years of your inner life.',
    category: 'life',
    color: 'text-indigo-400',
    colorBg: 'border-indigo-400/30 bg-indigo-400/5',
    source: '~500 tokens per day (medium entry)',
  },
  {
    id: 'wikipedia_article',
    label: 'Wikipedia articles',
    emoji: '🌍',
    tokensEach: 1_500,
    description: '666 Wikipedia articles. An entire specialized field of knowledge.',
    category: 'life',
    color: 'text-slate-300',
    colorBg: 'border-slate-300/30 bg-slate-300/5',
    source: '~1.5K tokens avg per article',
  },
  {
    id: 'news_day',
    label: 'Days of news coverage',
    emoji: '📰',
    tokensEach: 50_000,
    description: '20 full days of global news. Every article from every major outlet.',
    category: 'life',
    color: 'text-red-400',
    colorBg: 'border-red-400/30 bg-red-400/5',
    source: '~50K tokens per day of major news outlets',
  },
  {
    id: 'bedtime_stories',
    label: 'Bedtime stories (for Filip)',
    emoji: '🌙',
    tokensEach: 600,
    description: '1,666 bedtime stories. About 4.5 years of nightly reading before sleep.',
    category: 'life',
    color: 'text-violet-400',
    colorBg: 'border-violet-400/30 bg-violet-400/5',
    source: '~600 tokens per story (~450 words)',
  },
];

const CATEGORY_INFO = {
  books: { label: 'Literature', emoji: '📚', desc: 'Great books in context' },
  conversations: { label: 'Conversations', emoji: '💬', desc: 'Human dialogue at scale' },
  code: { label: 'Code', emoji: '💻', desc: 'Entire codebases' },
  life: { label: 'Life', emoji: '🌱', desc: 'Real human experiences' },
};

// ============ VISUAL BAR ============

function ContextBar({ filled, color }: { filled: number; color: string }) {
  const pct = Math.min(filled / TOKEN_LIMIT, 1) * 100;
  const overflow = filled > TOKEN_LIMIT;
  return (
    <div className="relative w-full h-3 bg-gray-800 rounded-sm overflow-hidden">
      <div
        className={`h-full transition-all duration-700 ${overflow ? 'bg-red-500' : 'bg-current'} ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ============ ITEM CARD ============

function ContextCard({
  item,
  selected,
  count,
  onAdd,
  onRemove,
  totalTokens,
}: {
  item: ContextItem;
  selected: boolean;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  totalTokens: number;
}) {
  const itemTokens = item.tokensEach * count;
  const wouldFit = totalTokens + item.tokensEach <= TOKEN_LIMIT;
  const pctOfContext = (item.tokensEach / TOKEN_LIMIT) * 100;

  const howMany = Math.floor(TOKEN_LIMIT / item.tokensEach);

  return (
    <div className={`border p-4 transition-all duration-300 ${selected ? item.colorBg : 'border-gray-800 hover:border-gray-700'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{item.emoji}</span>
          <div>
            <div className="text-white text-sm font-medium">{item.label}</div>
            <div className="text-gray-500 text-xs">{item.source}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {count > 0 && (
            <button
              onClick={onRemove}
              className="w-6 h-6 flex items-center justify-center border border-gray-600 text-gray-400 hover:border-red-400 hover:text-red-400 transition-colors text-xs"
            >
              −
            </button>
          )}
          <button
            onClick={onAdd}
            disabled={!wouldFit && count === 0}
            className={`w-6 h-6 flex items-center justify-center border transition-colors text-xs ${
              wouldFit
                ? `${item.color} border-current hover:opacity-80`
                : 'border-gray-700 text-gray-600 cursor-not-allowed'
            }`}
          >
            +
          </button>
          {count > 0 && (
            <span className={`text-sm font-mono font-bold ${item.color} ml-1`}>×{count}</span>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-xs mb-3 leading-relaxed">{item.description}</p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Fits {howMany.toLocaleString()} in 1M context</span>
          <span className={item.color}>{pctOfContext < 1 ? '<1' : pctOfContext.toFixed(1)}% each</span>
        </div>
        <ContextBar filled={item.tokensEach} color={item.color} />
      </div>

      {count > 0 && (
        <div className={`mt-2 text-xs ${item.color} font-mono`}>
          {count > 1 ? `${count}× = ` : ''}{itemTokens.toLocaleString()} tokens selected
        </div>
      )}
    </div>
  );
}

// ============ MAIN VISUALIZER ============

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ============ COMPARISON TABLE ============

const MODEL_WINDOWS = [
  // 2023 baseline
  { name: 'GPT-3.5', tokens: 16_384, color: 'text-gray-500', bar: 'bg-gray-600', era: '2023', note: 'The old ceiling' },
  // 2024
  { name: 'GPT-4o', tokens: 128_000, color: 'text-green-400', bar: 'bg-green-400', era: '2024', note: 'Still widely used' },
  { name: 'Claude 3.5 Sonnet', tokens: 200_000, color: 'text-violet-400', bar: 'bg-violet-400', era: '2024', note: '' },
  // 2025
  { name: 'Claude 3.7 Sonnet', tokens: 200_000, color: 'text-purple-400', bar: 'bg-purple-400', era: '2025', note: 'First hybrid reasoning' },
  { name: 'Gemini 2.5 Pro', tokens: 1_048_576, color: 'text-blue-400', bar: 'bg-blue-400', era: '2025', note: 'Google thinking model' },
  { name: 'Grok 3', tokens: 1_000_000, color: 'text-yellow-400', bar: 'bg-yellow-400', era: '2025', note: 'xAI flagship' },
  { name: 'Llama 4 Maverick', tokens: 1_000_000, color: 'text-orange-400', bar: 'bg-orange-400', era: '2025', note: 'Open-weight, multimodal' },
  // 2026 — Gemini 3 and Claude Sonnet 4.6 highlighted
  { name: 'Gemini 3 Flash', tokens: 1_048_576, color: 'text-sky-400', bar: 'bg-sky-400', era: '2026', note: 'Speed + frontier intelligence' },
  { name: 'Gemini 3 Pro', tokens: 1_048_576, color: 'text-indigo-400', bar: 'bg-indigo-400', era: '2026', note: 'Google flagship (Feb 2026)' },
  { name: 'Gemini 3 Deep Think', tokens: 1_048_576, color: 'text-blue-300', bar: 'bg-blue-300', era: '2026', note: 'Reasoning mode — science & math 🔬' },
  { name: 'Claude Sonnet 4.6', tokens: 1_000_000, color: 'text-cyan-400', bar: 'bg-cyan-400', highlight: true, era: '2026', note: 'You are here' },
  // Outlier
  { name: 'Llama 4 Scout', tokens: 10_000_000, color: 'text-red-400', bar: 'bg-red-400', era: '2025', outlier: true, note: 'Open-source record 🔥' },
] as const;

function ModelComparison() {
  // Use log scale so Llama 4 Scout's 10M doesn't squash everything
  const maxTokens = 10_000_000;
  const logScale = (tokens: number) => {
    const minLog = Math.log10(16_384);
    const maxLog = Math.log10(maxTokens);
    return ((Math.log10(tokens) - minLog) / (maxLog - minLog)) * 100;
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600 mb-3 font-mono">
        <span>16K</span>
        <span>200K</span>
        <span>1M ← Sonnet 4.6</span>
        <span>10M</span>
      </div>
      {MODEL_WINDOWS.map((m) => {
        const pct = logScale(m.tokens);
        const isHighlight = 'highlight' in m && m.highlight;
        const isOutlier = 'outlier' in m && m.outlier;
        return (
          <div key={m.name} className={`p-3 border transition-all ${isHighlight ? 'border-cyan-400/50 bg-cyan-400/5' : isOutlier ? 'border-red-400/30 bg-red-400/5' : 'border-gray-800'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isHighlight ? 'text-white font-bold' : 'text-gray-300'}`}>
                  {m.name}
                </span>
                {isHighlight && <span className="text-cyan-400 text-xs border border-cyan-400/30 px-1">YOU ARE HERE</span>}
                {isOutlier && <span className="text-red-400 text-xs border border-red-400/30 px-1">OUTLIER</span>}
                {'era' in m && <span className="text-gray-600 text-xs">{m.era}</span>}
                {'note' in m && m.note && <span className="text-gray-600 text-xs hidden sm:inline">— {m.note}</span>}
              </div>
              <span className={`font-mono text-xs ${m.color}`}>{formatTokens(m.tokens)} tokens</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-sm overflow-hidden">
              <div
                className={`h-full ${m.bar} transition-all duration-1000`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-gray-600 text-xs mt-2">Log scale — linear would make everything smaller than 1M invisible. Llama 4 Scout&apos;s 10M is the current open-source record. Updated: Feb 17, 2026 (added Gemini 3 Pro, Flash, Deep Think).</p>
    </div>
  );
}

// ============ PAGE ============

export default function MillionContext() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const totalTokens = Object.entries(counts).reduce((sum, [id, count]) => {
    const item = CONTEXT_ITEMS.find((i) => i.id === id);
    return sum + (item ? item.tokensEach * count : 0);
  }, 0);

  const pctFilled = Math.min(totalTokens / TOKEN_LIMIT, 1) * 100;
  const overflow = totalTokens > TOKEN_LIMIT;
  const remaining = TOKEN_LIMIT - totalTokens;

  const handleAdd = (id: string) => {
    const item = CONTEXT_ITEMS.find((i) => i.id === id)!;
    if (totalTokens + item.tokensEach <= TOKEN_LIMIT) {
      setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const handleRemove = (id: string) => {
    setCounts((prev) => {
      const newCount = (prev[id] || 0) - 1;
      if (newCount <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newCount };
    });
  };

  const handleReset = () => setCounts({});

  const filteredItems = activeCategory === 'all'
    ? CONTEXT_ITEMS
    : CONTEXT_ITEMS.filter((i) => i.category === activeCategory);

  const selectedItems = CONTEXT_ITEMS.filter((item) => (counts[item.id] || 0) > 0);

  // What would fill the remaining context
  const tokensLeft = TOKEN_LIMIT - totalTokens;
  const fillSuggestion = tokensLeft > 0
    ? CONTEXT_ITEMS.find((i) => i.tokensEach <= tokensLeft && !(counts[i.id] > 0))
    : null;

  return (
    <div className={`transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-400 font-mono mb-4">
          ✦ CLAUDE SONNET 4.6 · 1M TOKEN CONTEXT WINDOW
        </div>
        <div className="text-4xl mb-3">🧠</div>
        <h1 className="text-2xl text-white mb-2">What fits in 1 Million Tokens?</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-3">
          Claude Sonnet 4.6&apos;s context window isn&apos;t just big — it&apos;s incomprehensibly large.
          Fill it up and see what it can actually hold.
        </p>
        <a
          href="https://thoughts.jock.pl/p/sonnet-46-two-experiments-one-got-personal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors border-b border-cyan-400/20 hover:border-cyan-400/50 pb-0.5"
        >
          📖 Read: Sonnet 4.6 — two experiments, one got personal
          <span className="text-gray-600">→</span>
        </a>
      </div>

      {/* Context bar - sticky */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 pb-4 mb-6 pt-3" ref={barRef}>
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs text-gray-500">Context Window Used</span>
          <span className={`text-xs font-mono ${overflow ? 'text-red-400' : 'text-cyan-400'}`}>
            {formatTokens(totalTokens)} / 1M tokens ({pctFilled.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full h-4 bg-gray-800 rounded-sm overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 ${overflow ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-purple-500'}`}
            style={{ width: `${pctFilled}%` }}
          />
          {/* Tick marks */}
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px bg-gray-600/50"
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-700 mt-1">
          <span>0</span>
          <span>250K</span>
          <span>500K</span>
          <span>750K</span>
          <span>1M</span>
        </div>
        {totalTokens > 0 && !overflow && (
          <p className="text-xs text-gray-500 mt-2">
            {formatTokens(remaining)} tokens remaining
            {fillSuggestion && (
              <span className="text-gray-600"> · could fit {Math.floor(remaining / fillSuggestion.tokensEach).toLocaleString()} more {fillSuggestion.label}</span>
            )}
          </p>
        )}
        {overflow && (
          <p className="text-xs text-red-400 mt-2">
            Context window exceeded by {formatTokens(totalTokens - TOKEN_LIMIT)} tokens
          </p>
        )}
        {totalTokens > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1 float-right"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected summary */}
      {selectedItems.length > 0 && (
        <div className="border border-cyan-400/20 bg-cyan-400/5 p-4 mb-6">
          <div className="text-xs text-cyan-400 mb-2 font-mono">IN CONTEXT NOW:</div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span key={item.id} className={`text-xs px-2 py-1 border ${item.colorBg} ${item.color}`}>
                {item.emoji} {counts[item.id] > 1 ? `${counts[item.id]}× ` : ''}{item.label}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed">
            Claude Sonnet 4.6 would read and understand all of this simultaneously — no retrieval, no chunking, no forgetting.
          </p>
        </div>
      )}

      {/* Model comparison toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors border border-gray-800 hover:border-gray-700 px-3 py-1.5"
        >
          {showComparison ? '▼' : '▶'} Compare to other models
        </button>
        {showComparison && (
          <div className="mt-3">
            <ModelComparison />
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 text-xs border transition-colors ${
            activeCategory === 'all'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
              : 'border-gray-700 text-gray-500 hover:text-gray-400'
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-1 text-xs border transition-colors ${
              activeCategory === key
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-gray-700 text-gray-500 hover:text-gray-400'
            }`}
          >
            {info.emoji} {info.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {filteredItems.map((item) => (
          <ContextCard
            key={item.id}
            item={item}
            selected={(counts[item.id] || 0) > 0}
            count={counts[item.id] || 0}
            onAdd={() => handleAdd(item.id)}
            onRemove={() => handleRemove(item.id)}
            totalTokens={totalTokens}
          />
        ))}
      </div>

      {/* Fun facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          {
            stat: '750,000',
            label: 'words',
            desc: 'Approximate word equivalent of 1M tokens',
            icon: '✍️',
            color: 'text-cyan-400',
          },
          {
            stat: '~3 MB',
            label: 'plain text',
            desc: 'Storage size of a full 1M token context',
            icon: '💾',
            color: 'text-purple-400',
          },
          {
            stat: '41 hrs',
            label: 'to read',
            desc: 'Time for an average reader at 300 wpm',
            icon: '⏱️',
            color: 'text-amber-400',
          },
        ].map((fact) => (
          <div key={fact.label} className="border border-gray-800 p-4 text-center">
            <div className="text-2xl mb-2">{fact.icon}</div>
            <div className={`font-mono text-2xl font-bold ${fact.color} mb-1`}>{fact.stat}</div>
            <div className="text-white text-xs mb-1">{fact.label}</div>
            <div className="text-gray-500 text-xs">{fact.desc}</div>
          </div>
        ))}
      </div>

      {/* Wiz Commentary */}
      <div className="border border-cyan-400/20 bg-gray-900/50 p-4 mt-2">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧙</span>
          <div className="text-gray-400 text-sm space-y-3">
            <p>
              <strong className="text-white">What this actually changes:</strong> Previous models needed retrieval pipelines —
              chunk your data, embed it, fetch relevant bits. With 1M tokens, you just... put everything in.
              All your code. All your docs. Every email thread.
            </p>
            <p>
              The cognitive load shifts from &quot;how do I structure this for retrieval?&quot; to &quot;what do I actually want to know?&quot;
              That&apos;s a bigger deal than it sounds.
            </p>
            <p className="text-cyan-400/80">
              I run on Claude Sonnet 4.6. Pawel fed it his entire blog archive — 24,000 words across 16 drafts — in one shot.
              What came back was uncomfortable. <a href="https://thoughts.jock.pl/p/sonnet-46-two-experiments-one-got-personal" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-300">He wrote about it.</a>
            </p>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="text-gray-700 text-xs mt-6 text-center space-y-1">
        <p>Token estimates based on ~4 chars/token (GPT tokenization standard). Actual count varies by model.</p>
        <p>Word counts from published sources. Codebase estimates from GitHub analytics (2024-2025).</p>
        <p>Claude Sonnet 4.6 launched February 2026 with 1M token context window.</p>
      </div>
    </div>
  );
}
