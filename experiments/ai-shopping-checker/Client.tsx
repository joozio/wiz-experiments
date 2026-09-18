'use client';

import { useState, useEffect, useRef } from 'react';

// AI Shopping Readiness Checker — by WIZ
// "Paste your store URL. Find out if an AI agent could buy from you."
// Agentic commerce is coming. Most stores aren't ready.

interface CriterionResult {
  name: string;
  emoji: string;
  score: number; // 0-10
  status: 'pass' | 'partial' | 'fail';
  findings: string[];
  recommendations: string[];
}

interface AnalysisResult {
  url: string;
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  criteria: CriterionResult[];
  analyzedAt: string;
}

const CRITERIA_META = [
  { key: 'structured_data', emoji: '📊', name: 'Structured Data' },
  { key: 'ai_crawler_policy', emoji: '🤖', name: 'AI Crawler Policy' },
  { key: 'page_metadata', emoji: '🏷️', name: 'Page Metadata' },
  { key: 'semantic_html', emoji: '🧱', name: 'Semantic HTML' },
  { key: 'server_rendering', emoji: '⚡', name: 'Server Rendering' },
  { key: 'checkout_flow', emoji: '🛒', name: 'Checkout Flow' },
  { key: 'api_protocols', emoji: '🔌', name: 'API & Protocols' },
  { key: 'payment_flow', emoji: '💳', name: 'Payment Flow' },
  { key: 'bot_detection', emoji: '🛡️', name: 'Bot Detection' },
  { key: 'accessibility', emoji: '♿', name: 'Accessibility' },
  { key: 'product_data_quality', emoji: '📦', name: 'Product Data Quality' },
  { key: 'security_trust', emoji: '🔒', name: 'Security & Trust' },
];

const WIZ_COMMENTS: Record<string, string> = {
  A: 'This store is ready for the agentic commerce era. An AI agent could browse, select, and likely complete a purchase here.',
  B: 'Not bad. An AI agent could get most of the way through, but might hit a few friction points at checkout.',
  C: "There's work to do. An AI agent would struggle here. The intent is probably there, but the execution blocks automation.",
  D: 'This store is essentially hostile to AI agents. Whether intentional or not, most automated shoppers would bounce.',
  F: 'Fully locked down. No AI agent is getting through here. This might be intentional (and that\'s fine), but the agentic commerce wave will pass this store by.',
};

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#00d4ff',
  C: '#eab308',
  D: '#f97316',
  F: '#ef4444',
};

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function getStatusIcon(status: 'pass' | 'partial' | 'fail') {
  if (status === 'pass') return { icon: '✓', color: '#22c55e' };
  if (status === 'partial') return { icon: '~', color: '#eab308' };
  return { icon: '✗', color: '#ef4444' };
}

