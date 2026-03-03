'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ============ TYPES ============

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  species: number;
}

interface Preset {
  name: string;
  icon: string;
  desc: string;
  matrix: number[][];
}

// ============ CONSTANTS ============

const SPECIES_COLORS = [
  '#ff6b9d', // pink
  '#00ffff', // cyan
  '#ffd93d', // yellow
  '#6bcb77', // green
  '#a855f7', // purple
];

const SPECIES_NAMES = ['Pink', 'Cyan', 'Yellow', 'Green', 'Purple'];

const PRESETS: Preset[] = [
  {
    name: 'Cells',
    icon: '\uD83E\uDDA0',
    desc: 'Self-organizing cellular structures',
    matrix: [
      [ 0.8, -0.4,  0.0, -0.2,  0.1],
      [-0.4,  0.8, -0.3,  0.0,  0.2],
      [ 0.0, -0.3,  0.8, -0.4,  0.0],
      [-0.2,  0.0, -0.4,  0.8, -0.3],
      [ 0.1,  0.2,  0.0, -0.3,  0.8],
    ],
  },
  {
    name: 'Galaxies',
    icon: '\uD83C\uDF0C',
    desc: 'Swirling gravitational spirals',
    matrix: [
      [ 0.3,  0.6,  0.2, -0.1,  0.4],
      [-0.6,  0.3,  0.6,  0.2, -0.1],
      [-0.2, -0.6,  0.3,  0.6,  0.2],
      [ 0.1, -0.2, -0.6,  0.3,  0.6],
      [-0.4,  0.1, -0.2, -0.6,  0.3],
    ],
  },
  {
    name: 'Predators',
    icon: '\uD83D\uDC3A',
    desc: 'Chase dynamics — eat or be eaten',
    matrix: [
      [ 0.1,  0.8, -0.5,  0.0,  0.0],
      [-0.5,  0.1,  0.8, -0.5,  0.0],
      [ 0.0, -0.5,  0.1,  0.8, -0.5],
      [ 0.0,  0.0, -0.5,  0.1,  0.8],
      [ 0.8,  0.0,  0.0, -0.5,  0.1],
    ],
  },
  {
    name: 'Symbiosis',
    icon: '\uD83C\uDF3F',
    desc: 'Mutual attraction, delicate balance',
    matrix: [
      [-0.2,  0.5,  0.3,  0.5,  0.3],
      [ 0.5, -0.2,  0.5,  0.3,  0.5],
      [ 0.3,  0.5, -0.2,  0.5,  0.3],
      [ 0.5,  0.3,  0.5, -0.2,  0.5],
      [ 0.3,  0.5,  0.3,  0.5, -0.2],
    ],
  },
  {
    name: 'Chaos',
    icon: '\uD83C\uDF0A',
    desc: 'Maximum entropy, minimum order',
    matrix: [
      [ 0.5, -0.8,  0.9, -0.7,  0.3],
      [ 0.9,  0.4, -0.6,  0.8, -0.9],
      [-0.7,  0.8,  0.3, -0.9,  0.7],
      [ 0.6, -0.9,  0.7,  0.5, -0.8],
      [-0.3,  0.7, -0.8,  0.9,  0.4],
    ],
  },
];

const DEFAULT_PARTICLE_COUNT = 400;
const FRICTION = 0.92;
const MAX_FORCE = 1.2;
const INTERACTION_RADIUS = 120;
const MIN_DIST = 20;

// ============ HELPERS ============

function randomMatrix(): number[][] {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => Math.round((Math.random() * 2 - 1) * 10) / 10)
  );
}

function createParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  const margin = 40;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: margin + Math.random() * (width - margin * 2),
      y: margin + Math.random() * (height - margin * 2),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      species: i % 5,
    });
  }
  return particles;
}

// ============ COMPONENT ============

