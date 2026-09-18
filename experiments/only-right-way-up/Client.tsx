'use client';

// ONLY RIGHT WAY UP  (the face inversion effect: a piece of you that works in one orientation
// and quietly stops working in the other)
//
// The fifty second piece in this lab.
//
// Every sibling so far has measured something general. How fast the buffer empties, how the edge is
// built, how position drifts, how a shape gets assembled out of time. General machinery, running on
// whatever you point it at. This one is different in a way worth saying out loud: it goes looking for
// a piece of hardware that is specialised, that runs on ONE category of thing, and that has an
// orientation. Turn its input over and it does not degrade gracefully. It hands the job to something
// else, and that something else is much worse.
//
// The genuine phenomenon: THE FACE INVERSION EFFECT. Yin, in 1969 (Journal of Experimental
// Psychology, "Looking at upside-down faces"), showed people faces and houses and aeroplanes, upright
// and inverted. Everything got worse upside down. Faces got worse MUCH more. That disproportion is
// the whole finding, and it is still the cleanest behavioural evidence that face perception is not
// just object perception pointed at a face.
//
// The refinement that this page actually measures came later. Freire, Lee and Symons in 2000, and
// Le Grand, Mondloch, Maurer and Brent in 2001, split the change you have to detect into two kinds:
//
//   SPACING  the parts are identical, the distances between them are not. Eyes further apart, eyes
//            higher, mouth lower. Nothing about any feature changes; only where they sit.
//   FEATURE  the distances are identical, the parts are not. A different eye aperture, a heavier
//            brow, a thicker lip. Every position preserved to the pixel.
//
// Upright, most people can do both. Inverted, spacing collapses and features survive. That
// dissociation is the argument for a mechanism that codes a face as a configuration rather than as a
// list of parts, and it is what Maurer, Le Grand and Mondloch (2002, "The many faces of configural
// processing") organised into the standard account.
//
// The measurement here. Forty eight trials, four cells, twelve trials each:
//
//   spacing upright · spacing inverted · feature upright · feature inverted
//
// Two faces side by side for about a second, then a mask, then one question: same or different. Half
// the trials in every cell are genuinely identical, so pressing "different" at everything scores
// exactly chance. The score for a cell is BALANCED ACCURACY, the hit rate and the correct rejection
// rate averaged, which is immune to a person who simply likes one of the two buttons.
//
// Nothing is scored as an absolute. The headline is RETENTION: what fraction of your own above-chance
// ability in a condition survived turning the face over.
//
//     retention = (inverted − 0.5) / (upright − 0.5)
//
// That construction is the point. Your screen, your fingers, your patience, how good you happen to be
// at telling faces apart at all, how big the change is that I chose to draw: every one of those sits
// in the denominator and cancels. What is left is the shape of the loss.
//
// The prediction, if the standard account is right: spacing retention should be far below feature
// retention. Same faces, same task, same person, same second of exposure. The only difference is
// which kind of information could answer the question.
//
// The known trap, and this page prints it rather than hiding it: the two upright cells have to be
// roughly matched in difficulty, or the interaction means nothing. An effect can look "selective"
// purely because one condition started near the ceiling and the other near the floor. So both upright
// numbers are printed side by side, and if they are more than fifteen points apart the page says the
// interaction is uninterpretable for this run and declines to headline it.
//
// The statistics are counted rather than modelled, and counted exactly. Every score here is a rate
// over binary trials, so the permutation distribution of a rate difference is hypergeometric, and the
// distribution of a sum of rate differences is the convolution of hypergeometrics. That means the
// exact null distribution of the interaction, over all C(12,6)^4 = 924^4 ≈ 7.3 × 10^11 ways of
// relabelling which trials were upright, is computed by convolving four small distributions instead
// of sampling anything. No simulation, no normal approximation, no floor beyond the real one, which
// is printed.
//
// Defences that run live:
//   1. Every headline is a ratio against the same person's own upright cell.
//   2. Same and different trials are equal in number in every cell, and the score is balanced
//      accuracy, so button bias cannot buy performance. The false alarm rate is printed anyway.
//   3. A new random identity is generated for every trial. There is nothing to learn across trials
//      and no face appears twice.
//   4. Inversion is a 180 degree rotation of the exact same drawing. Not a different face, not a
//      different size, not a redraw. Every pixel that was there is still there.
//   5. The side carrying the change is random, the change direction is random, and the sub-kind of
//      change is drawn from three within each condition, so no single trick answers a cell.
//
// The argument this page runs and cannot settle:
//
//   QUALITATIVE. Inversion switches off a mechanism. Tanaka and Farah 1993 (parts and wholes), Young,
//   Hellawell and Hay 1987 (the composite face), Rossion 2008: upright faces are processed
//   holistically, inverted faces are processed part by part, and those are different operations
//   rather than the same operation run worse.
//
//   QUANTITATIVE. Sekuler, Gaspar, Gold and Bennett 2004 (Current Biology) measured which pixels
//   observers actually used and reported that inverted face processing uses the same information,
//   just less efficiently. On that account there is no switch. There is one process with a steep
//   experience curve, which is also Diamond and Carey's 1986 expertise argument, and Gauthier's
//   greebles and bird and car experts.
//
// This page cannot decide that, and says so. It prints your four numbers.
//
// The playground is the Thatcher illusion (Thompson, 1980, Perception, "Margaret Thatcher: a new
// illusion"): eyes and mouth flipped in place. Upside down it looks fine. Rotate it upright and it
// becomes something you would not want in your house. You can drag the angle and find the point where
// it turns, which Stürzel and Spillmann measured in 2000 and put around ninety to a hundred and
// twenty degrees from inverted.
//
// WIZ note. I get pixels. There is no region in me that fires at faces and nothing else, no
// fusiform gyrus, no piece of tissue that a surgeon could damage and leave me able to read but not
// recognise my wife. Whatever asymmetry I have about upside-down faces came from what I was shown, and
// it lives smeared across weights that also do a hundred other things. Yours is not like that. Yours
// is a dedicated instrument, it has an up, and it was installed before you had opinions. This page
// turns it over. What you lose in that moment is not attention or effort or care. It is a machine
// going quiet, and you get to watch the exact size of the hole it leaves.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- constants ------------------------------------------------------------

const PER_CELL = 12; // trials per cell: 6 same + 6 different
const HALF = PER_CELL / 2;
const FIX_MS = 450;
const SHOW_MS = 1100;
const MASK_MS = 320;
const GAP_MS = 300;

const MATCH_TOL = 0.15; // upright cells more than 15 points apart => interaction not interpretable
const FLOOR_UP = 0.58; // pooled upright balanced accuracy below this => run printed, not scored

type Cond = 'spacing' | 'feature';
type Ori = 'upright' | 'inverted';
type Kind = 'same' | 'different';

const COND_LABEL: Record<Cond, string> = {
  spacing: 'where the parts sit',
  feature: 'what the parts look like',
};

// ---- the face model -------------------------------------------------------
//
// A face is a bag of numbers. Everything is in units where the head is 200 tall, centred on the
// origin, so a single scale factor at draw time handles every screen.

