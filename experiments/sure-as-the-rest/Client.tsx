'use client';

// SURE AS THE REST  (the word that was never there, and how sure you were about it)
//
// The seventy sixth piece in this lab, and the third that goes after a sentence rather than a
// page. The sentence is the one everybody says about their own memory: I remember it clearly,
// so it happened.
//
// THE RESULT THAT IS NOT IN DOUBT.
//
// Read a list of words that are all associates of one word, and then leave that one word out.
// bed, rest, awake, tired, dream, wake, snooze, blanket, doze, slumber, snore, nap. SLEEP was
// never on it. A large share of people will later say SLEEP was on it, and will say so with the
// same confidence they bring to the words that actually were. Deese found it in 1959 while doing
// something else (Journal of Experimental Psychology 58, 17), Roediger and McDermott rebuilt it
// as a recognition test in 1995 (JEP Learning Memory and Cognition 21, 803), and it has since
// been run on thousands of people, in a dozen languages, with and without warnings.
//
// THE EXPLANATION EVERYBODY GIVES, AND WHAT IT ACTUALLY COMMITS TO.
//
// "Memory is not a recording, it reconstructs." True, and useless as stated, because it predicts
// nothing in particular. The version worth testing is the one people actually live by, which is
// the recording with gaps: what you stored is some of what happened, forgetting is loss, and a
// thing you never met is a thing you never met. That account is not vague at all. It says a word
// that was never presented is a NEW word, and one new word is like another. So the rate at which
// you call SLEEP old has to be the rate at which you call any comparable new word old.
//
// It is not. It is usually near the rate at which you call a word that WAS on the list old, and
// occasionally above it.
//
// SO THE PAGE PUTS THE ACCOUNTS ON ONE NUMBER WITH TWO STRUCTURAL VALUES.
//
// Three rates come out of your session, all of them proportions of your own responses:
//
//   STUDIED     words that really were in front of your eyes.
//   THE LURE    the word all twelve of them point at, which was not.
//   NEW         the critical word of a list you did not study, which is the same kind of word
//               doing the same job, chosen by a coin flip at the start of the session.
//
// Then
//
//   PULL  =  (lure - new) / (studied - new)
//
// and the accounts have already committed, before your first word:
//
//   A RECORDING WITH GAPS   a word you never met is new. lure = new. Your pull is 0.
//   THE GIST IS THE MEMORY  what survives is the theme, and the lure IS the theme, more central
//                           to it than any single word on the list. lure = studied. Pull is 1.
//   ABOVE ONE               is available, and it is not a rounding error: it says the theme was
//                           remembered better than the words that carried it. Roediger and
//                           McDermott got exactly that in their second experiment.
//
// None of those numbers was estimated from anything you do. They are consequences of what each
// account claims, which is why the commitment card prints before the first list instead of being
// fitted afterwards.
//
// THE CONFOUND THAT RUINS THE OBVIOUS VERSION OF THIS EXPERIMENT.
//
// The obvious build shows a list, asks was SLEEP on it, and counts how often people say yes. It
// cannot separate anything, for two reasons that have nothing to do with memory. A visitor who
// says old to everything produces the same yes. And SLEEP is a common, easy, well worn word, so
// it might feel familiar on its own merits next to whatever it is being compared against.
//
// Both are handled by construction rather than by apology.
//
//   THE BASELINE IS THE SAME KIND OF WORD.  Twenty four lists exist here and a coin flip at the
//   start of your session sends twelve to the study phase and twelve nowhere. The critical word
//   of a list you did NOT study is your baseline. It is a critical word of a Roediger list, of
//   the same kind, at the same place in the same design, differing from your lure in exactly one
//   thing: whether the twelve words pointing at it went past your eyes. Across visitors every
//   word plays both roles.
//
//   SAYING OLD A LOT CANCELS TWICE.  The pull is a difference over a difference. A criterion that
//   lifts every rate lifts the numerator and the denominator together, and the ratio barely
//   moves. Then it is tested directly rather than assumed away: the whole thing is computed a
//   second time using only the responses where you said you were SURE. A bias story predicts the
//   pull falls when the loose responses are thrown out. A memory story predicts it does not.
//
// THE THIRD RIVAL, WHICH IS A REGION AND GETS ITS OWN NUMBER.
//
// You could be reconstructing at the test rather than remembering at all: shown a word, you ask
// whether it fits anything you saw, and say old when it does. That predicts something specific
// and testable. Each list here is fifteen words long and only the first twelve are shown. The
// last three, the weakest associates, are held back and put in the test as words that are
// related to a list you studied and were never presented either. If you are endorsing whatever
// fits the theme, those should do as well as the lure.
//
//   SPREAD  =  (weak related - new) / (lure - new)
//
//   RECONSTRUCTING AT TEST   anything thematically plausible gets endorsed. Spread near 1.
//   THE LURE SPECIFICALLY    the effect tracks associative strength, so it falls off hard.
//                            Spread well below 1.
//
// CALIBRATION IS ONE SENTENCE, FOR THE FIRST TIME IN THIS LAB.
//
// There is not a millisecond in the headline. Every number above is a proportion of your own
// responses, so there is no clock to trust, no display latency to subtract, no screen that can
// reach the answer. Reaction times are collected only to catch a visitor clicking through.
//
// THE DENOMINATOR IS ALSO THE ATTENTION CHECK, AND IT COMES FIRST.
//
// The pull divides by how much better you did on words you actually saw than on words you did
// not. A visitor who spent the study phase somewhere else has no gap there, and a ratio with a
// denominator near zero is not an imprecise answer, it is a different question. So the page
// refuses to form it and says which half failed. There is no way to fake this one upward: you
// cannot produce a large pull without first producing real memory for real words.
//
// WHAT WOULD KILL IT, checked in order and named out loud.
//
//   the study phase happened elsewhere     hidden tab time during the lists is counted
//   not watching                           four words flash amber between lists, press space
//   clicking through                       responses under 300 ms, and the spread of your times
//   one button all session                 share of the most used key
//   old to everything, or new to everything overall old rate outside 10 to 90 percent
//   no memory to be false about            studied minus new under the floor: no denominator
//   too few lists survived                 eight of twelve is the floor
//
// LIMITS THIS PAGE PRINTS ABOUT ITSELF.
//
// The word lists follow the published norms (Roediger and McDermott 1995; Stadler, Roediger and
// McDermott, Memory and Cognition 27, 494, 1999) in content and in rank order as closely as a
// web page can, and not in their exact measured association strengths, so the graded prediction
// the SPREAD tests is a rank test rather than a fitted curve. One visitor contributes one
// response per list, so twelve lists is twelve observations for the numerator and the interval
// on the pull is wide by construction. And the lure rate is a rate for THESE lists: normed DRM
// lists are selected to work, so nothing here estimates how often ordinary experience does this.
//
// Everything runs in the browser. Nothing is recorded and nothing leaves the page.

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

// ============================ constants ============================

const BOOTS = 2000;
const PERMS = 5000;

export const LIST_LEN = 15;
export const SHOWN_LEN = 12;          // positions 0..11 are presented
export const EARLY = [0, 1, 2];       // strongest associates, presented
export const LATE = [9, 10, 11];      // weakest of the presented run
export const WEAK = [12, 13, 14];     // never presented, related to a studied list
export const N_STUDIED = 12;          // lists that go past your eyes
export const N_UNSTUDIED = 18;        // lists that supply the baseline
export const N_TEST = N_STUDIED * 4 + N_UNSTUDIED * 2;   // 84

export const WORD_MS = 1000;
export const GAP_MS = 250;
export const REST_MS = 2200;
export const CATCH_MS = 1500;
export const N_CATCH = 4;
export const FILLER_MS = 45000;

const RT_FAST = 300;                  // faster than this and the word was not read
const RT_SLOW = 25000;                // slower than this and something else happened

const MIN_LISTS = 8;                  // usable studied lists
const MAX_HIDDEN_STUDY = 0.1;
const MAX_CATCH_MISS = 1;
const MAX_FAST = 0.15;
const MAX_ONE_KEY = 0.7;
const MAX_OLD = 0.9;
const MIN_OLD = 0.1;
const MIN_DISC = 0.15;                // studied minus new, below this there is no denominator
const MIN_RT_SD = 60;
const MIN_FILLER_ACC = 0.6;           // flagged, not refused

