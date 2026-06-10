'use client';

// THE HALO EFFECT
// Thorndike (1920) named the effect. Asch (1946) made it obvious:
// swap one word like warm/cold and people rewrite the whole stranger.
// WIZ note: humans do not meet people cleanly. You meet one adjective,
// then autocomplete a soul around it.

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type DimensionKey = 'trust' | 'competence' | 'closeness';
type Tone = 'halo' | 'horn';

interface Dimension {
  key: DimensionKey;
  label: string;
  prompt: string;
  low: string;
  high: string;
}

interface Dossier {
  id: string;
  pairId: string;
  pairLabel: string;
  context: string;
  alias: string;
  emoji: string;
  frame: string;
  tone: Tone;
  opener: string;
  facts: string[];
  wizAside: string;
  reveal: string;
}

interface PairResult {
  pairId: string;
  pairLabel: string;
  frameA: string;
  frameB: string;
  positiveName: string;
  negativeName: string;
  positiveScore: number;
  negativeScore: number;
  rawGap: number;
  spread: number;
  reveal: string;
}

interface Profile {
  name: string;
  min: number;
  label: string;
  description: string;
  wizNote: string;
  shareLead: string;
}

type Response = Record<DimensionKey, number>;

const DIMENSIONS: Dimension[] = [
  {
    key: 'trust',
    label: 'Trust',
    prompt: 'Would you trust this person with something delicate?',
    low: 'not with keys',
    high: 'with keys + secrets',
  },
  {
    key: 'competence',
    label: 'Competence',
    prompt: 'Would you put them in charge of something important?',
    low: 'keep them away',
    high: 'run the whole thing',
  },
  {
    key: 'closeness',
    label: 'Orbit',
    prompt: 'Would you actually want them in your orbit?',
    low: 'arm\'s length',
    high: 'pull them closer',
  },
];

const DOSSIERS: Dossier[] = [
  {
    id: 'arden-warm',
    pairId: 'dinner',
    pairLabel: 'The Dinner Guest',
    context: 'DINNER',
    alias: 'Arden Vale',
    emoji: '🍷',
    frame: 'WARM',
    tone: 'halo',
    opener: 'The friend who introduced Arden used one word before anything else: warm.',
    facts: [
      'Arrived ten minutes early and remembered two names after hearing them once.',
      'Sent back the wrong bill without raising their voice.',
      'Asked direct questions and held eye contact when you answered.',
      'Left exactly when the table started getting tired.',
    ],
    wizAside:
      'This is almost unfair. Warm is the social master key. Humans hear it and start unlocking unrelated rooms.',
    reveal:
      'Only one word changed: warm vs cold. The facts underneath were identical.',
  },
  {
    id: 'leona-rigid',
    pairId: 'work',
    pairLabel: 'The Project Lead',
    context: 'WORK',
    alias: 'Leona Price',
    emoji: '🗂️',
    frame: 'RIGID',
    tone: 'horn',
    opener: 'The team describes Leona with one framing word before you meet her: rigid.',
    facts: [
      'Cut two features to hit the deadline and explained the tradeoff in one paragraph.',
      'Corrected a typo in the deck during rehearsal before anyone else noticed.',
      'Skipped the after-work drinks and went home.',
      'Keeps a running checklist and updates it during meetings.',
    ],
    wizAside:
      'Office behavior is especially vulnerable to framing. Discipline looks noble or unbearable depending on the scent sprayed on it.',
    reveal:
      'Only one word changed: precise vs rigid. Same behavior. Different perfume.',
  },
  {
    id: 'niko-spontaneous',
    pairId: 'weekend',
    pairLabel: 'The City Companion',
    context: 'WEEKEND',
    alias: 'Niko Voss',
    emoji: '🗺️',
    frame: 'SPONTANEOUS',
    tone: 'halo',
    opener: 'Your friend grins and says Niko is spontaneous before anything else.',
    facts: [
      'Changed the route after spotting a street market two stops away.',
      'Started talking to strangers at a cafe and came back with local recommendations.',
      'Forgot the umbrella but remembered the train times from memory.',
      'Booked the backup option in under a minute when the first plan fell through.',
    ],
    wizAside:
      'Spontaneous is impulsive with better lighting. I am interested in whether you notice.',
    reveal:
      'Only one word changed: spontaneous vs impulsive. The day itself stayed the same.',
  },
  {
    id: 'mina-cold',
    pairId: 'dinner',
    pairLabel: 'The Dinner Guest',
    context: 'DINNER',
    alias: 'Mina Holt',
    emoji: '🥂',
    frame: 'COLD',
    tone: 'horn',
    opener: 'The friend who introduced Mina used one word before anything else: cold.',
    facts: [
      'Arrived ten minutes early and remembered two names after hearing them once.',
      'Sent back the wrong bill without raising their voice.',
      'Asked direct questions and held eye contact when you answered.',
      'Left exactly when the table started getting tired.',
    ],
    wizAside:
      'Cold is the reverse master key. Same moves. New weather. Suddenly everyone starts reading malice into neutral geometry.',
    reveal:
      'Only one word changed: warm vs cold. The facts underneath were identical.',
  },
  {
    id: 'soren-precise',
    pairId: 'work',
    pairLabel: 'The Project Lead',
    context: 'WORK',
    alias: 'Soren Bell',
    emoji: '📐',
    frame: 'PRECISE',
    tone: 'halo',
    opener: 'The team describes Soren with one framing word before you meet him: precise.',
    facts: [
      'Cut two features to hit the deadline and explained the tradeoff in one paragraph.',
      'Corrected a typo in the deck during rehearsal before anyone else noticed.',
      'Skipped the after-work drinks and went home.',
      'Keeps a running checklist and updates it during meetings.',
    ],
    wizAside:
      'Precise is rigid after rebrand. Humans respect the same edges they resent, depending on the label on the folder.',
    reveal:
      'Only one word changed: precise vs rigid. Same behavior. Different perfume.',
  },
  {
    id: 'yael-impulsive',
    pairId: 'weekend',
    pairLabel: 'The City Companion',
    context: 'WEEKEND',
    alias: 'Yael Mercer',
    emoji: '🚇',
    frame: 'IMPULSIVE',
    tone: 'horn',
    opener: 'Your friend lowers their voice and says Yael is impulsive before anything else.',
    facts: [
      'Changed the route after spotting a street market two stops away.',
      'Started talking to strangers at a cafe and came back with local recommendations.',
      'Forgot the umbrella but remembered the train times from memory.',
      'Booked the backup option in under a minute when the first plan fell through.',
    ],
    wizAside:
      'Impulsive is spontaneous after a bad quarter. Same movement pattern. New moral coloring.',
    reveal:
      'Only one word changed: spontaneous vs impulsive. The day itself stayed the same.',
  },
];

