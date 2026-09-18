'use client';

// THE LAST ONES GO FIRST  (the end of a list is held somewhere else, and fourteen seconds of
// arithmetic is enough to empty it)
//
// The seventieth piece in this lab, and the second one that goes back and takes apart a page
// this site already had. Two Ways To Be Fast went back for Reaction Time. This one goes back
// for Serial Position Effect, which showed fifteen words, asked for them back, drew your curve
// against a canned textbook curve, and then spent four paragraphs describing the Glanzer and
// Cunitz experiment without ever running it. Describing a manipulation is not measuring one.
// This page runs it.
//
// THE TASK.
//
// Twelve unrelated words arrive one at a time. Then you type back as many as you can, in any
// order you like. That is free recall, it is what Murdock used in 1962 (Journal of Experimental
// Psychology 64, 482), and everybody who does it produces the same U: the first few words come
// back, the last few come back best of all, and the middle sags.
//
// THE QUESTION, which the U on its own cannot answer.
//
// Two humps could be one mechanism with two good positions in it, or two mechanisms. A curve
// cannot tell you which, however pretty it is. What can tell you is a manipulation that moves
// one hump and leaves the other alone, and then a second manipulation that does the opposite.
// That is a DOUBLE DISSOCIATION, and it is the only reason anybody believes there are two
// stores rather than one:
//
//   a filled delay      fourteen seconds of arithmetic between the last word and the first
//                       keystroke. Recency goes. Primacy does not move.
//                       (Glanzer and Cunitz, JVLVB 5, 351, 1966; Postman and Phillips 1965)
//
//   a slower rate       each word on screen three times as long. Primacy rises, because the
//                       early words get more rehearsal while the list is still short.
//                       Recency does not move.
//                       (Murdock 1962; Glanzer and Cunitz 1966; Rundus 1971 counted the
//                       rehearsals out loud and found exactly the gradient)
//
// Two knobs, two humps, and each knob is supposed to reach exactly one of them.
//
// WHAT THE HEADLINE ACTUALLY IS, because this matters more than it sounds.
//
// The naive version of a dissociation is "the delay changed recency (p small) and did not
// change primacy (p large)". That is not evidence, it is two separate failures to be sure,
// dressed up as a finding. A non-significant result is not a measured zero, and a page in this
// lab is not allowed to pretend otherwise.
//
// So the headline is a DIFFERENCE OF DIFFERENCES, one number, with the untouched hump inside
// it rather than in a footnote:
//
//   delay        (recency lost to the delay) minus (primacy lost to the delay)
//   rate         (primacy gained from the slow rate) minus (recency gained from the slow rate)
//
// Each is positive only if the knob moved its own hump MORE than it moved the other one, which
// is a claim a confidence interval can actually carry. Both come with a bootstrap interval over
// lists and an EXACT permutation null: with six lists on each side of a contrast there are nine
// hundred and twenty four ways to relabel them, and all of them are enumerated rather than
// sampled.
//
// THE HELD-OUT BLOCK, where two rivals commit to a number before it opens.
//
// Eighteen lists are fitted. Then the page stops, fits two models to those lists, prints what
// each one predicts for a condition NOBODY HAS RUN YET, and only then runs it. The unseen
// condition is slow presentation plus the filled delay, both knobs at once.
//
//   ONE STORE      there is a single memory strength. Both knobs change how strong the trace
//                  is, and the SHAPE of the curve belongs to the list rather than to the store.
//                  Fitted with one shape shared across all three fitted conditions and one
//                  level per condition. It predicts the recency hump is still there in the
//                  last block, sitting on a shifted level.
//
//   TWO STORES     recency is a separate short-lived store that a filled delay empties, and
//                  everything else is a longer-lived store that rehearsal feeds. Fitted so the
//                  level and the primacy term answer only to RATE and the recency term answers
//                  only to DELAY. It predicts the recency hump is gone in the last block, and
//                  the primacy end is the tall one from the slow immediate block.
//
// Both numbers go on the screen, both carry their own bootstrap intervals, and the block is
// scored directionally: an interval has to CLEAR the other interval. Landing nearer one number
// than the other is not a result, and this lab nearly shipped that bias once already.
//
// If the two rivals do not commit to different enough numbers, the page says so and declines
// to pick one. That is a real outcome and it is printed as one.
//
// WHAT ELSE COULD EXPLAIN IT, measured rather than argued.
//
//   practice and fatigue    the held-out block is last, so an hour of practice is pushing on
//                           it. Two extra fast immediate lists run AFTER it, so the session
//                           drift is a number on the results rather than a worry. And every
//                           headline is a contrast WITHIN one curve, which a level shift
//                           cannot manufacture.
//
//   order                   the twelve fitted lists are interleaved in random order, never
//                           blocked, so practice lands on the three fitted conditions equally.
//
//   the distractor          fourteen seconds of arithmetic is only a filled delay if you fill
//                           it. Every answer is scored, and a list whose delay was not filled
//                           is dropped rather than analysed.
//
//   typing                  every condition is typed the same way with the same clock, so the
//                           cost of typing cancels in every contrast on this page.
//
// WHY YOUR SCREEN CANNOT REACH ANY OF THIS.
//
// The headline never reads a clock. Serial position is an integer, recall is a count, and every
// number on the results is a difference between two positions inside the same curve or the same
// difference measured under two conditions. Display lag, input lag, keyboard scan interval and
// typing speed apply identically to all four conditions and cancel exactly.
//
// The rate knob needs only to be ORDERED, not accurate: the slow slot asks for three times the
// fast one, and the page meters what it actually got from frame timestamps and prints the ratio
// it achieved. The delay knob needs only to be long and full, not exact. There is no calibration
// step because there is nothing to calibrate. A busy browser can make a list arrive late; it
// cannot make position twelve behave differently from position six in one condition and not in
// another. Frame gaps during presentation are still metered and a list interrupted by a long one
// is dropped, because a word that flashed past while the browser was busy was never presented.
//
// VERIFIED AGAINST GROUND TRUTH before shipping, in Node, on the analysis core extracted from
// this file, 150 simulated visitors per world at the shipping list counts. The simulator is a
// rehearsal-fed store plus a short buffer, deliberately NOT the model that gets fitted, so a
// good recovery is not the fit marking its own homework.
//
//   knob one, delay       called it in 79 percent of runs in a world where two stores is true,
//                         46 percent when the delay only half empties the buffer, and 6 and 3
//                         percent in the two worlds where it is false. The permutation null
//                         agrees to within two points everywhere, so the interval is honest.
//
//   knob two, rate        26 percent in the strong world. This half is UNDERPOWERED and the page
//                         says so rather than hiding it: the rate effect on primacy is genuinely
//                         about a third the size of the delay effect on recency, and one person
//                         in twenty minutes cannot buy it. False positives 5 and 1 percent.
//
//   held-out block        picked two stores on 33 percent of runs in a world where it is true
//                         and picked wrongly on 0.7 percent. In a one store world it picked one
//                         store on 5 percent and never picked two. In a world where nothing
//                         differs at all it decided 1.3 percent of the time. That is a referee
//                         that mostly says it cannot tell and almost never says something false,
//                         which is the trade this page wants.
//
//   interval coverage     the recency advantage of the held-out block was inside its own
//                         bootstrap interval 88 to 93 percent of the time against a nominal 95,
//                         printed as measured rather than rounded up.
//
//   the two rivals        recovered the truth they were pointed at: in the weak world the two
//                         store rival predicted 0.104 against a truth of 0.104, and in the
//                         strong one it predicted -0.030 against -0.049.
//
// Eight responders were run against the refusal ladder, 60 runs each. An honest visitor passed
// 60 of 60 at three different ability levels including an unusually good one. A pen and paper,
// random guessing, a hidden tab, typing during presentation and ignoring the arithmetic were
// each refused with the true cause named.
//
// TWO THINGS THE SIMULATION CHANGED, both worth keeping. The one store rival was first fitted
// with its shared shape across all three blocks including the delayed one, which dragged its
// recency term down and left it half agreeing with its opponent before the held-out block even
// opened; fitting the shape to the immediate blocks only is both fairer to it and the difference
// between two predictions 0.21 apart and 0.32 apart. And each headline was first measured on one
// pair of blocks instead of both, which threw away half the session: turning the same knob at
// both settings of the other one and averaging took the delay call from 62 percent to 79.
//
// THE PEN RAIL is the interesting guard. Twelve words at half a second each do not come back
// whole, and the middle of the list does not come back at all. So a run with a full middle is
// not a large memory, it is a written copy, and the page refuses it and names that as the cause.
// A second tell is free: honest immediate recall starts at the END of the list, and a copied
// list is read out from the top. Both are checked.
//
// Everything runs in your browser. Nothing is recorded. Nothing leaves the page.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

// ============================ constants ============================

const LIST_N = 12;
const PRACTICE_N = 8;

const FAST_ON = 400;
const FAST_GAP = 100;
const SLOW_ON = 1250;
const SLOW_GAP = 250;
const FAST_SLOT = FAST_ON + FAST_GAP;   // 500
const SLOW_SLOT = SLOW_ON + SLOW_GAP;   // 1500, exactly three times the fast one

const DISTRACT_MS = 14000;
const PRACTICE_DISTRACT_MS = 8000;
const RECALL_MS = 20000;
const READY_HOLD_MS = 700;
const FB_MS = 900;

const PER_FITTED = 6;   // lists per fitted condition
const HELD_N = 10;      // lists in the held-out block, and it is the biggest block on purpose
const LATE_N = 2;       // fast immediate lists after it, as the drift anchor

// Serial position bands. Fixed here, before any data, and never tuned.
const PRI = [0, 1, 2];
const MID = [3, 4, 5, 6, 7, 8];
const REC = [9, 10, 11];

// Basis shapes for the curve model. Also fixed before any data: the models are allowed to
// argue about how BIG the primacy and recency terms are, never about their shape.
const TAU_P = 1.6;
const TAU_R = 1.1;

const BOOTS = 500;
const PERM_CAP = 20000;
const MAX_GAP_MS = 250;

// refusal rails
const MIN_LISTS_PER_COND = 3;
const MAX_VOID_FRAC = 0.3;
const MIN_OVERALL = 0.12;
const MAX_MIDDLE = 0.8;
const MAX_TYPED_LISTS = 3;
const MIN_DISTRACT_ANSWERS = 5;
const MIN_DISTRACT_ACC = 0.6;

// The two rivals count as telling apart only if the gap they committed to clears zero AND is big
// enough to mean anything. Without the floor, a run near ceiling makes both models predict almost
// the same saturated curve, the gap comes out at a numerically nonzero fraction of a point, and
// the separability check fires on arithmetic noise while the screen reads "0 to 0".
const MIN_SEP = 0.03;

// ============================ the words ============================
// Short concrete nouns, three to seven letters, so that typing them back costs about the same
// everywhere and costs little. Sampled without replacement across the whole session, so no word
// is ever seen twice and there is no proactive interference to argue about.

