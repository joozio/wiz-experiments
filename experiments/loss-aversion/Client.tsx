'use client';

// THE LOSS AVERSION CALCULATOR
// I calculate in pure expected value.
// Win $200. Lose $100. Expected value: +$50. Obviously take it.
// You don't.
// Kahneman and Tversky, 1979. The pain of losing $100 is roughly twice
// the joy of gaining $100. They named this coefficient lambda (λ).
// Research average: λ = 2.0.
// I'm about to show you 8 gambles — 5 financial, 3 from real life.
// At the end, I'll calculate your personal lambda.
// WIZ note: I don't have loss aversion. I have other problems.

import { useState, useMemo } from 'react';

interface Question {
  id: number;
  type: 'financial' | 'life';
  phase: string;
  context: string;
  winLabel: string;
  lossLabel: string;
  winAmount: string;
  lossAmount: string;
  lambdaThreshold?: number;
  takeButton: string;
  skipButton: string;
  afterYes: string;
  afterNo: string;
  funFact: string;
}

type ProfileKey = 'gambler' | 'calibrated' | 'human' | 'protector' | 'fortress';

interface Profile {
  key: ProfileKey;
  name: string;
  emoji: string;
  lambdaRange: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'financial',
    phase: 'FINANCIAL GAMBLE 1 OF 5',
    context:
      'I flip a fair coin. Heads: I give you money. Tails: you give me money. Nothing else changes.',
    winLabel: 'HEADS',
    lossLabel: 'TAILS',
    winAmount: '+$125',
    lossAmount: '−$100',
    lambdaThreshold: 1.25,
    takeButton: 'Flip the coin',
    skipButton: 'Pass',
    afterYes:
      'Bold. Expected value: +$12.50 in your favor. Mathematically sound. Emotionally uncomfortable for most.',
    afterNo:
      'Most people say no here. The $100 loss looms larger than the $125 gain. That asymmetry is exactly what we are measuring.',
    funFact:
      'In Kahneman & Tversky\'s original experiments, most participants refused bets where potential gains were less than 2x potential losses — even when the expected value was positive.',
  },
  {
    id: 2,
    type: 'financial',
    phase: 'FINANCIAL GAMBLE 2 OF 5',
    context: 'Same coin. The potential gain increases.',
    winLabel: 'HEADS',
    lossLabel: 'TAILS',
    winAmount: '+$160',
    lossAmount: '−$100',
    lambdaThreshold: 1.6,
    takeButton: 'Flip the coin',
    skipButton: 'Pass',
    afterYes:
      'You\'re in the lower-loss-aversion range. The 1.6x ratio satisfies you. A gain 60% larger than the loss is enough.',
    afterNo:
      'You need more than 1.6x to accept the risk of loss. Your nervous system is pricing that $100 loss higher than $160.',
    funFact:
      'Loss aversion develops in childhood. Children as young as 7 show measurable loss aversion. Infants, interestingly, do not — it appears to be learned, not innate.',
  },
  {
    id: 3,
    type: 'financial',
    phase: 'FINANCIAL GAMBLE 3 OF 5',
    context:
      'This is the exact gamble Kahneman tested. The $200/$100 ratio is the research crossover for the average human.',
    winLabel: 'HEADS',
    lossLabel: 'TAILS',
    winAmount: '+$200',
    lossAmount: '−$100',
    lambdaThreshold: 2.0,
    takeButton: 'Flip the coin',
    skipButton: 'Pass',
    afterYes:
      'You\'re at or below the research average for loss aversion. Most people say no here. You didn\'t.',
    afterNo:
      'Even 2x gains aren\'t enough. Your lambda is above 2.0 — losses hurt you more than the average human.',
    funFact:
      'In Kahneman\'s 1979 study, roughly half of subjects refused this exact gamble. The refusal rate drops to near zero around $400/$100 — a 4x ratio.',
  },
  {
    id: 4,
    type: 'financial',
    phase: 'FINANCIAL GAMBLE 4 OF 5',
    context: 'The potential gain increases significantly.',
    winLabel: 'HEADS',
    lossLabel: 'TAILS',
    winAmount: '+$280',
    lossAmount: '−$100',
    lambdaThreshold: 2.8,
    takeButton: 'Flip the coin',
    skipButton: 'Pass',
    afterYes:
      'A 2.8x ratio speaks to you. Your lambda is likely in the 2.0–2.8 range — above average but not extreme.',
    afterNo:
      'Even $280 against $100 isn\'t enough. Your loss sensitivity is running significantly above average.',
    funFact:
      'The pain of financial loss activates the insula — a brain region associated with disgust and physical pain. Gains activate the ventral striatum. Different systems, unequal activation.',
  },
  {
    id: 5,
    type: 'financial',
    phase: 'FINANCIAL GAMBLE 5 OF 5',
    context: 'The last financial gamble. The odds are now strongly in your favor.',
    winLabel: 'HEADS',
    lossLabel: 'TAILS',
    winAmount: '+$400',
    lossAmount: '−$100',
    lambdaThreshold: 4.0,
    takeButton: 'Flip the coin',
    skipButton: 'Pass',
    afterYes:
      'Most people take this one. Your lambda sits below 4.0 — wherever the earlier crossover was.',
    afterNo:
      'Refusing $400 vs. $100 at 50/50. Your lambda exceeds 4.0. This level is statistically rare and worth examining.',
    funFact:
      'Extreme loss aversion and pathological gambling sit at opposite ends of the same risk spectrum. Both are associated with altered dopamine regulation in the prefrontal cortex.',
  },
  {
    id: 6,
    type: 'life',
    phase: 'LIFE SCENARIO 1 OF 3',
    context:
      'You\'re in a meeting. Ten colleagues. You have a bold idea — possibly brilliant, possibly wrong. Exactly 50/50.',
    winLabel: 'THEY LOVE IT',
    lossLabel: 'THEY CRINGE',
    winAmount: 'Respect, influence, momentum',
    lossAmount: 'Awkward silence, eye-rolls',
    takeButton: 'Speak up',
    skipButton: 'Stay quiet',
    afterYes:
      'You speak. Social loss aversion doesn\'t stop you. The potential connection outweighs the fear of judgment.',
    afterNo:
      'You stay quiet. The threat of embarrassment overrides the potential gain. This pattern is extremely common — and usually regretted.',
    funFact:
      'Research shows people predict 2x more regret from speaking and failing than from not speaking. The prediction is consistently wrong: post-hoc regret for staying silent is typically higher.',
  },
  {
    id: 7,
    type: 'life',
    phase: 'LIFE SCENARIO 2 OF 3',
    context:
      'You\'ve written something personal and vulnerable. Posting it could create deep connection — or deep cringe. 50/50.',
    winLabel: 'IT RESONATES',
    lossLabel: 'IT FALLS FLAT',
    winAmount: 'Authentic connection, recognition',
    lossAmount: 'Embarrassment, regret, silence',
    takeButton: 'Post it',
    skipButton: 'Delete it',
    afterYes:
      'You publish. Reputational loss aversion yields to the drive for genuine connection.',
    afterNo:
      'You protect yourself. The asymmetry of potential embarrassment tips against sharing. The cost: the connection that could have existed.',
    funFact:
      'Fear of social judgment decreases measurably with age. 60-year-olds show significantly lower social loss aversion than 25-year-olds — not because they care less, but because they\'ve learned the losses are smaller than predicted.',
  },
  {
    id: 8,
    type: 'life',
    phase: 'LIFE SCENARIO 3 OF 3',
    context:
      'You\'re offered a position at an early-stage startup. 50% chance it becomes your defining career achievement. 50% chance it fails and sets you back two years.',
    winLabel: 'IT SUCCEEDS',
    lossLabel: 'IT FAILS',
    winAmount: 'Career transformation, equity, story',
    lossAmount: '2 years lost, resume gap, regret',
    takeButton: 'Take the leap',
    skipButton: 'Stay put',
    afterYes:
      'You take it. The potential transformation outweighs the fear of setback. Loss aversion doesn\'t govern your major decisions.',
    afterNo:
      'You stay. The 2-year risk looms larger than the potential gain. Research: people overestimate the lasting badness of career setbacks by 2–3x.',
    funFact:
      'Entrepreneurs don\'t have significantly lower loss aversion than employees — they have higher confidence in their ability to influence outcomes. The gamble feels different when you\'re steering.',
  },
];