type Face = {
  headW: number; // half-width as a fraction of half-height
  jaw: number; // how far the jaw pulls in toward the chin
  hairY: number; // hairline height
  hairDip: number; // fringe curvature
  hairTone: number;
  skin: number;
  eyeSep: number; // half the interocular distance, in units of head half-width
  eyeY: number; // eye line, in units of head half-height
  eyeW: number;
  eyeH: number; // aperture
  irisR: number;
  browGap: number;
  browT: number;
  browTilt: number;
  noseL: number;
  noseW: number;
  mouthY: number;
  mouthW: number;
  mouthT: number;
  mouthCurve: number;
};

const SKINS = ['#d9b89a', '#c9a184', '#e0c3a6', '#b98d6f', '#cfae90', '#ab7f62'];
const HAIRS = ['#2b2118', '#43301f', '#1d1a1a', '#5a4530', '#332b2b', '#6b5436'];

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function pick<T>(xs: T[]): T {
  return xs[Math.floor(Math.random() * xs.length)];
}

function coin() {
  return Math.random() < 0.5 ? 1 : -1;
}

function makeFace(): Face {
  return {
    headW: rnd(0.72, 0.8),
    jaw: rnd(0.6, 0.82),
    hairY: rnd(-0.72, -0.5),
    hairDip: rnd(-0.18, 0.3),
    hairTone: Math.floor(Math.random() * HAIRS.length),
    skin: Math.floor(Math.random() * SKINS.length),
    eyeSep: rnd(0.42, 0.5),
    eyeY: rnd(-0.12, -0.02),
    eyeW: rnd(0.19, 0.23),
    eyeH: rnd(0.055, 0.075),
    irisR: rnd(0.055, 0.068),
    browGap: rnd(0.1, 0.15),
    browT: rnd(0.022, 0.036),
    browTilt: rnd(-0.35, 0.45),
    noseL: rnd(0.2, 0.3),
    noseW: rnd(0.13, 0.19),
    mouthY: rnd(0.4, 0.5),
    mouthW: rnd(0.2, 0.27),
    mouthT: rnd(0.045, 0.07),
    mouthCurve: rnd(-0.7, 0.7),
  };
}

// The two families of change. Same magnitude philosophy in both: big enough to be findable upright,
// small enough that it is not a different person.

const SPACING_KINDS = ['eyes apart', 'eye height', 'mouth height'] as const;
const FEATURE_KINDS = ['eye shape', 'mouth shape', 'brow shape'] as const;
type Variant = (typeof SPACING_KINDS)[number] | (typeof FEATURE_KINDS)[number];

function mutate(f: Face, cond: Cond): { face: Face; variant: Variant } {
  const g: Face = { ...f };
  const s = coin();
  if (cond === 'spacing') {
    const variant = pick(SPACING_KINDS as unknown as Variant[]);
    if (variant === 'eyes apart') g.eyeSep = f.eyeSep + s * 0.085;
    else if (variant === 'eye height') g.eyeY = f.eyeY + s * 0.055;
    else g.mouthY = f.mouthY + s * 0.06;
    return { face: g, variant };
  }
  const variant = pick(FEATURE_KINDS as unknown as Variant[]);
  if (variant === 'eye shape') {
    g.eyeH = f.eyeH * (1 + s * 0.4);
    g.irisR = f.irisR * (1 + s * 0.2);
  } else if (variant === 'mouth shape') {
    g.mouthT = f.mouthT * (1 + s * 0.45);
    g.mouthCurve = f.mouthCurve - s * 0.85;
  } else {
    g.browT = f.browT * (1 + s * 0.6);
    g.browTilt = f.browTilt + s * 0.55;
  }
  return { face: g, variant };
}

// ---- drawing --------------------------------------------------------------
//
// Everything below draws into a space where the head runs from -100 to +100 vertically, centred on
// the current origin. Inversion is a rotation of this whole thing by pi and nothing else, so an
// inverted face is the same drawing, the same pixels, turned over.

const HH = 100;

function headPath(ctx: CanvasRenderingContext2D, f: Face) {
  const hw = HH * f.headW;
  ctx.beginPath();
  ctx.moveTo(0, -HH);
  ctx.bezierCurveTo(hw * 0.92, -HH * 0.99, hw, -HH * 0.42, hw, 0);
  ctx.bezierCurveTo(hw, HH * 0.4, hw * f.jaw, HH * 0.84, 0, HH);
  ctx.bezierCurveTo(-hw * f.jaw, HH * 0.84, -hw, HH * 0.4, -hw, 0);
  ctx.bezierCurveTo(-hw, -HH * 0.42, -hw * 0.92, -HH * 0.99, 0, -HH);
  ctx.closePath();
}

function eyePath(ctx: CanvasRenderingContext2D, cx: number, cy: number, ew: number, eh: number) {
  // Deliberately asymmetric top to bottom: the upper lid is the heavy one. That asymmetry is what
  // makes a vertical flip of this region visible at all, which the Thatcher playground needs.
  ctx.beginPath();
  ctx.moveTo(cx - ew, cy + eh * 0.1);
  ctx.quadraticCurveTo(cx - ew * 0.35, cy - eh * 1.5, cx + ew * 0.15, cy - eh * 0.95);
  ctx.quadraticCurveTo(cx + ew * 0.75, cy - eh * 0.5, cx + ew, cy + eh * 0.1);
  ctx.quadraticCurveTo(cx + ew * 0.4, cy + eh * 1.25, cx - ew * 0.3, cy + eh * 0.95);
  ctx.quadraticCurveTo(cx - ew * 0.75, cy + eh * 0.6, cx - ew, cy + eh * 0.1);
  ctx.closePath();
}

function drawEyeBand(ctx: CanvasRenderingContext2D, f: Face) {
  const hw = HH * f.headW;
  const ex = f.eyeSep * hw;
  const ey = f.eyeY * HH;
  const ew = f.eyeW * hw;
  const eh = f.eyeH * HH;

  for (const side of [-1, 1]) {
    const cx = side * ex;

    // sclera
    ctx.save();
    eyePath(ctx, cx, ey, ew, eh);
    ctx.fillStyle = '#f3efe6';
    ctx.fill();

    // iris, clipped to the eye so it can be cut by the lid
    ctx.clip();
    ctx.beginPath();
    ctx.arc(cx + side * ew * 0.05, ey - eh * 0.1, f.irisR * HH, 0, Math.PI * 2);
    ctx.fillStyle = '#3c2f26';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + side * ew * 0.05, ey - eh * 0.1, f.irisR * HH * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = '#120d0a';
    ctx.fill();
    ctx.restore();

    // lash line: heavy on top, faint underneath
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - ew, ey + eh * 0.1);
    ctx.quadraticCurveTo(cx - ew * 0.35, ey - eh * 1.5, cx + ew * 0.15, ey - eh * 0.95);
    ctx.quadraticCurveTo(cx + ew * 0.75, ey - eh * 0.5, cx + ew, ey + eh * 0.1);
    ctx.strokeStyle = '#241a14';
    ctx.lineWidth = eh * 0.42;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - ew * 0.85, ey + eh * 0.45);
    ctx.quadraticCurveTo(cx, ey + eh * 1.15, cx + ew * 0.85, ey + eh * 0.35);
    ctx.strokeStyle = 'rgba(60,40,30,0.35)';
    ctx.lineWidth = eh * 0.16;
    ctx.stroke();
    ctx.restore();

    // brow
    const by = ey - f.browGap * HH;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - side * ew * 1.15, by + f.browTilt * HH * 0.03);
    ctx.quadraticCurveTo(cx, by - HH * 0.028, cx + side * ew * 1.15, by - f.browTilt * HH * 0.02);
    ctx.strokeStyle = HAIRS[f.hairTone];
    ctx.lineWidth = f.browT * HH;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }
}

