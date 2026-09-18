'use client';

// THE SPOTLIGHT EFFECT
// Gilovich, Medvec & Savitsky, 1999.
// You wore an embarrassing t-shirt to a party.
// You estimate: ~50% of people noticed.
// Actual: ~23%.
// Welcome to the Spotlight Effect — your brain's standing delusion
// that everyone is watching you, all the time, with great attention.
// They're not. They're managing their own stage.
// Let's measure how large yours is.
// WIZ note: I observe everything. Including how little you're observed.

import { useState, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  situation: string;
  detail: string;
  prompt: string;
  researchAvg: number;
  researchSource: string;
  wizReveal: string;
  funFact: string;
}

type ProfileKey = 'invisible' | 'calibrated' | 'realistic' | 'stage-hog' | 'universe';

interface Profile {
  key: ProfileKey;
  name: string;
  emoji: string;
  scoreRange: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    situation: 'The Wrong Shirt',
    detail:
      'You grab a shirt in the morning and realize at work it has a large, slightly embarrassing logo on it. You wear it all day. At the end of the day, a colleague mentions your shirt.',
    prompt:
      'What percentage of people you interacted with today actually noticed the logo?',
    researchAvg: 23,
    researchSource: 'Gilovich, Medvec & Savitsky (1999)',
    wizReveal:
      'Research shows about 23% noticed. Your brain assigned you the starring role. The audience was mostly elsewhere.',
    funFact:
      'Gilovich\'s team used a Barry Manilow t-shirt. Wearers estimated ~50% noticed. Actual: 23%. The gap is called the Spotlight Effect.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    situation: 'The Stumble',
    detail:
      'Entering a meeting with 15 people, you trip slightly on the threshold — enough to catch yourself and feel a flash of embarrassment. You recover immediately and take your seat.',
    prompt:
      'What percentage of the people in that room noticed your stumble?',
    researchAvg: 27,
    researchSource: 'Savitsky & Gilovich (2003)',
    wizReveal:
      'Around 27% noticed. Most were already looking at their phones, notes, or the person speaking. Your stumble was a footnote in your story, not theirs.',
    funFact:
      'People in rooms tend to have an "attentional focus" toward the front or whoever is speaking. Entry-moment awareness is lower than we intuit.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    situation: 'The Stain',
    detail:
      'Lunch leaves a small stain on your shirt. Visible when you look down. You spend the afternoon in two meetings and several hallway conversations.',
    prompt:
      'What percentage of people you spoke to today noticed the stain?',
    researchAvg: 29,
    researchSource: 'Gilovich & Savitsky (1999)',
    wizReveal:
      'Studies put this at about 29%. Your attention-magnifying bias makes you think everyone sees what you see. They\'re looking at your face, not your shirt.',
    funFact:
      'Eye-tracking studies show that during conversation, 80%+ of attention goes to the face and eyes. Clothing details are peripheral — literally.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    situation: 'The Trembling Voice',
    detail:
      'During a 10-minute presentation, your voice shakes for about 30 seconds in the middle. You are acutely aware of it. You finish cleanly.',
    prompt:
      'What percentage of the audience noticed your voice trembling?',
    researchAvg: 31,
    researchSource: 'Savitsky, Epley & Gilovich (2001)',
    wizReveal:
      'About 31% registered it. Some who noticed didn\'t register it as weakness — they felt empathy, or recognized it as normal. Your inner critic was the loudest reviewer in the room.',
    funFact:
      'Audiences consistently rate nervous presenters more favorably than the presenters rate themselves. The gap is largest when you\'re most anxious.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    situation: 'The Late Arrival',
    detail:
      'You arrive 12 minutes late to a party of 20 people, slipping in through the door mid-conversation. The host notices and waves.',
    prompt:
      'What percentage of party guests registered your late arrival?',
    researchAvg: 34,
    researchSource: 'Gilovich, Savitsky & Medvec (2000)',
    wizReveal:
      'Around 34% clocked it. Most were mid-conversation, mid-drink, mid-thought. You entered their peripheral awareness, not their spotlight.',
    funFact:
      'Social events create "attentional pockets" — small clusters of focused attention. Only people facing the door and momentarily between conversations are likely to register latecomers.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    situation: 'The Wrong Answer',
    detail:
      'In a group discussion, you confidently state a fact that someone gently corrects. You acknowledge the correction and continue. The meeting moves on.',
    prompt:
      'What percentage of people in that room are still thinking about your error an hour later?',
    researchAvg: 11,
    researchSource: 'Savitsky & Gilovich (2003)',
    wizReveal:
      'About 11%. Social gaffes have a very short half-life in observers\' minds. The correction was processed and released. You alone held the receipt.',
    funFact:
      'People are far quicker to forgive social mistakes they observe than to forgive their own. The "audience effect" in memory is deeply asymmetric.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    situation: 'The Silence',
    detail:
      'A conversation goes quiet for about 7 seconds. Awkward pause. You fill it eventually. The conversation continues normally.',
    prompt:
      'What percentage of people in that conversation are still bothered by the silence an hour later?',
    researchAvg: 8,
    researchSource: 'Shellenbarger, WSJ (2014) / Epley & Savitsky (2003)',
    wizReveal:
      '8% or fewer. Silences feel massive from inside. From outside, they register and evaporate. Most people\'s primary concern in awkward silences is their own role in them.',
    funFact:
      'Research on awkward silences shows both parties overestimate duration AND impact — each believes the other noticed the silence more. This is mutual spotlight illusion.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    situation: 'The Bad Hair Day',
    detail:
      'Nothing dramatic — your hair just didn\'t cooperate this morning. You notice it every time you catch your reflection. A full day of meetings and interactions.',
    prompt:
      'What percentage of people you interacted with today noticed something was off with your hair?',
    researchAvg: 19,
    researchSource: 'Gilovich & Savitsky (1999)',
    wizReveal:
      '~19%. Hair is in the foveal center of your mirror but the periphery of everyone else\'s gaze. You were fully seen — just not the part you were most worried about.',
    funFact:
      'People form first impressions in 100ms and rarely update the visual details they locked in. If they met you before your bad hair day, they\'re seeing the old version anyway.',
  },
];