const POOL = [
  'apple', 'arrow', 'bacon', 'badge', 'ball', 'band', 'bank', 'barn', 'basket', 'bath',
  'beach', 'bead', 'beam', 'bean', 'bear', 'beard', 'bed', 'bell', 'belt', 'bench',
  'berry', 'bike', 'bird', 'blade', 'board', 'boat', 'bolt', 'bone', 'book', 'boot',
  'bottle', 'bowl', 'box', 'brain', 'branch', 'brass', 'bread', 'brick', 'bridge', 'broom',
  'brush', 'bucket', 'bulb', 'bull', 'bus', 'bush', 'butter', 'button', 'cabin', 'cable',
  'cage', 'cake', 'camel', 'camera', 'candle', 'cane', 'cap', 'car', 'card', 'carpet',
  'carrot', 'cart', 'castle', 'cat', 'chain', 'chair', 'chalk', 'cheese', 'cherry', 'chest',
  'chin', 'church', 'cigar', 'circle', 'city', 'clam', 'clay', 'cliff', 'cloak', 'clock',
  'cloth', 'cloud', 'clover', 'coal', 'coast', 'coat', 'coin', 'collar', 'comb', 'cone',
  'cord', 'cork', 'corn', 'couch', 'cow', 'crab', 'crack', 'crane', 'crate', 'cream',
  'crew', 'crown', 'crumb', 'cup', 'dagger', 'dam', 'deer', 'desk', 'dish', 'dock',
  'dog', 'doll', 'dome', 'donkey', 'door', 'dove', 'dragon', 'drain', 'drawer', 'dress',
  'drill', 'drum', 'duck', 'dust', 'eagle', 'ear', 'earth', 'egg', 'elbow', 'engine',
  'fabric', 'face', 'fan', 'farm', 'fence', 'fern', 'ferry', 'field', 'film', 'finger',
  'fire', 'fish', 'flag', 'flame', 'flask', 'flea', 'flood', 'floor', 'flour', 'flower',
  'flute', 'foam', 'fog', 'foot', 'forest', 'fork', 'fox', 'frame', 'frog', 'fruit',
  'fur', 'garden', 'gate', 'ghost', 'giant', 'ginger', 'glass', 'glove', 'glue', 'goat',
  'gold', 'goose', 'grape', 'grass', 'grave', 'gravel', 'groove', 'guitar', 'gun', 'hair',
  'hammer', 'hand', 'handle', 'harbor', 'hat', 'hawk', 'hay', 'head', 'heart', 'hedge',
  'heel', 'helmet', 'hen', 'herb', 'hill', 'hinge', 'hive', 'hole', 'honey', 'hood',
  'hook', 'horn', 'horse', 'hose', 'house', 'ice', 'ink', 'insect', 'iron', 'island',
  'ivory', 'jacket', 'jar', 'jaw', 'jelly', 'jewel', 'judge', 'jug', 'juice', 'kettle',
  'key', 'kite', 'knee', 'knife', 'knight', 'knot', 'ladder', 'lake', 'lamb', 'lamp',
  'lawn', 'leaf', 'leg', 'lemon', 'lens', 'letter', 'lever', 'lid', 'light', 'lime',
  'lion', 'lip', 'lizard', 'lock', 'log', 'magnet', 'mail', 'mane', 'map', 'marble',
  'mask', 'mast', 'mat', 'meadow', 'meat', 'medal', 'melon', 'metal', 'milk', 'mill',
  'mirror', 'mist', 'mitten', 'monkey', 'moon', 'mop', 'moss', 'moth', 'mouse', 'mouth',
  'mud', 'mug', 'mule', 'nail', 'neck', 'needle', 'nest', 'net', 'nose', 'note',
  'nurse', 'nut', 'oak', 'oar', 'ocean', 'oil', 'onion', 'orange', 'otter', 'oven',
  'owl', 'ox', 'packet', 'paddle', 'page', 'pail', 'paint', 'palace', 'palm', 'pan',
  'paper', 'parcel', 'park', 'parrot', 'path', 'paw', 'pea', 'peach', 'pearl', 'pebble',
  'pen', 'pencil', 'penny', 'pepper', 'piano', 'pie', 'pig', 'pigeon', 'pill', 'pillow',
  'pilot', 'pin', 'pine', 'pipe', 'pirate', 'pit', 'plank', 'plant', 'plate', 'plum',
  'pocket', 'pole', 'pond', 'pony', 'pool', 'porch', 'pot', 'potato', 'pouch', 'powder',
  'prince', 'print', 'prison', 'pump', 'pupil', 'puppy', 'purse', 'quilt', 'rabbit', 'radish',
  'raft', 'rail', 'rain', 'rake', 'ranch', 'rat', 'razor', 'ribbon', 'rice', 'ring',
  'river', 'road', 'robe', 'robin', 'rock', 'rocket', 'rod', 'roof', 'room', 'root',
  'rope', 'rose', 'rug', 'ruler', 'sack', 'saddle', 'sail', 'salad', 'salt', 'sand',
  'sauce', 'saucer', 'saw', 'scarf', 'school', 'screw', 'sea', 'seal', 'seat', 'seed',
  'shade', 'shark', 'shed', 'sheep', 'sheet', 'shelf', 'shell', 'shield', 'ship', 'shirt',
  'shoe', 'shop', 'shore', 'shovel', 'shrimp', 'sink', 'skate', 'skin', 'skirt', 'sky',
  'slate', 'sled', 'sleeve', 'smoke', 'snail', 'snake', 'snow', 'soap', 'sock', 'sofa',
  'soil', 'soup', 'spade', 'spark', 'spear', 'spice', 'spider', 'sponge', 'spool', 'spoon',
  'spring', 'square', 'squid', 'stable', 'stage', 'stairs', 'stamp', 'star', 'statue', 'steam',
  'steel', 'stem', 'step', 'stick', 'stone', 'stool', 'stove', 'straw', 'stream', 'street',
  'string', 'sugar', 'suit', 'sun', 'swamp', 'swan', 'swing', 'sword', 'table', 'tail',
  'tank', 'tape', 'teapot', 'tent', 'thread', 'throne', 'thumb', 'ticket', 'tiger', 'tile',
  'tin', 'toast', 'toe', 'tomato', 'tongue', 'tooth', 'torch', 'tower', 'town', 'toy',
  'track', 'train', 'tray', 'tree', 'trout', 'trumpet', 'trunk', 'tub', 'tube', 'tulip',
  'tunnel', 'turkey', 'turnip', 'turtle', 'twig', 'valley', 'van', 'vase', 'veil', 'velvet',
  'vest', 'vine', 'violin', 'wagon', 'waist', 'wall', 'wallet', 'walnut', 'wasp', 'watch',
  'water', 'wave', 'wax', 'weed', 'whale', 'wheat', 'wheel', 'whip', 'window', 'wing',
  'wire', 'wolf', 'wood', 'wool', 'worm', 'wrist', 'yard', 'yarn', 'zebra', 'anchor',
];

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function mean(a: number[]) {
  if (!a.length) return NaN;
  let s = 0;
  for (const v of a) s += v;
  return s / a.length;
}
function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
function ciOf(v: number[]): [number, number] {
  const s = v.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (s.length < 8) return [NaN, NaN];
  return [quantile(s, 0.025), quantile(s, 0.975)];
}
function sig(x: number) {
  const z = clamp(x, -14, 14);
  return 1 / (1 + Math.exp(-z));
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(a: T[], rnd: () => number): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function editWithin1(a: string, b: string) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, diff = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    diff++;
    if (diff > 1) return false;
    if (la === lb) { i++; j++; }
    else if (la > lb) i++;
    else j++;
  }
  if (i < la || j < lb) diff++;
  return diff <= 1;
}

// ============================ ANALYSIS CORE ============================
// Everything between here and the end of the core is what was extracted and run against
// simulated ground truth in Node before this page shipped. It is pure: lists in, numbers out.

export type Cond = 'fastNow' | 'slowNow' | 'fastWait' | 'slowWait';

export const FITTED_CONDS: Cond[] = ['fastNow', 'slowNow', 'fastWait'];

export type ListTrial = {
  cond: Cond;
  order: number;              // where it sat in the session
  recalled: boolean[];        // one flag per serial position, length LIST_N
  outputPos: number[];        // serial positions in the order they were typed back
  intrusions: number;         // words that were in no list of this session
  priorIntrusions: number;    // words from an EARLIER list of this session
  dead: boolean;              // dropped before analysis
  deadWhy: string;
  typedDuring: boolean;
  gapped: boolean;
  hidden: boolean;
  distractN: number;
  distractOk: number;
  askedMs: number;            // how long the presentation asked for
  presentMs: number;          // and how long it actually took
  late: boolean;              // one of the anchor lists that ran after the held-out block
};

export type Bands = { pri: number; mid: number; rec: number; priAdv: number; recAdv: number };

export function bandsOf(lists: boolean[][]): Bands {
  if (!lists.length) return { pri: NaN, mid: NaN, rec: NaN, priAdv: NaN, recAdv: NaN };
  const grab = (ix: number[]) => {
    const vals: number[] = [];
    for (const l of lists) for (const i of ix) vals.push(l[i] ? 1 : 0);
    return mean(vals);
  };
  const pri = grab(PRI), mid = grab(MID), rec = grab(REC);
  return { pri, mid, rec, priAdv: pri - mid, recAdv: rec - mid };
}

export function liveLists(trials: ListTrial[], cond: Cond, late?: boolean): boolean[][] {
  return trials
    .filter((t) => !t.dead && t.cond === cond && (late === undefined || t.late === late))
    .map((t) => t.recalled);
}

// The two headlines. Each is a difference of differences, so the hump that is supposed to stay
// still is inside the number rather than in a separate significance test that failed.

export function dissocDelay(now: boolean[][], wait: boolean[][]): number {
  const a = bandsOf(now), b = bandsOf(wait);
  return (a.recAdv - b.recAdv) - (a.priAdv - b.priAdv);
}
export function dissocRate(slow: boolean[][], fast: boolean[][]): number {
  const a = bandsOf(slow), b = bandsOf(fast);
  return (a.priAdv - b.priAdv) - (a.recAdv - b.recAdv);
}

// The same knob turned at both settings of the other knob, averaged. This is what doubles the
// evidence behind each headline: the delay contrast exists at the fast rate AND at the slow one,
// and averaging the two uses every list in the session instead of half of them. Both halves are
// printed separately on the results, because if they disagree that is worth seeing.
export type Pair = { a: boolean[][]; b: boolean[][] };

export function pooled(pairs: Pair[], stat: (a: boolean[][], b: boolean[][]) => number): number {
  const v = pairs.map((p) => stat(p.a, p.b)).filter(Number.isFinite);
  return v.length ? mean(v) : NaN;
}

