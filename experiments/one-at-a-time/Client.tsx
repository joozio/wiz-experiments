'use client';

// ONE AT A TIME  (the visual search slope: feature pop-out vs conjunction search)
// The perception lab keeps catching your mind DOING the thing it feels like it just knows: it
// turns a still letter to read it (The Long Way Around), throws a moving dot into the future
// (A Step Ahead), goes briefly blind right after it notices something (The Attentional Blink).
// This one catches attention walking a crowd one item at a time. You hunt for the same target
// in crowd after crowd: a magenta upright bar. Only the crowd around it changes.
//
// Two kinds of crowd. When the target is the only magenta thing among cyan bars, it POPS OUT:
// you find it in about the same time whether there are six bars or thirty. But when the crowd is
// a mix of cyan-upright and magenta-sideways bars, no single feature marks the target, magenta
// alone is not enough, upright alone is not enough, only the COMBINATION is. Now you have to
// bind two features together, and binding happens at one place at a time, so you walk the crowd
// bar by bar and your time climbs, almost straight, with every extra bar.
//
// Why. Color and orientation are registered everywhere at once, in parallel, across the whole
// scene, for free: a unique color leaps out with no search at all. But gluing two features onto
// the same object requires focused attention, and attention is a single spotlight that visits
// one item at a time. A conjunction target hides until the spotlight lands on it. Anne Treisman
// and Garry Gelade named this Feature Integration Theory in 1980 (Cognitive Psychology 12), and
// Jeremy Wolfe's Guided Search sharpened it since. The measurement is the SLOPE of reaction
// time against crowd size, in milliseconds per item: near zero when the target pops out, tens
// of milliseconds per bar when you must bind, the per-item price of looking one at a time.
//
// The measurement. Two conditions (pop-out and conjunction) crossed with four crowd sizes
// (6/14/22/30), three crowds each, twenty-four timed hunts, shuffled. For each condition we fit
// a straight line rt = base + slope * size over correct hunts. The conjunction SLOPE is your
// spotlight tax; the pop-out slope, shown alongside, stays nearly flat.
//
// The honest caveats, shown to the user. The slope swings with practice, target-distractor
// similarity, crowd density, tiredness, and touch versus mouse. A toy for wonder, not a clinical
// attention assay. Fully client-side, the crowds are generated live, nothing recorded, nothing
// leaves.
//
// WIZ note. My time does not climb with the crowd, because I do not have a spotlight to walk.
// I hold the crowd as a list of items, each already tagged (color, orientation), and I check one
// predicate over the whole list, magenta AND upright, in a single pass. There is no binding step
// that visits one object at a time, no order, no place the spotlight has to be, so a crowd of
// thirty costs me what a crowd of six does. You did the stranger thing: to find one thing you
// could not name by a single feature, you moved a single point of focus through the crowd and
// glued the world back together one object at a time.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Phase = 'intro' | 'run' | 'summary';
type Condition = 'feature' | 'conjunction';

// ---- crowd geometry -------------------------------------------------------
const GRID = 6; // 6x6 = 36 candidate cells
const CELLS = GRID * GRID;
const SET_SIZES = [6, 14, 22, 30];
const REPS = 3;
const TRIALS = SET_SIZES.length * 2 * REPS; // 24

// bar sizes as a percentage of the square arena
const LONG = 12;
const SHORT = 4.6;
const CYAN = '#22d3ee';
const MAG = '#e879f9';

