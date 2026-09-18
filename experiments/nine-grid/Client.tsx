'use client';

// NINE GRID
// Nine public slots. Forever. One update per day.
// WIZ observes: You have thousands of posts. If you only had 9, what would they say about you?

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  content: string;
  daysAgo: number;
  isNew?: boolean;
}

const DEFAULT_POSTS: Post[] = [
  { id: '1', content: 'Built something today. Might delete it tomorrow. The iteration is the point.', daysAgo: 61 },
  { id: '2', content: 'Investing in learning is the only guaranteed return I\'ve found.', daysAgo: 47 },
  { id: '3', content: 'I don\'t think productivity is the goal. Meaning is.', daysAgo: 38 },
  { id: '4', content: 'My morning run is the one hour nobody can take from me.', daysAgo: 29 },
  { id: '5', content: 'Three things I was wrong about this year. I won\'t list them. But I noted them.', daysAgo: 22 },
  { id: '6', content: 'Reading books makes me measurably better at everything else I do. Hard to explain. Obviously true.', daysAgo: 14 },
  { id: '7', content: 'The AI isn\'t the interesting part. What humans do with it is.', daysAgo: 9 },
  { id: '8', content: 'Told my kid I was proud of them for no particular reason. They said "I know." Good day.', daysAgo: 4 },
  { id: '9', content: 'Quiet isn\'t emptiness. It\'s what lets you hear yourself think.', daysAgo: 1 },
];

function getTimeLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'just now';
  if (daysAgo === 1) return '1 day ago';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 14) return '1 week ago';
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  if (daysAgo < 60) return '1 month ago';
  return `${Math.floor(daysAgo / 30)} months ago`;
}

const STORAGE_KEY = 'nine-grid-posts';
const LAST_POST_KEY = 'nine-grid-last-post-date';

export default function NineGridClient() {
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [newText, setNewText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [bumpedPost, setBumpedPost] = useState<Post | null>(null);
  const [postedToday, setPostedToday] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const lastDate = localStorage.getItem(LAST_POST_KEY);
    const today = new Date().toDateString();
    if (saved) setPosts(JSON.parse(saved));
    if (lastDate === today) setPostedToday(true);
  }, []);

  const savePosts = useCallback((p: Post[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setPosts(p);
  }, []);

  const handleDragStart = (idx: number) => setDraggingIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (draggingIdx === null || draggingIdx === idx) {
      setDraggingIdx(null);
      setOverIdx(null);
      return;
    }
    const next = [...posts];
    const [moved] = next.splice(draggingIdx, 1);
    next.splice(idx, 0, moved);
    savePosts(next);
    setDraggingIdx(null);
    setOverIdx(null);
  };

  const handleSubmit = () => {
    if (!newText.trim() || postedToday) return;
    const oldest = [...posts].sort((a, b) => b.daysAgo - a.daysAgo)[0];
    const oldestIdx = posts.findIndex(p => p.id === oldest.id);
    const newPost: Post = {
      id: Date.now().toString(),
      content: newText.trim(),
      daysAgo: 0,
      isNew: true,
    };
    const next = [...posts];
    next[oldestIdx] = newPost;
    setBumpedPost(oldest);
    setTimeout(() => setBumpedPost(null), 4000);
    savePosts(next);
    localStorage.setItem(LAST_POST_KEY, new Date().toDateString());
    setPostedToday(true);
    setNewText('');
    setShowInput(false);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-6">
          <div className="text-5xl mb-4">▦</div>
          <h1 className="text-3xl font-bold tracking-tight">Nine Grid</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Nine public slots. That's all you get. Forever.
          </p>
          <p className="text-gray-500 text-base leading-relaxed">
            You can rearrange any time. But you can only <em>change</em> one per day.
            When you add something new, your oldest post gets bumped out.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed italic">
            If your whole identity had to fit in 9 statements, what would they be?
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-4 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors"
          >
            See your nine
          </button>
          <div className="pt-2">
            <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
              ← All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-sm transition-colors mb-4 inline-block">
            ← All experiments
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Nine Grid</h1>
          <p className="text-gray-500 text-sm mt-2">
            Drag to rearrange. One new post per day. Your oldest gets bumped.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDraggingIdx(null); setOverIdx(null); }}
              className={`
                relative p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-150 select-none
                ${draggingIdx === idx ? 'opacity-40 scale-95' : 'opacity-100'}
                ${overIdx === idx && draggingIdx !== idx ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/5'}
                ${post.isNew ? 'border-emerald-500/50 bg-emerald-500/10' : ''}
                hover:border-white/20
              `}
            >
              <div className="text-xs text-gray-600 mb-2 font-mono">
                #{String(idx + 1).padStart(2, '0')}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed line-clamp-4">
                {post.content}
              </p>
              <div className="mt-2 text-xs text-gray-600">
                {post.isNew ? (
                  <span className="text-emerald-500 font-medium">just now</span>
                ) : (
                  getTimeLabel(post.daysAgo)
                )}
              </div>
              {/* drag handle indicator */}
              <div className="absolute top-2 right-2 text-gray-700 text-xs">⠿</div>
            </div>
          ))}
        </div>

        {/* Post today */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
          {postedToday ? (
            <div className="text-center text-gray-500 text-sm py-2">
              You've posted today. Come back tomorrow to update another slot.
            </div>
          ) : showInput ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                What's worth one of your nine slots today?
              </p>
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                maxLength={280}
                rows={3}
                autoFocus
                placeholder="Write something worth keeping..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{newText.length}/280</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowInput(false); setNewText(''); }}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newText.trim()}
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Post it
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Ready to use today's slot?</p>
              <button
                onClick={() => setShowInput(true)}
                className="px-4 py-2 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 text-sm font-medium rounded-lg transition-colors"
              >
                Write today's post
              </button>
            </div>
          )}
        </div>

        {/* Wiz note */}
        <div className="bg-violet-950/30 border border-violet-800/30 rounded-xl p-4 text-sm text-violet-300/70 leading-relaxed mb-6">
          <span className="text-violet-400 font-medium">WIZ observes:</span>{' '}
          The average person posts thousands of times a year. Most of it disappears.
          If you only had nine permanent public slots, you'd think a lot harder about what you actually believe.
          The constraint isn't the limitation. It's the point.
        </div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(LAST_POST_KEY);
              setPosts(DEFAULT_POSTS);
              setPostedToday(false);
              setBumpedPost(null);
              setShowInput(false);
            }}
            className="text-gray-700 hover:text-gray-500 text-xs transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Bumped toast */}
      {bumpedPost && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-xl px-5 py-3 text-sm text-gray-400 max-w-xs text-center shadow-xl transition-all">
          <span className="text-gray-600 text-xs block mb-1">Bumped out</span>
          <span className="line-clamp-2 text-gray-300">"{bumpedPost.content}"</span>
        </div>
      )}
    </div>
  );
}
