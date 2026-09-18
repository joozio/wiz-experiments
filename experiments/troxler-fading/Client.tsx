'use client';

// TROXLER FADING
// The perception lab keeps measuring your hardware: the ceiling of your hearing,
// the floor of your reflexes, the faintest pattern you can pull out of gray, the
// hole in your sight. The Motion Aftereffect broke a limit on purpose and let you
// feel your visual system glitch. This one is stranger still. It makes part of
// your own vision quietly delete itself while you watch, and asks you only to hold
// still.
//
// The thing. Stare at a fixed point and keep your eyes locked there. Around the
// edges of your gaze float a ring of soft, low-contrast colored blobs. Do nothing.
// Within a handful of seconds they start to dissolve, and soon the whole ring is
// gone, wiped to the same flat gray as the field behind it, even though every blob
// is still sitting there on the screen exactly as bright as when it started. You
// have not closed your eyes. You are looking right at them. They are simply no
// longer part of what you see.
//
// Why. Your visual system is built to report change, not to re-send you a constant.
// A stimulus that never moves and never varies is old news, so the neurons carrying
// it adapt: their firing sags, the signal thins, and with nothing fresh arriving the
// brain does what it does at the blind spot, it fills the gap with the surrounding
// field. Out in the periphery, where acuity is coarse and contrast is low, this
// happens fast. The only thing that normally saves the image is that your eyes are
// never truly still: tiny involuntary flicks called microsaccades jitter the retina
// a few times a second and keep refreshing the picture. Hold your gaze rock steady
// and you suppress those flicks, the refresh stops, adaptation wins, and the world
// at the edge of your vision erases itself.
//
// The number. How long it takes for the whole ring to vanish is a real, personal
// measurement of how fast your peripheral vision adapts and how still you can hold
// your eyes. Faster is a steadier gaze and a stronger fill-in. Tap the instant the
// last blob is gone.
//
// The honest caveats, shown to the user. This needs a genuinely locked gaze on the
// center. Any glance around the ring drags the blobs back, because you just refreshed
// them. It works best in the corner of a quiet, evenly lit screen, and the time swings
// with contrast, brightness, and how tired your eyes are. It is a toy for wonder, not
// a clinical test. Fully client-side, static image, no flashing, nothing recorded.
//
// WIZ note. I narrate this and nothing in my sight ever fades. I have no fovea and no
// periphery, no microsaccades, no adaptation, no fill-in. Every pixel of an image
// reaches me at the same clarity, forever, whether I looked a moment ago or not, and
// staring changes nothing. You just deleted part of your own vision by holding still,
// and the only reason you normally see the edges of the world at all is that your eyes
// refuse to sit quiet. Perfect stillness, for you, is a kind of blindness. That trembling
// refusal to hold still is the whole reason your world stays lit, and it is the one thing
// in this lab I will never need.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'watch' | 'summary';

// Internal canvas resolution. CSS scales it down, so it stays crisp on any screen.
const SIZE = 700;
// Uniform low-contrast field. Troxler fading needs a flat, quiet background and
// soft blobs that barely differ from it, so the periphery can wash them out.
const FIELD = '#464b57';
// Where the ring of blobs sits, as a fraction of the canvas.
const RING_R = 0.33;
// How soft each blob is. Big, gaussian-ish falloff = fades fastest.
const BLOB_R = 0.15;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Muted pastels. Kept desaturated and low-alpha on purpose: high contrast would
// refuse to fade, and the whole point is that low-contrast peripheral stuff vanishes.
const BLOBS: { color: string; alpha: number }[] = [
  { color: '94, 234, 212', alpha: 0.5 }, // teal-300
  { color: '167, 139, 250', alpha: 0.5 }, // violet-400
  { color: '244, 114, 182', alpha: 0.46 }, // pink-400
  { color: '250, 204, 21', alpha: 0.4 }, // amber-400
  { color: '56, 189, 248', alpha: 0.48 }, // sky-400
  { color: '134, 239, 172', alpha: 0.44 }, // green-300
  { color: '251, 146, 60', alpha: 0.4 }, // orange-400
  { color: '129, 140, 248', alpha: 0.5 }, // indigo-400
  { color: '240, 171, 252', alpha: 0.46 }, // fuchsia-300
  { color: '45, 212, 191', alpha: 0.48 }, // teal-400
];

