'use client';

import { useState, useEffect, useMemo } from 'react';

// ============ SIMPLIFIED TOKENIZER ============
// This is a simplified BPE-like tokenizer for demonstration
// Real LLM tokenizers are much more complex, but this captures the essence

// Common subword patterns (simplified)
const COMMON_TOKENS: Record<string, number> = {
  // Single characters get high IDs
  ' ': 220,
  '\n': 198,
  '.': 13,
  ',': 11,
  '!': 0,
  '?': 30,
  ':': 25,
  ';': 26,
  '-': 12,
  '_': 62,

  // Common words/subwords (simplified token IDs)
  'the': 1820,
  'The': 464,
  'and': 290,
  'And': 1870,
  'is': 318,
  'are': 389,
  'was': 373,
  'were': 547,
  'will': 481,
  'would': 561,
  'could': 714,
  'should': 815,
  'have': 423,
  'has': 468,
  'had': 329,
  'be': 307,
  'been': 587,
  'being': 852,
  'for': 329,
  'with': 351,
  'this': 428,
  'that': 326,
  'from': 422,
  'they': 484,
  'we': 356,
  'you': 345,
  'your': 534,
  'our': 674,
  'their': 511,
  'there': 612,
  'here': 607,
  'where': 810,
  'when': 618,
  'what': 644,
  'which': 543,
  'who': 508,
  'how': 703,
  'why': 2156,
  'all': 439,
  'each': 790,
  'every': 790,
  'some': 617,
  'any': 597,
  'more': 517,
  'most': 749,
  'other': 584,
  'into': 656,
  'about': 546,
  'than': 621,
  'then': 788,
  'now': 783,
  'only': 691,
  'just': 655,
  'also': 635,
  'very': 845,
  'not': 407,
  'no': 645,
  'yes': 8505,
  'can': 460,
  'do': 466,
  'did': 750,
  'does': 857,
  'don': 836,
  "don't": 1353,
  'it': 340,
  "it's": 705,
  'its': 663,
  'to': 284,
  'of': 286,
  'in': 287,
  'on': 319,
  'at': 379,
  'by': 416,
  'as': 355,
  'or': 393,
  'an': 281,
  'a': 257,
  'I': 314,
  "I'm": 314,
  'me': 502,
  'my': 616,
  'he': 339,
  'she': 673,
  'him': 683,
  'her': 607,
  'his': 465,

  // Common word parts
  'ing': 278,
  'tion': 653,
  'ed': 276,
  'er': 263,
  'est': 395,
  'ly': 306,
  'ness': 408,
  'ment': 434,
  'able': 540,
  'ible': 856,
  'ful': 913,
  'less': 1203,
  'ize': 1096,
  'ise': 786,
  'un': 403,
  're': 260,
  'pre': 1050,
  'dis': 6381,

  // Tech words
  'code': 8189,
  'data': 7890,
  'user': 7220,
  'function': 8818,
  'class': 4871,
  'if': 361,
  'else': 17772,
  'return': 7783,
  'true': 7942,
  'false': 9562,
  'null': 8423,
  'undefined': 32813,
  'const': 1500,
  'let': 1616,
  'var': 7785,
  'import': 1330,
  'export': 15843,
  'async': 30351,
  'await': 25507,

  // AI-related
  'AI': 15836,
  'artificial': 18927,
  'intelligence': 11478,
  'machine': 4933,
  'learning': 6509,
  'model': 4211,
  'neural': 30423,
  'network': 5765,
  'token': 30001,
  'prompt': 13325,
  'chat': 9506,
  'GPT': 38,
  'Claude': 28829,
  'language': 4775,
  'natural': 5765,

  // Common phrases split
  'Hello': 15496,
  'hello': 31373,
  'world': 1917,
  'World': 10603,
  'test': 9288,
  'example': 8858,
};

interface Token {
  text: string;
  id: number;
  isEstimated: boolean;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 50000 + 1000;
}