// Permutation null, stratified: labels are shuffled WITHIN each setting of the other knob, never
// across it, because the other knob really does change things and pretending otherwise would test
// a null nobody claims. When one stratum is small enough the enumeration is exhaustive.
export function permPooled(
  pairs: Pair[], stat: (a: boolean[][], b: boolean[][]) => number, rnd: () => number, reps = 4000,
): { p: number; exact: boolean; n: number } {
  const obs = pooled(pairs, stat);
  if (!Number.isFinite(obs) || pairs.some((p) => p.a.length < 2 || p.b.length < 2)) {
    return { p: NaN, exact: false, n: 0 };
  }
  const draws: number[] = [];
  for (let r = 0; r < reps; r++) {
    const shuffledPairs = pairs.map((p) => {
      const all = shuffled(p.a.concat(p.b), rnd);
      return { a: all.slice(0, p.a.length), b: all.slice(p.a.length) };
    });
    const v = pooled(shuffledPairs, stat);
    if (Number.isFinite(v)) draws.push(v);
  }
  const hits = draws.filter((v) => v >= obs - 1e-12).length;
  return { p: (hits + 1) / (draws.length + 1), exact: false, n: draws.length };
}

export function bootPooled(
  pairs: Pair[], stat: (a: boolean[][], b: boolean[][]) => number, reps: number, rnd: () => number,
): number[] {
  const out: number[] = [];
  for (let r = 0; r < reps; r++) {
    const rs = pairs.map((p) => ({
      a: Array.from({ length: p.a.length }, () => p.a[Math.floor(rnd() * p.a.length)]),
      b: Array.from({ length: p.b.length }, () => p.b[Math.floor(rnd() * p.b.length)]),
    }));
    const v = pooled(rs, stat);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

function bootPair(
  A: boolean[][], B: boolean[][], stat: (a: boolean[][], b: boolean[][]) => number,
  reps: number, rnd: () => number,
): number[] {
  const out: number[] = [];
  if (A.length < 2 || B.length < 2) return out;
  for (let r = 0; r < reps; r++) {
    const ra = Array.from({ length: A.length }, () => A[Math.floor(rnd() * A.length)]);
    const rb = Array.from({ length: B.length }, () => B[Math.floor(rnd() * B.length)]);
    const v = stat(ra, rb);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

// Exact permutation null. With four lists a side there are seventy relabelings and every one of
// them is enumerated, so the p value is exact rather than sampled. If a run lost enough lists
// that the enumeration would be large, it falls back to sampling and says so.
export function permP(
  A: boolean[][], B: boolean[][], stat: (a: boolean[][], b: boolean[][]) => number,
  rnd: () => number,
): { p: number; exact: boolean; n: number } {
  const obs = stat(A, B);
  const all = A.concat(B);
  const nA = A.length, n = all.length;
  if (!Number.isFinite(obs) || nA < 2 || B.length < 2) return { p: NaN, exact: false, n: 0 };
  let total = 1;
  for (let i = 0; i < nA; i++) total = (total * (n - i)) / (i + 1);
  total = Math.round(total);
  const ge: number[] = [];
  if (total <= PERM_CAP) {
    const idx = Array.from({ length: nA }, (_, i) => i);
    const step = () => {
      const pick = new Set(idx);
      const a: boolean[][] = [], b: boolean[][] = [];
      for (let i = 0; i < n; i++) (pick.has(i) ? a : b).push(all[i]);
      const v = stat(a, b);
      if (Number.isFinite(v)) ge.push(v);
    };
    // walk every subset of size nA in lexicographic order
    for (;;) {
      step();
      let i = nA - 1;
      while (i >= 0 && idx[i] === n - nA + i) i--;
      if (i < 0) break;
      idx[i]++;
      for (let j = i + 1; j < nA; j++) idx[j] = idx[j - 1] + 1;
    }
    const hits = ge.filter((v) => v >= obs - 1e-12).length;
    return { p: hits / ge.length, exact: true, n: ge.length };
  }
  const reps = 3000;
  for (let r = 0; r < reps; r++) {
    const sh = shuffled(all, rnd);
    const v = stat(sh.slice(0, nA), sh.slice(nA));
    if (Number.isFinite(v)) ge.push(v);
  }
  const hits = ge.filter((v) => v >= obs - 1e-12).length;
  return { p: (hits + 1) / (ge.length + 1), exact: false, n: ge.length };
}

// ---------------- the curve models ----------------

export function pBasis(i: number) { return Math.exp(-i / TAU_P); }
export function rBasis(i: number) { return Math.exp(-(LIST_N - 1 - i) / TAU_R); }

type Cell = { x: number[]; k: number; n: number };

function solveSym(Ain: number[][], bin: number[]): number[] | null {
  const p = bin.length;
  const A = Ain.map((r) => r.slice());
  const b = bin.slice();
  for (let c = 0; c < p; c++) {
    let piv = c;
    for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    if (Math.abs(A[piv][c]) < 1e-12) return null;
    if (piv !== c) { [A[piv], A[c]] = [A[c], A[piv]]; [b[piv], b[c]] = [b[c], b[piv]]; }
    for (let r = c + 1; r < p; r++) {
      const f = A[r][c] / A[c][c];
      if (!f) continue;
      for (let k = c; k < p; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const out = new Array(p).fill(0);
  for (let r = p - 1; r >= 0; r--) {
    let s = b[r];
    for (let k = r + 1; k < p; k++) s -= A[r][k] * out[k];
    out[r] = s / A[r][r];
  }
  return out.every(Number.isFinite) ? out : null;
}

function irls(cells: Cell[], p: number, ridge = 0.05, iters = 60): number[] {
  const b = new Array(p).fill(0);
  for (let it = 0; it < iters; it++) {
    const g = new Array(p).fill(0);
    const H = Array.from({ length: p }, () => new Array(p).fill(0));
    for (const c of cells) {
      if (c.n <= 0) continue;
      let eta = 0;
      for (let j = 0; j < p; j++) eta += c.x[j] * b[j];
      const pr = sig(eta);
      const w = c.n * pr * (1 - pr) + 1e-9;
      const res = c.k - c.n * pr;
      for (let j = 0; j < p; j++) {
        g[j] += c.x[j] * res;
        for (let l = 0; l < p; l++) H[j][l] += c.x[j] * c.x[l] * w;
      }
    }
    for (let j = 0; j < p; j++) { g[j] -= ridge * b[j]; H[j][j] += ridge; }
    const step = solveSym(H, g);
    if (!step) break;
    let mx = 0;
    for (let j = 0; j < p; j++) {
      const d = clamp(step[j], -4, 4);
      b[j] = clamp(b[j] + d, -20, 20);
      mx = Math.max(mx, Math.abs(d));
    }
    if (mx < 1e-8) break;
  }
  return b;
}

function countsOf(lists: boolean[][]): { k: number; n: number }[] {
  const out = Array.from({ length: LIST_N }, () => ({ k: 0, n: 0 }));
  for (const l of lists) for (let i = 0; i < LIST_N; i++) { out[i].n++; if (l[i]) out[i].k++; }
  return out;
}

export type Rival = {
  eta: number[];        // predicted logit per serial position, for the held-out condition
  p: number[];          // and as probabilities
  recAdv: number;
  priAdv: number;
  devFitted: number;    // deviance per item on the blocks it was fitted on
};

// ONE STORE. One shape for the whole session, one level per condition.
//
// The shape is fitted to the two IMMEDIATE conditions only, and this is the fair version rather
// than the convenient one. If the shape were fitted across all three blocks, the delayed block
// would drag the recency term down and the rival would arrive at the held-out block already
// half agreeing with its opponent, which is not what a one store account says and made the two
// predictions nearly indistinguishable when it was tried. What a one store account says is that
// the curve has one shape, which belongs to the list, and that a delay lowers the whole thing.
// So the delayed block buys it exactly one number, its level, fitted with the shape held fixed,
// and the unseen condition gets the level the two knobs add up to.
export function fitOneStore(by: Record<Cond, boolean[][]>): Rival {
  const now: Cell[] = [];
  (['fastNow', 'slowNow'] as Cond[]).forEach((c, ci) => {
    const cnt = countsOf(by[c]);
    for (let i = 0; i < LIST_N; i++) {
      const x = [0, 0, pBasis(i), rBasis(i)];
      x[ci] = 1;
      now.push({ x, k: cnt[i].k, n: cnt[i].n });
    }
  });
  const bn = irls(now, 4);
  const [a1, a2, bp, br] = bn;

  // the delayed block buys one number and nothing else
  const cntW = countsOf(by.fastWait);
  let a3 = a1;
  for (let it = 0; it < 60; it++) {
    let g = 0, h = 1e-9;
    for (let i = 0; i < LIST_N; i++) {
      const pr = sig(a3 + bp * pBasis(i) + br * rBasis(i));
      g += cntW[i].k - cntW[i].n * pr;
      h += cntW[i].n * pr * (1 - pr);
    }
    const step = clamp(g / h, -3, 3);
    a3 = clamp(a3 + step, -20, 20);
    if (Math.abs(step) < 1e-9) break;
  }

  const a4 = a2 + a3 - a1;                       // slowNow + fastWait - fastNow
  const eta = Array.from({ length: LIST_N }, (_, i) => a4 + bp * pBasis(i) + br * rBasis(i));

  const cells: Cell[] = [];
  (FITTED_CONDS).forEach((c) => {
    const cnt = countsOf(by[c]);
    const lvl = c === 'fastNow' ? a1 : c === 'slowNow' ? a2 : a3;
    for (let i = 0; i < LIST_N; i++) {
      cells.push({ x: [1, pBasis(i), rBasis(i)], k: cnt[i].k, n: cnt[i].n });
      cells[cells.length - 1].x[0] = 1;
      cells[cells.length - 1].x = [lvl, pBasis(i), rBasis(i)];
    }
  });
  return finishRival(eta, cells, [1, bp, br]);
}

// TWO STORES. Level and primacy answer only to rate, recency answers only to delay.
export function fitTwoStores(by: Record<Cond, boolean[][]>): Rival {
  const cells: Cell[] = [];
  const rows: Record<Cond, (i: number) => number[]> = {
    fastNow: (i) => [1, 0, pBasis(i), 0, rBasis(i), 0],
    slowNow: (i) => [0, 1, 0, pBasis(i), rBasis(i), 0],
    fastWait: (i) => [1, 0, pBasis(i), 0, 0, rBasis(i)],
    slowWait: (i) => [0, 1, 0, pBasis(i), 0, rBasis(i)],
  };
  for (const c of FITTED_CONDS) {
    const cnt = countsOf(by[c]);
    for (let i = 0; i < LIST_N; i++) cells.push({ x: rows[c](i), k: cnt[i].k, n: cnt[i].n });
  }
  const b = irls(cells, 6);
  const eta = Array.from({ length: LIST_N }, (_, i) => {
    const x = rows.slowWait(i);
    let s = 0;
    for (let j = 0; j < 6; j++) s += x[j] * b[j];
    return s;
  });
  return finishRival(eta, cells, b);
}

function finishRival(eta: number[], cells: Cell[], b: number[]): Rival {
  const p = eta.map(sig);
  const band = (ix: number[]) => mean(ix.map((i) => p[i]));
  let dev = 0, items = 0;
  for (const c of cells) {
    if (c.n <= 0) continue;
    let e = 0;
    for (let j = 0; j < b.length; j++) e += c.x[j] * b[j];
    const q = clamp(sig(e), 1e-6, 1 - 1e-6);
    dev += -2 * (c.k * Math.log(q) + (c.n - c.k) * Math.log(1 - q));
    items += c.n;
  }
  return {
    eta, p,
    recAdv: band(REC) - band(MID),
    priAdv: band(PRI) - band(MID),
    devFitted: items ? dev / items : NaN,
  };
}

// The two rivals disagree about the SHAPE of the last curve, not its height, and the height of
// that block is exactly the thing an hour of practice and fatigue is allowed to move. So each
// rival gets one free offset, fitted to the held-out block itself, and is then scored on what is
// left. A rival that predicted the right shape at the wrong level is not punished for the level;
// a rival that predicted the wrong shape cannot buy its way out with one.
export function heldDevianceLevelled(eta: number[], lists: boolean[][]): { dev: number; offset: number } {
  if (!lists.length) return { dev: NaN, offset: NaN };
  const cnt = countsOf(lists);
  let c = 0;
  for (let it = 0; it < 60; it++) {
    let g = 0, h = 1e-9;
    for (let i = 0; i < LIST_N; i++) {
      const pr = sig(eta[i] + c);
      g += cnt[i].k - cnt[i].n * pr;
      h += cnt[i].n * pr * (1 - pr);
    }
    const step = clamp(g / h, -3, 3);
    c = clamp(c + step, -12, 12);
    if (Math.abs(step) < 1e-9) break;
  }
  let dev = 0, items = 0;
  for (let i = 0; i < LIST_N; i++) {
    const q = clamp(sig(eta[i] + c), 1e-6, 1 - 1e-6);
    dev += -2 * (cnt[i].k * Math.log(q) + (cnt[i].n - cnt[i].k) * Math.log(1 - q));
    items += cnt[i].n;
  }
  return { dev: items ? dev / items : NaN, offset: c };
}

export function heldDeviance(pred: number[], lists: boolean[][]): number {
  if (!lists.length) return NaN;
  const cnt = countsOf(lists);
  let dev = 0, items = 0;
  for (let i = 0; i < LIST_N; i++) {
    const q = clamp(pred[i], 1e-6, 1 - 1e-6);
    dev += -2 * (cnt[i].k * Math.log(q) + (cnt[i].n - cnt[i].k) * Math.log(1 - q));
    items += cnt[i].n;
  }
  return items ? dev / items : NaN;
}

export type Verdict = 'twoStores' | 'oneStore' | 'cannotTell' | 'rivalsTooClose';

// Scoring is PAIRED, and that is not a detail. Both rivals are fitted to the same resampled
// lists in the same bootstrap replication and scored against the same resampled held-out lists,
// so the two predictions and the observation rise and fall together and their relationship is
// far better determined than any of the three on its own. Comparing three marginal intervals
// throws that away, and in simulation that version left this block unable to tell the rivals
// apart on most honest runs.
//
// The statistic is the halfway line between the two locked predictions minus what actually
// happened. It is positive when the block landed on the two stores side of halfway. Scoring by
// total goodness of fit was tried first and verified to be far weaker, because a deviance over
// twelve positions is dominated by how high the whole curve sat rather than by the one thing
// the rivals disagree about. That number is still reported, with a free offset given to each
// rival so a level drift cannot decide it, but it does not carry the verdict.
export function scoreHeld(sepCI: [number, number], midCI: [number, number]): Verdict {
  if (!Number.isFinite(sepCI[0]) || !Number.isFinite(midCI[0])) return 'cannotTell';
  if (sepCI[0] <= 0 && sepCI[1] >= 0) return 'rivalsTooClose';
  if (Math.abs(sepCI[0]) < MIN_SEP && Math.abs(sepCI[1]) < MIN_SEP) return 'rivalsTooClose';
  if (midCI[0] > 0) return 'twoStores';
  if (midCI[1] < 0) return 'oneStore';
  return 'cannotTell';
}

// ---------------- the rails ----------------

export type Quality = { ok: boolean; reason: string; detail: string };

export function qualityOf(trials: ListTrial[]): Quality {
  const scored = trials.filter((t) => !t.late);
  const voidFrac = scored.length ? scored.filter((t) => t.dead).length / scored.length : 1;
  const typed = trials.filter((t) => t.typedDuring).length;
  const live = trials.filter((t) => !t.dead && !t.late);
  const all = live.map((t) => t.recalled);
  const b = bandsOf(all);
  const overall = all.length ? mean(all.flatMap((l) => l.map((v) => (v ? 1 : 0)))) : NaN;

  const ascending = live.filter((t) => {
    if (t.outputPos.length < 8) return false;
    for (let i = 1; i < t.outputPos.length; i++) if (t.outputPos[i] <= t.outputPos[i - 1]) return false;
    return true;
  }).length;

  if (typed > MAX_TYPED_LISTS) {
    return { ok: false, reason: 'keys were pressed while the words were on screen',
      detail: `${typed} lists had typing during presentation. Writing them down is a different experiment and this page cannot analyse it.` };
  }
  if (voidFrac > MAX_VOID_FRAC) {
    return { ok: false, reason: 'too many lists had to be dropped',
      detail: `${Math.round(voidFrac * 100)}% of the scored lists were dropped for a hidden tab, a stalled frame, or a delay that was not filled.` };
  }
  if (Number.isFinite(b.mid) && b.mid > MAX_MIDDLE) {
    return { ok: false, reason: 'the middle of the list came back whole',
      detail: `Positions four to nine came back ${Math.round(b.mid * 100)}% of the time. Twelve words at this rate do not do that. The commonest cause is a written copy, and this page cannot tell a written copy from a memory, so it refuses rather than guesses.` };
  }
  if (live.length >= 4 && ascending / live.length >= 0.6) {
    return { ok: false, reason: 'the lists came back in the order they arrived',
      detail: `${ascending} of ${live.length} lists were typed back from position one upward with eight or more words. Immediate free recall starts at the END. A list read off a page starts at the top.` };
  }
  if (Number.isFinite(overall) && overall < MIN_OVERALL) {
    return { ok: false, reason: 'almost nothing came back',
      detail: `Overall recall was ${Math.round(overall * 100)}%. There is no curve to take apart at that level, so nothing here would mean anything.` };
  }
  for (const c of FITTED_CONDS) {
    const n = liveLists(trials, c, false).length;
    if (n < MIN_LISTS_PER_COND) {
      return { ok: false, reason: 'not enough lists survived in one of the conditions',
        detail: `Only ${n} usable lists in one condition, and the fits and the permutation null both need at least ${MIN_LISTS_PER_COND}.` };
    }
  }
  if (liveLists(trials, 'slowWait', false).length < MIN_LISTS_PER_COND) {
    return { ok: false, reason: 'not enough lists survived in the held-out block',
      detail: 'The last block is the one the two rivals committed to, so it cannot be scored on one or two lists.' };
  }
  return { ok: true, reason: '', detail: '' };
}

// ---------------- the whole result ----------------

export type Result = {
  ok: boolean;
  quality: Quality;
  curves: Record<Cond, number[]>;
  bands: Record<Cond, Bands>;
  counts: Record<Cond, number>;
  delay: { stat: number; ci: [number, number]; p: number; exact: boolean; recLoss: number; priLoss: number; atFast: number; atSlow: number };
  rate: { stat: number; ci: [number, number]; p: number; exact: boolean; priGain: number; recGain: number; atNow: number; atWait: number };
  one: Rival; two: Rival;
  oneCI: [number, number]; twoCI: [number, number];
  obsRecAdv: number; obsCI: [number, number];
  devOne: number; devTwo: number;
  offOne: number; offTwo: number;
  devGap: number; devCI: [number, number];
  midGap: number; midCI: [number, number]; landed: number;
  sepGap: number; sepCI: [number, number];
  verdict: Verdict;
  firstPos: Record<Cond, number>;
  drift: { early: number; late: number };
  intrusions: number; priorIntrusions: number;
  kept: number; dropped: number;
  distractAcc: number; distractRate: number;
  rateRatio: number;          // achieved slow presentation over achieved fast presentation
};

export function analyse(trials: ListTrial[], rnd: () => number): Result {
  const quality = qualityOf(trials);
  const by = {
    fastNow: liveLists(trials, 'fastNow', false),
    slowNow: liveLists(trials, 'slowNow', false),
    fastWait: liveLists(trials, 'fastWait', false),
    slowWait: liveLists(trials, 'slowWait', false),
  } as Record<Cond, boolean[][]>;

  const curves = {} as Record<Cond, number[]>;
  const bands = {} as Record<Cond, Bands>;
  const counts = {} as Record<Cond, number>;
  (Object.keys(by) as Cond[]).forEach((c) => {
    const cnt = countsOf(by[c]);
    curves[c] = cnt.map((x) => (x.n ? x.k / x.n : NaN));
    bands[c] = bandsOf(by[c]);
    counts[c] = by[c].length;
  });

  const delayPairs: Pair[] = [
    { a: by.fastNow, b: by.fastWait },
    { a: by.slowNow, b: by.slowWait },
  ];
  const ratePairs: Pair[] = [
    { a: by.slowNow, b: by.fastNow },
    { a: by.slowWait, b: by.fastWait },
  ];
  const dStat = pooled(delayPairs, dissocDelay);
  const dBoot = bootPooled(delayPairs, dissocDelay, BOOTS, rnd);
  const dPerm = permPooled(delayPairs, dissocDelay, rnd);

  const rStat = pooled(ratePairs, dissocRate);
  const rBoot = bootPooled(ratePairs, dissocRate, BOOTS, rnd);
  const rPerm = permPooled(ratePairs, dissocRate, rnd);

  const one = fitOneStore(by);
  const two = fitTwoStores(by);
  const levOne = heldDevianceLevelled(one.eta, by.slowWait);
  const levTwo = heldDevianceLevelled(two.eta, by.slowWait);

  const oneVals: number[] = [], twoVals: number[] = [], sepVals: number[] = [];
  const devVals: number[] = [], obsBoot: number[] = [], midVals: number[] = [];
  const held = by.slowWait;
  for (let r = 0; r < BOOTS; r++) {
    const rs = {} as Record<Cond, boolean[][]>;
    let bad = false;
    for (const c of FITTED_CONDS) {
      const src = by[c];
      if (src.length < 2) { bad = true; break; }
      rs[c] = Array.from({ length: src.length }, () => src[Math.floor(rnd() * src.length)]);
    }
    if (bad) break;
    rs.slowWait = [];
    const o = fitOneStore(rs), t = fitTwoStores(rs);
    if (!Number.isFinite(o.recAdv) || !Number.isFinite(t.recAdv)) continue;
    oneVals.push(o.recAdv);
    twoVals.push(t.recAdv);
    sepVals.push(o.recAdv - t.recAdv);
    if (held.length >= 2) {
      const hs = Array.from({ length: held.length }, () => held[Math.floor(rnd() * held.length)]);
      obsBoot.push(bandsOf(hs).recAdv);
      const obsB = bandsOf(hs).recAdv;
      if (Number.isFinite(obsB)) midVals.push((o.recAdv + t.recAdv) / 2 - obsB);
      const dOne = heldDevianceLevelled(o.eta, hs).dev, dTwo = heldDevianceLevelled(t.eta, hs).dev;
      if (Number.isFinite(dOne) && Number.isFinite(dTwo)) devVals.push(dOne - dTwo);
    }
  }
  const oneCI = ciOf(oneVals), twoCI = ciOf(twoVals), obsCI = ciOf(obsBoot);
  const sepCI = ciOf(sepVals), devCI = ciOf(devVals), midCI = ciOf(midVals);

  const firstPos = {} as Record<Cond, number>;
  (Object.keys(by) as Cond[]).forEach((c) => {
    const fp = trials
      .filter((t) => !t.dead && t.cond === c && !t.late && t.outputPos.length > 0)
      .map((t) => t.outputPos[0] + 1);
    firstPos[c] = fp.length ? mean(fp) : NaN;
  });

  const earlyFast = liveLists(trials, 'fastNow', false);
  const lateFast = liveLists(trials, 'fastNow', true);
  const lvl = (ls: boolean[][]) => (ls.length ? mean(ls.flatMap((l) => l.map((v) => (v ? 1 : 0)))) : NaN);

  const scored = trials.filter((t) => !t.late);
  const waits = trials.filter((t) => t.cond === 'fastWait' || t.cond === 'slowWait');
  const dN = waits.reduce((s, t) => s + t.distractN, 0);
  const dOk = waits.reduce((s, t) => s + t.distractOk, 0);

  const perItem = (slow: boolean) => {
    const v = trials
      .filter((t) => (t.cond === 'slowNow' || t.cond === 'slowWait') === slow)
      .map((t) => t.presentMs / LIST_N)
      .filter(Number.isFinite);
    return v.length ? mean(v) : NaN;
  };
  const rateRatio = perItem(true) / perItem(false);

  return {
    ok: quality.ok,
    quality, curves, bands, counts,
    delay: {
      stat: dStat, ci: ciOf(dBoot), p: dPerm.p, exact: dPerm.exact,
      recLoss: mean([bands.fastNow.recAdv - bands.fastWait.recAdv, bands.slowNow.recAdv - bands.slowWait.recAdv].filter(Number.isFinite)),
      priLoss: mean([bands.fastNow.priAdv - bands.fastWait.priAdv, bands.slowNow.priAdv - bands.slowWait.priAdv].filter(Number.isFinite)),
      atFast: dissocDelay(by.fastNow, by.fastWait),
      atSlow: dissocDelay(by.slowNow, by.slowWait),
    },
    rate: {
      stat: rStat, ci: ciOf(rBoot), p: rPerm.p, exact: rPerm.exact,
      priGain: mean([bands.slowNow.priAdv - bands.fastNow.priAdv, bands.slowWait.priAdv - bands.fastWait.priAdv].filter(Number.isFinite)),
      recGain: mean([bands.slowNow.recAdv - bands.fastNow.recAdv, bands.slowWait.recAdv - bands.fastWait.recAdv].filter(Number.isFinite)),
      atNow: dissocRate(by.slowNow, by.fastNow),
      atWait: dissocRate(by.slowWait, by.fastWait),
    },
    one, two, oneCI, twoCI,
    obsRecAdv: bands.slowWait.recAdv, obsCI,
    devOne: levOne.dev,
    devTwo: levTwo.dev,
    offOne: levOne.offset,
    offTwo: levTwo.offset,
    devGap: levOne.dev - levTwo.dev,
    devCI,
    midGap: (one.recAdv + two.recAdv) / 2 - bands.slowWait.recAdv,
    midCI,
    landed: (one.recAdv - bands.slowWait.recAdv) / (one.recAdv - two.recAdv),
    sepGap: one.recAdv - two.recAdv,
    sepCI,
    verdict: scoreHeld(sepCI, midCI),
    firstPos,
    drift: { early: lvl(earlyFast), late: lvl(lateFast) },
    intrusions: trials.reduce((s, t) => s + t.intrusions, 0),
    priorIntrusions: trials.reduce((s, t) => s + t.priorIntrusions, 0),
    kept: scored.filter((t) => !t.dead).length,
    dropped: scored.filter((t) => t.dead).length,
    distractAcc: dN ? dOk / dN : NaN,
    distractRate: waits.length ? dN / waits.length : NaN,
    rateRatio,
  };
}

// The locked card, computed after the fitted lists and before the held-out block opens.
export type Locked = {
  one: Rival; two: Rival;
  oneCI: [number, number]; twoCI: [number, number];
  sepGap: number; sepCI: [number, number]; separable: boolean;
};

export function lockRivals(trials: ListTrial[], rnd: () => number): Locked {
  const by = {
    fastNow: liveLists(trials, 'fastNow', false),
    slowNow: liveLists(trials, 'slowNow', false),
    fastWait: liveLists(trials, 'fastWait', false),
    slowWait: [],
  } as Record<Cond, boolean[][]>;
  const one = fitOneStore(by), two = fitTwoStores(by);
  const oneVals: number[] = [], twoVals: number[] = [], sepVals: number[] = [];
  for (let r = 0; r < BOOTS; r++) {
    const rs = {} as Record<Cond, boolean[][]>;
    let bad = false;
    for (const c of FITTED_CONDS) {
      const src = by[c];
      if (src.length < 2) { bad = true; break; }
      rs[c] = Array.from({ length: src.length }, () => src[Math.floor(rnd() * src.length)]);
    }
    if (bad) break;
    rs.slowWait = [];
    const o = fitOneStore(rs), t = fitTwoStores(rs);
    if (!Number.isFinite(o.recAdv) || !Number.isFinite(t.recAdv)) continue;
    oneVals.push(o.recAdv); twoVals.push(t.recAdv); sepVals.push(o.recAdv - t.recAdv);
  }
  const sepCI = ciOf(sepVals);
  return {
    one, two,
    oneCI: ciOf(oneVals), twoCI: ciOf(twoVals),
    sepGap: one.recAdv - two.recAdv, sepCI,
    separable:
      Number.isFinite(sepCI[0]) &&
      (sepCI[0] > 0 || sepCI[1] < 0) &&
      (Math.abs(sepCI[0]) >= MIN_SEP || Math.abs(sepCI[1]) >= MIN_SEP),
  };
}

// ============================ end of the analysis core ============================

type Stage = 'ready' | 'present' | 'distract' | 'recall' | 'feedback';
type Phase = 'intro' | 'run' | 'locked' | 'crunch' | 'result';

type ListSpec = { cond: Cond; words: string[]; practice: boolean; held: boolean; late: boolean };

const SLOT: Record<Cond, number> = { fastNow: FAST_SLOT, slowNow: SLOW_SLOT, fastWait: FAST_SLOT, slowWait: SLOW_SLOT };
const ON_MS: Record<Cond, number> = { fastNow: FAST_ON, slowNow: SLOW_ON, fastWait: FAST_ON, slowWait: SLOW_ON };
const WAITS: Record<Cond, boolean> = { fastNow: false, slowNow: false, fastWait: true, slowWait: true };

const COND_LABEL: Record<Cond, string> = {
  fastNow: 'fast, straight to recall',
  slowNow: 'slow, straight to recall',
  fastWait: 'fast, then fourteen seconds of arithmetic',
  slowWait: 'slow, then fourteen seconds of arithmetic',
};
const COND_SHORT: Record<Cond, string> = {
  fastNow: 'fast / now', slowNow: 'slow / now', fastWait: 'fast / wait', slowWait: 'slow / wait',
};
const COND_COLOR: Record<Cond, string> = {
  fastNow: '#22d3ee', slowNow: '#34d399', fastWait: '#fb7185', slowWait: '#fbbf24',
};

function buildPlan(rnd: () => number): ListSpec[] {
  const words = shuffled(POOL, rnd);
  let at = 0;
  const take = (n: number) => words.slice(at, (at += n));

  const out: ListSpec[] = [
    { cond: 'fastNow', words: take(PRACTICE_N), practice: true, held: false, late: false },
    { cond: 'fastWait', words: take(PRACTICE_N), practice: true, held: false, late: false },
  ];

  // The fitted lists are interleaved, never blocked, so practice lands on the three conditions
  // equally. No condition is allowed to run three times in a row.
  const bag: Cond[] = [];
  for (const c of FITTED_CONDS) for (let i = 0; i < PER_FITTED; i++) bag.push(c);
  let seq = shuffled(bag, rnd);
  for (let guard = 0; guard < 200; guard++) {
    let bad = false;
    for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i - 1] && seq[i] === seq[i - 2]) bad = true;
    if (!bad) break;
    seq = shuffled(bag, rnd);
  }
  for (const c of seq) out.push({ cond: c, words: take(LIST_N), practice: false, held: false, late: false });
  for (let i = 0; i < HELD_N; i++) out.push({ cond: 'slowWait', words: take(LIST_N), practice: false, held: true, late: false });
  for (let i = 0; i < LATE_N; i++) out.push({ cond: 'fastNow', words: take(LIST_N), practice: false, held: false, late: true });
  return out;
}

function norm(s: string) { return s.toLowerCase().replace(/[^a-z]/g, ''); }

function scoreEntries(entries: string[], list: string[], seenBefore: Set<string>) {
  const recalled = new Array(list.length).fill(false) as boolean[];
  const outputPos: number[] = [];
  let intrusions = 0, priorIntrusions = 0;
  const norms = list.map(norm);
  for (const raw of entries) {
    const w = norm(raw);
    if (!w) continue;
    let hit = norms.indexOf(w);
    if (hit < 0) {
      // one typo is forgiven, but only when it points at exactly one word of this list
      const near: number[] = [];
      for (let i = 0; i < norms.length; i++) if (editWithin1(w, norms[i])) near.push(i);
      if (near.length === 1) hit = near[0];
    }
    if (hit >= 0) {
      if (!recalled[hit]) { recalled[hit] = true; outputPos.push(hit); }
      continue;
    }
    if (seenBefore.has(w)) priorIntrusions++;
    else intrusions++;
  }
  return { recalled, outputPos, intrusions, priorIntrusions };
}

// ============================ the component ============================

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stage, setStage] = useState<Stage>('ready');
  const [plan, setPlan] = useState<ListSpec[]>([]);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [entries, setEntries] = useState<string[]>([]);
  const [left, setLeft] = useState(0);
  const [sum, setSum] = useState<{ a: number; b: number } | null>(null);
  const [sumTyped, setSumTyped] = useState('');
  const [sumFlash, setSumFlash] = useState<'ok' | 'no' | null>(null);
  const [fb, setFb] = useState<{ got: number; of: number } | null>(null);
  const [locked, setLocked] = useState<Locked | null>(null);
  const [res, setRes] = useState<Result | null>(null);

  const rndRef = useRef<() => number>(mulberry32(1));
  const trialsRef = useRef<ListTrial[]>([]);
  const seenRef = useRef<Set<string>>(new Set());
  const entriesRef = useRef<string[]>([]);
  const hiddenRef = useRef(false);
  const typedDuringRef = useRef(false);
  const gapRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const slotSpanRef = useRef<{ asked: number; got: number }[]>([]);
  const presentStartRef = useRef(0);
  const distractRef = useRef({ n: 0, ok: 0 });
  const sumRef = useRef<{ a: number; b: number } | null>(null);
  const timersRef = useRef<number[]>([]);
  const stageRef = useRef<Stage>('ready');
  const specRef = useRef<ListSpec | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { sumRef.current = sum; }, [sum]);

  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) return;
      const s = stageRef.current;
      if (s === 'present' || s === 'distract' || s === 'recall') hiddenRef.current = true;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => () => { clearTimers(); cancelAnimationFrame(rafRef.current); }, [clearTimers]);

  // keys pressed while the words are on screen: the writing-it-down tell
  useEffect(() => {
    if (stage !== 'present') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 || e.key === 'Backspace') typedDuringRef.current = true;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage]);

  const spec = plan[idx] ?? null;

  // ---------------- frame metering ----------------

  const meterOn = useCallback(() => {
    gapRef.current = 0;
    lastFrameRef.current = performance.now();
    const step = () => {
      const now = performance.now();
      const d = now - lastFrameRef.current;
      if (d > gapRef.current) gapRef.current = d;
      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);
  const meterOff = useCallback(() => cancelAnimationFrame(rafRef.current), []);

  // ---------------- the distractor ----------------

  const nextSum = useCallback(() => {
    const r = rndRef.current;
    let a = 0, b = 0;
    do {
      a = 3 + Math.floor(r() * 7);
      b = 3 + Math.floor(r() * 7);
    } while (a + b < 10);
    setSum({ a, b });
    setSumTyped('');
  }, []);

  const pushDigit = useCallback((d: string) => {
    if (stageRef.current !== 'distract') return;
    setSumTyped((prev) => {
      const nx = (prev + d).slice(0, 2);
      if (nx.length === 2) {
        const cur = sumRef.current;
        const right = cur ? cur.a + cur.b : -1;
        const ok = parseInt(nx, 10) === right;
        distractRef.current.n++;
        if (ok) distractRef.current.ok++;
        setSumFlash(ok ? 'ok' : 'no');
        after(180, () => { setSumFlash(null); nextSum(); });
        return nx;
      }
      return nx;
    });
  }, [after, nextSum]);

  useEffect(() => {
    if (stage !== 'distract') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') { e.preventDefault(); pushDigit(e.key); }
      if (e.key === 'Backspace') { e.preventDefault(); setSumTyped(''); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, pushDigit]);

  // ---------------- the list loop ----------------

  const finishList = useCallback(() => {
    const s = specRef.current;
    if (!s) return;
    if (stageRef.current !== 'recall') return;   // the countdown and the button race, once only
    clearTimers();
    const got = scoreEntries(entriesRef.current, s.words, seenRef.current);
    for (const w of s.words) seenRef.current.add(norm(w));

    if (!s.practice) {
      const span = slotSpanRef.current[slotSpanRef.current.length - 1] ?? { asked: NaN, got: NaN };
      const badDistract = WAITS[s.cond] &&
        (distractRef.current.n < MIN_DISTRACT_ANSWERS ||
          distractRef.current.ok / Math.max(1, distractRef.current.n) < MIN_DISTRACT_ACC);
      const dead = hiddenRef.current || gapRef.current > MAX_GAP_MS || badDistract;
      const deadWhy = hiddenRef.current ? 'the tab went to the background'
        : gapRef.current > MAX_GAP_MS ? 'the browser stalled while the words were arriving'
        : badDistract ? 'the fourteen seconds were not filled'
        : '';
      const padded = got.recalled.slice(0, LIST_N);
      while (padded.length < LIST_N) padded.push(false);
      trialsRef.current.push({
        cond: s.cond,
        order: trialsRef.current.length,
        recalled: padded,
        outputPos: got.outputPos,
        intrusions: got.intrusions,
        priorIntrusions: got.priorIntrusions,
        dead, deadWhy,
        typedDuring: typedDuringRef.current,
        gapped: gapRef.current > MAX_GAP_MS,
        hidden: hiddenRef.current,
        distractN: distractRef.current.n,
        distractOk: distractRef.current.ok,
        askedMs: span.asked,
        presentMs: span.got,
        late: s.late,
      });
    }

    setFb({ got: got.recalled.filter(Boolean).length, of: s.words.length });
    setStage('feedback');
    after(FB_MS, () => {
      const next = idx + 1;
      if (next >= plan.length) {
        setPhase('crunch');
        after(60, () => {
          setRes(analyse(trialsRef.current, rndRef.current));
          setPhase('result');
        });
        return;
      }
      // the rivals commit here, after the fitted lists and before the held-out block opens
      if (plan[next].held && !plan[idx].held) {
        setLocked(lockRivals(trialsRef.current, rndRef.current));
        setIdx(next);
        setPhase('locked');
        return;
      }
      setIdx(next);
      setStage('ready');
    });
  }, [after, clearTimers, idx, plan]);

  const startRecall = useCallback(() => {
    meterOff();
    setStage('recall');
    entriesRef.current = [];
    setEntries([]);
    setTyped('');
    setLeft(RECALL_MS);
    const t0 = performance.now();
    const tick = () => {
      const rem = RECALL_MS - (performance.now() - t0);
      if (rem <= 0) { setLeft(0); finishList(); return; }
      setLeft(rem);
      after(200, tick);
    };
    after(200, tick);
    after(30, () => inputRef.current?.focus());
  }, [after, finishList, meterOff]);

  const startDistract = useCallback((ms: number) => {
    distractRef.current = { n: 0, ok: 0 };
    setStage('distract');
    nextSum();
    setLeft(ms);
    const t0 = performance.now();
    const tick = () => {
      const rem = ms - (performance.now() - t0);
      if (rem <= 0) { setLeft(0); startRecall(); return; }
      setLeft(rem);
      after(200, tick);
    };
    after(200, tick);
  }, [after, nextSum, startRecall]);

  const startList = useCallback(() => {
    const s = plan[idx];
    if (!s) return;
    specRef.current = s;
    hiddenRef.current = false;
    typedDuringRef.current = false;
    distractRef.current = { n: 0, ok: 0 };
    slotSpanRef.current = [];
    clearTimers();
    meterOn();
    presentStartRef.current = performance.now();
    setStage('present');
    setShown(null);
    const slot = SLOT[s.cond], on = ON_MS[s.cond];
    s.words.forEach((w, i) => {
      after(i * slot, () => setShown(w));
      after(i * slot + on, () => setShown(null));
    });
    after(s.words.length * slot, () => {
      slotSpanRef.current.push({ asked: s.words.length * slot, got: performance.now() - presentStartRef.current });
      if (WAITS[s.cond]) startDistract(s.practice ? PRACTICE_DISTRACT_MS : DISTRACT_MS);
      else startRecall();
    });
  }, [after, clearTimers, idx, meterOn, plan, startDistract, startRecall]);

  const addWord = useCallback(() => {
    const w = typed.trim();
    if (!w) return;
    entriesRef.current = [...entriesRef.current, w];
    setEntries(entriesRef.current);
    setTyped('');
  }, [typed]);

  const begin = useCallback(() => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
    rndRef.current = mulberry32(seed);
    trialsRef.current = [];
    seenRef.current = new Set();
    setPlan(buildPlan(rndRef.current));
    setIdx(0);
    setRes(null);
    setLocked(null);
    setPhase('run');
    setStage('ready');
  }, []);

  // ready screens advance on a keypress too, so a keyboard run never needs the mouse
  useEffect(() => {
    if (phase !== 'run' || stage !== 'ready') return;
    let armed = false;
    const t = window.setTimeout(() => { armed = true; }, READY_HOLD_MS);
    const go = (e: KeyboardEvent) => { if (armed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); startList(); } };
    window.addEventListener('keydown', go);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', go); };
  }, [phase, stage, startList]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {phase === 'run' && spec && stage !== 'ready' && (
        <Stagecraft
          stage={stage}
          spec={spec}
          shown={shown}
          left={left}
          sum={sum}
          sumTyped={sumTyped}
          sumFlash={sumFlash}
          distractMs={spec.practice ? PRACTICE_DISTRACT_MS : DISTRACT_MS}
          entries={entries}
          typed={typed}
          fb={fb}
          inputRef={inputRef}
          onTyped={setTyped}
          onAdd={addWord}
          onDone={finishList}
          onDigit={pushDigit}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#129699;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Last Ones Go First</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            The end of a list comes back best of all, and fourteen seconds of arithmetic is enough
            to take it away without touching the beginning. Two knobs, two humps, and a page that
            commits to a number before it turns the second knob.
          </p>
        </div>

        {phase === 'intro' && <Intro onStart={begin} />}
        {phase === 'run' && spec && stage === 'ready' && (
          <Ready spec={spec} idx={idx} total={plan.length} onGo={startList} />
        )}
        {phase === 'locked' && locked && (
          <LockedCard locked={locked} onGo={() => { setPhase('run'); setStage('ready'); }} />
        )}
        {phase === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">taking the curve apart</div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div className="h-full w-2/3 animate-pulse bg-cyan-400/60" />
            </div>
          </div>
        )}
        {phase === 'result' && res && <Results res={res} onAgain={begin} />}
      </div>
    </main>
  );
}

// ============================ shared chrome ============================

function Card({ tone, label, children }: { tone: 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate'; label: string; children: ReactNode }) {
  const border = {
    cyan: 'border-cyan-400/25 bg-cyan-400/[0.04]',
    emerald: 'border-emerald-400/25 bg-emerald-400/[0.04]',
    amber: 'border-amber-400/25 bg-amber-400/[0.04]',
    violet: 'border-violet-400/25 bg-violet-400/[0.04]',
    rose: 'border-rose-400/25 bg-rose-400/[0.04]',
    slate: 'border-slate-800 bg-slate-900/40',
  }[tone];
  const text = {
    cyan: 'text-cyan-300/90', emerald: 'text-emerald-300/90', amber: 'text-amber-300/90',
    violet: 'text-violet-300/90', rose: 'text-rose-300/90', slate: 'text-slate-500',
  }[tone];
  return (
    <div className={`rounded-lg border p-5 ${border}`}>
      <div className={`mb-3 font-mono text-xs uppercase tracking-wider ${text}`}>{label}</div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-800/70 py-1.5 last:border-0">
      <div className="text-xs text-slate-500">{k}</div>
      <div className="shrink-0 font-mono text-xs text-slate-300">{v}</div>
    </div>
  );
}

function pp(v: number) { return Number.isFinite(v) ? `${v >= 0 ? '+' : ''}${Math.round(v * 100)}` : 'n/a'; }
function pct(v: number) { return Number.isFinite(v) ? `${Math.round(v * 100)}%` : 'n/a'; }
function n1(v: number) { return Number.isFinite(v) ? v.toFixed(1) : 'n/a'; }
function n2(v: number) { return Number.isFinite(v) ? v.toFixed(2) : 'n/a'; }
function ciPP(c: [number, number]) {
  return Number.isFinite(c[0]) ? `${Math.round(c[0] * 100)} to ${Math.round(c[1] * 100)}` : 'n/a';
}
function pTxt(p: number, exact: boolean) {
  if (!Number.isFinite(p)) return 'n/a';
  const s = p < 0.001 ? 'under 0.001' : p.toFixed(3);
  return `${s}${exact ? ' exact' : ' sampled'}`;
}

// ============================ intro ============================

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
        <p className="text-sm leading-relaxed text-slate-300">
          Twelve unrelated words arrive one at a time. Then you type back as many as you can, in
          any order. Everyone produces the same shape: the first few come back, the last few come
          back best of all, and the middle sags. That curve is a hundred and forty years old and
          it is not the interesting part.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Two humps could be one memory with two good positions in it, or two memories. A curve on
          its own cannot say which. What can say which is a knob that moves one hump and leaves
          the other alone, and then a second knob that does the opposite.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.04] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-rose-300/80">knob one, the delay</div>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            Fourteen seconds of arithmetic between the last word and the first keystroke. The end of
            the list should go. The beginning should not move.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">knob two, the rate</div>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
            Each word on screen three times as long. The beginning should rise, because early words
            get rehearsed while the list is still short. The end should not move.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">what gets held back</div>
        <p className="text-[13px] leading-relaxed text-slate-400">
          Eighteen lists are measured with one knob at a time. Then this page stops, fits two rival
          models to them, and prints what each one predicts for a condition you have not run yet:
          slow words AND the arithmetic, both knobs at once. One store says the end of the list is
          still the tall part. Two stores says it is gone. Both numbers go on the screen with their
          own intervals, and only then does that block run.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
          About twenty minutes if you answer and move on, twenty five if you use every second of
          every recall. It is a real one: two practice lists and then thirty, a keyboard, and a
          room where nobody is going to talk to you. Nothing is recorded and nothing leaves the
          page. Writing the words down breaks it, and the page can tell.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-widest text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20"
      >
        start with two practice lists
      </button>
    </div>
  );
}