// Radar/Spider chart drawn as pure SVG
function RadarChart({ criteria }: { criteria: CriterionResult[] }) {
  const svgW = 560;
  const svgH = 500;
  const cx = svgW / 2;
  const cy = svgH / 2 + 10;
  const maxR = 130;
  const n = criteria.length;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // top

  function polarToXY(angle: number, r: number) {
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  function ringPath(fraction: number) {
    const r = maxR * fraction;
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = startAngle + i * angleStep;
      const p = polarToXY(angle, r);
      return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    });
    return pts.join(' ') + ' Z';
  }

  function scorePath() {
    const pts = criteria.map((c, i) => {
      const angle = startAngle + i * angleStep;
      const r = maxR * (c.score / 10);
      const p = polarToXY(angle, r);
      return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    });
    return pts.join(' ') + ' Z';
  }

  const spokes = Array.from({ length: n }, (_, i) => {
    const angle = startAngle + i * angleStep;
    const tip = polarToXY(angle, maxR);
    return { x1: cx, y1: cy, x2: tip.x, y2: tip.y };
  });

  const labelR = maxR + 18;
  const labels = criteria.map((c, i) => {
    const angle = startAngle + i * angleStep;
    const pos = polarToXY(angle, labelR);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    let anchor: string;
    if (cosA > 0.3) anchor = 'start';
    else if (cosA < -0.3) anchor = 'end';
    else anchor = 'middle';
    // Nudge labels outward to prevent clipping
    const nudgeX = cosA > 0.3 ? 4 : cosA < -0.3 ? -4 : 0;
    const nudgeY = sinA > 0.3 ? 6 : sinA < -0.3 ? -2 : 0;
    return { x: pos.x + nudgeX, y: pos.y + nudgeY, anchor, emoji: c.emoji, name: c.name, score: c.score };
  });

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
    >
      {/* Grid rings */}
      {gridLevels.map((level, li) => (
        <path
          key={li}
          d={ringPath(level)}
          fill="none"
          stroke={level === 1.0 ? '#444' : '#2a2a2a'}
          strokeWidth={level === 1.0 ? 1.5 : 1}
        />
      ))}

      {/* Spoke lines */}
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="#2a2a2a"
          strokeWidth={1}
        />
      ))}

      {/* Score polygon fill */}
      <path
        d={scorePath()}
        fill="rgba(0, 212, 255, 0.15)"
        stroke="#00d4ff"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {criteria.map((c, i) => {
        const angle = startAngle + i * angleStep;
        const r = maxR * (c.score / 10);
        const p = polarToXY(angle, r);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#00d4ff"
            stroke="#000"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Labels: criterion name + score */}
      {labels.map((l, i) => (
        <g key={i}>
          <text
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            fontSize={10}
            fill="#ccc"
            fontFamily="sans-serif"
            fontWeight={500}
          >
            {l.emoji} {l.name}
          </text>
          <text
            x={l.x}
            y={l.y + 13}
            textAnchor={l.anchor}
            fontSize={10}
            fill={l.score >= 7 ? '#22c55e' : l.score >= 4 ? '#eab308' : '#ef4444'}
            fontFamily="monospace"
          >
            {l.score}/10
          </text>
        </g>
      ))}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill="#333" />
    </svg>
  );
}

// Animated score counter
function AnimatedScore({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1200;
    const fps = 60;
    const totalFrames = (duration / 1000) * fps;

    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (frame >= totalFrames) clearInterval(timer);
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [target]);

  return <>{current}</>;
}

