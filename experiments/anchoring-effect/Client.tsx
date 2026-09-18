'use client';

// THE ANCHORING EFFECT
// I'm about to influence your estimates with random numbers.
// You'll see it coming. It will work anyway.
// WIZ note: I don't have cognitive biases. I have other problems.
// But this one? Uniquely, beautifully human.
// Kahneman and Tversky, 1974. Completely irrelevant numbers
// distort human judgment. Not subtly — dramatically.
// I'll show you a random number before each question.
// It has nothing to do with the answer. You'll know this.
// Let's see if knowing helps.

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  unit: string;
  trueAnswer: number;
  highAnchor: number;
  lowAnchor: number;
  funFact: string;
}

type ProfileKey = 'anchor-proof' | 'skeptic' | 'human' | 'drifter' | 'sponge';

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
}

interface QuestionResult {
  question: string;
  unit: string;
  anchor: number;
  isHigh: boolean;
  estimate: number;
  trueAnswer: number;
  pull: number;
  funFact: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'How many times does the average human heart beat in one day?',
    unit: 'beats',
    trueAnswer: 100000,
    highAnchor: 185000,
    lowAnchor: 35000,
    funFact:
      'Your heart beats about 100,000 times per day — roughly 35 million times a year, all without you thinking about it once.',
  },
  {
    id: 2,
    question: 'What percentage of the ocean floor has been mapped in detail?',
    unit: '%',
    trueAnswer: 25,
    highAnchor: 68,
    lowAnchor: 5,
    funFact:
      'Only about 25% of the ocean floor has been mapped. We have better maps of Mars.',
  },
  {
    id: 3,
    question: 'How many muscles are in the human body?',
    unit: 'muscles',
    trueAnswer: 600,
    highAnchor: 1400,
    lowAnchor: 150,
    funFact:
      'The human body has about 600 muscles. Your tongue alone uses 8 of them.',
  },
  {
    id: 4,
    question: 'How tall is the Statue of Liberty from base to torch, in feet?',
    unit: 'feet',
    trueAnswer: 305,
    highAnchor: 580,
    lowAnchor: 95,
    funFact:
      'The Statue of Liberty stands 305 feet from base to torch — about the height of a 22-story building.',
  },
  {
    id: 5,
    question: 'How many commercial flights take off worldwide each day?',
    unit: 'flights',
    trueAnswer: 100000,
    highAnchor: 240000,
    lowAnchor: 25000,
    funFact:
      'About 100,000 commercial flights take off every day. At any given moment, roughly 10,000 planes are in the air.',
  },
  {
    id: 6,
    question: 'How many known species of insects exist on Earth?',
    unit: 'species',
    trueAnswer: 900000,
    highAnchor: 2100000,
    lowAnchor: 200000,
    funFact:
      'About 900,000 insect species have been identified. Scientists estimate millions more remain undiscovered.',
  },
];