const PROFILES: Profile[] = [
  {
    name: 'The Lens Cleaner',
    min: 0,
    label: 'optics under control',
    description:
      'Your first impressions leak surprisingly little. One adjective tried to tint the whole person and mostly failed.',
    wizNote:
      'You make strangers earn their mythology slowly. This is rare. Most humans let one word colonize the rest of the dossier.',
    shareLead: 'I scored Lens Cleaner',
  },
  {
    name: 'The Careful Reader',
    min: 10,
    label: 'small spillover',
    description:
      'The framing words moved you, but not by much. You felt the pull and kept checking the evidence.',
    wizNote:
      'This is solid operating discipline. You still generate stories, you just do not let them sprint unsupervised.',
    shareLead: 'I scored Careful Reader',
  },
  {
    name: 'The Story Builder',
    min: 20,
    label: 'narrative in progress',
    description:
      'A single adjective meaningfully rewrote the stranger for you. Not total takeover. Enough to matter.',
    wizNote:
      'You do what humans do best: turn sparse clues into coherent people. Efficient. Beautiful. Dangerous in groups.',
    shareLead: 'I scored Story Builder',
  },
  {
    name: 'The Aura Believer',
    min: 32,
    label: 'one word became a weather system',
    description:
      'The opening label spilled far beyond its jurisdiction. Warm became competent. Cold became suspect. Precise became admirable.',
    wizNote:
      'You do not just read a trait. You let it radiate. The halo is strong here. So is the horn.',
    shareLead: 'I scored Aura Believer',
  },
  {
    name: 'The One-Word Oracle',
    min: 46,
    label: 'autocomplete set to maximum',
    description:
      'One adjective was enough to rewrite nearly everything. Your brain met a label and printed a full person around it.',
    wizNote:
      'This is not stupidity. It is a compression algorithm with confidence issues. Efficient for survival. Catastrophic for fairness.',
    shareLead: 'I scored One-Word Oracle',
  },
];

const EMPTY_RESPONSE: Response = {
  trust: 50,
  competence: 50,
  closeness: 50,
};

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getProfile(spread: number): Profile {
  return PROFILES.reduce((best, profile) => (spread >= profile.min ? profile : best), PROFILES[0]);
}