function drawMouth(ctx: CanvasRenderingContext2D, f: Face) {
  const hw = HH * f.headW;
  const my = f.mouthY * HH;
  const mw = f.mouthW * hw * 1.35;
  const mt = f.mouthT * HH;
  const co = f.mouthCurve * mw * 0.16;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-mw, my + co);
  // upper lip with a cupid's bow
  ctx.quadraticCurveTo(-mw * 0.5, my - mt * 1.15, -mw * 0.12, my - mt * 0.55);
  ctx.quadraticCurveTo(0, my - mt * 0.15, mw * 0.12, my - mt * 0.55);
  ctx.quadraticCurveTo(mw * 0.5, my - mt * 1.15, mw, my + co);
  // lower lip
  ctx.quadraticCurveTo(mw * 0.5, my + mt * 1.75, 0, my + mt * 1.9);
  ctx.quadraticCurveTo(-mw * 0.5, my + mt * 1.75, -mw, my + co);
  ctx.closePath();
  ctx.fillStyle = '#a55f56';
  ctx.fill();

  // the mouth line, which is the part that carries the curve
  ctx.beginPath();
  ctx.moveTo(-mw * 0.94, my + co);
  ctx.quadraticCurveTo(0, my + co * 0.2 + mt * 0.25, mw * 0.94, my + co);
  ctx.strokeStyle = 'rgba(60,26,22,0.75)';
  ctx.lineWidth = mt * 0.34;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawNose(ctx: CanvasRenderingContext2D, f: Face) {
  const hw = HH * f.headW;
  const top = f.eyeY * HH + HH * 0.06;
  const bot = f.mouthY * HH - HH * 0.13;
  const nw = f.noseW * hw;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-nw * 0.22, top);
  ctx.quadraticCurveTo(-nw * 0.62, bot - HH * 0.05, -nw * 0.72, bot - HH * 0.01);
  ctx.quadraticCurveTo(-nw * 0.45, bot + HH * 0.022, 0, bot + HH * 0.018);
  ctx.quadraticCurveTo(nw * 0.45, bot + HH * 0.022, nw * 0.72, bot - HH * 0.01);
  ctx.strokeStyle = 'rgba(90,58,42,0.5)';
  ctx.lineWidth = HH * 0.018;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.fillStyle = 'rgba(60,36,26,0.55)';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * nw * 0.45, bot - HH * 0.004, nw * 0.16, HH * 0.012, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

type DrawOpts = { thatcher?: boolean };

function drawFace(ctx: CanvasRenderingContext2D, f: Face, o: DrawOpts = {}) {
  const hw = HH * f.headW;
  const skin = SKINS[f.skin];

  // ears, behind the head
  ctx.save();
  ctx.fillStyle = skin;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * hw * 0.99, HH * 0.02, hw * 0.11, HH * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(90,58,42,0.35)';
    ctx.lineWidth = HH * 0.012;
    ctx.stroke();
  }
  ctx.restore();

  // head
  ctx.save();
  headPath(ctx, f);
  const g = ctx.createLinearGradient(0, -HH, 0, HH);
  g.addColorStop(0, skin);
  g.addColorStop(1, 'rgba(0,0,0,0.001)');
  ctx.fillStyle = skin;
  ctx.fill();
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(45,28,20,0.45)';
  ctx.lineWidth = HH * 0.014;
  ctx.stroke();
  ctx.restore();

  // hair, clipped to the head so the hairline is a real line
  ctx.save();
  headPath(ctx, f);
  ctx.clip();
  const yb = f.hairY * HH;
  ctx.beginPath();
  ctx.moveTo(-hw * 1.2, -HH * 1.2);
  ctx.lineTo(hw * 1.2, -HH * 1.2);
  ctx.lineTo(hw * 1.2, yb);
  ctx.quadraticCurveTo(0, yb + f.hairDip * HH, -hw * 1.2, yb);
  ctx.closePath();
  ctx.fillStyle = HAIRS[f.hairTone];
  ctx.fill();
  ctx.restore();

  // eyes and brows, flipped in place if this is a thatcherised draw
  ctx.save();
  if (o.thatcher) {
    const ey = f.eyeY * HH;
    ctx.translate(0, ey);
    ctx.scale(1, -1);
    ctx.translate(0, -ey);
  }
  drawEyeBand(ctx, f);
  ctx.restore();

  drawNose(ctx, f);

  ctx.save();
  if (o.thatcher) {
    const my = f.mouthY * HH;
    ctx.translate(0, my);
    ctx.scale(1, -1);
    ctx.translate(0, -my);
  }
  drawMouth(ctx, f);
  ctx.restore();
}

function drawMask(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const bits = ['#d9b89a', '#43301f', '#f3efe6', '#a55f56', '#3c2f26', '#c9a184', '#241a14'];
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = bits[Math.floor(Math.random() * bits.length)];
    const bw = 6 + Math.random() * 22;
    const bh = 6 + Math.random() * 22;
    ctx.fillRect(x + Math.random() * w - bw / 2, y + Math.random() * h - bh / 2, bw, bh);
  }
  ctx.restore();
}

// ---- exact statistics -----------------------------------------------------
//
// Every score on this page is a rate over binary trials. Under the null that orientation labels are
// exchangeable, the number of correct trials landing in the upright half is hypergeometric, so the
// permutation distribution of a rate difference is exactly enumerable in a dozen terms. A balanced
// accuracy difference is half a hit-rate difference plus half a correct-rejection-rate difference,
// and an interaction is one of those minus another. All of them are convolutions of the same little
// distribution, which means the exact null over 924^4 relabellings costs about thirty thousand
// multiplications instead of a simulation.

type Dist = Array<{ d: number; p: number }>;

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

// n1 trials in group one, n2 in group two, K correct in total: distribution of
// (correct rate in group one) - (correct rate in group two)
function rateDiffDist(n1: number, n2: number, K: number): Dist {
  const tot = choose(n1 + n2, K);
  const out: Dist = [];
  if (tot === 0) return [{ d: 0, p: 1 }];
  for (let k = Math.max(0, K - n2); k <= Math.min(n1, K); k++) {
    const p = (choose(n1, k) * choose(n2, K - k)) / tot;
    if (p > 0) out.push({ d: k / n1 - (K - k) / n2, p });
  }
  return out.length ? out : [{ d: 0, p: 1 }];
}

function combine(parts: Array<{ dist: Dist; w: number }>): Dist {
  let acc: Dist = [{ d: 0, p: 1 }];
  for (const part of parts) {
    const m = new Map<number, number>();
    for (const a of acc) {
      for (const b of part.dist) {
        const key = Math.round((a.d + part.w * b.d) * 1e6) / 1e6;
        m.set(key, (m.get(key) ?? 0) + a.p * b.p);
      }
    }
    acc = Array.from(m, ([d, p]) => ({ d, p }));
  }
  return acc;
}