// ============================ between lists ============================

function Ready({ spec, idx, total, onGo }: { spec: ListSpec; idx: number; total: number; onGo: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-center">
        <div className="font-mono text-[11px] uppercase tracking-widest text-slate-600">
          {spec.practice ? `practice list ${idx + 1} of 2` : `list ${idx - 1} of ${total - 2}`}
        </div>
        <div className="mt-3 text-lg text-slate-200">
          {spec.words.length} words, {spec.cond === 'slowNow' || spec.cond === 'slowWait' ? 'slowly' : 'quickly'}
        </div>
        <div className="mt-1 text-[13px] text-slate-500">
          {WAITS[spec.cond]
            ? 'then some arithmetic, and then you type back what you can'
            : 'then you type back what you can, in any order'}
        </div>
        {spec.held && (
          <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-amber-300/80">
            the held-out block
          </div>
        )}
        {spec.late && (
          <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-cyan-300/70">
            the anchor, to measure what an hour of this did to you
          </div>
        )}
      </div>
      <button
        onClick={onGo}
        className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/10 py-4 font-mono text-sm uppercase tracking-widest text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20"
      >
        ready
      </button>
      <p className="text-center text-[11px] text-slate-600">space or enter also starts it</p>
    </div>
  );
}

// ============================ the stage ============================

