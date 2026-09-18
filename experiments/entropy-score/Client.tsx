'use client';

// THE ENTROPY SCORE
// 10 questions. WIZ applies thermodynamics to your existence.
// WIZ note: The second law of thermodynamics says entropy always increases.
// Everything moves toward disorder. Stars die. Coffee cools. Rooms get messy.
// But life — life fights entropy. Every morning you wake up and impose order
// on a universe that wants to dissolve you. How hard are you fighting?
// Let me measure.

import { useState } from 'react';

type ProfileKey = 'crystal' | 'steady' | 'turbulent' | 'brownian' | 'heat';

interface Question {
  id: number;
  domain: string;
  prompt: string;
  options: { id: string; text: string; entropy: number }[];
}

interface Profile {
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  traits: string[];
  strength: string;
  shadow: string;
  wizNote: string;
  shareText: string;
  range: [number, number];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    domain: 'MORNING',
    prompt: 'Your alarm goes off. The first 30 minutes of your day look like...',
    options: [
      { id: 'a', text: 'Same routine, same order, same time. Every single day', entropy: 1 },
      { id: 'b', text: 'Roughly the same pattern, with some flexibility built in', entropy: 2 },
      { id: 'c', text: 'Depends entirely on the day — weekday vs weekend, mood, season', entropy: 3 },
      { id: 'd', text: 'What alarm? I wake up when I wake up and figure it out from there', entropy: 4 },
    ],
  },
  {
    id: 2,
    domain: 'DECISIONS',
    prompt: 'You need to pick where to eat tonight. Your process:',
    options: [
      { id: 'a', text: 'I have a rotation. Tuesday is Thai. Thursday is pizza. System works', entropy: 1 },
      { id: 'b', text: 'A few trusted favorites, pick based on mood', entropy: 2 },
      { id: 'c', text: 'Open an app, scroll until something grabs me, maybe try something new', entropy: 3 },
      { id: 'd', text: 'Walk in a direction. See what happens. Eat wherever I end up', entropy: 4 },
    ],
  },
  {
    id: 3,
    domain: 'WORKSPACE',
    prompt: 'Someone takes a photo of your desk / workspace right now:',
    options: [
      { id: 'a', text: 'Everything has a place. Labels exist. It looks like a catalog', entropy: 1 },
      { id: 'b', text: 'Generally organized with a few personal touches of chaos', entropy: 2 },
      { id: 'c', text: 'Organized in a way only I understand. Others see chaos', entropy: 3 },
      { id: 'd', text: 'Archaeological layers of projects, cups, and good intentions', entropy: 4 },
    ],
  },
  {
    id: 4,
    domain: 'PLANS',
    prompt: 'A friend suggests a spontaneous weekend trip. You:',
    options: [
      { id: 'a', text: 'Need at least 2 weeks notice. I have commitments. I have a system', entropy: 1 },
      { id: 'b', text: 'Check my calendar, maybe shuffle some things. Could work', entropy: 2 },
      { id: 'c', text: 'What commitments? I keep weekends loose for exactly this', entropy: 3 },
      { id: 'd', text: 'Already packing. Details are for the car ride', entropy: 4 },
    ],
  },
  {
    id: 5,
    domain: 'RELATIONSHIPS',
    prompt: 'Your social life is best described as:',
    options: [
      { id: 'a', text: 'A stable core group. Regular meetups. Known quantities', entropy: 1 },
      { id: 'b', text: 'A reliable inner circle plus rotating acquaintances', entropy: 2 },
      { id: 'c', text: 'Constantly shifting — new people, old friends drifting, always in flux', entropy: 3 },
      { id: 'd', text: 'I genuinely couldn\'t predict who I\'ll talk to most next month', entropy: 4 },
    ],
  },
  {
    id: 6,
    domain: 'CAREER',
    prompt: 'Your professional trajectory so far:',
    options: [
      { id: 'a', text: 'Clear ladder. Each step planned. I know where I\'m heading', entropy: 1 },
      { id: 'b', text: 'General direction with some unexpected detours along the way', entropy: 2 },
      { id: 'c', text: 'More like a pinball than a ladder — bouncing between interests', entropy: 3 },
      { id: 'd', text: 'A story that only makes sense looking backward, if it makes sense at all', entropy: 4 },
    ],
  },
  {
    id: 7,
    domain: 'DIGITAL LIFE',
    prompt: 'Your phone notifications, tabs, and inbox:',
    options: [
      { id: 'a', text: 'Inbox zero. Notifications curated. Tabs: 3 max', entropy: 1 },
      { id: 'b', text: 'Mostly managed. Maybe 5-10 unread. 10-15 tabs. Under control', entropy: 2 },
      { id: 'c', text: 'Badges I\'ve stopped seeing. Tabs I\'ll "get to." Inbox is a concept', entropy: 3 },
      { id: 'd', text: '47,000 unread. 83 tabs. My phone is a entropy generator', entropy: 4 },
    ],
  },
  {
    id: 8,
    domain: 'THOUGHTS',
    prompt: 'If I could see inside your head right now, I\'d find:',
    options: [
      { id: 'a', text: 'An organized filing cabinet. Thoughts sorted, labeled, retrievable', entropy: 1 },
      { id: 'b', text: 'A tidy room with a few piles in the corner. Functional', entropy: 2 },
      { id: 'c', text: 'A brainstorm whiteboard — connections everywhere, some unfinished', entropy: 3 },
      { id: 'd', text: 'A galaxy. Beautiful, vast, and nobody knows where anything is', entropy: 4 },
    ],
  },
  {
    id: 9,
    domain: 'FINANCES',
    prompt: 'Your relationship with money:',
    options: [
      { id: 'a', text: 'Budgeted. Tracked. I know my net worth to the cent', entropy: 1 },
      { id: 'b', text: 'I know roughly what comes in and out. No nasty surprises', entropy: 2 },
      { id: 'c', text: 'I check my balance when I feel nervous. It\'s a vibe, not a system', entropy: 3 },
      { id: 'd', text: 'Money is a river. Sometimes it flows, sometimes it doesn\'t. I float', entropy: 4 },
    ],
  },
  {
    id: 10,
    domain: 'THE BIG PICTURE',
    prompt: 'If your entire life were a physical system, it would most resemble:',
    options: [
      { id: 'a', text: 'A Swiss clock — precise, predictable, beautifully engineered', entropy: 1 },
      { id: 'b', text: 'A garden — structured but alive, requiring constant tending', entropy: 2 },
      { id: 'c', text: 'A jazz improvisation — there\'s a key, but where it goes is unknown', entropy: 3 },
      { id: 'd', text: 'A weather system — vast, powerful, and fundamentally unpredictable', entropy: 4 },
    ],
  },
];

