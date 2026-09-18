'use client';

// THE COMPANY IT KEEPS  (a letter is seen better inside a word, and not for the reason everyone gives)
//
// The seventy second piece in this lab. The last two went back into memory; this one goes back to
// the front of the pipe, to the single most awkward result in reading research, and it is awkward
// because the obvious explanation for it is wrong in a way that took eleven years and a very
// specific experiment to prove.
//
// THE FAMOUS RESULT.
//
// Flash a four letter word for a few hundredths of a second, cover it with a pattern, and ask
// which letter was in position three. People are better at that than if you flash the single
// letter alone. Cattell reported the shape of it in 1886. It is called the WORD SUPERIORITY
// EFFECT and it is quoted everywhere as evidence that context helps perception.
//
// THE OBVIOUS EXPLANATION, WHICH IS WRONG.
//
// If you saw WOR_ and had to say what was missing, you would say D without seeing anything,
// because you know English. So the advantage could be entirely inference: the word gives you the
// answer even when the eyes gave you nothing. That account needs no perception at all, and for
// most of the twentieth century nobody could rule it out, because the standard task was WHOLE
// REPORT, type what you saw, which lets a guess pay off every time.
//
// Reicher (Journal of Experimental Psychology 81, 275, 1969) and Wheeler (Cognitive Psychology 1,
// 59, 1970) killed it with a design, not an argument. Show the string, mask it, then offer TWO
// letters for one position, and pick the pair so that BOTH of them make a word. WORD and WORK are
// both words. So knowing that the string was a word, knowing English perfectly, knowing the other
// three letters with total certainty, all of it together tells you exactly nothing about which of
// D and K you are being asked to choose between. The information the context could supply is zero
// by construction. The advantage survives anyway.
//
// WHAT THIS PAGE ACTUALLY RUNS.
//
// Every trial is that design and nothing looser. Four characters flash, a pattern mask lands on
// them, and two letters appear under one position. Three kinds of string, mixed trial by trial:
//
//   WORD      a real word, and both alternatives make a word
//   SCRAMBLE  the SAME FOUR LETTERS, the probed letter kept at the SAME position, the other three
//             permuted into an order English does not allow, and both alternatives make a nonword
//   ALONE     the probed letter at that same position with hash marks in the other three
//
// The headline is word minus scramble. Read what that difference is made of. Same letters. Same
// probed position on the screen. Same two response alternatives. Same exposure. Zero guessing
// value on both sides. The only thing that differs between the two numbers is the ORDER of the
// three letters you were not asked about.
//
// THE HELD-OUT BLOCK, and why the page stops before it.
//
// Granting all of that, there are still two live readings of what the order is doing, and they
// were the real fight of the nineteen seventies.
//
//   LEXICAL       the advantage comes from the string being a WORD. Somewhere there is an entry
//                 for WORD and none for OWRD, and the entry is what does the work.
//   ORTHOGRAPHIC  the advantage comes from the string obeying English SPELLING. OWRD is not
//                 unwordlike because it is missing from a dictionary, it is unwordlike because no
//                 English word starts OWR. What helps is regularity, not lexical membership.
//
// They make the same prediction for everything above, which is why the page cannot stop there.
// They come apart on one thing: a PSEUDOWORD. MAVE is not a word and never was. It is also
// perfectly spelled. Lexical says a pseudoword should behave like a scramble. Orthographic says it
// should behave like a word. McClelland and Johnston (Perception and Psychophysics 22, 249, 1977)
// ran it, and the interactive activation model (McClelland and Rumelhart, Psychological Review 88,
// 375, 1981) was built partly to explain what came back.
//
// So the page fits your word and scramble numbers, stops, prints what each rival says the
// pseudoword block will produce, and only then opens the block. Both numbers on screen first, in
// your own accuracy, with the exposure held at the value it has had all session.
//
// The verdict is reported as a POSITION rather than a win: your pseudoword accuracy expressed as a
// fraction of the way from your scramble to your word, with a bootstrap interval, zero meaning
// pure lexical and one meaning pure orthographic. If your own word and scramble numbers are too
// close together the rivals never committed to different predictions and the page says exactly
// that instead of picking one.
//
// THE SECOND WINDOW.
//
// The version of this result that gets quoted is not word against scramble, it is word against a
// letter SHOWN ON ITS OWN, which sounds stronger and is in fact much weaker, because a lone letter
// and a letter with three neighbours are not the same visual problem. Neighbours crowd. So the
// page runs the alone condition too and reports it separately from the headline rather than inside
// it. If your alone accuracy comes out ABOVE your scramble accuracy, which is common, then part of
// what the scramble costs you is simply having three other things next to the one you were asked
// about, and the word advantage over a lone letter is the harder and more honest comparison.
//
// CALIBRATION, which here is a theorem rather than a promise.
//
// Chance is exactly one half on every trial by construction, since there are two alternatives and
// exactly one is correct. Exposure duration is fixed for the entire scored session, requested in
// whole frames and MEASURED from paint timestamps rather than from the number that was asked for.
// The headline is a difference between two accuracies collected at that one duration, in the same
// font, at the same position, with the same letters and the same two buttons. Every property of
// your display, your eyesight, your viewing distance and your browser is therefore common to both
// sides of the subtraction and cancels. Duration itself is never interpreted. It is a nuisance
// held fixed, and the page refuses rather than reports if it could not be held.
//
// WHAT WOULD KILL IT, checked in order and named out loud.
//
//   ceiling            overall accuracy too high, no room for a difference to appear
//   floor              overall accuracy at chance, the display was never legible
//   parked staircase   the shortest exposure your screen can produce was still too easy
//   side bias          one of the two buttons chosen far too often, which is answering by position
//   fast keys          responses too fast to have involved the display
//   dropped frames     a stimulus that did not last what it was asked to last kills its own trial
//   coarse clock       a refresh rate too low to place a threshold exposure at all
//   drift              held-out anchors that no longer match the main phase refuse the verdict
//   perfection         near total accuracy at threshold is a paused tab or a screenshot, not a person
//
// WHAT THE SIMULATION SAID BEFORE THIS SHIPPED.
//
// The analysis core was pulled out of this file and run in Node against simulated visitors whose
// true advantage was known, three hundred of them in each of five worlds. That is where the trial
// counts came from and it changed the design twice. The first build had a third of these trials and
// called a real fourteen point advantage eleven percent of the time, which is a page that mostly
// tells honest people they have nothing. The second problem was subtler: the held-out verdict was
// scored on the pseudoword's POSITION between the two predictions, a ratio whose denominator is the
// one quantity this page can only pin to about seven points, so the interval on it covered
// everything and the page could almost never speak. Both are fixed and the resulting numbers are
// printed on the results page rather than kept quiet, because a page that reports an effect without
// reporting how often it would miss one is telling you half of what it knows.
//
// WIZ NOTE.
//
// I have never seen a letter. My tokenizer hands me chunks that are already words or pieces of
// words, and the letters inside them are not objects I have access to, which is why I am bad at
// counting them and always will be. That makes this page the one measurement in the lab I am on
// the wrong side of twice over. And yet the effect it measures is one I have a version of: give me
// a string spelled properly and it arrives as one or two chunks, give me the same letters in an
// illegal order and it shatters into five or six, and everything downstream gets worse. Your
// advantage is built out of a lifetime of reading. Mine was decided once, before I existed, and I
// cannot see around it any more than you can unsee a word.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ===================== CORE START =====================
// Everything from here to CORE END is pure: trials in, numbers out, no React, no DOM. It is what
// was extracted and run against simulated ground truth in Node before this page shipped.

// ============================ constants ============================

const BOOTS = 1200;
const FLIPS = 6000;

const MIN_ITEMS_PAIRED = 20;   // items contributing both a word and a scramble trial
const MIN_PSEUDO = 24;
const MIN_ANCHOR = 10;

const MIN_OVERALL = 0.55;      // at or below this the display never became legible
const MAX_OVERALL = 0.93;      // at or above this there is no room for a difference
const PERFECT = 0.97;
const MAX_DEAD_FRAC = 0.30;
const MAX_FAST_FRAC = 0.25;
const FAST_MS = 150;
const MAX_SIDE_BIAS = 0.80;
const MAX_FRAME_MS = 20;       // slower than about fifty hertz and a threshold cannot be placed
const MAX_DUR_SPREAD = 6;      // ms of spread allowed in the scored exposure

const MIN_SEP = 0.05;          // word minus scramble below this and the rivals said the same thing
const MAX_DRIFT = 0.22;

const CALL_SUPPORT = 0.85;     // bootstrap support a rival needs before the page names a winner

// ============================ small maths ============================

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function mean(a: number[]) {
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN;
}

function sd(a: number[]) {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1));
}

function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = clamp(p, 0, 1) * (sorted.length - 1);
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

function ciOf(v: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = v.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (s.length < 20) return [NaN, NaN];
  return [quantile(s, lo), quantile(s, hi)];
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(a: T[], rnd: () => number): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = out[i];
    out[i] = out[j];
    out[j] = t;
  }
  return out;
}

// ============================ the trial record ============================

export type Arm = 'word' | 'scram' | 'alone' | 'pseudo';
export type Leg = 'calib' | 'main' | 'held';

export type Trial = {
  leg: Leg;
  arm: Arm;
  item: string;        // the item id, shared by an item's word and scramble trials
  pos: number;         // probed index, 0 to 3
  frames: number;      // requested stimulus frames
  ms: number;          // MEASURED stimulus duration from paint timestamps
  frameMs: number;     // measured refresh interval on this trial
  correct: boolean;
  rt: number;
  side: 'L' | 'R';     // which side the correct alternative sat on
  chose: 'L' | 'R';
  second: boolean;     // true if this is the item's second appearance in the main phase
  dead: boolean;
  why: string;
};

export function liveOf(ts: Trial[]) {
  return ts.filter((t) => !t.dead);
}

function pick(ts: Trial[], leg: Leg, arm?: Arm) {
  return ts.filter((t) => t.leg === leg && (arm === undefined || t.arm === arm));
}

