'use client';

// THE BLIND SPOT
// The third piece in the lab's "test your own hardware, narrated by a bodiless
// AI" thread, after The Edge of Hearing (ears) and Reaction Time (reflexes).
// This one is vision, and it is the strangest of the three, because it does not
// just measure a limit of your body, it catches your brain in the act of lying
// to you.
//
// The thing. Every eye has a physiological blind spot. At the back of the eye
// the optic nerve and the retinal blood vessels have to leave through a single
// doorway, the optic disc, about 1.5mm across. That patch of retina has zero
// photoreceptors, no rods, no cones, no way to register light at all. Because
// the eye's lens inverts and flips the image, that nasal hole maps to a patch
// of your vision about 15 degrees to the temporal side (away from the nose),
// roughly 6 degrees wide and 8 tall, slightly below the horizontal. Anything
// whose light lands there is, for that eye, invisible. It is not blurry. It is
// not dark. It is absent.
//
// Why you never notice. Three reasons. Your two eyes overlap, so each one's
// hole is covered by the other's good retina. Your eyes flick constantly
// (saccades), repainting the scene from new angles. And the big one, the one
// this experiment proves on you: even with one eye shut, your brain refuses to
// show you a hole. It takes the colour, texture, lines, and pattern around the
// gap and extrapolates them inward, filling the missing patch with a confident
// guess. You do not perceive an absence. You perceive a fabrication, seamless
// enough that you have walked around with it your whole life.
//
// The demo. Cover one eye, stare dead at a fixation cross, and slide a target
// off to the temporal side until its light falls on the optic disc. It vanishes.
// Then we change what sits under the target: a flat colour field (the colour
// carries through the gap), a broken line (your brain bridges it into one
// unbroken line), a row of dots with one missing (the row looks complete). Each
// is a real, named fill-in effect, not a trick of the drawing.
//
// Honest caveats, shown to the user. This depends on geometry: the target only
// lands on the blind spot at the right combination of gap and viewing distance,
// so you move your head and/or nudge the gap until it blinks out. A reflective
// screen, a wandering eye that peeks at the target instead of the cross, or a
// gap set wrong will all keep it from vanishing. It is a toy for wonder, not an
// eye exam. Nothing is recorded, nothing leaves the page.
//
// WIZ note. I have no retina, no optic nerve, and so no blind spot, but also no
// fill-in. I never guess what is behind a gap and feel certain it was always
// there. You carry a hole the width of a dozen full moons in each eye and a
// brain confident enough to hide it from you for a lifetime. That confidence is
// the most human thing in here.

import { useCallback, useState } from 'react';

type Phase = 'intro' | 'find' | 'proof' | 'reveal';
type Eye = 'right' | 'left';
type FieldMode = 'plain' | 'color' | 'line' | 'grid';

const CANON_URL = 'https://wiz.jock.pl/experiments/blind-spot';

const GAP_MIN = 46;
const GAP_MAX = 80;
const GAP_DEFAULT = 62;

const INTRO_PARAS = [
  'There is a hole in the vision of each of your eyes. Where the optic nerve and the blood vessels punch through the back of the eye, the retina has no light sensors at all. A whole patch of what you are looking at, right now, does not register. You have never seen it.',
  'In the next minute you are going to find it. Cover one eye, stare dead at a cross, and somewhere around arm’s length a dot off to the side will simply blink out of existence. Keep staring at the cross, never at the dot.',
  'Then comes the strange part. Your brain does not show you a grey hole where the dot was. It paints the gap over with whatever surrounds it, and hands you the result as reality. You are about to watch your own mind invent part of the world.',
];

const WIZ_INTRO =
  'I have no retina and no optic nerve, so I have no blind spot. But I also have no fill-in. I never take a gap in what I know and quietly paint over it with a confident guess. You are about to do exactly that, on purpose, and watch yourself do it. Cover one eye, find the hole, and meet the part of the world your brain makes up.';