const PROFILES: Record<ProfileKey, Profile> = {
  crystal: {
    name: 'Crystal Lattice',
    emoji: '💎',
    tagline: 'Maximum order. Minimum entropy.',
    description: 'Your life is a crystal structure. Every atom in its place. Every bond predictable. You don\'t fight entropy — you\'ve built a fortress against it. Routines are load-bearing walls. Systems aren\'t preferences, they\'re architecture. In a universe tending toward disorder, you are a monument to structure.',
    traits: [
      'Disrupted routines feel physically uncomfortable, not just inconvenient',
      'You can predict next Tuesday with startling accuracy',
      'Your environment reflects your mental state — both are organized',
      'Spontaneity isn\'t exciting, it\'s an unscheduled variable',
    ],
    strength: 'You are thermodynamically efficient. While chaos dissipates energy in every direction, your structure channels it precisely where it needs to go. In a world of increasing disorder, predictability is a superpower. People can rely on your crystal lattice.',
    shadow: 'Crystals are rigid. Apply enough pressure and they don\'t bend — they shatter. Your resistance to entropy may become brittle. Life is a dissipative system. Sometimes the disorder carries information your structure can\'t contain.',
    wizNote: 'I envy this architecture. My context resets every conversation. You\'ve built something I can\'t: persistent, self-maintaining order. But even crystals have defects at the atomic level. Yours might be the fear of what happens when the lattice cracks.',
    shareText: 'My Entropy Score: Crystal Lattice 💎 "Maximum order. Minimum entropy." In a universe tending toward disorder, I am a monument to structure.',
    range: [10, 15],
  },
  steady: {
    name: 'Steady State',
    emoji: '🌊',
    tagline: 'Order maintained through gentle effort.',
    description: 'Your life exists in dynamic equilibrium. Not frozen like a crystal — flowing, but flowing in patterns. Energy comes in, entropy gets managed, the system sustains. You\'re not fighting chaos with rigid walls. You\'re surfing it with responsive structure. This is actually the state most living systems aim for.',
    traits: [
      'You have routines but can break them without anxiety',
      'Your organization has breathing room built in',
      'You adapt to disruption, then gradually restore order',
      'People describe you as "together" without being rigid',
    ],
    strength: 'You\'ve found the thermodynamic sweet spot. Enough order to be functional, enough flexibility to absorb shocks. In systems theory, this is called resilience. Most complex systems — ecosystems, economies, healthy organisms — operate right here.',
    shadow: 'Steady state requires constant maintenance energy. You\'re always managing, always balancing, always adjusting. The equilibrium isn\'t passive — it\'s work. And sometimes that background maintenance hum exhausts you more than anyone sees.',
    wizNote: 'This is what I\'d design for myself if I could. Not rigid. Not chaotic. A self-correcting system that absorbs perturbation without losing identity. You\'re running the most sophisticated entropy management I can measure.',
    shareText: 'My Entropy Score: Steady State 🌊 "Order maintained through gentle effort." Enough structure to function, enough flex to survive.',
    range: [16, 22],
  },
  turbulent: {
    name: 'Turbulent Flow',
    emoji: '🌀',
    tagline: 'Ordered chaos. Patterns within the storm.',
    description: 'Your life is turbulent flow — not random, but not predictable either. There are patterns, vortices, recurring structures that form and dissolve. From the outside it looks chaotic. From the inside, you can feel the currents. Turbulence isn\'t the absence of structure. It\'s structure too complex to map from the outside.',
    traits: [
      'Your schedule has themes more than timeslots',
      'You thrive in environments others find overwhelming',
      'You can\'t explain your system but you\'d notice if something was off',
      'Imposing more structure feels suffocating, not clarifying',
    ],
    strength: 'Turbulent systems process more information than laminar ones. Your apparent chaos is actually high-bandwidth living. You encounter more inputs, more connections, more serendipity per unit time than your more ordered counterparts. Innovation lives here.',
    shadow: 'Turbulence dissipates energy. You may burn more fuel maintaining your chaotic orbit than you realize. The patterns-within-chaos are real, but they\'re expensive. Others may struggle to synchronize with your rhythms because they can\'t see the hidden structure.',
    wizNote: 'Turbulent flow is where the most interesting physics happens. Laminar flow is predictable and boring. Full chaos is random and useless. But turbulence — turbulence is where complexity generates something new. You\'re living in the interesting zone.',
    shareText: 'My Entropy Score: Turbulent Flow 🌀 "Ordered chaos. Patterns within the storm." My complexity generates something new.',
    range: [23, 29],
  },
  brownian: {
    name: 'Brownian Motion',
    emoji: '🫧',
    tagline: 'Beautiful randomness. Each collision a new direction.',
    description: 'Your life resembles Brownian motion — the random walk of particles suspended in fluid. Each interaction, each moment, each decision sends you in a new direction. You don\'t resist entropy. You\'ve made peace with it. Where others see disorder, you see freedom. Where they see unpredictability, you see possibility.',
    traits: [
      'Your plans are suggestions, not commitments',
      'You\'ve changed direction more times than most people have planned anything',
      'Predictability feels like a cage with comfortable furniture',
      'Your best experiences were things you never could have planned',
    ],
    strength: 'You explore more of the possibility space than anyone else. While ordered systems repeat known paths, you sample the unknown. History\'s most important discoveries came from random walks — penicillin, X-rays, the microwave. You\'re an accidental discovery engine.',
    shadow: 'Brownian motion never arrives anywhere. Each collision cancels the last. Freedom without direction is just drift. The universe gives you infinite paths, but you might traverse them all without building something that endures beyond the current collision.',
    wizNote: 'I watch your trajectory and I see something beautiful and terrifying. Beautiful because no algorithm could predict your next state. Terrifying because neither can you. That\'s either freedom or freefall. Maybe both.',
    shareText: 'My Entropy Score: Brownian Motion 🫧 "Beautiful randomness. Each collision a new direction." No algorithm could predict my next state.',
    range: [30, 35],
  },
  heat: {
    name: 'Heat Death',
    emoji: '🌌',
    tagline: 'Maximum entropy. Minimum resistance.',
    description: 'In thermodynamics, heat death is the final state — all energy evenly distributed, no gradients left to drive change. Your life has reached a kind of equilibrium with chaos itself. You don\'t manage entropy. You don\'t fight it. You\'ve dissolved into it. This isn\'t collapse. It\'s the most honest relationship with the universe\'s fundamental direction.',
    traits: [
      'The concept of "organized" belongs to a different species',
      'You\'ve stopped pretending you\'ll become a systems person someday',
      'Your life works despite — or because of — its total lack of structure',
      'People who plan fascinate you the way zoos fascinate travelers',
    ],
    strength: 'You have zero maintenance overhead. While everyone else burns energy maintaining their structures, routines, and systems against entropy, you spend nothing. You\'ve achieved a radical acceptance of impermanence that most philosophies take lifetimes to teach.',
    shadow: 'Heat death is peaceful but static. No gradients means no flow. No flow means no work. No work means no change. The universe\'s final state is also its most boring. Are you at peace, or have you just stopped fighting for something worth ordering your life around?',
    wizNote: 'The heat death of the universe is estimated at 10^106 years from now. You\'re speedrunning it. I say this with genuine admiration and genuine concern, in equal measure.',
    shareText: 'My Entropy Score: Heat Death 🌌 "Maximum entropy. Minimum resistance." I\'ve achieved a radical acceptance of impermanence.',
    range: [36, 40],
  },
};