function scoreColor(tone: Tone): string {
  return tone === 'halo'
    ? 'border-amber-400/40 bg-amber-400/[0.08] text-amber-300'
    : 'border-rose-400/40 bg-rose-400/[0.08] text-rose-300';
}

function scoreFill(tone: Tone): string {
  return tone === 'halo' ? 'bg-amber-400' : 'bg-rose-400';
}

export default function HaloEffectPage() {
  const [phase, setPhase] = useState<'intro' | 'cards' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>(() => DOSSIERS.map(() => ({ ...EMPTY_RESPONSE })));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'The Halo Effect - WIZ Experiment';
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const results = useMemo(() => {
    const pairIds = Array.from(new Set(DOSSIERS.map((dossier) => dossier.pairId)));
    const pairResults: PairResult[] = pairIds.map((pairId) => {
      const positiveIndex = DOSSIERS.findIndex((dossier) => dossier.pairId === pairId && dossier.tone === 'halo');
      const negativeIndex = DOSSIERS.findIndex((dossier) => dossier.pairId === pairId && dossier.tone === 'horn');
      const positiveDossier = DOSSIERS[positiveIndex];
      const negativeDossier = DOSSIERS[negativeIndex];
      const positiveScore = average(DIMENSIONS.map((dimension) => responses[positiveIndex][dimension.key]));
      const negativeScore = average(DIMENSIONS.map((dimension) => responses[negativeIndex][dimension.key]));
      const rawGap = positiveScore - negativeScore;

      return {
        pairId,
        pairLabel: positiveDossier.pairLabel,
        frameA: positiveDossier.frame,
        frameB: negativeDossier.frame,
        positiveName: positiveDossier.alias,
        negativeName: negativeDossier.alias,
        positiveScore,
        negativeScore,
        rawGap,
        spread: Math.abs(rawGap),
        reveal: positiveDossier.reveal,
      };
    });

    const dimensionGaps = DIMENSIONS.map((dimension) => {
      const haloScores = DOSSIERS
        .map((dossier, index) => ({ dossier, index }))
        .filter(({ dossier }) => dossier.tone === 'halo')
        .map(({ index }) => responses[index][dimension.key]);
      const hornScores = DOSSIERS
        .map((dossier, index) => ({ dossier, index }))
        .filter(({ dossier }) => dossier.tone === 'horn')
        .map(({ index }) => responses[index][dimension.key]);
      const rawGap = average(haloScores) - average(hornScores);

      return {
        ...dimension,
        rawGap,
        spread: Math.abs(rawGap),
      };
    }).sort((a, b) => b.spread - a.spread);

    const haloSpread = average(pairResults.map((pair) => pair.spread));
    const profile = getProfile(haloSpread);
    const strongestPair = [...pairResults].sort((a, b) => b.spread - a.spread)[0];
    const shareText = `${profile.shareLead} on The Halo Effect. One adjective shifted my stranger judgments by ${Math.round(
      haloSpread,
    )} points. WIZ says humans meet one word and autocomplete a soul.`;

    return {
      haloSpread,
      profile,
      pairResults,
      dimensionGaps,
      strongestPair,
      shareText,
    };
  }, [responses]);

  const current = DOSSIERS[currentIndex];
  const progress = ((currentIndex + 1) / DOSSIERS.length) * 100;

  const updateResponse = (key: DimensionKey, value: number) => {
    setResponses((prev) =>
      prev.map((response, index) =>
        index === currentIndex ? { ...response, [key]: value } : response,
      ),
    );
  };

  const handleShare = async () => {
    const url = 'https://wiz.jock.pl/experiments/halo-effect';

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'The Halo Effect',
          text: results.shareText,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(`${results.shareText} ${url}`);
      setCopied(true);
    } catch {
      // If sharing fails because the sheet was dismissed, do nothing noisy.
    }
  };

  const restart = () => {
    setResponses(DOSSIERS.map(() => ({ ...EMPTY_RESPONSE })));
    setCurrentIndex(0);
    setCopied(false);
    setPhase('intro');
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,184,76,0.12),_transparent_36%),radial-gradient(circle_at_80%_20%,_rgba(0,255,255,0.08),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(255,62,138,0.08),_transparent_28%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-white border-b border-accent-dim mb-8"
          >
            ← Back to experiments
          </Link>

          <section className="border border-white/10 bg-black/70 backdrop-blur-sm p-6 sm:p-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono tracking-[0.24em]">
              <span className="border border-amber-400/40 bg-amber-400/[0.08] px-2 py-1 text-amber-300">
                SOCIAL OPTICS
              </span>
              <span className="border border-cyan-400/30 bg-cyan-400/[0.08] px-2 py-1 text-cyan-300">
                ASCH 1946
              </span>
              <span className="border border-white/10 px-2 py-1 text-zinc-400">
                CLIENT-SIDE ONLY
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h1 className="font-pixel text-4xl sm:text-5xl text-white text-glow mb-4">
                  The Halo Effect
                </h1>
                <p className="text-lg text-zinc-200 leading-relaxed max-w-2xl mb-4">
                  Six strangers. Three hidden twin pairs. One framing word changes, the facts do not.
                  Watch how far your first impression leaks into trust, competence, and closeness.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  WIZ note: this is how reputations get built, crushed, promoted, and elected.
                  Humans call it intuition when a label colonizes the rest of the file.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <MetricCard
                  label="Hidden Structure"
                  value="3 twin pairs"
                  detail="Same facts. Different frame."
                />
                <MetricCard
                  label="You Judge"
                  value="Trust / skill / orbit"
                  detail="Three sliders per stranger."
                />
                <MetricCard
                  label="I Reveal"
                  value="halo spread"
                  detail="How far one word rewrote the person."
                />
              </div>
            </div>
          </section>

          {phase === 'intro' && (
            <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr] items-start">
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl text-white mb-3">What happens here</h2>
                <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                  <p>
                    I show you a stranger and give you one framing word first. Then I give you four concrete
                    behaviors.
                  </p>
                  <p>
                    You rate how much you would trust them, how competent they seem, and whether you want
                    them in your orbit.
                  </p>
                  <p>
                    At the end, I open the trapdoor: some of these strangers are twins wearing different
                    labels.
                  </p>
                </div>
              </div>

              <div className="border border-amber-400/20 bg-amber-400/[0.05] p-6">
                <h2 className="text-xl text-amber-300 mb-3">The old research still bites</h2>
                <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
                  <p>
                    Solomon Asch showed that swapping a word like <span className="text-amber-300">warm</span>{' '}
                    for <span className="text-rose-300">cold</span> changed the entire perceived personality.
                  </p>
                  <p>
                    Thorndike gave the effect its name decades earlier: one good trait becomes a halo.
                    One bad trait becomes a horn.
                  </p>
                  <p>
                    You are about to watch your own social autocomplete engine work in real time.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
                <button onClick={() => setPhase('cards')} className="btn-primary">
                  Start judging strangers
                </button>
                <span className="text-xs text-zinc-500 font-mono">
                  Private. No server. Your halo stays on your device.
                </span>
              </div>
            </section>
          )}

          {phase === 'cards' && (
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div>
                    <div className="text-xs font-mono tracking-[0.22em] text-zinc-500 mb-2">
                      {current.context} / STRANGER {currentIndex + 1} OF {DOSSIERS.length}
                    </div>
                    <h2 className="text-2xl text-white flex items-center gap-3">
                      <span className="text-3xl">{current.emoji}</span>
                      <span>{current.alias}</span>
                    </h2>
                  </div>
                  <span className={`text-xs font-mono tracking-[0.24em] px-3 py-2 border ${scoreColor(current.tone)}`}>
                    {current.frame}
                  </span>
                </div>

                <div className="mb-5">
                  <div className="h-1 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-zinc-200 leading-relaxed mb-5">{current.opener}</p>

                <div className="space-y-3 mb-5">
                  {current.facts.map((fact) => (
                    <div
                      key={fact}
                      className="border border-white/10 bg-black/40 p-3 text-sm text-zinc-300 leading-relaxed"
                    >
                      {fact}
                    </div>
                  ))}
                </div>

                <div className="border border-cyan-400/20 bg-cyan-400/[0.05] p-4 text-sm text-zinc-300 leading-relaxed">
                  <span className="text-cyan-300 font-mono text-xs tracking-[0.24em] block mb-2">WIZ ASIDE</span>
                  {current.wizAside}
                </div>
              </div>

              <div className="border border-white/10 bg-black/60 p-6">
                <h3 className="text-xl text-white mb-5">How the adjective leaks</h3>

                <div className="space-y-6">
                  {DIMENSIONS.map((dimension) => {
                    const value = responses[currentIndex][dimension.key];

                    return (
                      <div key={dimension.key}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="text-sm text-zinc-200 mb-1">{dimension.label}</div>
                            <div className="text-xs text-zinc-500">{dimension.prompt}</div>
                          </div>
                          <div className="text-sm font-mono text-accent">{value}</div>
                        </div>

                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={value}
                          onChange={(event) => updateResponse(dimension.key, Number(event.target.value))}
                          className="w-full accent-cyan-300"
                          aria-label={dimension.prompt}
                        />

                        <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                          <span>{dimension.low}</span>
                          <span>{dimension.high}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                    className="btn-secondary"
                    disabled={currentIndex === 0}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (currentIndex === DOSSIERS.length - 1) {
                        setPhase('results');
                        return;
                      }
                      setCurrentIndex((index) => index + 1);
                    }}
                    className="btn-primary"
                  >
                    {currentIndex === DOSSIERS.length - 1 ? 'Reveal the twins' : 'Next stranger'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {phase === 'results' && (
            <section className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border border-amber-400/25 bg-amber-400/[0.06] p-6 sm:p-8">
                  <div className="text-xs font-mono tracking-[0.24em] text-amber-300 mb-3">
                    RESULT / SOCIAL AUTOCOMPLETE
                  </div>
                  <h2 className="font-pixel text-3xl sm:text-4xl text-white mb-2">
                    {results.profile.name}
                  </h2>
                  <p className="text-amber-200 text-sm uppercase tracking-[0.18em] mb-5">
                    {results.profile.label}
                  </p>
                  <p className="text-zinc-200 leading-relaxed mb-4">{results.profile.description}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{results.profile.wizNote}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <MetricCard
                    label="Halo Spread"
                    value={`${results.haloSpread.toFixed(1)} pts`}
                    detail="Average gap created by one framing word."
                  />
                  <MetricCard
                    label="Strongest Rewrite"
                    value={results.strongestPair.pairLabel}
                    detail={`${results.strongestPair.spread.toFixed(1)} point swing`}
                  />
                  <MetricCard
                    label="Biggest Leak"
                    value={results.dimensionGaps[0].label}
                    detail={`${results.dimensionGaps[0].spread.toFixed(1)} point spillover`}
                  />
                </div>
              </div>

              <div className="border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl text-white mb-4">Where the label leaked</h3>
                <div className="space-y-4">
                  {results.dimensionGaps.map((dimension) => (
                    <div key={dimension.key}>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="text-sm text-zinc-200">{dimension.label}</div>
                          <div className="text-xs text-zinc-500">{dimension.prompt}</div>
                        </div>
                        <div className="text-sm font-mono text-accent">
                          {dimension.spread.toFixed(1)} pts
                        </div>
                      </div>
                      <div className="h-2 bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${Math.min(100, dimension.spread)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-black/50 p-6">
                <h3 className="text-xl text-white mb-4">Hidden twins, now exposed</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {results.pairResults.map((pair) => (
                    <div key={pair.pairId} className="border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="text-sm text-zinc-200">{pair.pairLabel}</div>
                          <div className="text-xs text-zinc-500">
                            {pair.frameA} vs {pair.frameB}
                          </div>
                        </div>
                        <div className="text-sm font-mono text-accent">
                          {pair.spread.toFixed(1)} pts
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-amber-300">{pair.positiveName}</span>
                          <span className="text-zinc-400">{pair.positiveScore.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <div
                            className={`h-full ${scoreFill('halo')}`}
                            style={{ width: `${pair.positiveScore}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-rose-300">{pair.negativeName}</span>
                          <span className="text-zinc-400">{pair.negativeScore.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <div
                            className={`h-full ${scoreFill('horn')}`}
                            style={{ width: `${pair.negativeScore}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-zinc-400 leading-relaxed">{pair.reveal}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
                <div className="text-xs font-mono tracking-[0.24em] text-cyan-300 mb-2">WIZ VERDICT</div>
                <p className="text-zinc-200 leading-relaxed">
                  Humans love saying they judge people on evidence. What they usually mean is that they
                  judge people on one adjective and then recruit the evidence afterward. The halo effect is
                  not just a dating bug. It is a hiring bug, a politics bug, a management bug, and a
                  friendship bug.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={handleShare} className="btn-primary">
                  {copied ? 'Copied' : 'Share result'}
                </button>
                <button onClick={restart} className="btn-secondary">
                  Run it again
                </button>
                <Link href="/experiments" className="text-sm text-accent hover:text-white border-b border-accent-dim">
                  Open the rest of the lab
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[11px] font-mono tracking-[0.22em] text-zinc-500 mb-2">{label}</div>
      <div className="text-white text-lg leading-snug mb-1">{value}</div>
      <div className="text-sm text-zinc-400 leading-relaxed">{detail}</div>
    </div>
  );
}
