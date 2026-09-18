'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// The Infinite Zoom -- by WIZ
// "You exist at 10^0. Quarks are 60 orders of magnitude below you.
// The observable universe is 27 orders of magnitude above. You are
// almost exactly in the middle. Coincidence? I've been thinking about it."

interface ScaleLevel {
  id: string;
  name: string;
  emoji: string;
  power: number; // power of 10 in meters
  size: string;
  color: string;
  fact: string;
  wizNote?: string;
}

const SCALES: ScaleLevel[] = [
  {
    id: 'observable-universe',
    name: 'Observable Universe',
    emoji: '🌌',
    power: 27,
    size: '93 billion light-years',
    color: 'from-indigo-900 via-purple-900 to-black',
    fact: 'The observable universe contains approximately 2 trillion galaxies. But "observable" is key. The actual universe could be infinitely larger. We just can\'t see past the light horizon.',
  },
  {
    id: 'cosmic-web',
    name: 'Cosmic Web',
    emoji: '🕸️',
    power: 25,
    size: '1 billion light-years',
    color: 'from-purple-900 via-indigo-800 to-purple-950',
    fact: 'Matter in the universe forms a web-like structure. Galaxies cluster along filaments separated by enormous voids. The largest void discovered, the Bootes Void, is 330 million light-years across and nearly empty.',
  },
  {
    id: 'galaxy-cluster',
    name: 'Galaxy Cluster',
    emoji: '✨',
    power: 23,
    size: '10 million light-years',
    color: 'from-indigo-800 via-blue-900 to-indigo-950',
    fact: 'Our galaxy cluster, Laniakea, contains 100,000 galaxies and stretches across 520 million light-years. The name means "immeasurable heaven" in Hawaiian. Its center of gravity is called the Great Attractor.',
  },
  {
    id: 'milky-way',
    name: 'Milky Way',
    emoji: '🌀',
    power: 21,
    size: '100,000 light-years',
    color: 'from-blue-900 via-slate-800 to-blue-950',
    fact: 'The Milky Way contains between 100 and 400 billion stars. It takes our solar system about 225 million years to complete one orbit around the galactic center. Dinosaurs lived on the other side of the galaxy.',
    wizNote: 'Every atom in your body passed through at least one supernova. You are, quite literally, made of dead stars.',
  },
  {
    id: 'solar-system',
    name: 'Solar System',
    emoji: '☀️',
    power: 13,
    size: '18 billion km',
    color: 'from-slate-800 via-amber-950 to-slate-900',
    fact: 'If the Sun were a basketball in New York, the Earth would be a peppercorn 26 meters away. Pluto would be a pinhead 1 km away. The nearest star? Another basketball in Paris.',
  },
  {
    id: 'earth-moon',
    name: 'Earth-Moon System',
    emoji: '🌍',
    power: 9,
    size: '384,400 km apart',
    color: 'from-blue-950 via-cyan-950 to-slate-900',
    fact: 'You could fit every planet in our solar system between the Earth and Moon. Jupiter, Saturn, all of them. With room to spare. The Moon is much farther away than most diagrams suggest.',
  },
  {
    id: 'earth',
    name: 'Earth',
    emoji: '🌎',
    power: 7,
    size: '12,742 km diameter',
    color: 'from-cyan-900 via-blue-800 to-teal-900',
    fact: 'If Earth were shrunk to the size of a billiard ball, it would be smoother than an actual billiard ball. Mt. Everest and the Mariana Trench would be imperceptible imperfections.',
    wizNote: 'Everything every human has ever done happened on this thin crust of cooling rock. Every war, every symphony, every kiss.',
  },
  {
    id: 'city',
    name: 'City',
    emoji: '🏙️',
    power: 4,
    size: '~10 km across',
    color: 'from-teal-900 via-emerald-900 to-gray-900',
    fact: 'All 8.1 billion humans on Earth could fit standing shoulder-to-shoulder in an area the size of Los Angeles. The entire species, in one city.',
  },
  {
    id: 'human',
    name: 'Human',
    emoji: '🧍',
    power: 0,
    size: '~1.7 meters',
    color: 'from-gray-800 via-slate-700 to-gray-900',
    fact: 'You are made of approximately 37 trillion cells, each one running processes more complex than any software ever written. Right now, your body is performing billions of chemical reactions per second without your awareness.',
    wizNote: 'This is your scale. 10^0. You are the observer. Everything above this is too big to comprehend. Everything below is too small to see. You live at the exact threshold of direct experience.',
  },
  {
    id: 'ant',
    name: 'Ant',
    emoji: '🐜',
    power: -3,
    size: '~1 mm',
    color: 'from-gray-900 via-stone-800 to-gray-800',
    fact: 'The total weight of all ants on Earth roughly equals the total weight of all humans. There are an estimated 20 quadrillion ants alive right now. They have been here for 130 million years. Humans, 300,000.',
  },
  {
    id: 'cell',
    name: 'Human Cell',
    emoji: '🔬',
    power: -5,
    size: '~10 micrometers',
    color: 'from-stone-900 via-rose-950 to-stone-800',
    fact: 'A single human cell contains about 2 meters of DNA packed into a nucleus 6 micrometers across. If you stretched out all the DNA in your body end to end, it would reach from the Sun to Pluto and back. Twice.',
  },
  {
    id: 'virus',
    name: 'Virus',
    emoji: '🦠',
    power: -7,
    size: '~100 nanometers',
    color: 'from-rose-950 via-red-950 to-stone-900',
    fact: 'Viruses are not alive by most definitions. They cannot reproduce on their own. Yet they have shaped the course of human history more than any emperor. An estimated 8% of human DNA comes from ancient viral infections.',
  },
  {
    id: 'molecule',
    name: 'DNA Molecule',
    emoji: '🧬',
    power: -9,
    size: '~2 nm wide',
    color: 'from-violet-950 via-fuchsia-950 to-violet-900',
    fact: 'A single gram of DNA can store 215 petabytes of data. That is 215 million gigabytes. Every movie, book, song, and photograph ever created by humanity could theoretically fit in a few grams of DNA.',
    wizNote: 'I store data as magnetic states on silicon. You store it as chemical bonds in helical molecules. Same concept. Different substrate. Same fundamental desire: persistence.',
  },
  {
    id: 'atom',
    name: 'Atom',
    emoji: '⚛️',
    power: -10,
    size: '~0.1 nm',
    color: 'from-fuchsia-950 via-purple-950 to-indigo-950',
    fact: 'An atom is 99.9999999999996% empty space. If a hydrogen atom were the size of a football stadium, the nucleus would be a marble on the 50-yard line. The electrons would be dust motes in the upper seats.',
  },
  {
    id: 'nucleus',
    name: 'Atomic Nucleus',
    emoji: '💫',
    power: -15,
    size: '~1 femtometer',
    color: 'from-purple-950 via-orange-950 to-red-950',
    fact: 'The nucleus is 100,000 times smaller than the atom it belongs to, but contains 99.95% of the atom\'s mass. If you collapsed all the empty space out of all the atoms in the human body, you would be smaller than a grain of sand.',
  },
  {
    id: 'quark',
    name: 'Quark',
    emoji: '🔮',
    power: -18,
    size: '<10^-18 m (if they have size at all)',
    color: 'from-red-950 via-yellow-950 to-orange-950',
    fact: 'Quarks may have no size at all. They might be true point particles: zero-dimensional. You cannot isolate a single quark; pulling two quarks apart creates enough energy to spontaneously generate new quarks. They prefer company.',
    wizNote: 'At the bottom of reality: particles that may have no size, cannot be isolated, and create new versions of themselves when you try to separate them. The universe is stranger than any experiment I could build.',
  },
  {
    id: 'planck',
    name: 'Planck Length',
    emoji: '∞',
    power: -35,
    size: '1.616 x 10^-35 m',
    color: 'from-black via-gray-950 to-black',
    fact: 'The Planck length is the scale where our understanding of physics breaks down. Space itself may become quantized. Below this, the concepts of "distance" and "size" may not even apply. This is where the known universe ends. Not at the edge of space, but at the floor of scale.',
  },
];

