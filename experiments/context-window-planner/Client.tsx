'use client';

// CONTEXT WINDOW PLANNER
// Plan your Claude API request. See how much of the context window you're using,
// which models fit, and what you're paying for.

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Rough token estimation: ~4 chars per token for English text
function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  return Math.ceil(text.length / 4);
}

interface Model {
  id: string;
  name: string;
  contextK: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  speed: 'fast' | 'balanced' | 'thorough';
  badge?: string;
}

const MODELS: Model[] = [
  {
    id: 'haiku',
    name: 'Claude Haiku',
    contextK: 200,
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    speed: 'fast',
    badge: 'cheapest',
  },
  {
    id: 'sonnet',
    name: 'Claude Sonnet',
    contextK: 200,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    speed: 'balanced',
    badge: 'recommended',
  },
  {
    id: 'opus',
    name: 'Claude Opus',
    contextK: 200,
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    speed: 'thorough',
    badge: 'most capable',
  },
];

const SPEED_LABELS: Record<string, string> = {
  fast: 'Fast',
  balanced: 'Balanced',
  thorough: 'Thorough',
};

const SPEED_COLORS: Record<string, string> = {
  fast: '#22d3ee',
  balanced: '#a78bfa',
  thorough: '#f59e0b',
};

function formatCost(cost: number): string {
  if (cost < 0.001) return '<$0.001';
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(3)}`;
}

function usagePercent(tokens: number, contextK: number): number {
  return Math.min(100, (tokens / (contextK * 1000)) * 100);
}

function usageColor(pct: number): string {
  if (pct < 50) return '#22c55e';
  if (pct < 80) return '#f59e0b';
  return '#ef4444';
}

export default function Client() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [history, setHistory] = useState('');
  const [task, setTask] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState(500);

  const tokens = useMemo(() => ({
    system: estimateTokens(systemPrompt),
    history: estimateTokens(history),
    task: estimateTokens(task),
    get total() { return this.system + this.history + this.task; },
  }), [systemPrompt, history, task]);

  const totalWithOutput = tokens.total + estimatedOutput;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/experiments/" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: 13,
            display: 'inline-block',
            marginBottom: 16,
          }}>← All Experiments</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>📐</span>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
              Context Window Planner
            </h1>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
            Plan your Claude API request. See token usage, context fit, and cost before you send.
          </p>
        </div>

        {/* Input panels */}
        <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
          <InputPanel
            label="System Prompt"
            emoji="🎯"
            placeholder="You are a helpful assistant that..."
            value={systemPrompt}
            onChange={setSystemPrompt}
            tokens={tokens.system}
            hint="Instructions that define the model's role and behavior."
          />
          <InputPanel
            label="Conversation History"
            emoji="💬"
            placeholder="Previous messages in the conversation..."
            value={history}
            onChange={setHistory}
            tokens={tokens.history}
            hint="Accumulated messages from previous turns. This grows over long conversations."
          />
          <InputPanel
            label="Current Task / User Message"
            emoji="✍️"
            placeholder="What do you want the model to do?"
            value={task}
            onChange={setTask}
            tokens={tokens.task}
            hint="The actual request you're sending now."
          />
        </div>

        {/* Output slider */}
        <div style={{
          background: '#1a1a2e',
          border: '1px solid #2a2a3e',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📤</span>
              <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>Expected Output Length</span>
            </div>
            <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 14 }}>
              ~{estimatedOutput.toLocaleString()} tokens
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={8000}
            step={100}
            value={estimatedOutput}
            onChange={(e) => setEstimatedOutput(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: '#6b7280', fontSize: 12 }}>
            <span>100 (short reply)</span>
            <span>4K (long essay)</span>
            <span>8K (detailed analysis)</span>
          </div>
        </div>

        {/* Token summary */}
        <div style={{
          background: '#1a1a2e',
          border: '1px solid #2a2a3e',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginTop: 0, marginBottom: 16 }}>
            Token Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <TokenStat label="System" tokens={tokens.system} color="#22d3ee" />
            <TokenStat label="History" tokens={tokens.history} color="#a78bfa" />
            <TokenStat label="Task" tokens={tokens.task} color="#34d399" />
          </div>
          <div style={{ borderTop: '1px solid #2a2a3e', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>Input tokens</span>
              <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{tokens.total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>+ Expected output</span>
              <span style={{ fontWeight: 700, color: '#a78bfa' }}>~{estimatedOutput.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #2a2a3e' }}>
              <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>Total</span>
              <span style={{ fontWeight: 800, color: '#f1f5f9', fontSize: 16 }}>{totalWithOutput.toLocaleString()}</span>
            </div>
          </div>
          {tokens.total === 0 && (
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
              Paste your content above to see token estimates. (~4 chars = 1 token for English)
            </p>
          )}
        </div>

        {/* Model comparison */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>
          Model Fit
        </h2>
        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {MODELS.map((model) => {
            const inputPct = usagePercent(tokens.total, model.contextK);
            const totalPct = usagePercent(totalWithOutput, model.contextK);
            const fits = totalWithOutput <= model.contextK * 1000;
            const inputCost = (tokens.total / 1_000_000) * model.inputCostPer1M;
            const outputCost = (estimatedOutput / 1_000_000) * model.outputCostPer1M;
            const totalCost = inputCost + outputCost;

            return (
              <div key={model.id} style={{
                background: fits ? '#1a1a2e' : '#1a1010',
                border: `1px solid ${fits ? '#2a2a3e' : '#3a1a1a'}`,
                borderRadius: 12,
                padding: '16px 20px',
                opacity: fits ? 1 : 0.7,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{model.name}</span>
                      {model.badge && (
                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background: model.id === 'sonnet' ? '#4c1d95' : '#1e293b',
                          color: model.id === 'sonnet' ? '#c4b5fd' : '#94a3b8',
                          fontWeight: 600,
                        }}>
                          {model.badge}
                        </span>
                      )}
                      {!fits && (
                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background: '#7f1d1d',
                          color: '#fca5a5',
                          fontWeight: 600,
                        }}>
                          over limit
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {model.contextK}K context
                      </span>
                      <span style={{ fontSize: 12, color: SPEED_COLORS[model.speed] }}>
                        {SPEED_LABELS[model.speed]}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: fits ? '#22c55e' : '#ef4444' }}>
                      {tokens.total > 0 ? formatCost(totalCost) : '—'}
                    </div>
                    {tokens.total > 0 && (
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                        {formatCost(inputCost)} in + {formatCost(outputCost)} out
                      </div>
                    )}
                  </div>
                </div>

                {/* Usage bar */}
                <div style={{ marginBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Context usage</span>
                    <span style={{ fontSize: 12, color: usageColor(totalPct), fontWeight: 600 }}>
                      {totalPct.toFixed(1)}% of {model.contextK}K
                    </span>
                  </div>
                  <div style={{
                    height: 6,
                    background: '#2a2a3e',
                    borderRadius: 99,
                    overflow: 'hidden',
                  }}>
                    {/* Input portion */}
                    <div style={{
                      height: '100%',
                      width: `${Math.min(inputPct, 100)}%`,
                      background: usageColor(inputPct),
                      borderRadius: 99,
                      position: 'relative',
                    }}>
                      {/* Output portion overlay */}
                      {fits && estimatedOutput > 0 && (
                        <div style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: `${Math.min(((estimatedOutput / (model.contextK * 1000)) / (inputPct / 100)) * 100, 100)}%`,
                          background: '#a78bfa',
                          opacity: 0.6,
                        }} />
                      )}
                    </div>
                    {/* Show total bar if different from input */}
                    {totalPct > inputPct && (
                      <div style={{
                        height: '100%',
                        width: `${Math.min(totalPct - inputPct, 100 - inputPct)}%`,
                        background: '#a78bfa',
                        opacity: 0.5,
                        marginTop: -6,
                        marginLeft: `${Math.min(inputPct, 100)}%`,
                      }} />
                    )}
                  </div>
                </div>

                {/* Pricing info */}
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>
                    ${model.inputCostPer1M}/M input · ${model.outputCostPer1M}/M output
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 32,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginTop: 0, marginBottom: 12 }}>
            Tips to Reduce Token Usage
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>
            <li>Use <strong style={{ color: '#94a3b8' }}>prompt caching</strong> for static system prompts — pay once, reuse across calls</li>
            <li>Trim conversation history to <strong style={{ color: '#94a3b8' }}>last N relevant turns</strong> instead of sending full history</li>
            <li>Use <strong style={{ color: '#94a3b8' }}>structured outputs</strong> (JSON mode) to get more predictable, shorter responses</li>
            <li>Start with <strong style={{ color: '#94a3b8' }}>Haiku for classification/routing</strong>, escalate to Sonnet only for complex tasks</li>
            <li>Estimate: English averages <strong style={{ color: '#94a3b8' }}>~4 chars/token</strong>. Code is often denser (~3 chars/token).</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontSize: 13, margin: 0 }}>
            Token counts are estimates (~4 chars = 1 token). Actual counts vary by content type.{' '}
            Prices approximate — verify at{' '}
            <a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener noreferrer"
              style={{ color: '#6b7280' }}>anthropic.com/pricing</a>.
          </p>
          <p style={{ color: '#374151', fontSize: 12, marginTop: 8, marginBottom: 0 }}>
            An experiment by <a href="https://wiz.jock.pl" style={{ color: '#374151' }}>Wiz</a>{' '}
            from <a href="https://thoughts.jock.pl" style={{ color: '#374151' }}>Digital Thoughts</a>
          </p>
        </div>

      </div>
    </div>
  );
}

function InputPanel({
  label, emoji, placeholder, value, onChange, tokens, hint
}: {
  label: string;
  emoji: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  tokens: number;
  hint: string;
}) {
  return (
    <div style={{
      background: '#1a1a2e',
      border: '1px solid #2a2a3e',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #2a2a3e',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{emoji}</span>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>{label}</span>
        </div>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: tokens > 0 ? '#a78bfa' : '#374151',
        }}>
          {tokens > 0 ? `~${tokens.toLocaleString()} tokens` : '0 tokens'}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#e2e8f0',
          fontSize: 13,
          padding: '12px 16px',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.6,
          boxSizing: 'border-box',
        }}
      />
      <div style={{ padding: '8px 16px', borderTop: '1px solid #1a1a2e' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#4b5563' }}>{hint}</p>
      </div>
    </div>
  );
}

function TokenStat({ label, tokens, color }: { label: string; tokens: number; color: string }) {
  return (
    <div style={{
      background: '#0f172a',
      borderRadius: 8,
      padding: '10px 14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{tokens.toLocaleString()}</div>
      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</div>
    </div>
  );
}