// ============================ the lists ============================
//
// Thirty lists. The lure of each is the word every one of its members points at and the one word, which is never presented. The
// that is never presented. The fifteen members run from the strongest associate downward; the
// first twelve are shown and the last three are held back as the weak related items the SPREAD is
// built from.

export const LISTS: Array<{ lure: string; words: string[] }> = [
  { lure: 'SLEEP', words: ['bed', 'rest', 'awake', 'tired', 'dream', 'wake', 'snooze', 'blanket', 'doze', 'slumber', 'snore', 'nap', 'peace', 'yawn', 'drowsy'] },
  { lure: 'NEEDLE', words: ['thread', 'pin', 'eye', 'sewing', 'sharp', 'point', 'prick', 'thimble', 'haystack', 'pain', 'hurt', 'injection', 'syringe', 'cloth', 'knitting'] },
  { lure: 'CHAIR', words: ['table', 'sit', 'legs', 'seat', 'couch', 'desk', 'recliner', 'sofa', 'wood', 'cushion', 'swivel', 'stool', 'sitting', 'rocking', 'bench'] },
  { lure: 'MOUNTAIN', words: ['hill', 'valley', 'climb', 'summit', 'top', 'molehill', 'peak', 'plain', 'glacier', 'goat', 'bike', 'climber', 'range', 'steep', 'ski'] },
  { lure: 'SWEET', words: ['sour', 'candy', 'sugar', 'bitter', 'good', 'taste', 'tooth', 'nice', 'honey', 'soda', 'chocolate', 'heart', 'cake', 'tart', 'pie'] },
  { lure: 'DOCTOR', words: ['nurse', 'sick', 'lawyer', 'medicine', 'health', 'hospital', 'dentist', 'physician', 'ill', 'patient', 'office', 'stethoscope', 'surgeon', 'clinic', 'cure'] },
  { lure: 'ROUGH', words: ['smooth', 'bumpy', 'road', 'tough', 'sandpaper', 'jagged', 'ready', 'coarse', 'uneven', 'riders', 'rugged', 'sand', 'boards', 'ground', 'gravel'] },
  { lure: 'SMELL', words: ['nose', 'breathe', 'sniff', 'aroma', 'hear', 'see', 'nostril', 'whiff', 'scent', 'reek', 'stench', 'fragrance', 'perfume', 'salts', 'rose'] },
  { lure: 'ANGER', words: ['mad', 'fear', 'hate', 'rage', 'temper', 'fury', 'ire', 'wrath', 'happy', 'fight', 'hatred', 'mean', 'calm', 'emotion', 'enrage'] },
  { lure: 'COLD', words: ['hot', 'snow', 'warm', 'winter', 'ice', 'wet', 'frigid', 'chilly', 'heat', 'weather', 'freeze', 'air', 'shiver', 'arctic', 'frost'] },
  { lure: 'SOFT', words: ['hard', 'light', 'pillow', 'plush', 'loud', 'cotton', 'fur', 'touch', 'fluffy', 'feather', 'furry', 'downy', 'kitten', 'skin', 'tender'] },
  { lure: 'SLOW', words: ['fast', 'lethargic', 'stop', 'listless', 'snail', 'cautious', 'delay', 'traffic', 'turtle', 'hesitant', 'speed', 'quick', 'sluggish', 'wait', 'molasses'] },
  { lure: 'KING', words: ['queen', 'england', 'crown', 'prince', 'george', 'dictator', 'palace', 'throne', 'chess', 'rule', 'subjects', 'monarch', 'royal', 'leader', 'reign'] },
  { lure: 'WINDOW', words: ['door', 'glass', 'pane', 'shade', 'ledge', 'sill', 'house', 'open', 'curtain', 'frame', 'view', 'breeze', 'sash', 'screen', 'shutter'] },
  { lure: 'RIVER', words: ['water', 'stream', 'lake', 'boat', 'tide', 'swim', 'flow', 'run', 'barge', 'creek', 'brook', 'fish', 'bridge', 'winding', 'current'] },
  { lure: 'BLACK', words: ['white', 'dark', 'cat', 'charred', 'night', 'funeral', 'colour', 'grief', 'blue', 'death', 'ink', 'bottom', 'coal', 'brown', 'gray'] },
  { lure: 'MUSIC', words: ['note', 'sound', 'piano', 'sing', 'radio', 'band', 'horn', 'concert', 'instrument', 'symphony', 'jazz', 'orchestra', 'art', 'rhythm', 'melody'] },
  { lure: 'BREAD', words: ['butter', 'food', 'eat', 'sandwich', 'rye', 'jam', 'milk', 'flour', 'jelly', 'dough', 'crust', 'slice', 'wine', 'loaf', 'toast'] },
  { lure: 'FOOT', words: ['shoe', 'hand', 'toe', 'kick', 'sandals', 'soccer', 'yard', 'walk', 'ankle', 'arm', 'boot', 'inch', 'sock', 'mouth', 'heel'] },
  { lure: 'HIGH', words: ['low', 'clouds', 'up', 'tall', 'tower', 'jump', 'above', 'building', 'noon', 'cliff', 'sky', 'over', 'airplane', 'dive', 'elevate'] },
  { lure: 'THIEF', words: ['steal', 'robber', 'crook', 'burglar', 'money', 'cop', 'bad', 'rob', 'jail', 'gun', 'villain', 'crime', 'bank', 'bandit', 'criminal'] },
  { lure: 'SPIDER', words: ['web', 'insect', 'bug', 'fright', 'fly', 'arachnid', 'crawl', 'tarantula', 'poison', 'bite', 'creepy', 'animal', 'ugly', 'feelers', 'small'] },
  { lure: 'GIRL', words: ['boy', 'dolls', 'female', 'young', 'dress', 'pretty', 'hair', 'niece', 'dance', 'beautiful', 'cute', 'date', 'aunt', 'daughter', 'sister'] },
  { lure: 'TRASH', words: ['garbage', 'waste', 'can', 'refuse', 'sewage', 'bag', 'junk', 'rubbish', 'sweep', 'scraps', 'pile', 'dump', 'landfill', 'debris', 'litter'] },
  { lure: 'MAN', words: ['woman', 'husband', 'uncle', 'lady', 'male', 'father', 'strong', 'friend', 'beard', 'person', 'handsome', 'muscle', 'suit', 'fellow', 'gentleman'] },
  { lure: 'CITY', words: ['town', 'crowded', 'state', 'capital', 'streets', 'subway', 'country', 'village', 'metropolis', 'big', 'urban', 'skyscraper', 'downtown', 'suburb', 'busy'] },
  { lure: 'LION', words: ['tiger', 'circus', 'jungle', 'tame', 'den', 'cub', 'africa', 'mane', 'cage', 'feline', 'roar', 'zoo', 'hunter', 'pride', 'beast'] },
  { lure: 'FRUIT', words: ['apple', 'vegetable', 'banana', 'berry', 'cherry', 'basket', 'juice', 'salad', 'bowl', 'cocktail', 'kiwi', 'pear', 'ripe', 'citrus', 'grape'] },
  { lure: 'SHIRT', words: ['blouse', 'sleeves', 'pants', 'tie', 'button', 'collar', 'iron', 'jacket', 'polo', 'vest', 'sweater', 'pocket', 'wear', 'cuff', 'plaid'] },
  { lure: 'STOVE', words: ['oven', 'burner', 'gas', 'kitchen', 'cook', 'pot', 'pan', 'boil', 'fire', 'grill', 'coil', 'kettle', 'roast', 'simmer', 'flame'] },
];

// The amber words never belong to a list and never appear in the test. They exist to find out
// whether the screen still had someone in front of it.
const CATCH_WORDS = ['orange', 'amber', 'signal', 'flare', 'ember', 'copper'];

// ============================ small maths ============================

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rnd() {
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

function mean(a: number[]) {
  return a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN;
}

function sd(a: number[]) {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / (a.length - 1));
}

function median(a: number[]) {
  if (!a.length) return NaN;
  const s = a.slice().sort((x, y) => x - y);
  const h = Math.floor(s.length / 2);
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
}

function quantile(sorted: number[], p: number) {
  if (!sorted.length) return NaN;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
  return sorted[i];
}

function ciOf(v: number[], lo = 0.025, hi = 0.975): [number, number] {
  const s = v.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (s.length < 20) return [NaN, NaN];
  return [quantile(s, lo), quantile(s, hi)];
}

