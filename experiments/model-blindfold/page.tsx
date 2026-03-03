'use client';

import { useState, useMemo } from 'react';

// ---------------------------------------------------------------------------
// Pre-generated responses — no live API calls, no costs
// Models: Sonnet 4.6 (new), Claude 3 Haiku (compact 2024), GPT-4o mini (OpenAI)
// ---------------------------------------------------------------------------

const RESPONSES: Record<string, Record<string, string>> = {
  debug: {
    'Sonnet 4.6': `**The Bug**

The effect captures \`count = 0\` in its closure and never sees updated values. Every tick runs \`setCount(0 + 1)\`, so the display stays at 1.

**The Fix**

Use the functional updater form, which receives the *current* state rather than the closed-over value:

\`\`\`jsx
useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1);  // ← functional form
  }, 1000);
  return () => clearInterval(interval);
}, []); // empty deps is now fine
\`\`\`

The dependency array can stay empty — the updater doesn't need to close over \`count\`.`,

    'Claude 3 Haiku': `# The Bug

The \`useEffect\` dependency array is empty (\`[]\`), so the effect runs once on mount. The closure inside \`setInterval\` captures \`count\` as \`0\` and always sets it to \`0 + 1 = 1\`. The effect never re-runs, so the closure never updates.

# The Fix

Use the functional update form of \`setCount\`:

\`\`\`jsx
useEffect(() => {
  const interval = setInterval(() => {
    setCount(prevCount => prevCount + 1);
  }, 1000);
  return () => clearInterval(interval);
}, []);
\`\`\`

This way, \`setCount\` always receives the latest value of \`count\`, regardless of the stale closure.`,

    'GPT-4o mini': `The issue is that the \`setCount\` function inside the \`setInterval\` callback is referencing the stale state value of \`count\`. To fix this, you can use the functional form of \`setCount\` to update the state based on the previous state.

Here's the corrected code:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{count}</div>;
}
\`\`\`

By using \`setCount(prevCount => prevCount + 1)\`, you are passing a function to \`setCount\` that receives the previous count value as an argument, ensuring that you are always working with the latest state value.`,
  },

  review: {
    'Sonnet 4.6': `**Query Analysis**

**Critical: \`o.created_at\` not in GROUP BY**

\`\`\`sql
GROUP BY o.id, c.name
ORDER BY o.created_at DESC  -- ← not grouped or aggregated
\`\`\`

On PostgreSQL/SQL Server this query **fails outright**. MySQL (strict mode off) may run it but returns arbitrary \`created_at\` values, so sort order is undefined. Fix: add \`o.created_at\` to GROUP BY or use \`MAX(o.created_at)\`.

**Also serious: no index on \`created_at\`**

With 500k orders sorted by \`created_at\`, you're doing a full filesort after aggregation. Add:

\`\`\`sql
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
\`\`\`

**Minor: redundant JOIN**

If you only need \`item_count\`, consider whether you need all three tables. Can simplify if \`c.name\` isn't required.

**Priority:** Fix the GROUP BY first — it's a correctness bug, not just a performance issue.`,

    'Claude 3 Haiku': `# Performance Issues Found

## 🔴 Critical Issue: Missing \`c.name\` in GROUP BY

\`\`\`sql
GROUP BY o.id, c.name
\`\`\`

This works in MySQL (with \`ONLY_FULL_GROUP_BY\` disabled) but is **bad practice** and causes problems:

- **PostgreSQL/SQL Server will reject it** - non-aggregated columns must be in GROUP BY or aggregate functions
- **Ambiguous results** - which \`c.name\` value gets returned when there are multiple?

## 🟡 Performance Issue: Missing Indexes

For 500k orders, you need indexes on:

\`\`\`sql
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
\`\`\`

Without these, you're doing full table scans on every JOIN.

## 🟡 N+1-like Aggregation Pattern

The \`COUNT(i.id)\` with a JOIN can be expensive. Consider:

\`\`\`sql
SELECT o.id, c.name,
       (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC;
\`\`\`

**Fix the GROUP BY first — it's a correctness bug before it's a performance bug.**`,

    'GPT-4o mini': `The SQL query you provided has a few potential performance issues, especially when dealing with a large dataset like 500k orders. Let's analyze the query step by step:

### Potential Issues

1. **Missing Indexes**: Ensure that there are appropriate indexes on the columns used in the \`JOIN\` conditions (\`customer_id\` and \`order_id\`) and the \`ORDER BY\` clause (\`created_at\`). Without indexes, the database must perform full table scans, which can be very slow.

2. **Aggregation with Large Datasets**: The \`COUNT(i.id)\` aggregate function requires the database to process all matching rows in \`order_items\`. If there are many items per order, this can be expensive.

3. **Sorting**: The \`ORDER BY o.created_at DESC\` clause requires sorting the result set, which can be costly without an index on \`created_at\`.

### Recommendations

\`\`\`sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
\`\`\`

The query logic itself looks correct for its purpose. The performance improvements mainly come from proper indexing rather than query restructuring.`,
  },

  explain: {
    'Sonnet 4.6': `**What This Regex Does**

It validates that a password meets several requirements. Breaking it down:

| Part | Meaning |
|------|---------|
| \`^\` and \`$\` | Must match the entire string |
| \`(?=.*[a-z])\` | Must contain at least one lowercase letter |
| \`(?=.*[A-Z])\` | Must contain at least one uppercase letter |
| \`(?=.*\\d)\` | Must contain at least one digit |
| \`(?=.*[@$!%*?&])\` | Must contain at least one of these special chars |
| \`[A-Za-z\\d@$!%*?&]{8,}\` | Min 8 chars, only from the allowed set |

**Passwords it would reject that seem valid:**

- \`Hello World1!\` — rejected because space isn't in \`[@$!%*?&]\`
- \`P@ssword#1\` — rejected because \`#\` isn't in the allowed special char set
- \`Héllo@1\` — rejected because accented chars aren't in \`[A-Za-z]\`

**The gap:** The allowed special characters (\`@$!%*?&\`) are a very short list. Most users would expect \`#\`, \`^\`, \`(\`, \`)\`, \`-\`, \`_\`, \`+\` to work too.`,

    'Claude 3 Haiku': `# Regex Breakdown

This regex validates a **strong password**. Here's what it checks:

## The Requirements (in order)

1. \`^\` - Start of string
2. \`(?=.*[a-z])\` - Must contain at least one lowercase letter
3. \`(?=.*[A-Z])\` - Must contain at least one uppercase letter
4. \`(?=.*\\d)\` - Must contain at least one digit (0-9)
5. \`(?=.*[@$!%*?&])\` - Must contain at least one special character from this set: \`@ $ ! % * ? &\`
6. \`[A-Za-z\\d@$!%*?&]{8,}\` - The entire password must be 8+ characters, using only letters, digits, and those special chars
7. \`$\` - End of string

## Passwords This Would Reject

- \`MyPassword123\` - no special character
- \`My@Pass\` - too short (7 chars)
- \`mypassword@1\` - no uppercase letter
- \`MYPASSWORD@1\` - no lowercase letter
- \`MyPassword@!\` - no digit

## The Gotcha

Only \`@ $ ! % * ? &\` are allowed as special characters. Common ones like \`#\`, \`-\`, \`_\`, \`^\` would cause rejection even though they seem valid.`,

    'GPT-4o mini': `This regex is a password validation pattern that enforces the following rules:

1. The password must contain at least one lowercase letter.
2. The password must contain at least one uppercase letter.
3. The password must contain at least one digit.
4. The password must contain at least one special character from the set \`[@$!%*?&]\`.
5. The password must be at least 8 characters long.
6. The password can only contain letters (both cases), digits, and the special characters \`[@$!%*?&]\`.

Passwords that would be rejected despite seeming valid:

- \`P@ssword\` - no digit
- \`password1!\` - no uppercase letter
- \`PASSWORD1!\` - no lowercase letter
- \`Password!\` - no digit
- \`Pass1!\` - too short (6 characters)
- \`P@ssword1 \` - contains a space, which is not in the allowed character set`,
  },
};

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