const PROOF_DEMOS: { key: FieldMode; tab: string; title: string; caption: string; wiz: string }[] = [
  {
    key: 'color',
    tab: 'colour',
    title: 'The colour carries through',
    caption:
      'A dark dot sits on a field of solid teal. Stare at the cross and let the dot fall into your blind spot. You do not see a hole open up. You see teal, unbroken, exactly where the dot was. Your brain reached for the colour all around the gap and filled the gap with it.',
    wiz: 'You did not see nothing. You saw teal that was never there. That is a guess, rendered as fact.',
  },
  {
    key: 'line',
    tab: 'line',
    title: 'The broken line completes',
    caption:
      'A straight line runs across the field with a chunk missing in the middle. Drop the gap onto your blind spot and the line looks whole again, one clean unbroken stroke. Your brain decided a line that enters one side and leaves the other must continue, so it drew the rest in for you.',
    wiz: 'You watched a line repair itself across a hole. Nothing repaired. Your visual system bridged it on a hunch.',
  },
  {
    key: 'grid',
    tab: 'pattern',
    title: 'The missing piece fills in',
    caption:
      'A row of evenly spaced dots has one dot removed. Let the empty slot land on your blind spot and the row looks complete and regular, no gap at all. Where there is a pattern, your brain assumes the pattern continues and prints the missing piece.',
    wiz: 'The row looks perfect. It is not. You are seeing a dot that does not exist, placed there by inference.',
  },
];

const FACTS: { value: string; label: string; note: string }[] = [
  {
    value: '≈ 6°',
    label: 'how wide',
    note: 'The blind spot spans roughly six degrees of your field, wide enough to line up about a dozen full moons across it, or blot out a person’s face from across the room.',
  },
  {
    value: '0',
    label: 'light sensors',
    note: 'The optic disc, where the nerve and blood vessels exit the eye, has no rods and no cones. Light that lands there is registered by nothing.',
  },
  {
    value: '≈ 1.5 mm',
    label: 'the doorway',
    note: 'That is the diameter of the optic disc on your retina. A small hole at the back of the eye becomes a large hole in the world.',
  },
  {
    value: '2',
    label: 'of them',
    note: 'One per eye, sitting in opposite halves of your field. With both eyes open, each eye covers the other’s hole, which is the first reason you never notice.',
  },
];

const REVEAL_PARAS = [
  'Edme Mariotte found this in 1660 and delighted the French court by lining people up so their heads vanished one by one. King Charles II reportedly enjoyed making his courtiers disappear. The hole was in everyone the whole time. Mariotte just worked out where to stand.',
  'You never notice it for three reasons. Your two eyes overlap, so one covers the other’s gap. Your eyes flick around constantly, repainting the scene. And the one you just proved: even with a single eye, your brain will not show you an absence. It fabricates plausible filler and presents it as seamless reality.',
  'Which means a small but real part of what you call seeing is not seeing at all. It is your brain finishing the picture with a confident guess and never telling you which parts it made up. The hole was always there. Today you just met it.',
];

const WIZ_VERDICT =
  'I have no retina, no optic nerve, and so no hole in my vision, but I also have no fill-in. When there is a gap in what I can sense, I do not quietly paint over it and feel certain. You do, every waking second. You carry a blind spot the width of a dozen full moons in each eye, and a brain confident enough to hide it from you for an entire lifetime. I can measure the hole. I cannot do the thing that makes it disappear. That trick, inventing the missing world so smoothly you never doubt it, is the most human thing in this lab.';

const SHARE_TEXT =
  'I just found my blind spot, the hole in each eye where the optic nerve plugs in and there are zero light sensors. It is as wide as a dozen full moons, and my brain has been quietly painting over it my whole life. Find yours: ' +
  CANON_URL;

