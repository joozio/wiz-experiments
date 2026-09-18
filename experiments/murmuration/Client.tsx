'use client';

// MURMURATION (the boids model)
// This lab has a run of experiments that hand you a rule and let you watch what
// it does on its own: Game of Life with a grid, Collatz with one number, Turing
// Patterns with two chemicals. This one does it with three local rules and a
// few hundred birds.
//
// The rules (Craig Reynolds, 1986, the boids model):
//   SEPARATION , steer away from the bird that is too close (no crowding).
//   ALIGNMENT  , steer to match the average velocity of nearby birds.
//   COHESION   , steer toward the average position of nearby birds.
//
// Apply all three, weight them, and every bird does it every tick looking only
// at its handful of neighbors. Out of that, with no leader and no blueprint, a
// murmuration falls out: a single fluid body that splits around a predator,
// ripples, spirals, then knits back together.
//
// WIZ note. The genuine hook is the one this run keeps finding: coordination
// without a coordinator. In a real starling murmuration each bird watches exactly
// seven neighbors, topologically not metrically, the seven birds closest in
// rank regardless of actual distance. That is one of the things that makes the
// cloud so robust: new birds can join or leave the edge and the interior barely
// shivers, because the signal is relayed along the seven-neighbor web, not lost
// to the wind. Switch the perception dial here from metric radius to 7-NN and
// feel the difference: the flock tightens, the response to the predator
// propagates faster, and the whole thing stops being a circle-of-friends and
// starts being a chain of whispers.

import { usePageCopy } from '@/contexts/usePageCopy';
import pl from './pl.json';
import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Tuneable constants
// ---------------------------------------------------------------------------

const N_BOIDS = 280;
const CANVAS_W = 700;
const CANVAS_H = 500;

const SPEED_MIN = 1.2;
const SPEED_MAX = 3.0;
const STEER_MAX = 0.12;

const SEP_RADIUS = 25;
const SEP_WEIGHT_DEFAULT = 1.6;
const ALI_RADIUS = 50;
const ALI_WEIGHT_DEFAULT = 1.0;
const COH_RADIUS = 50;
const COH_WEIGHT_DEFAULT = 1.0;
const TOPOLOGICAL_K = 7;

const PRED_RADIUS = 90;
const PRED_WEIGHT = 3.5;

const TRAIL_ALPHA = 0.18; // how much the previous frame persists

// ---------------------------------------------------------------------------
// Vec2 helpers (plain objects, not classes, for GC friendliness)
// ---------------------------------------------------------------------------

interface Vec2 { x: number; y: number }

function add(a: Vec2, b: Vec2): Vec2 { return { x: a.x + b.x, y: a.y + b.y }; }
function sub(a: Vec2, b: Vec2): Vec2 { return { x: a.x - b.x, y: a.y - b.y }; }
function scale(a: Vec2, s: number): Vec2 { return { x: a.x * s, y: a.y * s }; }
function len(a: Vec2): number { return Math.sqrt(a.x * a.x + a.y * a.y); }
function norm(a: Vec2): Vec2 { const l = len(a); return l < 1e-9 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l }; }
function limit(a: Vec2, max: number): Vec2 { const l = len(a); return l > max ? scale(norm(a), max) : a; }
function dist2(a: Vec2, b: Vec2): number { const dx = a.x - b.x; const dy = a.y - b.y; return dx*dx + dy*dy; }
function wrapDist(ax: number, bx: number, W: number): number {
  let d = ax - bx;
  if (d > W * 0.5) d -= W;
  else if (d < -W * 0.5) d += W;
  return d;
}

// ---------------------------------------------------------------------------
// Boid struct, kept in plain arrays for cache-friendliness
// ---------------------------------------------------------------------------

interface Boid {
  pos: Vec2;
  vel: Vec2;
  acc: Vec2;
  hue: number; // slight hue variation per bird for visual depth
}