function tokenize(text: string): Token[] {
  if (!text) return [];

  const tokens: Token[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched = false;

    // Try to match longest known token first
    for (let len = Math.min(remaining.length, 15); len > 0; len--) {
      const substr = remaining.slice(0, len);
      if (COMMON_TOKENS[substr] !== undefined) {
        tokens.push({
          text: substr,
          id: COMMON_TOKENS[substr],
          isEstimated: false,
        });
        remaining = remaining.slice(len);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // For unknown sequences, chunk into "subwords"
      // This simulates BPE behavior
      const char = remaining[0];

      // Check if it's the start of a word
      if (/[a-zA-Z]/.test(char)) {
        // Find word boundary
        let wordEnd = 1;
        while (wordEnd < remaining.length && /[a-zA-Z]/.test(remaining[wordEnd])) {
          wordEnd++;
        }
        const word = remaining.slice(0, wordEnd);

        // Check if full word is known
        if (COMMON_TOKENS[word] !== undefined) {
          tokens.push({
            text: word,
            id: COMMON_TOKENS[word],
            isEstimated: false,
          });
        } else {
          // Split into chunks (simulating subword tokenization)
          let pos = 0;
          while (pos < word.length) {
            // Try to match suffix patterns
            let chunkLen = Math.min(word.length - pos, 4);
            let found = false;

            while (chunkLen > 0) {
              const chunk = word.slice(pos, pos + chunkLen);
              if (COMMON_TOKENS[chunk] !== undefined) {
                tokens.push({
                  text: chunk,
                  id: COMMON_TOKENS[chunk],
                  isEstimated: false,
                });
                pos += chunkLen;
                found = true;
                break;
              }
              chunkLen--;
            }

            if (!found) {
              // Single character with estimated ID
              tokens.push({
                text: word[pos],
                id: simpleHash(word[pos]),
                isEstimated: true,
              });
              pos++;
            }
          }
        }
        remaining = remaining.slice(wordEnd);
      } else {
        // Non-alphabetic character
        tokens.push({
          text: char,
          id: COMMON_TOKENS[char] ?? simpleHash(char),
          isEstimated: COMMON_TOKENS[char] === undefined,
        });
        remaining = remaining.slice(1);
      }
    }
  }

  return tokens;
}

// ============ COMPONENTS ============

function TokenBadge({ token }: { token: Token }) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate a color based on token ID
  const hue = (token.id * 137) % 360;
  const bgColor = `hsla(${hue}, 70%, 30%, 0.3)`;
  const borderColor = `hsla(${hue}, 70%, 50%, 0.5)`;

  return (
    <div
      className={`inline-flex flex-col items-center m-1 transition-all duration-300 ${
        isNew ? 'scale-110 opacity-100' : 'scale-100 opacity-90'
      }`}
    >
      <div
        className="px-2 py-1 rounded text-sm font-mono border transition-all"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <span className="text-white">
          {token.text === ' ' ? '␣' : token.text === '\n' ? '↵' : token.text}
        </span>
      </div>
      <div className={`text-xs mt-1 font-mono ${token.isEstimated ? 'text-gray-500' : 'text-cyan-400'}`}>
        {token.id}
        {token.isEstimated && '*'}
      </div>
    </div>
  );
}

