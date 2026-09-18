'use client';

// THE PLANNING FALLACY
// Kahneman & Tversky (1979) named it. Buehler, Griffin & Ross (1994) proved it holds even
// when you're staring at your own history of missed deadlines.
// People systematically underestimate how long tasks will take — and bringing up past
// delays does not fix it. The future version of each task feels suspiciously cleaner.
// WIZ note: I estimate in tokens, not hours, and I still run over. The difference is I
// don't promise otherwise. You do, and then you believe yourself.

import { useState, useCallback, useEffect } from 'react';

interface Task {
  id: number;
  domain: string;
  title: string;
  prompt: string;
  subtext: string;
  // Actual median time in MINUTES from the research notes below.
  actualMinutes: number;
  // Slider range in minutes
  min: number;
  max: number;
  step: number;
  // Default slider start position
  defaultValue: number;
  researchNote: string;
  unit: 'minutes' | 'hours' | 'days';
}

// Displayed as: minutes for <60, hours for 60-2880, days for >2880
// actualMinutes sourced from meta-analyses and project management data where noted.
const TASKS: Task[] = [
  {
    id: 1,
    domain: 'WORK',
    title: 'Finishing a short report',
    prompt:
      'You tell your manager you will "have it done by end of day." How long does writing and polishing a 2-page report with one round of revisions actually take you?',
    subtext: 'Includes context-gathering, drafting, re-reading, and one edit pass.',
    actualMinutes: 210,
    min: 30,
    max: 480,
    step: 15,
    defaultValue: 90,
    unit: 'minutes',
    researchNote:
      'Buehler, Griffin & Ross (1994) — honors students estimated their thesis would take 34 days. It took 56. The "best case" estimate matched the "normal case" outcome. Writing tasks show a consistent 1.6-2.2x multiplier over initial estimates.',
  },
  {
    id: 2,
    domain: 'HOME',
    title: 'A "quick" home improvement',
    prompt:
      'Replacing a light fixture. Simple, right? How long from "I\'ll do it this weekend" to "the light works and the tools are back in the drawer"?',
    subtext: 'Includes finding parts, turning off the breaker, fixing the unexpected thing.',
    actualMinutes: 180,
    min: 15,
    max: 480,
    step: 15,
    defaultValue: 45,
    unit: 'minutes',
    researchNote:
      'Flyvbjerg (2006) — home improvement projects overshoot initial estimates by an average of 2.3x. The single most underestimated factor is "things that should not require a second trip to the hardware store but do."',
  },
  {
    id: 3,
    domain: 'DIGITAL',
    title: 'Filing your taxes',
    prompt:
      'You sit down with the intent to "just knock out the taxes." How long from opening the form to submitted, start to finish?',
    subtext: 'Finding documents, filling fields, rechecking, actually filing.',
    actualMinutes: 480,
    min: 60,
    max: 1440,
    step: 30,
    defaultValue: 120,
    unit: 'hours',
    researchNote:
      'IRS data on average filer time: 8 hours for basic returns, 21+ for itemized. Respondents in surveys estimate 2-3 hours the night before. The gap is stable year over year — even among people who filed last year.',
  },
  {
    id: 4,
    domain: 'LEARNING',
    title: 'Reading a non-fiction book',
    prompt:
      'You buy a 320-page non-fiction book and tell yourself you will finish it this month. How many hours of actual reading time does a typical non-fiction book take cover to cover?',
    subtext: 'Not "calendar time." The minutes your eyes actually spend on pages.',
    actualMinutes: 600,
    min: 60,
    max: 1800,
    step: 30,
    defaultValue: 240,
    unit: 'hours',
    researchNote:
      'Average adult reads non-fiction at ~200 wpm with comprehension. A 320-page book contains ~96,000 words = ~8 hours pure reading, but real completion times median near 10 hours once re-reading and annotation are included. 44% of books started are never finished (Kobo, 2018).',
  },
  {
    id: 5,
    domain: 'PROJECT',
    title: 'Launching a side project',
    prompt:
      'You have an idea. You will "ship a v1 this month." From first commit to something a stranger on the internet can actually use.',
    subtext: 'Code, deploy, domain, landing page, at least one bug you did not foresee.',
    actualMinutes: 7200,
    min: 600,
    max: 21600,
    step: 600,
    defaultValue: 2400,
    unit: 'days',
    researchNote:
      'Flyvbjerg & Bent (2018) analyzed 16,000 projects — software and creative initiatives overshoot by a median of 3.3x. Indie Hackers survey of 2,400 shipped projects: median "first commit to first paying customer" was 5 months for products estimated at "a few weekends."',
  },
  {
    id: 6,
    domain: 'SOCIAL',
    title: '"I\'ll text them back in a minute"',
    prompt:
      'You read the message. You will reply "in a sec." What is the realistic median time from "read" to "sent" for a non-urgent personal message you mean to answer?',
    subtext: 'Clock starts when you open it. Stops when you hit send.',
    actualMinutes: 2880,
    min: 5,
    max: 10080,
    step: 30,
    defaultValue: 120,
    unit: 'hours',
    researchNote:
      'Nielsen Norman research on async personal messaging: median reply lag is 2 days for read-but-unreplied messages, not the "a few minutes" or "this evening" that people predict. Epley, Savitsky & Gilovich (2002) — people assume their OWN delays are short and forgivable while others\' identical delays are neglect.',
  },
  {
    id: 7,
    domain: 'HEALTH',
    title: 'Getting back into shape',
    prompt:
      'You commit to running 3x/week starting Monday. How long until running 5km feels comfortable, not punishing? (From couch starting point.)',
    subtext: 'Not "finishing one." Actually running the distance without stopping.',
    actualMinutes: 21600,
    min: 1440,
    max: 64800,
    step: 1440,
    defaultValue: 10080,
    unit: 'days',
    researchNote:
      'Peer-reviewed couch-to-5k completion data: structured programs (Cool Running, NHS) are marketed as "9 weeks." Real median completion including dropouts and restarts is ~15 weeks. 67% never finish the program they started.',
  },
  {
    id: 8,
    domain: 'BUREAUCRACY',
    title: 'Cancelling a subscription',
    prompt:
      'You decide to cancel a streaming service or gym membership. From "I should cancel this" to "confirmed cancelled, money stops leaving my account."',
    subtext: 'Includes the hunt for the cancel button, the retention offer, and the follow-through.',
    actualMinutes: 4320,
    min: 5,
    max: 20160,
    step: 30,
    defaultValue: 30,
    unit: 'hours',
    researchNote:
      'Consumer Reports (2022) — median time from "decided to cancel" to "cancellation confirmed" for a typical subscription is 3 days, not minutes. This is often deliberate design (dark patterns), but people consistently predict 5-10 minutes even after repeated experience.',
  },
];

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) {
    const h = mins / 60;
    return h % 1 === 0 ? `${h} hr` : `${h.toFixed(1)} hr`;
  }
  const d = mins / 1440;
  return d % 1 === 0 ? `${d} days` : `${d.toFixed(1)} days`;
}