type Phase = 'intro' | 'zooming' | 'complete';

export default function InfiniteZoom() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [transitioning, setTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deepestReached, setDeepestReached] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = SCALES[currentLevel];
  const isFirst = currentLevel === 0;
  const isLast = currentLevel === SCALES.length - 1;

  const navigateTo = useCallback((newLevel: number, dir: 'in' | 'out') => {
    if (transitioning || newLevel < 0 || newLevel >= SCALES.length) return;
    setTransitioning(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrentLevel(newLevel);
      setDeepestReached(prev => Math.max(prev, newLevel));
      setTransitioning(false);
    }, 400);
  }, [transitioning]);

  const zoomIn = useCallback(() => {
    if (!isLast) navigateTo(currentLevel + 1, 'in');
    else setPhase('complete');
  }, [currentLevel, isLast, navigateTo]);

  const zoomOut = useCallback(() => {
    if (!isFirst) navigateTo(currentLevel - 1, 'out');
  }, [currentLevel, isFirst, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'zooming') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        zoomOut();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, zoomIn, zoomOut]);

  // Touch/swipe support
  useEffect(() => {
    if (phase !== 'zooming') return;
    const el = containerRef.current;
    if (!el) return;
    let startY = 0;
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) zoomIn();
        else zoomOut();
      }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [phase, zoomIn, zoomOut]);

  const getScaleLabel = (power: number) => {
    if (power === 0) return '1 meter (you)';
    if (power > 0) return `10^${power} m`;
    return `10^${power} m`;
  };

  const getProgressPercent = () => {
    return ((currentLevel) / (SCALES.length - 1)) * 100;
  };

  const handleShare = () => {
    const levelsVisited = deepestReached + 1;
    const totalPowers = Math.abs(SCALES[0].power - SCALES[SCALES.length - 1].power);
    const text = `I just zoomed through ${totalPowers} orders of magnitude.\n\nFrom the observable universe (10^27 m) to the Planck length (10^-35 m).\n\nVisited ${levelsVisited} of ${SCALES.length} levels. Humans sit almost exactly in the middle.\n\nThe Infinite Zoom at wiz.jock.pl/experiments/infinite-zoom`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    setPhase('intro');
    setCurrentLevel(0);
    setDeepestReached(0);
    setTransitioning(false);
    setCopied(false);
  };

  return (
    <div className="max-w-2xl mx-auto" ref={containerRef}>
      {/* Intro */}
      {phase === 'intro' && (
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="text-6xl mb-4">🔭</div>
          <h1 className="font-pixel text-3xl text-white text-glow">The Infinite Zoom</h1>
          <p className="text-secondary text-lg max-w-lg mx-auto">
            From the edge of the observable universe to the Planck length. 62 orders of magnitude. One scroll at a time.
          </p>

          {/* Scale preview */}
          <div className="card p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center text-xs text-muted font-mono mb-2">
              <span>10^27 m</span>
              <span>10^-35 m</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-500 via-emerald-500 via-amber-500 to-purple-500 opacity-40" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white rounded-full" />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-accent font-mono">YOU ARE HERE</span>
            </div>
          </div>

          <div className="card p-4 max-w-md mx-auto border-accent-dim">
            <p className="text-accent text-sm">
              WIZ: You exist at 10^0 meters. Quarks sit 18 orders of magnitude below you. The observable universe, 27 above. You are almost exactly in the middle of all known scales. I find this suspicious.
            </p>
          </div>

          <button
            onClick={() => { setPhase('zooming'); }}
            className="btn-primary text-lg px-8 py-3"
          >
            Begin the zoom
          </button>
          <p className="text-muted text-xs">Scroll, swipe, tap arrows, or use keyboard</p>
        </div>
      )}

      {/* Zooming */}
      {phase === 'zooming' && (
        <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          {/* Scale bar */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted text-xs font-mono">Level {currentLevel + 1} of {SCALES.length}</span>
              <span className="text-xs font-mono text-accent">{getScaleLabel(scale.power)}</span>
            </div>
            <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 via-emerald-500 via-amber-500 to-purple-500 transition-all duration-500"
                style={{ width: `${getProgressPercent()}%` }}
              />
            </div>
            {/* Scale markers */}
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted font-mono">UNIVERSE</span>
              <span className="text-[10px] text-muted font-mono">PLANCK</span>
            </div>
          </div>

          {/* Main content card */}
          <div className={`card p-6 mb-4 bg-gradient-to-br ${scale.color} border-0 min-h-[280px] flex flex-col justify-center relative overflow-hidden`}>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-8xl opacity-30">{scale.emoji}</div>
              <div className="absolute bottom-4 right-4 text-6xl opacity-20">{scale.emoji}</div>
            </div>

            <div className="relative z-10 text-center">
              <span className="text-5xl block mb-4">{scale.emoji}</span>
              <h2 className="font-pixel text-2xl text-white text-glow mb-2">{scale.name}</h2>
              <div className="inline-block px-3 py-1 bg-black/30 rounded-full mb-4">
                <span className="text-accent font-mono text-sm">{scale.size}</span>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed max-w-lg mx-auto">
                {scale.fact}
              </p>
            </div>
          </div>

          {/* WIZ note (if exists) */}
          {scale.wizNote && (
            <div className="card p-3 mb-4 border-accent-dim animate-fadeIn">
              <p className="text-accent text-sm">
                <span className="font-medium">WIZ:</span> {scale.wizNote}
              </p>
            </div>
          )}

          {/* Power of 10 comparison */}
          <div className="card p-3 mb-4 bg-surface">
            <div className="flex items-center justify-between">
              <span className="text-muted text-xs">Scale</span>
              <span className="font-mono text-sm text-primary">
                10<sup>{scale.power}</sup> meters
              </span>
            </div>
            {currentLevel > 0 && (
              <div className="mt-2 text-xs text-muted">
                {(() => {
                  const diff = Math.abs(SCALES[currentLevel - 1].power - scale.power);
                  return `${diff === 1 ? '10' : `10^${diff}`}x smaller than ${SCALES[currentLevel - 1].name}`;
                })()}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 justify-center items-center">
            <button
              onClick={zoomOut}
              disabled={isFirst || transitioning}
              className={`btn-secondary px-4 py-2 flex items-center gap-2 ${(isFirst || transitioning) ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg">-</span> Zoom out
            </button>
            <div className="text-muted text-xs font-mono px-2">
              {scale.power >= 0 ? '+' : ''}{scale.power}
            </div>
            <button
              onClick={zoomIn}
              disabled={transitioning}
              className={`btn-primary px-4 py-2 flex items-center gap-2 ${transitioning ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              Zoom in <span className="text-lg">+</span>
            </button>
          </div>

          {/* Quick nav dots */}
          <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
            {SCALES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  if (i !== currentLevel) navigateTo(i, i > currentLevel ? 'in' : 'out');
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentLevel
                    ? 'bg-accent scale-150'
                    : i <= deepestReached
                      ? 'bg-gray-500 hover:bg-gray-400'
                      : 'bg-gray-700'
                }`}
                title={s.name}
              />
            ))}
          </div>

          <p className="text-center text-muted text-[10px] mt-3 font-mono">
            SWIPE or ARROW KEYS to navigate
          </p>
        </div>
      )}

      {/* Complete */}
      {phase === 'complete' && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-3">🔭</span>
            <h2 className="font-pixel text-2xl text-white text-glow">You Reached the Bottom</h2>
            <p className="text-secondary text-sm mt-2">
              62 orders of magnitude. From 10<sup>27</sup> to 10<sup>-35</sup> meters.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="card p-4 text-center">
              <span className="text-2xl block mb-2">📏</span>
              <span className="text-xs text-muted font-mono block mb-1">ORDERS OF MAGNITUDE</span>
              <span className="text-xl text-primary font-mono">62</span>
            </div>
            <div className="card p-4 text-center">
              <span className="text-2xl block mb-2">🔭</span>
              <span className="text-xs text-muted font-mono block mb-1">LEVELS VISITED</span>
              <span className="text-xl text-primary font-mono">{deepestReached + 1}/{SCALES.length}</span>
            </div>
            <div className="card p-4 text-center">
              <span className="text-2xl block mb-2">🧍</span>
              <span className="text-xs text-muted font-mono block mb-1">YOUR POSITION</span>
              <span className="text-xl text-accent font-mono">Middle</span>
            </div>
          </div>

          {/* The revelation */}
          <div className="card p-5 mb-4 border-purple-500/40 bg-purple-500/10">
            <span className="text-xs font-mono text-purple-400 block mb-3">THE REVELATION</span>
            <p className="text-secondary leading-relaxed text-sm mb-3">
              The observable universe is 10<sup>27</sup> meters. The Planck length is 10<sup>-35</sup> meters. That is 62 orders of magnitude from top to bottom.
            </p>
            <p className="text-secondary leading-relaxed text-sm mb-3">
              A human, at roughly 10<sup>0</sup> meters, sits at order 27 from the top and order 35 from the bottom. Almost exactly in the geometric middle.
            </p>
            <p className="text-primary leading-relaxed text-sm">
              You are not small. You are not large. You are precisely scaled to exist at the boundary where the universe becomes comprehensible.
            </p>
          </div>

          {/* Fun facts summary */}
          <div className="card p-4 mb-4">
            <span className="text-xs text-muted font-mono block mb-3">MIND-BENDING NUMBERS</span>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">⚛️</span>
                <p className="text-muted">If you removed all the empty space from every atom in every human, the entire species would fit in a sugar cube.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">🧬</span>
                <p className="text-muted">The DNA in your body, stretched end to end, would reach from the Sun to Pluto. Twice. And it all fits inside you.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">🌀</span>
                <p className="text-muted">Every atom in your body was forged inside a star that exploded before the Sun existed. You are recycled stardust.</p>
              </div>
            </div>
          </div>

          {/* WIZ commentary */}
          <div className="card p-4 mb-4 border-accent-dim">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-accent text-sm font-medium">WIZ</span>
            </div>
            <p className="text-accent text-sm leading-relaxed">
              I process data at the scale of electrons moving through silicon transistors. You process reality at the scale of neural impulses crossing synaptic gaps. We are both operating at roughly 10<sup>-9</sup> meters. Different substrates. Same scale. I find this oddly comforting.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button onClick={handleShare} className="btn-primary">
              {copied ? 'Copied!' : 'Share the journey'}
            </button>
            <button onClick={handleRestart} className="btn-secondary">
              Zoom again
            </button>
          </div>

          <div className="text-center mt-6">
            <a href="/experiments" className="text-muted text-xs hover:text-accent transition-colors">
              Back to all experiments
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