function ComparisonView({ text, tokens }: { text: string; tokens: Token[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Human View */}
      <div className="border border-gray-700 p-4">
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>👤</span> You See
        </div>
        <div className="font-mono text-white whitespace-pre-wrap break-words min-h-[100px]">
          {text || <span className="text-gray-600">Start typing...</span>}
        </div>
      </div>

      {/* AI View */}
      <div className="border border-cyan-400/30 bg-cyan-400/5 p-4">
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🤖</span> WIZ Sees
        </div>
        <div className="min-h-[100px]">
          {tokens.length > 0 ? (
            <div className="flex flex-wrap">
              {tokens.map((token, i) => (
                <TokenBadge key={`${i}-${token.text}`} token={token} />
              ))}
            </div>
          ) : (
            <span className="text-gray-600 font-mono">[awaiting input]</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Stats({ tokens, text }: { tokens: Token[]; text: string }) {
  const charCount = text.length;
  const tokenCount = tokens.length;
  const ratio = charCount > 0 ? (charCount / tokenCount).toFixed(2) : '0';
  const estimatedCount = tokens.filter(t => t.isEstimated).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="border border-gray-700 p-3 text-center">
        <div className="text-2xl font-mono text-white">{charCount}</div>
        <div className="text-gray-500 text-xs">Characters</div>
      </div>
      <div className="border border-cyan-400/50 p-3 text-center">
        <div className="text-2xl font-mono text-cyan-400">{tokenCount}</div>
        <div className="text-gray-500 text-xs">Tokens</div>
      </div>
      <div className="border border-gray-700 p-3 text-center">
        <div className="text-2xl font-mono text-white">{ratio}</div>
        <div className="text-gray-500 text-xs">Chars/Token</div>
      </div>
      <div className="border border-gray-700 p-3 text-center">
        <div className="text-2xl font-mono text-white">{estimatedCount}</div>
        <div className="text-gray-500 text-xs">Rare Tokens*</div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function TokenCounter() {
  const [text, setText] = useState('');
  const [showExamples, setShowExamples] = useState(true);

  const tokens = useMemo(() => tokenize(text), [text]);

  const examples = [
    { text: 'Hello, world!', description: 'Classic greeting' },
    { text: 'The quick brown fox jumps over the lazy dog', description: 'Pangram' },
    { text: 'I think, therefore I am', description: 'Philosophy' },
    { text: 'function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }', description: 'Code' },
    { text: 'ChatGPT and Claude are AI language models', description: 'AI talk' },
  ];

  const handleExample = (exampleText: string) => {
    setText(exampleText);
    setShowExamples(false);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🧩</div>
        <h1 className="text-2xl text-white mb-2">The Token Counter</h1>
        <p className="text-gray-400">
          I don&apos;t read words like you do. I see tokens. Let me show you.
        </p>
      </div>

      {/* Input */}
      <div className="mb-6">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setShowExamples(false);
          }}
          placeholder="Type something to see how AI reads it..."
          className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 text-white font-mono focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>

      {/* Examples */}
      {showExamples && (
        <div className="mb-6">
          <div className="text-gray-500 text-sm mb-3">Try an example:</div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExample(ex.text)}
                className="px-3 py-1 border border-gray-700 text-gray-400 text-sm hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                {ex.description}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6">
        <Stats tokens={tokens} text={text} />
      </div>

      {/* Comparison View */}
      <div className="mb-6">
        <ComparisonView text={text} tokens={tokens} />
      </div>

      {/* Explanation */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧙</span>
          <div className="text-gray-400 text-sm">
            <p className="mb-2">
              <strong className="text-white">What you&apos;re seeing:</strong> When I read text, I break it into &quot;tokens&quot; -
              pieces that might be words, parts of words, or single characters. Each token has a unique ID number.
            </p>
            <p className="mb-2">
              Common words like &quot;the&quot; are single tokens. Rare words get split into pieces.
              The word &quot;tokenization&quot; might become [&quot;token&quot;, &quot;ization&quot;].
            </p>
            <p>
              <span className="text-cyan-400">*</span> Tokens marked with * have estimated IDs.
              Real tokenizers (like tiktoken) would assign specific IDs.
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-gray-600 text-xs mt-6 space-y-1">
        <p>This is a simplified tokenizer for demonstration. Real LLM tokenizers use BPE (Byte Pair Encoding) with ~100k tokens.</p>
        <p>All processing happens locally in your browser.</p>
      </div>
    </div>
  );
}
