'use client'

import type { CSSProperties, MutableRefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const ART = 12
const PAGE = '#0b0b10'
const YOU = '#ffd23f'
const YOU_HAIR = '#b8901c'
const LAST_KEY = 'pick-a-seat:last-type'

type Cell = { x: number; y: number }
type PropKind = 'tuba' | 'popcorn' | 'laptop' | 'scarf' | 'plant' | 'pigeons' | 'hand' | 'egg'
type RoomKind = 'bus' | 'cinema' | 'cafe' | 'waiting' | 'lift' | 'park' | 'lecture' | 'train'
type Metric = 'row' | 'space'
type Person = { x: number; y: number; body: string; hair: string; she?: boolean }
type PropPlacement = { x: number; y: number; kind: PropKind }
type Room = {
  name: string
  kind: RoomKind
  metric: Metric
  prompt?: string
  grid: string[]
  pal: { floor: string; wall: string; seat: string; table?: string; water?: string }
  focus: Cell
  strangers: Person[]
  odd: Person & { prop: PropPlacement }
  oddLine: string
}

type Measure = {
  gap: number
  edge: number
  wall: number
  front: number
  odd: number
  near: Person | null
  rowMate: boolean
}

type ReactionKind = 'offer' | 'scoot' | 'glance' | 'none'
type Reaction = { kind: ReactionKind; who: Person | null; dir: Cell; line: string }
type Pick = { s: Cell; m: Measure; rx: Reaction }
type Phase = 'idle' | 'running' | 'hold' | 'slide' | 'result'
type Slide = 'out' | 'enter' | 'in' | 'none'
type Anim = {
  you: Cell | null
  walk: { cells: Cell[]; t0: number; per: number } | null
  sitT: number
  reaction: (Reaction & { t0: number }) | null
  overlay: { m: Measure; s: Cell; t0: number } | null
  flash: { s: Cell; t0: number } | null
  glanceAt: { p: Person; dir: Cell; t0: number } | null
  hint: { s: Cell; t0: number } | null
}

const BODIES = ['#8c7b6b', '#6b7a8c', '#7c6b8c', '#5e6e5a', '#8c6b6b', '#a39a8a', '#4f5560', '#7a7060']
const HAIRS = ['#2a2320', '#5a3a22', '#bfa27a', '#9a9a9a']

const ROOMS: Room[] = [
  {
    name: 'Bus',
    kind: 'bus',
    metric: 'row',
    grid: ['########', '#F....D#', '#ss..ss#', '#ss..ss#', '#ss..ss#', '#ss..ss#', '#ss..ss#', '#ss..ss#', '#ss..ss#', '########'],
    pal: { floor: '#3a3550', wall: '#1c1a26', seat: '#b8463a' },
    focus: { x: 1, y: 1 },
    strangers: [
      { x: 6, y: 2, body: BODIES[0], hair: HAIRS[0], she: true },
      { x: 1, y: 3, body: BODIES[1], hair: HAIRS[3] },
      { x: 6, y: 4, body: BODIES[2], hair: HAIRS[2], she: true },
      { x: 1, y: 8, body: BODIES[3], hair: HAIRS[1] },
      { x: 6, y: 7, body: BODIES[5], hair: HAIRS[0], she: true },
    ],
    odd: { x: 1, y: 6, body: BODIES[4], hair: HAIRS[1], prop: { x: 2, y: 6, kind: 'tuba' } },
    oddLine: 'The tuba gets the window. You get the tuba.',
  },
  {
    name: 'Cinema',
    kind: 'cinema',
    metric: 'row',
    grid: ['#FFFFFF#', '........', '........', '.ssssss.', '........', '.ssssss.', '........', '.ssssss.', '........', '#######D'],
    pal: { floor: '#2a1e24', wall: '#140e12', seat: '#7a2233' },
    focus: { x: 4, y: 0 },
    strangers: [
      { x: 2, y: 3, body: BODIES[6], hair: HAIRS[0] },
      { x: 5, y: 3, body: BODIES[7], hair: HAIRS[2], she: true },
      { x: 6, y: 5, body: BODIES[1], hair: HAIRS[1] },
      { x: 1, y: 7, body: BODIES[0], hair: HAIRS[3], she: true },
      { x: 4, y: 7, body: BODIES[3], hair: HAIRS[0] },
    ],
    odd: { x: 3, y: 5, body: BODIES[2], hair: HAIRS[1], she: true, prop: { x: 4, y: 5, kind: 'popcorn' } },
    oddLine: 'She tilts the bucket your way. It is a shared bucket now.',
  },
  {
    name: 'Cafe',
    kind: 'cafe',
    metric: 'space',
    grid: ['###F####', '#......#', '#sTs.sT#', '#......#', '#.T.s..#', '#ss...s#', '#......#', '#.sTs..#', '#D.....#', '########'],
    pal: { floor: '#5a4030', wall: '#2b1f18', seat: '#c9a46a', table: '#8a6440' },
    focus: { x: 3, y: 0 },
    strangers: [
      { x: 1, y: 2, body: BODIES[3], hair: HAIRS[2], she: true },
      { x: 3, y: 2, body: BODIES[1], hair: HAIRS[0] },
      { x: 4, y: 4, body: BODIES[5], hair: HAIRS[3], she: true },
      { x: 6, y: 5, body: BODIES[7], hair: HAIRS[1] },
    ],
    odd: { x: 1, y: 5, body: BODIES[4], hair: HAIRS[0], prop: { x: 2, y: 4, kind: 'laptop' } },
    oddLine: 'He turns the laptop round. You are on the call.',
  },
  {
    name: 'Waiting Room',
    kind: 'waiting',
    metric: 'space',
    grid: ['########', '#Fssss.#', '#......#', '#s....s#', '#s....s#', '#s....s#', '#s....s#', '#......#', '#.ssssD#', '########'],
    pal: { floor: '#3d4a45', wall: '#1e2623', seat: '#6f8f86' },
    focus: { x: 1, y: 1 },
    strangers: [
      { x: 2, y: 1, body: BODIES[0], hair: HAIRS[3] },
      { x: 4, y: 1, body: BODIES[6], hair: HAIRS[0], she: true },
      { x: 1, y: 4, body: BODIES[2], hair: HAIRS[2], she: true },
      { x: 6, y: 6, body: BODIES[7], hair: HAIRS[1] },
    ],
    odd: { x: 3, y: 8, body: BODIES[5], hair: HAIRS[3], she: true, prop: { x: 2, y: 8, kind: 'scarf' } },
    oddLine: 'She holds the scarf against your shoulder. It is for you, apparently.',
  },
  {
    name: 'Lift',
    kind: 'lift',
    metric: 'space',
    prompt: 'Pick a spot.',
    grid: ['########', '#......#', '#..sss.#', '#..sss.#', '#..sss.#', '#......#', '#..D...#', '########'],
    pal: { floor: '#6b6f78', wall: '#2a2c31', seat: '#8e939c' },
    focus: { x: 3, y: 6 },
    strangers: [
      { x: 3, y: 2, body: BODIES[1], hair: HAIRS[0], she: true },
      { x: 5, y: 2, body: BODIES[0], hair: HAIRS[2] },
      { x: 3, y: 4, body: BODIES[2], hair: HAIRS[1] },
      { x: 5, y: 4, body: BODIES[6], hair: HAIRS[3], she: true },
    ],
    odd: { x: 4, y: 3, body: BODIES[3], hair: HAIRS[0], prop: { x: 5, y: 3, kind: 'plant' } },
    oddLine: 'The plant touches your ear for six floors.',
  },
  {
    name: 'Park Bench',
    kind: 'park',
    metric: 'row',
    grid: ['########', '#PPPPPP#', '#......#', '#ss.sss#', '#......#', '#ss.sss#', '#......#', '#..D...#', '########'],
    pal: { floor: '#2f4a2c', wall: '#1f3348', seat: '#8a6a48', water: '#1f3348' },
    focus: { x: 4, y: 1 },
    strangers: [
      { x: 1, y: 3, body: BODIES[0], hair: HAIRS[3], she: true },
      { x: 4, y: 3, body: BODIES[2], hair: HAIRS[2] },
      { x: 2, y: 5, body: BODIES[6], hair: HAIRS[0], she: true },
      { x: 6, y: 5, body: BODIES[1], hair: HAIRS[1] },
    ],
    odd: { x: 5, y: 3, body: BODIES[5], hair: HAIRS[1], prop: { x: 5, y: 2, kind: 'pigeons' } },
    oddLine: 'The pigeons reassess. They are your pigeons now.',
  },
  {
    name: 'Lecture Hall',
    kind: 'lecture',
    metric: 'row',
    grid: ['###F####', '#......#', '#ss.sss#', '#......#', '#ss.sss#', '#......#', '#ss.sss#', '#......#', '#ss.ssD#', '########'],
    pal: { floor: '#3b3226', wall: '#1d1913', seat: '#9a7b52' },
    focus: { x: 3, y: 0 },
    strangers: [
      { x: 1, y: 2, body: BODIES[4], hair: HAIRS[0], she: true },
      { x: 5, y: 2, body: BODIES[1], hair: HAIRS[3] },
      { x: 2, y: 4, body: BODIES[7], hair: HAIRS[2], she: true },
      { x: 1, y: 6, body: BODIES[0], hair: HAIRS[1] },
      { x: 4, y: 8, body: BODIES[3], hair: HAIRS[0], she: true },
    ],
    odd: { x: 5, y: 6, body: BODIES[6], hair: HAIRS[1], prop: { x: 5, y: 5, kind: 'hand' } },
    oddLine: 'His hand goes up again. The question is about you.',
  },
  {
    name: 'Train',
    kind: 'train',
    metric: 'row',
    grid: ['###D####', '#......#', '#ss..ss#', '#TT..TT#', '#ss..ss#', '#ss..ss#', '#TT..TT#', '#ss..ss#', '#......#', '########'],
    pal: { floor: '#2e3d4f', wall: '#161e28', seat: '#4f6d8f', table: '#8a7a64' },
    focus: { x: 3, y: 0 },
    strangers: [
      { x: 1, y: 2, body: BODIES[5], hair: HAIRS[1], she: true },
      { x: 6, y: 5, body: BODIES[6], hair: HAIRS[3] },
      { x: 2, y: 7, body: BODIES[4], hair: HAIRS[0] },
      { x: 6, y: 7, body: BODIES[1], hair: HAIRS[2], she: true },
    ],
    odd: { x: 6, y: 4, body: BODIES[7], hair: HAIRS[0], prop: { x: 6, y: 3, kind: 'egg' } },
    oddLine: 'He offers you the egg. It is still warm.',
  },
]

const SPRITE = [
  '............',
  '....hhhh....',
  '...hhhhhh...',
  '...hhhhhh...',
  '...hhhhhh...',
  '.bbbhhhhbbb.',
  'bbbbbbbbbbbb',
  'abbbbbbbbbba',
  'abbbbbbbbbba',
  '.bbbbbbbbbb.',
  '............',
  '............',
]

const PROPS: Record<PropKind, { rows: string[]; c: Record<string, string> }> = {
  tuba: {
    rows: ['............', '..kkkkkkkk..', '.kccccccck.', '.kccccccck.', '.kccccccck.', '..kkkkkkkk..', '...yyyy....', '...yyyy....', '...yyyy....', '..yyyyyy...', '............', '............'],
    c: { k: '#2b211c', c: '#80602a', y: '#c8a24a' },
  },
  popcorn: {
    rows: ['..wywwywyw..', '.wywwywywyw.', '.ywwywwywwy.', '.rrwwrrwwrr.', '.rrwwrrwwrr.', '..rwwrrwwr..', '..rwwrrwwr..', '..rwwrrwwr..', '...wwrrww...', '............', '............', '............'],
    c: { w: '#f0e6cc', y: '#e0b84a', r: '#b8323a' },
  },
  laptop: {
    rows: ['............', '............', '..bbbbbbbb..', '..bccccccb..', '..bccccccb..', '..bccccccb..', '..bbbbbbbb..', '...kkkkkk...', '............', '............', '............', '............'],
    c: { b: '#181c20', c: '#8fc0c8', k: '#101214' },
  },
  scarf: {
    rows: ['rrr.........', '..rrr.......', '....rrr.....', '......rrr...', '........rrr.', '.........rrr', '............', '............', '............', '............', '............', '............'],
    c: { r: '#c8586a' },
  },
  plant: {
    rows: ['....gg......', '...gggg.....', '..gggggg....', '....ggg.....', '...gggggg...', '..ggggggg...', '.....bb.....', '....bbbb....', '....bbbb....', '............', '............', '............'],
    c: { g: '#7eb36b', b: '#6a4a2a' },
  },
  pigeons: {
    rows: ['............', '..p..p...p..', '.pp.pp..pp..', '..p..p...p..', '...k.....k..', '............', '............', '............', '............', '............', '............', '............'],
    c: { p: '#b7b7ad', k: '#e0b84a' },
  },
  hand: {
    rows: ['.....aa.....', '.....aa.....', '.....aa.....', '....aaaa....', '.....aa.....', '............', '............', '............', '............', '............', '............', '............'],
    c: { a: '#caa07a' },
  },
  egg: {
    rows: ['............', '............', '............', '.....ww.....', '....wwww....', '....wwwe....', '....wwww....', '.....ww.....', '...pppppp...', '............', '............', '............'],
    c: { w: '#f4f0e4', e: '#d8d0bc', p: '#c8c0b0' },
  },
}

const SCOOT_LINES = [
  { he: 'He moves his bag. Not far.', she: 'She moves her bag. Not far.' },
  { any: 'A small, polite relocation.' },
  { he: 'He gives you one more inch. That is all of them.', she: 'She gives you one more inch. That is all of them.' },
]

const GLANCE_LINES = [
  { he: 'He looks up, then very much back down.', she: 'She looks up, then very much back down.' },
  { he: 'You are now in his peripheral vision. Permanently.', she: 'You are now in her peripheral vision. Permanently.' },
]

const GAP1_LINES = ['One empty seat. The universal treaty.', 'A respectful gap. Nobody has to say anything.']
const FAR_LINES = ['Nobody noticed. That was the point.', 'The room does not register you. Well done.']

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const emptyAnim = (): Anim => ({ you: null, walk: null, sitT: 0, reaction: null, overlay: null, flash: null, glanceAt: null, hint: null })
const at = (r: Room, x: number, y: number) => (y < 0 || y >= r.grid.length || x < 0 || x >= 8 ? '#' : r.grid[y][x])
const people = (r: Room): Person[] => [...r.strangers, r.odd]
const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y
const cheb = (a: Cell, b: Cell) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
const sign = (to: Cell, from: Cell) => ({ x: Math.sign(to.x - from.x), y: Math.sign(to.y - from.y) })
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function takenBy(r: Room, x: number, y: number) {
  return people(r).find((p) => p.x === x && p.y === y) || null
}

function propAt(r: Room, x: number, y: number) {
  return r.odd.prop.x === x && r.odd.prop.y === y
}

function isFree(r: Room, x: number, y: number) {
  return at(r, x, y) === 's' && !takenBy(r, x, y) && !propAt(r, x, y)
}

function seats(r: Room) {
  const out: Cell[] = []
  r.grid.forEach((row, y) => row.split('').forEach((ch, x) => ch === 's' && out.push({ x, y })))
  return out
}

function doorCell(r: Room): Cell {
  for (let y = 0; y < r.grid.length; y++) for (let x = 0; x < 8; x++) if (at(r, x, y) === 'D') return { x, y }
  return { x: 0, y: 0 }
}

function frontScore(r: Room, s: Cell) {
  const all = seats(r)
  const ranked = all.map((c) => ({ c, d: Math.hypot(c.x - r.focus.x, c.y - r.focus.y) })).sort((a, b) => a.d - b.d)
  const cutoff = ranked[Math.max(0, Math.ceil(ranked.length / 3) - 1)]?.d ?? 0
  return Math.hypot(s.x - r.focus.x, s.y - r.focus.y) <= cutoff ? 1 : 0
}

function wallScore(r: Room, s: Cell) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      if (at(r, s.x + dx, s.y + dy) === '#') return 1
    }
  }
  return 0
}