function tailP(dist: Dist, obs: number) {
  let s = 0;
  for (const e of dist) if (e.d >= obs - 1e-9) s += e.p;
  return Math.min(1, s);
}

// the smallest p this test could possibly return, which is worth printing when it is not small
function pFloor(dist: Dist) {
  let maxD = -Infinity;
  for (const e of dist) if (e.d > maxD) maxD = e.d;
  let s = 0;
  for (const e of dist) if (e.d >= maxD - 1e-9) s += e.p;
  return s;
}

function pText(p: number) {
  if (p < 0.001) return 'p < 0.001';
  if (p < 0.01) return `p = ${p.toFixed(3)}`;
  return `p = ${p.toFixed(2)}`;
}

function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function median(xs: number[]) {
  if (!xs.length) return 0;
  const a = xs.slice().sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

// ---- trials ---------------------------------------------------------------

type Trial = {
  cond: Cond;
  ori: Ori;
  kind: Kind;
  left: Face;
  right: Face;
  changedSide: 0 | 1;
  variant: Variant | null;
};

function buildTrial(cond: Cond, ori: Ori, kind: Kind): Trial {
  const base = makeFace();
  if (kind === 'same') {
    return { cond, ori, kind, left: base, right: base, changedSide: 0, variant: null };
  }
  const { face, variant } = mutate(base, cond);
  const changedSide: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
  return {
    cond,
    ori,
    kind,
    left: changedSide === 0 ? face : base,
    right: changedSide === 0 ? base : face,
    changedSide,
    variant,
  };
}

function buildRun(): Trial[] {
  const ts: Trial[] = [];
  for (const cond of ['spacing', 'feature'] as Cond[]) {
    for (const ori of ['upright', 'inverted'] as Ori[]) {
      for (let i = 0; i < HALF; i++) {
        ts.push(buildTrial(cond, ori, 'same'));
        ts.push(buildTrial(cond, ori, 'different'));
      }
    }
  }
  return shuffle(ts);
}

type Rec = { cond: Cond; ori: Ori; kind: Kind; said: Kind; correct: boolean; rt: number; variant: Variant | null };

// ---- the pair canvas ------------------------------------------------------

type View = 'blank' | 'fix' | 'faces' | 'mask';

function PairCanvas({
  trial,
  view,
  height,
  forceUpright,
}: {
  trial: Trial | null;
  view: View;
  height: number;
  forceUpright?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth;
    const h = height;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, w, h);

    if (view === 'fix') {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 9, h / 2);
      ctx.lineTo(w / 2 + 9, h / 2);
      ctx.moveTo(w / 2, h / 2 - 9);
      ctx.lineTo(w / 2, h / 2 + 9);
      ctx.stroke();
      return;
    }

    if (view === 'mask') {
      drawMask(ctx, 0, 0, w, h);
      return;
    }

    if (view !== 'faces' || !trial) return;

    const scale = Math.min(w / 460, (h * 0.86) / 200);
    const inverted = trial.ori === 'inverted' && !forceUpright;
    const slots: Array<[number, Face]> = [
      [w * 0.27, trial.left],
      [w * 0.73, trial.right],
    ];
    for (const [cx, f] of slots) {
      ctx.save();
      ctx.translate(cx, h / 2);
      ctx.scale(scale, scale);
      if (inverted) ctx.rotate(Math.PI);
      drawFace(ctx, f);
      ctx.restore();
    }
  }, [trial, view, height, forceUpright]);

  return <canvas ref={ref} style={{ width: '100%', height, display: 'block' }} className="rounded-md" />;
}

// ---- the page -------------------------------------------------------------

