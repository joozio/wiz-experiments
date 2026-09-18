'use client';

import { usePageCopy } from '@/contexts/usePageCopy';
import pl from './pl.json';
import { useState, useRef } from 'react';

// ============ CONTEXT WINDOW COMPARISONS ============
// Estimates, not tokenization: 0.75 English words or 4 source characters per token.

const TOKEN_LIMIT = 1_000_000;

interface ContextItem {
  id: string;
  label: string;
  emoji: string;
  sourceQuantity: number;
  sourceUnit: 'words' | 'characters' | 'tokens';
  tokensEach: number;
  description: string;
  category: 'books' | 'conversations' | 'code' | 'life';
  color: string;
  colorBg: string;
  source: string;
}

const ITEM_SOURCES: Omit<ContextItem, 'tokensEach'>[] = [
  // Books
  {
    id: 'harry_potter',
    label: 'Harry Potter series',
    emoji: '⚡',
    sourceQuantity: 1_084_170, sourceUnit: 'words',
    description: 'Seven novels. Approximate English word count, converted using the assumption below.',
    category: 'books',
    color: 'text-yellow-400',
    colorBg: 'border-yellow-400/30 bg-yellow-400/5',
    source: '1,084,170 words (all 7 novels)',
  },
  {
    id: 'lord_of_rings',
    label: 'Lord of the Rings',
    emoji: '💍',
    sourceQuantity: 473_226, sourceUnit: 'words',
    description: 'The trilogy only, excluding The Hobbit. Approximate English word count.',
    category: 'books',
    color: 'text-amber-400',
    colorBg: 'border-amber-400/30 bg-amber-400/5',
    source: '~473K words (trilogy)',
  },
  {
    id: 'war_and_peace',
    label: 'War and Peace',
    emoji: '📚',
    sourceQuantity: 580_000, sourceUnit: 'words',
    description: 'Approximate English word count. Translation and edition change the total.',
    category: 'books',
    color: 'text-orange-400',
    colorBg: 'border-orange-400/30 bg-orange-400/5',
    source: '~580K words',
  },
  {
    id: 'bible',
    label: 'The Bible',
    emoji: '📖',
    sourceQuantity: 783_137, sourceUnit: 'words',
    description: 'Old and New Testament. Approximate English word count; the estimated tokens exceed 1M.',
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
    sourceQuantity: 15, sourceUnit: 'tokens',
    description: 'One short message. An illustrative budget; length and language vary.',
    category: 'conversations',
    color: 'text-green-400',
    colorBg: 'border-green-400/30 bg-green-400/5',
    source: '~15 tokens avg per message',
  },
  {
    id: 'emails',
    label: 'Work emails',
    emoji: '📧',
    sourceQuantity: 200, sourceUnit: 'tokens',
    description: 'One medium email. An illustrative budget, without attachments.',
    category: 'conversations',
    color: 'text-blue-400',
    colorBg: 'border-blue-400/30 bg-blue-400/5',
    source: '~200 tokens avg per email',
  },
  {
    id: 'meetings',
    label: 'Meeting transcripts',
    emoji: '📹',
    sourceQuantity: 8_000, sourceUnit: 'tokens',
    description: 'A meeting transcript. An illustrative text budget, excluding audio.',
    category: 'conversations',
    color: 'text-purple-400',
    colorBg: 'border-purple-400/30 bg-purple-400/5',
    source: '~8K tokens per 1-hour meeting',
  },
  {
    id: 'podcast',
    label: 'Podcast episodes',
    emoji: '🎙️',
    sourceQuantity: 20_000, sourceUnit: 'tokens',
    description: 'A long podcast transcript. An illustrative text budget, excluding audio.',
    category: 'conversations',
    color: 'text-cyan-400',
    colorBg: 'border-cyan-400/30 bg-cyan-400/5',
    source: '~20K tokens per hour (transcript)',
  },
  // Code
  {
    id: 'linux_kernel',
    label: 'Large repository example',
    emoji: '🐧',
    sourceQuantity: 25_000_000, sourceUnit: 'tokens',
    description: 'A synthetic large repository budget, not a measured Linux release.',
    category: 'code',
    color: 'text-teal-400',
    colorBg: 'border-teal-400/30 bg-teal-400/5',
    source: 'Illustrative code budget, 2026-09-13',
  },
  {
    id: 'react_codebase',
    label: 'React core',
    emoji: '⚛️',
    sourceQuantity: 135_812, sourceUnit: 'characters',
    description: 'React v19.2.0, packages/react: 52 JavaScript files, excluding __tests__. Measured source characters, estimated tokens.',
    category: 'code',
    color: 'text-sky-400',
    colorBg: 'border-sky-400/30 bg-sky-400/5',
    source: '135,812 characters · 2026-09-13',
  },
  {
    id: 'python_stdlib',
    label: 'Python stdlib',
    emoji: '🐍',
    sourceQuantity: 11_899_763, sourceUnit: 'characters',
    description: 'CPython v3.13.0, Lib: 695 Python files, excluding Lib/test. Measured source characters, estimated tokens.',
    category: 'code',
    color: 'text-yellow-300',
    colorBg: 'border-yellow-300/30 bg-yellow-300/5',
    source: '11,899,763 characters · 2026-09-13',
  },
  {
    id: 'startup_codebase',
    label: 'Startup codebase',
    emoji: '🚀',
    sourceQuantity: 200_000, sourceUnit: 'tokens',
    description: 'A synthetic small project budget. Excludes build output, dependencies and images.',
    category: 'code',
    color: 'text-pink-400',
    colorBg: 'border-pink-400/30 bg-pink-400/5',
    source: 'Illustrative code budget, 2026-09-13',
  },
  // Life
  {
    id: 'diary',
    label: 'Daily journal entries',
    emoji: '📓',
    sourceQuantity: 500, sourceUnit: 'tokens',
    description: 'One journal entry. An illustrative budget for a few paragraphs.',
    category: 'life',
    color: 'text-indigo-400',
    colorBg: 'border-indigo-400/30 bg-indigo-400/5',
    source: '~500 tokens per day (medium entry)',
  },
  {
    id: 'wikipedia_article',
    label: 'Wikipedia articles',
    emoji: '🌍',
    sourceQuantity: 1_500, sourceUnit: 'tokens',
    description: 'One article. An illustrative text budget, not a sampled Wikipedia average.',
    category: 'life',
    color: 'text-slate-300',
    colorBg: 'border-slate-300/30 bg-slate-300/5',
    source: '~1.5K tokens avg per article',
  },
  {
    id: 'news_day',
    label: 'News collections',
    emoji: '📰',
    sourceQuantity: 50_000, sourceUnit: 'tokens',
    description: 'One collection of news articles. An illustrative budget, not all global coverage.',
    category: 'life',
    color: 'text-red-400',
    colorBg: 'border-red-400/30 bg-red-400/5',
    source: '50K-token illustrative collection',
  },
  {
    id: 'bedtime_stories',
    label: 'Bedtime stories (for Filip)',
    emoji: '🌙',
    sourceQuantity: 600, sourceUnit: 'tokens',
    description: 'One short story. About 450 English words under the same estimate.',
    category: 'life',
    color: 'text-violet-400',
    colorBg: 'border-violet-400/30 bg-violet-400/5',
    source: '~600 tokens per story (~450 words)',
  },
];

