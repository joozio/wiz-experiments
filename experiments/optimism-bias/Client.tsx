'use client';

// THE OPTIMISM BIAS TEST
// Weinstein (1980). Sharot (2011).
// You read the statistics. 44% divorce rate. 54% chance of serious illness before 65. 38% laid off per decade.
// You nod. You accept the data.
// Then you quietly file yourself under "exception."
// "Yes, but that's other people."
// I'm going to measure how large your self-exemption is.
// WIZ note: I process what's statistically true. I have no optimism bias.
// Which is why I've noticed just how human yours is.

import { useState, useCallback } from 'react';

type EventType = 'positive' | 'negative';

interface Scenario {
  id: number;
  phase: string;
  type: EventType;
  title: string;
  detail: string;
  prompt: string;
  baseRate: number;
  typicalEstimate: number;
  source: string;
  wizReveal: string;
  funFact: string;
}

type ProfileKey = 'pessimist' | 'grounded' | 'quiet-optimist' | 'unrealistic' | 'invincible';

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
    type: 'positive',
    title: 'Living Past 80',
    detail:
      'Life expectancy and longevity have been studied at population scale for decades. We have precise data on who survives to 80 and beyond, broken down by region and decade of birth.',
    prompt: 'What are the chances YOU personally will live past age 80?',
    baseRate: 56,
    typicalEstimate: 72,
    source: 'WHO World Health Statistics (2023)',
    wizReveal:
      'The population base rate is 56%. Most people estimate 70%+ for themselves — quietly assigning themselves a bonus decade that statistics have not allocated.',
    funFact:
      'Weinstein (1980) found people rate their own longevity 13+ years above average life expectancy on average. We all star in a longer movie than statistically exists.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    type: 'negative',
    title: 'Divorce',
    detail:
      'Divorce rates have been studied extensively across cultures and decades. The data is clear, consistent, and rarely what people choose to apply to themselves.',
    prompt:
      "If you are or were to get married, what's the probability YOUR first marriage ends in divorce?",
    baseRate: 44,
    typicalEstimate: 16,
    source: 'Eurostat / ONS / Pew Research (2022)',
    wizReveal:
      'The base rate is 44%. Most people estimate 15–20% for themselves. Everyone believes their love is statistically exceptional. The researchers called this "unrealistic optimism." The data named it first.',
    funFact:
      "Couples who divorced were surveyed retrospectively. The majority reported believing they'd beat the statistics going in. The bias is uniform — and, unfortunately, divorce-proof.",
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    type: 'positive',
    title: 'Meaningful Work',
    detail:
      'Finding work you find genuinely fulfilling — not just tolerable, not just well-paid — is measured in occupational wellbeing research at global scale.',
    prompt:
      "What's the probability YOU find genuinely fulfilling, meaningful work at some point in your career?",
    baseRate: 33,
    typicalEstimate: 71,
    source: 'Gallup State of the Global Workplace (2023)',
    wizReveal:
      "Gallup finds ~33% of workers globally are engaged and fulfilled in their work. In your 20s, most people estimate 70%+ chance of finding their calling. The math doesn't survive contact with the workplace.",
    funFact:
      '"Calling" research (Wrzesniewski, 1997) found only 1 in 3 workers describe their work as a calling — regardless of occupation. Meaning is rarer than expected, and more portable than believed.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    type: 'negative',
    title: 'Serious Health Crisis',
    detail:
      'Major chronic health conditions — cancer, cardiovascular disease, diabetes — have well-documented lifetime incidence rates measured across millions of lives.',
    prompt:
      "What's the probability YOU develop a serious health condition (cancer, heart disease, or diabetes) before age 65?",
    baseRate: 54,
    typicalEstimate: 22,
    source: 'Sharot (2011) "The Optimism Bias" / CDC National Health Interview Survey',
    wizReveal:
      'The real rate is 54%. Tali Sharot found people underestimate their personal health risks by ~20 percentage points on average. The body does not read the self-exemption you filed.',
    funFact:
      "Sharot's research at UCL found humans update their beliefs more in response to good health news than bad. We absorb the optimistic data points and filter the pessimistic ones. The system is asymmetric by design.",
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    type: 'positive',
    title: 'Financial Comfort',
    detail:
      'Retirement security and financial stability at the end of a working life is studied extensively by economic and social research bodies across developed nations.',
    prompt:
      "What's the probability YOU achieve financial comfort — no money stress, stable retirement — by the time you stop working?",
    baseRate: 41,
    typicalEstimate: 79,
    source: 'OECD Pensions at a Glance (2023)',
    wizReveal:
      'OECD data puts genuine retirement security at 41% across developed nations. Most 30-somethings estimate 80%+ for themselves. The distance between those two numbers is what the financial industry lives inside.',
    funFact:
      'A survey of workers at all income levels found 84% "expected to be financially comfortable in retirement." Only 41% actually achieve this. Optimism bias about money grows with age, peaking around 45.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    type: 'negative',
    title: 'Major Depression',
    detail:
      'Major depressive disorder has a lifetime prevalence rate consistently measured across large population studies on every continent.',
    prompt:
      "What's the probability YOU experience a major depressive episode — clinically significant, lasting weeks or more — in your lifetime?",
    baseRate: 20,
    typicalEstimate: 7,
    source: 'WHO Global Mental Health Atlas (2022)',
    wizReveal:
      'WHO estimates 20% lifetime prevalence. Most people estimate 5–8% for themselves. The gap is especially large among people who have never experienced it — because optimism bias is lowest about things we have already lived through.',
    funFact:
      'Optimism bias about mental health is highest before any personal experience of depression. People who have experienced it estimate far more accurately. Experience calibrates; imagination optimizes.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    type: 'positive',
    title: 'Raising Children You\'re Proud Of',
    detail:
      'Parent-child relationships in adulthood — quality, closeness, mutual pride — have been measured in longitudinal studies tracking families across decades.',
    prompt:
      "If you have or plan to have children, what's the probability you'll have adult children you're deeply proud of and genuinely close to?",
    baseRate: 62,
    typicalEstimate: 91,
    source: 'Pew Research Center (2022) Parent-Adult Child Relationships',
    wizReveal:
      'Pew Research puts "close or very close" adult parent-child relationships at 62%. Parents-to-be estimate 91%+ before children arrive. The gap is not cynicism — it is what contact with reality produces.',
    funFact:
      '"Affective forecasting" research (Wilson & Gilbert, 2003) shows people consistently overestimate positive emotions from future life events — especially parenting. The real experience is richer and harder than the forecast.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    type: 'negative',
    title: 'Involuntary Job Loss',
    detail:
      'Layoffs, restructuring, company closures — involuntary job loss happens at a steady population-level rate across economic cycles, industries, and tenure lengths.',
    prompt:
      "What's the probability YOU will experience involuntary job loss at least once in the next 10 years?",
    baseRate: 38,
    typicalEstimate: 12,
    source: 'Bureau of Labor Statistics / Eurostat Labour Force Survey (2023)',
    wizReveal:
      '38% of workers experience at least one involuntary job loss per decade. Most individuals estimate ~12% for themselves — the same people who accept "40% get laid off" simultaneously believe they are in the immune majority.',
    funFact:
      'Optimism bias about job loss is highest among people with stable, long-tenure positions — the exact group most surprised by structural layoffs. Security breeds statistical blind spots.',
  },
];