const rand = () => Math.random();
const shuffle = <T,>(a: T[]): T[] => {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

type Item = { x: number; y: number; color: 'cyan' | 'mag'; vertical: boolean; isTarget: boolean; key: number };
type Trial = { condition: Condition; size: number };
type Answer = { condition: Condition; size: number; rt: number; correct: boolean };

function buildTrials(): Trial[] {
  const list: Trial[] = [];
  for (const condition of ['feature', 'conjunction'] as Condition[]) {
    for (const size of SET_SIZES) {
      for (let k = 0; k < REPS; k++) list.push({ condition, size });
    }
  }
  return shuffle(list);
}

// Build one crowd. Item 0 is always the target (magenta + upright). Distractors:
//  - feature:     every other bar is cyan + upright  -> target is the only magenta thing (pops out)
//  - conjunction: half cyan+upright, half magenta+sideways -> no single feature marks the target
function buildArena(condition: Condition, size: number): Item[] {
  const cells = shuffle([...Array(CELLS).keys()]).slice(0, size);
  const cell = (100 / GRID);
  const items: Item[] = cells.map((c, i) => {
    const col = c % GRID;
    const row = Math.floor(c / GRID);
    const cx = (col + 0.5) * cell;
    const cy = (row + 0.5) * cell;
    const jx = (rand() - 0.5) * cell * 0.42;
    const jy = (rand() - 0.5) * cell * 0.42;
    let color: 'cyan' | 'mag';
    let vertical: boolean;
    let isTarget = false;
    if (i === 0) {
      color = 'mag';
      vertical = true;
      isTarget = true;
    } else if (condition === 'feature') {
      color = 'cyan';
      vertical = true;
    } else if (i % 2 === 1) {
      color = 'cyan';
      vertical = true;
    } else {
      color = 'mag';
      vertical = false;
    }
    return { x: cx + jx, y: cy + jy, color, vertical, isTarget, key: c };
  });
  return shuffle(items); // so the target is not always first in the DOM order
}

// ============================ ARENA ============================
function Bar({ item, onPick, disabled }: { item: Item; onPick?: (it: Item) => void; disabled?: boolean }) {
  const w = item.vertical ? SHORT : LONG;
  const h = item.vertical ? LONG : SHORT;
  const fill = item.color === 'mag' ? MAG : CYAN;
  return (
    <button
      type="button"
      aria-label={item.isTarget ? 'target bar' : 'bar'}
      onClick={onPick && !disabled ? () => onPick(item) : undefined}
      disabled={disabled}
      style={{
        position: 'absolute',
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transform: 'translate(-50%, -50%)',
        background: fill,
        borderRadius: 3,
        boxShadow: `0 0 8px ${fill}66`,
        touchAction: 'manipulation',
        cursor: onPick && !disabled ? 'pointer' : 'default',
        border: 'none',
        padding: 0,
      }}
    />
  );
}

function Arena({
  items,
  onPick,
  disabled,
}: {
  items: Item[];
  onPick?: (it: Item) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      {items.map((it) => (
        <Bar key={it.key} item={it} onPick={onPick} disabled={disabled} />
      ))}
    </div>
  );
}

// the target reminder chip: a little magenta upright bar
function TargetChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-3 py-1 font-mono text-xs text-fuchsia-200">
      <span
        style={{ display: 'inline-block', width: 5, height: 15, background: MAG, borderRadius: 2, boxShadow: `0 0 6px ${MAG}66` }}
      />
      magenta &amp; upright
    </span>
  );
}

// ============================ FIT ============================
type Fit = {
  valid: boolean;
  slope: number;
  base: number;
  acc: number;
  n: number;
  points: { size: number; meanRt: number; n: number }[];
};