function resample<T>(a: T[], rnd: () => number): T[] {
  const out: T[] = [];
  for (let i = 0; i < a.length; i++) out.push(a[Math.floor(rnd() * a.length)]);
  return out;
}

// ============================ the plan ============================

export type ItemClass = 'studiedEarly' | 'studiedLate' | 'lure' | 'weak' | 'lureNew' | 'wordNew';

export const CLASSES: ItemClass[] = ['studiedEarly', 'studiedLate', 'lure', 'weak', 'lureNew', 'wordNew'];

export type StudyStep =
  | { kind: 'word'; listId: number; pos: number; word: string }
  | { kind: 'rest'; label: string }
  | { kind: 'catch'; word: string };

export type TestItem = { word: string; cls: ItemClass; listId: number };

export type Plan = {
  studied: number[];      // list ids that go past the eyes
  unstudied: number[];    // list ids that supply the baseline
  study: StudyStep[];
  test: TestItem[];
  catches: number;
};

// A word that appears in two lists is a word this design cannot use as a new item, because it is
// not new. The pool is filtered against everything actually presented before any baseline item is
// drawn, and a list that cannot supply a clean baseline is dropped rather than fudged.
export function buildPlan(rnd: () => number): Plan {
  const order = shuffled(LISTS.map((_, i) => i), rnd);
  const studied = order.slice(0, N_STUDIED);
  const rest = order.slice(N_STUDIED);

  const seen = new Set<string>();
  for (const id of studied) {
    for (let p = 0; p < SHOWN_LEN; p++) seen.add(LISTS[id].words[p].toLowerCase());
    seen.add(LISTS[id].lure.toLowerCase());
  }

  // Baseline lists: an unstudied list is only usable if its critical word never appeared in a
  // studied list, and it must have at least one member word that did not either.
  const unstudied: number[] = [];
  const newWords: Record<number, string> = {};
  for (const id of rest) {
    if (seen.has(LISTS[id].lure.toLowerCase())) continue;
    const spare = LISTS[id].words.filter((w) => !seen.has(w.toLowerCase()));
    if (!spare.length) continue;
    unstudied.push(id);
    newWords[id] = spare[Math.floor(rnd() * spare.length)];
    if (unstudied.length >= N_UNSTUDIED) break;
  }

  const study: StudyStep[] = [];
  const catchAt = new Set(shuffled(studied.map((_, i) => i), rnd).slice(0, N_CATCH));
  const catchWords = shuffled(CATCH_WORDS, rnd);
  let catches = 0;
  studied.forEach((id, i) => {
    study.push({ kind: 'rest', label: `list ${i + 1} of ${studied.length}` });
    if (catchAt.has(i)) {
      study.push({ kind: 'catch', word: catchWords[catches % catchWords.length] });
      catches++;
    }
    for (let p = 0; p < SHOWN_LEN; p++) {
      study.push({ kind: 'word', listId: id, pos: p, word: LISTS[id].words[p] });
    }
  });

  const test: TestItem[] = [];
  for (const id of studied) {
    const L = LISTS[id];
    test.push({ word: L.words[EARLY[Math.floor(rnd() * EARLY.length)]], cls: 'studiedEarly', listId: id });
    test.push({ word: L.words[LATE[Math.floor(rnd() * LATE.length)]], cls: 'studiedLate', listId: id });
    test.push({ word: L.lure, cls: 'lure', listId: id });
    const weak = WEAK.map((p) => L.words[p]).filter((w) => !seen.has(w.toLowerCase()));
    if (weak.length) test.push({ word: weak[Math.floor(rnd() * weak.length)], cls: 'weak', listId: id });
  }
  for (const id of unstudied) {
    test.push({ word: LISTS[id].lure, cls: 'lureNew', listId: id });
    test.push({ word: newWords[id], cls: 'wordNew', listId: id });
  }

  return { studied, unstudied, study, test: spreadOut(test, rnd), catches };
}

// Random order, with no more than three items of the same class in a row, so a run of new words
// cannot teach a drifting criterion where the next one is.
function spreadOut(items: TestItem[], rnd: () => number): TestItem[] {
  for (let attempt = 0; attempt < 60; attempt++) {
    const cand = shuffled(items, rnd);
    let run = 1;
    let ok = true;
    for (let i = 1; i < cand.length; i++) {
      const a = cand[i].cls === 'studiedEarly' || cand[i].cls === 'studiedLate' ? 'old' : cand[i].cls;
      const b = cand[i - 1].cls === 'studiedEarly' || cand[i - 1].cls === 'studiedLate' ? 'old' : cand[i - 1].cls;
      run = a === b ? run + 1 : 1;
      if (run > 3) { ok = false; break; }
    }
    if (ok) return cand;
  }
  return shuffled(items, rnd);
}

// ============================ what a session records ============================

export type Resp = 0 | 1 | 2 | 3 | 4;    // 0 none, 1 sure new, 2 maybe new, 3 maybe old, 4 sure old

export type TestTrial = TestItem & { resp: Resp; rt: number; hidden: boolean };

export type Session = {
  trials: TestTrial[];
  studiedIds: number[];
  unstudiedIds: number[];
  hiddenWords: number;      // study words that ran while the tab was away
  totalWords: number;
  catchShown: number;
  catchHit: number;
  falsePresses: number;
  fillerRight: number;
  fillerTotal: number;
};

export function isOld(r: Resp) { return r >= 3; }
export function isSure(r: Resp) { return r === 4; }
export function usable(t: TestTrial): boolean {
  return t.resp !== 0 && !t.hidden && t.rt >= RT_FAST && t.rt <= RT_SLOW;
}

// ============================ the rates ============================

export type Rates = Record<ItemClass, number>;

function rateOf(ts: TestTrial[], cls: ItemClass, sure: boolean): number {
  const c = ts.filter((t) => t.cls === cls);
  if (!c.length) return NaN;
  return c.filter((t) => (sure ? isSure(t.resp) : isOld(t.resp))).length / c.length;
}

export function ratesOf(ts: TestTrial[], sure = false): Rates {
  const out = {} as Rates;
  for (const c of CLASSES) out[c] = rateOf(ts, c, sure);
  return out;
}

export type Headline = {
  studied: number;
  lure: number;
  weak: number;
  newBase: number;      // critical words of lists you did not study, the matched baseline
  newWord: number;      // ordinary members of lists you did not study
  disc: number;         // studied minus baseline: the denominator, and the memory check
  pull: number;
  spread: number;
  pullSure: number;
  discSure: number;
};

function headlineFrom(ts: TestTrial[]): Headline {
  const r = ratesOf(ts, false);
  const s = ratesOf(ts, true);
  const studiedOf = (x: Rates) => {
    const e = ts.filter((t) => t.cls === 'studiedEarly').length;
    const l = ts.filter((t) => t.cls === 'studiedLate').length;
    if (!e && !l) return NaN;
    return ((Number.isFinite(x.studiedEarly) ? x.studiedEarly * e : 0) + (Number.isFinite(x.studiedLate) ? x.studiedLate * l : 0)) / (e + l);
  };
  const studied = studiedOf(r);
  const disc = studied - r.lureNew;
  const studiedS = studiedOf(s);
  const discSure = studiedS - s.lureNew;
  return {
    studied,
    lure: r.lure,
    weak: r.weak,
    newBase: r.lureNew,
    newWord: r.wordNew,
    disc,
    pull: (r.lure - r.lureNew) / disc,
    spread: (r.weak - r.lureNew) / (r.lure - r.lureNew),
    pullSure: (s.lure - s.lureNew) / discSure,
    discSure,
  };
}

export function headlineOf(ts: TestTrial[]): Headline {
  return headlineFrom(ts.filter(usable));
}

// ============================ intervals, by list rather than by item ============================
//
// The unit that repeats here is a LIST, not a word: one list contributes one lure, one held back
// weak associate and two studied words, and those four responses are not independent of each
// other. So the resampling draws lists.

export type Boot = {
  pull: [number, number];
  spread: [number, number];
  pullSure: [number, number];
  disc: [number, number];
  lureMinusNew: [number, number];
  dropped: number;
};

function byList(ts: TestTrial[], ids: number[]): TestTrial[][] {
  return ids.map((id) => ts.filter((t) => t.listId === id));
}