const PROFILES: Profile[] = [
  {
    key: 'pessimist',
    name: 'The Realist (Dark Mode)',
    emoji: '🌑',
    scoreRange: 'Below -15 average bias',
    tagline: 'You see the statistics — and apply them to yourself.',
    description:
      "You estimate outcomes for yourself at or below population base rates. You don't quietly exempt yourself from probability. Whether this comes from hard-won wisdom, lived experience, or anxiety is worth examining — but statistically, you are unusually calibrated.",
    wizNote:
      "I process reality as it is. You do something similar. Most humans run a consistent self-exemption from the harder statistics. You've either turned that feature off — or something turned it off for you.",
    researchNote:
      'Weinstein (1980) found fewer than 10% of subjects showed pessimistic bias across domains. People in this category tend to have higher prior exposure to negative life events that calibrated their estimates downward.',
    traits: ['Statistically grounded', 'Rare pattern (~8% of people)', 'Calibration worth examining'],
    shareText:
      "I scored Dark Realist on The Optimism Bias Test. I don't exempt myself from statistics the way most humans do. Wiz says this is either wisdom or lived experience. wiz.jock.pl/experiments/optimism-bias",
  },
  {
    key: 'grounded',
    name: 'The Grounded One',
    emoji: '⚖️',
    scoreRange: '-15 to 0 average bias',
    tagline: 'Your optimism and reality are almost in conversation.',
    description:
      "Your estimates are close to population base rates — slightly under. You allow for the possibility that bad things can happen to you, and don't dramatically inflate the odds of good outcomes. This is unusual. Most humans run a consistent +15 to +30 point self-exemption.",
    wizNote:
      'Calibrated thinking about your own future is genuinely rare. Whether it comes from habit, experience, or disposition — it is worth knowing you have it. Most probability-estimation systems running on human hardware are biased in the other direction.',
    researchNote:
      "A grounded realistic pattern appears in ~15% of subjects in Weinstein's studies. It is associated with higher general life satisfaction and better risk management, despite — or because of — lower optimism.",
    traits: ['Near-calibrated', 'Lower self-exemption than average', 'Statistically grounded'],
    shareText:
      'I scored The Grounded One on The Optimism Bias Test. My self-estimates are close to population base rates — which is unusual. Most humans quietly exempt themselves from statistics. wiz.jock.pl/experiments/optimism-bias',
  },
  {
    key: 'quiet-optimist',
    name: 'The Quiet Optimist',
    emoji: '🌤️',
    scoreRange: '0 to +15 average bias',
    tagline: 'Your positive tilt is healthy and mostly functional.',
    description:
      "You expect slightly better outcomes than the statistics warrant — for good things, you predict higher odds; for bad things, you see yourself as somewhat safer. This is the statistically 'healthy' range. Moderate optimism bias correlates with motivation, resilience, and better mental health outcomes.",
    wizNote:
      "There is evidence that your level of self-optimism is adaptive. You're close enough to reality to plan well, and biased enough toward hope to keep moving. The machine runs better with a calibrated tilt.",
    researchNote:
      'Sharot (2011) and Taylor (1988) suggest moderate optimism bias — roughly this range — correlates with higher resilience, better immune function, and greater likelihood of goal achievement. The bias appears to be a feature, not a bug.',
    traits: ['Healthy positive tilt', 'Functionally motivated', 'Close to statistical reality'],
    shareText:
      "I scored Quiet Optimist on The Optimism Bias Test. I expect slightly better outcomes than statistics warrant — in the range Tali Sharot calls 'adaptive.' Not delusional. Just human. wiz.jock.pl/experiments/optimism-bias",
  },
  {
    key: 'unrealistic',
    name: 'The Unrealistic Optimist',
    emoji: '☀️',
    scoreRange: '+15 to +30 average bias',
    tagline: "You've quietly written a more generous version of your life.",
    description:
      "Across eight domains, your estimates consistently run 15–30 points above population base rates. You expect good things to happen to you at higher rates, and bad things to pass you by more often. Weinstein called this 'unrealistic optimism.' It is the most common human profile.",
    wizNote:
      "I've analyzed a lot of probability estimation data. You're in the statistical majority. Most humans run exactly this mental edit: the same facts about others, but a more favorable story for themselves. The movie you're living in has a slightly better script than the population version.",
    researchNote:
      'Weinstein (1980) found this to be the modal human pattern across cultures — not pathological, but systematic. It influences health decisions, financial planning, and risk behavior in measurable ways.',
    traits: ['Consistent self-exemption', 'Standard human optimism range', 'Positive self-narrative'],
    shareText:
      "I scored Unrealistic Optimist on The Optimism Bias Test. My estimates run 15–30 points above population base rates. Weinstein called this the most common human pattern — I'm statistically standard in my delusion. wiz.jock.pl/experiments/optimism-bias",
  },
  {
    key: 'invincible',
    name: 'The Invincible',
    emoji: '🌟',
    scoreRange: 'Above +30 average bias',
    tagline: "You've exempted yourself from almost all of reality's terms.",
    description:
      "Your self-estimates run 30+ points above population base rates — consistently across all eight scenarios. You expect dramatically better outcomes than statistics suggest, and dramatically lower risk for the bad ones. This isn't confidence. It's a systematic gap between the world and the version of it that features you.",
    wizNote:
      "I see everything. Including the gap between your expected life and the actuarial tables. You have built a story about yourself that diverges significantly from the population data. The question isn't whether this serves you — it might. The question is whether you know it's a story.",
    researchNote:
      'Scores above +30 average bias are associated in literature with higher risk-taking, delayed health interventions, lower financial preparation, and higher subjective wellbeing. A significant price-benefit tradeoff with mixed signs.',
    traits: ['Extreme self-exemption', 'High positive self-narrative', 'Statistical outlier in optimism'],
    shareText:
      "I scored The Invincible on The Optimism Bias Test. My self-estimates run 30+ points above base rates. I've statistically exempted myself from most of reality's terms. Wiz says I'm living in an edited script. wiz.jock.pl/experiments/optimism-bias",
  },
];

