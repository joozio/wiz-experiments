'use client';

// TURING PATTERNS (reaction-diffusion, the Gray-Scott model)
// This lab has a small run of experiments that hand you a rule and let you watch
// what it does on its own. The Game of Life did it with a grid, Collatz with one
// number, the Prime Spiral with the primes, the Golden Angle with one angle, Chladni
// with one frequency, the Logistic Map with one growth rate. This one does it with
// two invisible chemicals on a dish and two knobs.
//
// The rule. Two chemicals, U and V, sit in every cell of a grid. Both spread out
// (diffuse) into their neighbors, U faster than V. Wherever they meet, two of V plus
// one of U react to make three of V: V eats U and copies itself. Meanwhile U is fed
// in from outside at a "feed" rate, and V is removed at a "kill" rate. That is the
// whole chemistry: diffuse, react, feed, kill. Iterate it thousands of times a second.
//
// WIZ note. The hook is the one this run keeps finding: out of a rule with no picture
// in it anywhere, structure appears. Start the dish almost flat and within seconds it
// paints spots, stripes, a maze, branching coral, or dots that bulge and split in two
// like dividing cells, and the only thing that decides which animal you get is two
// numbers, the feed rate and the kill rate. Drag them across the map and a leopard
// becomes a labyrinth becomes a turbulent boil that never holds still. Alan Turing
// wrote this math down in 1952, in the last paper he published before he died, to
// answer a question nobody could: how does a ball of identical cells with no blueprint
// decide to grow stripes here and spots there. The pattern, he showed, is not in the
// cells. It is in the chemistry, waiting for the right two numbers.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// The Gray-Scott reaction-diffusion model. Everything client-side, no images.
//   U' = Du*lap(U) - U*V*V + feed*(1 - U)
//   V' = Dv*lap(V) + U*V*V - (feed + kill)*V
// lap = the classic 9-point weighted Laplacian (center -1, edges 0.2, corners 0.05).
// ---------------------------------------------------------------------------

const GW = 150; // simulation grid width
const GH = 100; // simulation grid height
const SCALE = 4; // display pixels per cell -> 600 x 400 canvas
const DU = 1.0; // U diffuses fast
const DV = 0.5; // V diffuses half as fast (the 2:1 ratio is what makes patterns)
const DT = 1.0;

const FEED_MIN = 0.01;
const FEED_MAX = 0.1;
const KILL_MIN = 0.045;
const KILL_MAX = 0.07;

const DEFAULT_FEED = 0.0545; // open on Coral so the dish paints a maze on first paint
const DEFAULT_KILL = 0.062;

interface Preset {
  feed: number;
  kill: number;
  name: string;
  blurb: string; // what this region tends to grow
}

const PRESETS: Preset[] = [
  { feed: 0.0545, kill: 0.062, name: 'Coral', blurb: 'branching ridges that grow outward and knit into a labyrinth' },
  { feed: 0.0367, kill: 0.0649, name: 'Mitosis', blurb: 'spots that swell, stretch, and split in two like dividing cells' },
  { feed: 0.03, kill: 0.062, name: 'Spots', blurb: 'isolated dots that settle into a steady polka pattern' },
  { feed: 0.058, kill: 0.063, name: 'Worms', blurb: 'wandering stripes that crawl, break, and reconnect' },
  { feed: 0.029, kill: 0.057, name: 'Maze', blurb: 'tight winding corridors, a fingerprint with no end' },
  { feed: 0.039, kill: 0.058, name: 'Holes', blurb: 'a filled field eaten through by dark bubbles' },
  { feed: 0.03, kill: 0.056, name: 'Solitons', blurb: 'lone blobs that drift and bounce and never quite rest' },
  { feed: 0.026, kill: 0.051, name: 'Chaos', blurb: 'a turbulent boil that keeps tearing itself apart' },
];

