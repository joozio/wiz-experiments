'use client';

// Wave: a floodlit stadium of two thousand pixel fans. Start a Mexican wave with your thumb and
// keep it going round.
//
// The crowd is an excitable medium on a 10 x 200 ring. A swipe stands fans up; enough of them
// together and the neighbours catch it. Every stand tires a fan, a well placed swipe takes some of
// that back, and every wave dies in the end. The sim between SIM BEGIN and SIM END is plain typed
// code with no DOM, so experiments/weekly/2026-W43/production/check.mjs runs the exact same lines
// in Node to hold the tuning and the exploit ceilings.
//
// Static export: first render is the empty night plus the scorebug and nothing else. The match
// seed, every timer and localStorage live in mount effects only.

import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';

// SIM BEGIN
const ROWS = 10;
const COLS = 200;
const NF = ROWS * COLS;
const ROWNAMES = 'ABCDEFGHJK';

const PARAMS = {
  theta: 2.5, w1: 1.0, w2: 0.7, w3: 0.4, wb: 0.15, r1: 0.7, r2: 0.4,
  tau: 0.08, tUp: 0.6, tRef: 2.4, fat: 0.15, pumpKeep: 0.6, outer: 0.12, away: 1.7,
  brushK: 2.2, nRef: 14, joinAhead: 16, zeroW: 0.3, confN: 75, confP: 2, edgeNorm: 1,
  // Crowd relief. A pumped fan hands the wave a lift worth hPer for every stand-worth of
  // fatigue the pump actually took back, so a stroke over a fresh crowd (the stroke that
  // starts the wave) earns nothing and a stroke over a tired one earns the most. Flat per-fan
  // lift paid a starting swipe a free first lap, which is how untouched waves ran past three.
  hPer: 0.011, hTau: 12, hMax: 0.8,
  // a stroke forces at most this many columns, so a thumb held down cannot carry the wave round
  strokeCap: 30,
  // a wave takes relief from a pump at most this often (seconds)
  pumpGap: 3,
  // a fan this tired (after any relief) no longer stands for the brush either
  forceMax: 1.0,
  // the counted front moves at most this fast (seats a second); the band itself is free
  vMax: 28,
};
type Params = typeof PARAMS;

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const wrapC = (c: number) => ((c % COLS) + COLS) % COLS;
// signed ring offset in [-100, 100)
const ringOff = (k: number) => { const w = wrapC(k); return w >= COLS / 2 ? w - COLS : w; };
const sectionOf = (c: number) => Math.floor(wrapC(c) / 10) + 1;
const seatName = (i: number) => {
  const r = Math.floor(i / COLS), c = i % COLS;
  return { row: ROWNAMES[r], section: sectionOf(c), code: ROWNAMES[r] + ((c % 10) + 1) };
};

type Layout = ReturnType<typeof makeLayout>;

// A discorectangle, long axis along the longer side of the viewport.
function makeLayout(W: number, H: number) {
  const portrait = H >= W;
  const pitch = Math.max(8, Math.min(16, 0.023 * Math.min(W, H)));
  let Ro: number, Ls: number, cx: number, cy: number;
  if (portrait) {
    Ro = (W - 20) / 2; const long = H - 72; Ls = Math.max(0, long - 2 * Ro);
    cx = W / 2; cy = 56 + long / 2;
  } else {
    Ro = (H - 72) / 2; const long = W - 32; Ls = Math.max(0, long - 2 * Ro);
    cx = W / 2; cy = 56 + Ro;
  }
  const Ri = Ro - ROWS * pitch;
  const Rm = Ri + (ROWS / 2) * pitch;
  const Pm = 2 * Ls + 2 * Math.PI * Rm;
  const b1 = (Math.PI * Rm) / 2, b2 = b1 + Ls, b3 = b2 + Math.PI * Rm, b4 = b3 + Ls;
  // local frame: u across, v along the long axis (down). Landscape rotates it.
  const toScr = (u: number, v: number): [number, number] => (portrait ? [cx + u, cy + v] : [cx - v, cy + u]);
  const vecScr = (u: number, v: number): [number, number] => (portrait ? [u, v] : [-v, u]);
  const fromScr = (x: number, y: number): [number, number] => (portrait ? [x - cx, y - cy] : [y - cy, -(x - cx)]);
  // centre (u, v), radial (ru, rv) and tangent (tu, tv) at arclength s on the middle row
  const colFrame = (s: number): number[] => {
    if (s < b1) { const a = -Math.PI / 2 + s / Rm; return [0, -Ls / 2, Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)]; }
    if (s < b2) return [0, -Ls / 2 + (s - b1), 1, 0, 0, 1];
    if (s < b3) { const a = (s - b2) / Rm; return [0, Ls / 2, Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)]; }
    if (s < b4) return [0, Ls / 2 - (s - b3), -1, 0, 0, -1];
    const a = Math.PI + (s - b4) / Rm; return [0, -Ls / 2, Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)];
  };
  const fx = new Float32Array(NF), fy = new Float32Array(NF);
  const tx = new Float32Array(COLS), ty = new Float32Array(COLS);
  for (let c = 0; c < COLS; c++) {
    const [u0, v0, ru, rv, tu, tv] = colFrame(((c + 0.5) / COLS) * Pm);
    const [a, b] = vecScr(tu, tv); tx[c] = a; ty[c] = b;
    for (let r = 0; r < ROWS; r++) {
      const rad = Ri + (r + 0.5) * pitch;
      const [x, y] = toScr(u0 + ru * rad, v0 + rv * rad);
      fx[r * COLS + c] = x; fy[r * COLS + c] = y;
    }
  }
  // screen point to ring coordinates
  const locate = (x: number, y: number) => {
    const [u, v] = fromScr(x, y);
    let s: number, d: number;
    if (Math.abs(v) <= Ls / 2) {
      d = Math.abs(u);
      s = u >= 0 ? b1 + (v + Ls / 2) : b3 + (Ls / 2 - v);
    } else {
      const top = v < 0, vc = top ? -Ls / 2 : Ls / 2;
      d = Math.hypot(u, v - vc);
      const a = Math.atan2(v - vc, u);
      if (top) s = a >= -Math.PI / 2 ? (a + Math.PI / 2) * Rm : b4 + (a + Math.PI) * Rm;
      else s = b2 + Math.max(0, a) * Rm;
    }
    return { d, c: wrapC((s / Pm) * COLS - 0.5), inStands: d >= Ri && d <= Ro };
  };
  // screen point on the ring at float column c, float row rowF
  const at = (c: number, rowF: number): [number, number] => {
    const [u0, v0, ru, rv] = colFrame(((((c + 0.5) / COLS) % 1) + 1) % 1 * Pm);
    const rad = Ri + (rowF + 0.5) * pitch;
    return toScr(u0 + ru * rad, v0 + rv * rad);
  };
  return { W, H, portrait, pitch, Ro, Ri, Rm, Ls, cx, cy, fx, fy, tx, ty, locate, at, toScr };
}

type Snap = { st: Uint8Array; tt: Float32Array };
type Wave = {
  id: number; d: number; start: number; front: number; reach: number; ff: number; up: number; standUps: number;
  starters: number; stroke: number; alive: boolean; merged: boolean; H: number; lastPump: number;
  passes: Int32Array; inPass: Uint8Array; peakUp: number; snap: Snap | null; laps: number;
  deathCol: number; collided: boolean; died: number;
};
type Stroke = { id: number; wid: number; n: number; cols: Set<number>; capped: boolean; pumped: Map<number, boolean> };
type SimEvent = { type: 'fizzle' | 'dead' | 'end' | 'merge'; wave?: Wave; n?: number; t: number };
type Kind = 'sleeper' | 'hotdogs' | 'filming' | 'wrongend' | 'exhausted';
type Best = {
  wave: Wave; laps: number; culprit: number; kind: Kind; k: number; passes: number; nnnn: string;
  seat: ReturnType<typeof seatName>; deathSection: number;
};
type Sim = ReturnType<typeof makeSim>;