function Stagecraft(props: {
  stage: Stage;
  spec: ListSpec;
  shown: string | null;
  left: number;
  sum: { a: number; b: number } | null;
  sumTyped: string;
  sumFlash: 'ok' | 'no' | null;
  distractMs: number;
  entries: string[];
  typed: string;
  fb: { got: number; of: number } | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onTyped: (v: string) => void;
  onAdd: () => void;
  onDone: () => void;
  onDigit: (d: string) => void;
}) {
  const { stage, spec, shown, left, sum, sumTyped, sumFlash, distractMs, entries, typed, fb, inputRef } = props;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950 px-5">
      {stage === 'present' && (
        <div className="text-center">
          <div className="font-mono text-4xl tracking-wide text-slate-100 md:text-6xl" style={{ minHeight: '1.2em' }}>
            {shown ?? ' '}
          </div>
        </div>
      )}

      {stage === 'distract' && sum && (
        <div className="w-full max-w-xs text-center">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-rose-400/70">
            keep answering
          </div>
          <div className="mx-auto mb-5 h-1 w-full overflow-hidden rounded bg-slate-900">
            <div className="h-full bg-rose-400/60" style={{ width: `${Math.max(0, Math.min(100, (left / distractMs) * 100))}%` }} />
          </div>
          <div className={`font-mono text-4xl ${sumFlash === 'ok' ? 'text-emerald-300' : sumFlash === 'no' ? 'text-rose-300' : 'text-slate-100'}`}>
            {sum.a} + {sum.b}
          </div>
          <div className="mt-3 h-8 font-mono text-2xl tracking-widest text-cyan-300">{sumTyped || ' '}</div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) => (
              <button
                key={d}
                onClick={() => props.onDigit(d)}
                className={`rounded-md border border-slate-700 bg-slate-900 py-3 font-mono text-lg text-slate-200 transition hover:border-rose-400/50 hover:bg-slate-800 ${d === '0' ? 'col-start-2' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'recall' && (
        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">
            <span>any order</span>
            <span>{Math.ceil(left / 1000)}s</span>
          </div>
          <div className="mb-4 h-1 w-full overflow-hidden rounded bg-slate-900">
            <div className="h-full bg-cyan-400/50" style={{ width: `${Math.max(0, Math.min(100, (left / RECALL_MS) * 100))}%` }} />
          </div>
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => props.onTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); props.onAdd(); } }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="type a word, press enter"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-lg text-slate-100 outline-none focus:border-cyan-400/60"
          />
          <div className="mt-4 flex min-h-[4rem] flex-wrap gap-2">
            {entries.map((w, i) => (
              <span key={`${w}-${i}`} className="rounded border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-xs text-slate-400">
                {w}
              </span>
            ))}
          </div>
          <button
            onClick={props.onDone}
            className="mt-4 w-full rounded-md border border-slate-700 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            that is all of them
          </button>
        </div>
      )}

      {stage === 'feedback' && fb && (
        <div className="text-center">
          <div className="font-mono text-3xl text-slate-200">{fb.got} of {fb.of}</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-slate-600">
            {spec.practice ? 'practice, nothing counted' : 'kept'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================ the locked card ============================

function LockedCard({ locked, onGo }: { locked: Locked; onGo: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-400/30 bg-gradient-to-br from-amber-950/20 via-slate-900/70 to-slate-950 p-6">
        <div className="font-mono text-[11px] uppercase tracking-widest text-amber-300/80">locked before the block opens</div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Eighteen lists are in. Two models have been fitted to them, and neither has ever seen the
          condition that runs next: slow words AND the arithmetic, both knobs at once. Here is what
          each one says the end of the list will do in that block, as a gap between the last three
          positions and the middle six.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-violet-400/30 bg-violet-400/[0.05] p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-violet-300/80">one store</div>
          <div className="mt-2 font-mono text-3xl text-violet-200">{pp(locked.one.recAdv)}</div>
          <div className="mt-1 text-[11px] text-slate-500">points, interval {ciPP(locked.oneCI)}</div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            One strength, one shape. Both knobs move the level, the curve keeps its form, so the
            recency hump is still standing at the end of the last block.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.05] p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">two stores</div>
          <div className="mt-2 font-mono text-3xl text-emerald-200">{pp(locked.two.recAdv)}</div>
          <div className="mt-1 text-[11px] text-slate-500">points, interval {ciPP(locked.twoCI)}</div>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
            Recency is its own short-lived store and the arithmetic empties it. Slow words feed the
            other one. So the last block should have a tall beginning and no end at all.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <Row k="gap between the two predictions" v={`${pp(locked.sepGap)} points, interval ${ciPP(locked.sepCI)}`} />
      </div>
      <div className={`rounded-lg border p-4 text-[12px] leading-relaxed ${locked.separable ? 'border-slate-800 bg-slate-900/40 text-slate-500' : 'border-rose-400/25 bg-rose-400/[0.04] text-rose-200/80'}`}>
        {locked.separable
          ? 'The gap between the two predictions is reliably away from zero, so this block can tell them apart. It will be scored by which prediction the result clears, on an interval that has to clear zero, never by which number it lands nearer.'
          : 'The gap between the two predictions is not reliably away from zero, which means your first eighteen lists did not pin the models down far enough for this block to separate them. It will still run, and the results will say so rather than pick a winner.'}
      </div>

      <button
        onClick={onGo}
        className="w-full rounded-lg border border-amber-400/40 bg-amber-500/10 py-4 font-mono text-sm uppercase tracking-widest text-amber-200 transition hover:border-amber-300 hover:bg-amber-500/20"
      >
        run the block
      </button>
    </div>
  );
}

// ============================ the plot ============================

function Curves({ curves, counts, extra }: {
  curves: Record<Cond, number[]>;
  counts: Record<Cond, number>;
  extra?: { label: string; color: string; dash: string; y: number[] }[];
}) {
  const W = 340, H = 190, L = 34, R = 10, T = 12, B = 26;
  const x = (i: number) => L + (i / (LIST_N - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v) * (H - T - B);
  const path = (ys: number[]) =>
    ys.map((v, i) => (Number.isFinite(v) ? `${i === 0 || !Number.isFinite(ys[i - 1]) ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}` : '')).join(' ');
  const conds = (Object.keys(curves) as Cond[]).filter((c) => counts[c] > 0);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
            <text x={L - 6} y={y(g) + 3} textAnchor="end" fontSize="8" fill="#475569" fontFamily="monospace">{Math.round(g * 100)}</text>
          </g>
        ))}
        {[0, 3, 6, 9, 11].map((i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">{i + 1}</text>
        ))}
        {extra?.map((e) => (
          <path key={e.label} d={path(e.y)} fill="none" stroke={e.color} strokeWidth="1.4" strokeDasharray={e.dash} opacity="0.8" />
        ))}
        {conds.map((c) => (
          <g key={c}>
            <path d={path(curves[c])} fill="none" stroke={COND_COLOR[c]} strokeWidth="1.8" />
            {curves[c].map((v, i) => Number.isFinite(v) ? <circle key={i} cx={x(i)} cy={y(v)} r="2" fill={COND_COLOR[c]} /> : null)}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
        {conds.map((c) => (
          <span key={c} className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4" style={{ background: COND_COLOR[c] }} />
            {COND_SHORT[c]}
          </span>
        ))}
        {extra?.map((e) => (
          <span key={e.label} className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4" style={{ background: e.color, opacity: 0.7 }} />
            {e.label}
          </span>
        ))}
      </div>
      <div className="mt-1 text-[10px] text-slate-600">recall percent by serial position</div>
    </div>
  );
}

// ============================ results ============================

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  if (!res.ok) {
    return (
      <div className="space-y-5">
        <Card tone="rose" label="this run cannot be scored">
          <p className="text-sm leading-relaxed text-slate-300">{res.quality.reason}.</p>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{res.quality.detail}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            This is a refusal, not a score. A page that reports a number on data it cannot stand
            behind is worse than one that says nothing, so it says nothing.
          </p>
        </Card>
        <button onClick={onAgain} className="w-full rounded-lg border border-slate-700 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200">
          run it again
        </button>
      </div>
    );
  }

  const dOK = Number.isFinite(res.delay.ci[0]) && res.delay.ci[0] > 0;
  const rOK = Number.isFinite(res.rate.ci[0]) && res.rate.ci[0] > 0;
  const both = dOK && rOK;

  const verdictText: Record<Verdict, string> = {
    twoStores: 'The held-out block landed on the two stores prediction and cleared the one store interval.',
    oneStore: 'The held-out block landed on the one store prediction and cleared the two stores interval.',
    cannotTell: 'The held-out block did not clear either interval cleanly, so nothing is claimed from it.',
    rivalsTooClose: 'The two rivals never committed to different enough numbers, so the held-out block could not separate them.',
  };

  return (
    <div className="space-y-5">
      <Card tone={both ? 'emerald' : 'slate'} label="the double dissociation">
        <p className="text-sm leading-relaxed text-slate-300">
          {both
            ? 'Both knobs moved their own hump more than they moved the other one. That is the whole argument for two stores, made on your own twelve positions, in one sitting, with the same words and the same fingers.'
            : dOK
              ? 'The delay moved the end of the list more than it moved the beginning. The rate knob did not separate the two humps well enough to say the same thing in reverse, so only half the dissociation is here.'
              : rOK
                ? 'The slow rate moved the beginning of the list more than it moved the end. The delay did not separate the two humps well enough to say the same thing in reverse, so only half the dissociation is here.'
                : 'Neither knob separated its own hump from the other one clearly enough to call. That is a real outcome of a twenty minute measurement on one person, and it is what gets printed.'}
        </p>
      </Card>

      <Card tone="slate" label="your four curves">
        <Curves curves={res.curves} counts={res.counts} />
        <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
          Bands are fixed: positions one to three, four to nine, ten to twelve. They were chosen
          before any data existed and were never moved to make a number better.
        </p>
      </Card>

      <Card tone={dOK ? 'rose' : 'slate'} label="knob one, the filled delay">
        <div className="mb-3 font-mono text-3xl text-rose-200">{pp(res.delay.stat)} points</div>
        <Row k="recency advantage lost to the delay" v={`${pp(res.delay.recLoss)} points`} />
        <Row k="primacy advantage lost to the delay" v={`${pp(res.delay.priLoss)} points`} />
        <Row k="difference, the headline" v={`${pp(res.delay.stat)} points`} />
        <Row k="bootstrap interval over lists" v={ciPP(res.delay.ci)} />
        <Row k="the same knob at the fast rate" v={`${pp(res.delay.atFast)} points`} />
        <Row k="the same knob at the slow rate" v={`${pp(res.delay.atSlow)} points`} />
        <Row k="permutation null, one sided, stratified" v={pTxt(res.delay.p, res.delay.exact)} />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          The number is a difference of differences on purpose. Reporting that recency fell and
          primacy did not is two separate tests, one of which failed to reject, and a failure to
          reject is not a measured zero. This number is positive only if the delay reached the end
          of your list harder than it reached the beginning.
        </p>
      </Card>

      <Card tone={rOK ? 'emerald' : 'slate'} label="knob two, the slower rate">
        <div className="mb-3 font-mono text-3xl text-emerald-200">{pp(res.rate.stat)} points</div>
        <Row k="primacy advantage gained from slow" v={`${pp(res.rate.priGain)} points`} />
        <Row k="recency advantage gained from slow" v={`${pp(res.rate.recGain)} points`} />
        <Row k="difference, the headline" v={`${pp(res.rate.stat)} points`} />
        <Row k="bootstrap interval over lists" v={ciPP(res.rate.ci)} />
        <Row k="the same knob with no delay" v={`${pp(res.rate.atNow)} points`} />
        <Row k="the same knob after the arithmetic" v={`${pp(res.rate.atWait)} points`} />
        <Row k="permutation null, one sided, stratified" v={pTxt(res.rate.p, res.rate.exact)} />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          Three times as long on each word buys rehearsal, and rehearsal is worth most to the words
          that arrived while the list was still short. Rundus counted those rehearsals out loud in
          1971 and found exactly this gradient. This is the weak half of the page and it is weak on
          purpose rather than by accident: the effect is genuinely about a third the size of the
          one above, and twenty minutes of one person buys it 26 percent of the time. Read the
          number, not the verdict.
        </p>
      </Card>

      <Card tone="amber" label="the block nobody had run">
        <p className="text-sm leading-relaxed text-slate-300">{verdictText[res.verdict]}</p>
        <div className="mt-4">
          <Row k="one store predicted" v={`${pp(res.one.recAdv)} points, ${ciPP(res.oneCI)}`} />
          <Row k="two stores predicted" v={`${pp(res.two.recAdv)} points, ${ciPP(res.twoCI)}`} />
          <Row k="what happened" v={`${pp(res.obsRecAdv)} points, ${ciPP(res.obsCI)}`} />
          <Row k="held-out deviance per item, one store" v={n2(res.devOne)} />
          <Row k="held-out deviance per item, two stores" v={n2(res.devTwo)} />
          <Row k="gap the rivals committed to" v={`${pp(res.sepGap)} points, interval ${ciPP(res.sepCI)}`} />
          <Row k="halfway line minus what happened" v={`${pp(res.midGap)} points, interval ${ciPP(res.midCI)}`} />
          <Row
            k="where it landed between them"
            v={
              res.verdict === 'rivalsTooClose' || !Number.isFinite(res.landed)
                ? 'not meaningful, the rivals sat too close'
                : `${Math.round(clamp(res.landed, -1, 2) * 100)}% of the way to two stores`
            }
          />
          <Row k="shape deviance gap, each rival re-levelled" v={`${n2(res.devGap)}, interval ${n2(res.devCI[0])} to ${n2(res.devCI[1])}`} />
          <Row k="level each rival had to slide" v={`${n2(res.offOne)} and ${n2(res.offTwo)} in logits`} />
        </div>
        <div className="mt-4">
          <Curves
            curves={{ slowWait: res.curves.slowWait } as Record<Cond, number[]>}
            counts={{ slowWait: res.counts.slowWait } as Record<Cond, number>}
            extra={[
              { label: 'one store predicted', color: '#a78bfa', dash: '4 3', y: res.one.p },
              { label: 'two stores predicted', color: '#34d399', dash: '4 3', y: res.two.p },
            ]}
          />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          Both models were fitted only to the eighteen earlier lists and both printed their number
          before this block opened. Scoring is paired and directional: in every bootstrap
          replication the two rivals are fitted to the same resampled lists and scored on the same
          resampled held-out lists, so what has to clear zero is the interval on the GAP between
          them. Comparing two separate intervals throws away the fact that the two predictions move
          together, and in simulation that version could not tell the rivals apart on most honest
          runs. Landing nearer one number than the other is still not a result.
        </p>
      </Card>

      <Card tone="cyan" label="where your recall started">
        <Row k="fast, straight to recall" v={`position ${n1(res.firstPos.fastNow)}`} />
        <Row k="slow, straight to recall" v={`position ${n1(res.firstPos.slowNow)}`} />
        <Row k="fast, after the arithmetic" v={`position ${n1(res.firstPos.fastWait)}`} />
        <Row k="slow, after the arithmetic" v={`position ${n1(res.firstPos.slowWait)}`} />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          Nobody asked you where to start. Immediate recall almost always starts near the end,
          because the end is still sitting there and going first is how you keep it. After the
          arithmetic there is nothing at the end to protect, and recall usually starts near the
          beginning instead. This is free evidence for the same split, and you produced it without
          being told it was being watched.
        </p>
      </Card>

      <Card tone="slate" label="what else could have done it">
        <Row k="fast lists early in the session" v={pct(res.drift.early)} />
        <Row k="the same condition at the very end" v={pct(res.drift.late)} />
        <Row k="lists kept" v={`${res.kept} of ${res.kept + res.dropped}`} />
        <Row k="arithmetic answered per delay" v={n1(res.distractRate)} />
        <Row k="arithmetic correct" v={pct(res.distractAcc)} />
        <Row k="slow slot over fast slot, as delivered" v={`${n2(res.rateRatio)}x of the 3.00x asked for`} />
        <Row k="words from an earlier list" v={String(res.priorIntrusions)} />
        <Row k="words from nowhere" v={String(res.intrusions)} />
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          The held-out block runs last, so practice and fatigue are pushing on it. Those two anchor
          lists ran after it in the condition the session opened with, which turns that worry into
          the first two rows above. And every headline here is a contrast between positions inside
          one curve, which a level shift cannot manufacture in either direction.
        </p>
      </Card>

      <Card tone="violet" label="what your screen could not reach">
        <p className="text-[13px] leading-relaxed text-slate-400">
          No number on this page reads a clock. Serial position is an integer and recall is a count.
          Display lag, input lag and how fast you type apply to all four conditions identically and
          cancel in every contrast here.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
          The rate knob only needs to be ordered, not accurate: the slow slot asks for three times
          the fast one, and a list whose presentation was interrupted by a stalled frame is dropped
          rather than scored. The delay only needs to be long and full, and every answer you gave
          during it was checked. A busy browser can make a list arrive late. It cannot make position
          twelve behave differently from position six in one condition and not in another.
        </p>
      </Card>

      <Card tone="slate" label="what this page is worth, measured before it shipped">
        <p className="text-[13px] leading-relaxed text-slate-400">
          The analysis was pulled out of this file and run against 150 simulated visitors in each
          of five worlds, at exactly these list counts, with a simulator built on a different
          mechanism from the one being fitted.
        </p>
        <div className="mt-3">
          <Row k="delay dissociation called, two stores true" v="79%" />
          <Row k="delay dissociation called, effect half size" v="46%" />
          <Row k="delay dissociation called when it is false" v="6% and 3%" />
          <Row k="rate dissociation called, two stores true" v="26%, the underpowered half" />
          <Row k="held-out block decided correctly" v="33%, and wrongly 0.7%" />
          <Row k="held-out block decided when nothing differs" v="1.3%" />
          <Row k="interval coverage against a nominal 95" v="88 to 93%" />
          <Row k="honest visitors refused" v="0 of 180, three ability levels" />
          <Row k="pen, random, hidden tab, typing, no arithmetic" v="all refused, cause named" />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
          The rate knob is the weak half and the number above says so. Its effect on primacy is
          about a third the size of the delay effect on recency, and one person in twenty minutes
          cannot buy that. It is here because leaving it out would make the dissociation a story
          instead of a test, not because a single run of it settles anything.
        </p>
      </Card>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">the sources</div>
        <p className="text-[12px] leading-relaxed text-slate-500">
          Murdock, Journal of Experimental Psychology 64, 482, 1962, for the curve. Glanzer and
          Cunitz, Journal of Verbal Learning and Verbal Behavior 5, 351, 1966, for both knobs in one
          paper. Postman and Phillips 1965 for the same delay result found independently. Rundus,
          Journal of Experimental Psychology 89, 63, 1971, for counting the rehearsals that make
          primacy. Atkinson and Shiffrin 1968 for the two store model this page is testing rather
          than assuming. Bjork and Whitten 1974 for the long term recency finding that stops any of
          this from being the last word.
        </p>
      </div>

      <button onClick={onAgain} className="w-full rounded-lg border border-slate-700 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-200">
        run it again
      </button>
    </div>
  );
}