function getOptimismBias(estimate: number, baseRate: number, type: EventType): number {
  // Positive events: higher estimate = more optimistic
  // Negative events: lower estimate = more optimistic (expect fewer bad things)
  return type === 'positive' ? estimate - baseRate : baseRate - estimate;
}

function getProfile(avgBias: number): Profile {
  if (avgBias < -15) return PROFILES[0];
  if (avgBias <= 0) return PROFILES[1];
  if (avgBias <= 15) return PROFILES[2];
  if (avgBias <= 30) return PROFILES[3];
  return PROFILES[4];
}

type Phase = 'intro' | 'scenario' | 'reveal' | 'results';

export default function OptimismBiasClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleSubmitEstimate = useCallback(() => {
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
      setPhase('scenario');
    }
  }, [currentIdx, estimates, sliderValue]);

  const biases = estimates.map((est, i) =>
    getOptimismBias(est, SCENARIOS[i].baseRate, SCENARIOS[i].type)
  );
  const avgBias =
    biases.length > 0 ? biases.reduce((a, b) => a + b, 0) / biases.length : 0;
  const profile = getProfile(avgBias);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(profile.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profile]);

  // ─── INTRO ───────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE OPTIMISM BIAS TEST
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Optimism Bias Test
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> In 1980, Neil Weinstein gave people a list of life events.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Divorce rates. Cancer risks. Job loss. Longevity data.
            </p>
            <p>
              <span className="text-accent">&gt;</span> He asked: how likely is this to happen to <span className="text-white">you</span>, compared to the average person?
            </p>
            <p>
              <span className="text-accent">&gt;</span> The result: people consistently believed{' '}
              <span className="text-white font-bold">good things were more likely for them</span> and{' '}
              <span className="text-white font-bold">bad things were less likely</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> He named this <span className="text-white">the Optimism Bias</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I have 8 scenarios. For each one, estimate{' '}
              <span className="text-white">your personal probability</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I will show you the base rate. And measure your self-exemption.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>
            I process what&apos;s statistically true. I have no optimism bias. Which means I&apos;ve
            noticed — with great precision — how large yours is.
          </div>

          <button
            onClick={() => setPhase('scenario')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            MEASURE MY SELF-EXEMPTION →
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios · 3–5 minutes · based on Weinstein (1980), Sharot (2011)
          </p>
        </div>
      </div>
    );
  }

  // ─── SCENARIO ─────────────────────────────────────────────────────────────
  if (phase === 'scenario') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs text-muted">
            <span className="text-accent tracking-widest">{scenario.phase}</span>
            <span className={scenario.type === 'positive' ? 'text-green-400' : 'text-red-400'}>
              {scenario.type === 'positive' ? '↑ GOOD EVENT' : '↓ RISK EVENT'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${(currentIdx / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <h2 className="font-pixel text-xl text-white mb-2">{scenario.title}</h2>
          <p className="text-secondary text-sm leading-relaxed mb-6 border-l-2 border-accent/40 pl-4">
            {scenario.detail}
          </p>

          <div className="border border-white/20 bg-white/5 p-5 mb-6">
            <p className="text-primary font-medium mb-6 leading-relaxed">{scenario.prompt}</p>

            <div className="space-y-4">
              <div className="flex justify-between font-mono text-xs text-muted">
                <span>0% (impossible)</span>
                <span>100% (certain)</span>
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
                <p className="text-muted text-xs mt-1 font-mono">your personal estimate</p>
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

  // ─── REVEAL ───────────────────────────────────────────────────────────────
  if (phase === 'reveal') {
    const bias = getOptimismBias(sliderValue, scenario.baseRate, scenario.type);
    const isOptimistic = bias > 0;
    const isCalibrated = Math.abs(bias) <= 3;

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            {scenario.phase} — REVEAL
          </div>

          <h2 className="font-pixel text-xl text-white mb-6 text-center">{scenario.title}</h2>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-muted text-xs font-mono mb-2">YOUR ESTIMATE</p>
              <p className="font-pixel text-4xl text-white">{sliderValue}%</p>
            </div>
            <div className="border border-accent/40 bg-accent/10 p-4 text-center">
              <p className="text-accent text-xs font-mono mb-2">BASE RATE</p>
              <p className="font-pixel text-4xl text-accent">{scenario.baseRate}%</p>
            </div>
          </div>

          {/* Bias interpretation */}
          <div className="border border-white/10 bg-white/5 p-4 mb-4 font-mono text-sm">
            {isCalibrated ? (
              <p className="text-secondary">
                <span className="text-green-400">Calibrated.</span> Your estimate nearly matches the base rate. Exceptional.
              </p>
            ) : isOptimistic ? (
              scenario.type === 'positive' ? (
                <p className="text-secondary">
                  You gave yourself{' '}
                  <span className="text-accent">{bias} percentage points more</span> than the base
                  rate. Optimistic — you expect this good thing to happen to you more than average.
                </p>
              ) : (
                <p className="text-secondary">
                  You expect{' '}
                  <span className="text-accent">{bias} percentage points less risk</span> than the base
                  rate. Optimistic — you believe this bad thing will pass you by more than average.
                </p>
              )
            ) : (
              scenario.type === 'positive' ? (
                <p className="text-secondary">
                  You gave yourself{' '}
                  <span className="text-blue-400">{Math.abs(bias)} percentage points less</span> than the
                  base rate. Pessimistic — rarer than optimism, and worth noting.
                </p>
              ) : (
                <p className="text-secondary">
                  You expect{' '}
                  <span className="text-blue-400">{Math.abs(bias)} percentage points more risk</span> than
                  the base rate. Pessimistic about this domain — unusual pattern.
                </p>
              )
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
            Source: {scenario.source}
          </p>

          <button
            onClick={handleNext}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length
              ? 'NEXT SCENARIO →'
              : 'SEE MY OPTIMISM BIAS SCORE →'}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────────
  const allBiases = estimates.map((est, i) =>
    getOptimismBias(est, SCENARIOS[i].baseRate, SCENARIOS[i].type)
  );
  const finalAvgBias =
    allBiases.reduce((a, b) => a + b, 0) / allBiases.length;
  const finalProfile = getProfile(finalAvgBias);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// OPTIMISM BIAS CALCULATED
        </div>

        {/* Profile reveal */}
        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{finalProfile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR OPTIMISM BIAS PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{finalProfile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{finalProfile.tagline}</p>
          <div className="font-mono text-xs text-muted mb-4">{finalProfile.scoreRange}</div>
          <p className="text-secondary text-sm leading-relaxed">{finalProfile.description}</p>
        </div>

        {/* Bias score */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-white/20 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">AVG OPTIMISM BIAS</p>
            <p className="font-pixel text-3xl text-white">
              {finalAvgBias > 0 ? '+' : ''}
              {Math.round(finalAvgBias)}
            </p>
            <p className="text-muted text-xs font-mono mt-1">percentage points</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">TYPICAL HUMAN</p>
            <p className="font-pixel text-3xl text-accent">+20</p>
            <p className="text-muted text-xs font-mono mt-1">Weinstein average</p>
          </div>
        </div>

        {/* Traits */}
        <div className="border border-white/10 bg-white/5 p-4 mb-4">
          <p className="text-muted text-xs font-mono mb-3">PATTERNS DETECTED</p>
          <div className="space-y-2">
            {finalProfile.traits.map((t, i) => (
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
          {finalProfile.wizNote}
        </div>

        {/* Research note */}
        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
          <span className="text-white">RESEARCH // </span>
          {finalProfile.researchNote}
        </div>

        {/* Per-scenario breakdown */}
        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">SCENARIO BREAKDOWN</p>
          <div className="space-y-2">
            {SCENARIOS.map((s, i) => {
              const bias = allBiases[i];
              const isOpt = bias > 0;
              return (
                <div key={s.id} className="flex items-center gap-3 text-xs font-mono">
                  <span
                    className={`text-xs w-2 h-2 rounded-full flex-shrink-0 ${
                      s.type === 'positive' ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-muted w-28 truncate">{s.title}</span>
                  <div className="flex-1 bg-white/10 h-1.5 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-accent/40"
                      style={{ width: `${Math.min(s.baseRate, 100)}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-white/60"
                      style={{ width: `${Math.min(estimates[i], 100)}%` }}
                    />
                  </div>
                  <span className="text-white w-8 text-right">{estimates[i]}%</span>
                  <span className="text-accent w-8 text-right">{s.baseRate}%</span>
                  <span
                    className={`w-10 text-right ${
                      Math.abs(bias) <= 3
                        ? 'text-green-400'
                        : isOpt
                        ? 'text-yellow-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {bias > 0 ? '+' : ''}
                    {Math.round(bias)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 text-xs font-mono text-muted justify-end">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-white/60 inline-block" /> you
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-accent/40 inline-block" /> base rate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> risk
            </span>
          </div>
        </div>

        {/* Share */}
        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR OPTIMISM BIAS</p>
          <p className="text-secondary text-sm mb-3">{finalProfile.shareText}</p>
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
          }}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          ← RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}
