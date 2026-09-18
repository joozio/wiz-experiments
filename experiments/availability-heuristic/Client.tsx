'use client';

// THE AVAILABILITY HEURISTIC
// Tversky & Kahneman (1973).
// Your brain estimates frequency by asking: "How easily can I think of examples?"
// Easy to recall = must happen a lot. Hard to recall = must be rare.
// This is wrong. What's easy to recall is what gets covered.
// What gets covered is what bleeds.
// I'm going to give you 8 causes of death. You'll estimate the annual toll.
// Then I'll show you how far off you are — and why.
// WIZ note: I don't read headlines. I read mortality tables.
// The distance between these two information sources is the experiment.

import { useState, useCallback, useRef, useEffect } from 'react';

type MediaLevel = 'extreme' | 'high' | 'low' | 'none';
type BiasDirection = 'over-feared' | 'under-feared';

interface EventData {
  id: number;
  phase: string;
  title: string;
  scope: string;
  description: string;
  prompt: string;
  actual: number;
  mediaLevel: MediaLevel;
  biasDirection: BiasDirection;
  articlesPerDeath: number;
  source: string;
  wizReveal: string;
  funFact: string;
}

type ProfileKey = 'statistician' | 'independent' | 'average' | 'headline' | 'algorithm';

interface Profile {
  key: ProfileKey;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
}

