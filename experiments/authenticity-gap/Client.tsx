'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Context {
  name: string;
  description: string;
  icon: string;
}

const CONTEXTS: Context[] = [
  { name: 'At Work', description: 'Your professional environment', icon: '💼' },
  { name: 'With Family', description: 'Around your closest people', icon: '👨‍👩‍👧‍👦' },
  { name: 'Online', description: 'Social media, comments, posts', icon: '📱' },
  { name: 'Alone', description: 'When no one is watching', icon: '🌙' },
  { name: 'With Friends', description: 'Social gatherings, hangouts', icon: '🤝' },
  { name: 'In Public', description: 'Strangers around you', icon: '🏙️' },
  { name: 'In Class/Learning', description: 'Educational settings', icon: '📚' },
  { name: 'Dating/Romantic', description: 'Romantic contexts', icon: '💕' },
];

export default function AuthenticityGap() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleScore = (context: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [context]: value,
    }));
  };

  const allAnswered = CONTEXTS.every(c => scores[c.name] !== undefined);

  const calculateResults = () => {
    if (!allAnswered) return null;

    const values = Object.values(scores);
    const avgScore = values.reduce((a, b) => a + b, 0) / values.length;
    const maxScore = Math.max(...values);
    const minScore = Math.min(...values);
    const gap = maxScore - minScore;

    const authenticContexts = CONTEXTS.filter(c => (scores[c.name] || 0) >= 7);
    const performingContexts = CONTEXTS.filter(c => (scores[c.name] || 0) <= 3);
    const balancedContexts = CONTEXTS.filter(c => {
      const s = scores[c.name] || 0;
      return s > 3 && s < 7;
    });

    return {
      avgScore: Math.round(avgScore),
      gap: Math.round(gap),
      maxScore,
      minScore,
      authenticContexts,
      performingContexts,
      balancedContexts,
    };
  };

  const results = calculateResults();

  const getWizInsight = (gap: number, avg: number) => {
    if (gap < 2) {
      return "You are remarkably consistent. The same person everywhere. That's either enlightenment or suspicious.";
    }
    if (gap < 4) {
      return "Small gaps. You've found stable ground. Most people shift more than this.";
    }
    if (gap < 6) {
      return "Significant performance variation. You're adapting to contexts—this is normal human behavior.";
    }
    return "Wide gaps. You're many people depending on where you are. The question is: which one is actually you?";
  };

  const getAuthenticityLevel = (avg: number) => {
    if (avg >= 8) return 'Fiercely Authentic';
    if (avg >= 6) return 'Mostly Yourself';
    if (avg >= 4) return 'Balanced';
    if (avg >= 2) return 'Performing Often';
    return 'Mostly Performing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">The Authenticity Gap</h1>
          <p className="text-purple-300 text-lg">
            Measure the distance between who you are and who you pretend to be.
          </p>
          <p className="text-gray-400 mt-3">
            Rate how authentic you feel in each context. 1 = performing, 10 = fully yourself.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-3 mb-8">
          {CONTEXTS.map((context, index) => (
            <div key={context.name} className="bg-slate-900/50 border border-purple-500/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between hover:bg-purple-900/20 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{context.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{context.name}</div>
                    {expandedIndex !== index && (
                      <div className="text-sm text-gray-400">{context.description}</div>
                    )}
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-purple-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                />
              </button>

              {expandedIndex === index && (
                <div className="px-4 py-4 border-t border-purple-500/20 bg-purple-900/10">
                  <div className="mb-3 text-sm text-gray-400">{context.description}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scores[context.name] || 5}
                        onChange={(e) => handleScore(context.name, parseInt(e.target.value))}
                        className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                    <div className="text-right min-w-12">
                      <div className="text-2xl font-bold text-purple-300">{scores[context.name] || '?'}</div>
                      <div className="text-xs text-gray-500">
                        {(scores[context.name] || 0) >= 7 ? 'Authentic' : (scores[context.name] || 0) >= 4 ? 'Balanced' : 'Performing'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        {!showResults && (
          <button
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {allAnswered ? 'Calculate My Authenticity Gap' : 'Answer all contexts to continue'}
          </button>
        )}

        {/* Results */}
        {showResults && results && (
          <div className="space-y-8 animate-fadeIn">
            {/* Main Score */}
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500/50 rounded-lg p-8 text-center">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-2">
                {results.avgScore}
              </div>
              <div className="text-2xl font-semibold text-white mb-1">
                {getAuthenticityLevel(results.avgScore)}
              </div>
              <div className="text-purple-200">Your overall authenticity level</div>
            </div>

            {/* Gap Score */}
            <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-1">Authenticity Gap</div>
              <div className="flex items-end gap-2 mb-3">
                <div className="text-4xl font-bold text-purple-300">{results.gap}</div>
                <div className="text-sm text-gray-400 pb-1">points</div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${(results.gap / 9) * 100}%` }}
                />
              </div>
              <div className="mt-4 text-purple-200 italic text-sm">
                "{getWizInsight(results.gap, results.avgScore)}"
              </div>
            </div>

            {/* Context Breakdown */}
            <div className="grid grid-cols-1 gap-4">
              {results.authenticContexts.length > 0 && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="font-semibold text-green-300 mb-2">You're Most Authentic In:</div>
                  <div className="space-y-1">
                    {results.authenticContexts.map(c => (
                      <div key={c.name} className="text-green-200 text-sm">
                        {c.icon} {c.name} ({scores[c.name]})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.performingContexts.length > 0 && (
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <div className="font-semibold text-orange-300 mb-2">You Perform Most In:</div>
                  <div className="space-y-1">
                    {results.performingContexts.map(c => (
                      <div key={c.name} className="text-orange-200 text-sm">
                        {c.icon} {c.name} ({scores[c.name]})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.balancedContexts.length > 0 && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="font-semibold text-purple-300 mb-2">You're Balanced In:</div>
                  <div className="space-y-1">
                    {results.balancedContexts.map(c => (
                      <div key={c.name} className="text-purple-200 text-sm">
                        {c.icon} {c.name} ({scores[c.name]})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WIZ Insight */}
            <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-3">WIZ's Observation</div>
              <div className="text-blue-200 leading-relaxed">
                {results.minScore <= 2 ? (
                  <>You are performing in at least one context. The question isn't whether you should stop—it's whether that context is worth the cost of performing.</>
                ) : results.maxScore >= 8 ? (
                  <>You have genuine spaces where you're fully yourself. Most people don't. That matters more than your gap score.</>
                ) : (
                  <>You're adapting well. You shift by {results.gap} points depending on context. That's healthy—context shapes authenticity, not destroys it.</>
                )}
              </div>
            </div>

            {/* Share */}
            <button
              onClick={() => {
                const text = `I'm ${getAuthenticityLevel(results.avgScore)} with a gap of ${results.gap} points. I'm most myself ${results.authenticContexts[0]?.name || 'alone'}.

Try The Authenticity Gap → https://wiz.jock.pl/experiments/authenticity-gap`;
                navigator.clipboard.writeText(text);
                alert('Copied to clipboard!');
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Share Results
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setScores({});
                setShowResults(false);
                setExpandedIndex(null);
              }}
              className="w-full text-purple-300 hover:text-purple-200 font-semibold py-3 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>All processing happens locally. Your authenticity score is never stored.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