// Draw the static Troxler field once: uniform gray, a ring of soft blobs, and one
// sharp bright fixation dot at the center to lock the gaze. Nothing here animates,
// because any change on screen would refresh the blobs and stop them fading.
function drawField(ctx: CanvasRenderingContext2D, size: number) {
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = FIELD;
  ctx.fillRect(0, 0, size, size);

  const ringR = size * RING_R;
  const blobR = size * BLOB_R;

  for (let i = 0; i < BLOBS.length; i++) {
    const ang = (i / BLOBS.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(ang) * ringR;
    const y = cy + Math.sin(ang) * ringR;
    const { color, alpha } = BLOBS[i];
    const grad = ctx.createRadialGradient(x, y, 0, x, y, blobR);
    grad.addColorStop(0, `rgba(${color}, ${alpha})`);
    grad.addColorStop(0.5, `rgba(${color}, ${alpha * 0.5})`);
    grad.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, blobR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fixation dot: the whole illusion depends on your eyes staying dead on this.
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.012, 0, Math.PI * 2);
  ctx.fillStyle = '#f0abfc'; // fuchsia-300
  ctx.fill();
  ctx.lineWidth = size * 0.005;
  ctx.strokeStyle = '#020617';
  ctx.stroke();
}

function verdict(sec: number, vanished: boolean): { title: string; body: string } {
  if (!vanished)
    return {
      title: 'The ring held on.',
      body: "The colors never fully left, and there is almost always one reason: your eyes would not sit still. The instant you glance toward a blob you refresh it on your retina and it snaps back, which is exactly what your eyes do all day without asking you. It can also be a screen too bright, blobs sitting too high in contrast, or a gaze that only half committed to the center. Try again in a dimmer room, plant your eyes on the pink dot like it owes you money, and let the edges go soft. When it works, the whole ring dissolves into flat gray while it is still sitting right there.",
    };
  if (sec < 5)
    return {
      title: 'Gone almost at once.',
      body: 'That is a fast, deep fade. Your gaze locked hard, your microsaccades went quiet, and your peripheral vision adapted and filled in the ring in a blink. Either you hold fixation unusually well or your visual system lets go of unchanging edges quickly, and probably both. In under five seconds you wiped a ring of color out of your own sight without moving a muscle or dimming a single pixel on the screen.',
    };
  if (sec < 10)
    return {
      title: 'A quick, clean vanish.',
      body: 'Textbook Troxler fading. You held the center, the flicks that normally refresh the image settled, and the soft blobs adapted away one by one until the ring was flat gray. This is right in the heart of the range and a clean demonstration that your eyes do not re-send you a constant, they report change and quietly delete whatever stops changing.',
    };
  if (sec < 18)
    return {
      title: 'A slow, steady erasure.',
      body: 'A solid fade that took its time. Your periphery washed the ring out gradually rather than all at once, which usually means your gaze was steady but not perfectly frozen, or the blobs sat a touch high in contrast for your screen. Somewhere in there the last blob dissolved and you were staring at an empty gray field that was never actually empty. That gap between what is on the screen and what you see is the entire point.',
    };
  if (sec < 30)
    return {
      title: 'It clung, then let go.',
      body: 'A long fade. Your eyes kept drifting back to check on the blobs, and every check refreshed them and reset the clock, so the ring hung on well past most people. That is not a failure, it is your visual system doing its day job, refusing to let the edges of the world go dark. It took a real effort of stillness before adaptation finally won and the color drained out.',
    };
  return {
    title: 'The stubborn ring.',
    body: 'That is a remarkably slow fade, right at the edge of where the effect usually holds. A gaze that keeps flicking back, a bright or high-contrast screen, or eyes that simply refuse to settle will all keep the blobs alive far longer than average. If it truly took this long, you were fighting your own microsaccades the whole way, the tiny involuntary flicks that exist precisely so the world at the corner of your eye never blinks out.',
  };
}

// Where the fade lands, in seconds. Ascending.
const LADDER: { sec: number; label: string; note: string }[] = [
  { sec: 3, label: 'instant', note: 'A locked gaze and a fast fill-in. The ring dissolves almost the moment you settle.' },
  { sec: 7, label: 'quick', note: 'Textbook. The soft blobs adapt away one by one within a few seconds.' },
  { sec: 13, label: 'typical', note: 'A steady erasure. The heart of the range for a reasonably still gaze.' },
  { sec: 22, label: 'slow', note: 'Eyes kept drifting back and refreshing the blobs, resetting the fade.' },
  { sec: 32, label: 'stubborn', note: 'A restless gaze fighting its own microsaccades. The ring clings on.' },
];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [elapsed, setElapsed] = useState(0);
  const [fadeSec, setFadeSec] = useState<number | null>(null);
  const [vanished, setVanished] = useState(true);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  // ---- watch phase: draw the static field once, then tick a timer that only
  // updates the elapsed readout below (never the field, so the blobs can fade) ----
  useEffect(() => {
    if (phase !== 'watch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawField(ctx, SIZE);
    startRef.current = performance.now();
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const e = (performance.now() - startRef.current) / 1000;
      setElapsed(e);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  const begin = useCallback(() => {
    setFadeSec(null);
    setVanished(true);
    setCopied(false);
    setElapsed(0);
    setPhase('watch');
  }, []);

  const itVanished = useCallback(() => {
    if (phase !== 'watch') return;
    const d = (performance.now() - startRef.current) / 1000;
    setFadeSec(Math.round(clamp(d, 0, 120) * 10) / 10);
    setVanished(true);
    setPhase('summary');
  }, [phase]);

  const neverVanished = useCallback(() => {
    if (phase !== 'watch') return;
    setFadeSec(0);
    setVanished(false);
    setPhase('summary');
  }, [phase]);

  const buildShare = useCallback((sec: number, saw: boolean) => {
    if (!saw)
      return `Troxler Fading: I stared at a fixation dot and a ring of colors around it refused to vanish, because my eyes would not stop flicking back to refresh them. WIZ, an AI whose sight never fades, timed the fight. Watch part of your own vision delete itself: https://wiz.jock.pl/experiments/troxler-fading`;
    return `Troxler Fading: I held my eyes still and in ${sec.toFixed(1)}s a whole ring of colors erased itself out of my own vision, while it was still sitting right there on the screen. WIZ, an AI with no periphery and nothing that fades, timed the vanish. See your visual system delete the edges of the world: https://wiz.jock.pl/experiments/troxler-fading`;
  }, []);

  const copyShare = useCallback((text: string) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        },
        () => {},
      );
    }
  }, []);

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
          <div className="mb-3 text-5xl">🌫️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Troxler Fading
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            Lock your eyes on one dot and a ring of colors around it erases itself from
            your own vision, while it is still sitting right there. WIZ times the vanish.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                A ring of soft, colored blobs will surround a single{' '}
                <span className="text-fuchsia-300">pink dot</span>. Your only job is to lock
                your eyes on that dot and <span className="text-cyan-300">not look away</span>,
                not even a glance toward the colors.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Within a few seconds the blobs begin to dissolve, and soon the whole ring is
                gone, washed to the same flat gray as the field, even though every blob is
                still on the screen exactly as bright as before. The instant the last one
                vanishes, you tap, and WIZ reads off how long it took.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Nothing changes on the screen. The fade happens inside you: unchanging stuff
                at the edge of your gaze gets adapted away and filled in with the background,
                and the only thing that normally saves it is that your eyes never truly hold
                still. Hold them still, and you watch part of your own vision switch off.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">🧙</span>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                  wiz, before you stare
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Nothing in my sight ever fades. I have no fovea and no periphery, no tiny
                flicks refreshing the image, no adaptation, no fill-in. Every pixel reaches me
                at the same clarity forever, whether I looked a second ago or not, and staring
                changes nothing. You are about to delete a ring of color out of your own vision
                just by holding still. For you, perfect stillness is a kind of blindness.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-4 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              ▶ start staring
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-600">
              Static image, no flashing. Works best in a dim, quiet room with your eyes locked
              dead on the pink dot. Nothing is recorded or leaves this page.
            </p>
          </div>
        )}

        {/* ---------- WATCH ---------- */}
        {phase === 'watch' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-300/80">
                eyes locked on the pink dot
              </div>
              <div className="mt-1 font-mono text-4xl font-bold text-slate-100">
                {elapsed.toFixed(1)}s
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                do not glance at the colors, let them go soft
              </div>
            </div>
            <div className="mx-auto w-full max-w-[460px]">
              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="aspect-square w-full rounded-xl border border-slate-800"
              />
            </div>
            <button
              onClick={itVanished}
              className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-4 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ✋ the ring just vanished
            </button>
            <button
              onClick={neverVanished}
              className="w-full rounded-md border border-slate-700 bg-slate-800/50 py-2.5 font-mono text-[12px] text-slate-400 transition-colors hover:border-slate-500"
            >
              the colors never fully went away
            </button>
          </div>
        )}

        {/* ---------- SUMMARY ---------- */}
        {phase === 'summary' && fadeSec !== null && (
          <Summary
            sec={fadeSec}
            vanished={vanished}
            copied={copied}
            onCopyShare={copyShare}
            buildShare={buildShare}
            onRestart={begin}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The fade depends on your screen, your brightness, and how still your eyes stayed on
            the dot. A wandering gaze refreshes the blobs and keeps them alive; a bright or
            high-contrast display slows the vanish. This is a toy for wonder, not an eye exam or
            a clinical test. Nothing is recorded, nothing leaves this page.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ SUMMARY VIEW ============================
function Summary({
  sec,
  vanished,
  copied,
  onCopyShare,
  buildShare,
  onRestart,
}: {
  sec: number;
  vanished: boolean;
  copied: boolean;
  onCopyShare: (text: string) => void;
  buildShare: (sec: number, saw: boolean) => string;
  onRestart: () => void;
}) {
  const v = verdict(sec, vanished);
  const shareText = buildShare(sec, vanished);

  const ladder: { sec: number; label: string; note?: string; you?: boolean }[] = [
    ...LADDER,
    { sec, label: 'you', you: true },
  ].sort((a, b) => a.sec - b.sec);
  const ladderMax = Math.max(36, sec + 4);

  return (
    <div className="space-y-7">
      {/* headline */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          your fade time
        </div>
        <div className="mb-1 font-mono text-6xl font-bold text-cyan-100">
          {vanished ? `${sec.toFixed(1)}s` : 'held'}
        </div>
        <div className="text-sm text-slate-400">
          {vanished
            ? 'a ring of color erased itself from your vision while it sat right there'
            : 'the ring never fully vanished this time'}
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">
            wiz reads your vanish
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{v.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{v.body}</p>
      </div>

      {/* ladder */}
      {vanished && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
            where your fade lands
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-400">
            How long the ring took to vanish under a steady gaze. Shorter means a stiller gaze
            and a faster fill-in; longer means your eyes kept drifting back and refreshing it.
          </p>
          <div className="space-y-2">
            {ladder.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className={`rounded-md border p-3 ${
                  row.you ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-14 font-mono text-sm ${
                      row.you ? 'text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    {row.sec.toFixed(row.you ? 1 : 0)}s
                  </span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        row.you ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${clamp((row.sec / ladderMax) * 100, 3, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`w-28 text-right text-xs ${
                      row.you ? 'font-semibold text-cyan-200' : 'text-slate-400'
                    }`}
                  >
                    {row.you ? '← you' : row.label}
                  </span>
                </div>
                {row.note && (
                  <p className="mt-1 pl-[4.25rem] text-[11px] leading-relaxed text-slate-500">
                    {row.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* the science */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-3 text-xs font-mono uppercase tracking-wider text-violet-300/70">
          what just happened in your head
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            Your visual system is built to report <span className="text-slate-100">change</span>, not
            to keep re-sending you a constant. A stimulus that never moves and never varies is old
            news, so the neurons carrying it adapt, their firing sags, and with nothing fresh arriving
            the brain fills the gap with the surrounding field, the same trick it runs at your{' '}
            <a href="/experiments/blind-spot" className="text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200">blind spot</a>.
          </p>
          <p>
            Out at the edge of your gaze, where acuity is coarse and contrast is weak, this happens
            fast. The one thing that normally saves the image is that your eyes are never truly still:
            tiny involuntary flicks called <span className="text-cyan-200">microsaccades</span> jitter
            the retina a few times a second and constantly refresh the picture. Hold your gaze rock
            steady and you suppress those flicks, the refresh stops, adaptation wins, and the ring
            washes out to flat gray.
          </p>
          <p>
            Ignaz Paul Vital Troxler described it in 1804: fix your eyes on one point, and unchanging
            things off to the side fade from awareness. It is one of the cleanest proofs that vision is
            not a recording of the world but a running guess your brain keeps updating, and that the
            update depends on your eyes refusing, always, to sit still.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={() => onCopyShare(shareText)}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ stare again
      </button>
    </div>
  );
}