function edgeScore(r: Room, s: Cell) {
  if (r.metric === 'row') return at(r, s.x - 1, s.y) !== 's' || at(r, s.x + 1, s.y) !== 's' ? 1 : 0
  return [
    at(r, s.x - 1, s.y),
    at(r, s.x + 1, s.y),
    at(r, s.x, s.y - 1),
    at(r, s.x, s.y + 1),
  ].some((c) => c === '.' || c === 'D') ? 1 : 0
}

function nearestPerson(r: Room, s: Cell) {
  let best = 99
  let near: Person | null = null
  for (const p of people(r)) {
    const d = cheb(p, s)
    if (d < best) {
      best = d
      near = p
    }
  }
  return near
}

function measure(r: Room, s: Cell): Measure {
  let gap = 3
  let near: Person | null = null
  let rowMate = false
  if (r.metric === 'row') {
    let best = 99
    for (const dir of [-1, 1]) {
      let empty = 0
      for (let x = s.x + dir; at(r, x, s.y) === 's'; x += dir) {
        const p = takenBy(r, x, s.y)
        if (p || propAt(r, x, s.y)) {
          if (p && empty < best) {
            best = empty
            near = p
            rowMate = true
          }
          break
        }
        empty++
      }
    }
    gap = rowMate ? clamp(best, 0, 3) : 3
    if (!near) near = nearestPerson(r, s)
  } else {
    let best = 99
    for (const p of people(r)) {
      const d = cheb(p, s) - 1
      if (d < best) {
        best = d
        near = p
      }
    }
    gap = clamp(best, 0, 3)
  }
  return {
    gap,
    edge: edgeScore(r, s),
    wall: wallScore(r, s),
    front: frontScore(r, s),
    odd: cheb(r.odd, s) === 1 ? 1 : 0,
    near,
    rowMate,
  }
}