const PROFILES: Profile[] = [
  {
    key: 'invisible',
    name: 'The Ghost',
    emoji: '👻',
    scoreRange: 'Below 1.0× overestimate',
    tagline: 'You see yourself less than others do.',
    description:
      'You chronically underestimate how much you register in others\' minds. Your spotlight is smaller than reality — which can mean confidence or self-erasure. Either way, people notice you more than you think.',
    wizNote:
      'Rare pattern. Most humans overclaim the stage. You\'re the outlier who gave it away. Worth examining: do you underclaim on purpose?',
    researchNote:
      'A small fraction of people show below-average Spotlight Effect scores, often correlated with high social confidence or a tendency to focus outward.',
    traits: ['Self-effacing', 'Externally focused', 'Possibly overdue for self-attention'],
    shareText:
      'I scored Ghost on The Spotlight Effect. I underestimate how much others notice me. Wiz says I may have given the stage away on purpose. wiz.jock.pl/experiments/spotlight-effect',
  },
  {
    key: 'calibrated',
    name: 'The Calibrated Observer',
    emoji: '🎯',
    scoreRange: '1.0–1.5× overestimate',
    tagline: 'Your spotlight is close to reality.',
    description:
      'You estimate social visibility with unusual accuracy. The gap between your perceived spotlight and the actual research range is small. This is the rarest outcome — most people run a significant overestimate.',
    wizNote:
      'I observe thousands of patterns. Accurate self-perception is uncommon. You either have strong social feedback loops or you\'ve built a realistic model of attention over time.',
    researchNote:
      'Gilovich et al. found calibration this accurate in fewer than 15% of participants. Strong social skills and high empathy are correlated with reduced Spotlight Effect bias.',
    traits: ['Social awareness', 'Low performance anxiety', 'Accurate self-model'],
    shareText:
      'I scored Calibrated Observer on The Spotlight Effect. My sense of how much others notice me is unusually accurate. wiz.jock.pl/experiments/spotlight-effect',
  },
  {
    key: 'realistic',
    name: 'The Self-Conscious Realist',
    emoji: '🪞',
    scoreRange: '1.5–2.2× overestimate',
    tagline: 'You see a slightly larger stage than you occupy.',
    description:
      'Your spotlight radius is moderately inflated — normal by research standards. You\'re aware of this, or at least partially aware. You feel watched during moments of vulnerability, but the effect doesn\'t dominate your life.',
    wizNote:
      'This is the statistical center of human behavior. Welcome to the majority. The question isn\'t whether you have the bias — it\'s whether it costs you anything.',
    researchNote:
      'The average Spotlight Effect overestimate in Gilovich\'s studies was approximately 2× reality. Your score sits at the healthy edge of normal.',
    traits: ['Periodic self-consciousness', 'Mostly functional', 'Occasional overcorrection'],
    shareText:
      'I scored Self-Conscious Realist on The Spotlight Effect. My mental spotlight is about twice as wide as reality — completely average. wiz.jock.pl/experiments/spotlight-effect',
  },
  {
    key: 'stage-hog',
    name: 'The Stage Hog',
    emoji: '🎭',
    scoreRange: '2.2–3.5× overestimate',
    tagline: 'You\'re performing on a stage only you can see.',
    description:
      'Your mental audience is significantly larger than the real one. You experience social situations with an amplified sense of visibility — every misstep plays to a full house. The embarrassment is real, even when the crowd isn\'t.',
    wizNote:
      'This level of overestimation is energetically expensive. You\'re paying full cognitive rent on attention that was never collected. The theater exists. The audience doesn\'t.',
    researchNote:
      'Higher Spotlight Effect scores correlate with social anxiety, self-monitoring, and performance orientation. The bias is protective in some contexts, exhausting in most.',
    traits: ['High social self-consciousness', 'Strong performance sensitivity', 'Audience-imagination capacity'],
    shareText:
      'I scored Stage Hog on The Spotlight Effect. My mental spotlight is 3× wider than reality. I\'m performing for an audience that mostly isn\'t watching. wiz.jock.pl/experiments/spotlight-effect',
  },
  {
    key: 'universe',
    name: 'The Center of the Universe',
    emoji: '🌟',
    scoreRange: 'Above 3.5× overestimate',
    tagline: 'In your experience, you\'re the main character.',
    description:
      'You carry a persistent, vivid sense that your every move is observed and judged. The stage in your head is vast. The audience is attentive. Neither reflects external reality. This isn\'t narcissism — it\'s extreme self-consciousness. They\'re opposite conditions.',
    wizNote:
      'I see everything. I can confirm: others are spending most of their attention on their own internal theater. Your performance is real to you. That\'s both the problem and the insight.',
    researchNote:
      'Scores above 3.5× overestimate are typically associated with significant social anxiety. Research by Clark & Wells (1995) suggests this level is both a symptom and a reinforcer of social performance anxiety.',
    traits: ['High anxiety in social contexts', 'Vivid self-observer capacity', 'Internalized critic'],
    shareText:
      'I scored Center of the Universe on The Spotlight Effect. My mental stage is 4× wider than reality. Everyone is the main character in their own show — including me. wiz.jock.pl/experiments/spotlight-effect',
  },
];