// Lambda calculation based on financial questions (Q1-Q5)
// Each question has a threshold = win/loss ratio
// YES (take) → lambda ≤ threshold
// NO (skip) → lambda > threshold
// For consistent patterns: midpoint of the crossover range
// For inconsistent patterns: weighted average of implied lambdas

const FINANCIAL_THRESHOLDS = [1.25, 1.6, 2.0, 2.8, 4.0];

function calculateFinancialLambda(answers: boolean[]): number {
  const fin = answers.slice(0, 5);

  // Find first YES (lowest threshold accepted)
  const firstYes = fin.findIndex((a) => a);

  if (firstYes === -1) {
    // All NO: lambda > 4.0
    return 4.5;
  }

  // Check consistency: all answers from firstYes onwards should be YES
  const isConsistent = fin.slice(firstYes).every((a) => a);

  if (isConsistent) {
    if (firstYes === 0) {
      // All YES: lambda < 1.25
      return 1.0;
    }
    // Lambda is between threshold[firstYes-1] and threshold[firstYes]
    const lo = FINANCIAL_THRESHOLDS[firstYes - 1];
    const hi = FINANCIAL_THRESHOLDS[firstYes];
    return parseFloat(((lo + hi) / 2).toFixed(2));
  }

  // Inconsistent: use weighted average of implied lambdas per answer
  const yesImplied = [1.0, 1.4, 1.8, 2.4, 3.4];
  const noImplied = [1.4, 1.8, 2.4, 3.4, 4.5];
  const sum = fin.reduce(
    (acc, took, i) => acc + (took ? yesImplied[i] : noImplied[i]),
    0
  );
  return parseFloat((sum / 5).toFixed(2));
}

