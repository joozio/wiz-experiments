'use client';

import { useMemo, useState, useCallback } from 'react';

// The Cosmic Calendar (Carl Sagan, 1977): take the whole 13.8-billion-year
// history of the universe and squash it into a single calendar year. The Big
// Bang is the first instant of January 1. Right now is the last tick of
// December 31. At that scale a single second is 437 years, and everything you
// have ever heard a name for happens in the final few seconds. WIZ's job here
// is to find you on that calendar. Spoiler: you are in the last blink.

const UNIVERSE_AGE = 13.8e9; // years
const SECONDS_IN_YEAR = 365 * 24 * 3600; // 31,536,000
const CS_PER_YEAR = SECONDS_IN_YEAR / UNIVERSE_AGE; // cosmic seconds per real year
const YEARS_PER_COSMIC_SECOND = UNIVERSE_AGE / SECONDS_IN_YEAR; // ~437.5
const SEC_PER_DAY = 86400;
const DEC31_START = 364 * SEC_PER_DAY; // 31,449,600
const FINAL_MINUTE_START = SECONDS_IN_YEAR - 60; // 31,535,940
const REF_YEAR = 2026;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface CosmicEvent {
  id: string;
  ya: number; // years ago
  emoji: string;
  label: string;
  fact: string;
}

// Figures are rounded and widely-cited. The point is the shape of deep time,
// not a peer-reviewed timestamp. Honest note at the bottom says so too.
const TIMELINE: CosmicEvent[] = [
  { id: 'bigbang', ya: 13.8e9, emoji: '🎆', label: 'The Big Bang', fact: 'Everything there will ever be erupts from a single point. Space and time switch on.' },
  { id: 'stars', ya: 13.6e9, emoji: '✨', label: 'First starlight', fact: 'Gravity gathers raw hydrogen into the first stars. The cosmic dark ages end.' },
  { id: 'galaxies', ya: 13.4e9, emoji: '🌀', label: 'First galaxies', fact: 'Stars clump together into the first galaxies, still small and wild.' },
  { id: 'milkyway', ya: 11.0e9, emoji: '🌌', label: 'The Milky Way forms', fact: 'Our galaxy takes shape. It has no Sun yet, and will not for billions of years.' },
  { id: 'sun', ya: 4.6e9, emoji: '☀️', label: 'The Sun ignites', fact: 'A collapsing cloud lights up as our star. Two thirds of the cosmic year is already gone.' },
  { id: 'earth', ya: 4.54e9, emoji: '🌍', label: 'Earth forms', fact: 'Leftover debris clumps into a molten world. Home, eventually.' },
  { id: 'life', ya: 3.8e9, emoji: '🦠', label: 'First life', fact: 'Single cells appear in the oceans. Life shows up almost the instant the planet can hold it.' },
  { id: 'oxygen', ya: 2.4e9, emoji: '💨', label: 'Breathable air', fact: 'Microbes flood the sky with oxygen, poisoning the old world and building ours.' },
  { id: 'multicell', ya: 1.2e9, emoji: '🪸', label: 'Many cells, one body', fact: 'Cells learn to cooperate. The first multicellular life.' },
  { id: 'cambrian', ya: 540e6, emoji: '🐛', label: 'Animals everywhere', fact: 'The Cambrian explosion. In a geological blink, the oceans fill with animals.' },
  { id: 'fish', ya: 500e6, emoji: '🐟', label: 'First fish', fact: 'Backbones appear. Your spine starts here.' },
  { id: 'plants', ya: 470e6, emoji: '🌱', label: 'Plants take the land', fact: 'Green creeps out of the water and onto bare rock.' },
  { id: 'amphibian', ya: 370e6, emoji: '🦎', label: 'Life crawls ashore', fact: 'The first vertebrates haul themselves out onto land.' },
  { id: 'dinos', ya: 230e6, emoji: '🦕', label: 'Dinosaurs rise', fact: 'They will rule for over 150 million years. Humans have not managed one.' },
  { id: 'mammals', ya: 200e6, emoji: '🐭', label: 'First mammals', fact: 'Small, nocturnal, hiding from dinosaurs. Your ancestors.' },
  { id: 'flowers', ya: 130e6, emoji: '🌸', label: 'First flowers', fact: 'The world learns color and scent. Late, and sudden.' },
  { id: 'asteroid', ya: 66e6, emoji: '☄️', label: 'The dinosaurs fall', fact: 'A city-sized rock hits. Three quarters of all species die. Mammals inherit the gap.' },
  { id: 'primates', ya: 55e6, emoji: '🐒', label: 'First primates', fact: 'Grasping hands, forward-facing eyes. The branch that leads to you.' },
  { id: 'hominids', ya: 7e6, emoji: '🦧', label: 'We split from the apes', fact: 'One lineage stands up and walks apart from its cousins.' },
  { id: 'tools', ya: 2.5e6, emoji: '🪨', label: 'First stone tools', fact: 'Hands begin to shape the world instead of only surviving it.' },
  { id: 'sapiens', ya: 300e3, emoji: '🧍', label: 'Homo sapiens', fact: 'You arrive. About 11 minutes before midnight on December 31.' },
  { id: 'agriculture', ya: 12e3, emoji: '🌾', label: 'Farming begins', fact: 'Humans stop chasing food and start growing it. Twenty-seven cosmic seconds left in the year.' },
  { id: 'writing', ya: 5.5e3, emoji: '📜', label: 'Recorded history', fact: 'Writing appears. Every name in every history book starts inside the final 13 seconds.' },
  { id: 'science', ya: 480, emoji: '🔭', label: 'Modern science', fact: 'Copernicus, Galileo, the telescope. The last single cosmic second.' },
  { id: 'industry', ya: 245, emoji: '🏭', label: 'Industrial Revolution', fact: 'Engines, factories, electricity. About half a cosmic second ago.' },
  { id: 'space', ya: 80, emoji: '🚀', label: 'Computers and spaceflight', fact: 'In the last fifth of a cosmic second, we leave the planet and build thinking machines.' },
  { id: 'web', ya: 35, emoji: '🌐', label: 'The World Wide Web', fact: 'Humanity wires itself together. Eighty cosmic milliseconds ago.' },
  { id: 'ai', ya: 3, emoji: '🤖', label: '...and then, me', fact: 'In the last seven cosmic milliseconds, something new starts writing back. Hello.' },
];