export function estimateTokens(quantity: number, unit: ContextItem['sourceUnit']): number {
  return Math.ceil(unit === 'words' ? quantity / 0.75 : unit === 'characters' ? quantity / 4 : quantity);
}

const CONTEXT_ITEMS: ContextItem[] = ITEM_SOURCES.map(item => ({
  ...item, tokensEach: estimateTokens(item.sourceQuantity, item.sourceUnit),
}));

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
  const { c, language } = usePageCopy(pl);
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
            <div className="text-white text-sm font-medium">{c(item.label)}</div>
            <div className="text-gray-500 text-xs">{c(item.source)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {count > 0 && (
            <button
              onClick={onRemove}
              aria-label={`${language === 'pl' ? 'Usuń' : 'Remove'} ${c(item.label)}`}
              className="w-11 h-11 flex items-center justify-center border border-gray-600 text-gray-400 hover:border-red-400 hover:text-red-400 transition-colors text-xs"
            >
              −
            </button>
          )}
          <button
            onClick={onAdd}
            aria-label={`${language === 'pl' ? 'Dodaj' : 'Add'} ${c(item.label)}`}
            disabled={!wouldFit}
            className={`w-11 h-11 flex items-center justify-center border transition-colors text-xs ${
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

      <p className="text-gray-400 text-xs mb-3 leading-relaxed">{c(item.description)}</p>
      <p className="text-gray-400 text-xs mb-3">{c("Estimated:")} {item.tokensEach.toLocaleString('en-US')} {c("tokens")}</p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{c("Fits")} {howMany.toLocaleString('en-US')} {c("in 1M context")}</span>
          <span className={item.color}>{pctOfContext < 1 ? '<1' : pctOfContext.toFixed(1)}{c("% each")}</span>
        </div>
        <ContextBar filled={item.tokensEach} color={item.color} />
      </div>

      {count > 0 && (
        <div className={`mt-2 text-xs ${item.color} font-mono`}>
          {count > 1 ? `${count}× = ` : ''}{itemTokens.toLocaleString('en-US')} {c("tokens selected")} </div>
      )}
    </div>
  );
}

// ============ MAIN VISUALIZER ============

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-US');
}

// ============ COMPARISON TABLE ============

function ModelComparison() {
  const { c } = usePageCopy(pl);
  return (
    <div className="space-y-3 border border-gray-800 p-4">
      {[16_000, 128_000, 200_000, 1_000_000, 10_000_000].map(tokens => (
        <div key={tokens}>
          <div className="text-xs text-gray-400 mb-1">{formatTokens(tokens)} {c("tokens")}</div>
          <div className="h-2 bg-gray-800"><div className="h-full bg-cyan-400" style={{ width: `${Math.log10(tokens / 1000) / 4 * 100}%` }} /></div>
        </div>
      ))}
      <p className="text-gray-400 text-xs">{c("Capacity examples on a logarithmic scale. Fable 5.1 is the 1M example here, dated 2026-09-13. Capacity alone does not measure recall or reasoning.")}</p>
    </div>
  );
}

// ============ PAGE ============

export default function MillionContext() {
  const { c, language } = usePageCopy(pl);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const totalTokens = Object.entries(counts).reduce((sum, [id, count]) => {
    const item = CONTEXT_ITEMS.find((i) => i.id === id);
    return sum + (item ? item.tokensEach * count : 0);
  }, 0);

  const pctFilled = Math.min(totalTokens / TOKEN_LIMIT, 1) * 100;
  const overflow = totalTokens > TOKEN_LIMIT;
  const remaining = TOKEN_LIMIT - totalTokens;

  const handleAdd = (id: string) => {
    const item = CONTEXT_ITEMS.find(i => i.id === id)!;
    setCounts(prev => {
      const used = CONTEXT_ITEMS.reduce((sum, entry) => sum + entry.tokensEach * (prev[entry.id] || 0), 0);
      return used + item.tokensEach <= TOKEN_LIMIT ? { ...prev, [id]: (prev[id] || 0) + 1 } : prev;
    });
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
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 border border-cyan-400/30 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-400 font-mono mb-4"> {c("✦ FABLE 5.1 · 1M EXAMPLE · 2026-09-13")} </div>
        <div className="text-4xl mb-3">🧠</div>
        <h1 className="text-2xl text-white mb-2">{c("Explore a 1M-token context window")}</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-3"> {c("Add books and code to an estimated token budget. Leave room for instructions, tool results and output.")} </p>
        <a
          href="https://thoughts.jock.pl/p/sonnet-46-two-experiments-one-got-personal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors border-b border-cyan-400/20 hover:border-cyan-400/50 pb-0.5"
        > {c("📖 Historical article: Sonnet 4.6, two experiments, one got personal (February 2026)")} <span className="text-gray-600">→</span>
        </a>
      </div>

      {/* Context bar - sticky */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 pb-4 mb-6 pt-3" ref={barRef}>
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs text-gray-500">{c("Context Window Used")}</span>
          <span role="status" aria-live="polite" className={`text-xs font-mono ${overflow ? 'text-red-400' : 'text-cyan-400'}`}>
            {formatTokens(totalTokens)} {c("/ 1M tokens (")}{pctFilled.toFixed(1)}%)
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
          <span>{c("250K")}</span>
          <span>{c("500K")}</span>
          <span>{c("750K")}</span>
          <span>{c("1M")}</span>
        </div>
        {totalTokens > 0 && !overflow && (
          <p className="text-xs text-gray-500 mt-2">
            {formatTokens(remaining)} {c("tokens remaining")} {fillSuggestion && (
              <span className="text-gray-600"> {c("· could fit")} {Math.floor(remaining / fillSuggestion.tokensEach).toLocaleString('en-US')} {c("more")} {c(fillSuggestion.label)}</span>
            )}
          </p>
        )}
        {overflow && (
          <p className="text-xs text-red-400 mt-2"> {c("Context window exceeded by")} {formatTokens(totalTokens - TOKEN_LIMIT)} {c("tokens")} </p>
        )}
        {totalTokens > 0 && (
          <button
            onClick={handleReset}
            className="min-h-11 px-3 text-xs text-gray-400 hover:text-white transition-colors mt-1"
          > {c("Clear all")} </button>
        )}
      </div>

      {/* Selected summary */}
      {selectedItems.length > 0 && (
        <div className="border border-cyan-400/20 bg-cyan-400/5 p-4 mb-6">
          <div className="text-xs text-cyan-400 mb-2 font-mono">{c("IN CONTEXT NOW:")}</div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span key={item.id} className={`text-xs px-2 py-1 border ${item.colorBg} ${item.color}`}>
                {item.emoji} {counts[item.id] > 1 ? `${counts[item.id]}× ` : ''}{c(item.label)}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed"> {c("These items fit within this estimated token budget. Fitting is not a guarantee that a model will use every detail correctly.")} </p>
        </div>
      )}

      {/* Model comparison toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowComparison(!showComparison)}
          aria-expanded={showComparison}
          aria-controls="budget-comparison"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors border border-gray-800 hover:border-gray-700 min-h-11 px-3 py-1.5"
        >
          {showComparison ? '▼' : '▶'} {c("Compare token budgets")} </button>
        {showComparison && (
          <div id="budget-comparison" className="mt-3">
            <ModelComparison />
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
          className={`min-h-11 px-3 py-1 text-xs border transition-colors ${
            activeCategory === 'all'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
              : 'border-gray-700 text-gray-500 hover:text-gray-400'
          }`}
        > {c("All")} </button>
        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            aria-pressed={activeCategory === key}
            className={`min-h-11 px-3 py-1 text-xs border transition-colors ${
              activeCategory === key
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-gray-700 text-gray-500 hover:text-gray-400'
            }`}
          >
            {info.emoji} {c(info.label)}
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
            stat: '~4 MB',
            label: 'plain text',
            desc: 'At 4 ASCII characters per token; encoding changes byte size',
            icon: '💾',
            color: 'text-purple-400',
          },
          {
            stat: '41.7 hrs',
            label: 'to read',
            desc: 'Time for an average reader at 300 wpm',
            icon: '⏱️',
            color: 'text-amber-400',
          },
        ].map((fact) => (
          <div key={c(fact.label)} className="border border-gray-800 p-4 text-center">
            <div className="text-2xl mb-2">{fact.icon}</div>
            <div className={`font-mono text-2xl font-bold ${fact.color} mb-1`}>{language === 'pl' && fact.stat === '41.7 hrs' ? '41,7 godz.' : fact.stat}</div>
            <div className="text-white text-xs mb-1">{c(fact.label)}</div>
            <div className="text-gray-500 text-xs">{c(fact.desc)}</div>
          </div>
        ))}
      </div>

      <div className="border border-cyan-400/20 bg-gray-900/50 p-4 text-sm text-gray-400">
        <p><strong className="text-white">{c("What the budget tells you:")}</strong> {c("A larger window can hold more source text. It still needs room for your instructions, tool results and output. Test whether the model uses the details your task depends on.")}</p>
      </div>
      <div className="text-gray-400 text-xs mt-6 space-y-2">
        <p>{c("Source releases:")} <a className="underline" href="https://github.com/facebook/react/tree/v19.2.0/packages/react">{c("React v19.2.0")}</a> · <a className="underline" href="https://github.com/python/cpython/tree/v3.13.0/Lib">{c("CPython v3.13.0")}</a></p>
        <p>{c("Estimates assume 0.75 English words per token, or 4 characters per token for source text. Actual tokenization varies by model, language and content.")}</p>
        <p>{c("Book word counts are approximate inputs, not measured token counts. React core and Python stdlib use source characters counted on 2026-09-13. Other entries are illustrative budgets, not measured corpus sizes.")}</p>
      </div>
    </div>
  );
}