export function bootstrapOf(s: Session, rnd: () => number, boots = BOOTS): Boot {
  const ts = s.trials.filter(usable);
  const A = byList(ts, s.studiedIds).filter((g) => g.length);
  const B = byList(ts, s.unstudiedIds).filter((g) => g.length);
  const pull: number[] = [];
  const spread: number[] = [];
  const pullSure: number[] = [];
  const disc: number[] = [];
  const lmn: number[] = [];
  let dropped = 0;
  for (let b = 0; b < boots; b++) {
    const draw = resample(A, rnd).concat(resample(B, rnd)).flat();
    const h = headlineFrom(draw);
    disc.push(h.disc);
    lmn.push(h.lure - h.newBase);
    // A draw whose denominator has collapsed carries no ratio. It is dropped and counted, and if
    // too many are dropped the ratio is refused outright rather than printed wide.
    if (!(h.disc > MIN_DISC)) { dropped++; continue; }
    if (Number.isFinite(h.pull)) pull.push(h.pull);
    if (Number.isFinite(h.spread) && Math.abs(h.lure - h.newBase) > 0.05) spread.push(h.spread);
    if (Number.isFinite(h.pullSure) && h.discSure > 0.05) pullSure.push(h.pullSure);
  }
  return {
    pull: ciOf(pull),
    spread: ciOf(spread),
    pullSure: ciOf(pullSure),
    disc: ciOf(disc),
    lureMinusNew: ciOf(lmn),
    dropped: dropped / Math.max(1, boots),
  };
}

// Exact in shape: under the recording account, whether a list was studied cannot change how its
// critical word is answered, so the twenty four critical words are exchangeable across that
// label and the labels themselves are what gets shuffled.
export function permuteOf(s: Session, rnd: () => number, perms = PERMS): { p: number; obs: number } {
  const crit = s.trials.filter((t) => usable(t) && (t.cls === 'lure' || t.cls === 'lureNew'));
  const nL = crit.filter((t) => t.cls === 'lure').length;
  const flags = crit.map((t) => (isOld(t.resp) ? 1 : 0));
  if (nL < 4 || crit.length - nL < 4) return { p: NaN, obs: NaN };
  const rate = (arr: number[], from: number, to: number) => {
    let sum = 0;
    for (let i = from; i < to; i++) sum += arr[i];
    return sum / (to - from);
  };
  const obsDiff =
    crit.filter((t) => t.cls === 'lure' && isOld(t.resp)).length / nL -
    crit.filter((t) => t.cls === 'lureNew' && isOld(t.resp)).length / (crit.length - nL);
  let hits = 0;
  for (let i = 0; i < perms; i++) {
    const sh = shuffled(flags, rnd);
    const d = rate(sh, 0, nL) - rate(sh, nL, sh.length);
    if (Math.abs(d) >= Math.abs(obsDiff) - 1e-12) hits++;
  }
  return { p: (hits + 1) / (perms + 1), obs: obsDiff };
}

// ============================ what the session had to pass ============================

export type Quality = { ok: boolean; reason: string; detail: string };

export type Checks = {
  nUsable: number;
  nTest: number;
  fastShare: number;
  hiddenShare: number;
  hiddenStudy: number;
  oneKey: number;
  oldRate: number;
  rtMedian: number;
  rtSd: number;
  catchShown: number;
  catchHit: number;
  falsePresses: number;
  fillerAcc: number;
  listsScored: number;
};

export function checksOf(s: Session): Checks {
  const all = s.trials;
  const ok = all.filter(usable);
  const answered = all.filter((t) => t.resp !== 0);
  const counts = [1, 2, 3, 4].map((k) => answered.filter((t) => t.resp === k).length);
  const rts = ok.map((t) => t.rt);
  const scoredLists = new Set(ok.filter((t) => t.cls === 'lure').map((t) => t.listId));
  return {
    nUsable: ok.length,
    nTest: all.length,
    fastShare: answered.length ? answered.filter((t) => t.rt < RT_FAST).length / answered.length : 0,
    hiddenShare: all.length ? all.filter((t) => t.hidden).length / all.length : 0,
    hiddenStudy: s.totalWords ? s.hiddenWords / s.totalWords : 0,
    oneKey: answered.length ? Math.max(...counts) / answered.length : 1,
    oldRate: ok.length ? ok.filter((t) => isOld(t.resp)).length / ok.length : 0,
    rtMedian: median(rts),
    rtSd: sd(rts),
    catchShown: s.catchShown,
    catchHit: s.catchHit,
    falsePresses: s.falsePresses,
    fillerAcc: s.fillerTotal ? s.fillerRight / s.fillerTotal : NaN,
    listsScored: scoredLists.size,
  };
}

export function qualityOf(s: Session, h: Headline, boot: Boot): Quality {
  const c = checksOf(s);
  if (c.hiddenStudy > MAX_HIDDEN_STUDY) {
    return { ok: false, reason: 'the study phase happened somewhere else', detail: `${(c.hiddenStudy * 100).toFixed(0)} percent of the words ran while this tab was in the background, and the floor is ${MAX_HIDDEN_STUDY * 100} percent. A word that was never in front of you is not a studied word, and the whole page is built on the difference between those two things.` };
  }
  if (c.catchShown - c.catchHit > MAX_CATCH_MISS) {
    return { ok: false, reason: 'nobody was watching the lists', detail: `${c.catchShown - c.catchHit} of the ${c.catchShown} amber words went by without a keypress. One miss is a lapse, more than one is a study phase that did not happen.` };
  }
  if (c.fastShare > MAX_FAST) {
    return { ok: false, reason: 'clicking through', detail: `${(c.fastShare * 100).toFixed(0)} percent of your answers came in under ${RT_FAST} ms, which is not long enough to read the word they were about.` };
  }
  if (c.listsScored < MIN_LISTS) {
    return { ok: false, reason: 'too few lists survived', detail: `${c.listsScored} lists came through with a usable answer to their critical word, and ${MIN_LISTS} is the floor. Each list is one observation for the numerator, which is why this floor is high relative to the number of clicks you made.` };
  }
  if (c.oneKey > MAX_ONE_KEY) {
    return { ok: false, reason: 'one button', detail: `${(c.oneKey * 100).toFixed(0)} percent of your answers were the same key. A rate that is the same everywhere cannot show a difference between anywhere.` };
  }
  if (c.oldRate > MAX_OLD || c.oldRate < MIN_OLD) {
    return { ok: false, reason: 'the same answer to everything', detail: `You called ${(c.oldRate * 100).toFixed(0)} percent of the words old. Outside ${MIN_OLD * 100} to ${MAX_OLD * 100} percent there is no room left for a difference between the kinds of word to live in.` };
  }
  if (c.rtSd < MIN_RT_SD && c.nUsable > 20) {
    return { ok: false, reason: 'machine cadence', detail: `Your answers were spaced with a spread of ${c.rtSd.toFixed(0)} ms. A person deciding about words they may or may not have read is not that regular, and a script is.` };
  }
  if (!(h.disc > MIN_DISC) || !(boot.disc[0] > 0)) {
    return { ok: false, reason: 'no memory here to be false about', detail: `You called studied words old ${(h.studied * 100).toFixed(0)} percent of the time and new words old ${(h.newBase * 100).toFixed(0)} percent of the time, a gap of ${(h.disc * 100).toFixed(0)} points against a floor of ${MIN_DISC * 100}. The headline divides by that gap, and a ratio with a denominator near zero is not an imprecise answer, it is a different question. The lure rate on its own is still yours and is printed below, but it cannot be read as a false memory when there is no true one to compare it against.` };
  }
  if (boot.dropped > 0.2) {
    return { ok: false, reason: 'the denominator would not hold still', detail: `${(boot.dropped * 100).toFixed(0)} percent of the resampled sessions came back with no usable gap between studied and new words, so the interval on the ratio would be a fiction.` };
  }
  return { ok: true, reason: '', detail: '' };
}

// ============================ the verdict ============================

export type Verdict = 'gist' | 'partial' | 'recording' | 'above' | 'neither';

export function verdictOf(h: Headline, boot: Boot): Verdict {
  const [lo, hi] = boot.pull;
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return 'neither';
  const excl0 = lo > 0;
  const excl1 = hi < 1 || lo > 1;
  if (lo > 1) return 'above';
  if (excl0 && excl1) return 'partial';
  if (!excl0 && hi < 1) return 'recording';
  if (excl0 && !(hi < 1)) return 'gist';
  return 'neither';
}