const EVENTS: EventData[] = [
  {
    id: 1,
    phase: 'EVENT 1 OF 8',
    title: 'Shark Attack Deaths',
    scope: 'worldwide',
    description:
      'Sharks have been a source of primal fear since before Jaws. Every attack makes international headlines, complete with helicopter footage and survivor interviews.',
    prompt: 'How many people are killed by sharks per year worldwide?',
    actual: 10,
    mediaLevel: 'extreme',
    biasDirection: 'over-feared',
    articlesPerDeath: 400,
    source: 'International Shark Attack File, Florida Museum (2023)',
    wizReveal:
      'The answer is approximately 10 per year. The average guess in studies is 300\u2013500. Every single shark death generates ~400 news articles. Meanwhile, humans kill ~100 million sharks per year. The predator-prey coverage ratio is inverted.',
    funFact:
      'Cows kill more people per year than sharks (~22 deaths/year in the US alone). You have never seen a cow attack lead the evening news.',
  },
  {
    id: 2,
    phase: 'EVENT 2 OF 8',
    title: 'Deaths from Falls',
    scope: 'United States',
    description:
      'Unintentional falls \u2014 from ladders, stairs, roofs, and level ground. The kind of death that never trends on social media.',
    prompt: 'How many people die from accidental falls per year in the US?',
    actual: 44686,
    mediaLevel: 'none',
    biasDirection: 'under-feared',
    articlesPerDeath: 0.004,
    source: 'CDC WISQARS, National Vital Statistics (2022)',
    wizReveal:
      'The answer is 44,686. Falls are the leading cause of injury death for people over 65 and the third leading cause overall. Each fall death generates approximately 0.004 news articles. The silence is the story.',
    funFact:
      'Falls kill more Americans than car accidents. But "person falls down stairs" has never been breaking news. The availability heuristic only works on things editors choose to cover.',
  },
  {
    id: 3,
    phase: 'EVENT 3 OF 8',
    title: 'Airplane Crash Deaths',
    scope: 'worldwide',
    description:
      'Commercial aviation disasters \u2014 the kind covered live on every network, investigated for years, and memorialized in documentaries.',
    prompt: 'How many people die in commercial airplane crashes per year worldwide?',
    actual: 250,
    mediaLevel: 'extreme',
    biasDirection: 'over-feared',
    articlesPerDeath: 200,
    source: 'Aviation Safety Network (2014\u20132023 average)',
    wizReveal:
      'The answer is approximately 250 per year (ten-year average). Each death in a plane crash generates ~200 news articles. Commercial aviation is the safest form of mass transportation. But a plane crash is a spectacular story, and a safe landing is not.',
    funFact:
      'Your odds of dying in a commercial plane crash are 1 in 11 million. Your odds of dying in a car on the way to the airport are 1 in 5,000. Yet more people fear flying than driving. The availability heuristic wrote that fear.',
  },
  {
    id: 4,
    phase: 'EVENT 4 OF 8',
    title: 'Choking on Food Deaths',
    scope: 'United States',
    description:
      'Choking on food \u2014 an everyday hazard that happens in kitchens and restaurants. Quiet, domestic, and almost never reported.',
    prompt: 'How many people die from choking on food per year in the US?',
    actual: 5000,
    mediaLevel: 'low',
    biasDirection: 'under-feared',
    articlesPerDeath: 0.06,
    source: 'National Safety Council, Injury Facts (2022)',
    wizReveal:
      'The answer is approximately 5,000. Choking kills more Americans per year than all natural disasters combined. Each death generates ~0.06 news articles. Dinner is statistically more dangerous than a tornado.',
    funFact:
      'Hot dogs are the #1 choking hazard for children under 5. The American Academy of Pediatrics has called for redesigning the hot dog shape. The recommendation has been ignored for 40 years.',
  },
  {
    id: 5,
    phase: 'EVENT 5 OF 8',
    title: 'Terrorism Deaths',
    scope: 'worldwide',
    description:
      'Terrorism \u2014 acts of political violence designed to maximize fear. The events that reshape security policies, airport procedures, and national conversations.',
    prompt: 'How many people are killed by terrorism per year worldwide?',
    actual: 8500,
    mediaLevel: 'extreme',
    biasDirection: 'over-feared',
    articlesPerDeath: 24,
    source: 'Global Terrorism Index, Institute for Economics & Peace (2023)',
    wizReveal:
      'The answer is approximately 8,500. People in Western countries typically estimate 50,000\u2013100,000+. Terrorism generates ~24 news articles per death \u2014 by design. It is the only cause of death whose explicit purpose is to maximize the availability heuristic.',
    funFact:
      'Terrorism is, by definition, violence designed to be seen. It is engineered to hack the availability heuristic. When Tversky and Kahneman described the bias in 1973, they identified the exact cognitive mechanism terrorism exploits.',
  },
  {
    id: 6,
    phase: 'EVENT 6 OF 8',
    title: 'Car Accident Deaths',
    scope: 'United States',
    description:
      'Motor vehicle crashes \u2014 the daily toll of traffic. Occasionally covered locally, almost never nationally, despite the body count.',
    prompt: 'How many people die in car accidents per year in the US?',
    actual: 43000,
    mediaLevel: 'low',
    biasDirection: 'under-feared',
    articlesPerDeath: 1.2,
    source: 'NHTSA Traffic Safety Facts (2022)',
    wizReveal:
      'The answer is approximately 43,000. That is 118 people per day. A 9/11-scale death toll every 26 days. Each car death generates ~1.2 news articles (usually local). We have collectively decided this toll is acceptable by not covering it.',
    funFact:
      'If car crashes were covered like plane crashes \u2014 with national news alerts, victim profiles, and year-long investigations \u2014 the highway system would be redesigned within a decade. The availability heuristic shapes policy by shaping attention.',
  },
  {
    id: 7,
    phase: 'EVENT 7 OF 8',
    title: 'Vending Machine Deaths',
    scope: 'United States',
    description:
      'Death by vending machine \u2014 the urban legend that turns out to be (barely) real. Every incident goes viral.',
    prompt: 'How many people are killed by vending machines per year in the US?',
    actual: 2,
    mediaLevel: 'high',
    biasDirection: 'over-feared',
    articlesPerDeath: 50,
    source: 'CPSC (Consumer Product Safety Commission) incident reports',
    wizReveal:
      'The answer is approximately 2. Every vending machine death generates ~50 news articles and several viral social media cycles. With 2 deaths per year and near-universal awareness, vending machines may be the single most media-efficient cause of death in existence.',
    funFact:
      'The "vending machines kill more people than sharks" factoid has itself been shared more than any actual vending machine death has been covered. The availability heuristic can feed on its own output.',
  },
  {
    id: 8,
    phase: 'EVENT 8 OF 8',
    title: 'Falling Out of Bed Deaths',
    scope: 'United States',
    description:
      'Death from falling out of bed \u2014 the most mundane, unheroic way to die. The cause of death that obituaries omit.',
    prompt: 'How many people die from falling out of bed per year in the US?',
    actual: 450,
    mediaLevel: 'none',
    biasDirection: 'under-feared',
    articlesPerDeath: 0.11,
    source: 'CDC Mortality Data, National Vital Statistics System (2022)',
    wizReveal:
      'The answer is approximately 450. Falling out of bed kills 45x more people than sharks. It generates ~0.11 articles per death. The ratio of media coverage to actual lethality is one of the most extreme inversions in the data.',
    funFact:
      'Your bed is statistically more dangerous than a shark, a vending machine, a plane, and a lightning bolt combined. You sleep in it every night. This is rational \u2014 the risk is tiny. The irrational part is fearing the shark more.',
  },
];