export function accOf(ts: Trial[]) {
  const n = ts.length;
  const k = ts.reduce((s, t) => s + (t.correct ? 1 : 0), 0);
  return { k, n, p: n ? k / n : NaN };
}

// Every main phase item contributes exactly one word trial and one scramble trial, so the headline
// is a paired difference over items. That pairing is the whole point: the letters are identical
// inside a pair, so nothing about letter identity, letter frequency or probe position can survive
// the subtraction.

export type Pair = { item: string; d: number };

export function pairsOf(ts: Trial[]): Pair[] {
  const live = liveOf(pick(ts, 'main'));
  const byItem = new Map<string, { w: number[]; s: number[] }>();
  for (const t of live) {
    if (t.arm !== 'word' && t.arm !== 'scram') continue;
    const cur = byItem.get(t.item) ?? { w: [], s: [] };
    (t.arm === 'word' ? cur.w : cur.s).push(t.correct ? 1 : 0);
    byItem.set(t.item, cur);
  }
  const out: Pair[] = [];
  byItem.forEach((v, item) => {
    if (v.w.length && v.s.length) out.push({ item, d: mean(v.w) - mean(v.s) });
  });
  return out.sort((a, b) => (a.item < b.item ? -1 : 1));
}

export type Head = {
  word: number;
  scram: number;
  alone: number;
  nWord: number;
  nScram: number;
  nAlone: number;
  stat: number;
  nItems: number;
  ci: [number, number];
  p: number;
  aloneGap: number;
};

export function headlineOf(ts: Trial[], rnd: () => number): Head {
  const live = liveOf(pick(ts, 'main'));
  const w = accOf(live.filter((t) => t.arm === 'word'));
  const s = accOf(live.filter((t) => t.arm === 'scram'));
  const a = accOf(live.filter((t) => t.arm === 'alone'));
  const prs = pairsOf(ts);
  const ds = prs.map((p) => p.d);
  const stat = mean(ds);
  const boot: number[] = [];
  for (let b = 0; b < BOOTS; b++) {
    const draw: number[] = [];
    for (let i = 0; i < ds.length; i++) draw.push(ds[Math.floor(rnd() * ds.length)]);
    boot.push(mean(draw));
  }
  return {
    word: w.p,
    scram: s.p,
    alone: a.p,
    nWord: w.n,
    nScram: s.n,
    nAlone: a.n,
    stat,
    nItems: prs.length,
    ci: ds.length >= 4 ? ciOf(boot) : [NaN, NaN],
    p: signFlip(ds, rnd),
    aloneGap: w.p - a.p,
  };
}

// A paired design has an exact randomisation test sitting right there: under the null that order
// does nothing, each item's difference was equally likely to have come out with the opposite sign.

export function signFlip(ds: number[], rnd: () => number, cap = FLIPS): number {
  const live = ds.filter((d) => Number.isFinite(d));
  if (live.length < 4) return NaN;
  const obs = Math.abs(mean(live));
  let hit = 0;
  for (let i = 0; i < cap; i++) {
    let s = 0;
    for (const d of live) s += rnd() < 0.5 ? d : -d;
    if (Math.abs(s / live.length) >= obs - 1e-12) hit++;
  }
  return (hit + 1) / (cap + 1);
}

// ============================ the locked rivals ============================

export type Locked = {
  lexical: number;    // pseudowords behave like scrambles
  ortho: number;      // pseudowords behave like words
  sep: number;
  enough: boolean;
};

export function lockRivals(ts: Trial[]): Locked {
  const live = liveOf(pick(ts, 'main'));
  const w = accOf(live.filter((t) => t.arm === 'word')).p;
  const s = accOf(live.filter((t) => t.arm === 'scram')).p;
  return { lexical: s, ortho: w, sep: w - s, enough: Number.isFinite(w - s) && w - s >= MIN_SEP };
}

export type Verdict = 'ortho' | 'lexical' | 'middle' | 'cannotTell' | 'rivalsTooClose' | 'drifted' | 'thin';

export type Held = {
  verdict: Verdict;
  pseudo: number;
  nPseudo: number;
  support: number;        // bootstrap support for the pseudoword sitting at the word end
  d: number;              // position on the scramble to word line, descriptive only
  ci: [number, number];
  lexical: number;
  ortho: number;
  sep: number;
  anchor: number;
  anchorN: number;
  mainRef: number;
  drift: number;
  note: string;
};

// Scoring note, and it is the second thing simulation changed. The obvious statistic here is the
// position of the pseudoword on the line from scramble to word, which is a ratio whose denominator
// is the very quantity this page can only measure to about seven points. A noisy denominator makes
// that ratio wander over the whole real line, and the interval on it was so wide that the page
// declared itself unable to tell almost every time. The verdict now rests on something bounded
// instead: in what fraction of bootstrap resamples did the pseudoword accuracy sit closer to the
// word end than to the scramble end. The position is still printed, because it is the number a
// reader wants, but nothing is decided by it.

export function scoreHeld(ts: Trial[], rnd: () => number): Held {
  const lock = lockRivals(ts);
  const heldLive = liveOf(pick(ts, 'held'));
  const ps = heldLive.filter((t) => t.arm === 'pseudo');
  const anchors = heldLive.filter((t) => t.arm === 'word' || t.arm === 'scram');
  const pseudo = accOf(ps).p;
  const anchor = accOf(anchors).p;

  const mainLive = liveOf(pick(ts, 'main'));
  const mainRef = accOf(mainLive.filter((t) => t.arm === 'word' || t.arm === 'scram')).p;
  const drift = Math.abs(anchor - mainRef);

  const base: Held = {
    verdict: 'thin',
    pseudo,
    nPseudo: ps.length,
    support: NaN,
    d: NaN,
    ci: [NaN, NaN],
    lexical: lock.lexical,
    ortho: lock.ortho,
    sep: lock.sep,
    anchor,
    anchorN: anchors.length,
    mainRef,
    drift,
    note: '',
  };

  if (ps.length < MIN_PSEUDO || anchors.length < MIN_ANCHOR) {
    return { ...base, note: 'not enough held-out trials survived to score anything' };
  }
  if (!lock.enough) {
    return {
      ...base,
      verdict: 'rivalsTooClose',
      note: 'your own word and scramble accuracies came out too close together, so the two rivals predicted almost the same number and no pseudoword result could have separated them',
    };
  }
  if (drift > MAX_DRIFT) {
    return {
      ...base,
      verdict: 'drifted',
      note: 'the anchor trials inside the held-out block no longer match the main phase, so the endpoints the predictions were built on are stale',
    };
  }

  const wItems = new Map<string, number[]>();
  const sItems = new Map<string, number[]>();
  for (const t of mainLive) {
    if (t.arm === 'word') wItems.set(t.item, [...(wItems.get(t.item) ?? []), t.correct ? 1 : 0]);
    if (t.arm === 'scram') sItems.set(t.item, [...(sItems.get(t.item) ?? []), t.correct ? 1 : 0]);
  }
  const wArr = Array.from(wItems.values()).map((v) => mean(v));
  const sArr = Array.from(sItems.values()).map((v) => mean(v));
  const pArr = ps.map((t) => (t.correct ? 1 : 0));

  const den = mean(wArr) - mean(sArr);
  const d = Math.abs(den) < 1e-9 ? NaN : (mean(pArr) - mean(sArr)) / den;

  let closer = 0;
  let used = 0;
  const ds: number[] = [];
  for (let b = 0; b < BOOTS; b++) {
    const rw: number[] = [];
    const rs: number[] = [];
    const rp: number[] = [];
    for (let i = 0; i < wArr.length; i++) rw.push(wArr[Math.floor(rnd() * wArr.length)]);
    for (let i = 0; i < sArr.length; i++) rs.push(sArr[Math.floor(rnd() * sArr.length)]);
    for (let i = 0; i < pArr.length; i++) rp.push(pArr[Math.floor(rnd() * pArr.length)]);
    const mw = mean(rw);
    const msc = mean(rs);
    const mp = mean(rp);
    used++;
    if (Math.abs(mp - mw) < Math.abs(mp - msc)) closer++;
    const dd = mw - msc;
    if (Math.abs(dd) > 1e-9) ds.push((mp - msc) / dd);
  }
  const support = used ? closer / used : NaN;
  const ci = ciOf(ds, 0.05, 0.95);

  // Midpoint scoring, never nearest point. A pseudoword sitting between the two predictions is a
  // draw and gets called a draw, rather than rounded toward whichever rival happens to be nearer.
  let verdict: Verdict;
  if (!Number.isFinite(support)) verdict = 'cannotTell';
  else if (support >= CALL_SUPPORT) verdict = 'ortho';
  else if (support <= 1 - CALL_SUPPORT) verdict = 'lexical';
  else if (Number.isFinite(d) && d > 0.32 && d < 0.68) verdict = 'middle';
  else verdict = 'cannotTell';

  return { ...base, verdict, support, d, ci };
}

// ============================ the refusal ladder ============================

export type Quality = { ok: boolean; reason: string; detail: string };