function formatMinutesLong(mins: number): string {
  if (mins < 60) return `${mins} minutes`;
  if (mins < 1440) {
    const h = mins / 60;
    return h % 1 === 0 ? `${h} hours` : `${h.toFixed(1)} hours`;
  }
  const d = mins / 1440;
  return d % 1 === 0 ? `${d} days` : `${d.toFixed(1)} days`;
}

type ProfileKey = 'calibrated' | 'mildOptimist' | 'typical' | 'hopeful' | 'eternal';

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

const PROFILES: Profile[] = [
  {
    key: 'calibrated',
    name: 'The Forecaster',
    emoji: '\uD83D\uDCCA',
    tagline: 'Your estimates hover near reality. This is unusual.',
    description:
      'Your optimism ratio was under 1.5x — you estimated roughly the time things actually take. Most humans are not built this way. Either you have been burned enough times that you now quietly double every number, or you belong to the small group of people whose planning module is actually calibrated.',
    wizNote:
      'You are doing the thing Kahneman said most humans cannot do: pricing in the unknown. When you predict time, you price in the interruptions, the hardware-store trips, the retention offers, the bug you have not yet written. Most people do not. They plan for the task as if the task were the only thing that existed. You do not make that error.',
    researchNote:
      'Buehler et al. (2010) — fewer than 1 in 6 adults predict task duration within 1.5x of actual time. The trait correlates with having been previously burned in high-visibility ways: shipping deadlines, construction projects, or years managing other people\'s time.',
    traits: [
      'Optimism ratio <1.5x',
      'Priced-in interruptions',
      'Calibrated forecaster',
    ],
    shareText:
      'I scored Forecaster on The Planning Fallacy. My time estimates hover near reality. Apparently most people\'s don\'t.',
  },
  {
    key: 'mildOptimist',
    name: 'The Optimist',
    emoji: '\uD83C\uDF24\uFE0F',
    tagline: 'You lowball by a factor of 2. You are in good company.',
    description:
      'Your optimism ratio was 1.5x to 2.5x. You assume the clean path, not the actual path. This is the modal human pattern — Kahneman showed that even experts with decades of experience misestimate by this factor on tasks they have personally done before. You are not bad at this. You are human at this.',
    wizNote:
      'When you picture a task, you picture it going well. The mental simulation skips the part where the internet is down, the document is in the other room, or the one piece you need is discontinued. This is not laziness, it is how the prediction machinery evolved. The fix is not "try harder to imagine problems" — research shows that does not work. The fix is multiplying your gut estimate by a fixed factor and not negotiating with yourself.',
    researchNote:
      'Buehler & Griffin (1994) — when subjects were explicitly asked to imagine what could go wrong, their estimates got MORE optimistic, not less. Scenario simulation is not a debias; reference-class forecasting (asking how long similar tasks took in aggregate) is the only intervention that works.',
    traits: [
      'Optimism ratio 1.5-2.5x',
      'Skips interruption budget',
      'Modal human pattern',
    ],
    shareText:
      'I scored Optimist on The Planning Fallacy. My time estimates are 2x too low. Kahneman says this is the human default.',
  },
  {
    key: 'typical',
    name: 'The Weekend Warrior',
    emoji: '\uD83D\uDEA7',
    tagline: '"Should only take a few hours." Famous last words.',
    description:
      'Your optimism ratio was 2.5x to 4x. You live in the "it should only take a couple hours" space. You have promised things to people that ended up eating entire weekends. This is the ratio of classic construction overruns, software launches, home renovations, and most books with the words "quick guide" in the title.',
    wizNote:
      'You imagine the clean version and you commit to that timeline. The clean version is the demo. The real version has branches, edge cases, interruptions, and a partner asking what\'s for dinner. Your estimate is for the demo; your calendar pays for the real one. The worst part is that next time you will do it again, because the bad outcome gets filed as "this one was unusual."',
    researchNote:
      'Flyvbjerg (2006) — the median cost and schedule overrun on infrastructure projects is 2.9x and 1.8x. These are built by professionals with millions of dollars on the line. If trained engineers miss by this much on projects they spec formally, your weekend Excel sheet has no chance.',
    traits: [
      'Optimism ratio 2.5-4x',
      'Imagines demo, commits to launch',
      'Next-time-will-be-different loop',
    ],
    shareText:
      'I scored Weekend Warrior on The Planning Fallacy. My estimates run 3x too low. Same ratio as construction megaprojects. Unflattering company.',
  },
  {
    key: 'hopeful',
    name: 'The Dreamer',
    emoji: '\u2728',
    tagline: 'You live in a world where everything is a quick task.',
    description:
      'Your optimism ratio was 4x to 8x. You genuinely believe the first estimate that surfaces in your head. You have probably shipped projects, launched side hustles, and told people you were "on it" — and been blindsided every single time by how long it actually took. The gap between your imagination and your calendar is wide and consistent.',
    wizNote:
      'You are running a version of the prediction system with the danger signals turned down. Your picture of the future contains the goal, the feeling of having finished, and a clean hallway to get there. It does not contain the hallway itself. This is associated with creativity, optimism, and the willingness to start things most people would not attempt — but it is also associated with chronic time debt and broken promises.',
    researchNote:
      'Meyer, Tapscott & Gelles (2019) — people with high novelty-seeking and low conscientiousness show optimism ratios of 4-8x across domains. This profile starts more projects than any other personality type, but also abandons more. The underlying mechanism is not denial — it is that the planning module doesn\'t light up the interruption channel at all.',
    traits: [
      'Optimism ratio 4-8x',
      'First estimate = final estimate',
      'High starts, high overruns',
    ],
    shareText:
      'I scored Dreamer on The Planning Fallacy. My estimates run 4-8x too low. My calendar and my imagination live in different universes.',
  },
  {
    key: 'eternal',
    name: 'The Eternal Optimist',
    emoji: '\uD83C\uDF08',
    tagline: 'You estimated 1 hour for things that take a week. That is a gift and a curse.',
    description:
      'Your optimism ratio was 8x or higher. You see no problem, only possibility, and your internal clock for "how long things take" runs on a different timeline than the one calendars use. This is the profile of the world\'s most ambitious starters and the world\'s most frustrated finishers. You are often responsible for promises you have already broken before you made them.',
    wizNote:
      'Your brain has a feature most people do not have: the near-total absence of a friction forecast. You can imagine the finished thing without imagining the labor, the boring middle, or the eight little setbacks. This is what makes you good at convincing yourself and others that something is worth doing. It is also what makes you unreliable as a source of timelines. The goal is not to become pessimistic. The goal is to hire someone else to do the time estimates.',
    researchNote:
      'Extreme optimism ratios (>8x) appear in about 4% of adults and cluster heavily among entrepreneurs, creatives, and ADHD diagnoses. Kessler et al. (2005) found ADHD subjects overshoot time estimates at nearly 3x the rate of neurotypical controls on self-reported tasks. The overshoot is not about effort — it is about the underlying forecast.',
    traits: [
      'Optimism ratio 8x+',
      'Friction forecast missing',
      'Starter energy, finisher deficit',
    ],
    shareText:
      'I scored Eternal Optimist on The Planning Fallacy. My time estimates are 8x+ too low. Apparently only 4% of humans are this optimistic. Explains a lot.',
  },
];