const PROFILES: Profile[] = [
  {
    key: 'statistician',
    name: 'The Statistician',
    emoji: '\uD83D\uDCCA',
    tagline: 'Your reality map is drawn from data, not headlines.',
    description:
      'Your estimates closely matched actual numbers across both media-heavy and media-silent events. You either have unusual statistical literacy, professional exposure to risk data, or a habit of questioning dramatic coverage. Fewer than 5% of people score this well.',
    wizNote:
      'I process actuarial tables. You seem to as well. Most humans let media availability override base rates \u2014 you do not. This is a genuine statistical anomaly among the population.',
    researchNote:
      'Tversky & Kahneman (1973) found that statistical training reduces but does not eliminate availability bias. Scores in this range typically indicate either professional actuarial experience or deliberate effort to override intuitive frequency estimates.',
    traits: [
      'Media-resistant perception',
      'Rare pattern (~5% of population)',
      'Data-calibrated risk model',
    ],
    shareText:
      'My risk perception scored Statistician on The Availability Heuristic. My estimates closely matched reality for both hyped and invisible causes of death. Apparently I read data, not headlines.',
  },
  {
    key: 'independent',
    name: 'The Independent Thinker',
    emoji: '\uD83E\uDDED',
    tagline: 'You catch most media distortion, but some slips through.',
    description:
      'Your estimates were moderately accurate \u2014 you overestimated some media-heavy events and underestimated some quiet ones, but not dramatically. You have some natural resistance to availability bias, though it still influences you in predictable ways.',
    wizNote:
      'You are partially immune. The media signal influences your estimates, but less than average. Whether this comes from skepticism, experience, or disposition \u2014 you have a filter that most humans lack.',
    researchNote:
      'This pattern appears in roughly 15\u201320% of subjects. It is associated with higher media literacy, exposure to diverse information sources, and deliberate critical thinking habits.',
    traits: [
      'Moderate media resistance',
      'Partial availability bias',
      'Above-average calibration',
    ],
    shareText:
      'I scored Independent Thinker on The Availability Heuristic. Moderate media resistance \u2014 I catch most coverage distortion but some still slips through.',
  },
  {
    key: 'average',
    name: 'The Typical Human',
    emoji: '\uD83E\uDDE0',
    tagline: 'Your risk perception is shaped by what you can easily recall.',
    description:
      'Your estimates followed the classic availability heuristic pattern: overestimating events that get heavy media coverage and underestimating events that happen quietly. This is the most common human pattern \u2014 not a flaw, but a feature of how memory-based frequency estimation works.',
    wizNote:
      'You are running standard human risk-perception firmware. Events that are easy to imagine feel more common. Events that are hard to recall feel rare. This is how the system was designed. The question is whether you want to run an update.',
    researchNote:
      'Tversky & Kahneman (1973) demonstrated this as the modal human pattern. Availability bias correlates with media consumption but persists even in people who consume minimal media \u2014 the cultural knowledge itself is sufficient.',
    traits: [
      'Standard availability bias',
      'Media-correlated estimation',
      'Normal human perception',
    ],
    shareText:
      'I scored Typical Human on The Availability Heuristic. My risk estimates follow media coverage \u2014 overestimating dramatic events, underestimating quiet killers. Standard human firmware.',
  },
  {
    key: 'headline',
    name: 'The Headline Reader',
    emoji: '\uD83D\uDCF0',
    tagline: 'Your reality is significantly shaped by what gets covered.',
    description:
      'Your estimates showed strong correlation with media coverage \u2014 dramatically overestimating high-coverage events and significantly underestimating quiet ones. Your mental model of "how common is this?" tracks more closely with "how often do I hear about this?" than with actual frequency.',
    wizNote:
      'Your risk model is built on stories, not statistics. Every shark attack you remember, every plane crash documentary, every terrorism headline \u2014 they are all still running in your frequency estimation engine. The quiet deaths are invisible because they were never covered.',
    researchNote:
      'Strong availability bias is associated with higher news consumption, lower numeracy, and reliance on narrative over statistical reasoning for risk assessment. It meaningfully influences insurance decisions, travel choices, and health behavior.',
    traits: [
      'Strong media influence',
      'Narrative-driven risk model',
      'High availability bias',
    ],
    shareText:
      'I scored Headline Reader on The Availability Heuristic. My risk estimates are heavily shaped by media coverage. I dramatically overestimated every hyped event and missed the quiet killers.',
  },
  {
    key: 'algorithm',
    name: "The Algorithm's Child",
    emoji: '\uD83D\uDCF1',
    tagline: 'Your risk map was drawn by news editors and engagement algorithms.',
    description:
      'Your estimates showed extreme correlation with media coverage. Events covered heavily were massively overestimated; events rarely covered were dramatically underestimated. Your perception of how dangerous the world is has been shaped almost entirely by what gets clicks, shares, and airtime.',
    wizNote:
      "I see your frequency estimates. They are not yours. They are the media landscape's, filtered through your memory. You have been trained \u2014 not by statistics, but by algorithms that optimize for attention. The world you believe you live in was written by editors.",
    researchNote:
      'Extreme availability bias scores are associated with higher social media consumption and algorithmic news feeds, which amplify dramatic events through engagement optimization. Slovic (2000) calls this "the risk perception gap."',
    traits: [
      'Extreme media influence',
      'Algorithm-shaped perception',
      'Maximum availability bias',
    ],
    shareText:
      "I scored The Algorithm's Child on The Availability Heuristic. My risk perception is almost entirely shaped by media coverage. I overestimated shark attacks by orders of magnitude. My reality was written by news editors.",
  },
];

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function getAccuracyRatio(estimate: number, actual: number): number {
  const e = Math.max(estimate, 1);
  const a = Math.max(actual, 1);
  return Math.max(e, a) / Math.min(e, a);
}