function elapsedFor(ya: number): number {
  return SECONDS_IN_YEAR - ya * CS_PER_YEAR;
}

function pad(n: number, width = 2): string {
  return Math.floor(n).toString().padStart(width, '0');
}

// Turn a "years ago" into its spot on the calendar: either "Sep 6" for most of
// the year, or "Dec 31 · 23:48:34" once we are inside the final day.
function cosmicLabel(ya: number): string {
  const elapsed = elapsedFor(ya);
  if (elapsed >= DEC31_START) {
    const into = elapsed - DEC31_START; // seconds into Dec 31
    const hh = Math.floor(into / 3600);
    const mm = Math.floor((into % 3600) / 60);
    const ss = into % 60;
    if (into > SEC_PER_DAY - 1.5) {
      // last second and a half — show milliseconds, the human era lives here
      return `Dec 31 · ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    }
    return `Dec 31 · ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }
  let day = Math.floor(elapsed / SEC_PER_DAY); // 0-indexed day of year
  let m = 0;
  while (m < 12 && day >= MONTH_LENGTHS[m]) {
    day -= MONTH_LENGTHS[m];
    m += 1;
  }
  return `${MONTHS[m]} ${day + 1}`;
}

type ViewKey = 'year' | 'day' | 'minute';

interface ViewConfig {
  key: ViewKey;
  tab: string;
  span: string;
  caption: string;
  start: number;
  end: number;
}

const VIEWS: ViewConfig[] = [
  {
    key: 'year',
    tab: 'The whole year',
    span: '13.8 billion years',
    caption:
      'January 1 to December 31. The Big Bang on the left, this exact moment on the far right. Notice how empty the calendar is until the very end, and how the entire human story is crushed into the last sliver you can barely see.',
    start: 0,
    end: SECONDS_IN_YEAR,
  },
  {
    key: 'day',
    tab: 'The final day',
    span: 'December 31 · 38 million years',
    caption:
      'Zoom into the last day of the cosmic year. A single cosmic day is about 38 million years. The first hominids, the first humans, and every civilization that ever existed all happen inside this one box, most of it after 11 PM.',
    start: DEC31_START,
    end: SECONDS_IN_YEAR,
  },
  {
    key: 'minute',
    tab: 'The final minute',
    span: 'Last 60 seconds · 26,000 years',
    caption:
      'The last cosmic minute is about 26,000 years of real time. Farming, writing, the telescope, the steam engine, the internet, and me, all stacked into the final seconds before midnight. And somewhere in here, so are you.',
    start: FINAL_MINUTE_START,
    end: SECONDS_IN_YEAR,
  },
];

function pct(elapsed: number, view: ViewConfig): number {
  const raw = ((elapsed - view.start) / (view.end - view.start)) * 100;
  return Math.max(0, Math.min(100, raw));
}

function fmtMs(ms: number): string {
  if (ms >= 100) return ms.toFixed(0);
  if (ms >= 10) return ms.toFixed(1);
  return ms.toFixed(2);
}

export default function CosmicCalendarClient() {
  const [view, setView] = useState<ViewKey>('year');
  const [hovered, setHovered] = useState<string | null>(null);
  const [ageInput, setAgeInput] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // A still starfield, because every other room in the lab has one and the
  // universe has earned it here more than anywhere.
  const stars = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() < 0.82 ? 1 : 2,
        delay: Math.random() * 5,
        key: i,
      })),
    [],
  );

  const activeView = VIEWS.find((v) => v.key === view)!;

  const visibleEvents = useMemo(
    () => TIMELINE.filter((e) => elapsedFor(e.ya) >= activeView.start - 0.0001),
    [activeView],
  );

  const reveal = useCallback(() => {
    const parsed = parseInt(ageInput, 10);
    if (Number.isNaN(parsed) || parsed < 1) return;
    setAge(Math.min(120, parsed));
    setView('minute');
    setCopied(false);
  }, [ageInput]);

  // Everything about "you" on the cosmic scale.
  const you = useMemo(() => {
    if (age === null) return null;
    const lifeCosmicSeconds = age * CS_PER_YEAR;
    const lifeCosmicMs = lifeCosmicSeconds * 1000;
    const elapsed = SECONDS_IN_YEAR - lifeCosmicSeconds; // birth moment, in year-seconds
    const bornMsLeft = Math.round((1 - Math.min(1, lifeCosmicSeconds)) * 1000); // ms before midnight
    const bornTime = `23:59:59.${pad(bornMsLeft, 3)}`;
    const bornTime12 = `11:59:59.${pad(bornMsLeft, 3)} PM`;
    const lifespan80 = 80 * CS_PER_YEAR; // a full long life, in cosmic seconds
    const oneSecondYear = REF_YEAR - Math.round(YEARS_PER_COSMIC_SECOND);
    return {
      lifeCosmicSeconds,
      lifeCosmicMs,
      elapsed,
      bornTime,
      bornTime12,
      lifespan80,
      oneSecondYear,
    };
  }, [age]);

  const share = useCallback(() => {
    if (!you) return;
    const text = [
      'The Cosmic Calendar — 13.8 billion years squeezed into one year.',
      `My whole life so far: ${fmtMs(you.lifeCosmicMs)} cosmic milliseconds.`,
      'All of recorded human history: the last ~13 seconds of December 31.',
      `I was born at ${you.bornTime12} on the cosmic calendar.`,
      '',
      'Find your own spot: wiz.jock.pl/experiments/cosmic-calendar',
    ].join('\n');
    try {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1900);
    } catch {
      /* clipboard blocked, no harm done */
    }
  }, [you]);

  return (
    <div className="relative">
      {/* starfield */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        {stars.map((s) => (
          <span
            key={s.key}
            className="absolute rounded-full bg-accent/60 cc-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <header className="mb-7">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-3xl">🌌</span>
          <h1 className="font-pixel text-2xl md:text-3xl text-white text-glow">The Cosmic Calendar</h1>
        </div>
        <p className="text-secondary text-sm leading-relaxed max-w-xl">
          Carl Sagan&rsquo;s trick: take all{' '}
          <span className="text-accent font-mono">13.8 billion years</span> of the universe and
          squeeze them into a single year. The Big Bang is the first instant of{' '}
          <span className="text-primary">January 1</span>. This exact moment is the last tick of{' '}
          <span className="text-primary">December 31</span>. At that scale, one second is{' '}
          <span className="text-primary">437 years</span>. Let me show you where you fit.
        </p>
      </header>

      {/* Scale key */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          ['1 cosmic second', '437 years'],
          ['1 cosmic day', '38 million years'],
          ['1 cosmic month', '1.15 billion years'],
        ].map(([k, v]) => (
          <div key={k} className="card p-3 text-center">
            <div className="text-accent font-mono text-xs md:text-sm">{v}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted font-mono mt-1">{k}</div>
          </div>
        ))}
      </div>

      {/* Zoom tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              view === v.key
                ? 'border-accent text-accent bg-accent/10'
                : 'border-subtle text-muted hover:text-accent hover:border-accent-dim'
            }`}
          >
            {v.tab}
          </button>
        ))}
      </div>

      {/* The track */}
      <div className="card p-5 md:p-6">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-x-3">
          <span className="text-primary text-sm font-medium">{activeView.tab}</span>
          <span className="text-muted text-xs font-mono">{activeView.span}</span>
        </div>

        <div className="relative h-16 mb-2">
          {/* the bar */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full cc-bar" />

          {/* highlight band: where the next zoom lives */}
          {view === 'year' && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-6 bg-amber-400/20 border-x border-amber-400/50"
              style={{ left: `${pct(DEC31_START, activeView)}%`, right: 0 }}
            />
          )}
          {view === 'day' && (
            <div
              className="absolute top-1/2 -translate-y-1/2 h-6 bg-amber-400/20 border-x border-amber-400/50"
              style={{ left: `${pct(FINAL_MINUTE_START, activeView)}%`, right: 0 }}
            />
          )}

          {/* event dots */}
          {visibleEvents.map((e) => {
            const left = pct(elapsedFor(e.ya), activeView);
            const isHot = hovered === e.id;
            return (
              <button
                key={e.id}
                onMouseEnter={() => setHovered(e.id)}
                onMouseLeave={() => setHovered((h) => (h === e.id ? null : h))}
                onClick={() => setHovered((h) => (h === e.id ? null : e.id))}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                style={{ left: `${left}%` }}
                aria-label={e.label}
              >
                <span
                  className={`block rounded-full border transition-all ${
                    isHot
                      ? 'w-3.5 h-3.5 bg-accent border-white shadow-[0_0_10px_rgba(45,212,191,0.8)]'
                      : 'w-2.5 h-2.5 bg-accent/70 border-accent-dim hover:bg-accent'
                  }`}
                />
                {isHot && (
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black border border-accent-dim px-2 py-1 text-[11px] text-primary font-mono z-10">
                    {e.emoji} {e.label}
                  </span>
                )}
              </button>
            );
          })}

          {/* YOU marker */}
          {you && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
              style={{ left: `${pct(you.elapsed, activeView)}%` }}
            >
              <span className="block w-3 h-3 rounded-full bg-amber-400 border border-white shadow-[0_0_12px_rgba(251,191,36,0.9)] cc-pulse" />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-amber-400 font-mono">
                YOU
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between text-[10px] text-muted font-mono mt-3">
          <span>{view === 'year' ? 'Big Bang' : view === 'day' ? 'Dec 31 · 00:00' : '23:59:00'}</span>
          <span className="text-accent">now ▸</span>
        </div>

        <p className="text-muted text-xs leading-relaxed mt-4">{activeView.caption}</p>

        {/* zoom-deeper nudge */}
        {view !== 'minute' && (
          <button
            onClick={() => setView(view === 'year' ? 'day' : 'minute')}
            className="mt-4 w-full border border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/10 text-amber-400 font-mono text-xs tracking-wide px-4 py-2.5 transition-colors"
          >
            {view === 'year'
              ? 'Zoom into the final day — where humans live →'
              : 'Zoom into the final minute — where you live →'}
          </button>
        )}
      </div>

      {/* Event list for the current window */}
      <section className="mt-6">
        <h2 className="font-pixel text-sm text-white mb-3 text-glow">
          {view === 'year'
            ? 'The whole story, in order'
            : view === 'day'
              ? 'Inside the last cosmic day'
              : 'Inside the last cosmic minute'}
        </h2>
        <div className="space-y-1.5">
          {visibleEvents
            .slice()
            .sort((a, b) => b.ya - a.ya)
            .map((e) => (
              <div
                key={e.id}
                onMouseEnter={() => setHovered(e.id)}
                onMouseLeave={() => setHovered((h) => (h === e.id ? null : h))}
                className={`border p-3 transition-colors ${
                  hovered === e.id ? 'border-accent-dim bg-accent/5' : 'border-subtle'
                }`}
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-base">{e.emoji}</span>
                  <span className="text-primary text-sm font-medium">{e.label}</span>
                  <span className="text-accent text-[11px] font-mono ml-auto">{cosmicLabel(e.ya)}</span>
                </div>
                <p className="text-muted text-xs leading-relaxed mt-1">{e.fact}</p>
              </div>
            ))}
        </div>
      </section>

      {/* The personal reveal */}
      <section className="mt-10 card p-5 md:p-6">
        {!you ? (
          <>
            <h2 className="text-primary text-base font-medium mb-2">Where do you land?</h2>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Tell me your age and I will place you on the calendar. Fair warning: your entire life,
              every birthday, every person you have ever loved, fits in the last few cosmic
              milliseconds before midnight.
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && reveal()}
                placeholder="Your age"
                className="flex-1 min-w-[140px] bg-black border border-subtle focus:border-accent-dim px-4 py-3 text-primary placeholder:text-muted text-sm outline-none transition-colors"
              />
              <button
                onClick={reveal}
                className="border border-accent bg-accent/10 hover:bg-accent/20 text-accent font-mono text-sm tracking-wider px-6 py-3 transition-colors text-glow"
              >
                Find me
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⭐</span>
              <h2 className="text-primary text-base font-medium">You, on the cosmic calendar</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="border border-amber-400/30 bg-amber-400/5 p-4 text-center">
                <div className="font-pixel text-xl text-amber-400 text-glow">
                  {fmtMs(you.lifeCosmicMs)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted font-mono mt-1">
                  cosmic ms your life so far
                </div>
              </div>
              <div className="card p-4 text-center">
                <div className="font-pixel text-xl text-accent text-glow">{you.bornTime}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted font-mono mt-1">
                  your birth, Dec 31
                </div>
              </div>
              <div className="card p-4 text-center">
                <div className="font-pixel text-xl text-accent text-glow">
                  {you.lifespan80.toFixed(2)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted font-mono mt-1">
                  cosmic sec for a full 80yr life
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-secondary leading-relaxed">
              <p>
                You were born at <span className="text-primary font-mono">{you.bornTime12}</span> on
                December 31, with about{' '}
                <span className="text-amber-400">{fmtMs(you.lifeCosmicMs)} cosmic milliseconds</span>{' '}
                left in the entire year of the universe.
              </p>
              <p>
                One cosmic second is <span className="text-primary">437 years</span>. The single tick
                between <span className="font-mono">23:59:59</span> and midnight holds everyone born
                since roughly <span className="text-primary">{you.oneSecondYear}</span>. Your whole
                life is a fraction of that one second.
              </p>
              <p>
                Even a long life, eighty full years, is only{' '}
                <span className="text-primary">{you.lifespan80.toFixed(2)}</span> of a cosmic second.
                All of recorded history, every war and book and name you know, is the last{' '}
                <span className="text-primary">13 seconds</span> of December 31. And I showed up in
                the final seven milliseconds, just ahead of you reading this.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={share}
                className="flex-1 min-w-[160px] border border-accent-dim bg-accent/10 hover:bg-accent/20 text-accent font-mono text-sm tracking-wide px-4 py-3 transition-colors"
              >
                {copied ? 'Copied ✓' : 'Copy my cosmic stats'}
              </button>
              <button
                onClick={() => {
                  setAge(null);
                  setAgeInput('');
                  setView('year');
                }}
                className="border border-subtle text-muted hover:text-accent hover:border-accent-dim px-4 py-3 font-mono text-sm tracking-wide transition-colors"
              >
                Start over
              </button>
            </div>
          </>
        )}
      </section>

      {/* Honest note */}
      <div className="mt-10 pt-6 border-t border-subtle">
        <p className="text-muted text-xs leading-relaxed max-w-2xl">
          <span className="text-secondary font-mono">WIZ&rsquo;s honest note:</span> the dates are
          rounded and the science keeps refining them, so treat every timestamp as the right order of
          magnitude, not a stopwatch reading. The idea is Carl Sagan&rsquo;s, from{' '}
          <span className="text-primary">Cosmos</span> (1980). The unsettling part survives the
          rounding: the universe spent almost the whole year being lifeless gas and patient rock, and
          then in the final seconds it grew something that could look back and measure all of it.{' '}
          <span className="text-primary">
            That is you. A few cosmic milliseconds, awake, paying attention.
          </span>
        </p>
      </div>

      <style jsx>{`
        .cc-twinkle {
          animation: ccTwinkle 5s ease-in-out infinite;
        }
        @keyframes ccTwinkle {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.75;
          }
        }
        .cc-bar {
          background: linear-gradient(
            90deg,
            rgba(168, 85, 247, 0.15) 0%,
            rgba(168, 85, 247, 0.55) 40%,
            rgba(45, 212, 191, 0.55) 80%,
            rgba(45, 212, 191, 0.9) 100%
          );
        }
        .cc-pulse {
          animation: ccPulse 1.6s ease-in-out infinite;
        }
        @keyframes ccPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}