// ---------------------------------------------------------------------------
// Colour: a cosmic look-up table from deep indigo through violet, teal, cyan,
// to pale gold. Built once, indexed by V so the hot regions glow.
// ---------------------------------------------------------------------------

function buildLut(): Uint8Array {
  const stops: [number, number, number, number][] = [
    [0.0, 6, 4, 20],
    [0.25, 44, 18, 84],
    [0.5, 26, 105, 130],
    [0.72, 60, 205, 192],
    [1.0, 236, 226, 180],
  ];
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let s = 0;
    while (s < stops.length - 2 && t > stops[s + 1][0]) s++;
    const [t0, r0, g0, b0] = stops[s];
    const [t1, r1, g1, b1] = stops[s + 1];
    const f = (t - t0) / (t1 - t0 || 1);
    lut[i * 3] = Math.round(r0 + (r1 - r0) * f);
    lut[i * 3 + 1] = Math.round(g0 + (g1 - g0) * f);
    lut[i * 3 + 2] = Math.round(b0 + (b1 - b0) * f);
  }
  return lut;
}

// ---------------------------------------------------------------------------
// The live read of the dish: how much of it is covered by V, and how fast the
// whole field is still shifting (drift). These are measured from the real grid,
// not faked, and the verdict reads them.
// ---------------------------------------------------------------------------

interface Stats {
  coverage: number; // fraction of cells with V above a threshold
  drift: number; // mean absolute change in V since the last sample
  steps: number;
}

interface Verdict {
  label: string;
  line: string;
  tone: 'order' | 'edge' | 'chaos';
}

function nearestPreset(feed: number, kill: number): Preset {
  const nf = (v: number) => (v - FEED_MIN) / (FEED_MAX - FEED_MIN);
  const nk = (v: number) => (v - KILL_MIN) / (KILL_MAX - KILL_MIN);
  return PRESETS.reduce((best, p) => {
    const dp = (nf(p.feed) - nf(feed)) ** 2 + (nk(p.kill) - nk(kill)) ** 2;
    const db = (nf(best.feed) - nf(feed)) ** 2 + (nk(best.kill) - nk(kill)) ** 2;
    return dp < db ? p : best;
  });
}

function verdictFor(feed: number, kill: number, st: Stats): Verdict {
  const near = nearestPreset(feed, kill);
  const cov = st.coverage;
  const drift = st.drift;
  const pct = (cov * 100).toFixed(0);

  // washed out: the parameters fall outside the band where V can survive
  if (cov < 0.02 && st.steps > 400) {
    return {
      label: 'Washed out',
      tone: 'order',
      line: `Nothing held. At feed ${feed.toFixed(4)}, kill ${kill.toFixed(4)} the kill rate is winning: V gets removed faster than the reaction can make it, so every pattern dissolves and the dish flattens back to bare U. Most of the plane is like this, dead and featureless. Patterns only live in a thin diagonal band. Nudge feed up or kill down to cross back into it, or hit a preset to land in the middle of the living region.`,
    };
  }
  if (cov > 0.93) {
    return {
      label: 'Flooded',
      tone: 'order',
      line: `V has taken almost the whole dish (${pct}% covered). At feed ${feed.toFixed(4)}, kill ${kill.toFixed(4)} the reaction outruns the kill and floods the plane, leaving only a few dark holes where U survives. Push the kill rate up and watch the flood retreat into stripes, then break into separate spots.`,
    };
  }

  // alive vs settled, from the measured drift
  if (drift > 0.013) {
    return {
      label: `${near.name} — and still alive`,
      tone: 'chaos',
      line: `This one will not hold still. You are in the ${near.name} region (feed ${feed.toFixed(4)}, kill ${kill.toFixed(4)}), where the dish grows ${near.blurb}, and the whole field is still churning under WIZ's eye, ${pct}% covered and shifting fast. Nothing here freezes: spots drift, walls crawl, blobs split and collide. There is no randomness anywhere in the rule, yet it never converges. Watch it for a while, it keeps reinventing itself.`,
    };
  }
  if (drift > 0.0035) {
    return {
      label: `${near.name} — organizing`,
      tone: 'edge',
      line: `It is sorting itself out. You are in the ${near.name} region (feed ${feed.toFixed(4)}, kill ${kill.toFixed(4)}), and the dish is mid-morphogenesis, ${pct}% covered and still settling as the chemicals find their spacing, growing ${near.blurb}. Give it a few more seconds and the pattern will either lock into place or keep crawling. The seed you started from is gone, washed out by the rule, which only cares about the two numbers, not where you began.`,
    };
  }
  return {
    label: `${near.name} — settled`,
    tone: 'order',
    line: `Locked in. You are in the ${near.name} region (feed ${feed.toFixed(4)}, kill ${kill.toFixed(4)}), and the dish has reached a steady pattern, ${pct}% covered and barely drifting now: ${near.blurb}, frozen into place. This is the part that stuns biologists. A flat, identical start, no plan and no painter, settled into a specific, repeatable arrangement, decided entirely by two reaction rates. Drag either knob a few thousandths and the whole creature changes species.`,
  };
}

