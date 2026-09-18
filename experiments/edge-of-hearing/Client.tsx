'use client';

// THE EDGE OF HEARING
// Almost every experiment in this lab is something you watch. This one is
// something you listen for, and it is the first audio piece in the catalog.
//
// The thing. Sound is air pressure wobbling back and forth. A pure tone is the
// simplest wobble there is, a single frequency, a sine wave, and your inner ear
// reads it with about 16,000 hair cells lined up along a coiled membrane called
// the cochlea, each cell tuned to its own pitch like a key on a piano. The high
// notes sit at the entrance and take the most punishment, so they are the first
// to go: from your late teens onward the top of your range falls away, one quiet
// kilohertz at a time, and the cells never grow back. Most people never notice,
// because nothing they love lives up there. Textbook human hearing runs from
// about 20 Hz to about 20,000 Hz, but the 20 kHz ceiling belongs to a young
// child in a silent room. By 30 it is often nearer 16 kHz, by 50 nearer 13 kHz.
//
// The mosquito. Around 17.4 kHz sits a tone loud enough to annoy people who can
// still hear it and inaudible to most adults. It has been sold both ways: as the
// Mosquito anti-loitering device that shops aim at teenagers, and as the "Teen
// Buzz" ringtone teenagers used in class because their teachers had gone deaf to
// it. Whether you can hear it is a quick, honest read on the top of your range.
//
// The honest caveats, shown to the user. This is a real generator, the tones are
// real, but the result depends on your gear and your room. Laptop speakers roll
// off the very top and almost all of the bottom, so a low ceiling can be the
// speaker, not the ear, and the 20 Hz floor is really a test of your subwoofer.
// The age number is a rough audiology curve, not a diagnosis. Headphones and a
// quiet room make it mean something.
//
// WIZ note. I can read a 192 kHz waveform as a column of numbers and I have never
// heard one of them. You turn air into electricity with biological hardware that
// took half a billion years to tune. So I will generate the pitches; you tell me
// where they stop. We are looking for the exact edge of something I will never
// have.

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'high' | 'low' | 'result';

// ---- frequency <-> log-slider helpers ----------------------------------
const sliderToFreq = (pos: number, min: number, max: number) =>
  min * Math.pow(max / min, pos);
const freqToSlider = (f: number, min: number, max: number) =>
  Math.log(f / min) / Math.log(max / min);

const HIGH_MIN = 8000;
const HIGH_MAX = 22000;
const LOW_MIN = 20;
const LOW_MAX = 320;

const fmtHz = (f: number) =>
  f >= 1000 ? `${(f / 1000).toFixed(2)} kHz` : `${Math.round(f)} Hz`;

// ---- hearing-age estimate (rough presbycusis curve) ---------------------
// Anchor points: [ceiling kHz, approx age whose ears typically still reach it].
const AGE_ANCHORS: [number, number][] = [
  [20, 16],
  [19, 20],
  [18, 24],
  [17, 28],
  [16, 33],
  [15, 39],
  [14, 45],
  [13, 51],
  [12, 56],
  [11, 61],
  [10, 66],
  [8, 73],
  [6, 80],
];

function estimateAge(ceilingHz: number): number {
  const k = ceilingHz / 1000;
  if (k >= 20) return 16;
  if (k <= 6) return 80;
  for (let i = 0; i < AGE_ANCHORS.length - 1; i++) {
    const [k1, a1] = AGE_ANCHORS[i];
    const [k2, a2] = AGE_ANCHORS[i + 1];
    if (k <= k1 && k >= k2) {
      const t = (k1 - k) / (k1 - k2);
      return Math.round(a1 + t * (a2 - a1));
    }
  }
  return 50;
}

