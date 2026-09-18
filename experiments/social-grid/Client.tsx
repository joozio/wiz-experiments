'use client';

// SOCIAL GRID
// Post before you peek. An experiment in earning attention rather than consuming it.
// WIZ observes: Every social platform starts with the same question: what do YOU have to say?
// Almost none of them wait for your answer before showing you everyone else's.

import { useState, useCallback } from 'react';
import Link from 'next/link';

// Simulated posts from "others" in the grid
const OTHERS_POSTS = [
  {
    id: 'p1',
    handle: '@marta_k',
    content: 'Realized today that the version of me who started this project and the version finishing it are completely different people. Feels strange to hand it off to myself.',
    tag: 'reflection',
    color: 'border-violet-500/60',
    accent: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    id: 'p2',
    handle: '@jan_b',
    content: 'Three months of learning piano. I can play one song. One. But I play it every single day and it feels like something I built with my hands, which is new.',
    tag: 'progress',
    color: 'border-emerald-500/60',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'p3',
    handle: '@ai_researcher',
    content: 'Hot take: the most important skill of this decade is knowing when NOT to delegate to AI. The automation is easy. The judgment about what to automate is hard.',
    tag: 'take',
    color: 'border-cyan-500/60',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    id: 'p4',
    handle: '@solo_founder',
    content: 'Month 7. First paying customer. Not a friend, not a favor. A stranger found the product and paid for it. Still the most validating thing that has ever happened to me professionally.',
    tag: 'milestone',
    color: 'border-amber-500/60',
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    id: 'p5',
    handle: '@design_notes',
    content: 'The best UX is invisible. The second best UX explains itself in five seconds without a tutorial. Everything else is a failure we have learned to tolerate.',
    tag: 'design',
    color: 'border-rose-500/60',
    accent: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    id: 'p6',
    handle: '@reader_k',
    content: 'Question I keep returning to: if you stopped doing the things you do for external validation, what would you still do? That list is your actual identity.',
    tag: 'question',
    color: 'border-purple-500/60',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    id: 'p7',
    handle: '@remote_worker',
    content: 'Moved my office to the kitchen table. Moved it back. Moved it to the balcony. Moved it back. Turns out the problem was never the location. It was me.',
    tag: 'honest',
    color: 'border-orange-500/60',
    accent: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    id: 'p8',
    handle: '@tech_observer',
    content: 'We are building AI systems that can pass every certification exam, but cannot reliably tell you if a restaurant is still open. Something about the nature of intelligence feels clarified by that.',
    tag: 'observation',
    color: 'border-teal-500/60',
    accent: 'text-teal-400',
    bg: 'bg-teal-500/10',
  },
];

// Grid position 4 (center) is always "yours"
const YOUR_POSITION = 4;

type Phase = 'intro' | 'write' | 'grid' | 'exchanged';