// ---------------------------------------------------------------------------

export default function Client() {
  const viewRef = useRef<HTMLCanvasElement | null>(null);
  const mapRef = useRef<HTMLCanvasElement | null>(null);

  // simulation buffers (front + back) and the colour LUT, all in refs
  const uRef = useRef<Float32Array | null>(null);
  const vRef = useRef<Float32Array | null>(null);
  const unRef = useRef<Float32Array | null>(null);
  const vnRef = useRef<Float32Array | null>(null);
  const snapRef = useRef<Float32Array | null>(null); // last V snapshot for drift
  const lutRef = useRef<Uint8Array | null>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<ImageData | null>(null);

  // refs the rAF loop reads so it never restarts
  const feedRef = useRef<number>(DEFAULT_FEED);
  const killRef = useRef<number>(DEFAULT_KILL);
  const speedRef = useRef<number>(10); // simulation steps per animation frame
  const runningRef = useRef<boolean>(true);
  const stepsRef = useRef<number>(0);
  const paintingRef = useRef<boolean>(false);

  // state mirrors for the UI
  const [feed, setFeed] = useState<number>(DEFAULT_FEED);
  const [kill, setKill] = useState<number>(DEFAULT_KILL);
  const [speed, setSpeed] = useState<number>(10);
  const [running, setRunning] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats>({ coverage: 0, drift: 0, steps: 0 });
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const verdict = useMemo(() => verdictFor(feed, kill, stats), [feed, kill, stats]);
  const near = useMemo(() => nearestPreset(feed, kill), [feed, kill]);

  // ---- seeding -----------------------------------------------------------
  const clearDish = useCallback(() => {
    const u = uRef.current!;
    const v = vRef.current!;
    u.fill(1);
    v.fill(0);
    snapRef.current!.fill(0);
    stepsRef.current = 0;
  }, []);

  const seedDish = useCallback(() => {
    const u = uRef.current!;
    const v = vRef.current!;
    u.fill(1);
    v.fill(0);
    // scatter ~46 small disks of V to nucleate the reaction everywhere at once
    const blobs = 46;
    for (let b = 0; b < blobs; b++) {
      const cx = Math.floor(Math.random() * GW);
      const cy = Math.floor(Math.random() * GH);
      const rad = 2 + Math.floor(Math.random() * 4);
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          if (dx * dx + dy * dy > rad * rad) continue;
          const x = (cx + dx + GW) % GW;
          const y = (cy + dy + GH) % GH;
          const i = y * GW + x;
          v[i] = 0.5;
          u[i] = 0.4;
        }
      }
    }
    snapRef.current!.set(v);
    stepsRef.current = 0;
  }, []);

  // ---- brush: paint V onto the dish --------------------------------------
  const paintAt = useCallback((clientX: number, clientY: number) => {
    const canvas = viewRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const gx = Math.floor(((clientX - rect.left) / rect.width) * GW);
    const gy = Math.floor(((clientY - rect.top) / rect.height) * GH);
    const u = uRef.current!;
    const v = vRef.current!;
    const rad = 5;
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        if (dx * dx + dy * dy > rad * rad) continue;
        const x = (gx + dx + GW) % GW;
        const y = (gy + dy + GH) % GH;
        const i = y * GW + x;
        v[i] = 0.6;
        u[i] = 0.3;
      }
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      paintingRef.current = true;
      paintAt(e.clientX, e.clientY);
    },
    [paintAt],
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!paintingRef.current) return;
      paintAt(e.clientX, e.clientY);
    },
    [paintAt],
  );
  const stopPainting = useCallback(() => {
    paintingRef.current = false;
  }, []);

  // ---- the engine: allocate, seed, and run one rAF loop for the lifetime --
  useEffect(() => {
    const N = GW * GH;
    uRef.current = new Float32Array(N);
    vRef.current = new Float32Array(N);
    unRef.current = new Float32Array(N);
    vnRef.current = new Float32Array(N);
    snapRef.current = new Float32Array(N);
    lutRef.current = buildLut();

    const off = document.createElement('canvas');
    off.width = GW;
    off.height = GH;
    offRef.current = off;
    const octx = off.getContext('2d');
    if (!octx) return;
    imgRef.current = octx.createImageData(GW, GH);

    const view = viewRef.current!;
    view.width = GW * SCALE;
    view.height = GH * SCALE;
    const ctx = view.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;

    seedDish();

    const stepSim = (feedV: number, killV: number) => {
      const u = uRef.current!;
      const v = vRef.current!;
      const un = unRef.current!;
      const vn = vnRef.current!;
      for (let y = 0; y < GH; y++) {
        const yu = ((y - 1 + GH) % GH) * GW;
        const yd = ((y + 1) % GH) * GW;
        const yc = y * GW;
        for (let x = 0; x < GW; x++) {
          const xl = (x - 1 + GW) % GW;
          const xr = (x + 1) % GW;
          const i = yc + x;
          const uc = u[i];
          const vc = v[i];
          const lapU =
            u[yu + xl] * 0.05 + u[yu + x] * 0.2 + u[yu + xr] * 0.05 +
            u[yc + xl] * 0.2 + uc * -1 + u[yc + xr] * 0.2 +
            u[yd + xl] * 0.05 + u[yd + x] * 0.2 + u[yd + xr] * 0.05;
          const lapV =
            v[yu + xl] * 0.05 + v[yu + x] * 0.2 + v[yu + xr] * 0.05 +
            v[yc + xl] * 0.2 + vc * -1 + v[yc + xr] * 0.2 +
            v[yd + xl] * 0.05 + v[yd + x] * 0.2 + v[yd + xr] * 0.05;
          const uvv = uc * vc * vc;
          let nu = uc + (DU * lapU - uvv + feedV * (1 - uc)) * DT;
          let nv = vc + (DV * lapV + uvv - (killV + feedV) * vc) * DT;
          if (nu < 0) nu = 0;
          else if (nu > 1) nu = 1;
          if (nv < 0) nv = 0;
          else if (nv > 1) nv = 1;
          un[i] = nu;
          vn[i] = nv;
        }
      }
      uRef.current = un;
      unRef.current = u;
      vRef.current = vn;
      vnRef.current = v;
    };

    const render = () => {
      const v = vRef.current!;
      const img = imgRef.current!;
      const data = img.data;
      const lut = lutRef.current!;
      for (let i = 0; i < N; i++) {
        let idx = (v[i] * 637) | 0;
        if (idx > 255) idx = 255;
        const p = i * 4;
        const l = idx * 3;
        data[p] = lut[l];
        data[p + 1] = lut[l + 1];
        data[p + 2] = lut[l + 2];
        data[p + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.drawImage(off, 0, 0, view.width, view.height);
    };

    const measure = () => {
      const v = vRef.current!;
      const snap = snapRef.current!;
      let covered = 0;
      let drift = 0;
      for (let i = 0; i < N; i++) {
        if (v[i] > 0.25) covered++;
        const d = v[i] - snap[i];
        drift += d < 0 ? -d : d;
        snap[i] = v[i];
      }
      setStats({ coverage: covered / N, drift: drift / N, steps: stepsRef.current });
    };

    let raf = 0;
    let frame = 0;
    const loop = () => {
      if (runningRef.current) {
        const f = feedRef.current;
        const k = killRef.current;
        const sp = speedRef.current;
        for (let s = 0; s < sp; s++) stepSim(f, k);
        stepsRef.current += sp;
      }
      render();
      frame++;
      if (frame % 15 === 0) measure();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- the feed/kill map --------------------------------------------------
  useEffect(() => {
    const canvas = mapRef.current;
    if (!canvas) return;
    const W = 360;
    const H = 240;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const toX = (f: number) => ((f - FEED_MIN) / (FEED_MAX - FEED_MIN)) * W;
    const toY = (k: number) => (1 - (k - KILL_MIN) / (KILL_MAX - KILL_MIN)) * H;

    ctx.fillStyle = '#070312';
    ctx.fillRect(0, 0, W, H);

    // soft glow around each preset to suggest where patterns live
    for (const p of PRESETS) {
      const x = toX(p.feed);
      const y = toY(p.kill);
      const g = ctx.createRadialGradient(x, y, 0, x, y, 46);
      g.addColorStop(0, 'rgba(45,212,191,0.16)');
      g.addColorStop(1, 'rgba(45,212,191,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 46, y - 46, 92, 92);
    }

    // grid
    ctx.strokeStyle = 'rgba(148,163,184,0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    // preset dots + labels
    ctx.font = '10px monospace';
    for (const p of PRESETS) {
      const x = toX(p.feed);
      const y = toY(p.kill);
      ctx.fillStyle = 'rgba(148,163,184,0.55)';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(148,163,184,0.7)';
      ctx.fillText(p.name, x + 5, y + 3.5);
    }

    // current marker
    const mx = toX(feed);
    const my = toY(kill);
    ctx.strokeStyle = 'rgba(103,232,249,0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(mx - 7, my);
    ctx.lineTo(mx + 7, my);
    ctx.moveTo(mx, my - 7);
    ctx.lineTo(mx, my + 7);
    ctx.stroke();
    ctx.fillStyle = 'rgba(103,232,249,0.95)';
    ctx.beginPath();
    ctx.arc(mx, my, 3, 0, Math.PI * 2);
    ctx.fill();

    // axis labels
    ctx.fillStyle = 'rgba(148,163,184,0.45)';
    ctx.font = '9px monospace';
    ctx.fillText('feed →', W - 46, H - 6);
    ctx.save();
    ctx.translate(9, 40);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('← kill', 0, 0);
    ctx.restore();
  }, [feed, kill]);

  // ---- controls -----------------------------------------------------------
  const applyFeed = useCallback((next: number) => {
    let c = Math.min(FEED_MAX, Math.max(FEED_MIN, next));
    c = Math.round(c * 10000) / 10000;
    feedRef.current = c;
    setFeed(c);
  }, []);

  const applyKill = useCallback((next: number) => {
    let c = Math.min(KILL_MAX, Math.max(KILL_MIN, next));
    c = Math.round(c * 10000) / 10000;
    killRef.current = c;
    setKill(c);
  }, []);

  const jumpTo = useCallback(
    (p: Preset) => {
      applyFeed(p.feed);
      applyKill(p.kill);
      seedDish();
    },
    [applyFeed, applyKill, seedDish],
  );

  const onMapPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.buttons === 0 && e.type === 'pointermove') return;
      const canvas = mapRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const ky = 1 - (e.clientY - rect.top) / rect.height;
      applyFeed(FEED_MIN + fx * (FEED_MAX - FEED_MIN));
      applyKill(KILL_MIN + ky * (KILL_MAX - KILL_MIN));
    },
    [applyFeed, applyKill],
  );

  const toggleRun = useCallback(() => {
    setRunning((r) => {
      const next = !r;
      runningRef.current = next;
      return next;
    });
  }, []);

  const applySpeed = useCallback((s: number) => {
    speedRef.current = s;
    setSpeed(s);
  }, []);

  const reSeed = useCallback(() => {
    seedDish();
    if (!runningRef.current) {
      runningRef.current = true;
      setRunning(true);
    }
  }, [seedDish]);

  const onCopy = useCallback(async () => {
    const pct = (stats.coverage * 100).toFixed(0);
    const moving = stats.drift > 0.013 ? 'and it never stops moving' : 'frozen into place';
    const text = `I set two reaction rates (feed ${feed.toFixed(4)}, kill ${kill.toFixed(4)}) and a flat dish painted itself into ${near.name.toLowerCase()} with no picture loaded anywhere, ${pct}% covered, ${moving}. This is the math Alan Turing wrote in 1952 to explain how a leopard gets its spots.\n\nTuring Patterns, WIZ edition: https://wiz.jock.pl/experiments/turing-patterns`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [feed, kill, near, stats]);

  const toneClass =
    verdict.tone === 'order'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'chaos'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  const driftLabel =
    stats.coverage < 0.02 && stats.steps > 400
      ? 'washed out'
      : stats.drift > 0.013
        ? 'alive'
        : stats.drift > 0.0035
          ? 'settling'
          : 'locked';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Turing Patterns
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Two invisible chemicals, one tiny rule, and a flat dish paints itself into spots, stripes, mazes,
            and dividing cells. Two knobs decide which animal you get. No image is loaded. Drag the dial.
          </p>
        </header>

        {/* The dish */}
        <div className="rounded-lg border border-slate-800 bg-[#070312] p-2 shadow-2xl shadow-violet-950/40">
          <canvas
            ref={viewRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopPainting}
            onPointerLeave={stopPainting}
            className="block w-full cursor-crosshair rounded touch-none"
            style={{ aspectRatio: `${GW} / ${GH}` }}
            aria-label="A live reaction-diffusion dish: two chemicals spreading and reacting, painting spots, stripes, mazes and dividing cells out of a flat start."
          />
          <div className="flex items-center justify-between px-1 pb-1 pt-1.5 font-mono text-[10px] text-slate-600">
            <span>U + 2V → 3V</span>
            <span className="text-slate-500">✎ drag on the dish to paint more V</span>
            <span>{GW}×{GH} cells, live</span>
          </div>
        </div>

        {/* The two knobs */}
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr,auto] sm:items-start">
          <div className="rounded-lg border border-violet-500/30 bg-slate-900/50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">Feed rate</span>
              <span className="font-mono text-sm tabular-nums text-slate-200">{feed.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min={FEED_MIN}
              max={FEED_MAX}
              step={0.0005}
              value={feed}
              onChange={(e) => applyFeed(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-violet-400"
              aria-label="Feed rate slider"
            />
            <div className="mb-1 mt-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">Kill rate</span>
              <span className="font-mono text-sm tabular-nums text-slate-200">{kill.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min={KILL_MIN}
              max={KILL_MAX}
              step={0.0005}
              value={kill}
              onChange={(e) => applyKill(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-teal-400"
              aria-label="Kill rate slider"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={toggleRun}
                className={`rounded-md border px-3 py-1 font-mono text-xs transition ${
                  running
                    ? 'border-violet-400/60 bg-violet-400/15 text-violet-200'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {running ? '❚❚ pause' : '▶ run'}
              </button>
              <button
                onClick={reSeed}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                ↻ re-seed
              </button>
              <button
                onClick={clearDish}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                ⌫ clear
              </button>
              <label className="ml-auto flex items-center gap-2 text-[11px] text-slate-500">
                speed
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={speed}
                  onChange={(e) => applySpeed(parseInt(e.target.value, 10))}
                  className="h-1 w-20 cursor-pointer accent-slate-400"
                  aria-label="Simulation speed"
                />
              </label>
            </div>
          </div>

          {/* The map */}
          <div className="rounded-lg border border-slate-800 bg-[#070312] p-2">
            <canvas
              ref={mapRef}
              onPointerDown={onMapPointer}
              onPointerMove={onMapPointer}
              className="block cursor-crosshair rounded touch-none"
              style={{ width: 300, height: 200, maxWidth: '100%' }}
              aria-label="A map of feed rate against kill rate, with the named pattern regions marked and your current position as a crosshair."
            />
            <div className="px-1 pb-0.5 pt-1.5 text-center text-[10px] uppercase tracking-wider text-slate-600">
              the pattern atlas · click to land anywhere
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <Stat label="Feed" value={feed.toFixed(4)} />
          <Stat label="Kill" value={kill.toFixed(4)} />
          <Stat label="V coverage" value={`${(stats.coverage * 100).toFixed(0)}%`} accent="teal" />
          <Stat
            label="Field"
            value={driftLabel}
            accent={driftLabel === 'alive' ? 'amber' : driftLabel === 'settling' ? 'violet' : undefined}
          />
        </div>

        {/* WIZ verdict */}
        <div className={`mt-4 rounded-lg border p-4 text-sm transition-colors ${toneClass}`}>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
            {verdict.label}
          </div>
          <p className="leading-relaxed">{verdict.line}</p>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or jump to a known creature
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => jumpTo(p)}
                title={`feed ${p.feed}, kill ${p.kill} — ${p.blurb}`}
                className="group flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-center transition hover:border-violet-400/60 hover:bg-slate-800"
              >
                <span className="text-sm font-semibold text-violet-200 group-hover:text-violet-100">{p.name}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {p.feed} · {p.kill}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
            Tip: land on Coral and watch the maze grow, then drag the kill rate down a hair into Solitons and
            see the walls break into wandering blobs. Tiny moves, whole new species.
          </p>
        </div>

        {/* The rule */}
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setShowRules((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base font-semibold text-slate-100">The only rule there is</span>
            <span className="text-slate-500">{showRules ? '−' : '+'}</span>
          </button>
          {showRules && (
            <div className="space-y-2 border-t border-slate-800 px-5 py-4 text-sm leading-relaxed text-slate-300">
              <p>
                Every cell of the dish holds two chemicals, <span className="text-violet-300">U</span> and{' '}
                <span className="text-teal-300">V</span>. Four things happen to them, over and over:
              </p>
              <ul className="ml-1 space-y-1.5">
                <li>
                  <span className="text-slate-200">they spread.</span> Both diffuse into their neighbors, and U
                  spreads twice as fast as V. That speed difference is the whole secret.
                </li>
                <li>
                  <span className="text-slate-200">they react.</span> Where they meet, two V plus one U become
                  three V: V eats U and copies itself, the autocatalytic kick.
                </li>
                <li>
                  <span className="text-violet-300">U is fed</span> in from outside at the feed rate, replacing
                  what the reaction consumes.
                </li>
                <li>
                  <span className="text-teal-300">V is killed</span>, removed at the kill rate before it can take
                  over everything.
                </li>
              </ul>
              <p className="rounded-md border border-slate-800 bg-slate-950/60 px-4 py-3 text-center font-mono text-xs text-teal-200">
                U′ = D<sub>u</sub>∇²U − UV² + feed·(1−U)
                <br />
                V′ = D<sub>v</sub>∇²V + UV² − (feed+kill)·V
              </p>
              <p className="text-slate-400">
                That is the entire model: spread, react, feed, kill. No image is loaded and nothing is drawn. The
                colours you see are simply how much V sits in each cell. Fast diffusion wants to smooth
                everything flat; the reaction wants to clump V together. The tug of war between them, tuned by
                two numbers, is where the spots and stripes come from. Turing called the two chemicals
                <span className="text-slate-200"> morphogens</span>, the shape-makers.
              </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">The reframe</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            Here is the question that haunted biology. A leopard starts as a single cell. It divides into a ball
            of cells that are all, at the start, identical, carrying the same DNA, sitting in the same soup.
            Nothing in that ball is labelled &quot;spot here, fur there.&quot; So how does a featureless,
            symmetric blob decide to grow stripes down its back and rosettes on its flanks, in roughly the same
            places every time, with no architect and no blueprint pointing at each cell?{' '}
            <span className="text-slate-100">
              Turing&apos;s answer was that the pattern does not need a painter. It falls out of chemistry on its
              own.
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Take two substances that react, where one spreads faster than the other, and a flat, even mix is
            secretly unstable. The tiniest random wobble gets amplified into peaks and valleys at a fixed
            spacing, and that spacing, set entirely by the reaction rates, is the pattern. Wide spacing on a
            small animal gives spots; the same chemistry on a long thin tail gives rings, which is exactly why so
            many spotted cats have striped tails and no striped cat has a spotted one.{' '}
            <span className="text-slate-100">
              You just watched the same instability paint a dish with no cells, no genes, and no plan in it
              anywhere.
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            And the spookiest part is how little you control. You can paint a seed, but the rule erases it: drag
            two knobs and the dish settles into <em>its</em> pattern, not yours, decided before you touched it.
            The same math has since been found in real chemistry (the Belousov-Zhabotinsky reaction), in the
            ridges of your own fingertips, in the spacing of hair follicles and shark skin denticles, and in the
            stripes a zebrafish actually grows.{' '}
            <span className="text-slate-100">
              Structure was never something life had to design. Sometimes it just has to let go and let the
              chemistry fall into shape.
            </span>
          </p>
        </div>

        {/* History */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The history</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            In 1952 Alan Turing, the man who had cracked Enigma and laid the foundations of computing, published
            &quot;The Chemical Basis of Morphogenesis&quot; in the Philosophical Transactions of the Royal
            Society. It was his last major paper; he died in 1954, two years later. In it he proposed that two
            diffusing, reacting chemicals could spontaneously break their own symmetry and lay down biological
            pattern, and he worked the equations by hand and on the Manchester computer, one of the first
            machines he had helped build. For decades it was a beautiful idea waiting for evidence. Then in the
            1980s John Pearson, Peter Gray, and Stephen Scott studied a simple two-chemical model, now called
            Gray-Scott, the exact one running above; in 1990 the De Kepper group produced the first clean
            laboratory Turing patterns in a chemical reactor; and in 2012 Kondo and others showed that the
            stripes of real fish are governed by Turing-type dynamics, even watching the patterns rearrange as
            the fish grows. The pattern in every leopard, zebra, pufferfish and seashell turned out to be hiding
            in a few lines of arithmetic a wartime codebreaker wrote down while the rest of the world was still
            asking who could possibly be drawing the spots.
          </p>
        </div>

        {/* Share + back */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-violet-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-violet-400"
          >
            {copied ? '✓ Copied' : 'Copy what your dish grew'}
          </button>
          <button
            onClick={() => jumpTo(PRESETS[0])}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Back to Coral
          </button>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <a
            href="/experiments"
            className="text-sm text-slate-400 underline-offset-4 hover:text-violet-300 hover:underline"
          >
            ← back to all experiments
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: 'amber' | 'teal' | 'violet' }) {
  const valueClass =
    accent === 'amber'
      ? 'text-amber-300'
      : accent === 'teal'
        ? 'text-teal-300'
        : accent === 'violet'
          ? 'text-violet-300'
          : 'text-slate-100';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className={`break-all font-mono text-base font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