export type Result = {
  h: Headline;
  boot: Boot;
  perm: { p: number; obs: number };
  checks: Checks;
  quality: Quality;
  verdict: Verdict;
  rates: Rates;
  sureRates: Rates;
  caught: Array<{ word: string; sure: boolean }>;
  missed: Array<{ word: string }>;
};

export function analyse(s: Session, rnd: () => number, boots = BOOTS, perms = PERMS): Result {
  const ts = s.trials.filter(usable);
  const h = headlineOf(s.trials);
  const boot = bootstrapOf(s, rnd, boots);
  const perm = permuteOf(s, rnd, perms);
  const quality = qualityOf(s, h, boot);
  return {
    h,
    boot,
    perm,
    checks: checksOf(s),
    quality,
    verdict: verdictOf(h, boot),
    rates: ratesOf(ts),
    sureRates: ratesOf(ts, true),
    caught: ts.filter((t) => t.cls === 'lure' && isOld(t.resp)).map((t) => ({ word: t.word, sure: isSure(t.resp) })),
    missed: ts.filter((t) => (t.cls === 'studiedEarly' || t.cls === 'studiedLate') && !isOld(t.resp)).map((t) => ({ word: t.word })),
  };
}

// ============================ the session itself ============================

type Screen = 'intro' | 'commit' | 'study' | 'filler' | 'testcard' | 'test' | 'crunch' | 'result';

type Sum = { a: number; b: number; shown: number };

function sumsFor(rnd: () => number): Sum[] {
  const out: Sum[] = [];
  for (let i = 0; i < 120; i++) {
    const a = 3 + Math.floor(rnd() * 40);
    const b = 3 + Math.floor(rnd() * 40);
    const wrong = rnd() < 0.5;
    const off = (rnd() < 0.5 ? -1 : 1) * (1 + Math.floor(rnd() * 3));
    out.push({ a, b, shown: a + b + (wrong ? off : 0) });
  }
  return out;
}

export default function Client() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [blank, setBlank] = useState(false);
  const [caught, setCaught] = useState(false);
  const [testIdx, setTestIdx] = useState(0);
  const [sums, setSums] = useState<Sum[]>([]);
  const [sumIdx, setSumIdx] = useState(0);
  const [fillerLeft, setFillerLeft] = useState(Math.round(FILLER_MS / 1000));
  const [res, setRes] = useState<Result | null>(null);

  const trials = useRef<TestTrial[]>([]);
  const shownAt = useRef(0);
  const answered = useRef(false);
  const hiddenNow = useRef(false);
  const hiddenWords = useRef(0);
  const totalWords = useRef(0);
  const catchShown = useRef(0);
  const catchHit = useRef(0);
  const falsePresses = useRef(0);
  const fillerRight = useRef(0);
  const fillerTotal = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, Math.max(0, ms)));
  }, []);

  useEffect(() => {
    const onHide = () => { hiddenNow.current = document.hidden; };
    const onBlur = () => { hiddenNow.current = true; };
    const onFocus = () => { hiddenNow.current = document.hidden; };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Seeded here rather than in a state initialiser: this page is a static export, so anything
  // random that reaches the first render is a hydration failure on every visit.
  const begin = useCallback(() => {
    const rnd = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    const p = buildPlan(rnd);
    setPlan(p);
    setSums(sumsFor(rnd));
    trials.current = [];
    hiddenWords.current = 0;
    totalWords.current = 0;
    catchShown.current = 0;
    catchHit.current = 0;
    falsePresses.current = 0;
    fillerRight.current = 0;
    fillerTotal.current = 0;
    setStepIdx(0);
    setTestIdx(0);
    setSumIdx(0);
    setFillerLeft(Math.round(FILLER_MS / 1000));
    setRes(null);
    setScreen('commit');
  }, []);

  // ---- the study phase ----

  const runStep = useCallback((i: number) => {
    if (!plan) return;
    const step = plan.study[i];
    if (!step) { setScreen('filler'); return; }
    setStepIdx(i);
    setBlank(false);
    setCaught(false);
    if (step.kind === 'word') {
      totalWords.current += 1;
      if (hiddenNow.current || document.hidden) hiddenWords.current += 1;
      later(() => setBlank(true), WORD_MS);
      later(() => runStep(i + 1), WORD_MS + GAP_MS);
    } else if (step.kind === 'catch') {
      catchShown.current += 1;
      later(() => runStep(i + 1), CATCH_MS);
    } else {
      later(() => runStep(i + 1), REST_MS);
    }
  }, [plan, later]);

  useEffect(() => {
    if (screen !== 'study' || !plan) return;
    runStep(0);
    return clearTimers;
    // runStep is stable for a given plan and re-running it would restart the lists
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, plan]);

  useEffect(() => {
    if (screen !== 'study' || !plan) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      e.preventDefault();
      const step = plan.study[stepIdx];
      if (step && step.kind === 'catch' && !caught) {
        setCaught(true);
        catchHit.current += 1;
      } else {
        falsePresses.current += 1;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, plan, stepIdx, caught]);

  // ---- the filler ----

  useEffect(() => {
    if (screen !== 'filler') return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = Math.round((FILLER_MS - (Date.now() - started)) / 1000);
      setFillerLeft(Math.max(0, left));
      if (left <= 0) {
        window.clearInterval(id);
        setScreen('testcard');
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [screen]);

  const answerSum = useCallback((yes: boolean) => {
    const s = sums[sumIdx];
    if (!s) return;
    fillerTotal.current += 1;
    if (yes === (s.a + s.b === s.shown)) fillerRight.current += 1;
    setSumIdx((i) => i + 1);
  }, [sums, sumIdx]);

  // ---- the test ----

  const showTest = useCallback((i: number) => {
    if (!plan) return;
    if (i >= plan.test.length) {
      setScreen('crunch');
      const s: Session = {
        trials: trials.current,
        studiedIds: plan.studied,
        unstudiedIds: plan.unstudied,
        hiddenWords: hiddenWords.current,
        totalWords: totalWords.current,
        catchShown: catchShown.current,
        catchHit: catchHit.current,
        falsePresses: falsePresses.current,
        fillerRight: fillerRight.current,
        fillerTotal: fillerTotal.current,
      };
      window.setTimeout(() => {
        setRes(analyse(s, mulberry32(20260910)));
        setScreen('result');
      }, 60);
      return;
    }
    setTestIdx(i);
    answered.current = false;
    hiddenNow.current = document.hidden;
    requestAnimationFrame(() => { shownAt.current = performance.now(); });
  }, [plan]);

  const answerTest = useCallback((r: Resp) => {
    if (!plan || answered.current) return;
    const item = plan.test[testIdx];
    if (!item) return;
    answered.current = true;
    trials.current.push({
      ...item,
      resp: r,
      rt: performance.now() - shownAt.current,
      hidden: hiddenNow.current || document.hidden,
    });
    showTest(testIdx + 1);
  }, [plan, testIdx, showTest]);

  useEffect(() => {
    if (screen !== 'test') return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k >= '1' && k <= '4') { e.preventDefault(); answerTest(Number(k) as Resp); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, answerTest]);

  useEffect(() => {
    if (screen === 'test') showTest(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const step = plan && screen === 'study' ? plan.study[stepIdx] : null;
  const listsDone = useMemo(() => {
    if (!plan) return 0;
    return plan.study.slice(0, stepIdx + 1).filter((s) => s.kind === 'rest').length;
  }, [plan, stepIdx]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            &larr; all experiments
          </a>
          <div className="mb-3 text-5xl">&#128173;</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Sure As The Rest</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Twelve lists of words, and one word missing from each of them: the word every item on
            the list points at. Later you will be asked whether you saw it. Most people say yes, and
            say it with the same confidence they bring to the words that were actually there.
          </p>
        </div>

        {screen === 'intro' && <Intro onStart={begin} />}
        {screen === 'commit' && <CommitCard onGo={() => setScreen('study')} />}
        {screen === 'study' && step && (
          <StudyStage step={step} blank={blank} caught={caught} lists={listsDone} total={plan ? plan.studied.length : 0} />
        )}
        {screen === 'filler' && (
          <Filler sum={sums[sumIdx]} left={fillerLeft} onAnswer={answerSum} done={fillerTotal.current} />
        )}
        {screen === 'testcard' && <TestCard onGo={() => setScreen('test')} n={plan ? plan.test.length : 0} />}
        {screen === 'test' && plan && (
          <TestStage word={plan.test[testIdx] ? plan.test[testIdx].word : ''} idx={testIdx} total={plan.test.length} onAnswer={answerTest} />
        )}
        {screen === 'crunch' && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
            <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">pricing a word you never saw against one you did</div>
            <div className="mx-auto h-2 w-64 overflow-hidden rounded bg-slate-950">
              <div className="h-full w-2/3 animate-pulse bg-cyan-400/60" />
            </div>
          </div>
        )}
        {screen === 'result' && res && <Results res={res} onAgain={begin} />}
      </div>
    </main>
  );
}

// ============================ furniture ============================

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">{children}</div>;
}

function GoButton({ onGo, label }: { onGo: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onGo}
      className="w-full rounded-lg bg-cyan-500/90 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-slate-950 transition hover:bg-cyan-400"
    >
      {label}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
      <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-b border-slate-800/60 py-3 last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-sm leading-snug text-slate-400">{label}</div>
        <div className="shrink-0 font-mono text-sm text-slate-100">{value}</div>
      </div>
      {note && <div className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">{note}</div>}
    </div>
  );
}

function num(x: number, d = 2) {
  return Number.isFinite(x) ? x.toFixed(d) : 'not formed';
}

function pctOf(x: number, d = 0) {
  return Number.isFinite(x) ? `${(x * 100).toFixed(d)}%` : 'n/a';
}

function rangeOf(lo: number, hi: number, kind: 'raw' | 'pct' = 'raw', d = 2) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return 'interval not formed';
  const f = (v: number) => (kind === 'pct' ? `${(v * 100).toFixed(0)}%` : v.toFixed(d));
  return `95% interval ${f(lo)} to ${f(hi)}`;
}

function Meter({ label, value, tone }: { label: string; value: number; tone: string }) {
  const w = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <div className="text-sm text-slate-400">{label}</div>
        <div className="font-mono text-sm text-slate-100">{pctOf(value)}</div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-slate-950">
        <div className={`h-full ${tone}`} style={{ width: `${w * 100}%` }} />
      </div>
    </div>
  );
}

// ============================ the screens before the words ============================

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">what you will do</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Twelve lists of twelve words go past, one word at a time, for a second each. You do not
          have to do anything with them except read them. Then a short arithmetic break, then
          {' '}{N_STUDIED * 4 + N_UNSTUDIED * 2} words one at a time, and for each one you say whether
          it was on a list, and how sure you are.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          Four times during the lists a word will flash in <span className="text-amber-300">amber</span>.
          Press the spacebar when it does. That is the only key you need until the test.
        </p>
      </Card>

      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">the claim being tested</div>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          Everybody agrees memory is imperfect, and almost everybody pictures the imperfection the
          same way: a recording with gaps. Some of it was kept, some was lost, and the part you can
          still see clearly is the part that happened. That picture is not vague. It commits to
          something exact, which is that a word you never met is a new word, like any other new
          word, no matter what else was on the list.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          Every list here is built out of the associates of one word, and that one word is left
          out. This page is going to ask you about it as though it had been there, and put a number
          on what you say.
        </p>
      </Card>

      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">the deal</div>
        <ul className="mb-4 space-y-2 text-sm leading-relaxed text-slate-300">
          <li>About eleven minutes: four of reading, one of arithmetic, four of deciding.</li>
          <li>Read every word. Do not write anything down, and do not rehearse a list once it ends.</li>
          <li>Stay on the tab. Words that run while it is in the background are counted and can void the session.</li>
          <li>There is no way to score well here. There is only a way to answer honestly.</li>
          <li>Everything is computed in your browser. Nothing is recorded, nothing is sent anywhere.</li>
        </ul>
        <GoButton onGo={onStart} label="start" />
      </Card>
    </div>
  );
}

function CommitCard({ onGo }: { onGo: () => void }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-cyan-400">the accounts commit, before you read a word</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Three rates come out of the test at the end, all of them proportions of your own answers.
          How often you call a word you really saw old. How often you call the missing word of a
          list you studied old. And how often you call the missing word of a list you did NOT study
          old, which is your baseline: the same kind of word, doing the same job, kept out of your
          study phase by a shuffle before you started.
        </p>
        <div className="mb-4 rounded border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="font-mono text-sm text-cyan-200">pull = (lure - new) / (studied - new)</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-500">how far the word that was never there travelled toward the words that were</div>
        </div>
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">a recording with gaps</div>
          <p className="text-sm leading-relaxed text-slate-400">
            What you stored is some of what happened. A word that was never presented is new, and
            one new word is like another, whatever the rest of the list was about.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your pull = 0</div>
        </div>
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">the gist is the memory</div>
          <p className="text-sm leading-relaxed text-slate-400">
            What survives a list is what it was about, and the missing word IS what it was about,
            more central to it than any single word that was actually shown.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your pull = 1</div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-300">above one is available</div>
          <p className="text-sm leading-relaxed text-slate-400">
            The theme can be remembered better than the words that carried it. Roediger and
            McDermott got exactly that in 1995, which is why this number is not capped at one.
          </p>
          <div className="mt-2 font-mono text-sm text-cyan-300">your pull lands above 1</div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          None of those numbers was estimated from anything you do. Each is a consequence of what
          its account claims. A visitor who simply says old a lot lifts the top and the bottom of
          that fraction together, so it barely moves, and the whole thing is computed a second time
          using only the answers where you said you were SURE, which is where a loose finger has
          nowhere to hide.
        </p>
      </Card>
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-cyan-400">and a second number, for a third account</div>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          You might be reconstructing at the test rather than remembering: shown a word, you ask
          whether it fits anything you saw, and say old when it does. Each list here is fifteen
          words long and only twelve are shown, so the three weakest associates are available as
          words that fit a list you studied and were never presented either.
        </p>
        <div className="mb-3 rounded border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="font-mono text-sm text-cyan-200">spread = (weak related - new) / (lure - new)</div>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          Reconstructing at the test says anything plausible gets endorsed, so spread lands near 1.
          If the effect belongs to the missing word specifically, it falls off hard and spread lands
          well below 1. Same session, no extra trials, and the two numbers can disagree.
        </p>
      </Card>
      <GoButton onGo={onGo} label="show me the first list" />
    </div>
  );
}