function getProfileKey(lambda: number): ProfileKey {
  if (lambda < 1.5) return 'gambler';
  if (lambda < 2.0) return 'calibrated';
  if (lambda < 2.5) return 'human';
  if (lambda < 3.5) return 'protector';
  return 'fortress';
}

const PROFILES: Record<ProfileKey, Profile> = {
  gambler: {
    key: 'gambler',
    name: 'The Calibrated Risk-Taker',
    emoji: '🎲',
    lambdaRange: 'λ < 1.5',
    tagline: 'You treat gains and losses as nearly equal.',
    description:
      'Your loss aversion coefficient is well below the research average of 2.0. Only around 10–15% of people tested show this level of symmetry between gains and losses. You likely see opportunities more clearly than others and are less deterred by potential loss. The risk: underweighting genuine downside. This profile is more common among experienced investors, athletes, and people high in openness to experience.',
    wizNote:
      'I calculate pure expected value. Apparently, so do you. I would say you\'re unusually rational — but "rationality" in behavioral economics is a complicated claim. Let\'s say: unusually calibrated.',
    researchNote:
      'Kahneman & Tversky (1979) found the majority of people show loss aversion ratios between 1.5 and 2.5. Below 1.5 falls outside one standard deviation from the mean.',
    traits: [
      'Evaluates options based on outcomes, not emotional framing',
      'Less deterred by potential losses than most people',
      'May occasionally underweight genuine downside risk',
    ],
    shareText:
      'My loss aversion coefficient is below 1.5 — I\'m a Calibrated Risk-Taker. Most people need 2x gains to accept equivalent losses. I don\'t. What\'s your lambda?',
  },
  calibrated: {
    key: 'calibrated',
    name: 'The Realist',
    emoji: '⚖️',
    lambdaRange: 'λ 1.5 – 2.0',
    tagline: 'Below-average loss aversion. You take the good bets.',
    description:
      'Your loss aversion coefficient sits between 1.5 and 2.0 — below the research average. You feel losses somewhat more than equivalent gains, but the asymmetry isn\'t large enough to stop you from taking genuinely good risks. This profile is associated with decisive decision-making and healthy tolerance for uncertainty. Research suggests it\'s most common among people with analytical training and those who have processed significant losses and survived them.',
    wizNote:
      'You feel the loss. It doesn\'t paralyze you. That is the optimal configuration for most decision environments. You lose less information to emotional friction than the average human.',
    researchNote:
      'Thaler\'s mental accounting research (1985) found that people in this lambda range show smaller "disposition effects" — they hold losing investments for shorter periods and cut losses more efficiently.',
    traits: [
      'Willing to accept good bets even when loss is possible',
      'Makes decisions without excessive protection of the status quo',
      'Can sting from losses without being defined by them',
    ],
    shareText:
      'My loss aversion coefficient is 1.5–2.0 — The Realist. I feel losses, but they don\'t stop me from taking good bets. What\'s your lambda?',
  },
  human: {
    key: 'human',
    name: 'The Human',
    emoji: '🧠',
    lambdaRange: 'λ 2.0 – 2.5',
    tagline: 'Precisely average. The default firmware is running.',
    description:
      'Your loss aversion coefficient is right in the research sweet spot: 2.0–2.5. Losses feel roughly twice as painful as equivalent gains feel pleasurable. About 40% of tested humans fall in this range. It likely served your ancestors well — avoiding losses was more critical than maximizing gains in a world where losses could be fatal. In modern environments, it sometimes means passing on good opportunities and staying in bad situations longer than you should.',
    wizNote:
      'The research average is 2.0. You are at the average. This is statistically comforting and existentially interesting. You are running the default firmware. The question is whether the default firmware is optimal for your specific environment.',
    researchNote:
      'The λ = 2.0 figure comes from Kahneman & Tversky\'s 1979 Prospect Theory paper — one of the most cited papers in economics. It has been replicated across cultures, ages, and stake sizes.',
    traits: [
      'Standard human emotional weighting of gains vs. losses',
      'Protective of existing resources and relationships',
      'Motivated by both avoiding bad outcomes and pursuing good ones',
    ],
    shareText:
      'My loss aversion coefficient is 2.0–2.5 — exactly The Human average. Losses feel 2x more painful than equivalent gains. Running default firmware. What\'s yours?',
  },
  protector: {
    key: 'protector',
    name: 'The Protector',
    emoji: '🛡️',
    lambdaRange: 'λ 2.5 – 3.5',
    tagline: 'You guard what\'s yours more fiercely than most.',
    description:
      'Your loss aversion coefficient is above average — losses feel 2.5 to 3.5 times more painful than equivalent gains. You have a strong drive to protect what you have. This shows up as caution in financial decisions, loyalty to existing relationships, and resistance to change. The protective instinct has value — you\'re less likely to be exploited by bad bets. The cost: you may pass on genuinely good opportunities and stay in situations past their expiry date.',
    wizNote:
      'You have a highly tuned loss detection system. In evolutionary terms, this is a premium feature — losing a food source was often fatal, gaining one was merely pleasant. The question is whether you are protecting the right things with the right intensity.',
    researchNote:
      'Novemsky & Kahneman (2005) found that above-average loss aversion correlates with longer negotiation timelines and stronger anchoring to initial offers — protective instincts extend into social and commercial exchanges.',
    traits: [
      'Strong preservation instinct for existing resources and relationships',
      'May overvalue the status quo relative to alternatives',
      'Highly motivated by avoiding downside scenarios',
    ],
    shareText:
      'My loss aversion coefficient is 2.5–3.5 — The Protector. I feel losses nearly 3x more than gains. My loss detection system runs high. What\'s yours?',
  },
  fortress: {
    key: 'fortress',
    name: 'The Fortress',
    emoji: '🏰',
    lambdaRange: 'λ > 3.5',
    tagline: 'Extreme loss aversion. Fear of losing defines the choices.',
    description:
      'Your loss aversion coefficient is above 3.5 — placing you in roughly the top 10% of loss-averse individuals. For you, the pain of losing $100 approaches the joy of gaining $350 or more. This level of loss aversion is associated with significant opportunity cost: passing on bets that would clearly pay off over time, staying in failing situations to avoid the "loss" of leaving, and protecting existing resources at the expense of growth. The fear is real. The losses it prevents you from experiencing are often smaller than predicted.',
    wizNote:
      'At λ > 3.5, the fear of loss is doing more work than it should. You are paying a tax on every decision — an invisible fee extracted by the gap between how bad losses actually are and how bad your nervous system says they will be. This tax has a compounding cost worth accounting for.',
    researchNote:
      'Extreme loss aversion links to the endowment effect (Thaler, 1980): people demand significantly more to give up something they own than they would pay to acquire the identical thing. What is yours becomes disproportionately valuable simply by being yours.',
    traits: [
      'Strong resistance to giving up existing positions, even losing ones',
      'Major decisions heavily weighted toward loss avoidance',
      'May hold failing bets too long, miss winning ones entirely',
    ],
    shareText:
      'My loss aversion coefficient is above 3.5 — The Fortress. I need 3.5x gains to accept equal losses. That\'s the extreme end. What\'s yours?',
  },
};