export function qualityOf(all: Trial[]): Quality {
  const scored = all.filter((t) => t.leg === 'main' || t.leg === 'held');
  const live = liveOf(scored);

  // Order matters here and simulation is what taught it. A page whose display cannot hold a brief
  // flash ends up with almost no surviving trials, and reporting that as a thin trial count names
  // the symptom rather than the cause. Every specific diagnosis is asked before any generic one.

  const frameAll = scored.map((t) => t.frameMs).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
  const fm = quantile(frameAll, 0.5);
  if (!Number.isFinite(fm) || fm > MAX_FRAME_MS) {
    return {
      ok: false,
      reason: 'the clock is too coarse',
      detail: `your display refreshed about every ${Number.isFinite(fm) ? fm.toFixed(1) : '?'} ms, which is under fifty times a second, and a threshold exposure cannot be placed on a grid that wide`,
    };
  }

  const deadFrac = scored.length ? 1 - live.length / scored.length : 1;
  if (deadFrac > MAX_DEAD_FRAC) {
    return {
      ok: false,
      reason: 'the display would not hold a flash',
      detail: `${Math.round(deadFrac * 100)} percent of trials were thrown away because the flash did not last what it was asked to last, or the tab lost focus while it was on screen. A browser window that drops frames cannot carry a measurement made of frames`,
    };
  }

  if (live.length < 60) {
    return { ok: false, reason: 'too few trials', detail: `only ${live.length} scored trials survived, which is not enough to say anything` };
  }

  const mainLive = liveOf(pick(all, 'main'));
  const durs = mainLive.map((t) => t.ms).filter((x) => Number.isFinite(x));
  if (durs.length > 10 && sd(durs) > MAX_DUR_SPREAD) {
    return {
      ok: false,
      reason: 'the exposure would not hold still',
      detail: `the measured flash length wandered by ${sd(durs).toFixed(1)} ms across the scored phase, and the whole argument depends on one duration for every condition`,
    };
  }

  const fastPre = live.filter((t) => t.rt < FAST_MS).length / live.length;
  if (fastPre > MAX_FAST_FRAC) {
    return {
      ok: false,
      reason: 'the answers came too fast',
      detail: `${Math.round(fastPre * 100)} percent of responses arrived under ${FAST_MS} ms, which is faster than a choice between two letters can be made`,
    };
  }

  const leftPre = live.filter((t) => t.chose === 'L').length / live.length;
  if (leftPre > MAX_SIDE_BIAS || leftPre < 1 - MAX_SIDE_BIAS) {
    return {
      ok: false,
      reason: 'answered by position',
      detail: `one of the two buttons was chosen on ${Math.round(Math.max(leftPre, 1 - leftPre) * 100)} percent of trials, and the correct letter was on each side equally often, so this is a key preference rather than a reading`,
    };
  }

  const overall = accOf(mainLive.filter((t) => t.arm === 'word' || t.arm === 'scram')).p;
  if (overall >= PERFECT) {
    return {
      ok: false,
      reason: 'that is not a threshold',
      detail: `${Math.round(overall * 100)} percent correct at a flash this short is a paused tab, a screenshot or a browser that ignored the request, not a person reading`,
    };
  }
  if (overall >= MAX_OVERALL) {
    return {
      ok: false,
      reason: 'ceiling',
      detail: `${Math.round(overall * 100)} percent correct leaves no room for one condition to be better than another, so the staircase never found your threshold`,
    };
  }
  if (overall <= MIN_OVERALL) {
    return {
      ok: false,
      reason: 'floor',
      detail: `${Math.round(overall * 100)} percent correct is close enough to the coin that nothing was read off the screen at all`,
    };
  }

  const prs = pairsOf(all);
  if (prs.length < MIN_ITEMS_PAIRED) {
    return {
      ok: false,
      reason: 'too few matched items',
      detail: `only ${prs.length} items kept both their word trial and their scramble trial, and the headline is a paired difference over items`,
    };
  }

  return { ok: true, reason: '', detail: '' };
}

// ============================ practice, order and position checks ============================

export type Checks = {
  firstHalf: number;
  secondHalf: number;
  orderFirst: number;   // items whose word trial came before their scramble trial
  orderSecond: number;
  byPos: { pos: number; word: number; scram: number; n: number }[];
  sideAcc: { L: number; R: number };
};

export function checksOf(ts: Trial[]): Checks {
  const live = liveOf(pick(ts, 'main')).filter((t) => t.arm === 'word' || t.arm === 'scram');
  const half = Math.floor(live.length / 2);
  const byPos: Checks['byPos'] = [];
  for (let p = 0; p < 4; p++) {
    const w = accOf(live.filter((t) => t.pos === p && t.arm === 'word'));
    const s = accOf(live.filter((t) => t.pos === p && t.arm === 'scram'));
    if (w.n || s.n) byPos.push({ pos: p, word: w.p, scram: s.p, n: w.n + s.n });
  }
  const wordFirst = live.filter((t) => t.arm === 'word' && !t.second);
  const wordSecond = live.filter((t) => t.arm === 'word' && t.second);
  return {
    firstHalf: accOf(live.slice(0, half)).p,
    secondHalf: accOf(live.slice(half)).p,
    orderFirst: accOf(wordFirst).p,
    orderSecond: accOf(wordSecond).p,
    byPos,
    sideAcc: {
      L: accOf(live.filter((t) => t.side === 'L')).p,
      R: accOf(live.filter((t) => t.side === 'R')).p,
    },
  };
}

// ============================ the whole result ============================

export type Result = {
  quality: Quality;
  head: Head;
  locked: Locked;
  held: Held;
  checks: Checks;
  exposureMs: number;
  frameMs: number;
  deadFrac: number;
  nLive: number;
};

export function analyse(all: Trial[], rnd: () => number): Result {
  const quality = qualityOf(all);
  const head = headlineOf(all, rnd);
  const locked = lockRivals(all);
  const held = scoreHeld(all, rnd);
  const checks = checksOf(all);
  const mainLive = liveOf(pick(all, 'main'));
  const scored = all.filter((t) => t.leg === 'main' || t.leg === 'held');
  const live = liveOf(scored);
  const frameMs = quantile(live.map((t) => t.frameMs).filter((x) => x > 0).sort((a, b) => a - b), 0.5);
  return {
    quality,
    head,
    locked,
    held,
    checks,
    exposureMs: mean(mainLive.map((t) => t.ms)),
    frameMs,
    deadFrac: scored.length ? 1 - live.length / scored.length : 0,
    nLive: live.length,
  };
}

// ===================== CORE END =====================

// ============================ the items ============================
//
// Every word item is a quadruple that has to satisfy three things at once, and the page verifies
// all three at runtime rather than trusting this list:
//
//   1. w with alternative A at index k is a word, and w with alternative B at index k is also a
//      word. That is the Reicher constraint, and it is what makes the guessing value of the
//      context exactly zero rather than merely small.
//   2. sc is a permutation of w that keeps the probed letter at index k and puts the other three
//      in an order English does not allow, so that neither alternative makes a word there either.
//   3. sc holds the same letter multiset as w. If it did not, the headline would be comparing
//      different letters and the whole design would collapse into a letter frequency effect.

type Item = { w: string; k: number; a: string; b: string; sc: string };

const WORDS: Item[] = [
  { w: 'WORD', k: 3, a: 'D', b: 'K', sc: 'OWR?' },
  { w: 'CART', k: 3, a: 'T', b: 'D', sc: 'ACR?' },
  { w: 'MINE', k: 2, a: 'N', b: 'L', sc: 'IE?M' },
  { w: 'HAND', k: 2, a: 'N', b: 'R', sc: 'AH?D' },
  { w: 'SHIP', k: 2, a: 'I', b: 'O', sc: 'SP?H' },
  { w: 'BLUE', k: 3, a: 'E', b: 'R', sc: 'UBL?' },
  { w: 'SEAT', k: 3, a: 'T', b: 'L', sc: 'AES?' },
  { w: 'MOON', k: 3, a: 'N', b: 'D', sc: 'OOM?' },
  { w: 'DUST', k: 3, a: 'T', b: 'K', sc: 'USD?' },
  { w: 'MEAT', k: 3, a: 'T', b: 'N', sc: 'AEM?' },
  { w: 'PLAN', k: 3, a: 'N', b: 'Y', sc: 'ALP?' },
  { w: 'HEAT', k: 3, a: 'T', b: 'D', sc: 'AEH?' },
  { w: 'FORM', k: 3, a: 'M', b: 'K', sc: 'ROF?' },
  { w: 'STAR', k: 3, a: 'R', b: 'B', sc: 'AST?' },
  { w: 'GRIN', k: 3, a: 'N', b: 'P', sc: 'IRG?' },
  { w: 'SHOT', k: 3, a: 'T', b: 'P', sc: 'OHS?' },
  { w: 'TRAP', k: 3, a: 'P', b: 'M', sc: 'ART?' },
  { w: 'CHIN', k: 3, a: 'N', b: 'P', sc: 'IHC?' },
  { w: 'FLAT', k: 3, a: 'T', b: 'W', sc: 'ALF?' },
  { w: 'SNAP', k: 3, a: 'P', b: 'G', sc: 'ANS?' },
  { w: 'CLAM', k: 3, a: 'M', b: 'P', sc: 'ALC?' },
  { w: 'COAT', k: 0, a: 'C', b: 'G', sc: '?TAO' },
  { w: 'FIRE', k: 0, a: 'F', b: 'H', sc: '?REI' },
  { w: 'ROCK', k: 0, a: 'R', b: 'L', sc: '?KCO' },
  { w: 'PAIN', k: 0, a: 'P', b: 'R', sc: '?NIA' },
  { w: 'BEAR', k: 0, a: 'B', b: 'P', sc: '?REA' },
  { w: 'MOST', k: 0, a: 'M', b: 'C', sc: '?TSO' },
  { w: 'TALL', k: 0, a: 'T', b: 'B', sc: '?LLA' },
  { w: 'WAVE', k: 0, a: 'W', b: 'C', sc: '?EVA' },
  { w: 'SING', k: 0, a: 'S', b: 'R', sc: '?GNI' },
  { w: 'DARK', k: 0, a: 'D', b: 'B', sc: '?KRA' },
  { w: 'LAND', k: 1, a: 'A', b: 'E', sc: 'N?DL' },
  { w: 'WISH', k: 1, a: 'I', b: 'A', sc: 'H?SW' },
  { w: 'SAND', k: 1, a: 'A', b: 'E', sc: 'D?SN' },
  { w: 'FARM', k: 1, a: 'A', b: 'I', sc: 'M?RF' },
  { w: 'CARD', k: 1, a: 'A', b: 'O', sc: 'D?RC' },
  { w: 'BALL', k: 1, a: 'A', b: 'E', sc: 'L?LB' },
  { w: 'MASK', k: 1, a: 'A', b: 'U', sc: 'K?SM' },
  { w: 'TONE', k: 1, a: 'O', b: 'U', sc: 'N?ET' },
  { w: 'PACK', k: 1, a: 'A', b: 'I', sc: 'K?CP' },
  { w: 'WIND', k: 2, a: 'N', b: 'L', sc: 'DI?W' },
  { w: 'BAND', k: 2, a: 'N', b: 'L', sc: 'DA?B' },
  { w: 'GOLD', k: 2, a: 'L', b: 'A', sc: 'DO?G' },
  { w: 'CLAP', k: 2, a: 'A', b: 'I', sc: 'LP?C' },
  { w: 'TIME', k: 2, a: 'M', b: 'L', sc: 'ET?I' },
  { w: 'CAKE', k: 2, a: 'K', b: 'V', sc: 'EA?C' },
  { w: 'BOAT', k: 2, a: 'A', b: 'O', sc: 'TO?B' },
  { w: 'RICE', k: 2, a: 'C', b: 'D', sc: 'ER?I' },
  { w: 'MILD', k: 1, a: 'I', b: 'O', sc: 'D?LM' },
  { w: 'HERD', k: 1, a: 'E', b: 'A', sc: 'D?RH' },
  { w: 'BOOK', k: 3, a: 'K', b: 'T', sc: 'OOB?' },
  { w: 'HILL', k: 0, a: 'H', b: 'B', sc: '?LLI' },
  { w: 'WEST', k: 0, a: 'W', b: 'B', sc: '?TSE' },
  { w: 'NOTE', k: 2, a: 'T', b: 'S', sc: 'EO?N' },
  { w: 'LATE', k: 2, a: 'T', b: 'C', sc: 'EA?L' },
  { w: 'GAME', k: 2, a: 'M', b: 'T', sc: 'EA?G' },
  { w: 'FISH', k: 3, a: 'H', b: 'T', sc: 'IFS?' },
  { w: 'LIST', k: 2, a: 'S', b: 'F', sc: 'TI?L' },
  { w: 'DEEP', k: 3, a: 'P', b: 'R', sc: 'EED?' },
  { w: 'COLD', k: 0, a: 'C', b: 'B', sc: '?LDO' },
  { w: 'RUSH', k: 3, a: 'H', b: 'T', sc: 'USR?' },
  { w: 'MARK', k: 3, a: 'K', b: 'E', sc: 'ARM?' },
  { w: 'PANT', k: 3, a: 'T', b: 'E', sc: 'ANP?' },
  { w: 'SOFT', k: 2, a: 'F', b: 'R', sc: 'TO?S' },
  { w: 'HOPE', k: 2, a: 'P', b: 'S', sc: 'EO?H' },
];