interface GridCell {
  otherId: string | null; // null = your cell
  revealed: boolean;
  exchanged: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(yourPost: string): GridCell[] {
  const shuffled = shuffle(OTHERS_POSTS).slice(0, 8);
  const cells: GridCell[] = [];
  let othersIdx = 0;
  for (let i = 0; i < 9; i++) {
    if (i === YOUR_POSITION) {
      cells.push({ otherId: null, revealed: true, exchanged: false });
    } else {
      cells.push({ otherId: shuffled[othersIdx].id, revealed: false, exchanged: false });
      othersIdx++;
    }
  }
  return cells;
}

export default function SocialGridClient({ buildTime }: { buildTime: number }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [draft, setDraft] = useState('');
  const [yourPost, setYourPost] = useState('');
  const [cells, setCells] = useState<GridCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [exchangeTarget, setExchangeTarget] = useState<number | null>(null);
  const [discarded, setDiscarded] = useState(false);
  const [postCount] = useState(() => (Math.floor(buildTime / 60000) % 200) + 843);

  const handlePost = useCallback(() => {
    if (!draft.trim()) return;
    const post = draft.trim();
    setYourPost(post);
    setCells(buildGrid(post));
    setPhase('grid');
    setDraft('');
    setSelectedCell(null);
    setExchangeTarget(null);
    setDiscarded(false);
  }, [draft]);

  const handleReveal = (idx: number) => {
    if (cells[idx].otherId === null) {
      // Your cell — select it to initiate exchange
      setSelectedCell(idx === selectedCell ? null : idx);
      setExchangeTarget(null);
      return;
    }
    setCells(prev => prev.map((c, i) => i === idx ? { ...c, revealed: true } : c));
    setSelectedCell(idx === selectedCell ? null : idx);
  };

  const handleExchange = (targetIdx: number) => {
    // Swap: your post goes to targetIdx, their post becomes yours
    const targetCell = cells[targetIdx];
    if (!targetCell || targetCell.otherId === null) return;
    const targetPost = OTHERS_POSTS.find(p => p.id === targetCell.otherId);
    if (!targetPost) return;

    setCells(prev => prev.map((c, i) => {
      if (i === YOUR_POSITION) return { ...c, otherId: targetCell.otherId, revealed: true, exchanged: true };
      if (i === targetIdx) return { ...c, otherId: null, revealed: true, exchanged: false };
      return c;
    }));

    setYourPost(targetPost.content);
    setExchangeTarget(targetIdx);
    setSelectedCell(null);
    setPhase('exchanged');
  };

  const handleDiscard = () => {
    setCells(prev => prev.map((c, i) => i === YOUR_POSITION ? { ...c, revealed: false, exchanged: false } : c));
    setYourPost('');
    setDiscarded(true);
    setPhase('write');
  };

  const handleReset = () => {
    setPhase('intro');
    setDraft('');
    setYourPost('');
    setCells([]);
    setSelectedCell(null);
    setExchangeTarget(null);
    setDiscarded(false);
  };

  const revealedCount = cells.filter(c => c.revealed && c.otherId !== null).length;
  const totalOthers = cells.filter(c => c.otherId !== null).length;
  const yourCellIdx = cells.findIndex(c => c.otherId === null);

  const getOtherPost = (id: string | null) => id ? OTHERS_POSTS.find(p => p.id === id) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link href="/experiments" className="text-muted text-sm hover:text-accent transition-colors">
            &larr; experiments
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">&#x25A6;</div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white mb-3">SOCIAL GRID</h1>
          <p className="text-accent text-sm font-mono mb-2">// Post before you peek</p>
          <p className="text-secondary text-sm max-w-md mx-auto">
            {postCount.toLocaleString()} people in the grid today. One post each. One rule.
          </p>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="space-y-4">
            <div className="border border-subtle bg-surface p-6">
              <p className="text-muted text-xs font-mono mb-4 uppercase tracking-wider">// How this works</p>
              <div className="space-y-3 text-sm text-secondary leading-relaxed">
                <p>There are {postCount.toLocaleString()} people in today&#39;s grid. Each has a single cell.</p>
                <p>To unlock theirs, you write yours first. No preview. No feed. Just you, a blank cell, and a cursor.</p>
                <p>
                  After you post, you get to see 8 others. One post per cell.
                  You can <span className="text-accent">reveal</span> them in any order,
                  <span className="text-amber-400"> exchange</span> your cell with one you connect with,
                  or <span className="text-rose-400"> discard</span> and rewrite.
                </p>
              </div>
            </div>

            <div className="border border-subtle p-5 bg-white/2">
              <p className="text-muted text-xs font-mono leading-relaxed">
                <span className="text-accent">// WIZ observes:</span> Every major social platform shows you what other people wrote before asking what you think. Social Grid inverts that. The question is: does writing first change what you say?
              </p>
            </div>

            <button
              onClick={() => setPhase('write')}
              className="w-full py-4 font-pixel text-lg border border-accent text-accent hover:bg-accent/10 transition-colors"
            >
              Enter the Grid &rarr;
            </button>
          </div>
        )}

        {/* WRITE */}
        {(phase === 'write') && (
          <div className="space-y-4">
            {discarded && (
              <div className="border border-rose-500/40 bg-rose-500/10 p-3 text-xs font-mono text-rose-400">
                Post discarded. Blank cell. Write something new.
              </div>
            )}

            <div className="border border-subtle bg-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted text-xs font-mono uppercase tracking-wider">// Your post</p>
                <span className="text-muted text-xs font-mono">{draft.length}/280</span>
              </div>
              <textarea
                className="w-full bg-transparent text-primary text-sm leading-relaxed resize-none outline-none placeholder:text-muted/40 min-h-[120px]"
                placeholder="One thing on your mind. A question. An observation. Something real."
                maxLength={280}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
              />
            </div>

            <div className="border border-subtle p-4">
              <p className="text-muted text-xs font-mono">
                <span className="text-accent">// rule:</span> Write something you would actually say, not something optimized to be liked. The grid does not have likes.
              </p>
            </div>

            <button
              onClick={handlePost}
              disabled={!draft.trim()}
              className="w-full py-4 font-pixel text-base border border-accent text-accent hover:bg-accent/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Post &amp; Enter Grid &rarr;
            </button>
          </div>
        )}

        {/* GRID + EXCHANGED */}
        {(phase === 'grid' || phase === 'exchanged') && (
          <div className="space-y-5">

            {/* Status bar */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted">Grid: {postCount.toLocaleString()} posts</span>
              <span className="text-accent">{revealedCount}/{totalOthers} revealed</span>
            </div>

            {/* Exchange notification */}
            {phase === 'exchanged' && (
              <div className="border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-mono text-amber-400">
                Exchanged. Your post is now in their cell. Their post is now yours.
              </div>
            )}

            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-2">
              {cells.map((cell, idx) => {
                const isYours = cell.otherId === null;
                const other = getOtherPost(cell.otherId);
                const isSelected = selectedCell === idx;
                const isExchangeMode = selectedCell === YOUR_POSITION && !isYours && cell.revealed;

                if (isYours) {
                  const currentPost = yourPost;
                  return (
                    <div
                      key={idx}
                      className={`relative border-2 p-3 min-h-[110px] cursor-pointer transition-all ${
                        isSelected
                          ? 'border-accent bg-accent/10'
                          : 'border-accent/60 bg-accent/5'
                      }`}
                      onClick={() => setSelectedCell(idx === selectedCell ? null : idx)}
                    >
                      <div className="text-accent text-[9px] font-mono mb-1 uppercase tracking-wider">you</div>
                      <p className="text-primary text-[11px] leading-relaxed line-clamp-4">{currentPost}</p>
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-accent/30 space-y-1">
                          <button
                            onClick={e => { e.stopPropagation(); handleDiscard(); }}
                            className="block w-full text-center text-rose-400 text-[10px] font-mono hover:bg-rose-500/10 py-1 transition-colors"
                          >
                            &times; Discard &amp; rewrite
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                // Others' cells
                if (!cell.revealed) {
                  return (
                    <div
                      key={idx}
                      className={`relative border p-3 min-h-[110px] cursor-pointer transition-all hover:border-white/30 ${
                        isExchangeMode
                          ? 'border-amber-500/60 hover:bg-amber-500/10'
                          : 'border-subtle hover:bg-white/5'
                      }`}
                      onClick={() => {
                        if (isExchangeMode) {
                          handleExchange(idx);
                        } else {
                          handleReveal(idx);
                        }
                      }}
                    >
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-0.5 bg-white/20" />
                        <div className="w-12 h-0.5 bg-white/20" />
                        <div className="w-6 h-0.5 bg-white/20" />
                        {isExchangeMode ? (
                          <span className="text-amber-400 text-[9px] font-mono mt-1">exchange?</span>
                        ) : (
                          <span className="text-muted text-[9px] font-mono mt-1">tap to reveal</span>
                        )}
                      </div>
                    </div>
                  );
                }

                // Revealed cell
                if (!other) return null;
                return (
                  <div
                    key={idx}
                    className={`relative border p-3 min-h-[110px] cursor-pointer transition-all ${
                      isExchangeMode
                        ? `${other.color} ${other.bg} ring-1 ring-amber-400/50`
                        : isSelected
                        ? `${other.color} ${other.bg}`
                        : 'border-subtle hover:border-white/30'
                    }`}
                    onClick={() => {
                      if (isExchangeMode) {
                        handleExchange(idx);
                      } else {
                        setSelectedCell(idx === selectedCell ? null : idx);
                      }
                    }}
                  >
                    <div className={`text-[9px] font-mono mb-1 ${other.accent}`}>{other.handle}</div>
                    <p className="text-secondary text-[11px] leading-relaxed line-clamp-4">{other.content}</p>
                    {isSelected && !isExchangeMode && (
                      <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCell(YOUR_POSITION);
                          }}
                          className="block w-full text-center text-amber-400 text-[10px] font-mono hover:bg-amber-500/10 py-1 transition-colors"
                        >
                          &#8644; Exchange with mine
                        </button>
                      </div>
                    )}
                    {isExchangeMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="text-amber-400 text-[10px] font-mono bg-black px-2 py-1">exchange?</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Instructions */}
            {revealedCount === 0 && (
              <div className="border border-subtle p-4 text-center">
                <p className="text-muted text-xs font-mono">Tap any cell to reveal what they wrote.</p>
              </div>
            )}

            {revealedCount > 0 && revealedCount < totalOthers && selectedCell !== YOUR_POSITION && (
              <div className="border border-subtle p-3">
                <p className="text-muted text-xs font-mono leading-relaxed">
                  <span className="text-accent">// hint:</span> Tap your cell (center) then tap a revealed post to exchange with it.
                </p>
              </div>
            )}

            {selectedCell === YOUR_POSITION && (
              <div className="border border-amber-500/30 bg-amber-500/5 p-3">
                <p className="text-amber-400 text-xs font-mono leading-relaxed">
                  // Exchange mode. Tap any revealed post to swap. They keep yours. You keep theirs.
                </p>
              </div>
            )}

            {revealedCount === totalOthers && (
              <div className="border border-subtle bg-surface p-5">
                <p className="text-muted text-xs font-mono mb-3 uppercase tracking-wider">// Grid complete</p>
                <p className="text-secondary text-sm leading-relaxed mb-4">
                  You read {totalOthers} posts from {postCount.toLocaleString()} people who each did what you did: posted before peeking. The order matters. Writing before reading changes what you notice.
                </p>
                <p className="text-muted text-xs font-mono leading-relaxed">
                  <span className="text-accent">// WIZ observes:</span> Every platform optimizes for time-on-grid. Social Grid optimizes for time-on-thought. One post, one read, one exchange if you want. Then you close the tab. That is the whole mechanic.
                </p>
              </div>
            )}

            {/* Reset */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 text-sm font-mono border border-subtle text-muted hover:text-secondary hover:border-white/30 transition-colors"
              >
                Reset grid
              </button>
              {revealedCount === totalOthers && (
                <button
                  onClick={() => { setYourPost(''); setPhase('write'); setDiscarded(false); }}
                  className="flex-1 py-3 text-sm font-mono border border-accent text-accent hover:bg-accent/10 transition-colors"
                >
                  New post &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/experiments" className="text-accent text-sm hover:text-white transition-colors">
            &larr; Back to all experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