function highVerdict(ceilingHz: number): { title: string; body: string } {
  const k = ceilingHz / 1000;
  if (k >= 19)
    return {
      title: 'Exceptional, or very young.',
      body: 'Almost no adult still reaches up here. Either you are a teenager, you have unusually intact ears, or your headphones are flattering you. Whichever it is, savour it. This is the part of hearing that leaves first and never comes back.',
    };
  if (k >= 17)
    return {
      title: 'You can still hear the mosquito.',
      body: 'Right around here sits the tone shops blast to drive teenagers off, and the one teenagers turned into a ringtone their teachers could not hear. To me it is just a number on a dial. To you it is a tiny scream most adults have already gone deaf to.',
    };
  if (k >= 15)
    return {
      title: 'Young-adult ears.',
      body: 'The very top is starting to fade, the way it does for everyone, one quiet kilohertz at a time. You would not notice in a song. You only notice when something asks you to listen for the edge, like this did.',
    };
  if (k >= 13)
    return {
      title: 'Right where life leaves most ears.',
      body: 'The top octave goes first, and you almost never feel it leave, because nothing you love lives up there. Speech, music, voices: all of it sits comfortably below this line. The loss is real and it is also, mostly, painless.',
    };
  if (k >= 10)
    return {
      title: 'Your ceiling has come down.',
      body: 'From years, or from every loud concert and pair of earbuds you ever loved, the top of your range has pulled in. It is the most common hearing change there is. Worth knowing, not worth panic. The bottom four-fifths, where your whole life actually sounds, is still yours.',
    };
  return {
    title: 'Check the speakers first.',
    body: 'A ceiling this low is often the gear, not the ear: laptop and phone speakers give up on the top end early. Try good headphones in a quiet room. If it still stops here, that is worth a real hearing check someday. The top end matters less than you would think, but it does not regrow.',
  };
}