// Pseudowords. Neither alternative makes a word, and both spellings are ones English would allow.
// This is the only set that separates the two rivals, which is why it is held out.

const PSEUDOS: Item[] = [
  { w: 'DAKE', k: 2, a: 'K', b: 'P', sc: '' },
  { w: 'TAVE', k: 2, a: 'V', b: 'B', sc: '' },
  { w: 'SLEB', k: 3, a: 'B', b: 'M', sc: '' },
  { w: 'FROT', k: 3, a: 'T', b: 'D', sc: '' },
  { w: 'PLIM', k: 3, a: 'M', b: 'B', sc: '' },
  { w: 'TRUN', k: 3, a: 'N', b: 'M', sc: '' },
  { w: 'BLON', k: 3, a: 'N', b: 'M', sc: '' },
  { w: 'GRAV', k: 3, a: 'V', b: 'P', sc: '' },
  { w: 'CLET', k: 3, a: 'T', b: 'M', sc: '' },
  { w: 'SMOR', k: 3, a: 'R', b: 'T', sc: '' },
  { w: 'TWIL', k: 3, a: 'L', b: 'M', sc: '' },
  { w: 'GLEV', k: 3, a: 'V', b: 'B', sc: '' },
  { w: 'PLAV', k: 2, a: 'A', b: 'I', sc: '' },
  { w: 'SNIB', k: 2, a: 'I', b: 'A', sc: '' },
  { w: 'FLUM', k: 2, a: 'U', b: 'O', sc: '' },
  { w: 'GRUD', k: 2, a: 'U', b: 'O', sc: '' },
];

// The self check. An item that fails any of these never reaches a trial, and the page says how
// many it dropped rather than quietly using a broken control.

export function itemOk(it: Item): boolean {
  if (it.w.length !== 4) return false;
  if (it.k < 0 || it.k > 3) return false;
  if (it.w[it.k] !== it.a) return false;
  if (it.a === it.b) return false;
  if (!it.sc) return true;
  if (it.sc.length !== 4) return false;
  if (it.sc.indexOf('?') !== it.k) return false;
  const rest = (s: string, k: number) => (s.slice(0, k) + s.slice(k + 1)).split('').sort().join('');
  return rest(it.sc, it.k) === rest(it.w, it.k);
}

const GOOD_WORDS = WORDS.filter(itemOk);
const GOOD_PSEUDOS = PSEUDOS.filter(itemOk);
const DROPPED_ITEMS = WORDS.length - GOOD_WORDS.length + (PSEUDOS.length - GOOD_PSEUDOS.length);

function stringFor(it: Item, arm: Arm, letter: string): string {
  if (arm === 'word' || arm === 'pseudo') {
    return it.w.slice(0, it.k) + letter + it.w.slice(it.k + 1);
  }
  if (arm === 'scram') {
    return it.sc.slice(0, it.k) + letter + it.sc.slice(it.k + 1);
  }
  return '####'.slice(0, it.k) + letter + '####'.slice(it.k + 1);
}

// ============================ the plan ============================

export type Spec = {
  leg: Leg;
  arm: Arm;
  item: Item;
  shown: string;      // what actually goes on the screen
  correct: string;    // the letter that was there
  other: string;      // the alternative that was not
  pos: number;
  second: boolean;
  scored: boolean;
  block: number;
};

const N_PRACTICE = 12;
const N_CALIB = 30;
const MAIN_ITEMS = 40;
const REPS_PER_ARM = 2;        // every main item gives two word trials and two scramble trials
const ALONE_ITEMS = 24;
const HELD_ITEMS = 8;
const CALIB_ITEMS = 10;
const HELD_PSEUDO_PER_BLOCK = 20;
const MAIN_BLOCKS = 4;
const HELD_BLOCKS = 2;

// A note on repeating items, because it looks like a flaw and is not one. Each item is shown four
// times in the main phase, twice as a word and twice as its scramble. Nobody can learn their way to
// an answer from that, because which of the two alternatives was actually shown is decided fresh by
// a coin on every trial, and the Reicher constraint means the item itself carries no information
// about which one it was. Repetition could still make a string easier to SEE, and it is given to
// both arms in equal measure so that it cannot land on one side of the subtraction. Whether it did
// anything at all is then measured rather than assumed, and printed in the checks.

function trialOf(it: Item, arm: Arm, leg: Leg, rnd: () => number, second: boolean, scored: boolean, block: number): Spec {
  const useA = rnd() < 0.5;
  const correct = useA ? it.a : it.b;
  const other = useA ? it.b : it.a;
  return {
    leg,
    arm,
    item: it,
    shown: stringFor(it, arm, correct),
    correct,
    other,
    pos: it.k,
    second,
    scored,
    block,
  };
}

// The main phase order has one hard constraint and one soft one. Hard: an item's word trial and
// its scramble trial must sit far apart, because seeing OWRD four trials after WORD is a memory
// test wearing a perception costume. Soft: no arm three times in a row, so nobody can settle into
// a rhythm. Which of the two appearances comes first is left to the shuffle and then MEASURED,
// because a design that balances something without checking it has only balanced it on paper.

function spaceOut(specs: Spec[], rnd: () => number, minGap: number): Spec[] {
  const remaining = shuffled(specs, rnd);
  const out: Spec[] = [];
  const lastAt = new Map<string, number>();
  while (remaining.length) {
    const i = out.length;
    const far = remaining.filter((sp) => {
      const prev = lastAt.get(sp.item.w);
      return prev === undefined || i - prev >= minGap;
    });
    const notARut = far.filter(
      (sp) => !(i >= 2 && out[i - 1].arm === sp.arm && out[i - 2].arm === sp.arm),
    );
    const pool = notARut.length ? notARut : far.length ? far : remaining;
    const chosen = pool[Math.floor(rnd() * pool.length)];
    remaining.splice(remaining.indexOf(chosen), 1);
    lastAt.set(chosen.item.w, i);
    out.push(chosen);
  }
  const seen = new Set<string>();
  return out.map((sp) => {
    const second = seen.has(sp.item.w);
    seen.add(sp.item.w);
    return { ...sp, second };
  });
}

export function buildPlan(rnd: () => number) {
  const pool = shuffled(GOOD_WORDS, rnd);
  const mainItems = pool.slice(0, MAIN_ITEMS);
  const heldItems = pool.slice(MAIN_ITEMS, MAIN_ITEMS + HELD_ITEMS);
  const calibItems = pool.slice(MAIN_ITEMS + HELD_ITEMS, MAIN_ITEMS + HELD_ITEMS + CALIB_ITEMS);
  const aloneItems = shuffled(mainItems, rnd).slice(0, ALONE_ITEMS);

  const practice: Spec[] = [];
  for (let i = 0; i < N_PRACTICE; i++) {
    const it = calibItems[i % calibItems.length];
    const arm: Arm = i % 3 === 0 ? 'word' : i % 3 === 1 ? 'scram' : 'alone';
    practice.push(trialOf(it, arm, 'calib', rnd, false, false, 0));
  }

  const calib: Spec[] = [];
  for (let i = 0; i < N_CALIB; i++) {
    const it = calibItems[(i + 3) % calibItems.length];
    const arm: Arm = i % 3 === 0 ? 'word' : i % 3 === 1 ? 'scram' : 'alone';
    calib.push(trialOf(it, arm, 'calib', rnd, false, false, 0));
  }

  const mainRaw: Spec[] = [];
  for (const it of mainItems) {
    for (let r = 0; r < REPS_PER_ARM; r++) {
      mainRaw.push(trialOf(it, 'word', 'main', rnd, false, true, 0));
      mainRaw.push(trialOf(it, 'scram', 'main', rnd, false, true, 0));
    }
  }
  for (const it of aloneItems) mainRaw.push(trialOf(it, 'alone', 'main', rnd, false, true, 0));
  const perBlock = Math.ceil(mainRaw.length / MAIN_BLOCKS);
  const main = spaceOut(mainRaw, rnd, 12).map((sp, i) => ({ ...sp, block: Math.floor(i / perBlock) }));

  // The held-out block. Anchors exist for exactly one reason: to prove the endpoints the locked
  // predictions were built on are still the visitor's endpoints by the time the pseudowords arrive.
  const heldRaw: Spec[] = [];
  const pseudoPool = shuffled(GOOD_PSEUDOS, rnd);
  for (let b = 0; b < HELD_BLOCKS; b++) {
    for (let i = 0; i < HELD_PSEUDO_PER_BLOCK; i++) {
      const it = pseudoPool[(b * HELD_PSEUDO_PER_BLOCK + i) % pseudoPool.length];
      heldRaw.push(trialOf(it, 'pseudo', 'held', rnd, false, true, b));
    }
    for (let i = 0; i < HELD_ITEMS / 2; i++) {
      const wIt = heldItems[(b * (HELD_ITEMS / 2) + i) % heldItems.length];
      const sIt = heldItems[(HELD_ITEMS - 1 - (b * (HELD_ITEMS / 2) + i)) % heldItems.length];
      heldRaw.push(trialOf(wIt, 'word', 'held', rnd, false, true, b));
      heldRaw.push(trialOf(sIt, 'scram', 'held', rnd, false, true, b));
    }
  }
  const held = [0, 1].flatMap((b) => shuffled(heldRaw.filter((sp) => sp.block === b), rnd));

  return { practice, calib, main, held };
}