function lineFor(list: Array<{ he?: string; she?: string; any?: string }>, p: Person | null, i: number) {
  const item = list[i % list.length]
  if (item.any) return item.any
  return p?.she ? item.she || item.he || '' : item.he || item.she || ''
}

function react(r: Room, idx: number, s: Cell, m: Measure): Reaction {
  if (m.odd) return { kind: 'offer', who: r.odd, dir: sign(s, r.odd.prop), line: r.oddLine }
  if (m.gap === 0 && m.near) {
    const p = m.near
    const away = { x: p.x + (p.x - s.x), y: p.y }
    if (m.rowMate && isFree(r, away.x, away.y)) return { kind: 'scoot', who: p, dir: { x: p.x - s.x, y: 0 }, line: lineFor(SCOOT_LINES, p, idx) }
    return { kind: 'glance', who: p, dir: sign(s, p), line: lineFor(GLANCE_LINES, p, idx) }
  }
  if (m.gap === 1 && m.near) return { kind: 'glance', who: m.near, dir: sign(s, m.near), line: GAP1_LINES[idx % GAP1_LINES.length] }
  return { kind: 'none', who: null, dir: { x: 0, y: 0 }, line: FAR_LINES[idx % FAR_LINES.length] }
}

// One route from the door, walked cell by cell. Open floor, the doorway and the room's
// focus tile are walkable; a seat is only walkable when it is free and sits on the
// destination's own row run, so the figure shuffles along a bench instead of climbing
// over the room. People, props, walls, tables and water always block.
function walkTo(r: Room, from: Cell, to: Cell, anyFreeSeat: boolean): Cell[] {
  const key = (c: Cell) => c.y * 8 + c.x
  const rowRun = new Set<number>()
  if (at(r, to.x, to.y) === 's') {
    for (let x = to.x; at(r, x, to.y) === 's'; x--) rowRun.add(key({ x, y: to.y }))
    for (let x = to.x + 1; at(r, x, to.y) === 's'; x++) rowRun.add(key({ x, y: to.y }))
  }
  const q: Cell[] = [from]
  const prev = new Map<number, number>()
  prev.set(key(from), -1)
  while (q.length) {
    const c = q.shift() as Cell
    if (same(c, to)) break
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = { x: c.x + dx, y: c.y + dy }
      const k = key(n)
      if (prev.has(k)) continue
      const tile = at(r, n.x, n.y)
      const target = same(n, to)
      if (!target && (takenBy(r, n.x, n.y) || propAt(r, n.x, n.y))) continue
      const seatOk = (anyFreeSeat || rowRun.has(k)) && isFree(r, n.x, n.y)
      if (!(tile === '.' || tile === 'D' || tile === 'F' || seatOk || target)) continue
      prev.set(k, key(c))
      q.push(n)
    }
  }
  if (!prev.has(key(to))) return []
  const out: Cell[] = []
  let k: number = key(to)
  while (k !== -1) {
    out.unshift({ x: k % 8, y: Math.floor(k / 8) })
    k = prev.get(k) as number
  }
  return out
}