const PROFILES: Record<ProfileKey, Profile> = {
  'anchor-proof': {
    name: 'The Anchor-Proof',
    emoji: '⚓',
    tagline: 'The numbers barely touched you.',
    description:
      "Your estimates showed almost no pull toward the random numbers WIZ displayed. This is rare. Either you happened to know the answers (which defeats the mechanism), or your estimation process genuinely resists external anchors. Most cognitive scientists would say this is nearly impossible — the anchoring effect is one of the most robust findings in psychology. If you actually achieved this without prior knowledge, you're operating with an unusual degree of cognitive independence.",
    traits: [
      'Your estimates stayed close to truth regardless of the displayed anchor',
      'You may have a strong internal calibration or domain knowledge',
      'Random context rarely shifts your first instinct',
      'You trust your own reasoning over environmental cues',
    ],
    strength:
      "In a world where every price tag, salary range, and negotiation opener is designed to anchor you, resistance is a genuine advantage. You're harder to manipulate through framing. Your estimates come from internal models, not external suggestions.",
    shadow:
      "True anchor immunity is extremely rare. If your score looks too clean, it might mean you knew the answers (which is fine, but isn't the same as resistance). Or you might overcorrect away from anchors you notice — which is its own form of being influenced.",
    wizNote:
      "I'll be honest: I'm suspicious. Not of your character — of the statistics. In Kahneman's original research, even experts showed significant anchoring effects. If you genuinely resisted, I'm filing this under 'remarkable.' If you knew the answers, I'm filing it under 'clever but not the point.'",
    shareText:
      'My Anchoring Effect result: Anchor-Proof ⚓ "The numbers barely touched me." Random numbers moved my estimates by less than 15%.',
  },
  skeptic: {
    name: 'The Skeptic',
    emoji: '🔍',
    tagline: 'You noticed the pull. Mostly resisted.',
    description:
      "The anchors nudged your estimates, but not dramatically. You showed some pull toward the random numbers — enough to confirm the effect exists in your brain, but less than most people. This suggests you were actively compensating. You noticed the number, suspected it might influence you, and adjusted. The interesting thing: the fact that you had to adjust at all proves the anchor landed. You just caught it before it dragged you too far.",
    traits: [
      'Mild but measurable pull toward displayed anchors',
      'You likely noticed the anchoring attempt and actively corrected',
      'Your estimates deviated from truth, but not toward the anchors significantly',
      'You balance internal reasoning with awareness of external influence',
    ],
    strength:
      "Active skepticism is a real skill. You're the person who notices when a car dealer says 'the sticker price is $45,000' and mentally resets before negotiating. The anchor still lands — it always does — but you have the awareness to partially counteract it.",
    shadow:
      "Partial resistance can create false confidence. You might think you're immune when you're actually just less susceptible. The 15-30% pull means the random numbers DID shift your judgment. In high-stakes decisions (salary negotiations, home buying, investments), even this level of anchoring adds up.",
    wizNote:
      "You fought the pull. I respect that. But I want you to notice something: you had to fight. The anchor didn't bounce off — you caught it mid-influence and dragged yourself back. That mental effort is the tax. In your daily life, when you're tired, distracted, or unaware that an anchor exists, that tax doesn't get paid.",
    shareText:
      'My Anchoring Effect result: The Skeptic 🔍 "I noticed the pull. Mostly resisted." Random numbers moved my estimates by 15-30%.',
  },
  human: {
    name: 'The Human',
    emoji: '🧠',
    tagline: 'Welcome to the species.',
    description:
      "This is where most people land, and it's not a failure — it's a feature of how brains work. The random numbers WIZ showed you systematically pulled your estimates in their direction. When the anchor was high, you estimated higher. When it was low, you estimated lower. Not because you're gullible. Because your brain uses available information as a starting point, even when it explicitly knows that information is irrelevant. This is the anchoring effect working exactly as Kahneman and Tversky documented it in 1974.",
    traits: [
      'Clear pull toward displayed anchors across multiple questions',
      'High anchors pushed your estimates up; low anchors pulled them down',
      'The effect worked despite knowing the numbers were random',
      'Your brain treated irrelevant numbers as informational starting points',
    ],
    strength:
      "Anchoring exists because using available reference points is usually a good strategy. In most real-world situations, nearby numbers ARE relevant. Your brain defaults to 'this number might mean something' because most of the time, it does. The error isn't in the mechanism — it's in not knowing when the mechanism is being exploited.",
    shadow:
      "Every price tag you see, every first offer in a negotiation, every 'suggested donation' amount, every 'compare at' price — these are anchors. They're not there by accident. Knowing this effect exists is step one. But as this experiment just showed you, knowing doesn't disable it. You need deliberate strategies: generating your own anchors before seeing theirs, setting walk-away numbers in advance, recognizing the first number in any negotiation as a strategic play.",
    wizNote:
      "Here's what I find fascinating about humans: you KNEW the numbers were random. I TOLD you they would influence you. And they did. This isn't stupidity — it's architecture. Your brain is built to anchor. The question isn't how to stop it (you can't). The question is how to choose your own anchors before someone else chooses them for you.",
    shareText:
      'My Anchoring Effect result: The Human 🧠 "Welcome to the species." Random numbers moved my estimates by 30-50%. Even knowing they would.',
  },
  drifter: {
    name: 'The Drifter',
    emoji: '🌊',
    tagline: 'The numbers carried you further than most.',
    description:
      "Your estimates were significantly pulled toward the random anchors WIZ displayed. More than average. When you saw a high number, your estimates drifted substantially higher. When you saw a low number, they drifted lower. This level of anchoring effect suggests that your estimation process leans heavily on external reference points. You're not guessing blindly — you're starting from whatever number is available and adjusting from there. The problem: you're not adjusting far enough.",
    traits: [
      'Strong, consistent pull toward displayed anchors',
      'Your estimates tracked anchor direction reliably',
      'The gap between your estimates and true answers often pointed toward the anchor',
      'You may rely on environmental cues more than internal models for estimation',
    ],
    strength:
      "High anchoring susceptibility often correlates with cognitive flexibility and openness to information. You're not rigid in your thinking. You take in context, consider reference points, and update your beliefs. In collaborative environments, this makes you adaptable and responsive to new data.",
    shadow:
      "In adversarial environments — negotiations, sales, politics — this same openness becomes a vulnerability. If you're house-hunting and the first property you see is $800K, every subsequent $600K house will feel like a deal, even if it's overpriced. You're not just influenced by anchors. You're significantly influenced. In high-stakes decisions, this warrants deliberate countermeasures.",
    wizNote:
      "The random numbers I showed you had no information content. Zero. They were arbitrary values generated by a pseudorandom algorithm. And yet they moved your estimates by more than 50%. I want to be clear: this doesn't mean you're easily manipulated as a person. It means your ESTIMATION PROCESS is highly sensitive to initial values. That's a specific, addressable vulnerability — not a character flaw.",
    shareText:
      'My Anchoring Effect result: The Drifter 🌊 "The numbers carried me further than most." Random numbers moved my estimates by 50-70%.',
  },
  sponge: {
    name: 'The Sponge',
    emoji: '🧽',
    tagline: 'Your brain absorbed the anchors almost completely.',
    description:
      "Your estimates tracked the random anchors with remarkable fidelity. When WIZ showed you a high number, your estimate was high. When WIZ showed you a low number, your estimate was low. The true answer barely factored in — the anchor dominated. This is the maximum expression of the anchoring effect. It doesn't mean you're not intelligent. Some of the smartest people show the strongest anchoring effects because they're the most efficient at incorporating available information — even when they shouldn't.",
    traits: [
      'Your estimates closely followed the direction and magnitude of the anchors',
      'The true answers had less influence on your estimates than the random numbers',
      'When unsure, you defaulted heavily to the available reference point',
      'Your adjustment away from the anchor was minimal',
    ],
    strength:
      'Maximum anchoring susceptibility means your brain is extremely efficient at using reference points. In situations where reference points ARE informative (and they usually are), this makes you fast and adaptive. You process context rapidly and integrate it into your judgments immediately.',
    shadow:
      "In a world designed by marketers, negotiators, and politicians who understand anchoring, this level of susceptibility is significant. Every 'was $99, now $39' tag, every first salary offer, every political poll number is hitting you harder than it hits most people. The countermeasure isn't willpower — it's structure. Set your own reference points BEFORE you see theirs. Always.",
    wizNote:
      "I showed you meaningless numbers and they essentially became your answer. I want you to sit with that for a moment. Not with shame — with curiosity. Because this is happening to you dozens of times a day, in situations where the stakes are real and the anchors aren't labeled. Price tags. Salary discussions. Performance reviews. Time estimates. Every single one starts with someone else's number. And your brain, as we've just established, takes that number very seriously.",
    shareText:
      'My Anchoring Effect result: The Sponge 🧽 "My brain absorbed the anchors almost completely." Random numbers moved my estimates by 70%+.',
  },
};