function makeSim(seed: number, over?: Partial<Params>) {
  const P: Params = { ...PARAMS, ...(over || {}) };
  const rnd = mulberry32(seed >>> 0);
  // 0 seated, 1 up, 2 resting
  const st = new Uint8Array(NF), tt = new Float32Array(NF);
  const pend = new Float32Array(NF).fill(-1), pendD = new Int8Array(NF), pendW = new Int32Array(NF);
  const dir = new Int8Array(NF), wid = new Int32Array(NF), phi = new Float32Array(NF);
  const theta = new Float32Array(NF), stands = new Uint16Array(NF), emit = new Float32Array(NF).fill(1);
  const forced = new Uint8Array(NF);
  const head = new Uint8Array(NF), refType = new Int8Array(NF).fill(-1), away = new Uint8Array(NF);
  const sP = new Float32Array(NF), sN = new Float32Array(NF), sZ = new Float32Array(NF);
  const bW = new Float32Array(NF), bId = new Int32Array(NF);
  // the away end moves with the seed (Sections 14 to 16, lower left in portrait), so waves do not
  // all die in the same place. 12 and 13 sit right beside the thumb zone and killed a third of
  // clockwise starts there, which is the first thing a visitor tries.
  const awaySection = 14 + Math.floor(rnd() * 3);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    let keen = 0.85 + 0.4 * rnd(); if (r >= 7) keen += P.outer;
    let th = P.theta * keen;
    if (sectionOf(c) === awaySection) { th *= P.away; away[i] = 1; }
    theta[i] = th; head[i] = Math.floor(rnd() * 4);
  }
  const refusers: number[] = [];
  while (refusers.length < P.nRef) {
    const i = Math.floor(rnd() * NF);
    if (refusers.includes(i)) continue;
    let type = Math.floor(rnd() * 4);
    if (type === 3 && away[i]) type = 0;
    refusers.push(i); refType[i] = type; theta[i] = Infinity;
  }
  const waves = new Map<number, Wave>();
  const events: SimEvent[] = [];
  let nextId = 1, time = 0, strokeSeq = 0, ended = false;
  let best: Best | null = null;
  let upCount = 0;

  const RF = [1, P.r1, P.r2], WF = [P.w1, P.w2, P.w3];
  // edge rows see one side of the row kernel only; scale them up to the centre row's mass
  const rowNorm = new Float32Array(ROWS);
  for (let r = 0; r < ROWS; r++) {
    let m = 0;
    for (let dr = -2; dr <= 2; dr++) if (r + dr >= 0 && r + dr < ROWS) m += RF[Math.abs(dr)];
    rowNorm[r] = P.edgeNorm ? (1 + 2 * P.r1 + 2 * P.r2) / m : 1;
  }
  const conf = new Map<number, number>(), lift = new Map<number, number>();
  const contacts: [number, number][] = [];

  const newWave = (c: number, d: number, stroke: number): Wave => {
    const w: Wave = {
      id: nextId++, d, start: c, front: c, reach: c, ff: c, up: 0, standUps: 0, starters: 0, stroke, alive: true,
      merged: false, H: 0, lastPump: -Infinity, passes: new Int32Array(P.nRef), inPass: new Uint8Array(P.nRef),
      peakUp: 0, snap: null, laps: 0, deathCol: 0, collided: false, died: 0,
    };
    waves.set(w.id, w); return w;
  };
  // Only caught fans move the band's reach. A forced fan widens how far ahead the next caught fan
  // may be and still count, so a pump laid ahead of the band does not orphan the count. The
  // counted front then follows the reach at no more than vMax, so a thumb dragging the band round
  // faster than a crowd can carry it does not turn into laps.
  const advanceFront = (w: Wave, c: number) => {
    if (!w.d) return;
    const k = ringOff((c - wrapC(Math.round(w.reach))) * w.d);
    const lead = (w.ff - w.reach) * w.d;
    if (k > 0 && k < Math.max(24, lead + 24)) w.reach += w.d * k;
  };
  const noteForced = (w: Wave, c: number) => {
    if (!w.d) return;
    const k = ringOff((c - wrapC(Math.round(w.reach))) * w.d);
    if (k > 0 && (w.reach + w.d * k - w.ff) * w.d > 0) w.ff = w.reach + w.d * k;
  };
  const stand = (i: number, d: number, id: number, strokeId: number, isForced: boolean) => {
    st[i] = 1; tt[i] = 0; dir[i] = d; wid[i] = id; stands[i]++; phi[i] += P.fat; pend[i] = -1;
    forced[i] = isForced ? 1 : 0;
    const w = waves.get(id);
    if (!w) return;
    w.up++; w.standUps++;
    if (!w.d && d) w.d = d;
    if (isForced) { if (strokeId === w.stroke) w.starters++; noteForced(w, i % COLS); }
    else advanceFront(w, i % COLS);
  };
  const addS = (r: number, c: number, wt: number, d: number, id: number, fwd: boolean) => {
    const j = r * COLS + wrapC(c);
    if (st[j] !== 0) {
      // a wave running into the band or tail of another one going the same way
      if (fwd && d && wid[j] > 0 && wid[j] !== id && dir[j] === d) contacts.push([id, wid[j]]);
      return;
    }
    wt *= rowNorm[r];
    if (d > 0) sP[j] += wt; else if (d < 0) sN[j] += wt; else sZ[j] += wt;
    if (wt > bW[j]) { bW[j] = wt; bId[j] = id; }
  };

  const merge = (a: Wave, b: Wave) => {
    const surv = a.laps > b.laps || (a.laps === b.laps && a.standUps >= b.standUps) ? a : b;
    const lose = surv === a ? b : a, d = surv.d;
    // the survivor's reach becomes whichever of the two is further ahead; its counted front follows
    const f0 = surv.reach, fc = wrapC(Math.round(f0));
    const g = ringOff((wrapC(Math.round(lose.reach)) - fc) * d);
    const gf = ringOff((wrapC(Math.round(lose.ff)) - fc) * d);
    if (g > 0) surv.reach = f0 + d * g;
    if ((f0 + d * gf - surv.ff) * d > 0) surv.ff = f0 + d * gf;
    surv.up += lose.up; surv.standUps += lose.standUps;
    surv.H = Math.max(surv.H, lose.H); surv.lastPump = Math.max(surv.lastPump, lose.lastPump);
    for (let q = 0; q < P.nRef; q++) { surv.passes[q] += lose.passes[q]; surv.inPass[q] |= lose.inPass[q]; }
    if (lose.peakUp > surv.peakUp) { surv.peakUp = lose.peakUp; surv.snap = lose.snap; }
    for (let i = 0; i < NF; i++) {
      if (wid[i] === lose.id) wid[i] = surv.id;
      if (pend[i] >= 0 && pendW[i] === lose.id) pendW[i] = surv.id;
    }
    lose.alive = false; lose.merged = true; lose.up = 0; lose.died = time;
    events.push({ type: 'merge', wave: surv, t: time });
  };

  const newStroke = (): Stroke => ({ id: ++strokeSeq, wid: 0, n: 0, cols: new Set(), capped: false, pumped: new Map() });

  // Force one fan up by an input. Returns true if they stood.
  const force = (i: number, d: number, stroke: Stroke) => {
    if (st[i] === 1 || theta[i] === Infinity || ended || stroke.capped) return false;
    const c = i % COLS;
    // once a stroke has covered strokeCap columns it is spent, including on a second pass
    if (!stroke.cols.has(c) && stroke.cols.size >= P.strokeCap) { stroke.capped = true; return false; }
    let id = 0;
    // join any standing fan of a live wave within 4 columns, else a live wave whose front is just behind
    for (let dc = -4; dc <= 4 && !id; dc++) for (let r = 0; r < ROWS && !id; r++) {
      const j = r * COLS + wrapC(c + dc);
      const w = st[j] === 1 && wid[j] > 0 ? waves.get(wid[j]) : undefined;
      if (w && w.alive) id = w.id;
    }
    if (!id && P.joinAhead > 0) {
      for (const w of waves.values()) {
        if (!w.alive || !w.d || (d && d !== w.d)) continue;
        if (wrapC((c - wrapC(Math.round(w.reach))) * w.d) <= P.joinAhead) { id = w.id; break; }
      }
    }
    if (!id) {
      const sw = stroke.wid ? waves.get(stroke.wid) : undefined;
      if (sw && sw.alive) id = sw.id;
      else { id = newWave(c, d, stroke.id).id; stroke.wid = id; }
    }
    if (d === 0) {
      // a stroke across the rows copies a standing neighbour's direction
      for (let dc = -2; dc <= 2 && !d; dc++) for (let dr = -1; dr <= 1 && !d; dr++) {
        const r = Math.floor(i / COLS) + dr; if (r < 0 || r >= ROWS) continue;
        const j = r * COLS + wrapC(c + dc); if (st[j] === 1 && dir[j]) d = dir[j];
      }
    }
    const w = waves.get(id);
    let relief = true;
    if (w && w.stroke !== stroke.id) {
      // a pump: relief at most once per pumpGap per wave, decided once per stroke
      let ok = stroke.pumped.get(id);
      if (ok === undefined) { ok = time - w.lastPump >= P.pumpGap; if (ok) w.lastPump = time; stroke.pumped.set(id, ok); }
      relief = ok;
    }
    if ((relief ? phi[i] * P.pumpKeep : phi[i]) > P.forceMax) return false;
    if (relief) {
      const back = phi[i] * (1 - P.pumpKeep); phi[i] -= back;
      if (w) w.H = Math.min(P.hMax, w.H + (P.hPer * back) / P.fat);
    }
    stroke.cols.add(c);
    stand(i, d, id, stroke.id, true);
    return true;
  };

  // A brush in screen space: every seated or resting fan inside the radius stands. The direction
  // is the motion along the ring tangent at the brush centre, one answer per sample.
  const brush = (L: Layout, x: number, y: number, mx: number, my: number, stroke: Stroke) => {
    const R = P.brushK * L.pitch, R2 = R * R;
    const m = Math.hypot(mx, my);
    let d = 0;
    if (m > 0) {
      const c = Math.round(L.locate(x, y).c) % COLS;
      const t = (mx * L.tx[c] + my * L.ty[c]) / m;
      if (Math.abs(t) >= 0.3) d = t > 0 ? 1 : -1;
    }
    let n = 0;
    for (let i = 0; i < NF; i++) {
      const dx = L.fx[i] - x, dy = L.fy[i] - y;
      if (dx * dx + dy * dy > R2 || st[i] === 1) continue;
      if (force(i, d, stroke)) n++;
    }
    stroke.n += n; return n;
  };
  // a pointer segment, sampled every 4px so a fast swipe never skips a seat
  const brushSeg = (L: Layout, x0: number, y0: number, x1: number, y1: number, stroke: Stroke) => {
    const mx = x1 - x0, my = y1 - y0, n = Math.max(1, Math.ceil(Math.hypot(mx, my) / 4));
    let k = 0;
    for (let s = 0; s <= n; s++) k += brush(L, x0 + (mx * s) / n, y0 + (my * s) / n, mx, my, stroke);
    return k;
  };

  // scripted self-demo stand: no emission, no wave, no fatigue
  const demoStand = (i: number) => {
    if (st[i] !== 0 || theta[i] === Infinity) return;
    st[i] = 1; tt[i] = 0; dir[i] = 0; wid[i] = 0; emit[i] = 0; forced[i] = 0;
  };

  const ups = new Int32Array(NF);
  const step = (dt: number) => {
    time += dt;
    for (let i = 0; i < NF; i++) {
      if (st[i] === 1) {
        tt[i] += dt;
        if (tt[i] >= P.tUp) { st[i] = 2; tt[i] = 0; const w = waves.get(wid[i]); if (w && w.alive) w.up--; }
      } else if (st[i] === 2) {
        tt[i] += dt; if (tt[i] >= P.tRef) { st[i] = 0; tt[i] = 0; emit[i] = 1; }
      }
    }
    sP.fill(0); sN.fill(0); sZ.fill(0); bW.fill(0);
    let nu = 0;
    for (let i = 0; i < NF; i++) if (st[i] === 1) ups[nu++] = i;
    upCount = nu;
    for (const w of waves.values()) {
      if (w.alive && w.d) {
        const gap = (w.reach - w.front) * w.d;
        if (gap > 0) w.front += w.d * Math.min(gap, P.vMax * dt);
        w.laps = Math.abs(w.front - w.start) / COLS;
      }
      w.H *= Math.exp(-dt / P.hTau); lift.set(w.id, w.H);
      // crowd confidence: a wave passes stimulus on in proportion to how many of it are up
      conf.set(w.id, P.confN > 0 ? Math.min(1, Math.pow(Math.max(0, w.up) / P.confN, P.confP)) : 1);
    }
    contacts.length = 0;
    for (let k = 0; k < nu; k++) {
      const i = ups[k];
      const e = emit[i] * (wid[i] > 0 ? conf.get(wid[i]) || 0 : 1); if (!e) continue;
      const r = Math.floor(i / COLS), c = i % COLS, d = dir[i], id = wid[i];
      for (let dr = -2; dr <= 2; dr++) {
        const rr = r + dr; if (rr < 0 || rr >= ROWS) continue;
        const rf = RF[Math.abs(dr)] * e;
        if (d) {
          for (let q = 1; q <= 3; q++) addS(rr, c + d * q, WF[q - 1] * rf, d, id, true);
          for (let q = 1; q <= 2; q++) addS(rr, c - d * q, P.wb * rf, d, id, false);
        } else {
          for (let q = 1; q <= 2; q++) { addS(rr, c + q, P.zeroW * rf, 0, id, false); addS(rr, c - q, P.zeroW * rf, 0, id, false); }
        }
      }
    }
    for (const [ia, ib] of contacts) {
      const a = waves.get(ia), b = waves.get(ib);
      if (a && b && a !== b && a.alive && b.alive && a.d && a.d === b.d) merge(a, b);
    }
    for (let j = 0; j < NF; j++) {
      if (st[j] !== 0) continue;
      if (pend[j] < 0) {
        const s = sP[j] + sN[j] + sZ[j];
        if (s > 0 && s >= theta[j] * (1 + Math.max(0, phi[j] - (lift.get(bId[j]) || 0)))) {
          pend[j] = P.tau; pendW[j] = bId[j];
          pendD[j] = sP[j] > sN[j] ? 1 : sN[j] > sP[j] ? -1 : 0;
        }
      }
      if (pend[j] >= 0) {
        pend[j] -= dt;
        if (pend[j] <= 0) {
          const w = waves.get(pendW[j]);
          if (w && w.alive) stand(j, pendD[j], pendW[j], 0, false); else pend[j] = -1;
        }
      }
    }
    // passes: a refuser sitting while at least 3 of the 4 nearest same-row neighbours are up
    for (let q = 0; q < refusers.length; q++) {
      const i = refusers[q], r = Math.floor(i / COLS), c = i % COLS;
      const ids: number[] = [];
      for (const dc of [-2, -1, 1, 2]) { const j = r * COLS + wrapC(c + dc); if (st[j] === 1 && wid[j] > 0) ids.push(wid[j]); }
      for (const w of waves.values()) {
        if (!w.alive) continue;
        let n = 0; for (const x of ids) if (x === w.id) n++;
        if (n >= 3) { if (!w.inPass[q]) { w.passes[q]++; w.inPass[q] = 1; } } else w.inPass[q] = 0;
      }
    }
    // peaks and deaths
    for (const w of waves.values()) {
      if (!w.alive) continue;
      if (w.up > w.peakUp) { w.peakUp = w.up; w.snap = { st: st.slice(), tt: tt.slice() }; }
      if (w.up > 0) continue;
      let pending = false;
      for (let j = 0; j < NF && !pending; j++) if (pend[j] >= 0 && pendW[j] === w.id) pending = true;
      if (pending) continue;
      w.alive = false; w.died = time; w.deathCol = wrapC(Math.round(w.reach));
      // two fronts going opposite ways within 10 columns of each other, now or in the last 1.5s
      for (const o of waves.values()) {
        if (o === w || o.merged || !o.d || !w.d || o.d === w.d) continue;
        const gap = Math.min(wrapC(o.reach - w.reach), wrapC(w.reach - o.reach));
        if (gap <= 10 && (o.alive || time - o.died < 1.5)) { w.collided = true; o.collided = true; }
      }
      events.push(w.laps < 0.5 ? { type: 'fizzle', wave: w, n: w.standUps, t: time } : { type: 'dead', wave: w, t: time });
      let anyAlive = false; for (const o of waves.values()) if (o.alive) anyAlive = true;
      if (!anyAlive) {
        let top = 0; for (const o of waves.values()) if (!o.merged) top = Math.max(top, o.laps);
        if (top >= 0.5) { ended = true; best = resolve(); events.push({ type: 'end', t: time }); }
      }
    }
  };

  const resolve = (): Best | null => {
    let bw: Wave | null = null;
    for (const w of waves.values()) {
      if (w.merged) continue;
      if (!bw || w.laps > bw.laps || (w.laps === bw.laps && w.standUps > bw.standUps)) bw = w;
    }
    if (!bw) return null;
    let q = -1, bp = 0, bd = 1e9;
    for (let k = 0; k < refusers.length; k++) {
      const p = bw.passes[k]; if (!p) continue;
      const c = refusers[k] % COLS, dist = Math.min(wrapC(c - bw.deathCol), wrapC(bw.deathCol - c));
      if (p > bp || (p === bp && dist < bd)) { q = k; bp = p; bd = dist; }
    }
    let culprit: number, kind: Kind, k = 0;
    if (q >= 0) {
      culprit = refusers[q];
      kind = (['sleeper', 'hotdogs', 'filming', 'wrongend'] as const)[refType[culprit]];
    } else {
      let bphi = -1; culprit = bw.deathCol;
      for (let r = 0; r < ROWS; r++) {
        const i = r * COLS + bw.deathCol;
        if (phi[i] > bphi && theta[i] !== Infinity) { bphi = phi[i]; culprit = i; }
      }
      kind = 'exhausted'; k = stands[culprit];
    }
    const laps = Math.round(bw.laps * 10) / 10;
    const cr = Math.floor(culprit / COLS), cc = culprit % COLS;
    const nnnn = String((bw.standUps * 31 + Math.round(laps * 10) * 7 + cr * 200 + cc) % 10000).padStart(4, '0');
    return { wave: bw, laps, culprit, kind, k, passes: bp, nnnn, seat: seatName(culprit), deathSection: sectionOf(bw.deathCol) };
  };

  return {
    P, st, tt, dir, wid, phi, forced, stands, head, refType, away, awaySection, refusers, waves, events,
    newStroke, force, brush, brushSeg, demoStand, step, resolve,
    get time() { return time; }, get ended() { return ended; }, get best() { return best; }, get upCount() { return upCount; },
  };
}
// SIM END