// Every free seat in every room has a walkable route from its door, proven by
// experiments/weekly/2026-W41/check-paths.mjs. The two fallbacks below exist so that a
// later layout edit degrades honestly: a longer way round first, and a plain place at
// the seat last. Never a jump from the door to a far cell.
function path(r: Room, to: Cell): Cell[] {
  const from = doorCell(r)
  const alongTheRow = walkTo(r, from, to, false)
  if (alongTheRow.length > 1) return alongTheRow
  const theLongWay = walkTo(r, from, to, true)
  if (theLongWay.length > 1) return theLongWay
  return [to]
}

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => clamp(Math.round(v + (k < 0 ? v * k : (255 - v) * k)), 0, 255)
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`
}

function blit(g: CanvasRenderingContext2D, rows: string[], c: Record<string, string>, ox: number, oy: number) {
  for (let y = 0; y < 12; y++) {
    const row = rows[y] || ''
    for (let x = 0; x < 12; x++) {
      const ch = row[x]
      if (!ch || ch === '.') continue
      g.fillStyle = c[ch] || '#fff'
      g.fillRect(ox + x, oy + y, 1, 1)
    }
  }
}

function drawPerson(g: CanvasRenderingContext2D, ox: number, oy: number, body: string, hair: string, you = false, look?: Cell) {
  if (you) {
    const gr = g.createRadialGradient(ox + 6, oy + 6, 1, ox + 6, oy + 6, 14)
    gr.addColorStop(0, 'rgba(255,210,63,0.35)')
    gr.addColorStop(1, 'rgba(255,210,63,0)')
    g.fillStyle = gr
    g.fillRect(ox - 8, oy - 8, 28, 28)
  }
  blit(g, SPRITE, { h: hair, b: body, a: shade(body, -0.25) }, Math.round(ox), Math.round(oy))
  if (look && (look.x || look.y)) {
    g.fillStyle = shade(hair, 0.2)
    g.fillRect(Math.round(ox + 5 + look.x * 2), Math.round(oy + 3 + look.y * 2), 3, 2)
  }
}

function drawFloor(g: CanvasRenderingContext2D, r: Room, x: number, y: number, px: number, py: number) {
  g.fillStyle = r.pal.floor
  g.fillRect(px, py, ART, ART)
  g.fillStyle = shade(r.pal.floor, -0.18)
  if (r.kind === 'bus') for (let i = 0; i < 12; i += 4) g.fillRect(px + ((i + y * 2) % 12), py + i, 1, 1)
  if (r.kind === 'cinema' && (x + y) % 2 === 0) g.fillRect(px + 5, py + 5, 2, 2)
  if (r.kind === 'lift') {
    g.fillRect(px, py + 11, ART, 1)
    g.fillRect(px + 11, py, 1, ART)
  }
  if (r.kind === 'train') g.fillRect(px, py + 11, ART, 1)
}

function drawFixture(g: CanvasRenderingContext2D, r: Room, tile: string, x: number, y: number, px: number, py: number) {
  if (tile === 'D') {
    g.fillStyle = '#e8d8a8'
    if (x === 0 || x === 7) g.fillRect(x === 7 ? px + 10 : px, py + 1, 2, ART - 2)
    else g.fillRect(px + 1, y === 0 ? py : py + 10, ART - 2, 2)
  }
  if (tile === 's') {
    g.fillStyle = shade(r.pal.seat, -0.35)
    g.fillRect(px + 1, py + 1, 10, 10)
    g.fillStyle = r.pal.seat
    g.fillRect(px + 1, py + 1, 10, 7)
    g.fillStyle = shade(r.pal.seat, 0.15)
    g.fillRect(px + 2, py + 2, 8, 1)
  }
  if (tile === 'T') {
    g.fillStyle = r.pal.table || '#8a6440'
    g.fillRect(px, py + 2, ART, 8)
    g.fillStyle = shade(r.pal.table || '#8a6440', 0.2)
    g.fillRect(px, py + 2, ART, 1)
  }
  if (tile === 'P') {
    g.fillStyle = r.pal.water || '#1f3348'
    g.fillRect(px, py, ART, ART)
    g.fillStyle = '#5f7f9b'
    g.fillRect(px + ((x + y) % 3) * 3, py + 5, 5, 1)
  }
  if (tile === 'F') {
    if (r.kind === 'bus') {
      g.fillStyle = '#2a2838'
      g.fillRect(px + 1, py + 1, 10, 10)
      drawPerson(g, px, py + 1, '#4f5560', '#2a2320')
      g.strokeStyle = '#0e0d14'
      g.lineWidth = 2
      g.strokeRect(px + 2, py - 1, 8, 3)
    } else if (r.kind === 'cinema') {
      g.fillStyle = '#d8d4f0'
      g.fillRect(px, py + 3, ART, 5)
      g.fillStyle = '#a8a4c8'
      g.fillRect(px, py + 7, ART, 1)
    } else if (r.kind === 'lecture') {
      g.fillStyle = '#d0b58a'
      g.fillRect(px + 1, py + 5, 10, 5)
      drawPerson(g, px, py - 1, '#6b7a8c', '#9a9a9a')
    } else {
      g.fillStyle = shade(r.pal.wall, 0.35)
      g.fillRect(px, py + 4, ART, 5)
    }
  }
}

function drawRoom(g: CanvasRenderingContext2D, r: Room, a: Anim, now: number) {
  const H = r.grid.length
  g.fillStyle = PAGE
  g.fillRect(0, 0, 8 * ART, H * ART)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < 8; x++) {
      const t = at(r, x, y)
      const px = x * ART
      const py = y * ART
      if (t === '#') {
        g.fillStyle = r.pal.wall
        g.fillRect(px, py, ART, ART)
        g.fillStyle = shade(r.pal.wall, 0.12)
        if (at(r, x, y + 1) !== '#' && y + 1 < H) g.fillRect(px, py + ART - 2, ART, 2)
        if ((r.kind === 'bus' || r.kind === 'train') && (x === 0 || x === 7) && y > 1 && y < H - 1 && y % 2 === 0) {
          g.fillStyle = r.kind === 'bus' ? '#4a6a8a' : '#5a7ea0'
          g.fillRect(x === 0 ? px + 3 : px + 6, py + 1, 3, ART - 2)
        }
        continue
      }
      drawFloor(g, r, x, y, px, py)
      drawFixture(g, r, t, x, y, px, py)
    }
  }
  const lp = g.createRadialGradient(r.focus.x * ART + 6, r.focus.y * ART + 6, 2, r.focus.x * ART + 6, r.focus.y * ART + 6, 60)
  lp.addColorStop(0, 'rgba(255,214,150,0.14)')
  lp.addColorStop(1, 'rgba(255,214,150,0)')
  g.fillStyle = lp
  g.fillRect(0, 0, 8 * ART, H * ART)

  const rx = a.reaction
  for (const p of people(r)) {
    let ox = p.x * ART
    let oy = p.y * ART
    let look: Cell | undefined
    if (rx && rx.who === p) {
      const e = now - rx.t0
      if (rx.kind === 'glance' && e >= 0 && e < 300) {
        const st = Math.floor(e / 150) === 0 ? 2 : 0
        ox += rx.dir.x * st
        oy += rx.dir.y * st
        look = rx.dir
      }
      if (rx.kind === 'scoot') {
        const p3 = e < 0 ? 0 : Math.min(3, Math.floor(e / 80))
        ox += rx.dir.x * Math.round((ART * p3) / 3)
      }
    }
    if (a.glanceAt && a.glanceAt.p === p) {
      const e = now - a.glanceAt.t0
      if (e >= 0 && e < 300 && Math.floor(e / 150) === 0) {
        ox += a.glanceAt.dir.x * 2
        oy += a.glanceAt.dir.y * 2
        look = a.glanceAt.dir
      }
    }
    drawPerson(g, ox, oy, p.body, p.hair, false, look)
  }

  const pr = r.odd.prop
  let ox = pr.x * ART
  let oy = pr.y * ART
  if (rx && rx.kind === 'offer') {
    const e = now - rx.t0
    let f = 0
    if (e >= 0 && e < 160) f = e / 160
    else if (e >= 160 && e < 660) f = 1
    else if (e >= 660 && e < 820) f = 1 - (e - 660) / 160
    f = Math.floor(f * 4) / 4
    ox += rx.dir.x * ART * f
    oy += rx.dir.y * ART * f
  }
  const P = PROPS[pr.kind]
  blit(g, P.rows, P.c, Math.round(ox), Math.round(oy))

  if (a.walk) {
    const e = now - a.walk.t0
    const i = Math.min(a.walk.cells.length - 1, Math.floor(e / a.walk.per))
    const c = a.walk.cells[i]
    const done = i === a.walk.cells.length - 1
    const bob = done ? (now - a.sitT > 60 ? 1 : 0) : Math.floor(e / a.walk.per) % 2
    drawPerson(g, c.x * ART, c.y * ART + bob, YOU, YOU_HAIR, true)
  } else if (a.you) {
    drawPerson(g, a.you.x * ART, a.you.y * ART + 1, YOU, YOU_HAIR, true)
  }
}

function drawOverlay(g: CanvasRenderingContext2D, cell: number, r: Room, o: { m: Measure; s: Cell }, f: number) {
  const { m, s } = o
  g.save()
  g.globalAlpha = f
  g.strokeStyle = YOU
  g.fillStyle = YOU
  g.lineWidth = 2
  const cx = (s.x + 0.5) * cell
  const cy = (s.y + 0.5) * cell
  if (m.near) {
    g.setLineDash([4, 4])
    g.beginPath()
    g.moveTo(cx, cy)
    g.lineTo((m.near.x + 0.5) * cell, (m.near.y + 0.5) * cell)
    g.stroke()
    g.setLineDash([])
  }
  g.font = '13px "JetBrains Mono", monospace'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = PAGE
  g.fillRect(6, 6, 150, 23)
  g.fillStyle = YOU
  g.fillText(`gap ${m.gap} / ${m.edge ? 'exit' : 'inside'} / ${m.wall ? 'wall' : 'open'}`, 81, 18)
  if (m.edge) {
    const side = at(r, s.x - 1, s.y) !== 's' ? -1 : 1
    const ax = side < 0 ? s.x * cell : (s.x + 1) * cell
    g.fillRect(ax - 1, s.y * cell + 4, 3, cell - 8)
  }
  if (m.wall) {
    g.strokeRect(s.x * cell + 5, s.y * cell + 5, cell - 10, cell - 10)
  }
  if (m.odd) {
    g.strokeRect(r.odd.x * cell + 2, r.odd.y * cell + 2, cell - 4, cell - 4)
  }
  g.restore()
}

function RoomCanvas({
  room,
  cell,
  anim,
  idleOutline,
  reduced,
  onCell,
  onCanvasError,
  showOverlay,
}: {
  room: Room
  cell: number
  anim: MutableRefObject<Anim>
  idleOutline: boolean
  reduced: boolean
  onCell?: (c: Cell) => void
  onCanvasError?: () => void
  showOverlay?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const hover = useRef<Cell | null>(null)
  const H = room.grid.length

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(8 * cell * dpr)
    canvas.height = Math.round(H * cell * dpr)
    const art = document.createElement('canvas')
    art.width = 8 * ART
    art.height = H * ART
    const ag = art.getContext('2d')
    const g = canvas.getContext('2d')
    if (!ag || !g) {
      onCanvasError?.()
      return
    }
    let raf = 0
    const t0 = performance.now()
    const paint = () => {
      const now = performance.now()
      drawRoom(ag, room, anim.current, now)
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.imageSmoothingEnabled = false
      g.clearRect(0, 0, canvas.width, canvas.height)
      g.drawImage(art, 0, 0, canvas.width, canvas.height)
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      const a = anim.current
      if (idleOutline && !a.you && !a.walk) {
        const hi = reduced ? false : Math.floor((now - t0) / 800) % 2 === 1
        g.strokeStyle = hi ? 'rgba(255,210,63,0.6)' : 'rgba(255,210,63,0.25)'
        g.lineWidth = 1
        for (let y = 0; y < H; y++) for (let x = 0; x < 8; x++) if (isFree(room, x, y)) g.strokeRect(x * cell + 2.5, y * cell + 2.5, cell - 5, cell - 5)
      }
      if (hover.current && isFree(room, hover.current.x, hover.current.y)) {
        g.strokeStyle = 'rgba(255,210,63,0.95)'
        g.lineWidth = 2
        g.strokeRect(hover.current.x * cell + 2, hover.current.y * cell + 2, cell - 4, cell - 4)
      }
      if (a.hint && now - a.hint.t0 < 1300) {
        const pulse = Math.floor((now - a.hint.t0) / 325) % 2 === 0
        if (pulse) {
          g.strokeStyle = 'rgba(255,210,63,1)'
          g.lineWidth = 3
          g.strokeRect(a.hint.s.x * cell + 3, a.hint.s.y * cell + 3, cell - 6, cell - 6)
        }
      }
      if (a.flash && now - a.flash.t0 < 120) {
        g.fillStyle = 'rgba(255,210,63,0.8)'
        g.fillRect(a.flash.s.x * cell + 2, a.flash.s.y * cell + 2, cell - 4, cell - 4)
      }
      if (a.overlay) {
        const e = now - a.overlay.t0
        if (showOverlay || (e >= 0 && e < 900)) drawOverlay(g, cell, room, a.overlay, showOverlay ? 1 : e < 100 ? e / 100 : e > 800 ? (900 - e) / 100 : 1)
      }
    }
    const tick = () => {
      paint()
      raf = requestAnimationFrame(tick)
    }
    paint()
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [room, cell, H, anim, idleOutline, reduced, onCanvasError, showOverlay])

  const point = (e: React.PointerEvent<HTMLCanvasElement>): Cell => {
    const b = e.currentTarget.getBoundingClientRect()
    return { x: Math.floor((e.clientX - b.left) / cell), y: Math.floor((e.clientY - b.top) / cell) }
  }

  return (
    <canvas
      ref={ref}
      style={{ width: 8 * cell, height: H * cell, touchAction: 'manipulation', imageRendering: 'pixelated' }}
      className="block"
      onPointerMove={(e) => {
        hover.current = point(e)
      }}
      onPointerLeave={() => {
        hover.current = null
      }}
      onPointerDown={(e) => {
        if (!onCell) return
        onCell(point(e))
      }}
    />
  )
}

function StaticRoom({ room, cell }: { room: Room; cell: number }) {
  const H = room.grid.length
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden"
      style={{ width: 8 * cell, height: H * cell, background: PAGE, imageRendering: 'pixelated' }}
    >
      {room.grid.map((row, y) =>
        row.split('').map((ch, x) => {
          const style: CSSProperties = {
            position: 'absolute',
            left: x * cell,
            top: y * cell,
            width: cell,
            height: cell,
            background: ch === '#' ? room.pal.wall : ch === 's' ? room.pal.seat : ch === 'P' ? room.pal.water : room.pal.floor,
            border: ch === 's' ? '1px solid rgba(255,255,255,0.12)' : undefined,
          }
          return <span key={`${x}-${y}`} style={style} />
        }),
      )}
      {people(room).map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: p.x * cell + cell * 0.25,
            top: p.y * cell + cell * 0.2,
            width: cell * 0.5,
            height: cell * 0.55,
            background: p.body,
            borderTop: `${Math.max(4, cell * 0.18)}px solid ${p.hair}`,
          }}
        />
      ))}
      <span
        style={{
          position: 'absolute',
          left: room.odd.prop.x * cell + cell * 0.12,
          top: room.odd.prop.y * cell + cell * 0.2,
          width: cell * 0.75,
          height: cell * 0.5,
          background: room.odd.prop.kind === 'tuba' ? '#80602a' : '#c8a24a',
        }}
      />
    </div>
  )
}

function verdict(ms: Measure[]) {
  const n = ms.length
  const sum = (f: (m: Measure) => number) => ms.reduce((a, m) => a + f(m), 0)
  const avgGap = sum((m) => m.gap) / n
  const odd = sum((m) => m.odd)
  const edge = sum((m) => m.edge)
  const wall = sum((m) => m.wall)
  const front = sum((m) => m.front)
  if (odd >= 3) return { type: 'The Anthropologist', definition: `Sat next to the strange one ${odd} times. Came for the people.`, avgGap, odd, edge, wall, front }
  if (avgGap >= 1.5) return { type: 'The Buffer', definition: `Kept ${avgGap.toFixed(1)} empty seats between you and anyone.`, avgGap, odd, edge, wall, front }
  if (avgGap <= 0.5) return { type: 'The Joiner', definition: 'Sat down next to strangers like they had saved you a seat.', avgGap, odd, edge, wall, front }
  if (edge >= 6) return { type: 'The Exit Planner', definition: `One step from the way out in ${edge} of 8 rooms. Nothing happened. It could have.`, avgGap, odd, edge, wall, front }
  if (wall >= 5) return { type: 'The Sentry', definition: `Back to the wall in ${wall} of 8 rooms. Sees everything coming.`, avgGap, odd, edge, wall, front }
  if (front >= 5) return { type: 'The Front Row', definition: `Front third in ${front} of 8 rooms. Here for the content.`, avgGap, odd, edge, wall, front }
  return { type: 'The Median', definition: 'Sat where the average of everyone would sit. Statistically invisible.', avgGap, odd, edge, wall, front }
}

function cardNumber(picks: Pick[]) {
  let h = 412
  picks.forEach((p, i) => {
    h = (h * 31 + p.s.x * 17 + p.s.y * 47 + i * 19) % 10000
  })
  return h.toString().padStart(4, '0')
}

function nearestFreeSeat(r: Room) {
  const door = doorCell(r)
  return seats(r)
    .filter((s) => isFree(r, s.x, s.y))
    .sort((a, b) => cheb(a, door) - cheb(b, door))[0]
}

function renderCardDataUrl(picks: Pick[], v: ReturnType<typeof verdict>, number: string, eggLine: string) {
  const c = document.createElement('canvas')
  c.width = 1080
  c.height = 1350
  const g = c.getContext('2d')
  if (!g) return ''
  g.fillStyle = PAGE
  g.fillRect(0, 0, c.width, c.height)
  const gap = 24
  const slotW = (c.width - gap * 5) / 4
  const slotH = 284
  picks.forEach((pick, i) => {
    const r = ROOMS[i]
    const art = document.createElement('canvas')
    art.width = 8 * ART
    art.height = r.grid.length * ART
    const ag = art.getContext('2d')
    if (!ag) return
    drawRoom(ag, r, { ...emptyAnim(), you: pick.s }, 0)
    const col = i % 4
    const row = Math.floor(i / 4)
    const x = gap + col * (slotW + gap)
    const y = 54 + row * (slotH + gap)
    const scale = Math.min(slotW / art.width, slotH / art.height)
    const w = Math.floor(art.width * scale)
    const h = Math.floor(art.height * scale)
    g.imageSmoothingEnabled = false
    g.drawImage(art, x + (slotW - w) / 2, y + (slotH - h) / 2, w, h)
  })
  const { mono, pixel } = cardFonts()
  const m = CARD_MARGIN
  const maxW = c.width - m * 2
  g.fillStyle = '#8e8a80'
  g.font = `${CARD_MIN}px ${mono}`
  g.fillText(`Seat No. ${number}`, m, 706)
  g.fillStyle = YOU
  let size = 84
  g.font = `${size}px ${pixel}`
  while (size > 56 && g.measureText(v.type).width > maxW) {
    size -= 4
    g.font = `${size}px ${pixel}`
  }
  g.fillText(v.type, m, 792)
  g.fillStyle = '#e8e2d6'
  g.font = `44px ${mono}`
  let y = wrap(g, v.definition, m, 856, maxW, 54) + 22
  g.font = `42px ${mono}`
  const measured = [
    `Average gap to the nearest stranger: ${v.avgGap.toFixed(1)} seats.`,
    `Aisle or end seat: ${v.edge} of 8.`,
    `Sat by the egg man: ${eggLine}.`,
  ]
  for (const line of measured) y = wrap(g, line, m, y, maxW, 52)
  g.fillStyle = '#8e8a80'
  g.font = `${CARD_MIN}px ${mono}`
  g.fillText('wiz.jock.pl', c.width - m - g.measureText('wiz.jock.pl').width, 1292)
  return c.toDataURL('image/png')
}

// Draws the text, wrapped to max, and answers the baseline the next line would use.
function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, line: number) {
  let current = ''
  for (const word of text.split(' ')) {
    const next = current ? `${current} ${word}` : word
    if (g.measureText(next).width > max && current) {
      g.fillText(current, x, y)
      y += line
      current = word
    } else {
      current = next
    }
  }
  if (current) {
    g.fillText(current, x, y)
    y += line
  }
  return y
}

// The card is 1080 wide and a phone shows it about 358 wide, so 40 card pixels is the
// 13 CSS px floor the rest of the page keeps. Nothing on the card is drawn smaller.
const CARD_MIN = 40
const CARD_MARGIN = 56

// next/font gives JetBrains Mono a generated family name, so the canvas has to read it
// from the page instead of guessing. The pixel face is a plain @font-face in globals.css.
function cardFonts() {
  const fallback = { mono: '"JetBrains Mono", monospace', pixel: '"m6x11plus", monospace' }
  try {
    const named = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim()
    return { mono: named ? `${named}, monospace` : fallback.mono, pixel: fallback.pixel }
  } catch {
    return fallback
  }
}

function promptFor(i: number) {
  return ROOMS[i].prompt || 'Pick a seat.'
}

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [canvasOk, setCanvasOk] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [cell, setCell] = useState(44)
  const [idx, setIdx] = useState(0)
  const [caption, setCaption] = useState('Pick a seat.')
  const [phase, setPhase] = useState<Phase>('idle')
  const [slide, setSlide] = useState<Slide>('none')
  const [picks, setPicks] = useState<Pick[]>([])
  const [zoom, setZoom] = useState<number | null>(null)
  const [typedChars, setTypedChars] = useState(0)
  const [resultReveal, setResultReveal] = useState(0)
  const [copyLabel, setCopyLabel] = useState('Copy')
  const [saveLabel, setSaveLabel] = useState('Save card')
  const [cardUrl, setCardUrl] = useState('')
  const [lastType, setLastType] = useState<string | null>(null)
  const anim = useRef<Anim>(emptyAnim())
  const skip = useRef<(() => void) | null>(null)
  const thumbAnims = useRef<MutableRefObject<Anim>[]>(ROOMS.map(() => ({ current: emptyAnim() })))

  const room = ROOMS[idx]
  const result = useMemo(() => (picks.length === ROOMS.length ? verdict(picks.map((p) => p.m)) : null), [picks])
  const number = useMemo(() => cardNumber(picks), [picks])
  const eggLine = picks[7]?.m.odd ? 'yes, and took the egg' : 'never'
  const repeatLine = result && lastType ? `Last time: ${lastType}. ${lastType === result.type ? 'Consistent, at least.' : 'People change.'}` : ''
  const cardText = result
    ? [
        `Seat No. ${number}`,
        result.type,
        result.definition,
        `Average gap to the nearest stranger: ${result.avgGap.toFixed(1)} seats.`,
        `Aisle or end seat: ${result.edge} of 8.`,
        `Sat by the egg man: ${eggLine}.`,
        repeatLine,
      ]
        .filter(Boolean)
        .join('\n')
    : ''

  useEffect(() => {
    setMounted(true)
    const fit = () => setCell(clamp(Math.floor((Math.min(window.innerWidth, 440) - 32) / 8), 36, 52))
    fit()
    window.addEventListener('resize', fit)
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    try {
      setLastType(window.localStorage.getItem(LAST_KEY))
    } catch {}
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    if (phase !== 'idle') return
    const t = window.setTimeout(() => {
      const s = nearestFreeSeat(ROOMS[idx])
      if (s) anim.current.hint = { s, t0: performance.now() }
    }, 8000)
    return () => window.clearTimeout(t)
  }, [phase, idx])

  useEffect(() => {
    if (phase !== 'result' || !result) return
    setTypedChars(0)
    setResultReveal(0)
    const reveal = window.setInterval(() => setResultReveal((v) => (v >= ROOMS.length ? v : v + 1)), 90)
    const type = window.setInterval(() => setTypedChars((v) => (v >= cardText.length ? v : v + 2)), 30)
    try {
      window.localStorage.setItem(LAST_KEY, result.type)
    } catch {}
    return () => {
      window.clearInterval(reveal)
      window.clearInterval(type)
    }
  }, [phase, result, cardText.length])

  useEffect(() => {
    if (phase !== 'result' || !result || !mounted) return
    let live = true
    const draw = () => {
      if (live) setCardUrl(renderCardDataUrl(picks, result, number, eggLine))
    }
    const fonts = document.fonts
    if (fonts && fonts.load) {
      Promise.all([fonts.load('84px "m6x11plus"'), fonts.load(`44px ${cardFonts().mono}`)]).then(draw, draw)
    } else {
      draw()
    }
    return () => {
      live = false
    }
  }, [phase, result, picks, number, eggLine, mounted])

  const failButton = (kind: 'copy' | 'save') => {
    if (kind === 'copy') {
      setCopyLabel('Did not work. Long press the card.')
      window.setTimeout(() => setCopyLabel('Copy'), 3000)
    } else {
      setSaveLabel('Did not work. Long press the card.')
      window.setTimeout(() => setSaveLabel('Save card'), 3000)
    }
  }

  const next = useCallback(
    async (all: Pick[]) => {
      if (idx + 1 >= ROOMS.length) {
        all.forEach((p, i) => {
          thumbAnims.current[i].current = { ...emptyAnim(), you: p.s, overlay: { m: p.m, s: p.s, t0: -1e9 } }
        })
        setPhase('result')
        return
      }
      setPhase('slide')
      setSlide('out')
      await sleep(reduced ? 0 : 320)
      anim.current = emptyAnim()
      setIdx((i) => i + 1)
      setCaption(promptFor(idx + 1))
      setSlide('enter')
      await sleep(reduced ? 0 : 20)
      setSlide('in')
      await sleep(reduced ? 0 : 320)
      setSlide('none')
      setPhase('idle')
    },
    [idx, reduced],
  )

  const onCell = useCallback(
    async (c: Cell) => {
      if (phase === 'hold' && skip.current) {
        skip.current()
        return
      }
      if (phase !== 'idle') return
      anim.current.hint = null
      const r = ROOMS[idx]
      const p = takenBy(r, c.x, c.y)
      if (p || propAt(r, c.x, c.y)) {
        const who = p || r.odd
        anim.current.glanceAt = { p: who, dir: { x: 0, y: 1 }, t0: performance.now() }
        setCaption(who.she ? 'Taken. She has made sure of that.' : 'Taken. He has made sure of that.')
        return
      }
      if (!isFree(r, c.x, c.y)) {
        setCaption('That is the floor. Bold, though.')
        return
      }
      const m = measure(r, c)
      const rx = react(r, idx, c, m)
      const pick = { s: c, m, rx }
      const all = [...picks, pick]
      setPicks(all)
      setPhase('running')
      setCaption('')
      anim.current.flash = { s: c, t0: performance.now() }
      await sleep(reduced ? 0 : 120)
      if (reduced) {
        anim.current = { ...emptyAnim(), you: c, reaction: { ...rx, t0: -1e9 } }
        await sleep(600)
      } else {
        const cells = path(r, c)
        const per = Math.min(85, 1200 / cells.length)
        const t0 = performance.now()
        anim.current.walk = { cells, t0, per }
        anim.current.sitT = t0 + per * (cells.length - 1)
        await sleep(per * cells.length + 60)
        anim.current = { ...emptyAnim(), you: c, reaction: { ...rx, t0: performance.now() } }
        await sleep(rx.kind === 'offer' ? 420 : 300)
      }
      setCaption(rx.line)
      setPhase('hold')
      await new Promise<void>((res) => {
        const t = window.setTimeout(res, reduced ? 600 : 1400)
        skip.current = () => {
          window.clearTimeout(t)
          res()
        }
      })
      skip.current = null
      await next(all)
    },
    [phase, idx, picks, next, reduced],
  )

  const restart = () => {
    anim.current = emptyAnim()
    thumbAnims.current.forEach((a) => {
      a.current = emptyAnim()
    })
    setPicks([])
    setIdx(0)
    setZoom(null)
    setCaption('Pick a seat.')
    setPhase('idle')
    setSlide('none')
    setCardUrl('')
    setCopyLabel('Copy')
    setSaveLabel('Save card')
  }

  const copy = async () => {
    if (!result) return
    const line = result.type === 'The Buffer' ? `Kept ${result.avgGap.toFixed(1)} empty seats between me and anyone.` : result.definition
    const text = [`Pick A Seat. ${result.type}.`, line, `Aisle or end seat ${result.edge} of 8. Sat by the egg man: ${eggLine}.`, 'wiz.jock.pl/experiments/pick-a-seat'].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyLabel('Copied.')
      window.setTimeout(() => setCopyLabel('Copy'), 1800)
    } catch {
      failButton('copy')
    }
  }

  const save = async () => {
    if (!cardUrl) {
      failButton('save')
      return
    }
    try {
      const blob = await (await fetch(cardUrl)).blob()
      const file = new File([blob], `pick-a-seat-${number}.png`, { type: 'image/png' })
      const shareNav = navigator as Navigator & { canShare?: (data: ShareData) => boolean }
      if (navigator.share && (!shareNav.canShare || shareNav.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: 'Pick A Seat' })
      } else {
        const a = document.createElement('a')
        a.href = cardUrl
        a.download = `pick-a-seat-${number}.png`
        a.click()
      }
      setSaveLabel('Saved.')
      window.setTimeout(() => setSaveLabel('Save card'), 1800)
    } catch {
      failButton('save')
    }
  }

  const expand = (i: number) => {
    if (zoom === i) {
      setZoom(null)
      return
    }
    const p = picks[i]
    if (p) thumbAnims.current[i].current = { ...emptyAnim(), you: p.s, reaction: { ...p.rx, t0: performance.now() }, overlay: { m: p.m, s: p.s, t0: -1e9 } }
    setZoom(i)
  }

  if (!canvasOk) {
    return (
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b10] px-6 font-mono text-[15px] text-[#e8e2d6]">
        This needs a canvas. Your browser said no.
      </main>
    )
  }

  if (phase === 'result' && result) {
    const thumb = clamp(Math.floor((Math.min(cell * 8, 400) - 18) / 4 / 8), 9, 12)
    const typed = cardText.slice(0, typedChars)
    return (
      <main className="fixed inset-0 z-50 overflow-y-auto bg-[#0b0b10] font-mono text-[#e8e2d6]" data-phase="result">
        <div className="mx-auto flex max-w-[440px] flex-col items-center px-4 pt-5 pb-10">
          <div className="flex w-full items-center justify-between">
            <span className="font-pixel text-[20px] text-[#8e8a80]">Pick A Seat</span>
            <span className="font-pixel text-[13px] text-[#8e8a80]">8 / 8</span>
          </div>
          <div className="mt-4 grid w-full grid-cols-4 gap-[6px]">
            {ROOMS.map((r, i) => (
              <button
                key={r.name}
                className="flex items-center justify-center border border-[#24242e] bg-[#111119] p-0 transition"
                style={{ opacity: i < resultReveal ? 1 : 0, transform: i < resultReveal ? 'scale(1)' : 'scale(0.72)' }}
                onClick={() => expand(i)}
                aria-label={r.name}
              >
                <RoomCanvas room={r} cell={thumb} anim={thumbAnims.current[i]} idleOutline={false} reduced={reduced} onCanvasError={() => setCanvasOk(false)} />
              </button>
            ))}
          </div>
          {zoom !== null && (
            <div className="mt-4 flex w-full flex-col items-center border border-[#2d2b36] bg-[#111119] p-2">
              <RoomCanvas room={ROOMS[zoom]} cell={Math.floor(cell * 0.82)} anim={thumbAnims.current[zoom]} idleOutline={false} reduced={reduced} showOverlay onCanvasError={() => setCanvasOk(false)} />
              <div className="mt-2 text-center text-[15px] leading-snug">{picks[zoom].rx.line}</div>
            </div>
          )}
          <div className="mt-5 min-h-[244px] w-full whitespace-pre-line text-[15px] leading-relaxed text-[#e8e2d6]">
            {typed.split('\n').map((line, i) => (
              <div key={i} className={i === 1 ? 'font-pixel text-[40px] leading-none text-[#ffd23f]' : i === 0 ? 'text-[13px] text-[#8e8a80]' : ''}>
                {line || ' '}
              </div>
            ))}
          </div>
          {cardUrl && <img src={cardUrl} alt="Pick A Seat card" className="mt-4 w-full border border-[#24242e]" draggable={false} />}
          <div className="mt-4 flex w-full flex-col gap-2">
            <button className="h-[52px] w-full border border-[#8e8a80] px-3 text-[15px]" onClick={save}>
              {saveLabel}
            </button>
            <button className="h-[52px] w-full border border-[#8e8a80] px-3 text-[15px]" onClick={copy}>
              {copyLabel}
            </button>
            <button className="h-[52px] w-full border border-[#ffd23f] px-3 text-[15px] text-[#ffd23f]" onClick={restart}>
              Sit again
            </button>
          </div>
        </div>
      </main>
    )
  }

  const tr = slide === 'out' ? 'translateY(-110%)' : slide === 'enter' ? 'translateY(110%)' : 'translateY(0)'
  return (
    <main
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col items-center overflow-hidden bg-[#0b0b10] font-mono text-[#e8e2d6]"
      data-phase={phase}
      data-room={idx}
      onPointerDown={() => {
        if (phase === 'hold' && skip.current) skip.current()
      }}
    >
      <div className="flex h-10 w-full max-w-[440px] shrink-0 items-center justify-between px-4">
        <span className="font-pixel text-[20px]">Pick A Seat</span>
        <span className="font-pixel text-[13px] text-[#8e8a80]">{idx + 1} / 8</span>
      </div>
      <div className="flex w-full items-start justify-center pt-2">
        <div
          style={{
            transform: tr,
            opacity: slide === 'out' || slide === 'enter' ? 0 : 1,
            transition: reduced || slide === 'enter' || slide === 'none' ? 'none' : 'transform 320ms cubic-bezier(.2,.8,.2,1), opacity 320ms',
          }}
        >
          {mounted ? (
            <RoomCanvas key={idx} room={room} cell={cell} anim={anim} idleOutline={phase === 'idle'} reduced={reduced} onCell={onCell} onCanvasError={() => setCanvasOk(false)} />
          ) : (
            <StaticRoom room={ROOMS[0]} cell={cell} />
          )}
        </div>
      </div>
      <div className="mt-2 flex h-12 w-full max-w-[440px] shrink-0 items-center justify-center px-4 text-center text-[15px] leading-snug" data-caption>
        {caption}
      </div>
      <div className="h-3 shrink-0" />
    </main>
  )
}