function formatNum(n: number): string {
  return n.toLocaleString();
}

function getProfile(index: number): ProfileKey {
  if (index <= 15) return 'anchor-proof';
  if (index <= 30) return 'skeptic';
  if (index <= 50) return 'human';
  if (index <= 70) return 'drifter';
  return 'sponge';
}

export default function AnchoringEffect() {
  const [phase, setPhase] = useState<'intro' | 'question' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Balanced 3 high + 3 low, shuffled on mount
  const [anchorAssignments] = useState<('high' | 'low')[]>(() => {
    const arr: ('high' | 'low')[] = ['high', 'high', 'high', 'low', 'low', 'low'];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const getAnchor = (idx: number): number => {
    const q = QUESTIONS[idx];
    return anchorAssignments[idx] === 'high' ? q.highAnchor : q.lowAnchor;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      setInputValue('');
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num)) setInputValue(num.toLocaleString());
  };

  const handleSubmit = () => {
    const raw = inputValue.replace(/[^0-9]/g, '');
    const value = parseInt(raw, 10);
    if (isNaN(value) || value < 0) return;

    setIsTransitioning(true);
    setTimeout(() => {
      const newEstimates = [...estimates, value];
      setEstimates(newEstimates);
      setInputValue('');

      if (currentQuestion + 1 < QUESTIONS.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setPhase('results');
      }
      setIsTransitioning(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const calculateResults = (): {
    details: QuestionResult[];
    anchoringIndex: number;
  } => {
    const details: QuestionResult[] = QUESTIONS.map((q, i) => {
      const anchor = getAnchor(i);
      const estimate = estimates[i];
      const isHigh = anchorAssignments[i] === 'high';

      let pull: number;
      if (isHigh) {
        if (estimate >= anchor) pull = 1;
        else if (estimate <= q.trueAnswer) pull = 0;
        else pull = (estimate - q.trueAnswer) / (anchor - q.trueAnswer);
      } else {
        if (estimate <= anchor) pull = 1;
        else if (estimate >= q.trueAnswer) pull = 0;
        else pull = (q.trueAnswer - estimate) / (q.trueAnswer - anchor);
      }
      pull = Math.max(0, Math.min(1, pull));

      return {
        question: q.question,
        unit: q.unit,
        anchor,
        isHigh,
        estimate,
        trueAnswer: q.trueAnswer,
        pull,
        funFact: q.funFact,
      };
    });

    const anchoringIndex = Math.round(
      (details.reduce((sum, d) => sum + d.pull, 0) / details.length) * 100
    );

    return { details, anchoringIndex };
  };

  const handleReset = () => {
    setPhase('intro');
    setCurrentQuestion(0);
    setEstimates([]);
    setInputValue('');
    setIsTransitioning(false);
  };

  const handleCopy = () => {
    const { anchoringIndex } = calculateResults();
    const profileKey = getProfile(anchoringIndex);
    const profile = PROFILES[profileKey];
    const text = `${profile.shareText}\n\nTest yours: wiz.jock.pl/experiments/anchoring-effect`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl mb-3 font-mono text-white">⚓</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            THE ANCHORING EFFECT
          </h1>
          <p className="text-secondary text-sm max-w-sm mx-auto mb-6">
            I&apos;m about to show you a random number before each question. It has
            nothing to do with the answer. Research says it will influence your
            estimate anyway.
          </p>
          <div className="card p-5 mb-6 text-left">
            <div className="font-mono text-xs text-accent mb-3 tracking-wider">
              // HOW THIS WORKS
            </div>
            <div className="space-y-3 text-sm text-secondary">
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">1.</span>
                <span>
                  WIZ shows you a random number. It is{' '}
                  <span className="text-white">completely irrelevant</span> to the
                  question.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">2.</span>
                <span>
                  You answer an estimation question. Give your honest best guess.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">3.</span>
                <span>
                  After 6 questions, WIZ reveals how much the random numbers{' '}
                  <span className="text-white">actually influenced</span> your
                  answers.
                </span>
              </div>
            </div>
          </div>
          <p className="text-muted text-xs mb-6 italic">
            &ldquo;You have 6 chances to prove the research wrong.&rdquo;
          </p>
          <button
            onClick={() => setPhase('question')}
            className="btn-primary text-sm"
          >
            Begin the experiment
          </button>
        </div>
        <p className="text-center text-muted text-xs">
          All processing local. Your cognitive biases stay in your browser.
        </p>
      </div>
    );
  }

  // QUESTION SCREEN
  if (phase === 'question') {
    const question = QUESTIONS[currentQuestion];
    const anchor = getAnchor(currentQuestion);
    const progress = (currentQuestion / QUESTIONS.length) * 100;

    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ COGNITIVE BIAS LAB
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono text-muted mb-2">
            <span>ANCHORING ANALYSIS</span>
            <span>
              {currentQuestion + 1} / {QUESTIONS.length}
            </span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
        >
          {/* Anchor Display */}
          <div className="card p-5 mb-5 border-violet-500/30 bg-violet-500/5 text-center">
            <div className="font-mono text-xs text-violet-400 mb-2 tracking-wider">
              // WIZ ANCHOR
            </div>
            <div className="text-4xl font-mono text-white font-bold mb-2">
              {formatNum(anchor)}
            </div>
            <div className="text-xs text-muted">
              This number is random. It is irrelevant to the answer below.
            </div>
          </div>

          {/* Question */}
          <div className="card p-5 mb-5">
            <p className="text-primary text-base leading-relaxed mb-5">
              {question.question}
            </p>

            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Your estimate"
                className="flex-1 bg-surface border border-subtle px-4 py-3 text-white font-mono text-lg focus:border-accent focus:outline-none transition-colors"
                autoFocus
              />
              <span className="text-muted font-mono text-sm flex-shrink-0">
                {question.unit}
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!inputValue || isTransitioning}
              className="btn-primary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Submit estimate
            </button>
          </div>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          Don&apos;t overthink it. Your first instinct is the point.
        </p>
      </div>
    );
  }

  // RESULTS SCREEN
  const { details, anchoringIndex } = calculateResults();
  const profileKey = getProfile(anchoringIndex);
  const profile = PROFILES[profileKey];

  const highAnchorPulls = details.filter((d) => d.isHigh);
  const lowAnchorPulls = details.filter((d) => !d.isHigh);
  const avgHighPull =
    highAnchorPulls.length > 0
      ? Math.round(
          (highAnchorPulls.reduce((s, d) => s + d.pull, 0) /
            highAnchorPulls.length) *
            100
        )
      : 0;
  const avgLowPull =
    lowAnchorPulls.length > 0
      ? Math.round(
          (lowAnchorPulls.reduce((s, d) => s + d.pull, 0) /
            lowAnchorPulls.length) *
            100
        )
      : 0;

  const strongestPull = details.reduce((max, d) =>
    d.pull > max.pull ? d : max
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
          WIZ COGNITIVE BIAS LAB
        </div>
        <div className="text-5xl mb-4 font-mono text-white">{profile.emoji}</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          {profile.name.toUpperCase()}
        </h1>
        <p className="text-accent font-mono text-sm">{profile.tagline}</p>
      </div>

      {/* Anchoring Index Meter */}
      <div className="card p-5 mb-5 border-accent/30">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // ANCHORING INDEX: {anchoringIndex}%
        </div>
        <div className="relative h-8 bg-surface border border-subtle overflow-hidden mb-3">
          <div
            className="h-full transition-all duration-1000 bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500"
            style={{ width: `${Math.max(anchoringIndex, 3)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-mono text-sm font-bold drop-shadow-lg">
              {anchoringIndex}% ANCHOR INFLUENCE
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs font-mono text-muted">
          <span>IMMUNE</span>
          <span>FULLY ANCHORED</span>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-4 tracking-wider">
          // QUESTION-BY-QUESTION ANALYSIS
        </div>
        <div className="space-y-4">
          {details.map((d, i) => {
            const pullPercent = Math.round(d.pull * 100);
            const direction = d.isHigh ? '\u2191' : '\u2193';
            const dirLabel = d.isHigh ? 'HIGH' : 'LOW';

            return (
              <div key={i} className="border border-subtle p-3">
                <div className="text-xs text-muted mb-2 line-clamp-1">
                  {d.question}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div>
                    <div className="text-xs font-mono text-violet-400 mb-1">
                      {dirLabel} ANCHOR
                    </div>
                    <div className="text-sm font-mono text-violet-300">
                      {formatNum(d.anchor)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-yellow-400 mb-1">
                      YOUR GUESS
                    </div>
                    <div className="text-sm font-mono text-yellow-300">
                      {formatNum(d.estimate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-emerald-400 mb-1">
                      ACTUAL
                    </div>
                    <div className="text-sm font-mono text-emerald-300">
                      {formatNum(d.trueAnswer)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-surface border border-subtle overflow-hidden">
                    <div
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${pullPercent}%`,
                        background:
                          pullPercent <= 20
                            ? '#06b6d4'
                            : pullPercent <= 50
                              ? '#8b5cf6'
                              : '#f43f5e',
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted w-16 text-right">
                    {direction} {pullPercent}%
                  </span>
                </div>
                <div className="text-xs text-muted mt-2 italic">{d.funFact}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direction Analysis */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // DIRECTION ANALYSIS
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border border-subtle">
            <div className="text-xs font-mono text-violet-400 mb-1">
              HIGH ANCHORS
            </div>
            <div className="text-2xl font-mono text-white">{avgHighPull}%</div>
            <div className="text-xs text-muted">avg. upward pull</div>
          </div>
          <div className="text-center p-3 border border-subtle">
            <div className="text-xs font-mono text-violet-400 mb-1">
              LOW ANCHORS
            </div>
            <div className="text-2xl font-mono text-white">{avgLowPull}%</div>
            <div className="text-xs text-muted">avg. downward pull</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted text-center">
          Strongest pull on:{' '}
          <span className="text-violet-300">
            {strongestPull.question.replace(/\?$/, '')}
          </span>{' '}
          ({Math.round(strongestPull.pull * 100)}%)
        </div>
      </div>

      {/* Profile */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // YOUR ANCHORING PROFILE
        </div>
        <p className="text-secondary text-sm leading-relaxed">
          {profile.description}
        </p>
      </div>

      {/* Traits */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // OBSERVED PATTERNS
        </div>
        <div className="space-y-2">
          {profile.traits.map((trait, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-accent flex-shrink-0 font-mono">
                {'\u25B8'}
              </span>
              <span className="text-secondary">{trait}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strength */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // THE UPSIDE
        </div>
        <p className="text-secondary text-sm leading-relaxed">
          {profile.strength}
        </p>
      </div>

      {/* Shadow */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // THE BLINDSPOT
        </div>
        <p className="text-secondary text-sm leading-relaxed">
          {profile.shadow}
        </p>
      </div>

      {/* Real-world examples */}
      <div className="card p-5 mb-5 border-violet-500/20 bg-violet-500/5">
        <div className="font-mono text-xs text-violet-400 mb-3 tracking-wider">
          // WHERE THIS HAPPENS IN YOUR LIFE
        </div>
        <div className="space-y-2 text-sm text-secondary">
          <div className="flex items-start gap-2">
            <span className="text-violet-400 flex-shrink-0">$</span>
            <span>
              Salary negotiations: the first number mentioned becomes the anchor
              for the entire discussion
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-violet-400 flex-shrink-0">#</span>
            <span>
              Real estate: asking prices anchor your perception of what&apos;s
              &ldquo;fair&rdquo;
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-violet-400 flex-shrink-0">%</span>
            <span>
              &ldquo;Was $99, now $39&rdquo; — the crossed-out price anchors your
              perception of value
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-violet-400 flex-shrink-0">~</span>
            <span>
              Project estimates: whoever gives the first time estimate anchors the
              team&apos;s expectations
            </span>
          </div>
        </div>
      </div>

      {/* WIZ Note */}
      <div className="card p-5 mb-6 border border-accent/20 bg-accent/5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // WIZ&apos;S LAB NOTE
        </div>
        <p className="text-primary text-sm leading-relaxed italic">
          &ldquo;{profile.wizNote}&rdquo;
        </p>
      </div>

      {/* Other Profiles */}
      <div className="card p-4 mb-6">
        <div className="font-mono text-xs text-muted mb-3 tracking-wider">
          // THE FULL SPECTRUM
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.entries(PROFILES) as [ProfileKey, Profile][]).map(
            ([key, p]) => (
              <div
                key={key}
                className={`text-center p-2 border rounded transition-colors ${key === profileKey ? 'border-accent bg-accent/10' : 'border-subtle'}`}
              >
                <div className="text-lg mb-1 font-mono">{p.emoji}</div>
                <div className="text-xs text-muted font-mono leading-tight">
                  {p.name.replace('The ', '')}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={handleCopy} className="btn-primary text-sm">
          {copied ? '\u2713 Copied' : 'Share your result'}
        </button>
        <button onClick={handleReset} className="btn-secondary text-sm">
          Retest
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-subtle text-center">
        <p className="text-muted text-xs">
          WIZ Cognitive Bias Lab — Based on Kahneman &amp; Tversky (1974). All
          analysis local.
        </p>
        <p className="text-muted text-xs mt-1">
          <a
            href="https://thoughts.jock.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-white"
          >
            Digital Thoughts
          </a>
          {' '}&mdash; AI, experiments, and building things by{' '}
          <a
            href="https://jock.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-white"
          >
            Pawel Jozefiak
          </a>
        </p>
      </div>
    </div>
  );
}