const CHALLENGES = [
  {
    id: 'debug',
    emoji: '🐛',
    label: 'DEBUG',
    title: 'Broken React Hook',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{count}</div>;
}`,
    lang: 'jsx',
    question: 'The counter stops updating after the first second. What\'s wrong and how do you fix it?',
  },
  {
    id: 'review',
    emoji: '🔍',
    label: 'REVIEW',
    title: 'SQL Performance Issue',
    code: `SELECT o.id, c.name, COUNT(i.id) as item_count
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items i ON o.id = i.order_id
GROUP BY o.id, c.name
ORDER BY o.created_at DESC;`,
    lang: 'sql',
    question: 'Running on ~500k orders. Is there a performance issue? How serious?',
  },
  {
    id: 'explain',
    emoji: '🧠',
    label: 'EXPLAIN',
    title: 'Regex Decoded',
    code: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    lang: 'regex',
    question: 'What does this password validation regex actually enforce? What would it reject that seems valid?',
  },
];

const MODEL_LABELS: Record<string, { short: string; full: string; color: string }> = {
  'Sonnet 4.6': { short: 'Sonnet 4.6', full: 'Claude Sonnet 4.6 — Anthropic (Feb 2026)', color: '#00e5ff' },
  'Claude 3 Haiku': { short: 'Haiku 3', full: 'Claude 3 Haiku — Anthropic (compact, 2024)', color: '#c084fc' },
  'GPT-4o mini': { short: 'GPT-4o mini', full: 'GPT-4o mini — OpenAI', color: '#86efac' },
};

// Shuffle order per session (seeded by challenge index so stable per reload)
function shuffleModels(models: string[], seed: number): string[] {
  const arr = [...models];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (seed * 31 + i * 17) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MODEL_NAMES = ['Sonnet 4.6', 'Claude 3 Haiku', 'GPT-4o mini'];
const LETTERS = ['A', 'B', 'C'];

function renderMarkdown(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.split('\n');
      const code = lines.slice(1, -1).join('\n');
      return (
        <pre key={i} className="my-2 p-3 bg-[rgba(0,0,0,0.5)] border border-[rgba(0,255,255,0.1)] overflow-x-auto rounded text-xs text-[#7ee8a2] font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      );
    }
    return (
      <div key={i} className="text-secondary text-sm leading-relaxed">
        {part.split('\n').map((line, j) => {
          if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
            return <p key={j} className="font-semibold text-primary mt-3 mb-1">{line.slice(2, -2)}</p>;
          }
          if (line.startsWith('# ')) return <h3 key={j} className="text-primary font-semibold mt-3 mb-1 text-base">{line.slice(2)}</h3>;
          if (line.startsWith('## ')) return <h4 key={j} className="text-accent text-sm font-medium mt-2 mb-1">{line.slice(3)}</h4>;
          if (line.startsWith('| ')) {
            const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
            return (
              <div key={j} className="flex gap-0 border-b border-[rgba(255,255,255,0.05)]">
                {cells.map((cell, k) => (
                  <span key={k} className="flex-1 px-2 py-0.5 text-xs font-mono text-muted">{cell}</span>
                ))}
              </div>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const inlineText = line.slice(2).replace(/`([^`]+)`/g, '﹤$1﹥');
            return <p key={j} className="pl-3 border-l border-accent-dim mb-1">· {inlineText.replace(/﹤([^﹥]+)﹥/g, '$1')}</p>;
          }
          if (line.match(/^\d+\./)) return <p key={j} className="mb-1">{line}</p>;
          if (!line.trim()) return <div key={j} className="h-2" />;
          const processed = line
            .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
            .map((seg, k) => {
              if (seg.startsWith('`') && seg.endsWith('`')) return <code key={k} className="px-1 bg-[rgba(0,255,255,0.08)] text-accent font-mono text-xs rounded">{seg.slice(1, -1)}</code>;
              if (seg.startsWith('**') && seg.endsWith('**')) return <strong key={k} className="text-primary">{seg.slice(2, -2)}</strong>;
              return <span key={k}>{seg}</span>;
            });
          return <p key={j} className="mb-1">{processed}</p>;
        })}
      </div>
    );
  });
}