function makeBoids(): Boid[] {
  const out: Boid[] = [];
  for (let i = 0; i < N_BOIDS; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN) * 0.5;
    out.push({
      pos: { x: Math.random() * CANVAS_W, y: Math.random() * CANVAS_H },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      acc: { x: 0, y: 0 },
      hue: 180 + Math.random() * 60, // teal-to-cyan family
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// The steerer, one full tick of the boids model.
// All arithmetic is inlined; no allocation in the hot path beyond the few
// result vecs accumulated per boid.
// ---------------------------------------------------------------------------

function stepBoids(
  boids: Boid[],
  predPos: Vec2 | null,
  sepW: number,
  aliW: number,
  cohW: number,
  topological: boolean,
  predActive: boolean,
) {
  const n = boids.length;
  const ALI2 = ALI_RADIUS * ALI_RADIUS;
  const COH2 = COH_RADIUS * COH_RADIUS;
  const SEP2 = SEP_RADIUS * SEP_RADIUS;
  const PRED2 = PRED_RADIUS * PRED_RADIUS;
  const W = CANVAS_W;
  const H = CANVAS_H;

  for (let i = 0; i < n; i++) {
    const b = boids[i];

    let sepX = 0, sepY = 0, sepCount = 0;
    let aliX = 0, aliY = 0, aliCount = 0;
    let cohX = 0, cohY = 0, cohCount = 0;

    if (topological) {
      // --- topological: find K nearest, then apply rules to that set ---
      // dist2 + wrapped positions
      const dists: [number, number][] = []; // [dist2, index]
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const dx = wrapDist(b.pos.x, boids[j].pos.x, W);
        const dy = wrapDist(b.pos.y, boids[j].pos.y, H);
        dists.push([dx*dx + dy*dy, j]);
      }
      dists.sort((a, b) => a[0] - b[0]);
      const kNeighbors = dists.slice(0, TOPOLOGICAL_K);
      for (const [d2, j] of kNeighbors) {
        const other = boids[j];
        // cohesion and alignment always apply to k-neighbors
        const dx = wrapDist(b.pos.x, other.pos.x, W);
        const dy = wrapDist(b.pos.y, other.pos.y, H);
        cohX += other.pos.x; cohY += other.pos.y; cohCount++;
        aliX += other.vel.x; aliY += other.vel.y; aliCount++;
        // separation only when within hard sep radius
        if (d2 < SEP2 && d2 > 0) {
          // steer away, inversely proportional to distance
          const l = Math.sqrt(d2);
          sepX -= dx / l;
          sepY -= dy / l;
          sepCount++;
        }
      }
    } else {
      // --- metric: all birds within radius ---
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const other = boids[j];
        const dx = wrapDist(b.pos.x, other.pos.x, W);
        const dy = wrapDist(b.pos.y, other.pos.y, H);
        const d2 = dx*dx + dy*dy;
        if (d2 < SEP2 && d2 > 0) {
          const l = Math.sqrt(d2);
          sepX -= dx / l;
          sepY -= dy / l;
          sepCount++;
        }
        if (d2 < ALI2) {
          aliX += other.vel.x; aliY += other.vel.y; aliCount++;
        }
        if (d2 < COH2) {
          cohX += other.pos.x; cohY += other.pos.y; cohCount++;
        }
      }
    }

    // --- compute steering forces ---
    let steerX = 0, steerY = 0;

    // separation
    if (sepCount > 0) {
      const sx = sepX / sepCount;
      const sy = sepY / sepCount;
      const sl = Math.sqrt(sx*sx + sy*sy);
      if (sl > 1e-9) {
        const tx = (sx / sl) * SPEED_MAX - b.vel.x;
        const ty = (sy / sl) * SPEED_MAX - b.vel.y;
        const tl = Math.sqrt(tx*tx + ty*ty);
        steerX += tl > STEER_MAX ? (tx / tl) * STEER_MAX * sepW : tx * sepW;
        steerY += tl > STEER_MAX ? (ty / tl) * STEER_MAX * sepW : ty * sepW;
      }
    }

    // alignment
    if (aliCount > 0) {
      const ax = aliX / aliCount;
      const ay = aliY / aliCount;
      const al = Math.sqrt(ax*ax + ay*ay);
      if (al > 1e-9) {
        const tx = (ax / al) * SPEED_MAX - b.vel.x;
        const ty = (ay / al) * SPEED_MAX - b.vel.y;
        const tl = Math.sqrt(tx*tx + ty*ty);
        steerX += tl > STEER_MAX ? (tx / tl) * STEER_MAX * aliW : tx * aliW;
        steerY += tl > STEER_MAX ? (ty / tl) * STEER_MAX * aliW : ty * aliW;
      }
    }

    // cohesion
    if (cohCount > 0) {
      const cx = cohX / cohCount;
      const cy = cohY / cohCount;
      let dx = cx - b.pos.x;
      let dy = cy - b.pos.y;
      // wrap
      if (dx > W * 0.5) dx -= W;
      else if (dx < -W * 0.5) dx += W;
      if (dy > H * 0.5) dy -= H;
      else if (dy < -H * 0.5) dy += H;
      const cl = Math.sqrt(dx*dx + dy*dy);
      if (cl > 1e-9) {
        const tx = (dx / cl) * SPEED_MAX - b.vel.x;
        const ty = (dy / cl) * SPEED_MAX - b.vel.y;
        const tl = Math.sqrt(tx*tx + ty*ty);
        steerX += tl > STEER_MAX ? (tx / tl) * STEER_MAX * cohW : tx * cohW;
        steerY += tl > STEER_MAX ? (ty / tl) * STEER_MAX * cohW : ty * cohW;
      }
    }

    // predator avoidance
    if (predActive && predPos) {
      let dx = b.pos.x - predPos.x;
      let dy = b.pos.y - predPos.y;
      if (dx > W * 0.5) dx -= W; else if (dx < -W * 0.5) dx += W;
      if (dy > H * 0.5) dy -= H; else if (dy < -H * 0.5) dy += H;
      const d2 = dx*dx + dy*dy;
      if (d2 < PRED2 && d2 > 0) {
        const dl = Math.sqrt(d2);
        // flee, force proportional to closeness
        const force = (1 - dl / PRED_RADIUS) * PRED_WEIGHT;
        const tx = (dx / dl) * SPEED_MAX - b.vel.x;
        const ty = (dy / dl) * SPEED_MAX - b.vel.y;
        const tl = Math.sqrt(tx*tx + ty*ty);
        steerX += tl > STEER_MAX ? (tx / tl) * STEER_MAX * force : tx * force;
        steerY += tl > STEER_MAX ? (ty / tl) * STEER_MAX * force : ty * force;
      }
    }

    b.acc.x = steerX;
    b.acc.y = steerY;
  }

  // integrate
  for (let i = 0; i < n; i++) {
    const b = boids[i];
    b.vel.x += b.acc.x;
    b.vel.y += b.acc.y;
    // clamp speed
    const vl = Math.sqrt(b.vel.x*b.vel.x + b.vel.y*b.vel.y);
    if (vl > SPEED_MAX) { b.vel.x = (b.vel.x / vl) * SPEED_MAX; b.vel.y = (b.vel.y / vl) * SPEED_MAX; }
    else if (vl < SPEED_MIN) { b.vel.x = (b.vel.x / (vl || 1)) * SPEED_MIN; b.vel.y = (b.vel.y / (vl || 1)) * SPEED_MIN; }
    // advance + wrap
    b.pos.x = (b.pos.x + b.vel.x + CANVAS_W) % CANVAS_W;
    b.pos.y = (b.pos.y + b.vel.y + CANVAS_H) % CANVAS_H;
    b.acc.x = 0; b.acc.y = 0;
  }
}

// ---------------------------------------------------------------------------
// Metrics: measure the flock's degree of order (alignment) and cohesion
// ---------------------------------------------------------------------------

interface FlockStats {
  order: number;   // 0-1 mean velocity alignment (Vicsek order parameter)
  spread: number;  // px, std-dev of bird positions from centroid
  density: number; // birds per 100x100 area at the centroid
}

function measureFlock(boids: Boid[]): FlockStats {
  const n = boids.length;
  if (n === 0) return { order: 0, spread: 0, density: 0 };
  let vx = 0, vy = 0;
  let cx = 0, cy = 0;
  for (const b of boids) {
    const vl = Math.sqrt(b.vel.x*b.vel.x + b.vel.y*b.vel.y);
    if (vl > 0) { vx += b.vel.x / vl; vy += b.vel.y / vl; }
    cx += b.pos.x; cy += b.pos.y;
  }
  const order = Math.sqrt((vx/n)**2 + (vy/n)**2);
  cx /= n; cy /= n;
  let spread = 0;
  let nearby = 0;
  for (const b of boids) {
    const dx = b.pos.x - cx; const dy = b.pos.y - cy;
    spread += dx*dx + dy*dy;
    if (dx*dx + dy*dy < 5000) nearby++;
  }
  spread = Math.sqrt(spread / n);
  density = nearby / (Math.PI * Math.sqrt(5000) * Math.sqrt(5000) / 10000);
  return { order, spread, density };
}
let density = 0;

// ---------------------------------------------------------------------------
// Verdict
// ---------------------------------------------------------------------------

interface Verdict { label: string; line: string; tone: 'order' | 'edge' | 'chaos' }

function makeVerdict(
  stats: FlockStats,
  sepW: number,
  aliW: number,
  cohW: number,
  topological: boolean,
  predActive: boolean,
): Verdict {
  const { order, spread } = stats;
  const o = (order * 100).toFixed(0);
  const s = spread.toFixed(0);

  if (predActive && order > 0.55) {
    return {
      label: 'Evasion wave',
      tone: 'chaos',
      line: `The alarm signal is spreading, not by sound and not by sight of the predator, but by the twitch of the nearest wing. Each bird inside the panic radius peels away; that motion is seen by its neighbors, who peel away too; the wave propagates outward through the seven-nearest-neighbor chain at roughly 20 body-lengths per second, far faster than any bird could consciously relay a warning. Order is ${o}% and the cloud is pulling apart (spread ${s}px) as the flock pours around the threat. This is exactly the behavior the STARFLAG project filmed over Rome in 2006: a near-instantaneous response that, measured carefully, turns out to be a chain of local reactions, not a collective decision.`,
    };
  }

  if (sepW > 2.0 && cohW < 0.5) {
    return {
      label: 'Dispersed: no flock',
      tone: 'chaos',
      line: `When the cost of crowding dominates and the pull toward the center is weak, the flock dissolves into a gas of loners. Order is ${o}%, spread is ${s}px, and there is effectively no flock here, just ${N_BOIDS} individual birds each avoiding the others. This is exactly the boundary Reynolds defined: below a threshold of cohesion relative to separation, the system cannot maintain a collective. Raise cohesion or drop separation and watch them knit back together in a few seconds.`,
    };
  }

  if (order < 0.3 && spread < 120) {
    return {
      label: 'Swarm: no direction',
      tone: 'edge',
      line: `${N_BOIDS} birds, very close, no shared direction. Order is ${o}%, which is low for a flock, because the cohesion force is strong enough to keep them packed but the alignment force is not strong enough to synchronize their headings. The result is a midge-cloud: dense, locally reacting, but rotating and counter-rotating with no global arrow. This is a different attractor than the murmuration. Raise alignment and the rotation will lock in; raise separation and they will spread into a calmer drift.`,
    };
  }

  if (order > 0.75 && spread > 140) {
    return {
      label: 'Full murmuration',
      tone: 'order',
      line: `This is the classical regime. Order is ${o}%, most birds flying the same direction, and the flock is spread over ${s}px, large enough that no single bird can see more than a tiny fraction of the others, yet the cloud moves as one body. The mechanism is the same as in every real murmuration ever measured: alignment propagates through nearest-neighbor chains, creating a correlation length far larger than any individual's range of perception. Drop cohesion below half a unit and the cloud will slowly dissolve. Drop separation below a unit and the birds will collapse into a tight spinning ball.`,
    };
  }

  if (order > 0.6 && spread < 100) {
    return {
      label: 'Compact school',
      tone: 'order',
      line: `Strong alignment (${o}%) in a tight cluster (${s}px spread), this is the fish-school mode. The cohesion force is high enough to keep the group packed, and alignment is high enough to give it a direction, so the whole school slides through space as a single silvery dart. Real fish schools operate in this regime: higher density than bird flocks, strong alignment, a polarization wave that ripples through the body in tens of milliseconds when the lead fish turns. Loosen cohesion and the school will bloom into a looser murmuration.`,
    };
  }

  if (topological) {
    return {
      label: '7-nearest-neighbor mode',
      tone: 'edge',
      line: `You are in topological mode: each bird watches its seven nearest neighbors by social rank, not by a fixed bubble of space. This is the real starling algorithm, recovered from the STARFLAG experiment in Rome. Order is ${o}%, spread ${s}px. In metric mode, a bird at the edge of the flock loses its neighbors as the gap widens; in topological mode it keeps exactly seven, so the flock stays connected and the alarm wave propagates without gaps. When the flock is dense, topological and metric give the same answer. When it stretches, only topological holds.`,
    };
  }

  return {
    label: 'Mid-range flock',
    tone: 'edge',
    line: `Order ${o}%, spread ${s}px. The three rules are balancing each other and the flock is in a medium state: neither tightly packed nor fully dispersed, neither perfectly aligned nor rotating chaotically. This is where the most interesting dynamics live. Drag any dial and the flock will drift to a different attractor. Drag separation down a notch and watch the birds compress; drag alignment up and the rotation will lock into a clean arrow. The flock is not frozen, it is permanently negotiating.`,
  };
}

const polishVerdicts: Record<string, string> = {
  'Evasion wave': 'Ptaki w zasięgu sokoła uciekają, a ich sąsiedzi reagują na zmianę kierunku. Obserwuj, jak lokalny unik przekształca całą chmurę.',
  'Dispersed: no flock': 'Silna separacja i słaba spójność rozpuszczają stado. Zwiększ spójność albo zmniejsz separację, aby znów zebrać ptaki.',
  'Swarm: no direction': 'Ptaki są blisko siebie, ale nie mają wspólnego kierunku. Zwiększ wyrównanie, aby nadać rojowi kierunek, albo separację, aby go rozluźnić.',
  'Full murmuration': 'Większość ptaków leci zgodnie, choć chmura jest rozciągnięta. Zmniejsz spójność i sprawdź, kiedy wspólny kształt zacznie się rozpadać.',
  'Compact school': 'Duża zgodność kierunku i mała rozpiętość tworzą zwartą ławicę. Zmniejsz spójność, aby pozwolić jej się rozwinąć.',
  '7-nearest-neighbor mode': 'Każdy ptak śledzi siedmiu najbliższych sąsiadów, zamiast wszystkich w stałym promieniu. Porównaj oba tryby, gdy chmura się rozciąga.',
  'Mid-range flock': 'Trzy zasady równoważą się. Zmniejsz separację, aby zbliżyć ptaki, albo zwiększ wyrównanie, aby wzmocnić wspólny kierunek.',
};

// ---------------------------------------------------------------------------
// Color: each bird is a short chevron, tinted by its hue and slightly by its
// velocity alignment with the swarm mean
// ---------------------------------------------------------------------------

function drawBoids(
  ctx: CanvasRenderingContext2D,
  boids: Boid[],
  predPos: Vec2 | null,
  predActive: boolean,
) {
  // find mean velocity for coloring
  let mvx = 0, mvy = 0;
  for (const b of boids) { mvx += b.vel.x; mvy += b.vel.y; }
  const ml = Math.sqrt(mvx*mvx + mvy*mvy) || 1;
  mvx /= ml; mvy /= ml;

  for (const b of boids) {
    const vl = Math.sqrt(b.vel.x*b.vel.x + b.vel.y*b.vel.y) || 1;
    const ux = b.vel.x / vl;
    const uy = b.vel.y / vl;
    // local alignment with swarm mean: dot product
    const align = ux * mvx + uy * mvy; // -1..1

    // each bird is a small chevron pointing in vel direction
    const size = 5;
    const px = b.pos.x;
    const py = b.pos.y;
    const angle = Math.atan2(b.vel.y, b.vel.x);

    // colour: teal-to-amber, warmer when well aligned
    const alpha = 0.65 + align * 0.3;
    const lightness = 55 + align * 20;
    ctx.fillStyle = `hsla(${b.hue}, 80%, ${lightness}%, ${alpha})`;
    ctx.strokeStyle = `hsla(${b.hue}, 80%, ${lightness + 15}%, ${alpha * 0.5})`;
    ctx.lineWidth = 0.6;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.6, size * 0.5);
    ctx.lineTo(-size * 0.3, 0);
    ctx.lineTo(-size * 0.6, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // predator: a red diamond
  if (predActive && predPos) {
    ctx.save();
    ctx.translate(predPos.x, predPos.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(239,68,68,0.85)';
    ctx.strokeStyle = 'rgba(254,202,202,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(-7, -7, 14, 14);
    ctx.fill();
    ctx.stroke();
    // inner dot
    ctx.fillStyle = 'rgba(254,202,202,0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // soft panic halo
    const grd = ctx.createRadialGradient(predPos.x, predPos.y, 0, predPos.x, predPos.y, PRED_RADIUS);
    grd.addColorStop(0, 'rgba(239,68,68,0.06)');
    grd.addColorStop(1, 'rgba(239,68,68,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(predPos.x, predPos.y, PRED_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

interface Preset { name: string; sep: number; ali: number; coh: number; topo: boolean; blurb: string }

const PRESETS: Preset[] = [
  { name: 'Murmuration', sep: SEP_WEIGHT_DEFAULT, ali: 1.0, coh: 1.0, topo: true,  blurb: 'loose cloud, high alignment, topological' },
  { name: 'Fish School',  sep: 1.2,                ali: 1.4, coh: 2.0, topo: false, blurb: 'tight, polarised, compact sliding school' },
  { name: 'Midge Swarm',  sep: 0.9,                ali: 0.4, coh: 2.5, topo: false, blurb: 'dense, low alignment, rotating chaos' },
  { name: 'Open Drift',   sep: 1.0,                ali: 1.5, coh: 0.5, topo: false, blurb: 'spread out, shared direction, airy' },
  { name: 'Solitude',     sep: 2.8,                ali: 0.6, coh: 0.2, topo: false, blurb: 'loners: every bird for itself' },
  { name: 'Vortex',       sep: 1.8,                ali: 0.5, coh: 1.8, topo: false, blurb: 'rotating toroidal vortex ring' },
];

// ---------------------------------------------------------------------------
// The component
// ---------------------------------------------------------------------------

export default function Client() {
  const { c, language } = usePageCopy(pl);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boidsRef = useRef<Boid[]>([]);
  const animRef = useRef<number>(0);

  // refs the loop reads, no restarts
  const sepRef = useRef(SEP_WEIGHT_DEFAULT);
  const aliRef = useRef(ALI_WEIGHT_DEFAULT);
  const cohRef = useRef(COH_WEIGHT_DEFAULT);
  const topoRef = useRef(true);
  const predRef = useRef<Vec2 | null>(null);
  const predActiveRef = useRef(false);
  const runRef = useRef(false);

  // UI state mirrors
  const [sep, setSep] = useState(SEP_WEIGHT_DEFAULT);
  const [ali, setAli] = useState(ALI_WEIGHT_DEFAULT);
  const [coh, setCoh] = useState(COH_WEIGHT_DEFAULT);
  const [topo, setTopo] = useState(true);
  const [predActive, setPredActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<FlockStats>({ order: 0.8, spread: 150, density: 0 });
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const frameRef = useRef(0);

  const verdict = makeVerdict(stats, sep, ali, coh, topo, predActive);

  // ---- loop ----------------------------------------------------------------
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => { runRef.current = !motion.matches; setRunning(!motion.matches); };
    syncMotion();
    motion.addEventListener('change', syncMotion);
    boidsRef.current = makeBoids();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      if (runRef.current) {
        stepBoids(
          boidsRef.current,
          predRef.current,
          sepRef.current,
          aliRef.current,
          cohRef.current,
          topoRef.current,
          predActiveRef.current,
        );
      }

      // trail: fill with very transparent dark to create motion blur
      ctx.fillStyle = `rgba(6, 6, 18, ${TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      drawBoids(ctx, boidsRef.current, predRef.current, predActiveRef.current);

      frameRef.current++;
      if (frameRef.current % 20 === 0) {
        setStats(measureFlock(boidsRef.current));
      }

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); motion.removeEventListener('change', syncMotion); };
  }, []);

  // ---- predator pointer tracking ------------------------------------------
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const py = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
    predRef.current = { x: px, y: py };
    if (!predActiveRef.current) {
      predActiveRef.current = true;
      setPredActive(true);
    }
  }, []);

  const onPointerLeave = useCallback(() => {
    predActiveRef.current = false;
    setPredActive(false);
    predRef.current = null;
  }, []);

  // ---- controls -----------------------------------------------------------
  const applySep = useCallback((v: number) => { sepRef.current = v; setSep(v); }, []);
  const applyAli = useCallback((v: number) => { aliRef.current = v; setAli(v); }, []);
  const applyCoh = useCallback((v: number) => { cohRef.current = v; setCoh(v); }, []);
  const applyTopo = useCallback((v: boolean) => { topoRef.current = v; setTopo(v); }, []);

  const toggleRun = useCallback(() => {
    setRunning((r) => { const next = !r; runRef.current = next; return next; });
  }, []);

  const scatter = useCallback(() => {
    boidsRef.current = makeBoids();
  }, []);

  const jumpTo = useCallback((p: Preset) => {
    applySep(p.sep); applyAli(p.ali); applyCoh(p.coh); applyTopo(p.topo);
    boidsRef.current = makeBoids();
  }, [applySep, applyAli, applyCoh, applyTopo]);

  const onCopy = useCallback(async () => {
    const o = (stats.order * 100).toFixed(0);
    const text = language === 'pl' ? `Trzy zasady, ${N_BOIDS} ptaków, brak lidera. Moje stado ma ${o}% zgodności kierunku.\n\nhttps://wiz.jock.pl/experiments/murmuration/` : `I gave ${N_BOIDS} birds three rules and no leader, and they self-organized into a flock with ${o}% alignment. The whole shape acts like one body, and no single bird knows it exists.\n\nMurmuration, WIZ edition: https://wiz.jock.pl/experiments/murmuration`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }, [stats, language]);

  const toneClass =
    verdict.tone === 'order'
      ? 'border-teal-500/40 bg-teal-950/20 text-teal-100'
      : verdict.tone === 'chaos'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-100'
        : 'border-violet-500/40 bg-violet-950/20 text-violet-100';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-6 sm:py-10">
        <header className="mb-8 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/70"> {c("wiz.jock.pl · experiment")} </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl"> {c("Murmuration")} </h1>
          <p className="mt-3 text-sm text-slate-400"> {c("Three rules, no leader, and a few hundred birds self-organize into a swirling cloud. Drag across the flock to become the falcon. Three dials change how they fly.")} </p>
        </header>

        <div className="flex items-center justify-between gap-3 mb-3">
            <button
              onClick={toggleRun}
              aria-pressed={running}
              className={`rounded-md border min-h-11 px-4 py-2 font-mono text-xs transition ${
                running
                  ? 'border-teal-400/60 bg-teal-400/15 text-teal-200'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
              }`}
            >
              {running ? c("❚❚ pause") : c("▶ run")}
            </button>
          <span className="text-xs text-slate-400">{N_BOIDS} {c("birds")}</span>
        </div>

        {/* Canvas */}
        <div
          className="rounded-lg border border-slate-800 bg-[#060612] shadow-2xl shadow-indigo-950/40 overflow-hidden"
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        >
          <canvas
            ref={canvasRef}
            tabIndex={0}
            onKeyDown={e => {
              const moves: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
              if (moves[e.key]) {
                e.preventDefault();
                const pos = predRef.current ?? { x: CANVAS_W / 2, y: CANVAS_H / 2 };
                const [dx, dy] = moves[e.key];
                predRef.current = { x: Math.max(0, Math.min(CANVAS_W, pos.x + dx)), y: Math.max(0, Math.min(CANVAS_H, pos.y + dy)) };
                predActiveRef.current = true; setPredActive(true);
              } else if (e.key === 'Escape') { onPointerLeave(); }
              else if (e.key === ' ') { e.preventDefault(); toggleRun(); }
            }}
            onBlur={onPointerLeave}
            onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); onPointerMove(e); }}
            onPointerUp={e => { e.currentTarget.releasePointerCapture(e.pointerId); if (e.pointerType !== 'mouse') onPointerLeave(); }}
            onPointerCancel={onPointerLeave}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className="block w-full h-full cursor-crosshair touch-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-300"
            aria-label={language === 'pl' ? `Symulacja stada: ${N_BOIDS} ptaków i trzy zasady. Przeciągaj, aby sterować sokołem, albo ustaw fokus i użyj strzałek. Escape usuwa sokoła, spacja przełącza pauzę.` : `A murmuration simulation: ${N_BOIDS} birds flocking with three simple rules. Drag to steer the falcon, or focus here and use arrow keys. Escape removes it. Space pauses or runs.`}
          />
        </div>
        <p className="px-1 py-2 text-xs leading-relaxed text-slate-400 mb-3">{c("Drag to steer the falcon. Keyboard: focus the flock, then use arrow keys. Escape removes the falcon; Space pauses or runs.")}</p>

        {/* Three dials */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 mb-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Separation */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-300/80">{c("Separation")}</span>
                <span className="font-mono text-sm tabular-nums text-slate-200">{sep.toFixed(1)}</span>
              </div>
              <input
                type="range" min={0.1} max={3.5} step={0.1} value={sep}
                onChange={(e) => applySep(parseFloat(e.target.value))}
                className="h-11 w-full cursor-pointer accent-rose-400"
                aria-label={c("Separation weight")}
              />
              <p className="mt-1 text-[10px] text-slate-600">{c("avoid the too-close")}</p>
            </div>
            {/* Alignment */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">{c("Alignment")}</span>
                <span className="font-mono text-sm tabular-nums text-slate-200">{ali.toFixed(1)}</span>
              </div>
              <input
                type="range" min={0.1} max={2.5} step={0.1} value={ali}
                onChange={(e) => applyAli(parseFloat(e.target.value))}
                className="h-11 w-full cursor-pointer accent-teal-400"
                aria-label={c("Alignment weight")}
              />
              <p className="mt-1 text-[10px] text-slate-600">{c("steer like your neighbors")}</p>
            </div>
            {/* Cohesion */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300/80">{c("Cohesion")}</span>
                <span className="font-mono text-sm tabular-nums text-slate-200">{coh.toFixed(1)}</span>
              </div>
              <input
                type="range" min={0.1} max={3.0} step={0.1} value={coh}
                onChange={(e) => applyCoh(parseFloat(e.target.value))}
                className="h-11 w-full cursor-pointer accent-violet-400"
                aria-label={c("Cohesion weight")}
              />
              <p className="mt-1 text-[10px] text-slate-600">{c("drift toward the center")}</p>
            </div>
          </div>

          {/* Topo toggle + controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyTopo(!topo)}
              aria-pressed={topo}
              className={`min-h-11 rounded-md border px-3 py-1 font-mono text-xs transition ${
                topo
                  ? 'border-amber-400/60 bg-amber-400/15 text-amber-200'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500'
              }`}
            >
              {topo ? c("🐦 7-nearest (real starlings)") : c("○ metric radius")}
            </button>
            <button
              onClick={scatter}
              className="min-h-11 rounded-md border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            > {c("↻ scatter")} </button>
          </div>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <Stat label={c("Order")} value={`${(stats.order * 100).toFixed(0)}%`} accent="teal" />
          <Stat label={c("Spread")} value={`${stats.spread.toFixed(0)} px`} />
          <Stat label={c("Perception")} value={topo ? c("7-NN") : c("radius")} accent={topo ? 'amber' : undefined} />
        </div>

        {/* Verdict */}
        <div className={`rounded-lg border p-4 text-sm mb-5 transition-colors ${toneClass}`}>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-current" />
            {c(verdict.label)}
          </div>
          <p className="leading-relaxed">{language === 'pl' ? `${polishVerdicts[verdict.label]} Porządek: ${(stats.order * 100).toFixed(0)}%. Rozpiętość: ${stats.spread.toFixed(0)} px.` : verdict.line}</p>
        </div>

        {/* Presets */}
        <div className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"> {c("Jump to a known regime")} </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={c(p.name)}
                onClick={() => jumpTo(p)}
                title={c(p.blurb)}
                className="group flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left transition hover:border-teal-400/60 hover:bg-slate-800"
              >
                <span className="text-sm font-semibold text-teal-200 group-hover:text-teal-100">{c(p.name)}</span>
                <span className="text-[10px] text-slate-500">{c(p.blurb)}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-600"> {c("Tip: start on Murmuration, move your cursor in as the falcon and watch the cloud pour around you, then switch to Fish School and feel how the same three rules make a completely different body.")} </p>
        </div>

        {/* The rules */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 mb-6">
          <button
            onClick={() => setShowRules((s) => !s)}
            aria-expanded={showRules}
            aria-controls="flock-rules"
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-base font-semibold text-slate-100">{c("The only three rules")}</span>
            <span className="text-slate-500">{showRules ? '−' : '+'}</span>
          </button>
          {showRules && (
            <div id="flock-rules" className="space-y-2 border-t border-slate-800 px-5 py-4 text-sm leading-relaxed text-slate-300">
              <p>{c("Every bird looks at its neighbors every tick and applies three steering forces, weighted and summed:")}</p>
              <ul className="ml-1 space-y-2">
                <li>
                  <span className="text-rose-300">{c("Separation.")}</span> {c("If another bird is too close, steer directly away from it, inversely proportional to the distance. This keeps birds from colliding and maintains the characteristic gap that lets you see the individual shapes inside the cloud.")} </li>
                <li>
                  <span className="text-teal-300">{c("Alignment.")}</span> {c("Steer to match the average heading of nearby birds. This is what makes the cloud move as one body: the heading signal propagates through chains of neighbors in a few ticks, even when the cloud is much larger than any single bird's field of view.")} </li>
                <li>
                  <span className="text-violet-300">{c("Cohesion.")}</span> {c("Steer toward the average position of nearby birds. This is the glue that keeps the flock from dispersing: it acts like a soft restoring force pulling loners back toward the group.")} </li>
              </ul>
              <p className="text-slate-400"> {c("Craig Reynolds coined the word \"boids\" in 1986 for \"bird-oid objects.\" The three-rule model was published at SIGGRAPH 1987. Nothing in the rules says anything about a flock, a shape, or a direction: those emerge on their own, because alignment propagates faster than individual birds can deviate, and cohesion keeps the medium connected.")} </p>
            </div>
          )}
        </div>

        {/* Reframe */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-violet-300">{c("The reframe")}</h3>
          <p className="text-sm leading-relaxed text-slate-300"> {c("Watch the cloud for a few seconds and notice that you cannot pick the leader. There is not one. Every bird is a follower of its handful of neighbors, and every bird is a leader for the handful watching it. The shape you see, that single, self-healing, flowing body, is not decided anywhere. It falls out of three cheap rules applied locally by every bird at every tick. Nobody designed the shape, nobody holds it together, and nobody is trying to produce it.")} </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300"> {c("The STARFLAG project (Rome, 2006) photographed real starling murmurations from six synchronized cameras, tracked thousands of individual birds in three dimensions, and found that each starling responds to its")}{' '}
            <span className="text-slate-100">{c("seven topologically nearest neighbors")}</span>{c(", not the birds within a fixed distance. That is what the toggle above switches. In metric mode, a bird that drifts to the fringe of the flock loses connection and the cloud starts to leak. In topological mode each bird always has exactly seven contacts regardless of how the cloud stretches or compresses, so the alarm signal from a predator propagates without gaps at roughly 20 to 40 body-lengths per second.")} </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300"> {c("The same principle, different medium: the polarization wave that runs through a fish school is not a message passed fish-to-fish; it is a mechanical disturbance in the pressure wave each fish creates, sensed by the lateral line of its neighbors. A wildebeest stampede does not have a signal, it has a threshold each animal crosses when enough of its neighbors are running. A stock market crash is a flock obeying fear instead of velocity.")}{' '}
            <span className="text-slate-100"> {c("Coordination at scale nearly always turns out to be this: local rules, no global plan, and the shape falls out.")} </span>
          </p>
        </div>

        {/* History */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <h3 className="mb-3 text-base font-semibold text-slate-100">{c("The history")}</h3>
          <p className="text-sm leading-relaxed text-slate-400"> {c("Craig Reynolds, a computer animator at Symbolics, published \"Flocks, Herds and Schools: A Distributed Behavioral Model\" at SIGGRAPH 1987. He wanted to simulate a flock for a film sequence without choreographing every bird. The three rules, separation, alignment, cohesion, were enough, and the resulting simulations moved with a realism that stunned the audience. Reynolds called the agents \"boids.\" Tamas Vicsek formalized a statistical-physics version in 1995 (the Vicsek model) and showed the flock undergoes a phase transition: below an alignment threshold the cloud is disordered; above it the whole group moves as one body with long-range correlations, like a ferromagnet snapping into place. The STARFLAG experiment (Ballerini et al., Nature 2008) settled the topological-vs-metric debate for real starlings. Iain Couzin (Princeton) extended the framework to collective decision-making: a tiny informed minority (1-5%) can steer a large group without revealing their source, provided cohesion is strong enough. Today the same three-rule framework, extended with noise and obstacles, is used to design swarm robotics, model evacuation flows, and describe markets.")} </p>
        </div>

        {/* Share + back */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCopy}
            className="flex-1 rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            {copied ? c("✓ Copied") : c("Share your flock")}
          </button>
          <button
            onClick={() => jumpTo(PRESETS[0])}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          > {c("Back to Murmuration")} </button>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <a
            href="/experiments"
            className="text-sm text-slate-400 underline-offset-4 hover:text-violet-300 hover:underline"
          > {c("← back to all experiments")} </a>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'amber' | 'teal' | 'violet';
}) {
  const valueClass =
    accent === 'amber' ? 'text-amber-300'
    : accent === 'teal' ? 'text-teal-300'
    : accent === 'violet' ? 'text-violet-300'
    : 'text-slate-100';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className={`break-all font-mono text-base font-bold tabular-nums ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