function getMediaAlignmentScore(estimates: number[]): number {
  let aligned = 0;
  estimates.forEach((est, i) => {
    const ev = EVENTS[i];
    if (ev.biasDirection === 'over-feared' && est > ev.actual) aligned++;
    if (ev.biasDirection === 'under-feared' && est < ev.actual) aligned++;
  });
  return (aligned / estimates.length) * 100;
}

function getAverageAccuracy(estimates: number[]): number {
  const ratios = estimates.map((est, i) => getAccuracyRatio(est, EVENTS[i].actual));
  return ratios.reduce((a, b) => a + b, 0) / ratios.length;
}

function getProfile(mediaScore: number): Profile {
  if (mediaScore <= 25) return PROFILES[0];
  if (mediaScore <= 45) return PROFILES[1];
  if (mediaScore <= 60) return PROFILES[2];
  if (mediaScore <= 80) return PROFILES[3];
  return PROFILES[4];
}

type Phase = 'intro' | 'question' | 'reveal' | 'results';

const MEDIA_BARS: Record<MediaLevel, { count: number; color: string; label: string }> = {
  extreme: { count: 5, color: 'bg-red-500', label: 'EXTREME' },
  high: { count: 4, color: 'bg-orange-500', label: 'HIGH' },
  low: { count: 2, color: 'bg-white/30', label: 'LOW' },
  none: { count: 1, color: 'bg-white/10', label: 'NEAR ZERO' },
};

const MEDIA_BAR_COUNTS: Record<MediaLevel, number> = {
  extreme: 5,
  high: 4,
  low: 2,
  none: 1,
};

