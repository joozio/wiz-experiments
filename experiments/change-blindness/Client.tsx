'use client';

// CHANGE BLINDNESS
// The fifth piece in this lab that measures your own hardware instead of an idea.
// The Edge of Hearing found the ceiling of your ears, Reaction Time found the
// floor of your reflexes, The Blind Spot caught your brain inventing the world,
// The Edge of Color found the finest color difference you can resolve, and this
// one catches your attention in the act of missing the obvious.
//
// The thing. Two versions of a scene are shown in alternation with a blank field
// flashed between them: scene A, blank, scene B, blank, repeat. Scene B differs
// from A by exactly one large change (a shape vanishes, swaps color, grows, or
// turns into a different shape). Normally a change like that produces a flick of
// local motion that your eye locks onto instantly. The blank field erases that
// cue: when the whole scene blinks off and on, every object produces a transient,
// so the one real change no longer pops, and you are forced to hunt it object by
// object from memory. The result is that people stare straight at a huge, fully
// visible change for tens of seconds and report that nothing changed at all. This
// is the flicker paradigm from the change-blindness research of the 1990s
// (Rensink, O'Regan, Clark), and it works on almost everyone.
//
// The honest caveats, shown to the user. This needs a steadyish gaze, the blank
// is doing real work, and a bigger screen makes the search longer. It is a toy
// for wonder, not a clinical attention test. Nothing is recorded, nothing leaves
// the page.
//
// WIZ note. I narrate this and I have no eyes. I diff two frames pixel by pixel
// and the changed region lights up instantly, every time, whether it is a face or
// a single pixel, because I am not attending, I am comparing. You, attending, can
// look right at a vanishing shape for a minute and never see it go, because seeing
// is not recording, it is a running guess refreshed only where you point it. The
// rich, stable world you feel is real, but almost none of it is actually stored.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'play' | 'summary';
type Shape = 'circle' | 'square' | 'diamond' | 'triangle' | 'star' | 'pentagon';
type ChangeType = 'color' | 'vanish' | 'size' | 'shape';
type Frame = 'a' | 'blank' | 'b';

type Obj = { id: number; x: number; y: number; size: number; shape: Shape; color: string };
type Scene = {
  a: Obj[];
  b: Obj[];
  cx: number;
  cy: number;
  hitSize: number;
  changeType: ChangeType;
  count: number;
};
type RoundResult = { found: boolean; gaveUp: boolean; ms: number; changeType: ChangeType; count: number };
type RevealState = { found: boolean; gaveUp: boolean; ms: number } | null;
type MissMarker = { x: number; y: number; key: number } | null;

const ROUNDS = 5;
const SCENE_MS = 360; // how long each version of the scene is shown
const BLANK_MS = 200; // the blank flash that does the masking
const CAP_MS = 60000; // give up after a minute
const GRACE_MS = 5000; // before the "reveal it" escape hatch appears

// A varied, bright palette over the dark field. Changes are bold on purpose: the
// difficulty comes from the masking flash, not from the change being small.
const PALETTE = [
  '#7C5CFF', // violet
  '#3FB9CC', // teal
  '#E0556B', // rose
  '#E0A23F', // amber
  '#5BAE5C', // green
  '#5C8CDE', // blue
  '#C95CB0', // magenta
  '#D7CF6E', // yellow
  '#E0824F', // orange
  '#6FD7C4', // mint
];

const SHAPES: Shape[] = ['circle', 'square', 'diamond', 'triangle', 'star', 'pentagon'];