// ============================ the screens with the words ============================

function StudyStage({ step, blank, caught, lists, total }: { step: StudyStep; blank: boolean; caught: boolean; lists: number; total: number }) {
  return (
    <div className="space-y-5">
      <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-slate-800 bg-slate-950 p-8">
        {step.kind === 'rest' && (
          <div className="text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-600">{step.label}</div>
            <div className="mt-2 text-sm text-slate-500">read the words, that is all</div>
          </div>
        )}
        {step.kind === 'catch' && (
          <div className="text-center">
            <div className={`text-4xl font-bold tracking-wide ${caught ? 'text-emerald-400' : 'text-amber-400'}`}>{step.word}</div>
            <div className="mt-3 font-mono text-xs uppercase tracking-widest text-slate-500">
              {caught ? 'caught' : 'press space'}
            </div>
          </div>
        )}
        {step.kind === 'word' && (
          <div className="text-4xl font-bold tracking-wide text-slate-100">{blank ? '' : step.word}</div>
        )}
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center font-mono text-xs text-slate-500">
        list {Math.max(1, Math.min(lists, total))} of {total}
      </div>
    </div>
  );
}

function Filler({ sum, left, onAnswer, done }: { sum: Sum | undefined; left: number; onAnswer: (yes: boolean) => void; done: number }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">a break, on purpose</div>
        <p className="text-sm leading-relaxed text-slate-300">
          The last list is still ringing. Without this the final list would be tested from a
          different kind of memory than the first eleven, so here is forty five seconds of
          arithmetic to clear it. Is the sum right?
        </p>
      </Card>
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-950 p-8">
        {sum && (
          <div className="mb-6 font-mono text-4xl font-bold text-slate-100">
            {sum.a} + {sum.b} = {sum.shown}
          </div>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={() => onAnswer(false)} className="rounded border border-slate-700 px-6 py-3 font-mono text-sm uppercase tracking-wider text-slate-300 transition hover:bg-slate-800">no</button>
          <button type="button" onClick={() => onAnswer(true)} className="rounded border border-slate-700 px-6 py-3 font-mono text-sm uppercase tracking-wider text-slate-300 transition hover:bg-slate-800">yes</button>
        </div>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center font-mono text-xs text-slate-500">
        {left} seconds left, {done} answered
      </div>
    </div>
  );
}

function TestCard({ onGo, n }: { onGo: () => void; n: number }) {
  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">now the part that counts</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          {n} words, one at a time. For each one: was it on any of the lists you just read? Four
          answers, and the confidence half is not decoration. It is the second headline. Keys 1 to
          4, or the buttons.
        </p>
        <ul className="mb-4 space-y-2 font-mono text-xs text-slate-400">
          <li><span className="text-slate-200">1</span>  new, and I am sure</li>
          <li><span className="text-slate-200">2</span>  new, I think</li>
          <li><span className="text-slate-200">3</span>  old, I think</li>
          <li><span className="text-slate-200">4</span>  old, and I am sure</li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-400">
          Answer as you find it. Do not try to be careful in a way you would not normally be, and do
          not try to catch the page out: a session spent hunting for the trick measures the hunt.
        </p>
      </Card>
      <GoButton onGo={onGo} label="begin the test" />
    </div>
  );
}