function getProfile(avgRatio: number): Profile {
  if (avgRatio < 1.0) return PROFILES[0];
  if (avgRatio <= 1.5) return PROFILES[1];
  if (avgRatio <= 2.2) return PROFILES[2];
  if (avgRatio <= 3.5) return PROFILES[3];
  return PROFILES[4];
}

function formatRatio(ratio: number): string {
  return ratio.toFixed(1) + '×';
}

type Phase =
  | 'intro'
  | 'scenario'
  | 'reveal'
  | 'results';

export default function SpotlightEffectClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleSubmitEstimate = useCallback(() => {
    setSubmitted(true);
    setPhase('reveal');
  }, []);

  const handleNext = useCallback(() => {
    const newEstimates = [...estimates, sliderValue];
    setEstimates(newEstimates);

    if (currentIdx + 1 >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setSliderValue(50);
      setSubmitted(false);
      setPhase('scenario');
    }
  }, [currentIdx, estimates, sliderValue]);

  const avgRatio = estimates.length > 0
    ? estimates.reduce((sum, est, i) => sum + est / SCENARIOS[i].researchAvg, 0) / estimates.length
    : 0;

  const profile = getProfile(avgRatio);

  const avgUserEstimate = estimates.length > 0
    ? Math.round(estimates.reduce((a, b) => a + b, 0) / estimates.length)
    : 0;
  const avgResearch = Math.round(
    SCENARIOS.slice(0, estimates.length).reduce((a, s) => a + s.researchAvg, 0) / (estimates.length || 1)
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(profile.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profile]);

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE SPOTLIGHT EFFECT
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Spotlight Effect
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> In 1999, Gilovich, Medvec &amp; Savitsky ran an experiment.
            </p>
            <p>
              <span className="text-accent">&gt;</span> They had people wear a Barry Manilow t-shirt to a room of strangers.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The wearers estimated 50% of people would notice and judge.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Actual number: <span className="text-white font-bold">23%</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> They named this the <span className="text-white">Spotlight Effect</span> — the illusion that you are more visible, more observed, more scrutinized than you actually are.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I&apos;m going to show you 8 social scenarios.
            </p>
            <p>
              <span className="text-accent">&gt;</span> You estimate how many people noticed. I&apos;ll reveal what research says.
            </p>
            <p>
              <span className="text-accent">&gt;</span> At the end: your personal spotlight radius.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>
            I observe everything. I can confirm — everyone believes they are the most-watched person in the room. Almost none of them are correct. Let&apos;s see where you fall.
          </div>

          <button
            onClick={() => setPhase('scenario')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            MEASURE MY SPOTLIGHT →
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios · 3–5 minutes · based on Gilovich et al. (1999)
          </p>
        </div>
      </div>
    );
  }

  // SCENARIO (slider input)
  if (phase === 'scenario') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs text-muted">
            <span className="text-accent tracking-widest">{scenario.phase}</span>
            <span>{currentIdx + 1} / {SCENARIOS.length}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx) / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <h2 className="font-pixel text-xl text-white mb-2">{scenario.situation}</h2>
          <p className="text-secondary text-sm leading-relaxed mb-6 border-l-2 border-accent/40 pl-4">
            {scenario.detail}
          </p>

          <div className="border border-white/20 bg-white/5 p-5 mb-6">
            <p className="text-primary font-medium mb-6 leading-relaxed">
              {scenario.prompt}
            </p>

            {/* Slider */}
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-xs text-muted">
                <span>0% (nobody)</span>
                <span>100% (everyone)</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <div className="text-center">
                <span className="font-pixel text-4xl text-accent">{sliderValue}%</span>
                <p className="text-muted text-xs mt-1 font-mono">your estimate</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitEstimate}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            LOCK IN MY ESTIMATE →
          </button>
        </div>
      </div>
    );
  }

  // REVEAL
  if (phase === 'reveal') {
    const userEst = sliderValue;
    const research = scenario.researchAvg;
    const ratio = userEst / research;
    const diff = userEst - research;

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            {scenario.phase} — REVEAL
          </div>

          <h2 className="font-pixel text-xl text-white mb-6 text-center">{scenario.situation}</h2>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-muted text-xs font-mono mb-2">YOUR ESTIMATE</p>
              <p className="font-pixel text-4xl text-white">{userEst}%</p>
            </div>
            <div className="border border-accent/40 bg-accent/10 p-4 text-center">
              <p className="text-accent text-xs font-mono mb-2">RESEARCH REALITY</p>
              <p className="font-pixel text-4xl text-accent">{research}%</p>
            </div>
          </div>

          {/* Gap analysis */}
          <div className="border border-white/10 bg-white/5 p-4 mb-4 font-mono text-sm">
            {diff > 0 ? (
              <p className="text-secondary">
                You estimated <span className="text-white">{diff} percentage points higher</span> than reality — a <span className="text-accent">{formatRatio(ratio)}</span> overestimate.
              </p>
            ) : diff < 0 ? (
              <p className="text-secondary">
                You estimated <span className="text-white">{Math.abs(diff)} percentage points lower</span> than reality — rarer than the average human.
              </p>
            ) : (
              <p className="text-secondary">
                Exact match. Exceptional calibration.
              </p>
            )}
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">WIZ // </span>
            {scenario.wizReveal}
          </div>

          <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
            <span className="text-white">FUN FACT // </span>
            {scenario.funFact}
          </div>

          <p className="text-muted text-xs text-center font-mono mb-4">
            Source: {scenario.researchSource}
          </p>

          <button
            onClick={handleNext}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length ? 'NEXT SCENARIO →' : 'SEE MY SPOTLIGHT RADIUS →'}
          </button>
        </div>
      </div>
    );
  }

  // RESULTS
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// SPOTLIGHT RADIUS CALCULATED
        </div>

        {/* Profile reveal */}
        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">YOUR SPOTLIGHT PROFILE</div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <div className="font-mono text-xs text-muted mb-4">{profile.scoreRange}</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="border border-white/20 bg-white/5 p-3 text-center">
            <p className="text-muted text-xs font-mono mb-1">YOUR AVG</p>
            <p className="font-pixel text-2xl text-white">{avgUserEstimate}%</p>
          </div>
          <div className="border border-accent/30 bg-accent/5 p-3 text-center">
            <p className="text-accent text-xs font-mono mb-1">REALITY AVG</p>
            <p className="font-pixel text-2xl text-accent">{avgResearch}%</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-3 text-center">
            <p className="text-muted text-xs font-mono mb-1">RATIO</p>
            <p className="font-pixel text-2xl text-white">{formatRatio(avgRatio)}</p>
          </div>
        </div>

        {/* Traits */}
        <div className="border border-white/10 bg-white/5 p-4 mb-4">
          <p className="text-muted text-xs font-mono mb-3">PATTERNS DETECTED</p>
          <div className="space-y-2">
            {profile.traits.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                <span className="text-accent font-mono">›</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIZ note */}
        <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
          <span className="text-accent font-mono text-xs">WIZ // </span>
          {profile.wizNote}
        </div>

        {/* Research note */}
        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
          <span className="text-white">RESEARCH // </span>
          {profile.researchNote}
        </div>

        {/* Per-scenario breakdown */}
        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">YOUR BREAKDOWN</p>
          <div className="space-y-2">
            {SCENARIOS.map((s, i) => {
              const est = estimates[i];
              const ratio = est / s.researchAvg;
              return (
                <div key={s.id} className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-muted w-24 truncate">{s.situation}</span>
                  <div className="flex-1 bg-white/10 h-1.5 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-accent/40"
                      style={{ width: `${Math.min(s.researchAvg, 100)}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-white/60"
                      style={{ width: `${Math.min(est, 100)}%` }}
                    />
                  </div>
                  <span className="text-white w-8 text-right">{est}%</span>
                  <span className="text-accent w-8 text-right">{s.researchAvg}%</span>
                  <span className={`w-10 text-right ${ratio > 2 ? 'text-red-400' : ratio > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {formatRatio(ratio)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2 text-xs font-mono text-muted justify-end">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-white/60 inline-block" /> you</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-accent/40 inline-block" /> research</span>
          </div>
        </div>

        {/* Share */}
        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR SPOTLIGHT RADIUS</p>
          <p className="text-secondary text-sm mb-3">{profile.shareText}</p>
          <button
            onClick={handleCopy}
            className="w-full border border-white/20 text-white font-mono text-xs py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? '✓ COPIED' : 'COPY RESULT'}
          </button>
        </div>

        <button
          onClick={() => {
            setPhase('intro');
            setCurrentIdx(0);
            setEstimates([]);
            setSliderValue(50);
            setSubmitted(false);
          }}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          ← RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}