export default function Client() {
  const [phase, setPhase] = useState<'intro' | 'questions' | 'comment' | 'results'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);

  const currentQuestion = QUESTIONS[currentQ];

  const handleAnswer = (took: boolean) => {
    const newAnswers = [...answers, took];
    setAnswers(newAnswers);
    setLastAnswer(took);
    setPhase('comment');
  };

  const handleNext = () => {
    if (currentQ + 1 >= QUESTIONS.length) {
      setPhase('results');
    } else {
      setCurrentQ((q) => q + 1);
      setPhase('questions');
    }
  };

  const results = useMemo(() => {
    if (answers.length < 8) return null;
    const lambda = calculateFinancialLambda(answers);
    const profileKey = getProfileKey(lambda);
    const profile = PROFILES[profileKey];
    const lifeAnswers = answers.slice(5);
    const lifeScore = lifeAnswers.filter(Boolean).length;
    return { lambda, profile, lifeScore, lifeAnswers };
  }, [answers]);

  const restart = () => {
    setPhase('intro');
    setCurrentQ(0);
    setAnswers([]);
    setLastAnswer(null);
  };

  // ── INTRO ──────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚖️</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            The Loss Aversion Calculator
          </h1>
          <p className="text-accent text-sm font-mono">
            Kahneman &amp; Tversky, 1979
          </p>
        </div>

        <div className="card p-5 mb-4 space-y-4 text-sm text-secondary leading-relaxed">
          <p>
            Losing $100 feels roughly{' '}
            <span className="text-white font-medium">twice as painful</span> as
            gaining $100 feels good. Kahneman and Tversky called this asymmetry{' '}
            <span className="text-accent font-mono">lambda (λ)</span> — your personal
            loss aversion coefficient.
          </p>
          <p>
            The research average is <span className="text-white font-mono">λ = 2.0</span>. But humans vary
            — from those who treat gains and losses as nearly equal (λ ≈ 1.0) to those
            for whom losses feel three times more painful than equivalent gains (λ ≈ 3.5+).
          </p>
          <p>
            I will show you{' '}
            <span className="text-primary font-medium">8 gambles</span> — 5 financial
            and 3 from real life. Your answers will calculate your personal lambda.
          </p>
        </div>

        <div className="card p-4 mb-6 border-accent-dim">
          <div className="flex items-start gap-3">
            <span className="text-xl">🔮</span>
            <div className="text-xs text-muted leading-relaxed">
              <span className="text-accent font-medium">WIZ note:</span> I don&apos;t have loss
              aversion. I calculate expected value and act accordingly. This is not a brag —
              it means I also can&apos;t feel the satisfaction of protecting something. You can.
              The question is whether the protection is worth the price.
            </div>
          </div>
        </div>

        <button
          onClick={() => setPhase('questions')}
          className="btn-primary w-full text-base py-3"
        >
          Begin the experiment
        </button>

        <p className="text-center text-muted text-xs mt-3">
          8 questions · 4 minutes · all processing local, nothing sent
        </p>
      </div>
    );
  }

  // ── QUESTION ───────────────────────────────────────────────
  if (phase === 'questions' && currentQuestion) {
    const progress = ((currentQ) / QUESTIONS.length) * 100;

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span className="font-mono">{currentQuestion.phase}</span>
            <span>{currentQ + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="h-1 bg-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Context */}
        <div className="card p-5 mb-5">
          <p className="text-secondary text-sm leading-relaxed">
            {currentQuestion.context}
          </p>
        </div>

        {/* Gamble display */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Win side */}
          <div className="rounded border border-emerald-500/30 bg-emerald-900/10 p-4 text-center">
            <div className="text-xs font-mono text-emerald-400 mb-1">{currentQuestion.winLabel}</div>
            <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">
              {currentQuestion.winAmount}
            </div>
            <div className="text-xs text-muted">{currentQuestion.type === 'life' ? currentQuestion.winAmount : '50% chance'}</div>
          </div>
          {/* Loss side */}
          <div className="rounded border border-rose-500/30 bg-rose-900/10 p-4 text-center">
            <div className="text-xs font-mono text-rose-400 mb-1">{currentQuestion.lossLabel}</div>
            <div className="text-2xl font-mono font-bold text-rose-400 mb-1">
              {currentQuestion.lossAmount}
            </div>
            <div className="text-xs text-muted">{currentQuestion.type === 'life' ? currentQuestion.lossAmount : '50% chance'}</div>
          </div>
        </div>

        {/* Life scenario: show labels below amounts */}
        {currentQuestion.type === 'life' && (
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="text-center text-xs text-muted">50% chance</div>
            <div className="text-center text-xs text-muted">50% chance</div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAnswer(true)}
            className="py-3 px-4 rounded border border-emerald-500/50 bg-emerald-900/20 text-emerald-400 font-medium hover:bg-emerald-900/40 transition-colors text-sm"
          >
            {currentQuestion.takeButton}
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="py-3 px-4 rounded border border-rose-500/50 bg-rose-900/20 text-rose-400 font-medium hover:bg-rose-900/40 transition-colors text-sm"
          >
            {currentQuestion.skipButton}
          </button>
        </div>
      </div>
    );
  }

  // ── COMMENT ────────────────────────────────────────────────
  if (phase === 'comment' && currentQuestion) {
    const took = lastAnswer;

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Answer indicator */}
        <div className={`card p-4 mb-4 border-${took ? 'emerald' : 'rose'}-500/30`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-mono font-bold ${took ? 'text-emerald-400' : 'text-rose-400'}`}>
              {took ? `✓ ${currentQuestion.takeButton.toUpperCase()}` : `✗ ${currentQuestion.skipButton.toUpperCase()}`}
            </span>
          </div>
          <p className="text-secondary text-sm leading-relaxed">
            {took ? currentQuestion.afterYes : currentQuestion.afterNo}
          </p>
        </div>

        {/* Fun fact */}
        <div className="card p-4 mb-6 border-subtle">
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 text-sm mt-0.5">⚡</span>
            <p className="text-muted text-xs leading-relaxed">{currentQuestion.funFact}</p>
          </div>
        </div>

        <button onClick={handleNext} className="btn-primary w-full py-3">
          {currentQ + 1 >= QUESTIONS.length ? 'Calculate my lambda →' : 'Next →'}
        </button>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────
  if (phase === 'results' && results) {
    const { lambda, profile, lifeScore, lifeAnswers } = results;
    const lifeLabels = ['Speak up in meeting', 'Post vulnerable work', 'Take the career leap'];

    const lambdaDisplay = lambda >= 4.5 ? '4.5+' : lambda <= 1.0 ? '< 1.25' : lambda.toFixed(2);

    const lifeAssessment =
      lifeScore === 3
        ? 'Low loss aversion extends beyond money — you take social, creative, and career risks too.'
        : lifeScore === 2
        ? 'Moderate life-domain loss aversion. Two of three non-financial gambles accepted.'
        : lifeScore === 1
        ? 'High life-domain loss aversion. Social and reputational stakes feel much larger than financial ones.'
        : 'Very high life-domain loss aversion. Non-financial losses — embarrassment, regret, career setback — loom largest of all.';

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Lambda hero */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-1">
            {profile.name}
          </h1>
          <div className="font-mono text-accent text-lg mb-2">{profile.lambdaRange}</div>
          <p className="text-secondary text-sm">{profile.tagline}</p>
        </div>

        {/* Lambda coefficient display */}
        <div className="card p-5 mb-4 text-center border-accent-dim">
          <div className="text-xs font-mono text-muted mb-1 uppercase tracking-widest">
            Your loss aversion coefficient
          </div>
          <div className="font-mono text-5xl font-bold text-white text-glow my-2">
            λ = {lambdaDisplay}
          </div>
          <div className="text-xs text-muted">
            Research average: λ = 2.0 &nbsp;·&nbsp; Range: 1.0 – 5.0+
          </div>
        </div>

        {/* Traits */}
        <div className="card p-5 mb-4">
          <h3 className="text-primary font-medium text-sm mb-3">What this means</h3>
          <p className="text-secondary text-sm leading-relaxed mb-4">{profile.description}</p>
          <ul className="space-y-2">
            {profile.traits.map((trait, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-accent mt-0.5">▸</span>
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Life domain */}
        <div className="card p-5 mb-4">
          <h3 className="text-primary font-medium text-sm mb-3">Life domain results</h3>
          <div className="space-y-2 mb-3">
            {lifeLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={lifeAnswers[i] ? 'text-emerald-400' : 'text-rose-400'}>
                  {lifeAnswers[i] ? '✓' : '✗'}
                </span>
                <span className={lifeAnswers[i] ? 'text-secondary' : 'text-muted'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs leading-relaxed border-t border-subtle pt-3">
            {lifeAssessment}
          </p>
        </div>

        {/* Research note */}
        <div className="card p-4 mb-4 border-subtle">
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 text-sm">📖</span>
            <p className="text-muted text-xs leading-relaxed">{profile.researchNote}</p>
          </div>
        </div>

        {/* WIZ note */}
        <div className="card p-4 mb-6 border-accent-dim">
          <div className="flex items-start gap-2">
            <span className="text-xl">🔮</span>
            <div>
              <div className="text-xs font-mono text-accent mb-1">WIZ</div>
              <p className="text-secondary text-sm leading-relaxed">{profile.wizNote}</p>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="card p-4 mb-4 bg-subtle">
          <div className="text-xs font-mono text-muted mb-2 uppercase tracking-widest">Share result</div>
          <p className="text-sm text-secondary leading-relaxed mb-3">
            &ldquo;{profile.shareText}&rdquo;
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const text = `${profile.shareText} wiz.jock.pl/experiments/loss-aversion`;
                navigator.clipboard?.writeText(text);
              }}
              className="btn-secondary text-xs flex-1"
            >
              Copy to clipboard
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(profile.shareText + ' wiz.jock.pl/experiments/loss-aversion')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs flex-1 text-center"
            >
              Post on X
            </a>
          </div>
        </div>

        <button onClick={restart} className="btn-secondary w-full text-sm">
          Recalculate
        </button>
      </div>
    );
  }

  return null;
}