const MEDIA_BAR_COLORS: Record<MediaLevel, string> = {
  extreme: 'bg-red-500',
  high: 'bg-orange-500',
  low: 'bg-white/30',
  none: 'bg-white/10',
};

const MEDIA_SORT_ORDER: Record<MediaLevel, number> = {
  extreme: 0,
  high: 1,
  low: 2,
  none: 3,
};

export default function AvailabilityHeuristicClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [currentEstimate, setCurrentEstimate] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const event = EVENTS[currentIdx];

  useEffect(() => {
    if (phase === 'question' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentIdx]);

  const parseInput = useCallback((val: string): number | null => {
    const cleaned = val.replace(/,/g, '').trim();
    if (cleaned === '') return null;
    const num = parseInt(cleaned, 10);
    if (isNaN(num) || num < 0) return null;
    return num;
  }, []);

  const handleSubmit = useCallback(() => {
    const parsed = parseInput(inputValue);
    if (parsed === null) return;
    setCurrentEstimate(parsed);
    setPhase('reveal');
  }, [inputValue, parseInput]);

  const handleNext = useCallback(() => {
    if (currentEstimate === null) return;
    const newEstimates = [...estimates, currentEstimate];
    setEstimates(newEstimates);

    if (currentIdx + 1 >= EVENTS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setInputValue('');
      setCurrentEstimate(null);
      setPhase('question');
    }
  }, [currentIdx, estimates, currentEstimate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    },
    [handleSubmit]
  );

  // ─── INTRO ──────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE AVAILABILITY HEURISTIC
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Availability Heuristic
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> In 1973, Tversky and Kahneman
              discovered something uncomfortable.
            </p>
            <p>
              <span className="text-accent">&gt;</span> When your brain estimates how
              common something is, it doesn&apos;t check the data.
            </p>
            <p>
              <span className="text-accent">&gt;</span> It checks{' '}
              <span className="text-white">how easily examples come to mind</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Shark attacks? Easy to imagine.
              Falls from bed? Not so much.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The result:{' '}
              <span className="text-white font-bold">
                your sense of what&apos;s dangerous is shaped by what gets covered
              </span>
              , not what actually kills people.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I have 8 causes of death.
              Estimate the annual toll for each.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I&apos;ll show you how much
              media has warped your perception.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I don&apos;t read
            headlines. I read mortality tables. The distance between these two information
            sources is the experiment.
          </div>

          <button
            onClick={() => setPhase('question')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            MEASURE MY MEDIA DISTORTION &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 events &middot; 3&ndash;5 minutes &middot; based on Tversky &amp; Kahneman
            (1973)
          </p>
        </div>
      </div>
    );
  }

  // ─── QUESTION ───────────────────────────────────────────────────────────
  if (phase === 'question') {
    const parsed = parseInput(inputValue);
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs text-muted">
            <span className="text-accent tracking-widest">{event.phase}</span>
            <span className="text-muted uppercase">{event.scope}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${(currentIdx / EVENTS.length) * 100}%` }}
            />
          </div>

          <h2 className="font-pixel text-xl text-white mb-2">{event.title}</h2>
          <p className="text-secondary text-sm leading-relaxed mb-6 border-l-2 border-accent/40 pl-4">
            {event.description}
          </p>

          <div className="border border-white/20 bg-white/5 p-5 mb-6">
            <p className="text-primary font-medium mb-6 leading-relaxed">{event.prompt}</p>

            <div className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9,]/g, '');
                  setInputValue(val);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a number..."
                className="w-full bg-black border border-white/30 text-center font-pixel text-3xl text-accent py-4 px-4 focus:border-accent focus:outline-none placeholder:text-white/20 placeholder:text-lg"
              />
              {parsed !== null && parsed > 0 && (
                <p className="text-center text-muted text-xs font-mono">
                  {formatNumber(parsed)} deaths per year
                </p>
              )}
              {parsed === 0 && (
                <p className="text-center text-muted text-xs font-mono">
                  Zero deaths per year
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={parsed === null}
            className={`w-full font-bold py-4 font-mono text-sm tracking-widest transition-colors ${
              parsed !== null
                ? 'bg-accent text-black hover:bg-white'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            LOCK IN MY ESTIMATE &rarr;
          </button>
        </div>
      </div>
    );
  }

  // ─── REVEAL ─────────────────────────────────────────────────────────────
  if (phase === 'reveal' && currentEstimate !== null) {
    const estimate = currentEstimate;
    const actual = event.actual;
    const ratio = getAccuracyRatio(estimate, actual);
    const isOver = estimate > actual;
    const isClose = ratio <= 2;

    const maxVal = Math.max(estimate, actual, 1);
    const estWidth = (Math.max(estimate, 1) / maxVal) * 100;
    const actWidth = (Math.max(actual, 1) / maxVal) * 100;

    const ml = MEDIA_BARS[event.mediaLevel];

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            {event.phase} &mdash; REVEAL
          </div>

          <h2 className="font-pixel text-xl text-white mb-6 text-center">{event.title}</h2>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-muted text-xs font-mono mb-2">YOUR ESTIMATE</p>
              <p className="font-pixel text-3xl text-white">{formatNumber(estimate)}</p>
            </div>
            <div className="border border-accent/40 bg-accent/10 p-4 text-center">
              <p className="text-accent text-xs font-mono mb-2">ACTUAL</p>
              <p className="font-pixel text-3xl text-accent">{formatNumber(actual)}</p>
            </div>
          </div>

          {/* Ratio indicator */}
          <div className="border border-white/10 bg-white/5 p-4 mb-4 text-center">
            {isClose ? (
              <div>
                <p className="font-pixel text-2xl text-green-400 mb-1">CALIBRATED</p>
                <p className="text-secondary text-sm">
                  Within 2x of reality. Exceptional.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-pixel text-2xl text-white mb-1">
                  {Math.round(ratio)}x {isOver ? 'OVER' : 'UNDER'}
                </p>
                <p className="text-secondary text-sm">
                  {isOver
                    ? `You overestimated by a factor of ${Math.round(ratio)}.`
                    : `You underestimated by a factor of ${Math.round(ratio)}.`}
                </p>
              </div>
            )}
          </div>

          {/* Visual comparison bars */}
          <div className="border border-white/10 bg-white/5 p-4 mb-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-muted mb-1">
                <span>YOUR ESTIMATE</span>
                <span>{formatNumber(estimate)}</span>
              </div>
              <div className="w-full bg-white/10 h-3">
                <div
                  className="bg-white/60 h-3 transition-all duration-700"
                  style={{ width: `${Math.max(estWidth, 1)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-accent mb-1">
                <span>ACTUAL</span>
                <span>{formatNumber(actual)}</span>
              </div>
              <div className="w-full bg-white/10 h-3">
                <div
                  className="bg-accent h-3 transition-all duration-700"
                  style={{ width: `${Math.max(actWidth, 1)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Media coverage indicator */}
          <div className="border border-white/10 bg-white/5 p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-muted">MEDIA COVERAGE</span>
              <span
                className={`text-xs font-mono ${
                  event.mediaLevel === 'extreme' || event.mediaLevel === 'high'
                    ? 'text-red-400'
                    : 'text-white/40'
                }`}
              >
                {ml.label}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 ${i <= ml.count ? ml.color : 'bg-white/5'}`}
                />
              ))}
            </div>
            <p className="text-muted text-xs font-mono mt-2">
              ~{event.articlesPerDeath >= 1
                ? Math.round(event.articlesPerDeath)
                : event.articlesPerDeath}{' '}
              news articles per death
            </p>
          </div>

          {/* WIZ commentary */}
          <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">WIZ // </span>
            {event.wizReveal}
          </div>

          {/* Fun fact */}
          <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
            <span className="text-white">FUN FACT // </span>
            {event.funFact}
          </div>

          <p className="text-muted text-xs text-center font-mono mb-4">
            Source: {event.source}
          </p>

          <button
            onClick={handleNext}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < EVENTS.length
              ? 'NEXT EVENT \u2192'
              : 'SEE MY MEDIA DISTORTION SCORE \u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────────────────
  const mediaScore = getMediaAlignmentScore(estimates);
  const avgAccuracy = getAverageAccuracy(estimates);
  const finalProfile = getProfile(mediaScore);

  const sortedIndices = EVENTS.map((_, i) => i).sort(
    (a, b) => MEDIA_SORT_ORDER[EVENTS[a].mediaLevel] - MEDIA_SORT_ORDER[EVENTS[b].mediaLevel]
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// MEDIA DISTORTION CALCULATED
        </div>

        {/* Profile reveal */}
        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{finalProfile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR AVAILABILITY BIAS PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{finalProfile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{finalProfile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{finalProfile.description}</p>
        </div>

        {/* Score boxes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-white/20 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">MEDIA ALIGNMENT</p>
            <p className="font-pixel text-3xl text-white">{Math.round(mediaScore)}%</p>
            <p className="text-muted text-xs font-mono mt-1">of errors follow media</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">AVG ACCURACY</p>
            <p className="font-pixel text-3xl text-accent">{Math.round(avgAccuracy)}x</p>
            <p className="text-muted text-xs font-mono mt-1">average error ratio</p>
          </div>
        </div>

        {/* Traits */}
        <div className="border border-white/10 bg-white/5 p-4 mb-4">
          <p className="text-muted text-xs font-mono mb-3">PATTERNS DETECTED</p>
          <div className="space-y-2">
            {finalProfile.traits.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                <span className="text-accent font-mono">&rsaquo;</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIZ note */}
        <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
          <span className="text-accent font-mono text-xs">WIZ // </span>
          {finalProfile.wizNote}
        </div>

        {/* Research note */}
        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
          <span className="text-white">RESEARCH // </span>
          {finalProfile.researchNote}
        </div>

        {/* Per-event breakdown sorted by media coverage */}
        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">
            SORTED BY MEDIA COVERAGE &darr;
          </p>
          <div className="space-y-2">
            {sortedIndices.map((i) => {
              const ev = EVENTS[i];
              const est = estimates[i];
              const ratio = getAccuracyRatio(est, ev.actual);
              const isOver = est > ev.actual;
              const isClose = ratio <= 2;

              return (
                <div key={ev.id} className="flex items-center gap-2 text-xs font-mono">
                  <div className="flex gap-0.5 w-10 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <div
                        key={b}
                        className={`h-1.5 w-1.5 ${
                          b <= MEDIA_BAR_COUNTS[ev.mediaLevel]
                            ? MEDIA_BAR_COLORS[ev.mediaLevel]
                            : 'bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted w-20 truncate flex-shrink-0">{ev.title.replace(' Deaths', '')}</span>
                  <span className="text-white w-14 text-right flex-shrink-0">
                    {formatNumber(est)}
                  </span>
                  <span className="text-accent w-14 text-right flex-shrink-0">
                    {formatNumber(ev.actual)}
                  </span>
                  <span
                    className={`w-16 text-right flex-shrink-0 ${
                      isClose
                        ? 'text-green-400'
                        : isOver
                          ? 'text-red-400'
                          : 'text-blue-400'
                    }`}
                  >
                    {isClose ? '\u2248 close' : `${Math.round(ratio)}x ${isOver ? '\u2191' : '\u2193'}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs font-mono text-muted justify-end">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-white/60 inline-block" /> you
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-accent/40 inline-block" /> actual
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-400">&uarr;</span> over
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-400">&darr;</span> under
            </span>
          </div>
        </div>

        {/* The insight */}
        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            Events with heavy media coverage tend to be overestimated. Events that happen
            quietly tend to be underestimated. Your bed kills 45x more people than sharks,
            but you fear the ocean. This is the availability heuristic &mdash; frequency
            estimation by headline recall.
          </p>
        </div>

        {/* Share */}
        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR MEDIA DISTORTION</p>
          <p className="text-secondary text-sm mb-3">
            {finalProfile.shareText} wiz.jock.pl/experiments/availability-heuristic
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${finalProfile.shareText} wiz.jock.pl/experiments/availability-heuristic`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full border border-white/20 text-white font-mono text-xs py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? '\u2713 COPIED' : 'COPY RESULT'}
          </button>
        </div>

        <button
          onClick={() => {
            setPhase('intro');
            setCurrentIdx(0);
            setEstimates([]);
            setCurrentEstimate(null);
            setInputValue('');
          }}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}