// ---------- drawing ----------

const NIGHT = '#05060a';
const HOME = { seat: '#3a2f12', up: '#ffd23f', arm: '#fff3c4', rest0: '#b08a24' };
const AWAY = { seat: '#12333b', up: '#36e2ff', arm: '#d6fbff', rest0: '#2b93a8' };
const HEADS = ['#2a2230', '#3b2c25', '#4a3a2a', '#1c1c24'];
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const ramp = (a: string, b: string, n: number) => {
  const A = hex(a), B = hex(b);
  return Array.from({ length: n }, (_, k) => { const t = k / (n - 1); return `rgb(${A.map((x, i) => Math.round(x + (B[i] - x) * t)).join(',')})`; });
};
type Ramp = { up: string[]; rest: string[] };
const RAMPS: { home: Ramp; away: Ramp } = {
  home: { up: ramp(HOME.seat, HOME.up, 16), rest: ramp(HOME.rest0, HOME.seat, 16) },
  away: { up: ramp(AWAY.seat, AWAY.up, 16), rest: ramp(AWAY.rest0, AWAY.seat, 16) },
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

type Ctx = CanvasRenderingContext2D;

function glowSprite(color: string, r: number, alpha: number) {
  const c = document.createElement('canvas'); c.width = c.height = r * 4;
  const g = c.getContext('2d') as Ctx; const [R, G, B] = hex(color);
  const gr = g.createRadialGradient(r * 2, r * 2, 0, r * 2, r * 2, r * 2);
  gr.addColorStop(0, `rgba(${R},${G},${B},${alpha})`); gr.addColorStop(1, `rgba(${R},${G},${B},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, r * 4, r * 4); return c;
}

// four towers just outside the bowl's corners, placed from the bowl, not the viewport
function towersOf(L: Layout): [number, number][] {
  const a = L.Ro * 0.8, b = L.Ls / 2 + L.Ro * 0.8;
  return [L.toScr(-a, -b), L.toScr(a, -b), L.toScr(-a, b), L.toScr(a, b)];
}

function bowlPath(g: Ctx, L: Layout, r: number) {
  g.beginPath();
  if (L.portrait) {
    g.arc(L.cx, L.cy - L.Ls / 2, r, Math.PI, 0); g.lineTo(L.cx + r, L.cy + L.Ls / 2);
    g.arc(L.cx, L.cy + L.Ls / 2, r, 0, Math.PI); g.closePath();
  } else {
    g.arc(L.cx + L.Ls / 2, L.cy, r, -Math.PI / 2, Math.PI / 2); g.lineTo(L.cx - L.Ls / 2, L.cy + r);
    g.arc(L.cx - L.Ls / 2, L.cy, r, Math.PI / 2, Math.PI * 1.5); g.closePath();
  }
}

// night, bowl, pitch and seats: everything that never moves except the lights
function paintBase(g: Ctx, L: Layout) {
  const { W, H } = L;
  g.fillStyle = NIGHT; g.fillRect(-W, -H, 3 * W, 3 * H);
  bowlPath(g, L, L.Ro + 2); g.fillStyle = '#0c0f18'; g.fill();
  bowlPath(g, L, L.Ri); g.fillStyle = '#0a0c12'; g.fill();
  // the pitch is sized from the inner radius so its corners clear the curved ends
  const half = L.Ri * 0.78, ext = Math.sqrt(L.Ri * L.Ri - half * half) - 8;
  const pw = 2 * half - 10, ph = L.Ls + 2 * ext;
  const [PW, PH] = L.portrait ? [pw, ph] : [ph, pw];
  const px = L.cx - PW / 2, py = L.cy - PH / 2;
  g.fillStyle = '#0b2a1b'; g.fillRect(px, py, PW, PH);
  g.fillStyle = '#0d3220';
  for (let k = 0; k < 12; k += 2) {
    if (L.portrait) g.fillRect(px, py + (k * PH) / 12, PW, PH / 12); else g.fillRect(px + (k * PW) / 12, py, PW / 12, PH);
  }
  g.strokeStyle = 'rgba(255,255,255,0.22)'; g.lineWidth = 1;
  g.strokeRect(px + 0.5, py + 0.5, PW - 1, PH - 1);
  g.beginPath();
  if (L.portrait) { g.moveTo(px, L.cy + 0.5); g.lineTo(px + PW, L.cy + 0.5); } else { g.moveTo(L.cx + 0.5, py); g.lineTo(L.cx + 0.5, py + PH); }
  g.stroke();
  g.beginPath(); g.arc(L.cx, L.cy, Math.min(PW, PH) * 0.17, 0, Math.PI * 2); g.stroke();
  if (L.portrait) {
    const bw = PW * 0.6, bh = PH * 0.13;
    g.strokeRect(L.cx - bw / 2 + 0.5, py + 0.5, bw, bh); g.strokeRect(L.cx - bw / 2 + 0.5, py + PH - bh - 0.5, bw, bh);
  } else {
    const bw = PH * 0.6, bh = PW * 0.13;
    g.strokeRect(px + 0.5, L.cy - bw / 2 + 0.5, bh, bw); g.strokeRect(px + PW - bh - 0.5, L.cy - bw / 2 + 0.5, bh, bw);
  }
  const k = L.pitch / 9;
  for (let i = 0; i < NF; i++) {
    g.fillStyle = Math.floor(i / COLS) % 2 ? '#18203a' : '#141a2e';
    g.fillRect(Math.round(L.fx[i] - 3.5 * k), Math.round(L.fy[i] - 3 * k), 7 * k, 6 * k);
  }
}

// one floodlight tower at a given strength (1 is fully on, the opening overshoots to 1.4)
function paintTower(g: Ctx, L: Layout, x: number, y: number, a: number) {
  if (a <= 0) return;
  const { W, H } = L, R = 0.7 * Math.min(W, H);
  g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(x, y, 0, x, y, R);
  gr.addColorStop(0, `rgba(255,246,214,${(0.1 * a).toFixed(3)})`); gr.addColorStop(1, 'rgba(255,246,214,0)');
  g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R);
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = Math.min(1, a); g.fillStyle = '#fffbe6'; g.fillRect(x - 3, y - 3, 6, 6); g.globalAlpha = 1;
}

// the scene with no lights (for the opening) and with all four on (every frame after it)
function paintStatic(L: Layout, dpr: number) {
  const mk = () => {
    const c = document.createElement('canvas'); c.width = Math.round(L.W * dpr); c.height = Math.round(L.H * dpr);
    const g = c.getContext('2d') as Ctx; g.scale(dpr, dpr); paintBase(g, L); return { c, g };
  };
  const base = mk(), full = mk();
  for (const [x, y] of towersOf(L)) paintTower(full.g, L, x, y, 1);
  return { base: base.c, full: full.c };
}

type Sprites = { glowY: HTMLCanvasElement; glowC: HTMLCanvasElement; glowW: HTMLCanvasElement };
type FanView = { st: Uint8Array; tt: Float32Array; forced: Uint8Array | null };

function drawFans(g: Ctx, S: Sim, L: Layout, v: FanView, fidget: Float64Array | null, now: number, reduced: boolean, glow: boolean, sp: Sprites) {
  const k = L.pitch / 9, tRef = S.P.tRef;
  const { st, tt, forced } = v;
  const { away, head, refType } = S;
  const ups: number[] = [];
  for (let i = 0; i < NF; i++) {
    const x = Math.round(L.fx[i]), y = Math.round(L.fy[i]);
    const isAway = away[i] === 1 || refType[i] === 3;
    const R = isAway ? RAMPS.away : RAMPS.home;
    const fid = fidget && fidget[i] > now ? k : 0;
    let lv = 0, shirt: string;
    if (st[i] === 1) {
      // fans the brush forced stand in 60ms and flash for a frame; caught fans take 120ms
      const f = forced && forced[i] === 1;
      lv = reduced ? 1 : easeOut(Math.min(1, tt[i] / (f ? 0.06 : 0.12)));
      shirt = f && tt[i] < 0.025 && !reduced ? (isAway ? AWAY.arm : HOME.arm) : R.up[Math.round(lv * 15)];
      ups.push(i);
    } else if (st[i] === 2) {
      const sit = reduced ? 1 : Math.min(1, tt[i] / 0.2); lv = 1 - sit * sit;
      shirt = lv > 0.02 ? R.up[Math.round(lv * 15)] : R.rest[Math.min(15, Math.round((tt[i] / tRef) * 15))];
    } else shirt = R.up[0];
    if (lv > 0.02) {
      g.fillStyle = shirt; g.fillRect(x - 2.5 * k, y - 1 * k, 5 * k, 4 * k);
      g.fillStyle = HEADS[head[i]]; g.fillRect(x - 1.5 * k + fid, y - (3 + lv) * k, 3 * k, 3 * k);
      const ah = 3 * lv * k; g.fillStyle = isAway ? AWAY.arm : HOME.arm;
      g.fillRect(x - 3.5 * k, y - 1 * k - ah, k, ah); g.fillRect(x + 2.5 * k, y - 1 * k - ah, k, ah);
    } else {
      g.fillStyle = shirt; g.fillRect(x - 2.5 * k, y + 0.5 * k, 5 * k, 2 * k);
      const t = refType[i];
      g.fillStyle = HEADS[head[i]]; g.fillRect(x - 1.5 * k + fid + (t === 0 ? k : 0), y - 2.5 * k, 3 * k, 3 * k);
      if (t === 0) { g.fillStyle = '#8a8fa3'; g.fillRect(x + 0.5 * k, y - 3.5 * k, k, k); }
      else if (t === 1) { g.fillStyle = '#ff8a3d'; g.fillRect(x - 3.5 * k, y + 0.5 * k, 2 * k, k); g.fillRect(x + 1.5 * k, y + 0.5 * k, 2 * k, k); }
      else if (t === 2) { g.fillStyle = '#e8f4ff'; g.fillRect(x - 0.5 * k, y - 4.5 * k, k, 2 * k); if (glow) g.drawImage(sp.glowW, x - 6 * k, y - 9.5 * k, 12 * k, 12 * k); }
    }
  }
  if (glow) {
    g.globalCompositeOperation = 'lighter';
    for (const i of ups) g.drawImage(away[i] || refType[i] === 3 ? sp.glowC : sp.glowY, L.fx[i] - 14 * k, L.fy[i] - 14 * k, 28 * k, 28 * k);
    g.globalCompositeOperation = 'source-over';
  }
  return ups.length;
}

// a hand drawn telestrator ellipse: 8% wobble, overshoots its start by 20 degrees
function telestrator(g: Ctx, x: number, y: number, rx: number, ry: number, p: number, lw: number) {
  const a0 = -2.2, span = (Math.PI * 2 + (20 * Math.PI) / 180) * p;
  g.strokeStyle = '#ffd23f'; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath();
  for (let a = 0; a <= span; a += 0.06) {
    const w = 1 + 0.08 * Math.sin(3 * a + 1) + 0.04 * (a / Math.PI);
    const px = x + Math.cos(a0 + a) * rx * w, py = y + Math.sin(a0 + a) * ry * w;
    if (a) g.lineTo(px, py); else g.moveTo(px, py);
  }
  g.stroke();
}

// label box beside the circle, kept on screen and inside the top band
function telestratorLabel(g: Ctx, x: number, y: number, r: number, code: string, aside: string, s: number, bounds: { w: number; h: number }, fonts: Fonts) {
  g.font = `${18 * s}px ${fonts.pixel}`;
  const w1 = g.measureText(code).width;
  g.font = `${11 * s}px ${fonts.mono}`;
  const w2 = g.measureText(aside).width;
  const bw = Math.max(w1, w2) + 14 * s, bh = 40 * s, gap = r + 16 * s;
  const right = x + gap + bw < bounds.w - 8 * s || x - gap - bw < 8 * s;
  let bx = right ? x + gap : x - gap - bw;
  bx = clamp(bx, 8 * s, bounds.w - 8 * s - bw);
  const by = clamp(y - r - bh - 4 * s, 52 * s, bounds.h - bh - 8 * s);
  const ax = right ? bx : bx + bw, ay = by + bh;
  g.strokeStyle = '#ffd23f'; g.lineWidth = 2 * s; g.lineCap = 'round';
  g.beginPath(); g.moveTo(ax, ay - 6 * s); g.lineTo(x + (right ? 0.6 : -0.6) * r, y - 0.7 * r); g.stroke();
  g.globalAlpha = 0.88; g.fillStyle = NIGHT; g.fillRect(bx, by, bw, bh); g.globalAlpha = 1;
  g.fillStyle = '#ffd23f'; g.fillRect(bx, by, 3 * s, bh);
  g.textBaseline = 'alphabetic';
  g.fillStyle = '#ffd23f'; g.font = `${18 * s}px ${fonts.pixel}`; g.fillText(code, bx + 9 * s, by + 18 * s);
  g.fillStyle = '#f4f1e8'; g.font = `${11 * s}px ${fonts.mono}`; g.fillText(aside, bx + 9 * s, by + 33 * s);
}

type Fonts = { pixel: string; mono: string };
type Card = {
  nnnn: string; head: string; stat: string; death: string; culprit: string; code: string; footer: string;
  anti: string; copy: string; aside: string; laps: string;
};

const fizzleLine = (n: number) => (n < 25
  ? `${n} people stood up. Alone.`
  : n < 60 ? `${n} people stood up. The rest of the stadium pretended not to see.`
    : `${n} people stood up. So close. They are sitting down very slowly.`);
const ASIDE: Record<Kind, string> = {
  sleeper: 'asleep', hotdogs: 'a hot dog in each hand', filming: 'filming it instead', wrongend: 'away fan, wrong end', exhausted: 'done',
};
const footerLine = (l: number) => (l < 1 ? "Didn't make it round. The far end never knew."
  : l < 3 ? 'Respectable. The stewards noticed.'
    : l < 6 ? 'The stewards have stopped pretending not to enjoy it.' : 'This crowd will tell their grandchildren. Badly.');

function cardOf(b: Best): Card {
  const w = b.wave, code = b.seat.code, s = b.deathSection;
  const laps = b.laps.toFixed(1), su = w.standUps.toLocaleString('en-US');
  return {
    nnnn: b.nnnn, laps, code, aside: ASIDE[b.kind],
    head: `Wave ${b.nnnn}.`,
    stat: `${laps} laps. ${su} stand-ups. Started by ${w.starters} fans.`,
    death: w.collided ? `Ran into another wave in Section ${s}. Both died.` : `Died in Section ${s}.`,
    culprit: b.kind === 'exhausted'
      ? `It died at Seat ${code}, who had stood up ${b.k} times. ${code} is done.`
      : `Seat ${code} never stood up. ${code}, we saw that.`,
    footer: footerLine(b.laps),
    anti: w.d === -1 ? 'Anticlockwise. Real ones mostly go clockwise.' : '',
    copy: `Wave ${b.nnnn}. ${laps} laps, ${su} stand-ups, started by ${w.starters} fans. ${b.kind === 'exhausted' ? `Seat ${code} stood up ${b.k} times. ${code} is done.` : `Seat ${code} never stood up.`} wiz.jock.pl/experiments/wave`,
  };
}

// Fit a line of mono text into maxW by shrinking, never below minPx; returns the size used.
function fitFont(g: Ctx, text: string, family: string, px: number, minPx: number, maxW: number) {
  let s = px;
  for (; s > minPx; s -= 1) { g.font = `${s}px ${family}`; if (g.measureText(text).width <= maxW) return s; }
  g.font = `${minPx}px ${family}`; return minPx;
}

// Break a line into as many lines as it needs at this size. The card band grows to hold them,
// which is how every line stays at reading size instead of being squeezed into a fixed strip.
function wrapMono(g: Ctx, text: string, family: string, px: number, maxW: number) {
  g.font = `${px}px ${family}`;
  const out: string[] = [];
  let cur = '';
  for (const word of text.split(' ')) {
    const next = cur ? `${cur} ${word}` : word;
    if (!cur || g.measureText(next).width <= maxW) cur = next;
    else { out.push(cur); cur = word; }
  }
  if (cur) out.push(cur);
  return out;
}

const CITATION = 'Speed and width as measured by Farkas, Helbing and Vicsek, Nature 2002.';

// The 1080 x 1350 card: the band is measured first, then the stadium is re-rendered from the best
// wave's peak into whatever height is left. Nothing on the card reads below 32px, which is the size
// that survives a 1080px image shown 390px wide in a feed.
function renderCard(S: Sim, b: Best, card: Card, fonts: Fonts, sp: Sprites): Promise<Blob | null> {
  const C = document.createElement('canvas'); C.width = 1080; C.height = 1350;
  const g = C.getContext('2d') as Ctx;
  g.imageSmoothingEnabled = false;
  const X = 44, MAXW = 1080 - 2 * X;
  const BODY = 34, MINPX = 32, LEAD = 42, CITE = 32, CITELEAD = 38;
  // lay the band out before anything is painted, so the stadium knows how much height it has
  type Row = { text: string; px: number; min: number; color: string; code?: string };
  const rows: Row[] = [];
  const push = (text: string, color: string, code?: string) => {
    for (const line of wrapMono(g, text, fonts.mono, BODY, MAXW)) rows.push({ text: line, px: BODY, min: MINPX, color, code });
  };
  push(card.stat, '#f4f1e8');
  push(card.death, '#f4f1e8');
  push(card.culprit, '#f4f1e8', card.code);
  push(card.footer, '#a9adba');
  if (card.anti) push(card.anti, '#a9adba');
  const cite = wrapMono(g, CITATION, fonts.mono, CITE, MAXW);
  const headH = 54;
  const bandH = 28 + headH + 18 + rows.length * LEAD + 12 + cite.length * CITELEAD + 16 + CITE + 24;
  const topH = 1350 - bandH;

  // The bowl lies across the card on its long axis, so the fans are drawn at full seat pitch and
  // the frame has no dead side margins. The fans' states live on the grid, not on the geometry.
  // CARD_M keeps the telestrator circle and the band's glow off the edge, wherever they land.
  const CARD_M = 44;
  const LC = makeLayout(1080 - 2 * CARD_M, topH - 2 * CARD_M);
  const dx = CARD_M, dy = CARD_M + Math.round((topH - 2 * CARD_M) / 2 - LC.cy);
  g.fillStyle = NIGHT; g.fillRect(0, 0, 1080, topH);
  g.save();
  g.beginPath(); g.rect(0, 0, 1080, topH); g.clip();
  g.translate(dx, dy);
  paintBase(g, LC);
  for (const [x, y] of towersOf(LC)) paintTower(g, LC, x, y, 1);
  const snap = b.wave.snap || { st: S.st, tt: S.tt };
  drawFans(g, S, LC, { st: snap.st, tt: snap.tt, forced: null }, null, 0, true, true, sp);
  g.restore();
  // culprit, circled at card scale
  const ccx = LC.fx[b.culprit] + dx, ccy = LC.fy[b.culprit] + dy;
  const r = LC.pitch * 1.7 + 10;
  telestrator(g, ccx, ccy, r * 1.15, r, 1, 6);
  telestratorLabel(g, ccx, ccy, r, card.code, card.aside, 3, { w: 1080, h: topH }, fonts);
  // scorebug, top left: WAVE NNNN | LAPS x.x
  g.save();
  g.translate(36, 34); g.transform(1, 0, -Math.tan((12 * Math.PI) / 180), 1, 0, 0);
  g.font = `40px ${fonts.pixel}`;
  const t1 = `WAVE ${card.nnnn}`, t2 = `LAPS ${card.laps}`;
  const w1 = g.measureText(t1).width + 40, w2 = g.measureText(t2).width + 40;
  g.fillStyle = '#ffd23f'; g.fillRect(0, 0, w1, 64); g.fillStyle = '#11131c'; g.fillRect(w1, 0, w2, 64);
  g.textBaseline = 'middle';
  g.fillStyle = NIGHT; g.fillText(t1, 20, 34); g.fillStyle = '#f4f1e8'; g.fillText(t2, w1 + 20, 34);
  g.restore();
  // the band
  g.fillStyle = '#0b0c12'; g.fillRect(0, topH, 1080, bandH);
  g.fillStyle = '#ffd23f'; g.fillRect(0, topH, 1080, 3);
  g.textBaseline = 'alphabetic';
  let y = topH + 28 + headH;
  g.fillStyle = '#f4f1e8'; g.font = `${headH}px ${fonts.pixel}`; g.fillText(card.head, X, y);
  y += 18;
  for (const l of rows) {
    y += LEAD;
    fitFont(g, l.text, fonts.mono, l.px, l.min, MAXW);
    if (l.code && l.text.includes(l.code)) {
      // the seat code in yellow, every time it appears
      let x = X; const parts = l.text.split(l.code);
      parts.forEach((part, i) => {
        g.fillStyle = l.color; g.fillText(part, x, y); x += g.measureText(part).width;
        if (i < parts.length - 1) { g.fillStyle = '#ffd23f'; g.fillText(l.code as string, x, y); x += g.measureText(l.code as string).width; }
      });
    } else { g.fillStyle = l.color; g.fillText(l.text, X, y); }
  }
  y += 12;
  g.fillStyle = '#6b7080'; g.font = `${CITE}px ${fonts.mono}`;
  for (const line of cite) { y += CITELEAD; g.fillText(line, X, y); }
  y += 16 + CITE;
  g.font = `${CITE}px ${fonts.mono}`; g.textAlign = 'right';
  g.fillText('wiz.jock.pl/experiments/wave', 1080 - X, y); g.textAlign = 'left';
  return new Promise((res) => C.toBlob((bl) => res(bl), 'image/png'));
}

// ---------- page ----------

const BEST_KEY = 'wave:best';
const CULPRIT_KEY = 'wave:last-culprit';
const DT = 1 / 120;
const DEMO_COL = 103;

type Phase = 'dark' | 'lights' | 'idle' | 'play' | 'result' | 'outro';

export default function WavePage() {
  // first paint never reflows the scorebug into a fallback face
  preload('/fonts/m6x11plus.ttf', { as: 'font', type: 'font/ttf', crossOrigin: 'anonymous' });
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const [laps, setLaps] = useState('0.0');
  const [live, setLive] = useState(false);
  const [best, setBest] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [card, setCard] = useState<Card | null>(null);
  const [cardIn, setCardIn] = useState(false);
  const [saveLbl, setSaveLbl] = useState('Save card');
  const [copyLbl, setCopyLbl] = useState('Copy');
  const api = useRef<{ again: () => void; save: () => Promise<void>; copy: () => Promise<void> } | null>(null);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d') as Ctx;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cssMono = getComputedStyle(document.body).fontFamily || 'monospace';
    const fonts: Fonts = { pixel: 'm6x11plus, monospace', mono: cssMono };
    const sp: Sprites = { glowY: glowSprite('#ffd23f', 7, 0.1), glowC: glowSprite('#36e2ff', 7, 0.1), glowW: glowSprite('#e8f4ff', 3, 0.35) };

    let stored: { best: number | null; culprit: string | null } = { best: null, culprit: null };
    try {
      const b = parseFloat(localStorage.getItem(BEST_KEY) || '');
      stored = { best: Number.isFinite(b) ? b : null, culprit: localStorage.getItem(CULPRIT_KEY) };
    } catch {}

    const G = {
      S: null as unknown as Sim, L: null as unknown as Layout, seed: 0, phase: 'dark' as Phase,
      t0: performance.now(), touched: false, firstMatch: true,
      demoCount: 0, nextDemo: 4000, demo: null as { t: number; k: number } | null, idleCap: false,
      capUntil: 0, capKind: '', capLog: [] as { t: number; text: string }[], emptyTaps: 0,
      result: null as { b: Best; t: number } | null, outro: 0, dip: 0,
      fidget: new Float64Array(NF), lowFx: false, slow: 0, evIdx: 0, lastLaps: '0.0', lastLive: false,
      dpr: Math.min(2, devicePixelRatio || 1), frames: [] as number[], iv: [] as number[], nUp: 0, peakUp: 0, el: 0,
      card: null as Card | null, blob: null as Promise<Blob | null> | null, log: [] as Record<string, unknown>[],
      repeatCulprit: stored.culprit, bestLaps: stored.best,
    };

    let W = 0, H = 0, stat: { base: HTMLCanvasElement; full: HTMLCanvasElement } | null = null;
    const resize = () => {
      // the canvas box is the truth: it is what pointer coordinates are measured against
      const box = cv.getBoundingClientRect();
      W = Math.round(box.width) || innerWidth; H = Math.round(box.height) || innerHeight;
      if (W === G.L?.W && H === G.L?.H && stat && cv.width === Math.round(W * G.dpr)) return;
      cv.width = Math.round(W * G.dpr); cv.height = Math.round(H * G.dpr);
      G.L = makeLayout(W, H); stat = paintStatic(G.L, G.dpr);
    };
    resize();
    addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    const prevOver = document.body.style.overscrollBehavior, prevFlow = document.documentElement.style.overflow;
    document.body.style.overscrollBehavior = 'none'; document.documentElement.style.overflow = 'hidden';

    const say = (text: string, ms: number, kind: string) => {
      setCaption(text); G.capUntil = performance.now() + ms; G.capKind = kind;
      G.capLog.push({ t: Math.round(performance.now() - G.t0), text });
    };
    const newMatch = () => {
      G.seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
      G.S = makeSim(G.seed); G.evIdx = 0; G.result = null; G.peakUp = 0; G.card = null; G.blob = null;
      setCard(null); setCardIn(false); setLaps('0.0'); setLive(false); G.lastLaps = '0.0'; G.lastLive = false;
    };
    newMatch();
    G.phase = 'lights'; G.t0 = performance.now();

    const touch = () => {
      if (!G.touched) { G.touched = true; G.demo = null; if (G.capKind === 'idle' || G.capKind === 'repeat') { setCaption(''); G.capUntil = 0; } }
    };
    const emptyTap = () => {
      G.emptyTaps++;
      if (G.emptyTaps >= 3) { say('That is the pitch. The people are round the edge.', 2600, 'empty'); G.emptyTaps = 0; }
    };
    const pos = (e: PointerEvent): [number, number] => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const canInput = () => G.phase === 'idle' || G.phase === 'play' || (G.phase === 'lights' && performance.now() - G.t0 > 640);

    let ptr: { x: number; y: number; stroke: Stroke; inStands: boolean; id: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (!canInput() || ptr) return;
      e.preventDefault(); touch();
      const [x, y] = pos(e);
      ptr = { x, y, stroke: G.S.newStroke(), inStands: G.L.locate(x, y).inStands, id: e.pointerId };
      G.S.brushSeg(G.L, x, y, x, y, ptr.stroke);
      try { cv.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!ptr || e.pointerId !== ptr.id || !canInput()) return;
      const [x, y] = pos(e);
      G.S.brushSeg(G.L, ptr.x, ptr.y, x, y, ptr.stroke);
      if (G.L.locate(x, y).inStands) ptr.inStands = true;
      ptr.x = x; ptr.y = y;
    };
    const onUp = (e: PointerEvent) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      if (ptr.stroke.n === 0 && !ptr.inStands) emptyTap(); else G.emptyTaps = 0;
      ptr = null;
    };
    cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp); cv.addEventListener('pointercancel', onUp);

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

    const resultSeq = () => {
      const b = G.S.best; if (!b) return;
      G.phase = 'result'; G.result = { b, t: performance.now() };
      setCaption(''); G.capUntil = 0; G.capKind = '';
      const c = cardOf(b); G.card = c;
      const wasBest = G.bestLaps === null || b.laps > G.bestLaps;
      if (wasBest) G.bestLaps = b.laps;
      try {
        if (wasBest) localStorage.setItem(BEST_KEY, b.laps.toFixed(1));
        localStorage.setItem(CULPRIT_KEY, b.seat.code);
      } catch {}
      // render the PNG once fonts are in, while the zoom plays
      const fontsReady = (document.fonts ? Promise.all([document.fonts.load(`48px m6x11plus`), document.fonts.ready]) : Promise.resolve()) as Promise<unknown>;
      const L = G.L, S = G.S;
      G.blob = fontsReady.catch(() => {}).then(() => renderCard(S, b, c, fonts, sp));
      later(() => { setBest((G.bestLaps as number).toFixed(1)); setCard(c); requestAnimationFrame(() => setCardIn(true)); }, reduced ? 1200 : 900 + 500 + 1200);
      G.log.push({ t: Math.round(performance.now() - G.t0), ev: 'result', laps: b.laps, seat: b.seat.code, kind: b.kind });
    };
    const flash = (set: (s: string) => void, msg: string, back: string) => { set(msg); later(() => set(back), 1800); };
    api.current = {
      again: () => {
        if (G.phase !== 'result') return;
        setCardIn(false); G.phase = 'outro'; G.outro = performance.now();
        later(() => setCard(null), 400);
      },
      save: async () => {
        if (!G.card || !G.blob) return;
        const blob = await G.blob; if (!blob) return;
        const name = `wave-${G.card.nnnn}.png`;
        const file = new File([blob], name, { type: 'image/png' });
        const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
        const coarse = matchMedia('(pointer: coarse)').matches;
        if (coarse && navigator.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
          try { await navigator.share({ files: [file], title: 'Wave' }); flash(setSaveLbl, 'Saved.', 'Save card'); return; }
          catch (e) { if ((e as Error)?.name === 'AbortError') return; }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        later(() => URL.revokeObjectURL(url), 4000);
        flash(setSaveLbl, 'Saved.', 'Save card');
      },
      copy: async () => {
        if (!G.card) return;
        try { await navigator.clipboard.writeText(G.card.copy); }
        catch {
          const ta = document.createElement('textarea'); ta.value = G.card.copy;
          ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch {}
          ta.remove();
        }
        flash(setCopyLbl, 'Copied.', 'Copy');
      },
    };

    let raf = 0, lastT = performance.now(), acc = 0;
    // opening: towers at 0, 140, 280, 420ms, each 0 to 1.4 to 1 over 220ms; crowd fades in after
    const towerA = (el: number, k: number) => {
      const t = (el - k * 140) / 220; if (t <= 0) return 0; if (t >= 1) return 1;
      return t < 0.5 ? 1.4 * easeOut(t / 0.5) : 1.4 - 0.4 * easeOut((t - 0.5) / 0.5);
    };
    // the stored best reaches the scorebug on the first frame, never in the first render
    let bestShown = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const f0 = performance.now();
      if (!bestShown) { bestShown = true; if (G.bestLaps !== null) setBest(G.bestLaps.toFixed(1)); }
      const el = now - G.t0, S = G.S, L = G.L;
      const dt = Math.min(0.1, Math.max(0, (now - lastT) / 1000));
      G.iv.push(now - lastT); if (G.iv.length > 600) G.iv.shift();
      lastT = now;
      if (G.phase === 'lights' && el > (reduced ? 300 : 940)) G.phase = 'idle';
      // self-demo: scripted, never simulated, always fizzles. First match of a visit only.
      if ((G.phase === 'idle' || G.phase === 'lights') && !G.touched && G.firstMatch) {
        if (el > G.nextDemo && G.demoCount < 3) {
          G.demo = { t: now, k: 0 }; G.demoCount++; G.nextDemo += 12000; G.log.push({ t: Math.round(el), ev: 'demo' });
          if (G.demoCount === 1 && G.repeatCulprit) say(`${G.repeatCulprit} is back. Still sitting.`, 4000, 'repeat');
        }
        if (el > 10000 && !G.idleCap && !G.repeatCulprit) { G.idleCap = true; say('They need someone to start it.', 6000, 'idle'); }
      }
      if (G.demo && !G.touched) {
        const k = Math.floor((now - G.demo.t) / 170);
        while (G.demo && G.demo.k <= Math.min(k, 5)) {
          for (const r of [3, 4, 5]) S.demoStand(r * COLS + DEMO_COL + G.demo.k);
          G.demo.k++;
        }
        if (G.demo && G.demo.k > 5) G.demo = null;
      }
      acc += dt;
      while (acc >= DT) { S.step(DT); acc -= DT; }
      while (G.evIdx < S.events.length) {
        const ev = S.events[G.evIdx++];
        G.log.push({ t: Math.round(el), ev: ev.type, laps: ev.wave ? +ev.wave.laps.toFixed(2) : undefined, n: ev.n });
        if (ev.type === 'fizzle' && G.phase !== 'result' && ev.n) say(fizzleLine(ev.n), 2200, 'fizzle');
        if (ev.type === 'end') resultSeq();
      }
      if (G.phase === 'idle' && S.waves.size) G.phase = 'play';
      // scorebug
      let shown: number | null = null, anyAlive = false;
      for (const w of S.waves.values()) if (w.alive) { anyAlive = true; shown = Math.max(shown ?? 0, w.laps); }
      if (!anyAlive && G.result) shown = G.result.b.laps;
      if (shown !== null) {
        const s = (Math.floor(shown * 10 + 1e-6) / 10).toFixed(1);
        if (G.result) { const r = G.result.b.laps.toFixed(1); if (r !== G.lastLaps) { G.lastLaps = r; setLaps(r); } }
        else if (s !== G.lastLaps) { G.lastLaps = s; setLaps(s); }
      }
      if (anyAlive !== G.lastLive) { G.lastLive = anyAlive; setLive(anyAlive); }
      if (G.capUntil && now > G.capUntil) { G.capUntil = 0; G.capKind = ''; setCaption(''); }
      if (!reduced && Math.random() < 3 * dt) G.fidget[Math.floor(Math.random() * NF)] = now + 300;

      // camera
      ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      let z = 1, ex = 0, fxp = 0, fyp = 0, tx = 0, ty = 0;
      let zoomE = 0;
      if (G.result && G.phase === 'result') zoomE = reduced ? 1 : easeIO(Math.min(1, (now - G.result.t) / 900));
      if (G.phase === 'outro' && G.result) {
        const p = reduced ? 1 : Math.min(1, (now - G.outro) / 600);
        zoomE = 1 - easeIO(p);
        if (p >= 1) {
          G.firstMatch = false; G.touched = true; G.dip = now;
          newMatch(); G.phase = 'idle';
        }
      }
      if (G.result && zoomE > 0) {
        const cu = G.result.b.culprit, r = Math.floor(cu / COLS), c = cu % COLS;
        // centre on a point between the culprit and the pitch, so a back-row culprit leaves stands in frame
        [fxp, fyp] = L.at(c, Math.min(r, 3.5));
        tx = W / 2; ty = H * 0.29; ex = zoomE; z = 1 + 2 * ex;
        ctx.translate(fxp + (tx - fxp) * ex, fyp + (ty - fyp) * ex); ctx.scale(z, z); ctx.translate(-fxp, -fyp);
      }
      // lights and the post match dip
      let baseA = 1, crowdA = 1;
      if (G.phase === 'lights' && !reduced) {
        const ts = [0, 1, 2, 3].map((k) => towerA(el, k));
        baseA = clamp((Math.min(1, ts[0]) + Math.min(1, ts[1]) + Math.min(1, ts[2]) + Math.min(1, ts[3])) / 4, 0, 1);
        crowdA = clamp((el - 640) / 300, 0, 1);
        ctx.fillStyle = NIGHT; ctx.fillRect(-W, -H, 3 * W, 3 * H);
        // the unlit scene comes up with the towers, then each tower adds its own light
        ctx.globalAlpha = baseA;
        ctx.drawImage(stat!.base, 0, 0, W, H);
        ctx.globalAlpha = 1;
        const tw = towersOf(L);
        for (let k = 0; k < 4; k++) paintTower(ctx, L, tw[k][0], tw[k][1], ts[k]);
      } else {
        ctx.drawImage(stat!.full, 0, 0, W, H);
        if (G.dip && !reduced) {
          const p = (now - G.dip) / 200;
          if (p < 1) { ctx.fillStyle = `rgba(5,6,10,${(0.6 * Math.sin(Math.PI * p)).toFixed(3)})`; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
          else G.dip = 0;
        }
      }
      ctx.globalAlpha = crowdA;
      const nUp = crowdA > 0 ? drawFans(ctx, S, L, { st: S.st, tt: S.tt, forced: S.forced }, reduced ? null : G.fidget, now, reduced, !G.lowFx, sp) : 0;
      ctx.globalAlpha = 1;
      // telestrator, in screen space after the camera so it stays readable
      ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
      if (G.result && G.card && (G.phase === 'result' || G.phase === 'outro')) {
        const p = G.phase === 'outro' ? 0 : reduced ? 1 : clamp((now - G.result.t - 900) / 500, 0, 1);
        if (p > 0) {
          const cu = G.result.b.culprit;
          const sx = fxp + (tx - fxp) * ex + z * (L.fx[cu] - fxp), sy = fyp + (ty - fyp) * ex + z * (L.fy[cu] - fyp);
          const rr = 4.8 * L.pitch / 9 * z + 6;
          telestrator(ctx, sx, sy, rr * 1.15, rr, easeOut(p), 3);
          if (p >= 1) telestratorLabel(ctx, sx, sy, rr, G.card.code, G.card.aside, 1, { w: W, h: H * 0.54 }, fonts);
        }
      }
      const ft = performance.now() - f0;
      G.frames.push(ft); if (G.frames.length > 600) G.frames.shift();
      // a struggling device: 50 of the last 60 frames over 24ms drops to DPR 1 and loses the glow
      G.slow += ft > 24 ? 1 : 0;
      if (G.frames.length > 60 && G.frames[G.frames.length - 61] > 24) G.slow--;
      if (G.slow >= 50 && !G.lowFx) { G.lowFx = true; G.dpr = 1; stat = null; resize(); }
      if (nUp > G.peakUp) G.peakUp = nUp;
      G.nUp = nUp; G.el = el;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      for (const t of timers) clearTimeout(t);
      removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp); cv.removeEventListener('pointercancel', onUp);
      document.body.style.overscrollBehavior = prevOver; document.documentElement.style.overflow = prevFlow;
    };
  }, []);

  return (
    <main className="fixed inset-0 z-50 h-[100dvh] overflow-hidden overscroll-none bg-[#05060a] font-mono text-[#f4f1e8] select-none">
      <canvas ref={cvRef} className="absolute inset-0 h-full w-full" style={{ touchAction: 'none', cursor: 'crosshair' }} aria-label="A floodlit stadium. Swipe along the stands to start a Mexican wave." />
      <div className="pointer-events-none absolute left-[10px] top-[12px] flex h-[32px] items-stretch" style={{ transform: 'skewX(-12deg)' }}>
        <div className="font-pixel flex items-center bg-[#ffd23f] px-2.5 text-[18px] text-[#05060a]">WAVE</div>
        <div className="font-pixel flex items-center bg-[#11131c] px-2.5 text-[18px]" data-laps>LAPS {laps}</div>
        {live && (
          <div className="flex items-center gap-1.5 bg-[#11131c] pr-2 text-[12px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#ff3b3b] motion-safe:animate-[wave-blink_1s_steps(1)_infinite]" />LIVE
          </div>
        )}
        {best !== null && (
          <div className="font-pixel flex items-center border-l border-[#05060a] bg-[#11131c] px-2.5 text-[18px] text-[#ffd23f]" data-best>BEST {best}</div>
        )}
      </div>
      <div className="pointer-events-none absolute right-[12px] top-[20px] text-[11px] text-[#6b7080]">WIZ LAB</div>
      {caption && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 max-w-[170px] -translate-x-1/2 -translate-y-1/2 rounded bg-[#05060a]/85 px-3 py-2 text-center text-[13px] leading-snug md:max-w-[260px] md:text-[15px]" data-caption>
          {caption}
        </div>
      )}
      {card && (
        <div
          className="absolute inset-x-0 bottom-0 flex h-[46%] flex-col gap-1.5 border-t border-[#ffd23f]/40 bg-[#0b0c12] px-4 pb-4 pt-3 text-[13px] leading-snug transition-transform duration-[400ms] ease-out motion-reduce:transition-none md:mx-auto md:max-w-[560px] md:border-x md:text-[14px]"
          style={{ transform: cardIn ? 'translateY(0)' : 'translateY(100%)' }}
          data-card
        >
          <div className="font-pixel text-[28px] leading-none">{card.head}</div>
          <div>{card.stat}</div>
          <div>{card.death}</div>
          <div>
            {card.culprit.split(card.code).map((part, i, arr) => (
              <span key={i}>{part}{i < arr.length - 1 && <span className="text-[#ffd23f]">{card.code}</span>}</span>
            ))}
          </div>
          <div className="text-[#8d91a0]">{card.footer}{card.anti ? ' ' + card.anti : ''}</div>
          <div className="mt-auto flex flex-col gap-1.5">
            <button type="button" className="h-[48px] w-full bg-[#ffd23f] text-[#05060a]" onClick={() => api.current?.save()}>{saveLbl}</button>
            <button type="button" className="h-[48px] w-full border border-[#f4f1e8]/30" onClick={() => api.current?.copy()}>{copyLbl}</button>
            <button type="button" className="h-[48px] w-full border border-[#f4f1e8]/30" onClick={() => api.current?.again()}>Another match</button>
          </div>
        </div>
      )}
      <style>{`@keyframes wave-blink { 0% { opacity: 1 } 50% { opacity: 0 } }`}</style>
    </main>
  );
}