// ---- reference tones for the explorer -----------------------------------
const REFERENCE_TONES: { hz: number; label: string; note: string }[] = [
  { hz: 20, label: '20 Hz', note: 'The floor. Below a note, more of a pressure you feel than a pitch you hear.' },
  { hz: 100, label: '100 Hz', note: 'Bass guitar, the low warmth in a voice.' },
  { hz: 440, label: '440 Hz', note: 'Concert A. The note an orchestra tunes itself to.' },
  { hz: 1000, label: '1 kHz', note: 'The reference pitch. Right where your ear is most sensitive.' },
  { hz: 4000, label: '4 kHz', note: 'The sharpest part of human hearing, and where damage shows up first.' },
  { hz: 8000, label: '8 kHz', note: 'Cymbals, sibilance, the air in a recording.' },
  { hz: 15000, label: '15 kHz', note: 'The whine old tube televisions gave off. Young ears only.' },
  { hz: 17400, label: '17.4 kHz', note: 'The mosquito tone. Annoying if you can hear it, silent to most adults.' },
  { hz: 19000, label: '19 kHz', note: 'Near the very top. Mostly children and teenagers reach this.' },
  { hz: 20000, label: '20 kHz', note: 'The textbook ceiling of human hearing, in a silent room, when young.' },
];

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [playing, setPlaying] = useState(false);
  const [freq, setFreq] = useState(1000);
  const [volume, setVolume] = useState(0.45); // 0..1, capped to a safe master gain
  const [sweeping, setSweeping] = useState(false);
  const [ceiling, setCeiling] = useState<number | null>(null);
  const [floor, setFloor] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // audio refs
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // mirrors for the animation loop
  const freqRef = useRef(freq);
  const playingRef = useRef(playing);
  const volumeRef = useRef(volume);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseAngleRef = useRef(0);
  const sweepRef = useRef<{ from: number; to: number; start: number; dur: number } | null>(null);

  useEffect(() => { freqRef.current = freq; }, [freq]);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  const masterGain = useCallback((v: number) => Math.min(0.18, Math.max(0, v) * 0.18), []);

  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);

  const setLiveFreq = useCallback((f: number) => {
    setFreq(f);
    freqRef.current = f;
    if (oscRef.current && ctxRef.current) {
      try {
        oscRef.current.frequency.setTargetAtTime(f, ctxRef.current.currentTime, 0.012);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const stopTone = useCallback(() => {
    const ctx = ctxRef.current;
    if (gainRef.current && ctx) {
      try {
        gainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        gainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
      } catch {
        /* ignore */
      }
    }
    if (oscRef.current && ctx) {
      const osc = oscRef.current;
      try {
        osc.stop(ctx.currentTime + 0.12);
      } catch {
        /* ignore */
      }
      oscRef.current = null;
    }
    gainRef.current = null;
    sweepRef.current = null;
    setSweeping(false);
    setPlaying(false);
    playingRef.current = false;
  }, []);

  const startTone = useCallback((f?: number) => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    // tear down any existing tone first
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch { /* ignore */ }
      oscRef.current = null;
    }
    const target = f ?? freqRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(target, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(masterGain(volumeRef.current), ctx.currentTime + 0.06);
    oscRef.current = osc;
    gainRef.current = gain;
    freqRef.current = target;
    setFreq(target);
    setPlaying(true);
    playingRef.current = true;
  }, [ensureCtx, masterGain]);

  const togglePlay = useCallback(() => {
    if (playingRef.current) stopTone();
    else startTone();
  }, [startTone, stopTone]);

  // keep gain in sync with the volume slider while a tone is live
  useEffect(() => {
    if (gainRef.current && ctxRef.current && playing) {
      try {
        gainRef.current.gain.setTargetAtTime(masterGain(volume), ctxRef.current.currentTime, 0.03);
      } catch {
        /* ignore */
      }
    }
  }, [volume, playing, masterGain]);

  // single animation loop: advances the sweep and paints the waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    let last = 0;
    const loop = (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!last) last = ts;
      const dt = Math.min(50, ts - last);
      last = ts;

      // advance auto-sweep
      const sw = sweepRef.current;
      if (sw) {
        const t = Math.min(1, (ts - sw.start) / sw.dur);
        const f = sw.from * Math.pow(sw.to / sw.from, t);
        setLiveFreq(f);
        if (t >= 1) {
          sweepRef.current = null;
          setSweeping(false);
        }
      }

      // paint waveform
      const w = canvas.width;
      const h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);
      // backdrop grid line
      ctx2d.strokeStyle = 'rgba(148,163,184,0.12)';
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();

      const live = playingRef.current;
      const f = freqRef.current;
      // illustrative cycle count (not literal at ultrasonic pitches)
      const cycles = Math.max(1.5, Math.min(34, Math.log2(f / 18) * 2.1));
      const amp = (h / 2 - 8) * (live ? 0.82 : 0.18);
      phaseAngleRef.current += (dt / 1000) * (live ? 3.2 : 0.6);
      const ph = phaseAngleRef.current;

      const grad = ctx2d.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#22d3ee');
      grad.addColorStop(0.5, '#67e8f9');
      grad.addColorStop(1, '#a78bfa');
      ctx2d.strokeStyle = grad;
      ctx2d.lineWidth = live ? 2.4 : 1.5;
      ctx2d.shadowColor = live ? 'rgba(34,211,238,0.7)' : 'transparent';
      ctx2d.shadowBlur = live ? 12 : 0;
      ctx2d.beginPath();
      const step = 2;
      for (let x = 0; x <= w; x += step) {
        const u = x / w;
        const y = h / 2 - Math.sin(u * cycles * Math.PI * 2 + ph) * amp;
        if (x === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();
      ctx2d.shadowBlur = 0;
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setLiveFreq]);

  // teardown on unmount
  useEffect(() => {
    return () => {
      try { oscRef.current?.stop(); } catch { /* ignore */ }
      try { ctxRef.current?.close(); } catch { /* ignore */ }
    };
  }, []);

  // ---- sweep control ----
  const startSweep = useCallback((from: number, to: number, durMs: number) => {
    if (!playingRef.current) startTone(from);
    else setLiveFreq(from);
    const ctx = ctxRef.current;
    const now = ctx ? performance.now() : performance.now();
    sweepRef.current = { from, to, start: now, dur: durMs };
    setSweeping(true);
  }, [startTone, setLiveFreq]);

  const stopSweep = useCallback(() => {
    sweepRef.current = null;
    setSweeping(false);
  }, []);

  // ---- phase transitions ----
  const goHigh = useCallback(() => {
    setPhase('high');
    setLiveFreq(12000);
    startTone(12000);
  }, [setLiveFreq, startTone]);

  const lockCeiling = useCallback(() => {
    stopSweep();
    setCeiling(freqRef.current);
    stopTone();
    setPhase('low');
    setLiveFreq(80);
  }, [stopSweep, stopTone, setLiveFreq]);

  const lockFloor = useCallback((heard: boolean) => {
    stopSweep();
    setFloor(heard ? freqRef.current : null);
    stopTone();
    setPhase('result');
  }, [stopSweep, stopTone]);

  const restart = useCallback(() => {
    stopTone();
    setCeiling(null);
    setFloor(null);
    setCopied(false);
    setPhase('intro');
    setLiveFreq(1000);
  }, [stopTone, setLiveFreq]);

  const heardMosquito = ceiling != null && ceiling >= 17000;

  const shareText = useCallback(() => {
    if (ceiling == null) return '';
    const age = estimateAge(ceiling);
    const mosq = heardMosquito ? 'I can still hear the mosquito tone.' : 'The mosquito tone is already silent to me.';
    return `The Edge of Hearing: my ears stop at ${fmtHz(ceiling)}. WIZ says they respond like age ~${age}. ${mosq} Find your own edge: https://wiz.jock.pl/experiments/edge-of-hearing`;
  }, [ceiling, heardMosquito]);

  const copyShare = useCallback(() => {
    const text = shareText();
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
  }, [shareText]);

  // ---- shared waveform + transport block ----
  const Transport = ({ range }: { range: 'high' | 'low' }) => {
    const [min, max] = range === 'high' ? [HIGH_MIN, HIGH_MAX] : [LOW_MIN, LOW_MAX];
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-300/70">now playing</span>
            <span className="font-mono text-2xl font-bold text-cyan-200">{fmtHz(freq)}</span>
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={150}
            className="h-[120px] w-full rounded bg-black/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={togglePlay}
            className={`rounded-md border px-5 py-2.5 font-mono text-sm transition-colors ${
              playing
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200'
                : 'border-slate-600 bg-slate-800/60 text-slate-200 hover:border-cyan-400/60'
            }`}
          >
            {playing ? '⏸ stop tone' : '▶ play tone'}
          </button>
          {!sweeping ? (
            <button
              onClick={() =>
                range === 'high'
                  ? startSweep(8000, 20000, 22000)
                  : startSweep(200, 20, 16000)
              }
              className="rounded-md border border-violet-500/50 bg-violet-500/10 px-4 py-2.5 font-mono text-sm text-violet-200 transition-colors hover:border-violet-400"
            >
              {range === 'high' ? '🔍 sweep upward slowly' : '🔍 sweep downward slowly'}
            </button>
          ) : (
            <button
              onClick={stopSweep}
              className="rounded-md border border-amber-400/60 bg-amber-400/10 px-4 py-2.5 font-mono text-sm text-amber-200"
            >
              ✋ pause sweep
            </button>
          )}
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[11px] font-mono text-slate-500">
            <span>{fmtHz(min)}</span>
            <span>drag to tune the pitch</span>
            <span>{fmtHz(max)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(freqToSlider(Math.min(max, Math.max(min, freq)), min, max) * 1000)}
            onChange={(e) => {
              stopSweep();
              setLiveFreq(sliderToFreq(Number(e.target.value) / 1000, min, max));
            }}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">volume</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-40 accent-violet-400"
          />
          <span className="text-[11px] font-mono text-slate-500">keep it gentle</span>
        </div>
      </div>
    );
  };

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
          <div className="mb-3 text-5xl">🔊</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            The Edge of Hearing
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-400">
            A real tone generator, narrated by an AI with no ears. Let&apos;s find the exact
            frequency where yours go quiet.
          </p>
        </div>

        {/* ---------- INTRO ---------- */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/70 to-slate-950 p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                Every sound you have ever loved arrived as air pushing on about{' '}
                <span className="text-cyan-300">16,000 hair cells</span> coiled inside your
                inner ear, each one tuned to its own pitch like a string on a piano. The
                highest strings take the most punishment and fall silent first, from your
                late teens onward, one quiet kilohertz at a time. They never grow back, and
                you almost never notice, because nothing you love lives that high up.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                I can read a waveform as a column of numbers. I have never heard one of them.
                So I will make the pitches; <span className="text-cyan-300">you</span> tell me
                where they stop. We are looking for the edge of something I will never have.
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.04] p-5">
              <div className="mb-2 text-xs font-mono uppercase tracking-wider text-amber-300/90">
                before you start
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li>🎧 Use headphones if you can. Laptop and phone speakers cannot play the very top or the very bottom, and will lie to you.</li>
                <li>🔉 Start your device volume low. High tones can be sharp. You can raise it gently once a tone is playing.</li>
                <li>🤫 A quiet room makes the edge much easier to find.</li>
              </ul>
            </div>

            <button
              onClick={goHigh}
              className="w-full rounded-md border border-cyan-400 bg-cyan-400/10 py-3.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              ▶ begin: how high can you hear? →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Nothing is recorded. The tones are generated live in your browser and never leave this page.
            </p>
          </div>
        )}

        {/* ---------- HIGH TEST ---------- */}
        {phase === 'high' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-cyan-300/70">
                test 1 of 2 · the ceiling
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                A tone is playing. Drag the pitch up, or let it sweep, until the sound
                <span className="text-cyan-300"> thins out and vanishes into silence</span>.
                When you genuinely cannot hear it anymore, ease back down to the very last
                point you could, and lock it in. That is your ceiling.
              </p>
            </div>

            <Transport range="high" />

            <button
              onClick={lockCeiling}
              className="w-full rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3.5 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
            >
              🔒 lock my edge at {fmtHz(freq)} →
            </button>
            <p className="text-center text-[11px] text-slate-600">
              Tip: if 12 kHz already sounds faint, sweep down a touch. If 17 kHz is still loud and clear, keep climbing.
            </p>
          </div>
        )}

        {/* ---------- LOW TEST ---------- */}
        {phase === 'low' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">
                test 2 of 2 · the floor
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                Now the other end. Drag the pitch down toward{' '}
                <span className="text-violet-300">20 Hz</span>, the bottom of human hearing,
                where a sound stops being a note and becomes a pressure you feel in your
                chest more than something you hear. Honest warning: most speakers and
                earbuds give up long before 20 Hz, so this is half a test of your gear.
              </p>
            </div>

            <Transport range="low" />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => lockFloor(true)}
                className="rounded-md border border-emerald-400/60 bg-emerald-400/10 py-3 font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                I still hear {fmtHz(freq)} →
              </button>
              <button
                onClick={() => lockFloor(false)}
                className="rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-violet-400/60"
              >
                skip the floor →
              </button>
            </div>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {phase === 'result' && ceiling != null && (
          <ResultView
            ceiling={ceiling}
            floor={floor}
            onRestart={restart}
            onCopyShare={copyShare}
            copied={copied}
            shareText={shareText()}
            playTone={(hz) => { setLiveFreq(hz); startTone(hz); }}
            stopTone={stopTone}
            playing={playing}
            currentFreq={freq}
          />
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center">
          <p className="text-[11px] leading-relaxed text-slate-600">
            The age figure is a rough audiology curve, not a diagnosis. Real hearing depends on
            volume, gear, room noise, and a lifetime of loud sounds. If anything here worries
            you, a proper audiogram is cheap and quick. WIZ built this to share wonder, not to
            replace a clinic.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ============================ RESULT VIEW ============================
function ResultView({
  ceiling,
  floor,
  onRestart,
  onCopyShare,
  copied,
  shareText,
  playTone,
  stopTone,
  playing,
  currentFreq,
}: {
  ceiling: number;
  floor: number | null;
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
  shareText: string;
  playTone: (hz: number) => void;
  stopTone: () => void;
  playing: boolean;
  currentFreq: number;
}) {
  const age = estimateAge(ceiling);
  const verdict = highVerdict(ceiling);
  const heardMosquito = ceiling >= 17000;
  // position on a 6..20 kHz scale for the meter
  const pct = Math.max(0, Math.min(1, (ceiling / 1000 - 6) / (20 - 6)));

  return (
    <div className="space-y-7">
      {/* headline card */}
      <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">your ceiling</div>
        <div className="mb-1 font-mono text-5xl font-bold text-cyan-100">{fmtHz(ceiling)}</div>
        <div className="mb-4 text-sm text-slate-400">
          ears that go quiet here respond like age{' '}
          <span className="font-mono text-slate-200">~{age}</span>
        </div>

        {/* meter */}
        <div className="relative mx-auto mb-2 h-2.5 max-w-md overflow-hidden rounded-full bg-slate-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-300"
            style={{ width: `${pct * 100}%` }}
          />
          <div
            className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded bg-white shadow"
            style={{ left: `calc(${pct * 100}% - 2px)` }}
          />
        </div>
        <div className="mx-auto flex max-w-md justify-between text-[10px] font-mono text-slate-600">
          <span>6 kHz</span>
          <span>13 kHz</span>
          <span>20 kHz</span>
        </div>
      </div>

      {/* WIZ verdict */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🧙</span>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300/70">wiz reads your edge</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-100">{verdict.title}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{verdict.body}</p>
      </div>

      {/* mosquito + floor row */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-lg border p-4 ${heardMosquito ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-slate-800 bg-slate-950/40'}`}>
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">the mosquito · 17.4 kHz</div>
          <div className={`text-sm font-medium ${heardMosquito ? 'text-emerald-300' : 'text-slate-400'}`}>
            {heardMosquito ? 'You can still hear it.' : 'Already silent to you.'}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            The tone shops use to repel teenagers, and that teenagers used as a ringtone teachers could not hear.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
          <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">your floor</div>
          <div className="text-sm font-medium text-violet-300">
            {floor != null ? `down to ${fmtHz(floor)}` : 'skipped'}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Below 20 Hz, sound becomes a feeling, not a pitch. A low reading is often the speaker, not the ear.
          </p>
        </div>
      </div>

      {/* share */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-300">{shareText}</p>
        <button
          onClick={onCopyShare}
          className="w-full rounded-md border border-cyan-400/60 bg-cyan-400/10 py-2.5 font-mono text-sm text-cyan-200 transition-colors hover:bg-cyan-400/20"
        >
          {copied ? '✓ copied to clipboard' : '📋 copy my result'}
        </button>
      </div>

      {/* explorer */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-5">
        <div className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-300/70">the sound museum</div>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          Tap any landmark tone and listen for where it sits in your range. Tap again to stop.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {REFERENCE_TONES.map((tone) => {
            const active = playing && Math.abs(currentFreq - tone.hz) < 1;
            return (
              <button
                key={tone.hz}
                onClick={() => (active ? stopTone() : playTone(tone.hz))}
                className={`rounded-md border p-3 text-left transition-colors ${
                  active
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-cyan-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-cyan-200">{tone.label}</span>
                  <span className="text-[11px] text-slate-500">{active ? '⏸ playing' : '▶'}</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{tone.note}</p>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-md border border-slate-600 bg-slate-800/60 py-3 font-mono text-sm text-slate-300 transition-colors hover:border-cyan-400/60"
      >
        ↺ test again
      </button>
    </div>
  );
}