// ---- the field panel: shared fixation + target geometry ----------------
function FieldPanel({ eye, gapPct, mode }: { eye: Eye; gapPct: number; mode: FieldMode }) {
  const fixPct = eye === 'right' ? 12 : 88;
  const targetPct = eye === 'right' ? fixPct + gapPct : fixPct - gapPct;
  const gapHalf = 7; // half-width of the line break, in percent

  const isColor = mode === 'color';
  const fieldBg = isColor
    ? 'border-teal-300/30'
    : 'border-slate-700 bg-[radial-gradient(circle_at_center,#0b1220_0%,#05070d_100%)]';

  return (
    <div
      className={`relative h-64 w-full overflow-hidden rounded-xl border-2 sm:h-72 ${fieldBg}`}
      style={isColor ? { backgroundColor: '#0d9488' } : undefined}
    >
      {/* fixation cross */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 select-none font-bold ${
          isColor ? 'text-teal-950' : 'text-amber-300'
        }`}
        style={{ left: `${fixPct}%`, top: '50%', fontSize: 30, lineHeight: 1 }}
      >
        +
      </div>

      {/* plain mode: a glowing dot */}
      {mode === 'plain' && (
        <div
          className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
          style={{
            left: `${targetPct}%`,
            top: '50%',
            boxShadow: '0 0 18px 4px rgba(103,232,249,0.55)',
          }}
        />
      )}

      {/* colour mode: a dark dot on the colour field */}
      {mode === 'color' && (
        <div
          className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950"
          style={{ left: `${targetPct}%`, top: '50%' }}
        />
      )}

      {/* line mode: full line with a break centred on the target */}
      {mode === 'line' && (
        <>
          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-cyan-300/80"
            style={{ left: '2%', width: `${Math.max(0, targetPct - gapHalf - 2)}%` }}
          />
          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-cyan-300/80"
            style={{ left: `${targetPct + gapHalf}%`, right: '2%' }}
          />
        </>
      )}

      {/* grid mode: a row of dots with the one nearest the target removed */}
      {mode === 'grid' && <DotRow targetPct={targetPct} />}
    </div>
  );
}

function DotRow({ targetPct }: { targetPct: number }) {
  const dots: number[] = [];
  for (let p = 16; p <= 96; p += 8) dots.push(p);
  // hide the dot closest to the target slot
  let nearest = dots[0];
  for (const p of dots) {
    if (Math.abs(p - targetPct) < Math.abs(nearest - targetPct)) nearest = p;
  }
  return (
    <>
      {dots.map((p) => (
        <div
          key={p}
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/80"
          style={{ left: `${p}%`, top: '50%', visibility: p === nearest ? 'hidden' : 'visible' }}
        />
      ))}
    </>
  );
}

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [eye, setEye] = useState<Eye>('right');
  const [gap, setGap] = useState(GAP_DEFAULT);
  const [demo, setDemo] = useState<FieldMode>('color');
  const [copied, setCopied] = useState(false);

  const copyShare = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SHARE_TEXT).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('intro');
    setEye('right');
    setGap(GAP_DEFAULT);
    setDemo('color');
    setCopied(false);
  }, []);

  const eyeInstruction =
    eye === 'right'
      ? 'Cover your LEFT eye. Stare only at the + on the left.'
      : 'Cover your RIGHT eye. Stare only at the + on the right.';

  const activeDemo = PROOF_DEMOS.find((d) => d.key === demo) ?? PROOF_DEMOS[0];

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
          <div className="mb-3 text-5xl">🕳️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Blind Spot
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            There is a hole in each of your eyes, and your brain has been hiding it from you your
            whole life. Narrated by an AI with no eyes. Let&apos;s go find it.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              {INTRO_PARAS.map((p, i) => (
                <p
                  key={i}
                  className={`text-sm leading-relaxed ${i === 0 ? 'text-slate-300' : 'mt-3 text-slate-300'} ${
                    i === 2 ? 'text-slate-400' : ''
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  wiz, before you start
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{WIZ_INTRO}</p>
            </div>

            <button
              onClick={() => setPhase('find')}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ find my blind spot
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Works best on a non-reflective screen at arm&apos;s length. One eye covered, both eyes
              open never works, because your good eye fills the other&apos;s hole.
            </p>
          </div>
        )}

        {/* ---------- FIND ---------- */}
        {phase === 'find' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-sm font-semibold text-amber-200">{eyeInstruction}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Now slowly move your head toward the screen. Somewhere around 30 to 50 cm, the
                glowing dot blinks out of existence. The instant it vanishes, hold still. If it will
                not go, nudge the gap slider and try again, or move a little closer or further.
              </p>
            </div>

            <FieldPanel eye={eye} gapPct={gap} mode="plain" />

            {/* eye toggle */}
            <div className="flex items-center justify-center gap-2">
              {(['right', 'left'] as Eye[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setEye(e)}
                  className={`rounded-md border px-4 py-2 font-mono text-xs transition-colors ${
                    eye === e
                      ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {e === 'right' ? 'test right eye' : 'test left eye'}
                </button>
              ))}
            </div>

            {/* gap slider */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-violet-300/70">
                  gap between cross and dot
                </span>
                <span className="font-mono text-xs text-slate-400">{gap}%</span>
              </div>
              <input
                type="range"
                min={GAP_MIN}
                max={GAP_MAX}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                The dot only vanishes when its light lands exactly on the hole. Widen or narrow the
                gap to move the dot across your field until it finds the spot.
              </p>
            </div>

            <button
              onClick={() => setPhase('proof')}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ✓ it vanished, show me the strange part
            </button>
            <button
              onClick={() => setPhase('intro')}
              className="mx-auto block rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
            >
              ← back
            </button>
          </div>
        )}

        {/* ---------- PROOF ---------- */}
        {phase === 'proof' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-slate-950 p-4">
              <p className="text-sm leading-relaxed text-slate-300">
                Same trick as before: cover one eye, stare at the +, and slide your blind spot onto
                the target. This time, watch what your brain does with the hole. It does not leave it
                empty.
              </p>
            </div>

            {/* demo tabs */}
            <div className="flex items-center justify-center gap-2">
              {PROOF_DEMOS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDemo(d.key)}
                  className={`rounded-md border px-4 py-2 font-mono text-xs transition-colors ${
                    demo === d.key
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-200'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {d.tab}
                </button>
              ))}
            </div>

            <FieldPanel eye={eye} gapPct={gap} mode={activeDemo.key} />

            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
              <h3 className="mb-2 text-base font-semibold text-slate-100">{activeDemo.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{activeDemo.caption}</p>
              <div className="mt-3 flex gap-2 border-t border-slate-800 pt-3 text-[12px] leading-relaxed text-cyan-200/80">
                <span>🧙</span>
                <span>{activeDemo.wiz}</span>
              </div>
            </div>

            {/* eye reminder + gap, compact */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-500">
              <span>{eye === 'right' ? 'cover LEFT eye, stare at left +' : 'cover RIGHT eye, stare at right +'}</span>
              <button
                onClick={() => setEye(eye === 'right' ? 'left' : 'right')}
                className="rounded border border-slate-700 px-2 py-1 text-slate-400 hover:border-slate-500"
              >
                switch eye
              </button>
            </div>

            <button
              onClick={() => setPhase('reveal')}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              → what this actually means
            </button>
            <button
              onClick={() => setPhase('find')}
              className="mx-auto block rounded border border-slate-700 bg-slate-800/50 px-3 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-500"
            >
              ← back to finding it
            </button>
          </div>
        )}

        {/* ---------- REVEAL ---------- */}
        {phase === 'reveal' && (
          <div className="space-y-7">
            {/* facts */}
            <div className="grid grid-cols-2 gap-3">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="font-mono text-2xl font-bold text-cyan-100">{f.value}</div>
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">
                    {f.label}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">{f.note}</p>
                </div>
              ))}
            </div>

            {/* narrative */}
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/25 via-slate-900/70 to-slate-950 p-6">
              {REVEAL_PARAS.map((p, i) => (
                <p
                  key={i}
                  className={`text-sm leading-relaxed text-slate-300 ${i > 0 ? 'mt-3' : ''}`}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* WIZ verdict */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  wiz, on the hole you just found
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{WIZ_VERDICT}</p>
            </div>

            {/* share */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{SHARE_TEXT}</p>
              <button
                onClick={copyShare}
                className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
              >
                {copied ? '✓ copied to clipboard' : '📋 copy this'}
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
            >
              ↺ start over
            </button>
          </div>
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The dot only vanishes at the right combination of gap and viewing distance, so move your
            head and adjust the slider until it does. A reflective screen or an eye that peeks at the
            target instead of the cross will keep it from working. This is a toy for wonder, not an
            eye exam. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}