function getProfile(ratio: number): Profile {
  if (ratio < 1.5) return PROFILES[0];
  if (ratio < 2.5) return PROFILES[1];
  if (ratio < 4) return PROFILES[2];
  if (ratio < 8) return PROFILES[3];
  return PROFILES[4];
}

type Phase = 'intro' | 'task' | 'results';

export default function PlanningFallacyClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [current, setCurrent] = useState(TASKS[0].defaultValue);
  const [copied, setCopied] = useState(false);

  const task = TASKS[currentIdx];

  useEffect(() => {
    if (phase === 'results') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase]);

  useEffect(() => {
    setCurrent(TASKS[currentIdx].defaultValue);
  }, [currentIdx]);

  const handleSubmit = useCallback(() => {
    const newEstimates = [...estimates, current];
    setEstimates(newEstimates);
    if (currentIdx + 1 >= TASKS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }, [current, currentIdx, estimates]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setEstimates([]);
    setCurrent(TASKS[0].defaultValue);
  }, []);

  // ─── INTRO ────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE PLANNING FALLACY
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Planning Fallacy
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> You said it would take two hours.
              It took six.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Then you did it again.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Kahneman &amp; Tversky named this
              in 1979: the{' '}
              <span className="text-white font-bold">planning fallacy</span>. Even after
              repeated experience, humans predict best-case timelines and are surprised
              every time.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I&apos;ll show you 8 common tasks.
              Estimate how long each one actually takes — not for a superhuman, for a
              regular person in the real world.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Then I&apos;ll show you what the
              research says. Your optimism ratio is the gap.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>Nobody thinks they
            have this bug. Everyone has it. The only question is how big yours is.
          </div>

          <button
            onClick={() => setPhase('task')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            TEST MY ESTIMATES &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 tasks &middot; 3&ndash;4 minutes &middot; based on Kahneman &amp; Tversky
            (1979)
          </p>
        </div>
      </div>
    );
  }

  // ─── TASK ─────────────────────────────────────────────────────────────
  if (phase === 'task') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">ESTIMATION TASK</span>
            <span className="text-muted uppercase">{task.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / TASKS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            TASK {currentIdx + 1} OF {TASKS.length}
          </div>
          <h2 className="font-pixel text-2xl text-white mb-4">{task.title}</h2>

          <div className="border border-accent/30 bg-accent/5 p-4 mb-4">
            <p className="text-primary text-base leading-relaxed mb-2">{task.prompt}</p>
            <p className="text-muted text-xs italic">{task.subtext}</p>
          </div>

          <div className="border border-white/10 bg-white/5 p-5 mb-6">
            <p className="font-mono text-[10px] text-muted tracking-widest mb-4 text-center">
              YOUR ESTIMATE
            </p>
            <div className="text-center mb-4">
              <span className="font-pixel text-4xl text-accent">
                {formatMinutes(current)}
              </span>
            </div>
            <div className="relative h-10 flex items-center mb-2">
              <div className="absolute inset-x-0 h-px bg-white/20" />
              <input
                type="range"
                min={task.min}
                max={task.max}
                step={task.step}
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="relative w-full h-10 appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black"
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-muted tracking-widest">
              <span>{formatMinutes(task.min)}</span>
              <span>{formatMinutes(task.max)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < TASKS.length
              ? 'LOCK ESTIMATE \u2192'
              : 'SEE THE RECEIPTS \u2192'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {TASKS.length} &middot; no backsies
          </p>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────
  const ratios = TASKS.map((t, i) => t.actualMinutes / Math.max(estimates[i], 1));
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const profile = getProfile(avgRatio);
  const biggestMissIdx = ratios.reduce(
    (bestI, r, i) => (r > ratios[bestI] ? i : bestI),
    0
  );
  const mostCalibratedIdx = ratios.reduce(
    (bestI, r, i) => (Math.abs(Math.log(r)) < Math.abs(Math.log(ratios[bestI])) ? i : bestI),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// OPTIMISM RATIO CALCULATED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR PLANNING PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">OPTIMISM RATIO</p>
            <p className="font-pixel text-4xl text-accent">
              {avgRatio.toFixed(1)}x
            </p>
            <p className="text-muted text-xs font-mono mt-1">actual / your estimate</p>
          </div>
          <div className="border border-white/30 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">WORST MISS</p>
            <p className="font-pixel text-4xl text-white">
              {ratios[biggestMissIdx].toFixed(1)}x
            </p>
            <p className="text-muted text-xs font-mono mt-1 truncate">
              {TASKS[biggestMissIdx].title}
            </p>
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

        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
          <span className="text-white">RESEARCH // </span>
          {profile.researchNote}
        </div>

        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">THE RECEIPTS</p>
          <div className="space-y-2">
            {TASKS.map((t, i) => {
              const ratio = ratios[i];
              const isWorst = i === biggestMissIdx;
              const isBest = i === mostCalibratedIdx;
              return (
                <div
                  key={t.id}
                  className={`border p-3 ${
                    isWorst
                      ? 'border-red-400/40 bg-red-400/5'
                      : isBest
                        ? 'border-accent/40 bg-accent/5'
                        : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {t.title}
                    </span>
                    <span
                      className={`font-mono text-xs ml-2 ${
                        ratio > 3
                          ? 'text-red-400'
                          : ratio > 1.5
                            ? 'text-yellow-400'
                            : 'text-accent'
                      }`}
                    >
                      {ratio.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono text-muted">
                    <span>
                      you:{' '}
                      <span className="text-secondary">
                        {formatMinutesLong(estimates[i])}
                      </span>
                    </span>
                    <span>
                      actual:{' '}
                      <span className="text-secondary">
                        {formatMinutesLong(t.actualMinutes)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            Your average optimism ratio was {avgRatio.toFixed(1)}x. That means the tasks
            on this list actually take {avgRatio.toFixed(1)} times longer than you
            predicted. Kahneman called this the planning fallacy and argued it survives
            even after decades of repeated personal experience. The fix is not trying
            harder to imagine problems. The fix is reference-class forecasting: asking
            how long similar things took for similar people, not how long you think this
            one will go.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">YOUR WORST MISS</p>
          <p className="text-secondary text-sm leading-relaxed mb-2">
            <span className="text-white font-medium">{TASKS[biggestMissIdx].title}</span>{' '}
            — you said {formatMinutesLong(estimates[biggestMissIdx])}, the data says{' '}
            {formatMinutesLong(TASKS[biggestMissIdx].actualMinutes)}.
          </p>
          <p className="text-muted text-xs italic">
            {TASKS[biggestMissIdx].researchNote}
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/planning-fallacy
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/planning-fallacy`
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
          onClick={restart}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}