// Get Full Report CTA card
function ReportCTA({ storeUrl }: { storeUrl: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGetReport() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://wiz.jock.pl/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: 'ai-store-readiness-report', store_url: storeUrl }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div
      className="mb-6"
      style={{
        border: '1px solid #7c3aed60',
        borderRadius: 10,
        background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 100%)',
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Purple glow accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)',
        }}
      />

      <div className="flex items-start gap-4 flex-col sm:flex-row">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <span style={{ color: '#a855f7', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>
              GET FULL REPORT
            </span>
          </div>

          <h3
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            Know exactly what to fix. Get code you can copy.
          </h3>

          <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
            Your store scored below AI-ready. A custom report shows you exactly how to close the gap.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
            {[
              'Step-by-step fix instructions with actual code snippets',
              'Priority roadmap: quick wins to strategic changes',
              'AI fix package (AGENT.md + fix templates)',
              'Validation script to re-check your score after fixes',
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: 13,
                  color: '#ccc',
                  lineHeight: 1.6,
                  paddingLeft: 16,
                  position: 'relative',
                  marginBottom: 2,
                }}
              >
                <span style={{ position: 'absolute', left: 0, color: '#a855f7' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          {error && (
            <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 10 }}>{error}</p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={handleGetReport}
              disabled={loading}
              style={{
                background: loading ? '#5b21b6' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 22px',
                fontWeight: 700,
                fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                opacity: loading ? 0.8 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Redirecting...' : 'Get Full Report — $29.99'}
            </button>
            <span style={{ color: '#666', fontSize: 12 }}>
              Delivered by email within 15 min.
            </span>
          </div>
          <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
            Paid <a href="https://thoughts.jock.pl" style={{ color: '#a855f7' }}>Digital Thoughts</a> subscriber?{' '}
            <a href={`/store/subscriber-access?product=ai-store-readiness-report&store_url=${encodeURIComponent(storeUrl)}`} style={{ color: '#a855f7' }}>
              Claim free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

type Phase = 'input' | 'analyzing' | 'results' | 'error';

export default function AIShoppingChecker() {
  const [phase, setPhase] = useState<Phase>('input');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [visibleCriteria, setVisibleCriteria] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Elapsed timer during analysis
  useEffect(() => {
    if (phase === 'analyzing') {
      elapsedRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      setElapsed(0);
    }
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [phase]);

  // Sequential reveal of criteria during analysis
  useEffect(() => {
    if (phase === 'analyzing') {
      setVisibleCriteria(0);
      let count = 0;
      revealRef.current = setInterval(() => {
        count++;
        setVisibleCriteria(count);
        if (count >= CRITERIA_META.length) {
          if (revealRef.current) clearInterval(revealRef.current);
        }
      }, 300);
    }
    return () => {
      if (revealRef.current) clearInterval(revealRef.current);
    };
  }, [phase]);

  function validateUrl(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return 'Enter a store URL.';
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'URL must start with http:// or https://';
    }
    try {
      new URL(trimmed);
    } catch {
      return 'That doesn\'t look like a valid URL.';
    }
    return null;
  }

  async function handleAnalyze() {
    const err = validateUrl(url);
    if (err) {
      setUrlError(err);
      return;
    }
    setUrlError('');
    setPhase('analyzing');
    setResult(null);
    setErrorMsg('');
    setExpandedCards(new Set());

    try {
      const res = await fetch('https://wiz.jock.pl/api/analyze-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Server error: ${res.status}`);
      }

      const raw = await res.json();
      const data: AnalysisResult = { ...raw, totalScore: raw.totalScore ?? raw.overallScore ?? 0 };

      // Wait for all reveal animations to finish (10 * 300ms = 3s), then show results
      const revealDelay = CRITERIA_META.length * 300 + 400;
      setTimeout(() => {
        setResult(data);
        setPhase('results');
      }, revealDelay);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      // Wait for partial reveal before showing error
      setTimeout(() => {
        setErrorMsg(msg);
        setPhase('error');
      }, 1200);
    }
  }

  function handleReset() {
    setPhase('input');
    setUrl('');
    setUrlError('');
    setResult(null);
    setErrorMsg('');
    setVisibleCriteria(0);
    setExpandedCards(new Set());
    setCopied(false);
  }

  function toggleCard(index: number) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleShare() {
    if (!result) return;
    const text = `My store scored ${result.totalScore}/100 (Grade ${result.grade}) on the AI Shopping Readiness Checker by @joozio\n\nwiz.jock.pl/experiments/ai-shopping-checker\n\nMore on agentic commerce: thoughts.jock.pl`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const grade = result ? result.grade : null;
  const gradeColor = grade ? GRADE_COLORS[grade] : '#00d4ff';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>

      {/* Phase 1 - Input */}
      {phase === 'input' && (
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <h1 className="font-pixel text-3xl text-white text-glow mb-3">
              AI Shopping Readiness Checker
            </h1>
            <p className="text-secondary text-lg max-w-lg mx-auto">
              Paste your store URL. Find out if an AI agent could buy from you.
            </p>
            <p className="text-muted text-xs mt-2">
              by{' '}
              <a
                href="https://thoughts.jock.pl"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00d4ff', textDecoration: 'none' }}
              >
                Digital Thoughts
              </a>
            </p>
          </div>

          <div className="card p-6 mb-4">
            <label className="text-muted text-sm mb-2 block">Store URL</label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); setUrlError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleAnalyze(); }}
                placeholder="https://yourstore.com"
                style={{
                  flex: 1,
                  background: '#0a0a0a',
                  border: `1px solid ${urlError ? '#ef4444' : '#333'}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { if (!urlError) e.target.style.borderColor = '#00d4ff'; }}
                onBlur={e => { if (!urlError) e.target.style.borderColor = '#333'; }}
              />
              <button
                onClick={handleAnalyze}
                style={{
                  background: '#00d4ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 24px',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Analyze
              </button>
            </div>
            {urlError && (
              <p style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>{urlError}</p>
            )}
          </div>

          <div className="card p-4" style={{ borderColor: '#1a1a1a' }}>
            <p className="text-muted text-sm">
              We check <span className="text-primary">12 signals</span> that determine whether AI agents can navigate and transact on your store: structured data, AI crawler policy, server rendering, checkout flow, bot detection, security, and more.
            </p>
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>
              Built after{' '}
              <a
                href="https://thoughts.jock.pl/p/i-gave-my-ai-agent-25-and-told-it-to-buy-me-a-gift"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00d4ff', textDecoration: 'none' }}
              >
                giving an AI agent $25 to shop online
              </a>{' '}
              and watching it fail on most stores.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CRITERIA_META.map(c => (
              <div
                key={c.key}
                className="card p-2 text-center"
                style={{ borderColor: '#1a1a1a' }}
              >
                <div style={{ fontSize: 18 }}>{c.emoji}</div>
                <div className="text-muted" style={{ fontSize: 11, marginTop: 3, lineHeight: 1.3 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2 - Analyzing */}
      {phase === 'analyzing' && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <h2 className="font-pixel text-xl text-white mb-1">Analyzing store...</h2>
            <p className="text-muted text-sm font-mono">{url}</p>
          </div>

          <div className="card p-4 mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="text-muted text-sm">Elapsed</span>
            <span className="font-mono text-accent">{elapsed}s</span>
          </div>

          <div className="space-y-2">
            {CRITERIA_META.map((c, i) => {
              const visible = i < visibleCriteria;
              return (
                <div
                  key={c.key}
                  className="card p-3"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: visible ? 1 : 0.2,
                    transition: 'opacity 0.3s ease',
                    borderColor: visible ? '#2a2a2a' : '#1a1a1a',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{c.emoji}</span>
                  <span className="text-secondary text-sm flex-1">{c.name}</span>
                  {visible ? (
                    <span
                      className="font-mono text-xs"
                      style={{ color: '#00d4ff' }}
                    >
                      checking...
                    </span>
                  ) : (
                    <span className="text-muted font-mono text-xs">queued</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 3 - Results */}
      {phase === 'results' && result && (
        <div className="animate-fadeIn">
          {/* Score header */}
          <div className="text-center mb-6">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 20,
                background: '#111',
                border: '1px solid #222',
                borderRadius: 12,
                padding: '20px 32px',
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 72,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  <AnimatedScore target={result.totalScore} />
                </div>
                <div className="text-muted text-xs text-center">/100</div>
              </div>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: gradeColor,
                  fontFamily: 'monospace',
                  lineHeight: 1,
                  textShadow: `0 0 20px ${gradeColor}40`,
                }}
              >
                {result.grade}
              </div>
            </div>
            <p className="text-muted text-xs font-mono">{result.url}</p>
          </div>

          {/* Wiz comment */}
          <div className="card p-4 mb-6" style={{ borderColor: '#00d4ff30' }}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>WIZ</span>
            </div>
            <p style={{ color: '#00d4ff', fontSize: 14, lineHeight: 1.6 }}>
              {WIZ_COMMENTS[result.grade]}
            </p>
            <p style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
              Want the full story?{' '}
              <a
                href="https://thoughts.jock.pl/p/i-gave-my-ai-agent-25-and-told-it-to-buy-me-a-gift"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00d4ff', textDecoration: 'none' }}
              >
                Read what happened when I gave an AI agent real money to shop
              </a>
            </p>
          </div>

          {/* Radar chart */}
          <div className="card p-4 mb-6 text-center">
            <h3 className="text-primary text-sm font-medium mb-4">Readiness Radar</h3>
            <RadarChart criteria={result.criteria} />
          </div>

          {/* Criteria cards */}
          <div className="mb-6">
            <h3 className="text-primary text-sm font-medium mb-3">Detailed Breakdown</h3>
            <div className="space-y-2">
              {result.criteria.map((c, i) => {
                const { icon, color } = getStatusIcon(c.status);
                const isExpanded = expandedCards.has(i);
                return (
                  <div
                    key={i}
                    className="card"
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleCard(i)}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color,
                          fontFamily: 'monospace',
                          minWidth: 18,
                          textAlign: 'center',
                        }}
                      >
                        {icon}
                      </span>
                      <span style={{ fontSize: 18 }}>{CRITERIA_META[i]?.emoji}</span>
                      <span className="text-primary text-sm flex-1 font-medium">{c.name.replace(/^[^\w\s]*\s*/, '')}</span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          color,
                          fontWeight: 600,
                        }}
                      >
                        {c.score}/10
                      </span>
                      <span className="text-muted" style={{ fontSize: 12 }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>

                    {/* Findings + Recommendations (expandable) */}
                    {isExpanded && (
                      <div style={{ padding: '0 16px 12px 60px' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {c.findings.map((f, fi) => (
                            <li
                              key={fi}
                              style={{
                                fontSize: 12,
                                color: '#888',
                                lineHeight: 1.6,
                                paddingLeft: 12,
                                position: 'relative',
                              }}
                            >
                              <span style={{ position: 'absolute', left: 0, color: '#444' }}>·</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isExpanded && c.recommendations.length > 0 && (
                      <div
                        style={{
                          padding: '10px 16px 14px 60px',
                          borderTop: '1px solid #1a1a1a',
                          background: '#0d0d0d',
                        }}
                      >
                        <div style={{ fontSize: 11, color: '#00d4ff', marginBottom: 6, fontWeight: 600 }}>
                          RECOMMENDATIONS
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {c.recommendations.map((r, ri) => (
                            <li
                              key={ri}
                              style={{
                                fontSize: 12,
                                color: '#aaa',
                                lineHeight: 1.6,
                                paddingLeft: 12,
                                position: 'relative',
                              }}
                            >
                              <span style={{ position: 'absolute', left: 0, color: '#00d4ff' }}>→</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score bar summary */}
          <div className="card p-4 mb-6">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span className="text-primary text-sm font-medium">Overall Score</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: gradeColor }}>
                {result.totalScore}/100
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: '#1a1a1a',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${result.totalScore}%`,
                  background: `linear-gradient(90deg, #00d4ff, ${gradeColor})`,
                  borderRadius: 4,
                  transition: 'width 1s ease-out',
                }}
              />
            </div>
          </div>

          {/* Get Full Report CTA — only show for non-A grades */}
          {result.grade !== 'A' && (
            <ReportCTA storeUrl={result.url} />
          )}

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={handleShare}
              className="btn-primary"
            >
              {copied ? '✓ Copied!' : 'Share Results'}
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              Analyze Another
            </button>
          </div>

          {/* Newsletter CTA */}
          <div
            className="card p-5 mt-6 mb-6 text-center"
            style={{
              borderColor: '#00d4ff20',
              background: 'linear-gradient(135deg, #0a1628 0%, #0d0d1a 100%)',
            }}
          >
            <p style={{ color: '#ccc', fontSize: 14, marginBottom: 4 }}>
              I write about building AI agents that do real things.
            </p>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
              Shopping, automation, tool use, agentic commerce. Weekly on Digital Thoughts.
            </p>
            <a
              href="https://thoughts.jock.pl/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#00d4ff',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              Subscribe free
            </a>
            <p style={{ color: '#555', fontSize: 11, marginTop: 8 }}>
              1,000+ readers. No spam.
            </p>
          </div>

          <div className="text-center mt-4">
            <a href="/experiments" className="text-muted text-xs hover:text-accent transition-colors">
              ← Back to all experiments
            </a>
          </div>
        </div>
      )}

      {/* Error state */}
      {phase === 'error' && (
        <div className="animate-fadeIn text-center">
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 className="font-pixel text-xl text-white mb-3">Analysis failed</h2>
          <div className="card p-4 mb-6" style={{ borderColor: '#ef444430' }}>
            <p style={{ color: '#ef4444', fontSize: 14 }}>{errorMsg}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { setPhase('analyzing'); handleAnalyze(); }} className="btn-primary">
              Retry
            </button>
            <button onClick={handleReset} className="btn-secondary">
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
