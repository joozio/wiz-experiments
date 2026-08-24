'use client';

import { useState, useEffect } from 'react';

interface Token {
  id: number;
  text: string;
  startIdx: number;
  color: string;
}

export default function TokenCascade() {
  const [input, setInput] = useState('Watch your thoughts transform into tokens.');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [revealProgress, setRevealProgress] = useState(1);
  const [copied, setCopied] = useState(false);

  // Simple tokenizer that approximates GPT-style tokenization
  // Real cl100k_base is more complex, but this gives good visual results
  const tokenize = (text: string): Token[] => {
    const result: Token[] = [];
    let idx = 0;
    let tokenId = 0;
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-emerald-400',
      'from-yellow-400 to-orange-400',
      'from-rose-400 to-red-400',
      'from-indigo-400 to-blue-400',
      'from-teal-400 to-cyan-400',
      'from-fuchsia-400 to-pink-400',
    ];

    // Split on whitespace and punctuation, but keep punctuation
    const pattern = /(\s+|[.!?,;:\(\)\[\]\{\}"'-]|\w+)/g;
    const matches = text.matchAll(pattern);

    for (const match of matches) {
      if (match[0].trim().length === 0) continue; // Skip pure whitespace

      // For longer words, sometimes split into subword tokens
      const word = match[0];
      const shouldSubword = word.length > 4 && /^[a-z]/i.test(word);

      if (shouldSubword && Math.random() > 0.3) {
        // Simulate subword tokenization
        const parts = [
          word.slice(0, Math.ceil(word.length / 2)),
          word.slice(Math.ceil(word.length / 2)),
        ].filter((p) => p.length > 0);

        for (const part of parts) {
          result.push({
            id: tokenId++,
            text: part,
            startIdx: idx,
            color: colors[tokenId % colors.length],
          });
        }
      } else {
        result.push({
          id: tokenId++,
          text: word,
          startIdx: idx,
          color: colors[tokenId % colors.length],
        });
      }

      idx += word.length;
    }

    return result;
  };

  useEffect(() => {
    const newTokens = tokenize(input);
    setTokens(newTokens);
    setRevealProgress(0);

    // Animate token reveal
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1 / (newTokens.length * 2);
      if (progress >= 1) {
        setRevealProgress(1);
        clearInterval(interval);
      } else {
        setRevealProgress(progress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [input]);

  const copyShareable = () => {
    const tokenStr = tokens.map((t) => t.text).join('|');
    navigator.clipboard.writeText(
      `"${input}"\n\nTokenized (${tokens.length} tokens):\n${tokenStr}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revealedCount = Math.floor(tokens.length * revealProgress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            Token Cascade
          </h1>
          <p className="text-lg text-purple-300/80">
            Watch your words dissolve into the atoms of comprehension.
            <br />
            <span className="text-sm text-purple-400/60">
              Everything you write is already written in tokens.
            </span>
          </p>
        </div>

        {/* Input Box */}
        <div className="mb-8 space-y-3">
          <label className="block text-sm font-medium text-purple-300">
            Type something. Watch it shatter.
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-24 p-4 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 resize-none font-mono text-sm"
            placeholder="Enter text to tokenize..."
          />
        </div>

        {/* Token Count */}
        <div className="mb-8 text-center">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/40 rounded-full">
            <span className="text-purple-300 font-mono text-sm">
              {revealedCount} / {tokens.length} tokens
            </span>
          </div>
        </div>

        {/* Token Cascade */}
        <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-8 mb-8 min-h-48">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {tokens.map((token, idx) => {
              const isRevealed = idx < revealedCount;
              const delay = idx * 20;

              return (
                <div
                  key={idx}
                  className={`transform transition-all duration-300 ${
                    isRevealed
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-75'
                  }`}
                  style={{
                    transitionDelay: `${Math.min(delay, 500)}ms`,
                  }}
                >
                  <div
                    className={`relative px-3 py-2 rounded border-2 border-purple-400/40 text-center whitespace-nowrap`}
                  >
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${token.color} opacity-20 rounded`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-white font-mono font-bold text-sm">
                        {isRevealed ? token.text : '◆'}
                      </div>
                      {isRevealed && (
                        <div className="text-xs text-purple-300/60 font-mono mt-1">
                          #{token.id}
                        </div>
                      )}
                    </div>

                    {/* Glow effect */}
                    {isRevealed && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${token.color} opacity-10 blur-md rounded animate-pulse`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setInput('Watch your thoughts transform into tokens.')}
            className="px-6 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 rounded-lg text-purple-300 font-mono text-sm transition-colors"
          >
            Reset
          </button>
          <button
            onClick={copyShareable}
            className={`px-6 py-2 rounded-lg font-mono text-sm transition-colors ${
              copied
                ? 'bg-green-600/40 border border-green-400/40 text-green-300'
                : 'bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/40 text-cyan-300'
            }`}
          >
            {copied ? '✓ Copied' : 'Share'}
          </button>
        </div>

        {/* Info */}
        <div className="bg-slate-800/20 border border-purple-500/10 rounded-lg p-6 text-center text-sm text-purple-300/70">
          <p>
            Tokenization is how large language models break text into chunks. Some words are single
            tokens, others split into subword pieces. This is a simplified visualization—real
            tokenizers have thousands of tokens learned from vast text corpora.
          </p>
          <p className="mt-3 text-purple-400/60">
            The gems you see are the atoms. The AI reads these, not your words.
          </p>
        </div>
      </div>
    </div>
  );
}