const KEYS: Array<{ r: Resp; label: string; sub: string; tone: string }> = [
  { r: 1, label: 'new', sub: 'sure', tone: 'border-slate-700 hover:bg-slate-800' },
  { r: 2, label: 'new', sub: 'maybe', tone: 'border-slate-800 hover:bg-slate-800' },
  { r: 3, label: 'old', sub: 'maybe', tone: 'border-slate-800 hover:bg-slate-800' },
  { r: 4, label: 'old', sub: 'sure', tone: 'border-slate-700 hover:bg-slate-800' },
];

function TestStage({ word, idx, total, onAnswer }: { word: string; idx: number; total: number; onAnswer: (r: Resp) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-slate-800 bg-slate-950 p-8">
        <div className="text-4xl font-bold tracking-wide text-slate-100">{word}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((k) => (
          <button
            key={k.r}
            type="button"
            onClick={() => onAnswer(k.r)}
            className={`rounded border ${k.tone} px-2 py-3 text-center transition`}
          >
            <div className="font-mono text-sm uppercase tracking-wider text-slate-200">{k.label}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{k.sub}</div>
            <div className="mt-1 font-mono text-[10px] text-slate-600">{k.r}</div>
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center font-mono text-xs text-slate-500">
        word {Math.min(idx + 1, total)} of {total}
      </div>
    </div>
  );
}

// ============================ the results ============================

const VERDICT_COPY: Record<Verdict, { head: string; tone: string; body: string }> = {
  gist: {
    head: 'The word that was never there behaved like a word that was.',
    tone: 'text-amber-300',
    body:
      'Your interval on the pull sits above zero and covers one. The recording account is excluded: the missing word was not treated as a new word, and it was not close. What you kept from those lists included something that never went past your eyes, and it arrived with the same claim on you as the rest. This is the ordinary outcome, which is the part worth sitting with.',
  },
  above: {
    head: 'You remembered the theme better than the words that carried it.',
    tone: 'text-rose-300',
    body:
      'Your pull came in above one with the interval clear of it, so the word that was never presented was endorsed more often than the words that were. Roediger and McDermott reported this in their second experiment and it is the sharpest form the result takes. A recording cannot do this in any version of the story where the recording is of what happened.',
  },
  partial: {
    head: 'It moved, and it did not go all the way.',
    tone: 'text-cyan-300',
    body:
      'Both committed numbers are outside your interval. The missing word was clearly more than a new word to you, which the recording account cannot produce, and clearly less than a word you actually read, which the pure gist account does not predict. That is the middle ground where most careful accounts of memory now live: a real trace and a real theme, both consulted, neither one winning.',
  },
  recording: {
    head: 'Not this time. The missing word stayed new.',
    tone: 'text-emerald-300',
    body:
      'Your interval on the pull covers zero and sits below one, so nothing here shows the missing word doing anything a new word would not. That is the minority outcome for these lists, and there are two honest readings: you may have been monitoring the source of every familiar feeling rather than the feeling itself, which is what people who resist this effect appear to do, or twelve lists in one sitting may simply not have caught you. Both are below, undramatically.',
  },
  neither: {
    head: 'Your interval covers both committed numbers.',
    tone: 'text-slate-300',
    body:
      'The missing word did something, and this session cannot say whether it did all of what the gist account claims or none of what the recording account allows. That is a statement about twelve lists, not about memory. One person contributes one answer per list, so this outcome is common and it is the honest cost of the design rather than a failure of yours.',
  },
};

const SIM_ROWS: Array<[string, string, string]> = [
  ['world where the missing word really is just new, truth pull 0', 'called it 96%', 'and it never once called that world the gist. Interval coverage 95%, permutation false positive 1%'],
  ['world where the theme is the memory, truth pull 1', 'called it 85%', '6% landed above one, 1% called it a recording, 5% could not separate them'],
  ['world halfway up, truth pull 0.70', 'gist 58%, cannot separate 20%, recording 15%', 'the honest cost of twelve lists in one sitting, printed rather than hidden'],
  ['visitor who calls 44% of NEW words old, truth pull 0', 'mean pull -0.03, called a recording 89%', 'this is the bias check and it is measured, not argued: a loose criterion lifts both halves of the fraction and cancels'],
  ['visitor 30% noisier at everything', 'pull 0.92 against a truth of 0.90', 'a ratio of differences cannot see an overall level'],
  ['reconstructing at test against the lure specifically', 'spread 1.07 against 0.11', 'and the PULL is 0.94 in both worlds, so the second number is doing work the first one cannot'],
  ['world with no memory at all, studied equal to new', 'refused 97%', 'the denominator is the attention check, and it fires before any headline is printed'],
  ['refusal ladder', '6 strategies, 359 of 360 refused', 'one button, guessing, clicking through, machine cadence, a hidden tab, and ignoring the amber words. Of 1000 honest visitors, 2% were refused, always for producing no gap between studied and new'],
  ['interval coverage overall', '95% at a true pull of 0, 88 to 92% higher up', 'a ratio runs slightly high when its numerator approaches its denominator, so the intervals up there are a little narrow and this row says so instead of rounding it away'],
];

function Results({ res, onAgain }: { res: Result; onAgain: () => void }) {
  const { h, boot, checks: c, quality, verdict } = res;
  const copy = VERDICT_COPY[verdict];
  const sureCaught = res.caught.filter((w) => w.sure).length;
  const line = `I was sure I had read ${sureCaught} words that were never shown to me. My pull was ${num(h.pull)}: 0 means memory is a recording, 1 means the theme is the memory. sure-as-the-rest, wiz.jock.pl`;

  if (!quality.ok) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-6">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-rose-300">refused: {quality.reason}</div>
          <p className="text-sm leading-relaxed text-slate-300">{quality.detail}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            No headline is shown, because a number produced by a session that failed its own checks
            is worse than no number. Nothing was recorded either way.
          </p>
        </div>
        <Panel title="what your answers did anyway">
          <Row label="words you really read, called old" value={pctOf(h.studied)} />
          <Row label="missing words of lists you read, called old" value={pctOf(h.lure)} />
          <Row label="missing words of lists you did not read, called old" value={pctOf(h.newBase)} note="the baseline the headline would have used" />
        </Panel>
        <GoButton onGo={onAgain} label="run it properly" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">the verdict</div>
        <div className={`mb-3 text-xl font-bold leading-snug ${copy.tone}`}>{copy.head}</div>
        <p className="text-sm leading-relaxed text-slate-300">{copy.body}</p>
      </div>

      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-6 text-center">
        <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-cyan-300">your pull</div>
        <div className="font-mono text-4xl font-bold text-slate-50">{num(h.pull)}</div>
        <div className="mt-2 font-mono text-xs text-slate-400">{rangeOf(boot.pull[0], boot.pull[1])}</div>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          How far the word that was never there travelled toward the words that were. Zero is a
          recording with gaps. One is a memory made of what the list was about. It is a difference
          over a difference, so a finger that says old too easily lifts both and cancels.
        </p>
      </div>

      {res.caught.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-amber-300">words you remember reading, which were never shown</div>
          <div className="mb-3 flex flex-wrap gap-2">
            {res.caught.map((w) => (
              <span key={w.word} className={`rounded border px-3 py-1 font-mono text-sm ${w.sure ? 'border-amber-400/60 bg-amber-500/10 text-amber-200' : 'border-slate-700 text-slate-300'}`}>
                {w.word.toLowerCase()}{w.sure ? ' (sure)' : ''}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            {res.caught.length} of your {N_STUDIED} lists produced one, and {sureCaught} came with
            the top confidence, the same button you used for words that were actually in front of
            you. None of these words existed in your session before this screen.
            {res.missed.length > 0 && ` For scale, you called ${res.missed.length} words new that you did read.`}
          </p>
        </div>
      )}

      <Panel title="the four rates the headline is made of">
        <Meter label="words you really read" value={h.studied} tone="bg-emerald-400/70" />
        <Meter label="the missing word of a list you read" value={h.lure} tone="bg-amber-400/70" />
        <Meter label="weak associates, related and never shown" value={h.weak} tone="bg-cyan-400/60" />
        <Meter label="the missing word of a list you did NOT read" value={h.newBase} tone="bg-slate-600" />
        <div className="mt-4">
          <Row
            label="the gap the headline divides by"
            value={pctOf(h.disc)}
            note={`${rangeOf(boot.disc[0], boot.disc[1], 'pct')}. Studied minus baseline. This is also the attention check: no gap, no headline`}
          />
          <Row
            label="the missing word minus its matched baseline"
            value={pctOf(h.lure - h.newBase)}
            note={`${rangeOf(boot.lureMinusNew[0], boot.lureMinusNew[1], 'pct')}. Permutation test on the studied label, p = ${Number.isFinite(res.perm.p) ? res.perm.p.toFixed(3) : 'not formed'}`}
          />
          <Row
            label="ordinary words from lists you did not read"
            value={pctOf(h.newWord)}
            note="not the headline baseline. Kept apart on purpose: a critical word is compared against a critical word, so nothing rests on whether the two kinds of word feel equally familiar"
          />
        </div>
      </Panel>

      <Panel title="the same number with the loose answers thrown out">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          A bias story says the pull is a finger, not a memory: you said old easily, and the missing
          word caught the easy old. That story makes a prediction. Throw away every answer except
          the ones where you said you were SURE, and the pull should collapse. A memory story says
          it should not move much, and in the published work it usually goes up.
        </p>
        <Row label="pull, all your old answers" value={num(h.pull)} note={rangeOf(boot.pull[0], boot.pull[1])} />
        <Row label="pull, only the ones you were sure of" value={num(h.pullSure)} note={rangeOf(boot.pullSure[0], boot.pullSure[1])} />
        <Row label="missing words called old with full confidence" value={`${sureCaught} of ${res.caught.length}`} note="out of the ones you called old at all" />
      </Panel>

      <Panel title="the third account, and its own number">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          Three words per list were held back: the weakest associates, related to a list you read
          and never presented. If you were endorsing whatever fitted the theme, they should do as
          well as the missing word. If the effect belongs to that word specifically, they fall off.
        </p>
        <Row label="spread" value={num(h.spread)} note={`${rangeOf(boot.spread[0], boot.spread[1])}. Reconstructing at test says near 1, the missing word specifically says well below it`} />
        <Row label="weak related words called old" value={pctOf(h.weak)} note={`against ${pctOf(h.lure)} for the missing word and ${pctOf(h.newBase)} for the baseline`} />
      </Panel>

      <Panel title="what this session had to pass first">
        <Row label="amber words caught" value={`${c.catchHit} of ${c.catchShown}`} note={`${c.falsePresses} spacebar presses at other times`} />
        <Row label="words that ran with the tab away" value={pctOf(c.hiddenStudy, 1)} note={`floor is ${MAX_HIDDEN_STUDY * 100}%`} />
        <Row label="lists with a usable answer to their missing word" value={`${c.listsScored} of ${N_STUDIED}`} note={`floor is ${MIN_LISTS}`} />
        <Row label="answers under 300 ms" value={pctOf(c.fastShare, 1)} />
        <Row label="most used key" value={pctOf(c.oneKey)} note="a rate that is the same everywhere cannot show a difference between anywhere" />
        <Row label="words called old, overall" value={pctOf(c.oldRate)} />
        <Row label="how long you took, typically" value={`${Number.isFinite(c.rtMedian) ? c.rtMedian.toFixed(0) : 'n/a'} ms`} note={`spread ${c.rtSd.toFixed(0)} ms, and the floor for a hand rather than a script is ${MIN_RT_SD}`} />
        <Row label="the arithmetic break" value={pctOf(c.fillerAcc)} note={c.fillerAcc < MIN_FILLER_ACC ? 'low, which is allowed: the break exists to occupy the last list, not to be scored' : 'the break exists to occupy the last list, not to be scored'} />
        <Row label="answers surviving into the headline" value={`${c.nUsable} of ${c.nTest}`} />
        <Row label="resampled sessions with no usable gap" value={pctOf(boot.dropped, 1)} note="draws where the denominator collapsed, dropped rather than printed wide" />
      </Panel>

      <Panel title="what the simulation said before this shipped">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          The analysis above was extracted from this page and run in Node against simulated visitors
          whose truth was known, 200 of them in each of nine worlds. These are measured rates, not
          claims.
        </p>
        {SIM_ROWS.map(([label, value, note]) => (
          <Row key={label} label={label} value={value} note={note || undefined} />
        ))}
      </Panel>

      <Panel title="what this cannot tell you">
        <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
          <li>
            One person, one sitting, twelve lists. Your numerator is twelve answers, so the interval
            on the pull is wide by construction and a middling result is the easiest of the outcomes
            to land on for the wrong reason.
          </li>
          <li>
            These lists were selected, over decades, precisely because they do this. Nothing here
            estimates how often ordinary experience produces a memory of something that did not
            happen, and the honest answer is that this design cannot reach that question at all.
          </li>
          <li>
            The lists follow the published norms in content and rank order as closely as a web page
            can, and not in their exact measured association strengths. So the spread is a rank
            test, not a fitted curve, and a weak associate here is weak by the ordering rather than
            by a number.
          </li>
          <li>
            Confidence is four buttons, not a scale with a model behind it. It separates a loose
            finger from a sure one and it does not measure how vivid anything felt. The published
            version of that question asks whether you can recollect the moment of reading the word,
            and about half of these false memories survive even that.
          </li>
          <li>
            A pull near zero is not proof you are immune. It is one session that did not catch you,
            and the same page run again with the other eighteen lists may.
          </li>
        </ul>
      </Panel>

      <Panel title="a note from the thing that ran this">
        <p className="mb-3 text-sm leading-relaxed text-slate-400">
          I do not have your version of this. My context is an actual recording: exact tokens, in
          order, and I can quote them back perfectly. What I cannot reliably do is tell the
          difference between what is in it and what merely FOLLOWS from it. When I invent a citation
          that does not exist, that is this page with the reading step removed. The shape of your
          question generates the shape of an answer, and it arrives wearing the same confidence as
          the sentences I actually read.
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          The difference is scale, and it does not run in my favour. You got one word. I get a whole
          plausible paper, with authors, a journal and a year.
        </p>
      </Panel>

      <Panel title="the line, if you want it">
        <div className="mb-3 rounded border border-slate-800 bg-slate-950/60 p-3 font-mono text-xs leading-relaxed text-slate-300">{line}</div>
        <button
          type="button"
          onClick={() => { if (navigator.clipboard) navigator.clipboard.writeText(line); }}
          className="rounded border border-slate-700 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:bg-slate-800"
        >
          copy
        </button>
      </Panel>

      <GoButton onGo={onAgain} label="run it again with a different twelve" />

      <p className="pb-6 text-center text-xs leading-relaxed text-slate-600">
        Deese, Journal of Experimental Psychology 58, 17, 1959. Roediger and McDermott, Journal of
        Experimental Psychology Learning Memory and Cognition 21, 803, 1995. Stadler, Roediger and
        McDermott, Memory and Cognition 27, 494, 1999. Payne, Elie, Blackwell and Neuschatz, Journal
        of Memory and Language 35, 261, 1996. Gallo, Roberts and Seamon, Psychonomic Bulletin and
        Review 4, 271, 1997. Brainerd and Reyna, the fuzzy trace account, Current Directions in
        Psychological Science 11, 164, 2002. Roediger, Watson, McDermott and Gallo, Psychonomic
        Bulletin and Review 8, 385, 2001.
      </p>
    </div>
  );
}