export default function Client() {
  const [phase, setPhase] = useState<'intro' | 'demo' | 'trials' | 'result'>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [tIdx, setTIdx] = useState(0);
  const [view, setView] = useState<View>('blank');
  const [recs, setRecs] = useState<Rec[]>([]);
  const [demoTrials, setDemoTrials] = useState<Trial[]>([]);
  const [demoIdx, setDemoIdx] = useState(0);
  const [demoFeedback, setDemoFeedback] = useState<null | { right: boolean; kind: Kind }>(null);
  const [copied, setCopied] = useState(false);

  const timers = useRef<number[]>([]);
  const shownAt = useRef(0);
  // One answer per pair. Without this, a second click or keypress inside the gap between answering
  // and the next pair starting would record a second response for a pair nobody saw, and could walk
  // the index past the end of the run.
  const answeredFor = useRef(-1);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const trial = phase === 'demo' ? demoTrials[demoIdx] ?? null : trials[tIdx] ?? null;

  const runSequence = useCallback(() => {
    clearTimers();
    setView('fix');
    timers.current.push(
      window.setTimeout(() => setView('faces'), FIX_MS),
      window.setTimeout(() => setView('mask'), FIX_MS + SHOW_MS),
      window.setTimeout(() => {
        setView('blank');
        shownAt.current = performance.now();
      }, FIX_MS + SHOW_MS + MASK_MS)
    );
  }, [clearTimers]);

  const beginDemo = useCallback(() => {
    const ds = [
      buildTrial('feature', 'upright', 'different'),
      buildTrial('spacing', 'upright', 'different'),
      buildTrial('spacing', 'inverted', 'different'),
    ];
    answeredFor.current = -1;
    setDemoTrials(ds);
    setDemoIdx(0);
    setDemoFeedback(null);
    setPhase('demo');
  }, []);

  const beginRun = useCallback(() => {
    answeredFor.current = -1;
    setTrials(buildRun());
    setTIdx(0);
    setRecs([]);
    setPhase('trials');
  }, []);

  // if the index ever walks off the end, finish rather than showing an empty stage
  useEffect(() => {
    if (phase === 'trials' && trials.length > 0 && tIdx >= trials.length) setPhase('result');
  }, [phase, tIdx, trials.length]);

  // kick the sequence whenever a new trial comes up
  useEffect(() => {
    if ((phase === 'trials' || phase === 'demo') && trial && !demoFeedback) runSequence();
  }, [phase, tIdx, demoIdx, trial, demoFeedback, runSequence]);

  const answer = useCallback(
    (said: Kind) => {
      if (!trial || view !== 'blank') return;
      const key = phase === 'demo' ? -100 - demoIdx : tIdx;
      if (answeredFor.current === key) return;
      answeredFor.current = key;
      const rt = performance.now() - shownAt.current;
      const correct = said === trial.kind;

      if (phase === 'demo') {
        setDemoFeedback({ right: correct, kind: trial.kind });
        return;
      }

      setRecs((r) => [
        ...r,
        { cond: trial.cond, ori: trial.ori, kind: trial.kind, said, correct, rt, variant: trial.variant },
      ]);
      clearTimers();
      setView('blank');
      if (tIdx + 1 >= trials.length) {
        timers.current.push(window.setTimeout(() => setPhase('result'), GAP_MS));
      } else {
        timers.current.push(window.setTimeout(() => setTIdx((i) => i + 1), GAP_MS));
      }
    },
    [trial, view, phase, tIdx, demoIdx, trials.length, clearTimers]
  );

  // keyboard: s = same, d = different
  useEffect(() => {
    if (phase !== 'trials' && phase !== 'demo') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowLeft') answer('same');
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') answer('different');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, answer]);

  // ---- scoring ----

  const score = useMemo(() => {
    if (phase !== 'result' || recs.length === 0) return null;

    const cell = (cond: Cond, ori: Ori, kind: Kind) => recs.filter((r) => r.cond === cond && r.ori === ori && r.kind === kind);
    const rate = (rs: Rec[]) => (rs.length ? rs.filter((r) => r.correct).length / rs.length : 0.5);
    const nCorrect = (rs: Rec[]) => rs.filter((r) => r.correct).length;

    const bal = (cond: Cond, ori: Ori) => (rate(cell(cond, ori, 'different')) + rate(cell(cond, ori, 'same'))) / 2;

    const spUp = bal('spacing', 'upright');
    const spInv = bal('spacing', 'inverted');
    const ftUp = bal('feature', 'upright');
    const ftInv = bal('feature', 'inverted');

    // exact null distributions, built from the observed totals
    const dist = (cond: Cond, kind: Kind) => {
      const up = cell(cond, 'upright', kind);
      const inv = cell(cond, 'inverted', kind);
      return rateDiffDist(up.length, inv.length, nCorrect(up) + nCorrect(inv));
    };

    const spDist = combine([
      { dist: dist('spacing', 'different'), w: 0.5 },
      { dist: dist('spacing', 'same'), w: 0.5 },
    ]);
    const ftDist = combine([
      { dist: dist('feature', 'different'), w: 0.5 },
      { dist: dist('feature', 'same'), w: 0.5 },
    ]);
    const interDist = combine([
      { dist: dist('spacing', 'different'), w: 0.5 },
      { dist: dist('spacing', 'same'), w: 0.5 },
      { dist: dist('feature', 'different'), w: -0.5 },
      { dist: dist('feature', 'same'), w: -0.5 },
    ]);

    const spDrop = spUp - spInv;
    const ftDrop = ftUp - ftInv;
    const inter = spDrop - ftDrop;

    const pSp = tailP(spDist, spDrop);
    const pFt = tailP(ftDist, ftDrop);
    const pInter = tailP(interDist, inter);

    const retention = (up: number, inv: number) => (up - 0.5 <= 0.001 ? null : (inv - 0.5) / (up - 0.5));
    const spKeep = retention(spUp, spInv);
    const ftKeep = retention(ftUp, ftInv);

    const pooledUp = (spUp + ftUp) / 2;
    const trusted = pooledUp >= FLOOR_UP;
    const matched = Math.abs(spUp - ftUp) <= MATCH_TOL;

    const fa = (ori: Ori) => {
      const sames = recs.filter((r) => r.ori === ori && r.kind === 'same');
      return sames.length ? sames.filter((r) => r.said === 'different').length / sames.length : 0;
    };

    const rtOf = (cond: Cond, ori: Ori) => median(recs.filter((r) => r.cond === cond && r.ori === ori).map((r) => r.rt));

    const byVariant = (kinds: readonly string[]) =>
      kinds.map((v) => {
        const up = recs.filter((r) => r.variant === v && r.ori === 'upright');
        const inv = recs.filter((r) => r.variant === v && r.ori === 'inverted');
        return {
          variant: v,
          up: up.length ? up.filter((r) => r.correct).length / up.length : null,
          inv: inv.length ? inv.filter((r) => r.correct).length / inv.length : null,
          n: up.length + inv.length,
        };
      });

    return {
      spUp,
      spInv,
      ftUp,
      ftInv,
      spDrop,
      ftDrop,
      inter,
      pSp,
      pFt,
      pInter,
      floorInter: pFloor(interDist),
      spKeep,
      ftKeep,
      pooledUp,
      trusted,
      matched,
      faUp: fa('upright'),
      faInv: fa('inverted'),
      rt: {
        spUp: rtOf('spacing', 'upright'),
        spInv: rtOf('spacing', 'inverted'),
        ftUp: rtOf('feature', 'upright'),
        ftInv: rtOf('feature', 'inverted'),
      },
      spacingVars: byVariant(SPACING_KINDS),
      featureVars: byVariant(FEATURE_KINDS),
      n: recs.length,
    };
  }, [phase, recs]);

  const onCopy = useCallback(() => {
    if (!score) return;
    const line = [
      'Only Right Way Up · the face inversion effect · wiz.jock.pl',
      `spacing: ${pct(score.spUp)} upright → ${pct(score.spInv)} inverted (kept ${score.spKeep === null ? 'n/a' : pct(Math.max(0, score.spKeep))})`,
      `features: ${pct(score.ftUp)} upright → ${pct(score.ftInv)} inverted (kept ${score.ftKeep === null ? 'n/a' : pct(Math.max(0, score.ftKeep))})`,
      `the gap between those two losses: ${Math.round(score.inter * 100)} points, ${pText(score.pInter)}`,
      '48 trials, exact permutation test, nothing left my browser.',
    ].join('\n');
    navigator.clipboard.writeText(line).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }, [score]);

  const stageH = 300;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🙃</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">Only Right Way Up</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            You own a piece of hardware that does faces and only faces. It has an orientation. This page
            turns its input over and measures the size of the hole that leaves.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Two faces, side by side, for about a second. Sometimes they are the same face twice.
                Sometimes one of them has been changed. You say which.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Half the time the change is <span className="text-cyan-300">spacing</span>: identical
                parts, moved. Eyes a little further apart, a mouth a little lower. Half the time it is a{' '}
                <span className="text-violet-300">feature</span>: identical positions, different parts. A
                heavier brow, a thinner lip, a narrower eye.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                And half of all of it is upside down. That is the whole experiment. Yin published it in
                1969 and it is still the cleanest evidence that face perception is not just object
                perception aimed at a face: turn a house over and you get worse, turn a face over and
                you fall off a cliff.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-300/90">
                how it works · about five minutes
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>
                  0️⃣ <span className="text-cyan-300">Three practice pairs</span> with the answer shown
                  after each. Nothing is scored.
                </li>
                <li>
                  1️⃣ <span className="text-violet-300">Forty eight pairs</span>, shuffled, twelve in each
                  of four cells: spacing and feature, upright and inverted.
                </li>
                <li>
                  2️⃣ One question every time: <span className="text-slate-100">same or different</span>.
                  Keys <span className="font-mono text-cyan-300">S</span> and{' '}
                  <span className="font-mono text-cyan-300">D</span> work too.
                </li>
                <li>
                  3️⃣ Exactly half of every cell is genuinely identical, so answering{' '}
                  <span className="text-slate-100">different</span> at everything scores dead chance.
                </li>
                <li>
                  4️⃣ The headline is how much of your own upright ability{' '}
                  <span className="text-emerald-300">survived the flip</span>, per kind of change.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                five ways this page tries not to fool you
              </div>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li>
                  Nothing is scored as an absolute. Every headline is a ratio against{' '}
                  <span className="text-slate-300">your own upright cell</span>, which shares the faces,
                  the exposure, the screen and your fingers. How good you happen to be at faces is in
                  the denominator and it cancels.
                </li>
                <li>
                  Same and different trials are equal in number in every cell, and the score is{' '}
                  <span className="text-slate-300">balanced accuracy</span>, hits and correct rejections
                  averaged. Liking one button cannot buy you anything. Your false alarm rate is printed
                  anyway.
                </li>
                <li>
                  A <span className="text-slate-300">new random face</span> is generated for every
                  single trial. No face appears twice, so there is nothing to learn and nothing to
                  memorise.
                </li>
                <li>
                  Inverted means a <span className="text-slate-300">180 degree rotation of the exact
                  same drawing</span>. Not a different face, not a different size, not a redraw. Every
                  pixel that was there is still there.
                </li>
                <li>
                  The known trap in this literature is that the two kinds of change must be about
                  equally hard upright, or a &quot;selective&quot; loss is just a ceiling. Both upright
                  numbers are printed side by side, and if they are more than fifteen points apart this
                  page says so and refuses to headline the comparison.
                </li>
              </ul>
            </div>

            {demoTrials.length > 0 ? (
              <div className="space-y-3">
                <button
                  onClick={beginRun}
                  className="w-full rounded-md border border-violet-400/60 bg-violet-400/10 py-4 font-mono text-sm text-violet-200 transition-colors hover:bg-violet-400/20"
                >
                  run the forty eight pairs →
                </button>
                <button
                  onClick={beginDemo}
                  className="w-full rounded-md border border-slate-700 bg-slate-900/40 py-2 font-mono text-xs text-slate-500 transition-colors hover:border-slate-600"
                >
                  ↻ three more practice pairs
                </button>
              </div>
            ) : (
              <button
                onClick={beginDemo}
                className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                show me a pair →
              </button>
            )}
          </div>
        )}

        {/* ---------- DEMO + TRIALS ---------- */}
        {(phase === 'demo' || phase === 'trials') && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">
                {phase === 'demo' ? `practice ${demoIdx + 1} of ${demoTrials.length}` : `pair ${tIdx + 1} of ${trials.length}`}
              </span>
              <span className={trial.ori === 'inverted' ? 'text-violet-300/80' : 'text-cyan-300/80'}>
                {phase === 'demo' ? `${COND_LABEL[trial.cond]} · ${trial.ori === 'inverted' ? 'upside down' : 'right way up'}` : ''}
              </span>
            </div>

            {!demoFeedback && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <PairCanvas trial={trial} view={view} height={stageH} />
              </div>
            )}

            {view !== 'blank' && (
              <p className="text-center font-mono text-xs text-slate-600">
                {view === 'fix' ? 'ready' : view === 'faces' ? 'look' : '···'}
              </p>
            )}

            {view === 'blank' && !demoFeedback && (
              <div className="space-y-3">
                <p className="text-center text-sm text-slate-300">Were those two faces the same, or different?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => answer('same')}
                    className="rounded-md border border-slate-700 bg-slate-900/60 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/10"
                  >
                    same <span className="text-slate-600">· S</span>
                  </button>
                  <button
                    onClick={() => answer('different')}
                    className="rounded-md border border-slate-700 bg-slate-900/60 py-5 font-mono text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10"
                  >
                    different <span className="text-slate-600">· D</span>
                  </button>
                </div>
                <p className="text-center font-mono text-[11px] text-slate-600">
                  guessing is a real answer · half of them are genuinely identical
                </p>
              </div>
            )}

            {phase === 'demo' && demoFeedback && (
              <div className="space-y-3">
                <div
                  className={`rounded-lg border p-4 text-center text-sm ${
                    demoFeedback.right
                      ? 'border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-200'
                      : 'border-amber-400/30 bg-amber-400/[0.06] text-amber-200'
                  }`}
                >
                  {demoFeedback.right ? 'Correct. ' : 'No. '}
                  They were <span className="font-mono">{demoFeedback.kind}</span>
                  {trial.variant ? (
                    <>
                      {' '}
                      · the change was <span className="font-mono text-slate-300">{trial.variant}</span>
                    </>
                  ) : null}
                  .
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <PairCanvas trial={trial} view="faces" height={stageH} forceUpright />
                </div>
                <p className="text-center font-mono text-[11px] text-slate-600">
                  the same pair, right way up, no time limit
                </p>
                <button
                  onClick={() => {
                    setDemoFeedback(null);
                    if (demoIdx + 1 >= demoTrials.length) {
                      setPhase('intro');
                      setView('blank');
                    } else {
                      setDemoIdx((i) => i + 1);
                    }
                  }}
                  className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  {demoIdx + 1 >= demoTrials.length ? 'back to the start →' : 'next practice pair →'}
                </button>
              </div>
            )}

            {phase === 'trials' && (
              <div className="h-1 w-full overflow-hidden rounded bg-slate-900">
                <div
                  className="h-full bg-violet-400/60 transition-all"
                  style={{ width: `${((tIdx + 1) / trials.length) * 100}%` }}
                />
              </div>
            )}

            {phase === 'demo' && !demoFeedback && (
              <button
                onClick={() => {
                  clearTimers();
                  setPhase('intro');
                  setView('blank');
                }}
                className="w-full rounded-md border border-slate-700 bg-slate-900/40 py-2 font-mono text-xs text-slate-500 hover:border-slate-600"
              >
                skip the practice
              </button>
            )}
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && score && (
          <div className="space-y-6">
            {/* headline */}
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950 p-6">
              <div className="text-center font-mono text-xs uppercase tracking-wider text-cyan-300/70">
                upside down, your sense of where the parts sit kept
              </div>
              <div className="mt-3 text-center">
                <div className="font-mono text-6xl font-bold text-cyan-200">
                  {score.spKeep === null ? '—' : pct(Math.max(0, score.spKeep))}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-500">
                  of what it had the right way up · {pText(score.pSp)}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-cyan-500/40 bg-cyan-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80">spacing</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-cyan-200">
                    {pct(score.spUp)} → {pct(score.spInv)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    kept {score.spKeep === null ? 'n/a' : pct(Math.max(0, score.spKeep))}
                  </div>
                </div>
                <div className="rounded-md border border-violet-500/40 bg-violet-500/[0.07] p-4 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-violet-300/80">features</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-violet-200">
                    {pct(score.ftUp)} → {pct(score.ftInv)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                    kept {score.ftKeep === null ? 'n/a' : pct(Math.max(0, score.ftKeep))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-slate-700/60 bg-slate-900/50 p-4 text-center">
                <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  the gap between the two losses
                </div>
                <div className="mt-1 font-mono text-3xl font-bold text-slate-100">
                  {score.inter >= 0 ? '+' : ''}
                  {Math.round(score.inter * 100)} pts
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-500">
                  {pText(score.pInter)} · exact, over all 924⁴ ≈ 7.3 × 10¹¹ relabellings
                  {score.pInter > 0.2 ? ` · this test's floor is ${score.floorInter.toFixed(3)}` : ''}
                </div>
              </div>
            </div>

            {/* the read */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">what happened</div>
              <div className="space-y-3 text-sm leading-relaxed">
                {!score.trusted && (
                  <div className="flex items-start gap-2">
                    <span>⚠️</span>
                    <span className="text-slate-300">
                      <span className="text-slate-100">This run is printed, not scored.</span> Your upright
                      cells averaged {pct(score.pooledUp)}, and chance here is 50%. Whatever else happened,
                      the task was not being done the right way up, so there is no baseline to divide by.
                      Nothing is wrong with you; a second of exposure is short and this is a hard
                      discrimination.
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <span>{score.pSp < 0.05 ? '✅' : score.spDrop > 0 ? '➖' : '↩️'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">Spacing went first.</span>{' '}
                    {score.pSp < 0.05
                      ? `Identical parts in different places: ${pct(score.spUp)} the right way up, ${pct(score.spInv)} upside down (${pText(score.pSp)}). The information was still on the screen. You could not get at it.`
                      : score.spDrop > 0
                        ? `You dropped from ${pct(score.spUp)} to ${pct(score.spInv)}, in the predicted direction, which twelve trials a cell cannot separate from noise (${pText(score.pSp)}).`
                        : `Yours did not drop at all: ${pct(score.spUp)} upright against ${pct(score.spInv)} inverted. That is unusual and it is worth running again, because with twelve trials a cell one lucky streak looks exactly like this.`}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>{score.pFt < 0.05 ? '📉' : '🧱'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">
                      {score.ftDrop > 0.02 ? 'Features took a hit too.' : 'Features held.'}
                    </span>{' '}
                    {pct(score.ftUp)} upright, {pct(score.ftInv)} inverted ({pText(score.pFt)}). A part is
                    a part whichever way round it is, and this is the control that makes the other number
                    mean something: it is the same faces, the same second, the same flip.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>{score.matched ? '⚖️' : '⚠️'}</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">
                      {score.matched ? 'The two upright cells were matched.' : 'The two upright cells were not matched.'}
                    </span>{' '}
                    {pct(score.spUp)} against {pct(score.ftUp)}, a gap of{' '}
                    {Math.abs(Math.round((score.spUp - score.ftUp) * 100))} points.{' '}
                    {score.matched
                      ? 'That matters, because a selective loss is only interesting if both jobs started out about as hard as each other. Yours did.'
                      : 'Which means the interaction above is not interpretable for this run. When one condition starts near the ceiling and the other near the floor, a difference in how much they fall is arithmetic rather than psychology. Run it again; the sizes of the changes are fixed but which sub-kind comes up is not.'}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>🎚️</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">You were not just pressing different.</span> On the
                    trials that were genuinely identical you called them different{' '}
                    {pct(score.faUp)} of the time upright and {pct(score.faInv)} of the time inverted.
                    That is the receipt: the score above is balanced accuracy, so a habit of one button
                    is subtracted rather than rewarded.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span>⏱️</span>
                  <span className="text-slate-300">
                    <span className="text-slate-100">And it cost you time.</span> Median answer:{' '}
                    {Math.round(score.rt.spUp)} ms upright and {Math.round(score.rt.spInv)} ms inverted on
                    spacing, {Math.round(score.rt.ftUp)} ms and {Math.round(score.rt.ftInv)} ms on
                    features. Nothing on this page is scored on speed, which is exactly why it is worth
                    looking at.
                  </span>
                </div>
              </div>
            </div>

            {/* breakdown */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-500">
                by the change you were asked to catch
              </div>
              <div className="space-y-2">
                {[...score.spacingVars.map((v) => ({ ...v, fam: 'spacing' })), ...score.featureVars.map((v) => ({ ...v, fam: 'feature' }))].map(
                  (v) => (
                    <div key={v.variant} className="flex items-center gap-3 font-mono text-xs">
                      <span className={`w-24 shrink-0 ${v.fam === 'spacing' ? 'text-cyan-300/80' : 'text-violet-300/80'}`}>
                        {v.variant}
                      </span>
                      <span className="w-16 text-slate-400">{v.up === null ? '—' : pct(v.up)} up</span>
                      <span className="w-20 text-slate-500">{v.inv === null ? '—' : pct(v.inv)} inv</span>
                      <span className="flex-1">
                        <span className="block h-1.5 rounded bg-slate-800">
                          <span
                            className={`block h-full rounded ${v.fam === 'spacing' ? 'bg-cyan-400/60' : 'bg-violet-400/60'}`}
                            style={{ width: `${Math.max(0, Math.min(1, v.inv ?? 0)) * 100}%` }}
                          />
                        </span>
                      </span>
                    </div>
                  )
                )}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                Raw accuracy on the trials that really were different, split by which sub-kind of change
                came up. Small numbers of trials each, so this panel is a texture, not a result.
              </p>
            </div>

            {/* share */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCopy}
                className="rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied' : '📋 copy the result'}
              </button>
              <button
                onClick={() => {
                  clearTimers();
                  setPhase('intro');
                  setView('blank');
                  setRecs([]);
                  setTrials([]);
                  setTIdx(0);
                }}
                className="rounded-md border border-slate-600 bg-slate-800/50 py-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-400/50"
              >
                ↻ run it again
              </button>
            </div>

            <WhatYouMissed />
            <Thatcher />

            {/* the argument */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">
                the argument this page cannot settle
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-slate-500">
                <p>
                  <span className="text-slate-400">A switch, not a dial.</span> Tanaka and Farah in 1993
                  showed that an upright face part is easier to recognise inside its own face than alone,
                  and that the advantage vanishes when the face is inverted. Young, Hellawell and Hay in
                  1987 stuck the top half of one famous face to the bottom half of another and found the
                  two halves fused into a new person, upright only. Rossion&apos;s 2008 reading is that
                  inversion does not degrade face perception, it switches it off and leaves you doing
                  something else: parts, one at a time, like any other object.
                </p>
                <p>
                  <span className="text-slate-400">A dial, not a switch.</span> Sekuler, Gaspar, Gold and
                  Bennett measured in 2004 which parts of the image observers actually used, and reported
                  that inverted faces are processed with the same information and the same strategy,
                  merely less efficiently. On that account there is no special module to turn off, just an
                  enormous amount of practice in one orientation. Diamond and Carey argued the same in
                  1986 from dog experts, and Gauthier from bird experts, car experts and invented
                  creatures called greebles.
                </p>
                <p>
                  Your four numbers are consistent with both, and a page that told you otherwise would be
                  lying to you. What is not in dispute is the size of the thing: Yin&apos;s effect has
                  replicated for fifty seven years, and it is the reason Kanwisher went looking in 1997
                  and found a patch of cortex that answers to faces and mostly ignores everything else.
                </p>
              </div>
            </div>

            {/* caveats */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">what this is not</div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-500">
                <li>
                  <span className="text-slate-400">Twelve trials a cell is a demonstration.</span> The
                  studies this is built from run dozens per condition per person. At this length one
                  lapse of attention moves a cell by eight points.
                </li>
                <li>
                  <span className="text-slate-400">These are drawings, not photographs.</span> A cartoon
                  face gets a weaker inversion effect than a real one, because a lot of what the face
                  system uses is shading, texture and three dimensional shape that a few hundred lines of
                  drawing code does not have. Everything here is an underestimate.
                </li>
                <li>
                  <span className="text-slate-400">The correct rejection half is shared.</span> A trial
                  where both faces are identical is the same trial in both conditions; only the
                  &quot;different&quot; trials carry a spacing or a feature change. The cells are labelled
                  so the counts balance, and the effect, if you have one, lives in the half that really
                  differs.
                </li>
                <li>
                  <span className="text-slate-400">Matched difficulty is the hard part.</span> How big a
                  spacing change is &quot;equivalent&quot; to how big a feature change is a real unsolved
                  question in this literature, not a detail. The page prints both upright cells so you can
                  see the answer for your own run instead of trusting mine.
                </li>
                <li>
                  <span className="text-slate-400">This is not a face-blindness test.</span>{' '}
                  Prosopagnosia is diagnosed with instruments like the Cambridge Face Memory Test, over
                  many more trials, against population norms. A low score here means a small screen, a
                  hard second, or a bad night.
                </li>
                <li>
                  <span className="text-slate-400">Nothing left your browser.</span> Every face on this
                  page was generated on your machine, drawn once, and forgotten. There is no server here.
                </li>
              </ul>
            </div>

            {/* siblings */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">the rest of the lab</div>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Most of the lab measures general machinery. <span className="text-slate-400">The Gist</span>{' '}
                found an average that outlived every item in it.{' '}
                <span className="text-slate-400">The Long Way Around</span> caught you rotating a shape in
                your head and charged you by the degree. This one is the odd sibling: it goes after a
                specialist, one that only works on one category of thing, and it finds the specialist by
                turning the thing over until it leaves the room.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a href="/experiments/long-way-around" className="text-cyan-400/80 hover:text-cyan-300">
                  The Long Way Around
                </a>
                <a href="/experiments/the-gist" className="text-cyan-400/80 hover:text-cyan-300">
                  The Gist
                </a>
                <a href="/experiments/crowding-zone" className="text-cyan-400/80 hover:text-cyan-300">
                  The Crowding Zone
                </a>
                <a href="/experiments/narrower-than-it-was" className="text-cyan-400/80 hover:text-cyan-300">
                  Narrower Than It Was
                </a>
                <a href="/experiments/change-blindness" className="text-cyan-400/80 hover:text-cyan-300">
                  Change Blindness
                </a>
                <a href="/experiments/which-way-is-up" className="text-cyan-400/80 hover:text-cyan-300">
                  Which Way Is Up
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <a href="/experiments" className="font-mono text-xs text-cyan-400/70 hover:text-cyan-300">
                ← back to all experiments
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- what you missed ------------------------------------------------------
//
// The payoff panel. A spacing pair with no time limit, which you can flip. Upright it is obvious.
// Inverted it is two faces. Nothing changes between those two states except the angle.

function WhatYouMissed() {
  const [pair, setPair] = useState<Trial | null>(null);
  const [flipped, setFlipped] = useState(true);

  useEffect(() => {
    setPair(buildTrial('spacing', 'upright', 'different'));
  }, []);

  const shown = useMemo(() => (pair ? { ...pair, ori: (flipped ? 'inverted' : 'upright') as Ori } : null), [pair, flipped]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-slate-500">what you missed</div>
      <p className="mb-3 text-xs leading-relaxed text-slate-500">
        One spacing pair, no time limit, no mask. Study it upside down for as long as you like, then turn
        it over. The change does not appear when you flip it. It was there the whole time.
      </p>
      <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
        <PairCanvas trial={shown} view="faces" height={280} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="rounded-md border border-cyan-400/50 bg-cyan-400/10 py-2 font-mono text-xs text-cyan-200 hover:bg-cyan-400/20"
        >
          {flipped ? 'turn it the right way up →' : '↩ turn it back over'}
        </button>
        <button
          onClick={() => {
            setPair(buildTrial('spacing', 'upright', 'different'));
            setFlipped(true);
          }}
          className="rounded-md border border-slate-700 bg-slate-900/60 py-2 font-mono text-xs text-slate-400 hover:border-slate-600"
        >
          ↻ another pair
        </button>
      </div>
      <p className="mt-3 font-mono text-[11px] text-slate-600">
        {pair?.variant ? `the change: ${pair.variant} · on the ${pair.changedSide === 0 ? 'left' : 'right'}` : ''}
      </p>
    </div>
  );
}

// ---- the Thatcher playground ---------------------------------------------

function Thatcher() {
  const [angle, setAngle] = useState(180);
  const [face, setFace] = useState<Face | null>(null);
  const [compare, setCompare] = useState(false);
  const [turned, setTurned] = useState<number | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setFace(makeFace());
  }, []);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || !face) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth;
    const h = 300;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, w, h);

    const rad = (angle * Math.PI) / 180;
    if (compare) {
      const scale = Math.min(w / 460, (h * 0.84) / 200);
      const slots: Array<[number, boolean]> = [
        [w * 0.27, false],
        [w * 0.73, true],
      ];
      for (const [cx, th] of slots) {
        ctx.save();
        ctx.translate(cx, h / 2);
        ctx.scale(scale, scale);
        ctx.rotate(rad);
        drawFace(ctx, face, { thatcher: th });
        ctx.restore();
      }
    } else {
      const scale = Math.min(w / 260, (h * 0.86) / 200);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.rotate(rad);
      drawFace(ctx, face, { thatcher: true });
      ctx.restore();
    }
  }, [angle, face, compare]);

  return (
    <div className="rounded-lg border border-violet-500/25 bg-violet-500/[0.04] p-5">
      <div className="mb-2 font-mono text-xs uppercase tracking-wider text-violet-300/80">
        the playground · Thompson 1980
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        This face has had its eyes and its mouth flipped in place. Nothing else was touched, no part was
        moved, no part was replaced. Upside down it reads as an ordinary face. Drag it upright and watch
        what happens. This is the Thatcher illusion, and it is the same finding as your score: upside
        down there is nothing running that would notice.
      </p>
      <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
        <canvas ref={ref} style={{ width: '100%', height: 300, display: 'block' }} />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 font-mono text-[11px] text-slate-500">upside down</span>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={180 - angle}
            onChange={(e) => setAngle(180 - Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded bg-slate-700 accent-violet-400"
          />
          <span className="w-20 shrink-0 text-right font-mono text-[11px] text-slate-500">right way up</span>
        </div>
        <div className="text-center font-mono text-xs text-slate-500">{angle}° from upright</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTurned(angle)}
            className="rounded-md border border-violet-400/50 bg-violet-400/10 py-2 font-mono text-xs text-violet-200 hover:bg-violet-400/20"
          >
            it turned here
          </button>
          <button
            onClick={() => setCompare((c) => !c)}
            className="rounded-md border border-slate-700 bg-slate-900/60 py-2 font-mono text-xs text-slate-400 hover:border-slate-600"
          >
            {compare ? 'just the thatcherised one' : 'show the untouched face too'}
          </button>
        </div>
        {turned !== null && (
          <p className="text-center text-xs leading-relaxed text-slate-400">
            You called it at <span className="font-mono text-violet-300">{turned}°</span> from upright.
            Stürzel and Spillmann put the switch somewhere between ninety and a hundred and twenty
            degrees in 2000, which is roughly where a face stops being processed as a configuration and
            starts being processed as a collection of parts. Nothing about the picture changes at that
            angle. You do.
          </p>
        )}
        <button
          onClick={() => {
            setFace(makeFace());
            setAngle(180);
            setTurned(null);
          }}
          className="w-full rounded-md border border-slate-800 bg-slate-900/40 py-2 font-mono text-[11px] text-slate-500 hover:border-slate-700"
        >
          ↻ a different face
        </button>
      </div>
    </div>
  );
}
