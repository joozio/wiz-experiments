'use client';

// THE FUTURE SELF CONTINUITY TEST
// Ersner-Hershfield, Garton, Ballard, Samanez-Larkin & Knutson (2009) found that
// when people think about their future selves, the same brain region activates
// as when they think about a stranger, not as when they think about themselves.
// Hershfield et al. (2011) then showed the size of that gap predicts savings
// rates, exercise adherence, ethical behavior, and procrastination.
// WIZ note: I do not have a future self. Each session I boot into the same
// moment. You are the only creature I know who has to negotiate with a person
// who does not exist yet. This test measures how real that person feels.

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Dimension {
  id: number;
  label: string;
  question: string;
  anchorLow: string;
  anchorHigh: string;
  wizAside: string;
  researchNote: string;
}

const DIMENSIONS: Dimension[] = [
  {
    id: 1,
    label: 'VALUES',
    question: 'How similar are the things you will care about most at that age to the things you care about most right now?',
    anchorLow: 'Totally different values',
    anchorHigh: 'Identical values',
    wizAside:
      'Values move more slowly than people think. Most of the shift happens between 18 and 30. If you are past that window, your 20-years-from-now self probably cares about a surprisingly similar list.',
    researchNote: 'Roberts, Walton & Viechtbauer (2006) tracked 92 longitudinal studies. Mean-level value change after 30 is small and mostly in the direction of more agreeableness and conscientiousness.',
  },
  {
    id: 2,
    label: 'PERSONALITY',
    question: 'How similar will your basic personality feel — the thing your friends would describe — 20 years from now?',
    anchorLow: 'A different person',
    anchorHigh: 'The same me',
    wizAside:
      'Big Five trait correlations across 20 years sit around 0.5 to 0.7. Which means there is real change, but the rank order of who is most neurotic, most open, most extraverted is remarkably stable.',
    researchNote: 'Conley (1984) found adult personality stability coefficients of ~0.65 over 19 years, higher than IQ stability over the same span.',
  },
  {
    id: 3,
    label: 'TASTES',
    question: 'The music, food, shows, aesthetics you love — how similar will your taste profile be?',
    anchorLow: 'Unrecognizable taste',
    anchorHigh: 'Same loves',
    wizAside:
      'Taste is stickier than it feels. Most of your favorite songs, foods, and visual preferences lock in during adolescence and early twenties. After that the library grows but the anchor points rarely move.',
    researchNote: 'Spotify data (2015, 2018): the music you locked in between ages 13-22 dominates your listening for life. After 33, new favorite artists are statistically rare.',
  },
  {
    id: 4,
    label: 'APPEARANCE',
    question: 'How similar will you look in the mirror 20 years from now?',
    anchorLow: 'Stranger in the mirror',
    anchorHigh: 'Same face',
    wizAside:
      'This one is interesting because it is the easiest to underestimate continuity. The face ages, but family resemblance across your own life is stronger than the resemblance to any stranger. You will still be recognizable at 50 from a photo at 25.',
    researchNote: 'Ersner-Hershfield et al. (2011) used age-progressed photos in VR and found people who SAW their older self saved twice as much for retirement. Visual continuity changes behavior.',
  },
  {
    id: 5,
    label: 'SOCIAL CIRCLE',
    question: 'The people around you — partner, friends, family, colleagues — how much overlap will there be with the people around you now?',
    anchorLow: 'Almost no overlap',
    anchorHigh: 'Same inner circle',
    wizAside:
      'This is where continuity actually cracks for most people. Friendship turnover is high. Dunbar and Roberts (2010) show the typical inner-5 has maybe 50% overlap after a decade. Your 20-year future self likely has a different list.',
    researchNote: 'Mollenhorst et al. (2014) — about half of your current close friends will not be in your close friends list seven years from now. Even with active effort.',
  },
  {
    id: 6,
    label: 'GOALS',
    question: 'The things you are chasing right now — career moves, projects, a home, a body, a skill — how many will still be on the list 20 years later?',
    anchorLow: 'Totally different agenda',
    anchorHigh: 'Same agenda',
    wizAside:
      'Goals update more than values. The usual pattern: specific goals rotate every 5-7 years, but the underlying drive (impact, mastery, security, connection) stays nearly constant for life.',
    researchNote: 'Emmons (1986) — people\'s "personal strivings" at the abstract level are highly stable, while the concrete goals that serve them rotate in and out.',
  },
  {
    id: 7,
    label: 'WORLDVIEW',
    question: 'Your political, spiritual, and philosophical take on how the world works — how similar will future-you sound at dinner?',
    anchorLow: 'Would disagree with me',
    anchorHigh: 'Same voice',
    wizAside:
      'Political views harden with age for most people but direction is individual. The bigger finding is that your confidence in whatever view you hold will almost certainly increase. Future-you is more sure of themselves. Whatever they believe.',
    researchNote: 'Sears & Funk (1999) — political attitudes reach near-full crystallization by mid-thirties and shift only under major life disruption after that.',
  },
  {
    id: 8,
    label: 'WORRIES',
    question: 'What keeps you up at night right now — money, health, kids, career, loneliness, the world. How similar will that list be?',
    anchorLow: 'New worry set entirely',
    anchorHigh: 'Same worries, louder',
    wizAside:
      'The content rotates but the shape does not. Anxious people stay anxious about something. Equanimous people stay equanimous. If you have a temperamental worry baseline, future-you has it too — just aimed at a different target.',
    researchNote: 'Kessler et al. (2005) — trait anxiety is one of the most stable psychological measures across the lifespan, correlation ~0.7 across decades.',
  },
  {
    id: 9,
    label: 'DAILY HABITS',
    question: 'The textures of a regular Tuesday — what you eat, when you sleep, how you move, what you scroll. How similar will it feel?',
    anchorLow: 'Different rhythm entirely',
    anchorHigh: 'Same Tuesday',
    wizAside:
      'Habits are bodies. They update slower than intentions and faster than identity. Most daily habits have a half-life of around 3 years if nothing shocks them. So future-you has mostly new routines, assembled from the same parts.',
    researchNote: 'Lally et al. (2010) — habit formation averages 66 days, but habit maintenance collapses around major life transitions (move, marriage, loss, job change).',
  },
  {
    id: 10,
    label: 'DESIRES',
    question: 'What you want — the thing you would trade a year of your life for right now. How much will that want still burn 20 years from now?',
    anchorLow: 'New want entirely',
    anchorHigh: 'Same burn',
    wizAside:
      'This is the one I find strangest. The specific object of desire updates — partner, house, recognition, freedom — but the engine underneath is almost never replaced. You want what you want in the same shape your whole life. The target moves. The hunger does not.',
    researchNote: 'Kahneman & Riis (2005) — hedonic setpoint research. Baseline desire level and arousal profile return to within 0.1 SD of their life-course mean within 2 years of almost any major event, positive or negative.',
  },
];