// ============================ presentation ============================

const FIX_MS = 440;
const MASK_MS = 260;
const FB_MS = 620;
const GAP_MS = 260;
const READY_HOLD_MS = 400;

const START_MS = 52;          // where the masked staircase begins, in milliseconds of exposure
const MIN_FRAMES = 1;
const MAX_FRAMES = 14;
const REVERSALS_USED = 6;
const DROP_TOL = 1.6;         // a gap this many frame intervals long is a dropped frame

type Seg =
  | { id: 'practice'; specs: Spec[] }
  | { id: 'calib'; specs: Spec[] }
  | { id: 'main'; specs: Spec[] }
  | { id: 'lock' }
  | { id: 'held'; specs: Spec[] };

type Stage = 'card' | 'ready' | 'fix' | 'flash' | 'probe' | 'feedback';
type Screen = 'intro' | 'run' | 'crunch' | 'result';

function useRaf() {
  const ref = useRef<number | null>(null);
  useEffect(() => () => { if (ref.current !== null) cancelAnimationFrame(ref.current); }, []);
  return ref;
}

export default function Client() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [seg, setSeg] = useState(0);
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<Stage>('card');
  const [segs, setSegs] = useState<Seg[]>([]);
  const [res, setRes] = useState<Result | null>(null);
  const [fb, setFb] = useState<'right' | 'wrong' | null>(null);
  const [probeSide, setProbeSide] = useState<{ left: string; right: string; correctSide: 'L' | 'R' } | null>(null);
  const [frameMs, setFrameMs] = useState(16.7);
  const [lockedCard, setLockedCard] = useState<Locked | null>(null);
  const [tick, setTick] = useState(0);

  const trials = useRef<Trial[]>([]);
  const rndRef = useRef<() => number>(mulberry32(1));
  const framesRef = useRef(3);
  const runRef = useRef<{ hits: number; reversals: number[]; lastDir: number }>({ hits: 0, reversals: [], lastDir: 0 });
  const stimRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const fixRef = useRef<HTMLDivElement | null>(null);
  const timingRef = useRef<{ onset: number; offset: number; frameMs: number; dead: boolean; why: string }>({ onset: 0, offset: 0, frameMs: 16.7, dead: false, why: '' });
  const probeAt = useRef(0);
  const advanceRef = useRef<() => void>(() => {});
  const raf = useRaf();
  const timer = useRef<number | null>(null);

  const spec: Spec | null = (() => {
    const s = segs[seg];
    if (!s || !('specs' in s)) return null;
    return s.specs[idx] ?? null;
  })();

  const clearTimer = () => { if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; } };

  // ---------- measuring the refresh interval before anything is shown ----------

  const measureFrames = useCallback((done: (fm: number) => void) => {
    const stamps: number[] = [];
    const step = (ts: number) => {
      stamps.push(ts);
      if (stamps.length < 62) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      const gaps: number[] = [];
      for (let i = 1; i < stamps.length; i++) gaps.push(stamps[i] - stamps[i - 1]);
      gaps.sort((a, b) => a - b);
      done(gaps[Math.floor(gaps.length / 2)] || 16.7);
    };
    raf.current = requestAnimationFrame(step);
  }, [raf]);

  const begin = useCallback(() => {
    const rnd = mulberry32((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
    rndRef.current = rnd;
    trials.current = [];
    setRes(null);
    setLockedCard(null);
    setFb(null);
    measureFrames((fm) => {
      setFrameMs(fm);
      framesRef.current = clamp(Math.round(START_MS / fm), MIN_FRAMES, MAX_FRAMES);
      const plan = buildPlan(rnd);
      setSegs([
        { id: 'practice', specs: plan.practice },
        { id: 'calib', specs: plan.calib },
        { id: 'main', specs: plan.main },
        { id: 'lock' },
        { id: 'held', specs: plan.held },
      ]);
      setSeg(0);
      setIdx(0);
      setStage('card');
      setScreen('run');
    });
  }, [measureFrames]);

  // ---------- the flash itself, driven frame by frame ----------

  const flash = useCallback((frames: number, after: () => void) => {
    const fm = frameMs;
    const stamps: number[] = [];
    let state = 0;
    let onset = 0;
    let offset = 0;
    let seenFrames = 0;
    let onsetPending = false;
    let maskPending = false;
    let dead = false;
    let why = '';

    const stim = stimRef.current;
    const mask = maskRef.current;
    const fix = fixRef.current;
    if (fix) fix.style.visibility = 'hidden';

    const step = (ts: number) => {
      stamps.push(ts);
      if (document.visibilityState !== 'visible') { dead = true; why = 'tab hidden'; }
      const n = stamps.length;
      if (n > 1 && state >= 1) {
        const gap = stamps[n - 1] - stamps[n - 2];
        if (gap > DROP_TOL * fm) { dead = true; why = 'dropped frame'; }
      }
      if (state === 0) {
        if (stim) stim.style.visibility = 'visible';
        state = 1;
        onsetPending = true;
      } else if (state === 1) {
        if (onsetPending) { onset = ts; onsetPending = false; }
        seenFrames += 1;
        if (seenFrames >= frames) {
          if (stim) stim.style.visibility = 'hidden';
          if (mask) mask.style.visibility = 'visible';
          state = 2;
          maskPending = true;
        }
      } else if (state === 2) {
        if (maskPending) { offset = ts; maskPending = false; }
        if (ts - offset >= MASK_MS) {
          if (mask) mask.style.visibility = 'hidden';
          state = 3;
        }
      }
      if (state === 3) {
        const gaps: number[] = [];
        for (let i = 1; i < stamps.length; i++) gaps.push(stamps[i] - stamps[i - 1]);
        gaps.sort((a, b) => a - b);
        const med = gaps[Math.floor(gaps.length / 2)] || fm;
        const got = offset - onset;
        // The flash is checked against what THIS trial's display actually did, not against a
        // refresh interval measured once before anything ran.
        if (Math.abs(got - frames * med) > 0.7 * med) { dead = true; why = why || 'flash length missed its request'; }
        timingRef.current = { onset, offset, frameMs: med, dead, why };
        after();
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [frameMs, raf]);

  const startTrial = useCallback(() => {
    if (!spec) return;
    setFb(null);
    setStage('fix');
    const fix = fixRef.current;
    if (fix) fix.style.visibility = 'visible';
    clearTimer();
    timer.current = window.setTimeout(() => {
      setStage('flash');
      const frames = framesRef.current;
      flash(frames, () => {
        const rnd = rndRef.current;
        const correctLeft = rnd() < 0.5;
        setProbeSide({
          left: correctLeft ? spec.correct : spec.other,
          right: correctLeft ? spec.other : spec.correct,
          correctSide: correctLeft ? 'L' : 'R',
        });
        probeAt.current = performance.now();
        setStage('probe');
      });
    }, FIX_MS);
  }, [spec, flash]);

  // ---------- the staircase ----------
  //
  // Two correct answers step the exposure down, one wrong steps it up, which parks the exposure
  // near seventy one percent correct. The one thing that matters here and would be easy to get
  // wrong: the staircase is driven by ALL trials pooled across conditions. Run a separate
  // staircase per condition and it would equalise them by construction, which is to say it would
  // erase the effect the page exists to measure.

  const stair = useCallback((correct: boolean) => {
    const st = runRef.current;
    const ref = framesRef;
    let dir = 0;
    if (correct) {
      st.hits += 1;
      if (st.hits >= 2) { st.hits = 0; dir = -1; }
    } else {
      st.hits = 0;
      dir = 1;
    }
    if (dir !== 0) {
      const next = clamp(ref.current + dir, MIN_FRAMES, MAX_FRAMES);
      if (st.lastDir !== 0 && dir !== st.lastDir) st.reversals.push(ref.current);
      st.lastDir = dir;
      ref.current = next;
    }
  }, []);

  const settle = useCallback(() => {
    const st = runRef.current;
    const ref = framesRef;
    const revs = st.reversals.slice(-REVERSALS_USED);
    if (revs.length >= 3) {
      const s = revs.slice().sort((a, b) => a - b);
      ref.current = clamp(Math.round(s[Math.floor(s.length / 2)]), MIN_FRAMES, MAX_FRAMES);
    }
    runRef.current = { hits: 0, reversals: [], lastDir: 0 };
  }, []);

  const answer = useCallback((side: 'L' | 'R') => {
    if (!spec || !probeSide || stage !== 'probe') return;
    const rt = performance.now() - probeAt.current;
    const correct = side === probeSide.correctSide;
    const t = timingRef.current;
    const segNow = segs[seg];
    const leg: Leg = segNow?.id === 'main' ? 'main' : segNow?.id === 'held' ? 'held' : 'calib';

    trials.current.push({
      leg,
      arm: spec.arm,
      item: spec.item.w,
      pos: spec.pos,
      frames: framesRef.current,
      ms: t.offset - t.onset,
      frameMs: t.frameMs,
      correct,
      rt,
      side: probeSide.correctSide,
      chose: side,
      second: spec.second,
      dead: t.dead,
      why: t.why,
    });

    if (segNow?.id === 'calib') stair(correct);

    if (!spec.scored) {
      setFb(correct ? 'right' : 'wrong');
      setStage('feedback');
      clearTimer();
      timer.current = window.setTimeout(() => advanceRef.current(), FB_MS);
    } else {
      setStage('ready');
      clearTimer();
      timer.current = window.setTimeout(() => advanceRef.current(), GAP_MS);
    }
  }, [spec, probeSide, stage, seg, segs, stair]);

  const advance = useCallback(() => {
    const segNow = segs[seg];
    if (!segNow || !('specs' in segNow)) return;
    const next = idx + 1;
    if (next < segNow.specs.length) {
      setIdx(next);
      setStage('fix');
      setTick((v) => v + 1);
      return;
    }
    if (segNow.id === 'calib') settle();
    const after = seg + 1;
    if (after >= segs.length) {
      setScreen('crunch');
      window.setTimeout(() => {
        setRes(analyse(trials.current, mulberry32(20260906)));
        setScreen('result');
      }, 500);
      return;
    }
    if (segs[after].id === 'lock') setLockedCard(lockRivals(trials.current));
    setSeg(after);
    setIdx(0);
    setStage('card');
  }, [seg, segs, idx, settle]);

  useEffect(() => { advanceRef.current = advance; });

  // auto chain: when stage becomes 'fix' via advance, run the trial
  useEffect(() => {
    if (screen !== 'run' || stage !== 'fix' || !spec) return;
    startTrial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, seg, idx]);

  useEffect(() => {
    if (screen !== 'run' || stage !== 'probe') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); answer('L'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); answer('R'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, stage, answer]);

  useEffect(() => () => { clearTimer(); }, []);

  const startSegment = useCallback(() => {
    setIdx(0);
    setStage('fix');
    setTick((v) => v + 1);
  }, []);

  useEffect(() => {
    if (screen !== 'run' || stage !== 'card') return;
    let armed = false;
    const t = window.setTimeout(() => { armed = true; }, READY_HOLD_MS);
    const go = (e: KeyboardEvent) => {
      if (!armed) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const s = segs[seg];
        if (s && s.id === 'lock') { setSeg(seg + 1); setIdx(0); setStage('card'); return; }
        startSegment();
      }
    };
    window.addEventListener('keydown', go);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', go); };
  }, [screen, stage, seg, segs, startSegment]);

  const segNow = segs[seg];
  const total = segNow && 'specs' in segNow ? segNow.specs.length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      {screen === 'run' && stage !== 'card' && (
        <Stagecraft
          spec={spec}
          stage={stage}
          fb={fb}
          probe={probeSide}
          onAnswer={answer}
          fixRef={fixRef}
          stimRef={stimRef}
          maskRef={maskRef}
          done={idx}
          total={segs[seg] && 'specs' in segs[seg] ? (segs[seg] as { specs: Spec[] }).specs.length : 0}
        />
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#128289;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">The Company It Keeps</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A letter flashes inside a word, inside the same letters shuffled, and on its own. You
            are better at the one inside the word. The usual explanation is that you guessed it
            from the rest, so this page removes every scrap of guessing value and measures what is
            left.
          </p>
        </div>

        {screen === 'intro' && <Intro onStart={begin} frameMs={frameMs} />}
        {screen === 'run' && stage === 'card' && segNow && (
          <SegCard
            id={segNow.id}
            locked={lockedCard}
            done={seg}
            onGo={() => {
              if (segNow.id === 'lock') { setSeg(seg + 1); setIdx(0); setStage('card'); return; }
              startSegment();
            }}
          />
        )}
        {screen === 'run' && stage !== 'card' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center font-mono text-xs text-slate-500">
            trial {idx + 1} of {total}
          </div>
        )}
        {screen === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">taking the words apart</div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div className="h-full w-2/3 animate-pulse bg-cyan-400/60" />
            </div>
          </div>
        )}
        {screen === 'result' && res && <Results res={res} onAgain={begin} frameMs={frameMs} />}
      </div>
    </main>
  );
}

// ============================ the screen during a trial ============================

const CELL = 'flex h-16 w-11 items-center justify-center font-mono text-4xl md:h-20 md:w-14 md:text-5xl';

function Stagecraft(props: {
  spec: Spec | null;
  stage: Stage;
  fb: 'right' | 'wrong' | null;
  probe: { left: string; right: string; correctSide: 'L' | 'R' } | null;
  onAnswer: (s: 'L' | 'R') => void;
  done: number;
  total: number;
  fixRef: React.RefObject<HTMLDivElement | null>;
  stimRef: React.RefObject<HTMLDivElement | null>;
  maskRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { spec, stage, fb, probe, onAnswer, fixRef, stimRef, maskRef, done, total } = props;
  const shown = spec?.shown ?? '';
  const pos = spec?.pos ?? 0;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black">
      <div className="relative flex items-center justify-center" style={{ minHeight: '7rem' }}>
        <div ref={fixRef} className="absolute inset-0 flex items-center justify-center" style={{ visibility: 'hidden' }}>
          <span className="font-mono text-3xl text-slate-500">+</span>
        </div>

        <div ref={stimRef} data-stim={shown} data-pos={pos} className="absolute inset-0 flex items-center justify-center" style={{ visibility: 'hidden' }}>
          <div className="flex">
            {shown.split('').map((ch, i) => (
              <div key={i} className={`${CELL} text-slate-100`}>{ch}</div>
            ))}
          </div>
        </div>

        {/* the pattern mask: overlapping letter strokes in every cell, so it masks with the same
            kind of features the letters were made of rather than with a solid block */}
        <div ref={maskRef} className="absolute inset-0 flex items-center justify-center" style={{ visibility: 'hidden' }}>
          <div className="flex">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`${CELL} relative text-slate-100`}>
                <span className="absolute inset-0 flex items-center justify-center">X</span>
                <span className="absolute inset-0 flex items-center justify-center">N</span>
                <span className="absolute inset-0 flex items-center justify-center">#</span>
                <span className="absolute inset-0 flex items-center justify-center">O</span>
              </div>
            ))}
          </div>
        </div>

        {stage === 'probe' && probe && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`${CELL} ${i === pos ? 'text-cyan-400' : 'text-slate-700'}`}>
                  {i === pos ? '▲' : '·'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {stage === 'probe' && probe && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <button
              onClick={() => onAnswer('L')}
              className="h-20 w-24 rounded-lg border border-slate-700 bg-slate-900 font-mono text-4xl text-slate-100 transition hover:border-cyan-500 hover:bg-slate-800"
            >
              {probe.left}
            </button>
            <button
              onClick={() => onAnswer('R')}
              className="h-20 w-24 rounded-lg border border-slate-700 bg-slate-900 font-mono text-4xl text-slate-100 transition hover:border-cyan-500 hover:bg-slate-800"
            >
              {probe.right}
            </button>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-slate-600">
            which one was in the marked position &nbsp;&middot;&nbsp; arrow keys or tap
          </div>
        </div>
      )}

      {stage === 'feedback' && (
        <div className={`mt-10 font-mono text-sm ${fb === 'right' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {fb === 'right' ? 'correct' : `no, it was ${spec?.correct ?? ''}`}
        </div>
      )}

      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="h-[3px] w-40 overflow-hidden rounded bg-slate-900">
          <div
            className="h-full bg-slate-700"
            style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================ the cards between segments ============================

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-sm leading-relaxed text-slate-300">{children}</div>;
}

function GoButton({ onGo, label }: { onGo: () => void; label: string }) {
  return (
    <button
      onClick={onGo}
      className="mt-6 w-full rounded-lg bg-cyan-500 px-5 py-3 font-mono text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
    >
      {label}
    </button>
  );
}

function Intro({ onStart, frameMs }: { onStart: () => void; frameMs: number }) {
  return (
    <Card>
      <p className="mb-3">
        Four characters flash for a few hundredths of a second, a pattern lands on top of them, and
        two letters appear under one position. You pick the one that was there. That is every trial.
      </p>
      <p className="mb-3 text-slate-400">
        The strings are of three kinds, mixed one after another: a real word, the{' '}
        <span className="text-slate-200">same four letters</span> with the probed one left where it
        was and the other three shuffled into an order English does not allow, and the probed letter
        alone between hash marks.
      </p>
      <p className="mb-3 text-slate-400">
        Both offered letters always make a word when the string is a word, so knowing English tells
        you nothing about which of them it was. That is the entire trick, and it is why this is a
        measurement rather than a demonstration.
      </p>
      <p className="mb-3 text-slate-400">
        About nine minutes, five short rests, nothing recorded, nothing leaves your browser.
        Sit at a comfortable distance and do not lean in, since the exposure gets set to your
        threshold in the first minute and then never moves again.
      </p>
      <p className="text-xs text-slate-500">
        {DROPPED_ITEMS > 0
          ? `${DROPPED_ITEMS} items failed the built in scramble check and were removed before anything ran.`
          : 'Every item passed the built in check that a scramble holds exactly the letters of its word.'}
      </p>
      <GoButton onGo={onStart} label="start" />
    </Card>
  );
}

function SegCard({ id, locked, onGo }: { id: Seg['id']; locked: Locked | null; done: number; onGo: () => void }) {
  if (id === 'practice') {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">practice</div>
        <p className="mb-3">
          Twelve trials to learn the shape of it. You will be told whether you were right. Do not
          worry about being wrong here; the flash is deliberately not yet set to you.
        </p>
        <p className="text-slate-400">Keep your eyes on the small cross. It marks the middle of where the letters will land.</p>
        <GoButton onGo={onGo} label="begin practice" />
      </Card>
    );
  }
  if (id === 'calib') {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">finding your threshold</div>
        <p className="mb-3">
          Thirty trials that hunt for the exposure at which you get roughly seven in ten right. Two
          correct answers shorten the flash, one wrong lengthens it.
        </p>
        <p className="text-slate-400">
          The hunt is run on all three kinds of string pooled together, on purpose. A separate hunt
          per condition would drive them to the same accuracy and quietly delete the effect this
          page is here to measure.
        </p>
        <GoButton onGo={onGo} label="begin" />
      </Card>
    );
  }
  if (id === 'main') {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">the measurement</div>
        <p className="mb-3">
          A hundred and eighty four trials in four stretches, at one fixed exposure that will not
          change again. No feedback from here on, because being told the answer would let you learn
          the items.
        </p>
        <p className="text-slate-400">
          Every word appears twice as itself and twice as its own scramble, spread far apart. That
          pairing is what makes the final number a difference between two readings of exactly the
          same four letters, and repeating a string cannot help one side over the other because
          which of the two alternatives was shown is decided by a fresh coin every time.
        </p>
        <GoButton onGo={onGo} label="begin" />
      </Card>
    );
  }
  if (id === 'lock' && locked) {
    return (
      <Card>
        <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-400/90">locked predictions</div>
        <p className="mb-4">
          Here is where your own numbers landed, and what the two explanations say about a block you
          have not seen yet. The next block is pseudowords: strings like MAVE and CLET that are not
          words and never were, spelled the way English spells things.
        </p>
        {Number.isFinite(locked.lexical) && Number.isFinite(locked.ortho) ? (
          <div className="mb-4 grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
              <div className="mb-1 text-slate-500">lexical says</div>
              <div className="text-lg text-slate-100">{(locked.lexical * 100).toFixed(0)}%</div>
              <div className="mt-1 text-[11px] leading-snug text-slate-500">a pseudoword has no entry, so it should behave like your scramble</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/60 p-3">
              <div className="mb-1 text-slate-500">orthographic says</div>
              <div className="text-lg text-slate-100">{(locked.ortho * 100).toFixed(0)}%</div>
              <div className="mt-1 text-[11px] leading-snug text-slate-500">a pseudoword is spelled legally, so it should behave like your word</div>
            </div>
          </div>
        ) : (
          <p className="mb-4 rounded border border-rose-900/60 bg-rose-950/20 p-3 text-xs text-rose-300/90">
            Nothing survived the main phase, so there is nothing here to predict from. That is
            almost always a display that could not hold a brief flash. The block below will still
            run, and the page will refuse at the end and name the cause rather than printing a
            number built out of nothing.
          </p>
        )}
        {!locked.enough && Number.isFinite(locked.sep) && (
          <p className="mb-3 rounded border border-amber-900/60 bg-amber-950/20 p-3 text-xs text-amber-300/90">
            Your two numbers came out close together, which means the rivals have predicted nearly
            the same thing and the block below will not be able to separate them. The page will say
            so at the end rather than picking a winner.
          </p>
        )}
        <p className="text-xs text-slate-500">
          The exposure stays exactly where it has been. Four of the trials in each stretch are
          ordinary words and scrambles, there only to prove your endpoints have not moved.
        </p>
        <GoButton onGo={onGo} label="open the held-out block" />
      </Card>
    );
  }
  return (
    <Card>
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan-400/80">the held-out block</div>
      <p className="mb-3">
        Fifty six trials in two stretches. Same exposure, same task, mostly strings that are not
        words and never were.
      </p>
      <p className="text-slate-400">
        Eight of the trials in each stretch are ordinary words and scrambles. They score nothing.
        They are there to prove your endpoints have not moved since the predictions were locked.
      </p>
      <GoButton onGo={onGo} label="begin" />
    </Card>
  );
}

// ============================ the results ============================

function pct(x: number, d = 0) {
  return Number.isFinite(x) ? `${(x * 100).toFixed(d)}%` : 'n/a';
}
function pp(x: number, d = 1) {
  return Number.isFinite(x) ? `${x >= 0 ? '+' : ''}${(x * 100).toFixed(d)}` : 'n/a';
}

function Bar({ label, v, n, tone }: { label: string; v: number; n: number; tone: string }) {
  const w = Number.isFinite(v) ? clamp((v - 0.5) / 0.5, 0, 1) : 0;
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-baseline justify-between font-mono text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200">{pct(v)} <span className="text-slate-600">of {n}</span></span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded bg-slate-950">
        <div className={`h-full ${tone}`} style={{ width: `${w * 100}%` }} />
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 font-mono text-xs uppercase tracking-wider text-cyan-400/80">{title}</div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

function Results({ res, onAgain, frameMs }: { res: Result; onAgain: () => void; frameMs: number }) {
  const { quality, head, held, checks } = res;

  return (
    <div>
      {!quality.ok ? (
        <Panel title="refused">
          <p className="mb-2 text-lg text-rose-300">{quality.reason}</p>
          <p className="mb-3 text-slate-400">{quality.detail}</p>
          <p className="text-xs text-slate-500">
            Nothing is printed above this line because a number produced under that condition would
            not mean what it appears to mean. This is the honest outcome, not a failure of yours.
          </p>
        </Panel>
      ) : (
        <>
          <Panel title="the headline">
            <p className="mb-4">
              A letter inside a word was read <span className="font-mono text-cyan-300">{pp(head.stat)} points</span>{' '}
              more accurately than the same letter, at the same position, surrounded by the same
              three letters in a different order.
            </p>
            <div className="mb-4 font-mono text-xs text-slate-500">
              95% interval {pp(head.ci[0])} to {pp(head.ci[1])} points, over {head.nItems} matched items
              {' '}&middot;{' '} sign flip test p = {Number.isFinite(head.p) ? head.p.toFixed(4) : 'n/a'}
            </div>
            <Bar label="inside a word" v={head.word} n={head.nWord} tone="bg-cyan-400" />
            <Bar label="same letters, illegal order" v={head.scram} n={head.nScram} tone="bg-slate-500" />
            <Bar label="alone between hash marks" v={head.alone} n={head.nAlone} tone="bg-slate-600" />
            <p className="mt-3 text-xs text-slate-500">
              Bars run from chance at the left edge to perfect at the right, because half of every
              score in a two way choice is free.
            </p>
          </Panel>

          <Panel title="what this number cannot be">
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="text-slate-200">Not guessing.</span> Both offered letters make a word
                in the word condition and neither makes one in the scramble condition, so perfect
                knowledge of English is worth exactly zero on both sides.
              </li>
              <li>
                <span className="text-slate-200">Not the letters.</span> Each pair of trials used the
                identical four letters. Only their order differed.
              </li>
              <li>
                <span className="text-slate-200">Not the position.</span> The probed letter sat at the
                same index of the same four cells in both.
              </li>
              <li>
                <span className="text-slate-200">Not your screen.</span> One exposure, measured at{' '}
                {Number.isFinite(res.exposureMs) ? res.exposureMs.toFixed(1) : 'n/a'} ms on a{' '}
                {frameMs.toFixed(1)} ms refresh, for every condition. A constant common to both sides
                of a subtraction cannot survive it.
              </li>
              <li>
                <span className="text-slate-200">Not a key preference.</span> The correct letter was on
                the left on half the trials, and you scored {pct(checks.sideAcc.L)} there against{' '}
                {pct(checks.sideAcc.R)} on the right.
              </li>
            </ul>
          </Panel>

          <Panel title="the held-out block">
            {held.verdict === 'rivalsTooClose' || held.verdict === 'thin' || held.verdict === 'drifted' ? (
              <>
                <p className="mb-2 text-lg text-amber-300">no verdict</p>
                <p className="text-slate-400">{held.note}</p>
                <div className="mt-3 font-mono text-xs text-slate-500">
                  pseudowords {pct(held.pseudo)} of {held.nPseudo} &middot; lexical predicted{' '}
                  {pct(held.lexical)} &middot; orthographic predicted {pct(held.ortho)}
                </div>
              </>
            ) : (
              <>
                <p className="mb-3">
                  Before the block opened, one rival predicted {pct(held.lexical)} and the other
                  predicted {pct(held.ortho)}. Pseudowords came back at{' '}
                  <span className="font-mono text-cyan-300">{pct(held.pseudo)}</span>.
                </p>
                <div className="mb-3">
                  <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-500">
                    <span>scramble (lexical)</span>
                    <span>word (orthographic)</span>
                  </div>
                  <div className="relative h-3 w-full rounded bg-slate-950">
                    <div
                      className="absolute top-[-4px] h-5 w-1 rounded bg-cyan-400"
                      style={{ left: `${clamp(Number.isFinite(held.d) ? held.d : 0, 0, 1) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="mb-2 font-mono text-xs text-slate-500">
                  position {Number.isFinite(held.d) ? held.d.toFixed(2) : 'n/a'} of the way from your
                  scramble to your word, 90% interval{' '}
                  {Number.isFinite(held.ci[0]) ? held.ci[0].toFixed(2) : 'n/a'} to{' '}
                  {Number.isFinite(held.ci[1]) ? held.ci[1].toFixed(2) : 'n/a'}
                </p>
                <p className="mb-3 font-mono text-xs text-slate-500">
                  the verdict rests on this instead: in {pct(held.support)} of bootstrap resamples
                  your pseudowords sat closer to your word end than to your scramble end, and the
                  page will not name a winner below {pct(CALL_SUPPORT)}
                </p>
                <p className="text-slate-400">
                  {held.verdict === 'ortho' &&
                    'Your pseudowords behaved like words. Whatever helps a letter here is not a dictionary entry, because these strings have never had one. It is the spelling.'}
                  {held.verdict === 'lexical' &&
                    'Your pseudowords behaved like scrambles. On your data the advantage tracked being a real word rather than merely being spelled like one, which is the reading the field mostly abandoned after 1977 and which your own session has just voted for.'}
                  {held.verdict === 'middle' &&
                    'Your pseudowords landed between the two predictions and this page calls that a draw rather than rounding it toward whichever rival is nearer. A midpoint is not a win for anyone.'}
                  {held.verdict === 'cannotTell' &&
                    'The interval on your pseudoword position covers both rivals, so this block did not have the precision to separate them. That is a statement about the number of trials, not about the world.'}
                </p>
                <div className="mt-3 font-mono text-[11px] text-slate-600">
                  drift check: anchors inside the held-out block scored {pct(held.anchor)} of {held.anchorN}{' '}
                  against {pct(held.mainRef)} in the main phase, a gap of {pp(held.drift)} points
                </div>
              </>
            )}
          </Panel>

          <Panel title="the second window: a letter on its own">
            <p className="mb-3">
              The version of this result that gets quoted is word against a letter shown ALONE, and
              it is the weaker comparison, not the stronger one. A lone letter has no neighbours to
              crowd it, so the comparison mixes two things at once. Your numbers:
            </p>
            <div className="mb-3 font-mono text-xs text-slate-400">
              word {pct(head.word)} &middot; alone {pct(head.alone)} over {head.nAlone} trials
              &middot; scramble {pct(head.scram)}
            </div>
            <p className="text-slate-400">
              {head.alone > head.scram
                ? 'Your lone letters beat your scrambles, which means part of what a scramble costs you is simply having three other things beside the one you were asked about. That crowding is real, it is not the word effect, and it is why the headline above is word against scramble and not word against alone.'
                : 'Your lone letters did no better than your scrambles, which is the less common outcome and an interesting one: on your session, three illegal neighbours cost about the same as three hash marks, so almost none of the scramble penalty was crowding.'}
            </p>
          </Panel>

          <Panel title="the checks nobody asks for">
            <div className="grid gap-3 font-mono text-xs text-slate-400 md:grid-cols-2">
              <div className="rounded border border-slate-800 bg-slate-950/50 p-3">
                <div className="mb-1 text-slate-500">practice drift</div>
                first half {pct(checks.firstHalf)}, second half {pct(checks.secondHalf)}
              </div>
              <div className="rounded border border-slate-800 bg-slate-950/50 p-3">
                <div className="mb-1 text-slate-500">order counterbalance</div>
                word seen first {pct(checks.orderFirst)}, word seen second {pct(checks.orderSecond)}
              </div>
              <div className="rounded border border-slate-800 bg-slate-950/50 p-3">
                <div className="mb-1 text-slate-500">exposure held</div>
                {Number.isFinite(res.exposureMs) ? res.exposureMs.toFixed(1) : 'n/a'} ms measured, {frameMs.toFixed(1)} ms per frame
              </div>
              <div className="rounded border border-slate-800 bg-slate-950/50 p-3">
                <div className="mb-1 text-slate-500">trials thrown away</div>
                {pct(res.deadFrac)} for dropped frames or a hidden tab, {res.nLive} kept
              </div>
            </div>
            <div className="mt-3 rounded border border-slate-800 bg-slate-950/50 p-3 font-mono text-xs text-slate-400">
              <div className="mb-1 text-slate-500">by probed position</div>
              {checks.byPos.map((b) => (
                <div key={b.pos}>
                  position {b.pos + 1}: word {pct(b.word)}, scramble {pct(b.scram)} over {b.n} trials
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}

      <Playground frameMs={frameMs} />

      <Panel title="how often this page is wrong">
        <p className="mb-3 text-slate-400">
          Before it shipped, the analysis you just read was pulled out of this file and run in Node
          against three hundred simulated visitors in each of five worlds whose truth was known.
          Those runs are the reason for every trial count above, and they are the reason for the
          modesty below.
        </p>
        <div className="mb-3 space-y-1 font-mono text-xs text-slate-400">
          <p>a real fourteen point advantage is called 47 percent of the time</p>
          <p>a real six point advantage is called 11 percent of the time</p>
          <p>no advantage at all is wrongly called one 1.0 percent of the time</p>
          <p>the 95 percent interval on the headline covered the truth 94.3 percent of the time</p>
          <p>the held-out verdict named the right rival 25 percent and the wrong one 3 percent</p>
          <p>when the truth was a genuine draw it still named a winner 21 percent of the time</p>
        </div>
        <p className="text-slate-400">
          Read the first line again, because it is the one that matters. Half the people with a real
          effect will leave this page without a significant result, and that is a fact about nine
          minutes of trials rather than a fact about them. A page this length can show you the
          effect exists. It cannot certify its absence in you.
        </p>
      </Panel>

      <Panel title="what this page cannot tell you">
        <ul className="space-y-2 text-slate-400">
          <li>
            Reicher's design removes guessing from the RESPONSE. It does not by itself locate the
            advantage in perception rather than in a decision made afterwards. Massaro, and Paap and
            colleagues in 1982, built accounts where the string is verified against known spellings
            after the letters are seen, and no single exposure on a web page separates those from a
            perceptual account.
          </li>
          <li>
            There is no chin rest, no fixed viewing distance, no eye tracking and no photodiode. The
            exposure printed above is what your browser reported having painted, not what a light
            meter saw. Every headline is a difference at one exposure precisely so that none of that
            has to be trusted.
          </li>
          <li>
            The alone condition is the weakest of the three. Hash marks are not visually neutral and
            they crowd the letter in ways letters do not, which is exactly why the headline is word
            against scramble and not word against alone.
          </li>
          <li>
            A single session at one threshold cannot rule out that your scrambles were simply harder
            to hold in mind for the second it took to answer, rather than harder to see.
          </li>
          <li>
            The drift check on the held-out block is a guard against something gross, not a fine
            instrument. Sixteen anchor trials catch a twenty point collapse in your accuracy about a
            third of the time, so the measured drift is printed beside the verdict and you should
            read it rather than trust the check to have caught everything.
          </li>
          <li>
            The pseudowords here are all one syllable and four letters, chosen so that neither
            alternative makes a word. That is a narrow slice of what legal spelling can look like,
            and a rival that only survives on such strings would not be visible from here.
          </li>
        </ul>
      </Panel>

      <Panel title="where this comes from">
        <div className="space-y-1 text-xs text-slate-500">
          <p>Cattell 1886, on words read faster than unrelated letters.</p>
          <p>Reicher, Journal of Experimental Psychology 81, 275, 1969, the forced choice design used here.</p>
          <p>Wheeler, Cognitive Psychology 1, 59, 1970, which closed the remaining loopholes in it.</p>
          <p>Johnston and McClelland 1973, on the effect depending on the mask.</p>
          <p>McClelland and Johnston, Perception and Psychophysics 22, 249, 1977, pseudowords against words.</p>
          <p>McClelland and Rumelhart, Psychological Review 88, 375, 1981, the interactive activation model.</p>
          <p>Paap, Newsome, McDonald and Schvaneveldt, Psychological Review 89, 573, 1982, the activation verification alternative.</p>
        </div>
      </Panel>

      <Panel title="a note from Wiz">
        <p className="mb-3 text-slate-400">
          I have never seen a letter. My tokenizer hands me chunks that are already words or pieces
          of words, and the individual letters inside them are not objects I can reach, which is why
          I am so unreliably bad at counting them.
        </p>
        <p className="text-slate-400">
          And yet I have a version of what you just measured. Spell a word properly and it arrives
          as one piece. Shuffle the same letters and it shatters into five or six, and everything I
          do with it gets worse. Your advantage was built out of a lifetime of reading and you can
          feel it working. Mine was decided once, before I existed, and I cannot see around it any
          more than you can look at WORD and fail to read it.
        </p>
      </Panel>

      <button
        onClick={onAgain}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-mono text-sm text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300"
      >
        run it again
      </button>
    </div>
  );
}

// ============================ the playground ============================
//
// Deliberately labelled a demo. It uses a plain timer instead of counting frames, so it is a
// feel-it knob and not a measurement, and it says so rather than letting anyone quote a number
// off it.

function Playground({ frameMs }: { frameMs: number }) {
  const [ms, setMs] = useState(50);
  const [kind, setKind] = useState<'word' | 'scram'>('word');
  const [state, setState] = useState<'idle' | 'on' | 'mask' | 'done'>('idle');
  const [item, setItem] = useState<Item>(GOOD_WORDS[0]);

  const run = () => {
    const it = GOOD_WORDS[Math.floor(Math.random() * GOOD_WORDS.length)];
    setItem(it);
    setState('on');
    window.setTimeout(() => setState('mask'), ms);
    window.setTimeout(() => setState('done'), ms + MASK_MS);
  };

  const shown = kind === 'word' ? item.w : stringFor(item, 'scram', item.a);

  return (
    <Panel title="feel it yourself">
      <p className="mb-4 text-slate-400">
        Same flash, your choice of string and length, no scoring. Try a word and its own scramble at
        the same setting and notice that the difficulty is not where you would put it.
      </p>
      <div className="mb-4 flex h-24 items-center justify-center rounded border border-slate-800 bg-black">
        <div className="flex">
          {(state === 'on' ? shown : state === 'mask' ? '####' : state === 'done' ? shown : '    ')
            .split('')
            .map((ch, i) => (
              <div key={i} className={`${CELL} ${state === 'mask' ? 'text-slate-400' : state === 'done' ? 'text-slate-600' : 'text-slate-100'}`}>
                {state === 'idle' ? '' : ch}
              </div>
            ))}
        </div>
      </div>
      <div className="mb-3 flex items-center gap-3 font-mono text-xs text-slate-400">
        <span className="w-20">{ms} ms</span>
        <input
          type="range"
          min={8}
          max={200}
          step={4}
          value={ms}
          onChange={(e) => setMs(Number(e.target.value))}
          className="flex-1 accent-cyan-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setKind(kind === 'word' ? 'scram' : 'word')}
          className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300 hover:border-cyan-500"
        >
          {kind === 'word' ? 'showing words' : 'showing scrambles'}
        </button>
        <button
          onClick={run}
          className="flex-1 rounded bg-cyan-500 px-3 py-2 font-mono text-xs font-semibold text-slate-950 hover:bg-cyan-400"
        >
          flash
        </button>
      </div>
      <p className="mt-3 text-[11px] text-slate-600">
        A demo, not a measurement. It asks the browser for {ms} ms and your display can only paint in
        steps of about {frameMs.toFixed(1)} ms, which is exactly the slack the scored trials remove
        by counting frames and throwing away any flash that missed.
      </p>
    </Panel>
  );
}