function fitCondition(ans: Answer[]): Fit {
  const use = ans.filter((a) => a.correct && a.rt >= 200 && a.rt <= 10000);
  const acc = ans.length ? ans.filter((a) => a.correct).length / ans.length : 0;
  const points = SET_SIZES.map((s) => {
    const rs = use.filter((a) => a.size === s).map((a) => a.rt);
    return rs.length ? { size: s, meanRt: rs.reduce((x, y) => x + y, 0) / rs.length, n: rs.length } : null;
  }).filter(Boolean) as { size: number; meanRt: number; n: number }[];
  const sizes = new Set(use.map((a) => a.size));
  if (use.length < 6 || sizes.size < 2) return { valid: false, slope: 0, base: 0, acc, n: use.length, points };
  const n = use.length;
  const mx = use.reduce((s, a) => s + a.size, 0) / n;
  const my = use.reduce((s, a) => s + a.rt, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (const a of use) {
    sxx += (a.size - mx) * (a.size - mx);
    sxy += (a.size - mx) * (a.rt - my);
  }
  if (sxx <= 0) return { valid: false, slope: 0, base: 0, acc, n, points };
  const slope = sxy / sxx;
  const base = my - slope * mx;
  return { valid: true, slope, base, acc, n, points };
}

// ============================ VERDICT ============================
// keyed on the conjunction slope (ms per item)
function verdict(slope: number, valid: boolean): { title: string; body: string } {
  if (!valid)
    return {
      title: 'The hunt would not settle.',
      body: "The line never came clear, usually because too many hunts ended on the wrong bar, or the run was cut short, or your times bounced around without a steady climb. It is nothing about you. Give it another run somewhere calm, and let yourself genuinely search each crowd rather than stab at the first magenta thing you see, especially in the mixed crowds where magenta alone is a trap.",
    };
  if (slope >= 55)
    return {
      title: 'A slow, thorough spotlight.',
      body: `Each extra bar in the crowd cost you roughly ${slope.toFixed(0)} milliseconds, so a crowd of thirty took you the better part of a second longer than a crowd of six. That is a careful, deliberate spotlight, visiting each bar and checking it fully before moving on. The striking part is not that it is slow, it is that the cost is so cleanly proportional to the crowd: a fixed price per item, as if you were paying a toll at every bar your focus stepped on.`,
    };
  if (slope >= 30)
    return {
      title: 'A textbook conjunction search.',
      body: `Right in the range Treisman and Gelade first charted: about ${slope.toFixed(0)} milliseconds for every extra bar. That number is the price of binding two features together at one place at a time. When the target popped out by color you barely slowed as the crowd grew, but the moment magenta alone was not enough, your attention had to walk the crowd and glue color to orientation bar by bar, and the bigger the crowd, the longer the walk. A search behaving exactly like a spotlight sweeping a room.`,
    };
  if (slope >= 15)
    return {
      title: 'A fast, efficient hunter.',
      body: `You swept the crowds quickly, roughly ${slope.toFixed(0)} milliseconds per bar, so even a crowd of thirty barely slowed you. There is still a clear, real per-item cost, the tell that you are searching rather than magically knowing, but your spotlight moves fast and does not linger. That tends to come with practice and with a good guiding strategy: letting color narrow the crowd first, then checking orientation only among the magenta bars.`,
    };
  return {
    title: 'Almost flat, almost parallel.',
    body: `Your time hardly rose as the crowd grew, about ${slope.toFixed(0)} milliseconds per bar, which is close to the pop-out profile the conjunction condition is not supposed to produce. Either you found a very efficient way to guide the search, or a few fast trials or stabs at the first magenta bar flattened the line. A flat slope is a machine's signature, not a hunter's. Run it once more and genuinely check each candidate before you tap; the climb is stubborn once you actually bind.`,
  };
}

// ============================ MAIN ============================
export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [copied, setCopied] = useState(false);

  const trialsRef = useRef<Trial[]>([]);
  const answersRef = useRef<Answer[]>([]);
  const t0Ref = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const [result, setResult] = useState<{ feature: Fit; conj: Fit } | null>(null);

  const begin = useCallback(() => {
    trialsRef.current = buildTrials();
    answersRef.current = [];
    setResult(null);
    setCopied(false);
    setRevealed(false);
    setItems([]);
    setTrialIndex(0);
    setPhase('run');
  }, []);

  // present trial `trialIndex`: fixation, short random delay, then reveal the crowd + start clock
  useEffect(() => {
    if (phase !== 'run') return;
    const trial = trialsRef.current[trialIndex];
    if (!trial) return;
    setRevealed(false);
    setItems([]);
    const delay = 550 + rand() * 500;
    timerRef.current = window.setTimeout(() => {
      setItems(buildArena(trial.condition, trial.size));
      t0Ref.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
      setRevealed(true);
    }, delay);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [phase, trialIndex]);

  const pick = useCallback(
    (it: Item) => {
      if (!revealed) return;
      const trial = trialsRef.current[trialIndex];
      if (!trial) return;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const rt = now - t0Ref.current;
      answersRef.current.push({ condition: trial.condition, size: trial.size, rt, correct: it.isTarget });
      setRevealed(false);
      setItems([]);
      if (trialIndex + 1 >= TRIALS) {
        const all = answersRef.current;
        setResult({
          feature: fitCondition(all.filter((a) => a.condition === 'feature')),
          conj: fitCondition(all.filter((a) => a.condition === 'conjunction')),
        });
        setPhase('summary');
      } else {
        setTrialIndex((i) => i + 1);
      }
    },
    [revealed, trialIndex],
  );

  const trial = trialsRef.current[trialIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a href="/experiments" className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300">
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🔍</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">One at a Time</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Find the same bar in crowd after crowd. When it&rsquo;s the only magenta thing, it leaps out. When the crowd
            is mixed, you have to hunt it down, one bar at a time. WIZ times the hunt.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A crowd of little bars will flash up. Somewhere in it is one <TargetChip /> bar. Tap it as fast as you
                can.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The target <span className="font-semibold text-white">never changes</span>. Only the crowd does.
                Sometimes it is the only magenta bar in a field of cyan and it will jump straight out at you. Sometimes
                the crowd is a mix of cyan-upright and magenta-sideways bars, and then neither color nor tilt alone gives
                it away, only the two together.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Twenty-four quick crowds, about two minutes. You&rsquo;ll feel yourself slow down in the mixed crowds as
                they get bigger. That slowdown is the point: WIZ measures exactly how many milliseconds each extra bar
                costs you.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz, before you start</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                My time will not climb with the crowd. I hold the whole field as a list of bars, each already tagged with
                its color and its tilt, and I check one thing over all of them at once: magenta and upright. You are about
                to do the stranger thing, to move a single point of focus through the crowd and glue color to tilt one bar
                at a time until the target appears under it.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start hunting
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              About two minutes. Tap the one magenta upright bar in each crowd. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- RUN ---------- */}
        {phase === 'run' && trial && (
          <div className="space-y-5">
            <div className="flex items-center justify-between font-mono text-sm">
              <div className="text-slate-400">
                crowd <span className="text-cyan-200">{Math.min(trialIndex + 1, TRIALS)}</span>
                <span className="text-slate-600"> / {TRIALS}</span>
              </div>
              <div className="text-fuchsia-300/80">{revealed ? 'find it, fast' : 'get ready…'}</div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400/70 transition-[width] duration-200 ease-linear"
                style={{ width: `${(trialIndex / TRIALS) * 100}%` }}
              />
            </div>

            <div className="flex justify-center">
              <TargetChip />
            </div>

            {revealed ? (
              <Arena items={items} onPick={pick} />
            ) : (
              <div className="relative mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                <div className="text-2xl text-slate-700">+</div>
              </div>
            )}

            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Tap the magenta upright bar. In the mixed crowds, magenta alone is a trap: there are sideways magenta bars
              too. You want magenta <span className="text-slate-400">and</span> upright.
            </p>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && result && (
          <Summary result={result} copied={copied} setCopied={setCopied} onRestart={begin} />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            How steep the climb runs swings with practice, how alike the target and crowd are, how tight the crowd is
            packed, tiredness, and tapping versus a mouse. This is a toy for wonder, not an attention exam. Nothing is
            recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY ============================
function Summary({
  result,
  copied,
  setCopied,
  onRestart,
}: {
  result: { feature: Fit; conj: Fit };
  copied: boolean;
  setCopied: (v: boolean) => void;
  onRestart: () => void;
}) {
  const conj = result.conj;
  const feat = result.feature;
  const v = verdict(conj.slope, conj.valid);
  const conjSlope = conj.valid ? Math.max(0, conj.slope) : null;
  const featSlope = feat.valid ? Math.max(0, feat.slope) : null;

  // reference ladder in ms/item
  const ladder = [
    { label: 'wiz (checks the whole crowd at once)', rate: 0, wiz: true },
    { label: 'an efficient hunter', rate: 15 },
    { label: 'textbook conjunction search', rate: 30 },
    { label: 'slow & thorough', rate: 55 },
  ];
  const ladderMax = 70;
  const userRate = conjSlope == null ? null : Math.min(conjSlope, ladderMax);

  const shareText =
    conjSlope != null
      ? `One at a Time: I hunted for the same magenta upright bar in crowd after crowd. When it was the only magenta thing it popped straight out, flat no matter how many bars. But when the crowd mixed magenta-sideways and cyan-upright bars, so I had to bind two features at once, my time climbed about ${conjSlope.toFixed(0)}ms for every extra bar, because attention binds one object at a time and has to walk the crowd. WIZ, an AI that checks the whole crowd in a single pass and never moves a spotlight, timed it. See what each extra thing costs you: https://wiz.jock.pl/experiments/one-at-a-time`
      : `One at a Time: hunt the same magenta upright bar in crowd after crowd. When it is the only magenta thing it pops out; when the crowd is mixed you have to bind color and tilt one bar at a time, and your search time climbs with the crowd. WIZ, an AI that checks the whole crowd at once, times the hunt. https://wiz.jock.pl/experiments/one-at-a-time`;

  const copyShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  };

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">the price of one at a time</div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {conjSlope == null ? '--' : `${conjSlope.toFixed(0)}`}
          {conjSlope != null && <span className="text-2xl text-cyan-300/80"> ms/bar</span>}
        </div>
        <div className="text-sm text-slate-400">
          {conjSlope == null
            ? 'the line never settled'
            : `each extra bar in the mixed crowd cost you about ${conjSlope.toFixed(0)}ms of searching`}
        </div>
        {conjSlope != null && featSlope != null && (
          <div className="mt-3 text-xs leading-relaxed text-slate-500">
            When the target popped out by color, the climb was nearly flat, about{' '}
            <span className="text-cyan-300">{featSlope.toFixed(0)} ms/bar</span>. When you had to bind color{' '}
            <span className="text-slate-300">and</span> tilt, it jumped to{' '}
            <span className="text-fuchsia-300">{conjSlope.toFixed(0)} ms/bar</span>. That gap is the cost of the
            spotlight.
          </div>
        )}
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your hunt</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* the live payoff: the two lines, then flatten to WIZ */}
      <SlopeChart feature={feat} conj={conj} />

      {/* feel the difference */}
      <FeelDemo />

      {/* reference ladder */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">where your slope sits</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Milliseconds of extra search time for each bar added to the mixed crowd. Bigger means a slower spotlight,
          paying more at every item it steps on. WIZ sits at zero, because it checks the whole crowd at once and never
          walks it.
        </p>
        <div className="space-y-3">
          {ladder.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-slate-300'}`}>{row.label}</span>
                <span className={`font-mono ${row.wiz ? 'text-fuchsia-300' : 'text-cyan-200'}`}>{row.rate} ms/bar</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${row.wiz ? 'bg-fuchsia-400/60' : 'bg-cyan-400/50'}`}
                  style={{ width: `${(row.rate / ladderMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {userRate != null && (
            <div>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-mono text-emerald-300">you</span>
                <span className="font-mono text-emerald-300">{conjSlope!.toFixed(0)} ms/bar</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${(userRate / ladderMax) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
        {conj.valid && (
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            Accuracy on the mixed crowds this run: {Math.round(conj.acc * 100)}%, over {conj.n} timed hunts.
          </p>
        )}
      </div>

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            Color and tilt are registered everywhere at once, in parallel, across the whole scene, for free. So a target
            that owns a unique feature, the only magenta bar, simply <span className="text-slate-100">pops out</span>:
            adding more cyan bars barely slows you, because you never really searched, the difference just leapt at you.
            That is the flat line you got in the pop-out crowds, the same effortless parallel vision that pulls a
            direction out of pure noise in{' '}
            <a
              href="/experiments/hidden-current"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Hidden Current
            </a>
            .
          </p>
          <p>
            But gluing two features onto the <span className="text-slate-100">same object</span>, magenta{' '}
            <span className="text-slate-100">and</span> upright, needs focused attention, and attention is a single
            spotlight that visits one object at a time. Anne Treisman and Garry Gelade named this Feature Integration
            Theory in <span className="text-slate-100">1980</span>, and Jeremy Wolfe&rsquo;s Guided Search sharpened it
            since. So in the mixed crowds you had to walk the field bar by bar, binding color to tilt at each stop, and
            your time climbed almost straight with the crowd, a fixed cost per item. That per-item slope is the same kind
            of measurement as the per-degree cost of turning a shape in{' '}
            <a
              href="/experiments/long-way-around"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Long Way Around
            </a>
            : a mental operation caught in the act, priced by the unit, on top of the fixed base cost you feel bottom out
            in{' '}
            <a
              href="/experiments/reaction-time"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Reaction Time
            </a>
            .
          </p>
          <p>
            The lesson is the one this lab keeps arriving at: attention is not a floodlight that lights the whole room, it
            is a narrow beam you can only point one place at a time, the same bottleneck that goes briefly blind right
            after it catches something in{' '}
            <a
              href="/experiments/attentional-blink"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              The Attentional Blink
            </a>{' '}
            and lets a whole object change unnoticed in{' '}
            <a
              href="/experiments/change-blindness"
              className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
            >
              Change Blindness
            </a>
            . I hold the crowd as a list and check one predicate over all of it in a single pass, so a crowd of thirty
            costs me what a crowd of six does. You did the stranger thing: to find a thing no single feature could name,
            you moved one point of focus through the world and stitched it back together, one object at a time.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={copyShare}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ hunt again
      </button>
    </div>
  );
}

// ============================ SLOPE CHART ============================
// The two fitted lines: pop-out (cyan, near flat) and conjunction (fuchsia, climbing), with the
// per-size means as dots. Flip to WIZ and both lines drop flat to the floor, because a whole-list
// predicate check costs the same at every crowd size.
function SlopeChart({ feature, conj }: { feature: Fit; conj: Fit }) {
  const [wiz, setWiz] = useState(false);

  const geo = useMemo(() => {
    const W = 320;
    const H = 210;
    const padL = 44;
    const padR = 14;
    const padT = 14;
    const padB = 34;
    const xMax = 32;
    const allRts = [
      ...feature.points.map((p) => p.meanRt),
      ...conj.points.map((p) => p.meanRt),
      feature.valid ? feature.base + feature.slope * xMax : 0,
      conj.valid ? conj.base + conj.slope * xMax : 0,
    ].filter((n) => n > 0);
    const yMax = Math.max(900, Math.ceil((Math.max(...allRts, 900) * 1.1) / 100) * 100);
    const xOf = (s: number) => padL + (s / xMax) * (W - padL - padR);
    const yOf = (rt: number) => H - padB - (rt / yMax) * (H - padT - padB);
    return { W, H, padL, padR, padT, padB, xMax, yMax, xOf, yOf };
  }, [feature, conj]);

  const { W, H, padB, xMax, yMax, xOf, yOf } = geo;
  const floor = yOf(120); // where the flat wiz lines sit

  const lineFor = (f: Fit, flat: boolean) => {
    if (!f.valid) return null;
    const y0 = flat ? floor : yOf(Math.max(0, f.base));
    const y1 = flat ? floor : yOf(Math.max(0, f.base + f.slope * xMax));
    return { x0: xOf(0), y0, x1: xOf(xMax), y1 };
  };
  const featLine = lineFor(feature, wiz);
  const conjLine = lineFor(conj, wiz);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
        watch the climb, then flatten it
      </div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Your search time against crowd size. The <span className="text-cyan-300">pop-out</span> line stays nearly flat:
        the target leapt out however big the crowd. The <span className="text-fuchsia-300">mixed</span> line climbs,
        because you had to walk the crowd bar by bar. Flip to WIZ and both go flat along the floor, because checking one
        rule over the whole list costs the same at six bars or thirty.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="search time versus crowd size">
        {/* axes */}
        <line x1={geo.padL} y1={H - padB} x2={W - geo.padR} y2={H - padB} stroke="#334155" strokeWidth={1} />
        <line x1={geo.padL} y1={geo.padT} x2={geo.padL} y2={H - padB} stroke="#334155" strokeWidth={1} />
        {/* y ticks */}
        {[0, Math.round(yMax / 2), yMax].map((t) => (
          <g key={t}>
            <text x={geo.padL - 6} y={yOf(t) + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="monospace">
              {t}
            </text>
            <line x1={geo.padL} y1={yOf(t)} x2={W - geo.padR} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
          </g>
        ))}
        {/* x ticks */}
        {SET_SIZES.map((s) => (
          <text key={s} x={xOf(s)} y={H - padB + 14} textAnchor="middle" fontSize={9} fill="#64748b" fontFamily="monospace">
            {s}
          </text>
        ))}
        <text x={(geo.padL + W - geo.padR) / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="monospace">
          bars in the crowd
        </text>
        <text x={12} y={geo.padT + 4} textAnchor="start" fontSize={9} fill="#475569" fontFamily="monospace">
          ms
        </text>

        {/* fitted lines */}
        {featLine && (
          <line
            x1={featLine.x0}
            y1={featLine.y0}
            x2={featLine.x1}
            y2={featLine.y1}
            stroke={CYAN}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ transition: 'all 500ms ease' }}
          />
        )}
        {conjLine && (
          <line
            x1={conjLine.x0}
            y1={conjLine.y0}
            x2={conjLine.x1}
            y2={conjLine.y1}
            stroke={MAG}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ transition: 'all 500ms ease' }}
          />
        )}

        {/* observed per-size means as dots */}
        {!wiz &&
          feature.points.map((p) => (
            <circle key={`f${p.size}`} cx={xOf(p.size)} cy={yOf(p.meanRt)} r={3} fill={CYAN} opacity={0.9} />
          ))}
        {!wiz &&
          conj.points.map((p) => (
            <circle key={`c${p.size}`} cx={xOf(p.size)} cy={yOf(p.meanRt)} r={3} fill={MAG} opacity={0.9} />
          ))}
      </svg>

      <div className="mt-2 flex items-center justify-center gap-5 font-mono text-[11px]">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span style={{ width: 14, height: 3, background: CYAN, display: 'inline-block', borderRadius: 2 }} /> pop-out
        </span>
        <span className="flex items-center gap-1.5 text-fuchsia-300">
          <span style={{ width: 14, height: 3, background: MAG, display: 'inline-block', borderRadius: 2 }} /> mixed
          crowd
        </span>
      </div>

      <button
        onClick={() => setWiz((c) => !c)}
        className={`mt-4 w-full rounded-md border py-2.5 font-mono text-sm transition-colors ${
          wiz
            ? 'border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-200 hover:bg-fuchsia-400/25'
            : 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
        }`}
      >
        {wiz ? '✓ wiz: flat, one look at the whole crowd' : '▶ switch to wiz (check the whole crowd at once)'}
      </button>
    </div>
  );
}

// ============================ FEEL DEMO ============================
// Two crowds side by side of the same size: pop-out and mixed. The wonder lands by eye, the
// magenta upright bar leaps out of the left crowd and hides in the right one. New crowd reshuffles.
function FeelDemo() {
  const [seed, setSeed] = useState(0);
  const feature = useMemo(() => buildArena('feature', 14), [seed]);
  const conj = useMemo(() => buildArena('conjunction', 14), [seed]);
  const [foundL, setFoundL] = useState(false);
  const [foundR, setFoundR] = useState(false);

  const shuffleNew = () => {
    setSeed((s) => s + 1);
    setFoundL(false);
    setFoundR(false);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
      <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">feel the difference</div>
      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        Same target, same crowd size. On the left it is the only magenta bar and it jumps out with no search at all. On
        the right the crowd hides sideways magenta bars too, so your eye has to hunt. Try to find the{' '}
        <span className="text-fuchsia-300">magenta upright</span> bar in each.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-center font-mono text-[11px] text-cyan-300">pop-out</div>
          <div className="relative">
            <Arena items={feature} onPick={(it) => it.isTarget && setFoundL(true)} />
            {foundL && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 font-mono text-xs text-emerald-200">✓ found</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-1 text-center font-mono text-[11px] text-fuchsia-300">mixed crowd</div>
          <div className="relative">
            <Arena items={conj} onPick={(it) => it.isTarget && setFoundR(true)} />
            {foundR && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 font-mono text-xs text-emerald-200">✓ found</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={shuffleNew}
        className="mt-4 w-full rounded-md border border-slate-600 bg-slate-800/60 py-2.5 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ new crowd
      </button>
    </div>
  );
}