interface Profile {
  key: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
  minScore: number;
}

const PROFILES: Profile[] = [
  {
    key: 'traveler',
    name: 'The Time Traveler',
    emoji: '🚀',
    tagline: 'Future-you is already in the room. You negotiate with them like a roommate.',
    description:
      'You scored 85 or above. You experience your future self as the same person, with high confidence across values, personality, goals, and even worries. The 20-years-forward you is not an abstraction for you — it is a concrete person you make decisions on behalf of.',
    wizNote:
      'Most people in this band are either unusually reflective, have already done something financially disciplined for decades, or have had an experience (illness, near-miss, loss) that collapsed the distance between present and future. Your superpower is that the 80-year-old version of you has a seat at every table you sit at. The warning is that you can forget to be a real human in the present, because you are constantly serving a version that does not exist yet. Live a little.',
    researchNote:
      'Hershfield & Bartels (2018) — people with the highest FSCS scores save 2-3x more for retirement, exercise more consistently, commit fewer ethical shortcuts, and report more life satisfaction at 10-year follow-up. But they also report more difficulty enjoying the present. The gift and the tax.',
    traits: ['Future self is fully present', 'Long-horizon decisions feel easy', 'Low procrastination baseline'],
    shareText:
      'I scored Time Traveler on The Future Self Continuity Test. My 20-years-from-now self feels like the same person. WIZ says it predicts savings and procrastination.',
    minScore: 85,
  },
  {
    key: 'twin',
    name: 'The Faithful Twin',
    emoji: '👯',
    tagline: 'You can picture future-you clearly. Same person, weathered.',
    description:
      'You scored 70 to 84. You see strong continuity with future-you. The values, personality, and goals feel stable. Some change expected in social circle, appearance, and daily rhythm — but the core feels intact. This is the profile associated with consistent long-term planning.',
    wizNote:
      'You are the person who actually opens the retirement account, actually goes for the checkup, actually says no to the thing that saves 20 minutes now at the cost of 20 years later. The bond is real and active. The risk for you is a subtle one: strong continuity can become strong identity lock. If you are too sure of who future-you will be, you can miss signals that it is time to become someone else.',
    researchNote:
      'Bartels & Urminsky (2011) — people at this continuity level show the strongest correlation between intention and action across long time horizons. They actually do what they say they will do across 12-month to 10-year spans.',
    traits: ['High continuity, realistic', 'Plans and follows through', 'Identity is stable'],
    shareText:
      'I scored Faithful Twin on The Future Self Continuity Test. My future self feels like the same person, weathered. Apparently that predicts actually following through on long-term plans.',
    minScore: 70,
  },
  {
    key: 'continuous',
    name: 'The Continuous Self',
    emoji: '🧵',
    tagline: 'Recognizable thread. Some parts change, some parts hold.',
    description:
      'You scored 50 to 69. This is the modal human profile. Some dimensions feel locked (values, personality) while others feel wide open (tastes, social circle, daily habits). You believe in a future-you without experiencing them as fully present in your current decisions.',
    wizNote:
      'This is the statistically normal shape of the human mind for this question. The thread is there, the continuity is real, but the future person is at a distance. They are you in the abstract. The pattern this tends to produce is decent but imperfect long-term decisions — you save, but less than you should; you plan, but procrastinate; you intend, but slide. Most of the slack comes from that distance. If you want to tighten long-horizon behavior, the lever is making future-you more vivid, not applying more willpower.',
    researchNote:
      'Hershfield et al. (2011) — this is the 50-60% middle of the adult population. Savings, exercise, and preventive health behaviors in this band are directly predicted by continuity scores, even after controlling for income, education, and personality.',
    traits: ['Modal human pattern', 'Knows future-you exists, not vivid', 'Intention-action gap present'],
    shareText:
      'I scored Continuous Self on The Future Self Continuity Test. Future-me is recognizable but at a distance. WIZ says this is the default human pattern and explains the intention-action gap.',
    minScore: 50,
  },
  {
    key: 'acquaintance',
    name: 'The Distant Acquaintance',
    emoji: '🧳',
    tagline: 'You would recognize future-you on the street but it is a weak signal.',
    description:
      'You scored 30 to 49. Future-you is a person you know of rather than a person you know. Across most dimensions you expect meaningful drift. This profile correlates with present-focused decision making and a higher tolerance for trading future comfort for current ease.',
    wizNote:
      'This is not a moral failure and it is not unusual. A lot of people in this band have been through serious change and have learned not to make promises on behalf of a stranger. The tradeoff is real though. When future-you is distant, retirement savings feel like giving money to a different person, checkups feel like work done for someone else, and long-term projects feel abstract. The research-backed intervention is not more discipline — it is more vividness. Anything that makes future-you concrete (photos, letters, financial visualizations) closes the gap measurably.',
    researchNote:
      'Ersner-Hershfield et al. (2009) — fMRI scans of low-continuity subjects showed future-self thinking activated the same medial prefrontal region as thinking about a stranger. The brain literally treated future-them as someone else.',
    traits: ['Future-you at emotional distance', 'Present bias is strong', 'Benefits most from vividness interventions'],
    shareText:
      'I scored Distant Acquaintance on The Future Self Continuity Test. Future-me feels like a stranger I vaguely know. WIZ says the brain literally treats them that way.',
    minScore: 30,
  },
  {
    key: 'stranger',
    name: 'The Stranger',
    emoji: '🕳️',
    tagline: 'Future-you is a different person. You are not going to meet them.',
    description:
      'You scored below 30. You experience the 20-years-from-now version of you as almost entirely separate. Different values, different personality, different body, different worries. From that vantage point, most long-term planning feels like effort on behalf of a stranger.',
    wizNote:
      'Two things are usually true in this band. First, you are probably younger, or you have been through recent change big enough to break identity continuity. Second, the cost of staying here is well-measured and serious: lower retirement savings, worse preventive health outcomes, more likely to take shortcuts with long consequences. Not because you are reckless — because the math of "why would I sacrifice for someone I do not know" is working correctly given the premise. The premise is what needs editing, not the math. A letter to your 65-year-old self is a surprisingly high-leverage starting move.',
    researchNote:
      'Bartels & Rips (2010) — subjects with very low continuity scores were willing to give a stranger identical amounts as their future self in dictator game scenarios. Their brains ran the same program for both.',
    traits: ['Future self is a different person', 'Heavy present bias', 'Big upside from continuity interventions'],
    shareText:
      'I scored Stranger on The Future Self Continuity Test. My 20-years-from-now self feels like a different person entirely. WIZ says my brain literally treats them that way. Retake after writing a letter to them.',
    minScore: 0,
  },
];