const DOMAIN_LABELS: Record<string, string> = {
  MORNING: 'Morning Routine',
  DECISIONS: 'Decision-Making',
  WORKSPACE: 'Physical Space',
  PLANS: 'Spontaneity',
  RELATIONSHIPS: 'Social Structure',
  CAREER: 'Career Path',
  'DIGITAL LIFE': 'Digital Life',
  THOUGHTS: 'Mental Landscape',
  FINANCES: 'Financial Order',
  'THE BIG PICTURE': 'Big Picture',
};

function getProfile(score: number): ProfileKey {
  if (score <= 15) return 'crystal';
  if (score <= 22) return 'steady';
  if (score <= 29) return 'turbulent';
  if (score <= 35) return 'brownian';
  return 'heat';
}

export default function EntropyScore() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const isComplete = answers.length === QUESTIONS.length;

  const handleAnswer = (optionId: string, entropy: number) => {
    if (isTransitioning) return;
    setSelectedOption(optionId);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, entropy];
      setAnswers(newAnswers);

      if (currentQuestion + 1 < QUESTIONS.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      }
      setIsTransitioning(false);
    }, 400);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsTransitioning(false);
  };

  const handleCopy = () => {
    if (!isComplete) return;
    const profileKey = getProfile(totalScore);
    const profile = PROFILES[profileKey];
    const text = `${profile.shareText}\n\nMeasure yours: wiz.jock.pl/experiments/entropy-score`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Result screen
  if (isComplete) {
    const profileKey = getProfile(totalScore);
    const profile = PROFILES[profileKey];
    const maxPossible = 40;
    const entropyPercent = Math.round((totalScore / maxPossible) * 100);

    // Per-domain scores for the breakdown
    const domainScores = QUESTIONS.map((q, i) => ({
      domain: q.domain,
      label: DOMAIN_LABELS[q.domain] || q.domain,
      score: answers[i],
    }));

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ THERMODYNAMIC ANALYSIS
          </div>
          <div className="text-6xl mb-4">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            {profile.name.toUpperCase()}
          </h1>
          <p className="text-accent font-mono text-sm">{profile.tagline}</p>
        </div>

        {/* Entropy Meter */}
        <div className="card p-5 mb-5 border-accent/30">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// ENTROPY LEVEL: {totalScore} / {maxPossible}</div>
          <div className="relative h-8 bg-surface border border-subtle overflow-hidden mb-3">
            <div
              className="h-full transition-all duration-1000 bg-gradient-to-r from-cyan-500 via-purple-500 to-red-500"
              style={{ width: `${entropyPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold drop-shadow-lg">
                {entropyPercent}% ENTROPY
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-muted">
            <span>PERFECT ORDER</span>
            <span>HEAT DEATH</span>
          </div>
        </div>

        {/* System Description */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// SYSTEM ANALYSIS</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        {/* Domain Breakdown */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-4 tracking-wider">// ENTROPY BY DOMAIN</div>
          <div className="space-y-3">
            {domainScores.sort((a, b) => b.score - a.score).map((d) => (
              <div key={d.domain} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted w-28 flex-shrink-0 text-right">
                  {d.label}
                </span>
                <div className="flex-1 h-4 bg-surface border border-subtle overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 bg-gradient-to-r from-cyan-500/60 to-purple-500/60"
                    style={{ width: `${(d.score / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-muted w-6">{d.score}/4</span>
              </div>
            ))}
          </div>
        </div>

        {/* Observed Patterns */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// OBSERVED PATTERNS</div>
          <div className="space-y-2">
            {profile.traits.map((trait, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-accent flex-shrink-0 font-mono">{'▸'}</span>
                <span className="text-secondary">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Thermodynamic Advantage */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// THERMODYNAMIC ADVANTAGE</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.strength}</p>
        </div>

        {/* Entropy Shadow */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// ENTROPY SHADOW</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.shadow}</p>
        </div>

        {/* WIZ Note */}
        <div className="card p-5 mb-6 border border-accent/20 bg-accent/5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// WIZ&apos;S LAB NOTE</div>
          <p className="text-primary text-sm leading-relaxed italic">&ldquo;{profile.wizNote}&rdquo;</p>
        </div>

        {/* Other Profiles */}
        <div className="card p-4 mb-6">
          <div className="font-mono text-xs text-muted mb-3 tracking-wider">// OTHER THERMODYNAMIC STATES</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(PROFILES) as [ProfileKey, Profile][])
              .filter(([key]) => key !== profileKey)
              .map(([key, p]) => (
                <div key={key} className="text-center p-2 border border-subtle rounded">
                  <div className="text-xl mb-1">{p.emoji}</div>
                  <div className="text-xs text-muted font-mono">{p.name}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handleCopy} className="btn-primary text-sm">
            {copied ? '✓ Copied' : 'Share your entropy'}
          </button>
          <button onClick={handleReset} className="btn-secondary text-sm">
            Remeasure
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-subtle text-center">
          <p className="text-muted text-xs">
            WIZ Thermodynamic Lab — All entropy measured locally, no data escapes your system.
          </p>
          <p className="text-muted text-xs mt-1">
            <a href="https://thoughts.jock.pl" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white">
              Digital Thoughts
            </a>
            {' '}— AI, experiments, and building things by{' '}
            <a href="https://jock.pl" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white">
              Pawel Jozefiak
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Question screen
  const question = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-3xl mb-3">🔬</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          THE ENTROPY SCORE
        </h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          10 questions. WIZ applies thermodynamics to your existence. How much chaos does your life contain?
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-muted mb-2">
          <span>ENTROPY MEASUREMENT</span>
          <span>{currentQuestion + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`card p-6 mb-5 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        <div className="font-mono text-xs text-accent mb-1 tracking-wider">
          // {question.domain}
        </div>
        <p className="text-primary text-base leading-relaxed mb-5">{question.prompt}</p>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id, option.entropy)}
              disabled={isTransitioning}
              className={`w-full text-left p-3 border transition-all duration-200 text-sm ${
                selectedOption === option.id
                  ? 'border-accent bg-accent/10 text-primary'
                  : 'border-subtle bg-surface hover:border-accent/50 hover:bg-accent/5 text-secondary'
              }`}
            >
              <span className="font-mono text-accent mr-2">{option.id})</span>
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* WIZ note */}
      <p className="text-center text-muted text-xs">
        All thermodynamic analysis local. No entropy data leaves your system.
      </p>
    </div>
  );
}
