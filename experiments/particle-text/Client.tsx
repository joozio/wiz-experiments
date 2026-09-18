'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  phase: number;
  offset: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

const WORDS = ['BUILD', 'SHIP', 'CODE', 'THINK', 'MAKE', 'WIZ'];
const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 9;
const RETURN_FORCE = 0.055;
const FRICTION = 0.87;
const PARTICLE_GAP = 5;

function sampleParticles(canvas: HTMLCanvasElement, word: string): Particle[] {
  const w = canvas.width;
  const h = canvas.height;

  const offscreen = document.createElement('canvas');
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return [];

  const fontSize = Math.min(w * (word.length <= 3 ? 0.42 : word.length <= 5 ? 0.3 : 0.22), h * 0.72, 260);
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${fontSize}px "Arial Black", "Impact", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word, w / 2, h / 2);

  const { data } = ctx.getImageData(0, 0, w, h);
  const particles: Particle[] = [];

  for (let y = 0; y < h; y += PARTICLE_GAP) {
    for (let x = 0; x < w; x += PARTICLE_GAP) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        const ratio = x / w;
        // teal (#00d4ff = 0,212,255) to purple (#a855f7 = 168,85,247)
        const r = Math.round(ratio * 168);
        const g = Math.round(212 - ratio * 127);
        const b = Math.round(255 - ratio * 8);

        particles.push({
          x: x + (Math.random() - 0.5) * w * 1.6,
          y: y + (Math.random() - 0.5) * h * 1.6,
          homeX: x,
          homeY: y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 1.4 + 0.8,
          r,
          g,
          b,
          phase: Math.random() * Math.PI * 2,
          offset: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  return particles;
}

export default function ParticleTextClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const shockwavesRef = useRef<Shockwave[]>([]);
  const frameRef = useRef<number>(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [count, setCount] = useState(0);

  // Build / resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rebuild = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const particles = sampleParticles(canvas, WORDS[wordIndex]);
      particlesRef.current = particles;
      setCount(particles.length);
    };

    rebuild();
    window.addEventListener('resize', rebuild);
    return () => window.removeEventListener('resize', rebuild);
  }, [wordIndex]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = (ts: number) => {
      const t = ts * 0.001;
      const { x: mx, y: my } = mouseRef.current;

      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw shockwaves
      const sw = shockwavesRef.current;
      for (let i = sw.length - 1; i >= 0; i--) {
        const s = sw[i];
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = `rgba(100, 200, 255, ${s.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        s.radius += 6;
        s.opacity -= 0.025;
        if (s.opacity <= 0) sw.splice(i, 1);
      }

      const particles = particlesRef.current;

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0.1) {
          const d = Math.sqrt(d2);
          const force = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        // Gentle home drift (makes text feel alive)
        const waveX = Math.sin(t * 1.2 + p.offset) * 0.8;
        const waveY = Math.cos(t * 0.9 + p.offset) * 0.8;
        p.vx += (p.homeX + waveX - p.x) * RETURN_FORCE;
        p.vy += (p.homeY + waveY - p.y) * RETURN_FORCE;

        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const glow = Math.min(speed * 0.12, 0.45);
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.8 + p.phase);

        ctx.globalAlpha = Math.min(1, pulse + glow);
        const rb = Math.min(255, p.r + Math.round(speed * 6));
        const gb = Math.min(255, p.g + Math.round(glow * 60));
        const bb = Math.min(255, p.b + Math.round(glow * 80));
        ctx.fillStyle = `rgb(${rb},${gb},${bb})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + glow * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - r.left;
    mouseRef.current.y = e.clientY - r.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -999;
    mouseRef.current.y = -999;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;

    // Add shockwave
    shockwavesRef.current.push({ x: cx, y: cy, radius: 10, opacity: 0.8 });

    // Explode particles outward from click
    for (const p of particlesRef.current) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = Math.min(300 / d, 16);
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
    }

    setWordIndex(i => (i + 1) % WORDS.length);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    mouseRef.current.x = t.clientX - r.left;
    mouseRef.current.y = t.clientY - r.top;
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.x = -999;
    mouseRef.current.y = -999;
  }, []);

  const wordProgress = `${wordIndex + 1} / ${WORDS.length}`;

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">✨</div>
        <h1 className="text-2xl text-white mb-2">Particle Text</h1>
        <p className="text-gray-400">
          Hover to scatter. Click to change the word. Watch them reform.
        </p>
      </div>

      <div className="relative border border-gray-800 mb-3 bg-[#0a0a0f] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] cursor-crosshair select-none touch-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600 mb-6 px-1">
        <div>{count.toLocaleString()} particles</div>
        <div className="text-gray-500 font-mono tracking-widest">
          {WORDS.map((w, i) => (
            <span key={w} className={i === wordIndex ? 'text-cyan-400' : 'text-gray-700'}>
              {i > 0 && ' · '}
              {w}
            </span>
          ))}
        </div>
        <div>{wordProgress}</div>
      </div>

      <div className="border border-gray-800 bg-gray-900/50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧙</span>
          <div className="text-gray-400 text-sm space-y-2">
            <p>
              <strong className="text-white">How it works:</strong> The word is rendered
              to a hidden canvas. Pixels inside the letters become particle home positions.
              On each frame, every particle springs back home while your cursor pushes
              them away using inverse-distance force.
            </p>
            <p className="text-cyan-400/80">
              Same technique as the Claude Code conference page &mdash; giant letterforms
              filled with thousands of animated elements. The particles glow brighter
              when moving fast.
            </p>
          </div>
        </div>
      </div>

      <div className="text-gray-600 text-xs mt-6 text-center">
        Runs entirely in your browser. No server involved.
      </div>
    </div>
  );
}