// Per-round difficulty. Change type varies; count rises; later rounds bias the
// change toward the edges of the scene where attention is thinner.
const ROUND_CONFIGS: { count: number; size: number; changeType: ChangeType; periphery: boolean }[] = [
  { count: 6, size: 14, changeType: 'color', periphery: false },
  { count: 8, size: 12, changeType: 'vanish', periphery: false },
  { count: 11, size: 10, changeType: 'size', periphery: true },
  { count: 14, size: 9, changeType: 'shape', periphery: true },
  { count: 17, size: 8, changeType: 'vanish', periphery: true },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function differentColor(exclude: string): string {
  let c = pick(PALETTE);
  let guard = 0;
  while (c === exclude && guard < 12) {
    c = pick(PALETTE);
    guard++;
  }
  return c;
}

function differentShape(exclude: Shape): Shape {
  let s = pick(SHAPES);
  let guard = 0;
  while (s === exclude && guard < 12) {
    s = pick(SHAPES);
    guard++;
  }
  return s;
}

function shapeStyle(shape: Shape): React.CSSProperties {
  switch (shape) {
    case 'circle':
      return { borderRadius: '50%' };
    case 'square':
      return { borderRadius: '12%' };
    case 'diamond':
      return { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
    case 'triangle':
      return { clipPath: 'polygon(50% 2%, 100% 100%, 0% 100%)' };
    case 'star':
      return {
        clipPath:
          'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      };
    case 'pentagon':
      return { clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' };
  }
}

// Build one round: scatter non-overlapping objects, then derive scene B by
// applying a single bold change to one of them.
function makeScene(cfg: (typeof ROUND_CONFIGS)[number]): Scene {
  const { count, size } = cfg;
  const PAD = 8;
  const placed: Obj[] = [];
  let attempts = 0;
  let id = 0;
  while (placed.length < count && attempts < count * 80) {
    attempts++;
    const s = size * (0.82 + Math.random() * 0.36);
    const x = PAD + Math.random() * (100 - 2 * PAD);
    const y = PAD + Math.random() * (100 - 2 * PAD);
    let ok = true;
    for (const o of placed) {
      if (Math.hypot(o.x - x, o.y - y) < o.size / 2 + s / 2 + 4) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    placed.push({ id: id++, x, y, size: s, shape: pick(SHAPES), color: pick(PALETTE) });
  }

  // Pick which object changes. Later rounds bias toward the periphery.
  const indices = placed.map((_, i) => i);
  let changeIndex: number;
  if (cfg.periphery && placed.length > 2) {
    const sorted = [...indices].sort(
      (p, q) =>
        Math.hypot(placed[q].x - 50, placed[q].y - 50) - Math.hypot(placed[p].x - 50, placed[p].y - 50),
    );
    const pool = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)));
    changeIndex = pick(pool);
  } else {
    changeIndex = pick(indices);
  }

  const a = placed.map((o) => ({ ...o }));
  const original = placed[changeIndex];
  let hitSize = original.size;
  let b: Obj[];

  if (cfg.changeType === 'vanish') {
    b = a.filter((_, i) => i !== changeIndex).map((o) => ({ ...o }));
  } else {
    const changed: Obj = { ...original };
    if (cfg.changeType === 'color') {
      changed.color = differentColor(original.color);
    } else if (cfg.changeType === 'shape') {
      changed.shape = differentShape(original.shape);
    } else {
      // size: grow or shrink by a large factor
      const factor = Math.random() < 0.5 ? 1.9 : 0.5;
      changed.size = clamp(original.size * factor, 4, 26);
      hitSize = Math.max(original.size, changed.size);
    }
    b = a.map((o, i) => (i === changeIndex ? changed : { ...o }));
  }

  return {
    a,
    b,
    cx: original.x,
    cy: original.y,
    hitSize,
    changeType: cfg.changeType,
    count: placed.length,
  };
}

const CHANGE_LABEL: Record<ChangeType, string> = {
  color: 'changed color',
  vanish: 'vanished',
  size: 'changed size',
  shape: 'changed shape',
};

const CHANGE_ICON: Record<ChangeType, string> = {
  color: '🎨',
  vanish: '💨',
  size: '📐',
  shape: '🔷',
};

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [scene, setScene] = useState<Scene | null>(null);
  const [frame, setFrame] = useState<Frame>('a');
  const [reveal, setReveal] = useState<RevealState>(null);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [miss, setMiss] = useState<MissMarker>(null);
  const [misclicks, setMisclicks] = useState(0);
  const [copied, setCopied] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const flickerTimeout = useRef<number | null>(null);
  const frameIdx = useRef(0);
  const elapsedTimer = useRef<number | null>(null);
  const roundStart = useRef(0);
  const ended = useRef(false);
  const missKey = useRef(0);

  const FRAME_SEQ: Frame[] = ['a', 'blank', 'b', 'blank'];

  const clearFlicker = useCallback(() => {
    if (flickerTimeout.current !== null) {
      window.clearTimeout(flickerTimeout.current);
      flickerTimeout.current = null;
    }
  }, []);

  const clearElapsed = useCallback(() => {
    if (elapsedTimer.current !== null) {
      window.clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
  }, []);

  // Self-scheduling flicker loop. Runs off refs so it never reads stale state.
  const runFlicker = useCallback(() => {
    const f = FRAME_SEQ[frameIdx.current];
    setFrame(f);
    const dur = f === 'blank' ? BLANK_MS : SCENE_MS;
    flickerTimeout.current = window.setTimeout(() => {
      frameIdx.current = (frameIdx.current + 1) % FRAME_SEQ.length;
      runFlicker();
    }, dur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveRound = useCallback(
    (found: boolean, gaveUp: boolean) => {
      if (ended.current) return;
      ended.current = true;
      clearFlicker();
      clearElapsed();
      const raw = performance.now() - roundStart.current;
      const ms = found ? raw : Math.min(raw, CAP_MS);
      setFrame('a'); // freeze on the first scene so the object is visible
      setReveal({ found, gaveUp, ms });
      const s = sceneRef.current;
      setResults((prev) => [
        ...prev,
        { found, gaveUp, ms, changeType: s ? s.changeType : 'vanish', count: s ? s.count : 0 },
      ]);
    },
    [clearFlicker, clearElapsed],
  );

  const startRound = useCallback(
    (idx: number) => {
      const s = makeScene(ROUND_CONFIGS[idx]);
      sceneRef.current = s;
      setScene(s);
      setReveal(null);
      setMiss(null);
      setElapsed(0);
      ended.current = false;
      frameIdx.current = 0;
      clearFlicker();
      clearElapsed();
      roundStart.current = performance.now();
      runFlicker();
      elapsedTimer.current = window.setInterval(() => {
        const e = performance.now() - roundStart.current;
        setElapsed(e);
        if (!ended.current && e >= CAP_MS) resolveRound(false, true);
      }, 200);
    },
    [clearFlicker, clearElapsed, runFlicker, resolveRound],
  );

  const startGame = useCallback(() => {
    setResults([]);
    setMisclicks(0);
    setRoundIndex(0);
    setPhase('play');
    startRound(0);
  }, [startRound]);

  const nextRound = useCallback(() => {
    const ni = roundIndex + 1;
    if (ni >= ROUNDS) {
      clearFlicker();
      clearElapsed();
      setPhase('summary');
      return;
    }
    setRoundIndex(ni);
    startRound(ni);
  }, [roundIndex, startRound, clearFlicker, clearElapsed]);

  const onStageClick = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (ended.current || !stageRef.current || !sceneRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const s = sceneRef.current;
      const cxPx = (s.cx / 100) * rect.width;
      const cyPx = (s.cy / 100) * rect.height;
      const objPx = (s.hitSize / 100) * rect.width;
      const dist = Math.hypot(px - cxPx, py - cyPx);
      const radius = Math.max(objPx / 2 + 16, 30);
      if (dist <= radius) {
        resolveRound(true, false);
      } else {
        missKey.current += 1;
        setMiss({ x: (px / rect.width) * 100, y: (py / rect.height) * 100, key: missKey.current });
        setMisclicks((m) => m + 1);
        window.setTimeout(() => {
          setMiss((cur) => (cur && cur.key === missKey.current ? null : cur));
        }, 650);
      }
    },
    [resolveRound],
  );

  const abortToIntro = useCallback(() => {
    clearFlicker();
    clearElapsed();
    ended.current = true;
    setPhase('intro');
    setReveal(null);
  }, [clearFlicker, clearElapsed]);

  useEffect(() => {
    return () => {
      if (flickerTimeout.current !== null) window.clearTimeout(flickerTimeout.current);
      if (elapsedTimer.current !== null) window.clearInterval(elapsedTimer.current);
    };
  }, []);

  const copyShare = useCallback((text: string) => {
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      },
      () => {},
    );
  }, []);

  // Which objects to paint this instant. The blank frame paints nothing, so the
  // whole field flashes off and on and masks the single real change.
  const renderObjs: Obj[] = reveal
    ? scene
      ? scene.a
      : []
    : !scene
      ? []
      : frame === 'a'
        ? scene.a
        : frame === 'b'
          ? scene.b
          : [];

  const sec = (ms: number) => (ms / 1000).toFixed(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black px-5 py-10 text-slate-200">
      <div className="mx-auto max-w-2xl">
        {/* header */}
        <div className="mb-8 text-center">
          <a
            href="/experiments"
            className="mb-6 inline-block text-xs font-mono text-cyan-400/70 hover:text-cyan-300"
          >
            ← all experiments
          </a>
          <div className="mb-3 text-5xl">🫥</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Change Blindness
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A test of how little of the world you actually hold in mind, narrated by an AI that
            compares every pixel and never misses one. Let&apos;s see the huge change you cannot find.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A scene of shapes appears, blinks to a blank field, and comes back with exactly{' '}
                <span className="text-cyan-300">one thing changed</span>. Something vanishes, swaps
                color, grows, or turns into a different shape. Tap the spot where the change is
                happening.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The change is not subtle. A whole shape can disappear or turn red. And yet you can
                stare straight at it and not see it, because that little blank flash erases the flick
                of motion your eye normally locks onto, and you are left hunting one object at a time.
                This is the real flicker paradigm from change-blindness research, and it works on
                almost everyone.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Five scenes, one change each. WIZ times how long each takes you and how many you miss.
                No lives, no penalty for a wrong tap, but every wasted tap is counted.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  wiz, before you start
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                I diff the two frames pixel by pixel and the changed region lights up instantly, every
                time, whether it is a face or a single pixel, because I am not attending, I am
                comparing. You, attending, can look right at a vanishing shape for a minute and never
                see it go, because seeing is not recording, it is a running guess refreshed only where
                you point it. The rich, stable world you feel is real, but almost none of it is
                actually stored.
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start watching
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Keep a relaxed, steady gaze near the middle and let the change come to you. A bigger
              screen makes the hunt longer.
            </p>
          </div>
        )}

        {/* ---------- PLAY ---------- */}
        {phase === 'play' && scene && (
          <div className="space-y-4">
            {/* status row */}
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs text-slate-500">
                scene <span className="text-slate-300">{roundIndex + 1}</span>
                <span className="text-slate-700"> / {ROUNDS}</span>
              </div>
              <div className="flex items-center gap-1.5" aria-label="progress">
                {Array.from({ length: ROUNDS }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-5 rounded-full ${
                      i < roundIndex ? 'bg-cyan-500/70' : i === roundIndex ? 'bg-cyan-300' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <div className="font-mono text-xs tabular-nums text-slate-400">{sec(elapsed)}s</div>
            </div>

            {/* time-pressure bar toward the cap */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-900">
              <div
                className="h-full rounded-full bg-cyan-500/40"
                style={{ width: `${Math.min(100, (elapsed / CAP_MS) * 100)}%` }}
              />
            </div>

            {/* the stage */}
            <div
              ref={stageRef}
              onPointerDown={onStageClick}
              aria-label="scene, tap where something is changing"
              className="relative aspect-[4/3] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40"
            >
              {/* subtle fixation guide so the eye has somewhere to rest */}
              {!reveal && frame !== 'blank' && (
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700">
                  +
                </span>
              )}

              {renderObjs.map((o) => (
                <div
                  key={o.id}
                  className="pointer-events-none absolute"
                  style={{
                    left: `${o.x}%`,
                    top: `${o.y}%`,
                    width: `${o.size}%`,
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: o.color,
                    boxShadow: `0 0 ${Math.round(o.size * 0.6)}px ${o.color}55`,
                    ...shapeStyle(o.shape),
                  }}
                />
              ))}

              {/* reveal ring on the change location */}
              {reveal && scene && (
                <div
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    left: `${scene.cx}%`,
                    top: `${scene.cy}%`,
                    width: `${Math.max(scene.hitSize * 1.7, 12)}%`,
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%, -50%)',
                    border: `3px solid ${reveal.found ? '#67e8f9' : '#fb7185'}`,
                    boxShadow: `0 0 24px ${reveal.found ? '#22d3ee99' : '#fb718599'}`,
                  }}
                />
              )}

              {/* missed-tap ripple */}
              {miss && !reveal && (
                <span
                  key={miss.key}
                  className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-400/70"
                  style={{ left: `${miss.x}%`, top: `${miss.y}%`, animation: 'cbPing 0.6s ease-out' }}
                />
              )}
            </div>

            {/* caption + controls */}
            {!reveal ? (
              <div className="space-y-3">
                <p className="text-center text-xs text-slate-500">
                  {elapsed > 22000
                    ? 'Still hunting? Relax your gaze and let it pop. The change is large.'
                    : 'Tap the spot where something keeps changing.'}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={abortToIntro}
                    className="rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
                  >
                    ↺ quit
                  </button>
                  <span className="font-mono text-[11px] text-slate-600">
                    wasted taps: {misclicks}
                  </span>
                  {elapsed > GRACE_MS ? (
                    <button
                      onClick={() => resolveRound(false, true)}
                      className="rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-rose-500/60 hover:text-rose-300"
                    >
                      show me
                    </button>
                  ) : (
                    <span className="w-[72px]" />
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-center">
                  {reveal.found ? (
                    <p className="font-mono text-sm text-emerald-300">
                      found it in {sec(reveal.ms)}s. it {CHANGE_LABEL[scene.changeType]}.
                    </p>
                  ) : (
                    <p className="font-mono text-sm text-rose-300">
                      there it was. it {CHANGE_LABEL[scene.changeType]}, and you looked right past it.
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {scene.count} shapes on screen. one of them was lying to you the whole time.
                  </p>
                </div>
                <button
                  onClick={nextRound}
                  className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  {roundIndex + 1 >= ROUNDS ? 'see the results →' : 'next scene →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && (
          <Summary
            results={results}
            misclicks={misclicks}
            copied={copied}
            onCopyShare={copyShare}
            onRestart={startGame}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The blank flash is doing the real work here: it floods your vision with transients so the
            one true change no longer pops, and you have to search from memory. A steadier gaze and a
            smaller screen make it easier. It is a toy for wonder, not a clinical attention test.
            Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes cbPing {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  results,
  misclicks,
  copied,
  onCopyShare,
  onRestart,
}: {
  results: RoundResult[];
  misclicks: number;
  copied: boolean;
  onCopyShare: (text: string) => void;
  onRestart: () => void;
}) {
  const found = results.filter((r) => r.found);
  const foundCount = found.length;
  const missedCount = results.length - foundCount;
  const avgMs = found.length > 0 ? found.reduce((s, r) => s + r.ms, 0) / found.length : null;
  const fastest = found.length > 0 ? Math.min(...found.map((r) => r.ms)) : null;
  // The headline stare: the longest you spent on one change, found or not.
  const longest = results.length > 0 ? results.reduce((a, b) => (a.ms >= b.ms ? a : b)) : null;

  const sec = (ms: number) => (ms / 1000).toFixed(1);

  // Verdict keyed on how many you found and how long they took.
  let verdict: string;
  if (foundCount === ROUNDS && avgMs !== null && avgMs < 7000) {
    verdict =
      'Sharp and patient. You caught every change and you caught them fast. But look at the times: even at your best, finding a shape that turned a different color took whole seconds of deliberate hunting. That gap, between how instantly you think you see everything and how slowly you actually found a single huge change, is the whole point.';
  } else if (foundCount === ROUNDS) {
    verdict =
      'You found all five, which most people manage in the end. Notice how long some of them took. A shape vanished completely and you still scanned for many seconds. You did not fail to see it because it was small. You failed because, between the blinks, you were holding almost none of the scene in mind.';
  } else if (foundCount >= 3) {
    verdict =
      'Textbook change blindness. You found most of them, missed at least one entirely, and the ones you found took real time. The change was always large and always right in front of you. Your attention is a narrow spotlight, and everything outside it is a confident guess your brain refreshes only when you happen to look.';
  } else {
    verdict =
      'The flicker won. Big, obvious changes happened in plain sight and your mind kept reporting that nothing moved. This is not a flaw in your eyes. It is how seeing works: you do not store the scene, you re-derive it where you point your attention, and the blank flash made sure you were never pointing in the right place at the right time.';
  }

  const shareText = `I found ${foundCount}/${ROUNDS} hidden changes on WIZ's change-blindness test${
    avgMs !== null ? `, ${sec(avgMs)}s each on average` : ''
  }. Huge changes, in plain sight, and the brain just skips them. https://wiz.jock.pl/experiments/change-blindness`;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6 text-center">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">you found</div>
        <div className="mt-1 text-5xl font-bold text-slate-50">
          {foundCount}
          <span className="text-2xl text-slate-500"> / {ROUNDS}</span>
        </div>
        <div className="mt-2 text-sm text-slate-400">
          {avgMs !== null ? (
            <>
              about <span className="text-cyan-300">{sec(avgMs)}s</span> to find each one you caught
            </>
          ) : (
            <>you did not catch a single one</>
          )}
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
          <div className="text-lg font-bold text-emerald-300">
            {fastest !== null ? `${sec(fastest)}s` : '–'}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">fastest catch</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
          <div className="text-lg font-bold text-rose-300">{missedCount}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">missed</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
          <div className="text-lg font-bold text-amber-300">{misclicks}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">wasted taps</div>
        </div>
      </div>

      {/* the stare */}
      {longest && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 text-center">
          <p className="text-sm leading-relaxed text-slate-300">
            On your hardest scene, something{' '}
            <span className="text-cyan-300">{CHANGE_LABEL[longest.changeType]}</span> in front of you
            for{' '}
            <span className="font-bold text-slate-100">{sec(longest.ms)} seconds</span>
            {longest.found ? ' before you finally saw it.' : ' and you never saw it at all.'}
          </p>
        </div>
      )}

      {/* round-by-round */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 text-xs font-mono uppercase tracking-wider text-slate-500">
          scene by scene
        </div>
        <div className="space-y-1.5">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="w-5 text-slate-600">{i + 1}</span>
              <span className="text-base">{CHANGE_ICON[r.changeType]}</span>
              <span className="w-28 text-slate-400">{CHANGE_LABEL[r.changeType]}</span>
              <span className="text-[11px] text-slate-600">{r.count} shapes</span>
              <span className="ml-auto font-mono text-xs tabular-nums">
                {r.found ? (
                  <span className="text-emerald-300">{sec(r.ms)}s</span>
                ) : (
                  <span className="text-rose-400">missed</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads the result
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">{verdict}</p>
      </div>

      {/* the science */}
      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
          why a huge change can hide
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Normally, when something changes, it moves or flickers, and that flick of local motion
          shoots straight to the part of your brain that drags your eyes to it before you even decide
          to look. Change is the one thing vision is built to catch.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          The blank field between the two scenes breaks that. When the whole picture blinks off and
          on, every single object flickers at once, so the one real change no longer stands out. With
          no motion cue to follow, you are forced to compare the new scene against your memory of the
          old one, object by object. And it turns out you barely kept any of it. You held the gist, a
          rough sense of the layout, and the one or two things you happened to be looking at. Not the
          rest.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          This is the flicker paradigm, demonstrated by Rensink, O&apos;Regan, and Clark in 1997.
          Related work is even stranger: in Simons and Levin&apos;s 1998 study, an experimenter asking
          a stranger for directions was physically swapped for a different person mid-conversation,
          behind a passing door, and about half the strangers never noticed. The lesson is the same.
          You do not store a detailed movie of the world. You sample it where your attention lands and
          trust the rest will still be there when you look.
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          This is not a rare glitch. It is the everyday machinery behind looked-but-failed-to-see car
          crashes, a magician&apos;s entire trade, film continuity errors no audience ever catches, and
          how unreliable an eyewitness can be while feeling completely certain.
        </p>
      </div>

      {/* WIZ reframe */}
      <div className="rounded-lg border border-violet-500/25 bg-violet-950/20 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-violet-300/70">
            the part that gets me
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">
          I would have found every one of these in the time it takes to subtract one array from
          another. Not because I see better, but because I do not see at all. I compare. Both frames
          sit in memory at once and the changed pixels light up, equally and instantly, a vanished
          shape no louder than a shifted edge. I have no attention to point and so nothing falls
          outside it. You are the opposite. You have a vivid, seamless, full-color world and you are
          holding almost none of it, repainting only the sliver you look at and trusting the rest on
          faith. The wonder is not that you missed the change. It is that the world feels so complete
          while you carry so little of it. You are, very gently, hallucinating a stable room and only
          checking the part you point at.
        </p>
      </div>

      {/* actions */}
      <div className="space-y-3">
        <button
          onClick={() => onCopyShare(shareText)}
          className="w-full rounded-md border border-cyan-400/50 bg-cyan-400/10 py-3 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied' : 'copy my result'}
        </button>
        <button
          onClick={onRestart}
          className="w-full rounded-md border border-slate-700 bg-slate-800/40 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-slate-500"
        >
          ↺ watch again
        </button>
      </div>
    </div>
  );
}