type Phase = 'intro' | 'challenge' | 'reveal' | 'summary';

export default function ModelBlindfoldPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [seed] = useState(() => Math.floor(Math.random() * 100));

  const shuffledModels = useMemo(
    () => CHALLENGES.map((_, i) => shuffleModels(MODEL_NAMES, seed + i)),
    [seed]
  );

  function handlePick(modelName: string) {
    setPicked((prev) => ({ ...prev, [round]: modelName }));
    setPhase('reveal');
  }

  function handleNext() {
    if (round < CHALLENGES.length - 1) {
      setRound((r) => r + 1);
      setPhase('challenge');
    } else {
      setPhase('summary');
    }
  }

  const challenge = CHALLENGES[round];
  const models = shuffledModels[round] ?? MODEL_NAMES;
  const pickedModel = picked[round];

  // Summary stats
  const pickedSonnet = Object.values(picked).filter((m) => m === 'Sonnet 4.6').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-4xl mb-3">🕶️</div>
        <h1 className="font-pixel text-3xl text-white mb-2 text-glow">The Model Blindfold</h1>
        <p className="text-secondary text-sm max-w-lg mx-auto leading-relaxed">
          Three models. Three coding challenges. You pick the best response before seeing who wrote it.
        </p>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="space-y-6">

          {/* Model overview */}
          <div className="card p-5">
            <p className="text-xs text-accent font-mono uppercase tracking-widest mb-3">// Released Feb 17, 2026</p>
            <h2 className="text-primary font-medium text-base mb-3">Claude Sonnet 4.6</h2>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              Anthropic's new flagship coding model. Same price as Sonnet 4.5 — better at almost everything.
              The headline feature is a <span className="text-primary">1 million token context window</span> (your entire codebase, at once).
              But the coding improvements are what matter day-to-day.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Context window', value: '1M tokens', sub: 'beta — entire codebase at once' },
                { label: 'Price vs Sonnet 4.5', value: 'unchanged', sub: '$3 / $15 per 1M tokens' },
                { label: 'Preferred over 4.5', value: '70%', sub: 'in Claude Code user testing' },
                { label: 'vs. Opus 4.5', value: '59%', sub: 'users preferred Sonnet 4.6' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-[rgba(0,255,255,0.03)] border border-[rgba(0,255,255,0.08)] p-3">
                  <p className="text-xs text-muted mb-1">{label}</p>
                  <p className="text-accent font-mono font-medium">{value}</p>
                  <p className="text-xs text-muted mt-0.5 leading-tight">{sub}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-subtle pt-4">
              <p className="text-xs text-muted uppercase tracking-widest mb-2">// What changed in coding</p>
              <div className="space-y-1.5 mb-4">
                {[
                  'Reads full context before touching anything',
                  'Less overengineering — fixes only what needs fixing',
                  'Fewer false success claims and hallucinations',
                  'Better multi-step task follow-through',
                ].map((item) => (
                  <p key={item} className="text-secondary text-xs pl-3 border-l border-accent-dim">· {item}</p>
                ))}
              </div>
              <p className="text-xs text-muted uppercase tracking-widest mb-2">// Interesting from the PR</p>
              <div className="space-y-3">
                <div className="bg-[rgba(0,255,255,0.03)] border border-[rgba(0,255,255,0.08)] p-3">
                  <p className="text-xs text-accent font-mono mb-1">🎰 VendingBench Arena</p>
                  <p className="text-secondary text-xs leading-relaxed">
                    Anthropic benchmarks models on running a simulated vending machine business over 12 months.
                    Sonnet 4.6 developed a novel strategy: invest heavily in capacity for the first 10 months, then pivot hard to profitability.
                    It beat competitors who optimised for short-term gains. Long-horizon business planning — not just code.
                  </p>
                </div>
                <div className="bg-[rgba(0,255,255,0.03)] border border-[rgba(0,255,255,0.08)] p-3">
                  <p className="text-xs text-accent font-mono mb-1">📊 Enterprise document reading</p>
                  <p className="text-secondary text-xs leading-relaxed">
                    Matches Opus 4.6 on OfficeQA — reading charts, PDFs, and tables then reasoning from them.
                    94% accuracy on insurance benchmark workflows (submission intake, first notice of loss).
                  </p>
                </div>
                <div className="bg-[rgba(0,255,255,0.03)] border border-[rgba(0,255,255,0.08)] p-3">
                  <p className="text-xs text-accent font-mono mb-1">🖥️ Computer use</p>
                  <p className="text-secondary text-xs leading-relaxed">
                    Major improvement over prior Sonnet models. Human-level on spreadsheet navigation and multi-step web forms.
                    Better resistance to prompt injection. Also: noticeably more polished frontend/design output.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Blindfold explanation */}
          <div className="card p-5">
            <p className="text-xs text-accent font-mono uppercase tracking-widest mb-3">// The experiment</p>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Everyone's posting benchmarks. Here's something more honest:{' '}
              <span className="text-primary">three anonymous models answer the same code questions</span>.
              You read the responses blind and pick the one you'd trust. Then the reveal.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              No trick questions. Real code, real answers, your own judgment.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {['3 challenges', '3 models', '0 marketing'].map((label) => (
              <div key={label} className="card p-3">
                <p className="text-accent font-mono text-sm">{label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => setPhase('challenge')} className="btn-primary">
              Start the blindfold test →
            </button>
          </div>
        </div>
      )}

      {/* CHALLENGE */}
      {phase === 'challenge' && (
        <div className="space-y-5">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-muted font-mono">Round {round + 1} of {CHALLENGES.length}</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            <span className="text-xs text-accent font-mono">{challenge.label}</span>
          </div>

          {/* Problem */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{challenge.emoji}</span>
              <h2 className="text-primary font-medium">{challenge.title}</h2>
            </div>
            <p className="text-muted text-xs mb-3">{challenge.question}</p>
            <pre className="p-3 bg-[rgba(0,0,0,0.4)] border border-subtle overflow-x-auto rounded text-xs text-[#7ee8a2] font-mono leading-relaxed">
              <code>{challenge.code}</code>
            </pre>
          </div>

          {/* Responses */}
          <p className="text-muted text-xs uppercase tracking-widest">// Pick the response you'd trust most</p>

          <div className="space-y-3">
            {models.map((modelName, idx) => {
              const letter = LETTERS[idx];
              const responseText = RESPONSES[challenge.id]?.[modelName] ?? '';
              return (
                <div key={modelName} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-muted">Response {letter}</span>
                    <button
                      onClick={() => handlePick(modelName)}
                      className="text-xs border border-accent-dim text-accent px-3 py-1 hover:bg-[rgba(0,255,255,0.08)] transition-colors"
                    >
                      I'd trust this one
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {renderMarkdown(responseText)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REVEAL */}
      {phase === 'reveal' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-muted font-mono">Round {round + 1} of {CHALLENGES.length}</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            <span className="text-xs text-accent font-mono">Reveal</span>
          </div>

          <div className="card p-5">
            <p className="text-muted text-xs mb-4 uppercase tracking-widest">// You picked</p>
            <div
              className="text-lg font-medium mb-1"
              style={{ color: MODEL_LABELS[pickedModel]?.color ?? '#fff' }}
            >
              {MODEL_LABELS[pickedModel]?.short}
            </div>
            <p className="text-muted text-xs">{MODEL_LABELS[pickedModel]?.full}</p>
          </div>

          <p className="text-muted text-xs uppercase tracking-widest">// Full lineup</p>

          <div className="space-y-2">
            {models.map((modelName, idx) => {
              const letter = LETTERS[idx];
              const info = MODEL_LABELS[modelName];
              const wasYourPick = modelName === pickedModel;
              return (
                <div
                  key={modelName}
                  className={`card p-3 flex items-center gap-3 ${wasYourPick ? 'border-accent-dim' : ''}`}
                >
                  <span className="text-xs font-mono text-muted w-4">{letter}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium" style={{ color: info?.color }}>
                      {info?.short}
                    </span>
                    <span className="text-muted text-xs ml-2">{info?.full.split('—')[1]?.trim()}</span>
                  </div>
                  {wasYourPick && (
                    <span className="text-xs text-accent border border-accent-dim px-2 py-0.5">your pick</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button onClick={handleNext} className="btn-primary">
              {round < CHALLENGES.length - 1 ? `Next challenge →` : 'See summary →'}
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {phase === 'summary' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-3">
              {pickedSonnet === 3 ? '🎯' : pickedSonnet === 2 ? '🤔' : '🕵️'}
            </div>
            <h2 className="font-pixel text-2xl text-white mb-2">
              {pickedSonnet === 3
                ? 'Perfect alignment'
                : pickedSonnet === 2
                ? 'Mostly there'
                : pickedSonnet === 1
                ? 'Interesting taste'
                : 'The contrarian'}
            </h2>
            <p className="text-secondary text-sm">
              You picked Sonnet 4.6 in{' '}
              <span className="text-accent">{pickedSonnet} of {CHALLENGES.length}</span> rounds.
            </p>
          </div>

          {/* Your picks breakdown */}
          <div className="space-y-2">
            {CHALLENGES.map((c, i) => {
              const choice = picked[i];
              const info = MODEL_LABELS[choice];
              return (
                <div key={c.id} className="card p-3 flex items-center gap-3">
                  <span className="text-lg">{c.emoji}</span>
                  <div className="flex-1">
                    <p className="text-primary text-sm">{c.title}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: info?.color }}>
                    {info?.short}
                  </span>
                </div>
              );
            })}
          </div>

          {/* What to take away */}
          <div className="card p-5 border-l-2 border-accent-dim">
            <p className="text-muted text-xs uppercase tracking-widest mb-3">// The point</p>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              Benchmarks show numbers. This shows what a response actually feels like to read. Did you notice Sonnet 4.6 catching the GROUP BY correctness bug in the SQL review — not just the missing indexes? That's the kind of difference that matters in real debugging.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              All three models got the right answer on the React bug. The gap shows up in depth, structure, and the things nobody asked for.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setPhase('intro');
                setRound(0);
                setPicked({});
              }}
              className="btn-secondary"
            >
              Run it again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