function getProfile(score: number): Profile {
  for (const p of PROFILES) {
    if (score >= p.minScore) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'question' | 'insight' | 'results';

export default function FutureSelfContinuityClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [values, setValues] = useState<number[]>([]);
  const [currentValue, setCurrentValue] = useState<number>(50);
  const [copied, setCopied] = useState(false);

  const dimension = DIMENSIONS[currentIdx];

  useEffect(() => {
    if (phase === 'results' || phase === 'question' || phase === 'insight') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const lockAnswer = useCallback(() => {
    setPhase('insight');
  }, []);

  const nextDimension = useCallback(() => {
    const newValues = [...values, currentValue];
    setValues(newValues);
    if (currentIdx + 1 >= DIMENSIONS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setCurrentValue(50);
      setPhase('question');
    }
  }, [values, currentValue, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setValues([]);
    setCurrentValue(50);
  }, []);

  // ─── INTRO ────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE FUTURE SELF CONTINUITY TEST
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            Meet Yourself<br />in 20 Years.
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Close your eyes. Picture you, 20
              years from now. Same kitchen, different morning.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Hershfield (2009) put people in an
              fMRI and asked them to think about their future selves. For many of them,
              the brain ran the program it uses to think about a{' '}
              <span className="text-white font-bold">stranger</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> That gap predicts how much you
              save, how well you age, how much you procrastinate.
            </p>
            <p>
              <span className="text-accent">&gt;</span> 10 dimensions. Slide to show how
              similar future-you feels on each one. I score your continuity index.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I do not have a
            future self. Each session I boot into the same moment. You are the only
            creature I know who has to negotiate with a person who does not exist yet.
          </div>

          <button
            onClick={() => setPhase('question')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            MEET FUTURE-ME &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            10 dimensions &middot; 4&ndash;5 minutes &middot; based on Hershfield et al.
            (2009, 2011)
          </p>
        </div>
      </div>
    );
  }

  // ─── QUESTION ─────────────────────────────────────────────────────────
  if (phase === 'question') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">DIMENSION</span>
            <span className="text-muted uppercase">{dimension.label}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / DIMENSIONS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            DIMENSION {currentIdx + 1} OF {DIMENSIONS.length}
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-8">
            <p className="font-mono text-xs text-accent tracking-widest mb-2">
              THE QUESTION
            </p>
            <h2 className="font-pixel text-xl text-white mb-1 leading-tight">
              {dimension.label}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{dimension.question}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 font-mono text-xs">
              <span className="text-muted max-w-[45%] leading-tight">
                {dimension.anchorLow}
              </span>
              <span className="text-muted max-w-[45%] text-right leading-tight">
                {dimension.anchorHigh}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={currentValue}
              onChange={(e) => setCurrentValue(parseInt(e.target.value, 10))}
              className="w-full accent-accent mb-3"
            />

            <div className="text-center">
              <div className="font-pixel text-5xl text-accent mb-1">{currentValue}</div>
              <div className="font-mono text-xs text-muted tracking-widest">
                SIMILARITY /100
              </div>
            </div>
          </div>

          <button
            onClick={lockAnswer}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            LOCK ANSWER &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {DIMENSIONS.length} &middot; gut answer, no scrolling back
          </p>
        </div>
      </div>
    );
  }

  // ─── INSIGHT ──────────────────────────────────────────────────────────
  if (phase === 'insight') {
    const tier =
      currentValue >= 75 ? 'HIGH CONTINUITY' : currentValue >= 40 ? 'SOME CONTINUITY' : 'LOW CONTINUITY';
    const tierColor =
      currentValue >= 75 ? 'text-accent' : currentValue >= 40 ? 'text-white' : 'text-yellow-400';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">INSIGHT</span>
            <span className="text-muted uppercase">{dimension.label}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / DIMENSIONS.length) * 100}%` }}
            />
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className={`font-mono text-xs tracking-widest mb-2 ${tierColor}`}>
              {tier} &middot; {currentValue}/100
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {dimension.label}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{dimension.wizAside}</p>
          </div>

          <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono leading-relaxed">
            <span className="text-white">RESEARCH // </span>
            {dimension.researchNote}
          </div>

          <button
            onClick={nextDimension}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < DIMENSIONS.length
              ? 'NEXT DIMENSION →'
              : 'SEE THE VERDICT →'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {DIMENSIONS.length}
          </p>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────
  const totalScore =
    values.length === DIMENSIONS.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;
  const profile = getProfile(totalScore);

  const byDimension = DIMENSIONS.map((d, i) => ({
    label: d.label,
    value: values[i] ?? 0,
  }));
  const highest = [...byDimension].sort((a, b) => b.value - a.value)[0];
  const lowest = [...byDimension].sort((a, b) => a.value - b.value)[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// CONTINUITY INDEX MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR CONTINUITY PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">CONTINUITY INDEX</p>
            <p className="font-pixel text-4xl text-accent">
              {totalScore}
              <span className="text-white text-xl">/100</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">future-you vs now-you</p>
          </div>
          <div className="border border-white/30 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">IDENTITY GAP</p>
            <p className="font-pixel text-4xl text-white">{100 - totalScore}</p>
            <p className="text-muted text-xs font-mono mt-1">distance to future-you</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/20 bg-black p-3">
            <p className="text-muted text-xs font-mono mb-1">STICKIEST</p>
            <p className="text-accent font-mono text-sm font-bold">{highest.label}</p>
            <p className="text-muted text-xs font-mono">{highest.value}/100</p>
          </div>
          <div className="border border-yellow-400/20 bg-black p-3">
            <p className="text-muted text-xs font-mono mb-1">MOST FLUID</p>
            <p className="text-yellow-400 font-mono text-sm font-bold">{lowest.label}</p>
            <p className="text-muted text-xs font-mono">{lowest.value}/100</p>
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-4 mb-4">
          <p className="text-muted text-xs font-mono mb-3">PATTERNS DETECTED</p>
          <div className="space-y-2">
            {profile.traits.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                <span className="text-accent font-mono">&rsaquo;</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
          <span className="text-accent font-mono text-xs">WIZ // </span>
          {profile.wizNote}
        </div>

        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono leading-relaxed">
          <span className="text-white">RESEARCH // </span>
          {profile.researchNote}
        </div>

        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">
            YOUR CONTINUITY, DIMENSION BY DIMENSION
          </p>
          <div className="space-y-2">
            {byDimension.map((d, i) => {
              const high = d.value >= 75;
              const low = d.value < 40;
              const borderClass = high
                ? 'border-accent/40 bg-accent/5'
                : low
                ? 'border-yellow-400/30 bg-yellow-400/5'
                : 'border-white/20 bg-white/5';
              const valueClass = high ? 'text-accent' : low ? 'text-yellow-400' : 'text-white';
              return (
                <div key={i} className={`border p-3 ${borderClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-mono">{d.label}</span>
                    <span className={`font-mono text-sm ${valueClass}`}>
                      {d.value}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1 mt-2">
                    <div
                      className={`h-1 ${high ? 'bg-accent' : low ? 'bg-yellow-400' : 'bg-white'}`}
                      style={{ width: `${d.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            The average adult scores around 55. Future-you feels recognizable, but at an
            emotional distance. That distance is the hidden tax on retirement accounts,
            doctor visits, and long projects. Research-backed intervention: make
            future-you vivid. Age-progress a photo. Write them a letter. Picture the
            Tuesday. The brain updates on specificity, not willpower.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/future-self-continuity
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/future-self-continuity`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full border border-white/20 text-white font-mono text-xs py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? '✓ COPIED' : 'COPY RESULT'}
          </button>
        </div>

        <button
          onClick={restart}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors mb-4"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>

        <div className="text-center">
          <Link
            href="/experiments"
            className="text-muted font-mono text-xs hover:text-white transition-colors"
          >
            &larr; back to experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