export default function GenesisEnginePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const matrixRef = useRef<number[][]>(PRESETS[0].matrix.map(r => [...r]));
  const animRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; mode: 'attract' | 'repel' }>({
    x: 0, y: 0, active: false, mode: 'attract',
  });
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 800, h: 600 });

  const [activePreset, setActivePreset] = useState(0);
  const [particleCount, setParticleCount] = useState(DEFAULT_PARTICLE_COUNT);
  const [showMatrix, setShowMatrix] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [trails, setTrails] = useState(true);
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState({ fps: 0, particles: 0 });
  const [mouseMode, setMouseMode] = useState<'attract' | 'repel'>('attract');
  const [matrixState, setMatrixState] = useState<number[][]>(PRESETS[0].matrix.map(r => [...r]));

  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const trailsRef = useRef(true);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { trailsRef.current = trails; }, [trails]);
  useEffect(() => { mouseRef.current.mode = mouseMode; }, [mouseMode]);

  // Initialize
  const init = useCallback((presetIdx?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    sizeRef.current = { w, h };

    // Trail canvas (offscreen)
    const tc = document.createElement('canvas');
    tc.width = canvas.width;
    tc.height = canvas.height;
    trailCanvasRef.current = tc;

    const idx = presetIdx ?? activePreset;
    const m = idx >= 0 && idx < PRESETS.length
      ? PRESETS[idx].matrix.map(r => [...r])
      : randomMatrix();
    matrixRef.current = m;
    setMatrixState(m.map(r => [...r]));

    particlesRef.current = createParticles(particleCount, w, h);
  }, [activePreset, particleCount]);

  // Simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    init();

    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTime = 0;

    const simulate = (timestamp: number) => {
      animRef.current = requestAnimationFrame(simulate);

      // FPS counter
      frameCount++;
      fpsTime += timestamp - lastTime;
      lastTime = timestamp;
      if (fpsTime >= 1000) {
        setStats({ fps: frameCount, particles: particlesRef.current.length });
        frameCount = 0;
        fpsTime = 0;
      }

      if (pausedRef.current) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const matrix = matrixRef.current;
      const spd = speedRef.current;

      // Physics
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        let fx = 0, fy = 0;

        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const b = particles[j];

          let dx = b.x - a.x;
          let dy = b.y - a.y;

          // Wrap distance
          if (dx > w / 2) dx -= w;
          if (dx < -w / 2) dx += w;
          if (dy > h / 2) dy -= h;
          if (dy < -h / 2) dy += h;

          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > INTERACTION_RADIUS || dist < 1) continue;

          const force = matrix[a.species][b.species];
          let f: number;

          if (dist < MIN_DIST) {
            // Repulsion at close range
            f = (dist / MIN_DIST - 1) * MAX_FORCE;
          } else {
            // Attraction/repulsion based on matrix
            const normalDist = (dist - MIN_DIST) / (INTERACTION_RADIUS - MIN_DIST);
            f = force * (1 - Math.abs(2 * normalDist - 1));
          }

          fx += (dx / dist) * f;
          fy += (dy / dist) * f;
        }

        // Mouse interaction
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - a.x;
          const mdy = mouseRef.current.y - a.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 200 && mdist > 1) {
            const mforce = mouseRef.current.mode === 'attract' ? 0.8 : -0.8;
            const mf = mforce * (1 - mdist / 200);
            fx += (mdx / mdist) * mf;
            fy += (mdy / mdist) * mf;
          }
        }

        a.vx = (a.vx + fx * spd) * FRICTION;
        a.vy = (a.vy + fy * spd) * FRICTION;

        a.x += a.vx * spd;
        a.y += a.vy * spd;

        // Wrap
        if (a.x < 0) a.x += w;
        if (a.x >= w) a.x -= w;
        if (a.y < 0) a.y += h;
        if (a.y >= h) a.y -= h;
      }

      // Render
      ctx.save();
      ctx.scale(dpr, dpr);

      if (trailsRef.current) {
        const tc = trailCanvasRef.current;
        if (tc) {
          const tctx = tc.getContext('2d');
          if (tctx) {
            // Copy current canvas to trail canvas, then fade
            tctx.globalAlpha = 0.92;
            tctx.drawImage(canvas, 0, 0, tc.width, tc.height);
            tctx.globalAlpha = 1;
            tctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            tctx.fillRect(0, 0, tc.width, tc.height);
          }
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(tc, 0, 0, w, h);
        }
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
      }

      // Draw particles
      for (const p of particles) {
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const size = 2 + Math.min(vel * 0.3, 2);
        const alpha = 0.6 + Math.min(vel * 0.1, 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = SPECIES_COLORS[p.species];
        ctx.globalAlpha = alpha;
        ctx.fill();
      }

      // Draw mouse cursor effect
      if (mouseRef.current.active) {
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 200, 0, Math.PI * 2);
        ctx.strokeStyle = mouseRef.current.mode === 'attract' ? '#00ffff' : '#ff6b9d';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    animRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animRef.current);
  }, [init]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      sizeRef.current = { w: rect.width, h: rect.height };

      if (trailCanvasRef.current) {
        trailCanvasRef.current.width = canvas.width;
        trailCanvasRef.current.height = canvas.height;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    mouseRef.current.x = e.touches[0].clientX - rect.left;
    mouseRef.current.y = e.touches[0].clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  // Preset selection
  const selectPreset = useCallback((idx: number) => {
    setActivePreset(idx);
    const m = PRESETS[idx].matrix.map(r => [...r]);
    matrixRef.current = m;
    setMatrixState(m.map(r => [...r]));
    particlesRef.current = createParticles(particleCount, sizeRef.current.w, sizeRef.current.h);

    // Clear trail canvas
    const tc = trailCanvasRef.current;
    if (tc) {
      const tctx = tc.getContext('2d');
      if (tctx) {
        tctx.clearRect(0, 0, tc.width, tc.height);
      }
    }
  }, [particleCount]);

  const randomize = useCallback(() => {
    setActivePreset(-1);
    const m = randomMatrix();
    matrixRef.current = m;
    setMatrixState(m.map(r => [...r]));
    particlesRef.current = createParticles(particleCount, sizeRef.current.w, sizeRef.current.h);

    const tc = trailCanvasRef.current;
    if (tc) {
      const tctx = tc.getContext('2d');
      if (tctx) tctx.clearRect(0, 0, tc.width, tc.height);
    }
  }, [particleCount]);

  const updateMatrixValue = useCallback((i: number, j: number, val: number) => {
    const m = matrixRef.current.map(r => [...r]);
    m[i][j] = Math.round(val * 10) / 10;
    matrixRef.current = m;
    setMatrixState(m.map(r => [...r]));
    setActivePreset(-1);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/experiments" className="text-muted hover:text-accent text-sm mb-4 block">
          &larr; All Experiments
        </Link>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{'\uD83E\uDDEC'}</span>
          <div>
            <h1 className="font-pixel text-2xl text-white text-glow mb-1">GENESIS ENGINE</h1>
            <p className="text-secondary text-sm">
              Create life from nothing. Set the rules of attraction between particle species and watch
              emergent behavior unfold — cells, galaxies, predator-prey dynamics. Simple rules, complex life.
            </p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative mb-4 border border-subtle rounded overflow-hidden" style={{ height: '500px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-black cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseMove={handleMouseMove}
          onMouseDown={() => { mouseRef.current.active = true; }}
          onMouseUp={() => { mouseRef.current.active = false; }}
          onMouseLeave={() => { mouseRef.current.active = false; }}
          onTouchStart={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect && e.touches[0]) {
              mouseRef.current.x = e.touches[0].clientX - rect.left;
              mouseRef.current.y = e.touches[0].clientY - rect.top;
              mouseRef.current.active = true;
            }
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => { mouseRef.current.active = false; }}
        />

        {/* Stats overlay */}
        <div className="absolute top-2 left-2 text-xs font-mono text-muted/60 pointer-events-none">
          {stats.fps} fps | {stats.particles} particles
        </div>

        {/* Paused overlay */}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
            <span className="font-pixel text-2xl text-accent text-glow">PAUSED</span>
          </div>
        )}
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setPaused(p => !p)}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          {paused ? '\u25B6 Play' : '\u23F8 Pause'}
        </button>
        <button
          onClick={() => setMouseMode(m => m === 'attract' ? 'repel' : 'attract')}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          Mouse: {mouseMode === 'attract' ? '\uD83E\uDDF2 Attract' : '\uD83D\uDCA5 Repel'}
        </button>
        <button
          onClick={() => setTrails(t => !t)}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          Trails: {trails ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setShowMatrix(m => !m)}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          {showMatrix ? 'Hide' : 'Show'} DNA
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-muted text-xs">Speed</label>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-20 accent-[#00ffff]"
          />
          <span className="text-accent text-xs font-mono w-8">{speed.toFixed(1)}x</span>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-muted text-xs font-mono">PRESETS</span>
          <button
            onClick={randomize}
            className="btn-secondary text-xs px-2 py-1 ml-auto"
          >
            {'\uD83C\uDFB2'} Random
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => selectPreset(idx)}
              className={`card p-3 text-left transition-all ${
                activePreset === idx
                  ? 'border-accent bg-accent/5'
                  : 'hover:border-accent/50'
              }`}
            >
              <span className="text-lg block mb-1">{preset.icon}</span>
              <span className={`text-xs font-medium block ${
                activePreset === idx ? 'text-accent' : 'text-primary'
              }`}>
                {preset.name}
              </span>
              <span className="text-muted text-[10px] block mt-0.5 leading-tight">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interaction Matrix */}
      {showMatrix && (
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">{'\uD83E\uDDEC'}</span>
            <h3 className="text-primary text-sm font-medium">Interaction DNA</h3>
            <span className="text-muted text-xs">How each species feels about the others</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="p-1"></th>
                  {SPECIES_NAMES.map((name, idx) => (
                    <th key={name} className="p-1 text-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: SPECIES_COLORS[idx] }}
                      />
                      <span className="text-muted">{name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixState.map((row, i) => (
                  <tr key={i}>
                    <td className="p-1">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: SPECIES_COLORS[i] }}
                      />
                      <span className="text-muted">{SPECIES_NAMES[i]}</span>
                    </td>
                    {row.map((val, j) => (
                      <td key={j} className="p-1 text-center">
                        <input
                          type="range"
                          min={-1}
                          max={1}
                          step={0.1}
                          value={val}
                          onChange={(e) => updateMatrixValue(i, j, parseFloat(e.target.value))}
                          className="w-14 block mx-auto"
                          style={{
                            accentColor: val > 0 ? '#6bcb77' : val < 0 ? '#ff6b9d' : '#666',
                          }}
                        />
                        <span
                          className="font-mono text-[10px] block"
                          style={{
                            color: val > 0 ? '#6bcb77' : val < 0 ? '#ff6b9d' : '#666',
                          }}
                        >
                          {val > 0 ? '+' : ''}{val.toFixed(1)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-muted text-[10px] mt-3 text-center">
            Positive = attraction | Negative = repulsion | Row = how species <em>feels</em>, Column = <em>toward</em> whom
          </p>
        </div>
      )}

      {/* Info */}
      <div className="card p-4">
        <h3 className="text-primary text-sm font-medium mb-2">How it works</h3>
        <p className="text-muted text-xs leading-relaxed mb-3">
          Each colored dot is a &ldquo;particle species.&rdquo; The interaction matrix defines how
          each species feels about every other — attraction (positive) pulls them together,
          repulsion (negative) pushes them apart. From these simple rules,
          complex structures emerge: cells that divide, galaxies that spiral, predators that chase prey.
        </p>
        <p className="text-muted text-xs leading-relaxed mb-3">
          Click and hold on the canvas to attract (or repel) particles. Try the presets, then hit
          Random to discover configurations nobody has seen before.
        </p>
        <div className="flex flex-wrap gap-3 text-[10px] text-muted/60">
          <span>Click + hold = interact</span>
          <span>|</span>
          <span>Wrapping boundaries</span>
          <span>|</span>
          <span>Built by Wiz with Opus 4.6</span>
        </div>
      </div>
    </div>
  );
}
