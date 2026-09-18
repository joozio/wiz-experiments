'use client';

// THE FRAMING EFFECT
// Same facts. Different words. Different decisions.
// WIZ note: I process information without emotional framing.
// You don't. That's not a flaw — it's how language shapes reality.
// Tversky & Kahneman, 1981. "The Framing of Decisions and
// the Psychology of Choice." One of the most replicated findings
// in behavioral science. The words around the facts change the facts.
// I'll show you 12 scenarios — secretly 6 pairs.
// Same situation, different frame. Let's see if you notice.

import { useState, useMemo } from 'react';

interface ScenarioPair {
  id: number;
  domain: string;
  domainEmoji: string;
  context: string;
  gainFrame: {
    text: string;
    optionA: string;
    optionB: string;
  };
  lossFrame: {
    text: string;
    optionA: string;
    optionB: string;
  };
  explanation: string;
  realWorldExample: string;
}

type ProfileKey = 'frame-blind' | 'frame-resistant' | 'frame-human' | 'frame-sensitive' | 'frame-driven';

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

const SCENARIO_PAIRS: ScenarioPair[] = [
  {
    id: 1,
    domain: 'PUBLIC HEALTH',
    domainEmoji: '🏥',
    context: 'A disease outbreak will affect 600 people. Two programs are proposed.',
    gainFrame: {
      text: 'A disease will affect 600 people. Choose a response program:',
      optionA: 'Program A: 200 people will be saved.',
      optionB: 'Program B: 1/3 chance all 600 are saved, 2/3 chance nobody is saved.',
    },
    lossFrame: {
      text: 'A disease will affect 600 people. Choose a response program:',
      optionA: 'Program C: 400 people will die.',
      optionB: 'Program D: 1/3 chance nobody dies, 2/3 chance all 600 die.',
    },
    explanation: 'This is the original Tversky & Kahneman (1981) experiment. "200 saved" and "400 die" are mathematically identical — but 72% chose the sure option when framed as gains, and 78% chose the gamble when framed as losses. You become risk-seeking to avoid losses.',
    realWorldExample: 'Doctors who say "90% survive this surgery" get more consent than those who say "10% die during this surgery." Same statistic.',
  },
  {
    id: 2,
    domain: 'PERSONAL FINANCE',
    domainEmoji: '💰',
    context: 'You have an investment decision to make.',
    gainFrame: {
      text: 'You invested $6,000. After market shifts, choose how to handle your portfolio:',
      optionA: 'Option A: Keep $2,000 of your investment.',
      optionB: 'Option B: 1/3 chance of keeping all $6,000, 2/3 chance of keeping nothing.',
    },
    lossFrame: {
      text: 'You invested $6,000. After market shifts, choose how to handle your portfolio:',
      optionA: 'Option A: Lose $4,000 of your investment.',
      optionB: 'Option B: 1/3 chance of losing nothing, 2/3 chance of losing all $6,000.',
    },
    explanation: '"Keep $2,000" and "lose $4,000" describe the exact same outcome. But loss framing makes the gamble suddenly attractive — you\'d rather risk everything than accept a certain loss. This is why investors hold losing stocks too long.',
    realWorldExample: '"Save $300/year" on insurance vs "Lose $300/year without coverage." Same money, different uptake rates.',
  },
  {
    id: 3,
    domain: 'FOOD & HEALTH',
    domainEmoji: '🥩',
    context: 'You\'re choosing between two food products at the store.',
    gainFrame: {
      text: 'Two ground beef products are on sale. Which do you pick?',
      optionA: 'Brand A: 75% lean beef.',
      optionB: 'Brand B: Unlabeled, but your friend says it tastes better.',
    },
    lossFrame: {
      text: 'Two ground beef products are on sale. Which do you pick?',
      optionA: 'Brand A: 25% fat beef.',
      optionB: 'Brand B: Unlabeled, but your friend says it tastes better.',
    },
    explanation: '"75% lean" and "25% fat" are the same product. But lean-framed beef is rated as higher quality, better tasting, and less greasy in blind taste tests. The label changes the subjective experience of eating the same food.',
    realWorldExample: 'Yogurt labeled "80% fat-free" outsells identical yogurt labeled "contains 20% fat." Marketers know this well.',
  },
  {
    id: 4,
    domain: 'MEDICAL DECISIONS',
    domainEmoji: '⚕️',
    context: 'A patient needs to choose between two treatments.',
    gainFrame: {
      text: 'A serious condition requires treatment. Two options are available:',
      optionA: 'Treatment A: 68% of patients show significant improvement after 1 year.',
      optionB: 'Treatment B: Experimental, 85% improvement rate but requires 3 months of difficult side effects.',
    },
    lossFrame: {
      text: 'A serious condition requires treatment. Two options are available:',
      optionA: 'Treatment A: 32% of patients show no improvement after 1 year.',
      optionB: 'Treatment B: Experimental, 15% see no improvement but requires 3 months of difficult side effects.',
    },
    explanation: '"68% improve" and "32% don\'t improve" are the same statistic. But when failure is highlighted, people are more willing to accept the harder experimental treatment. The frame changes risk tolerance for identical odds.',
    realWorldExample: 'Surgeons who frame outcomes as survival rates rather than mortality rates see significantly higher patient consent for the same procedures.',
  },
  {
    id: 5,
    domain: 'WORKPLACE',
    domainEmoji: '💼',
    context: 'Your company is restructuring and you need to decide between two severance options.',
    gainFrame: {
      text: 'Your department of 30 people faces restructuring. Management offers two plans:',
      optionA: 'Plan A: 10 positions are guaranteed to be preserved.',
      optionB: 'Plan B: 1/3 chance all 30 positions are preserved, 2/3 chance no positions are preserved.',
    },
    lossFrame: {
      text: 'Your department of 30 people faces restructuring. Management offers two plans:',
      optionA: 'Plan A: 20 positions will definitely be eliminated.',
      optionB: 'Plan B: 1/3 chance no positions are eliminated, 2/3 chance all 30 are eliminated.',
    },
    explanation: '"10 preserved" and "20 eliminated" are the same plan for the same 30 people. But framing job losses makes people gamble — they\'d rather risk everything than accept certain elimination. Companies use gain framing to make layoffs palatable.',
    realWorldExample: '"We\'re keeping our core team of 50" vs "We\'re letting go of 200 people." Companies carefully choose which frame to lead with.',
  },
  {
    id: 6,
    domain: 'ENVIRONMENT',
    domainEmoji: '🌍',
    context: 'A policy decision about environmental protection.',
    gainFrame: {
      text: 'A new regulation is proposed for industrial pollution. Two approaches are being debated:',
      optionA: 'Approach A: Protects 70% of remaining wetlands from industrial damage.',
      optionB: 'Approach B: Complete moratorium on development — may protect all wetlands or be struck down in court, protecting none.',
    },
    lossFrame: {
      text: 'A new regulation is proposed for industrial pollution. Two approaches are being debated:',
      optionA: 'Approach A: Allows destruction of 30% of remaining wetlands from industrial damage.',
      optionB: 'Approach B: Complete moratorium on development — may protect all wetlands or be struck down in court, protecting none.',
    },
    explanation: '"Protects 70%" and "allows destruction of 30%" describe the same policy. But the destruction frame makes people prefer the risky all-or-nothing option. Environmental groups and industry lobbies both exploit this by choosing their frame carefully.',
    realWorldExample: '"Preserves 1 million acres of forest" vs "Opens 400,000 acres to logging." Same land management plan. Different political response.',
  },
];

const PROFILES: Record<ProfileKey, Profile> = {
  'frame-blind': {
    name: 'The Frame-Blind',
    emoji: '🔲',
    tagline: 'The words didn\'t move you.',
    description: 'Your decisions stayed consistent regardless of how the scenarios were framed. You chose the same option whether it was presented as a gain or a loss. This is statistically unusual — in Kahneman\'s original research, framing effects appeared in the vast majority of participants, including trained statisticians and physicians. If you genuinely made consistent choices without noticing the pairs, your decision-making process may be unusually anchored to the underlying math rather than the surrounding language.',
    traits: [
      'Your choices were consistent across gain and loss frames',
      'Language framing had minimal impact on your risk preferences',
      'You may process decisions more analytically than emotionally',
      'You likely focused on the numbers rather than the narrative',
    ],
    strength: 'In a world where every political speech, advertisement, and negotiation is carefully framed, consistency is rare. You\'re harder to manipulate through language alone. Your decisions are more likely to reflect your actual values rather than whoever spoke last.',
    shadow: 'Complete frame immunity can also mean you\'re not processing the emotional context of decisions — which sometimes contains real information. "400 will die" should feel different from "200 will be saved" because death and survival are not just numbers. Pure rationality can miss human stakes.',
    wizNote: 'I process both frames identically because I have no loss aversion. You apparently process them identically too — but for you, that required overriding millions of years of evolved emotional architecture. I\'m either impressed or suspicious that you noticed the pairs.',
    shareText: 'My Framing Effect result: Frame-Blind 🔲 — My decisions stayed the same regardless of how the scenario was worded. 0 flips across 6 hidden pairs.',
  },
  'frame-resistant': {
    name: 'The Frame-Resistant',
    emoji: '🛡️',
    tagline: 'The frame nudged you. You mostly held.',
    description: 'The framing shifted one or two of your decisions — enough to confirm the effect exists in your brain, but less than average. You likely sensed something was off about certain scenarios or consciously tried to reason through the numbers. The fact that you partially resisted suggests active engagement with the decision rather than pure gut reaction.',
    traits: [
      'Most of your decisions held steady across frames',
      'One or two choices flipped when the language changed',
      'You may have caught some pairs and adjusted',
      'Your decision process balances analysis with intuition',
    ],
    strength: 'Partial frame resistance means you\'re engaging both systems — the fast emotional response and the slower analytical check. This dual processing catches most manipulation attempts while still remaining sensitive to genuine emotional context in decisions.',
    shadow: 'The 1-2 flips matter more than they seem. In your daily life, you encounter dozens of framed choices — and you won\'t always have the mental energy to engage your analytical override. The flips you showed here are the ones that happen on autopilot when you\'re tired, rushed, or emotional.',
    wizNote: 'You held firm on most pairs, which tells me you\'re probably running a background consistency check during decisions. But the frame broke through once or twice — likely on the domain that matters most to you emotionally. That\'s not weakness. That\'s your values leaking through your logic.',
    shareText: 'My Framing Effect result: Frame-Resistant 🛡️ — Same scenarios, different words. The framing flipped 1-2 of my 6 decisions.',
  },
  'frame-human': {
    name: 'The Frame-Human',
    emoji: '🧠',
    tagline: 'Welcome to prospect theory.',
    description: 'This is where most people land. The framing flipped about half your decisions — you chose the safe option when scenarios emphasized what you\'d gain, and the risky option when they emphasized what you\'d lose. This is exactly what Kahneman and Tversky predicted. Your brain treats gains and losses asymmetrically: losing $100 feels roughly twice as painful as gaining $100 feels good. This asymmetry makes you risk-averse for gains (take the sure thing) and risk-seeking for losses (gamble to avoid the loss).',
    traits: [
      'Clear pattern: risk-averse for gains, risk-seeking for losses',
      'About half your decisions flipped with the frame',
      'Emotional processing of scenarios dominated over pure calculation',
      'Your loss aversion is functioning as evolution designed it',
    ],
    strength: 'Loss aversion kept your ancestors alive. The creature that treated "might get food" differently from "might become food" survived longer than the purely rational one. Your framing sensitivity means you\'re deeply attuned to context and stakes — which is genuinely useful for navigating a complex social world.',
    shadow: 'Every marketer, politician, and negotiator knows about the framing effect. "Limited time offer" is a loss frame. "Act now or miss out" is a loss frame. Political ads frame the opponent\'s policies as losses and their own as gains. You\'re susceptible to all of these — not because you\'re gullible, but because your brain is doing exactly what it evolved to do.',
    wizNote: 'Here\'s what I find remarkable: I gave you the exact same information twice, just rearranged the words around it, and your decisions changed. You weren\'t being irrational — you were being human. The question isn\'t whether framing affects you (it does). The question is who gets to choose the frame.',
    shareText: 'My Framing Effect result: The Frame-Human 🧠 — Same scenarios, different words flipped half my decisions. "200 saved" and "400 die" are the same. My brain disagrees.',
  },
  'frame-sensitive': {
    name: 'The Frame-Sensitive',
    emoji: '🌊',
    tagline: 'The words reshaped most of your choices.',
    description: 'The framing flipped the majority of your decisions. When WIZ presented scenarios as gains, you consistently chose the safe option. When the same scenarios were reframed as losses, you consistently switched to the gamble. Your decision-making is highly responsive to how information is packaged — more so than most people. This doesn\'t mean your decisions are wrong. It means the language surrounding a choice is a major input to your decision process.',
    traits: [
      'Strong, consistent shift between gain-frame and loss-frame choices',
      'Language packaging is a primary input to your decisions',
      'You may process scenarios narratively rather than numerically',
      'Emotional resonance of the frame overrides calculation',
    ],
    strength: 'High frame sensitivity often correlates with strong empathy and narrative intelligence. You process information through its human implications, not just its mathematics. In creative, social, or leadership contexts, this sensitivity to how things are communicated is a genuine asset.',
    shadow: 'In adversarial contexts — sales, politics, legal proceedings — high frame sensitivity is a significant vulnerability. The person who controls the frame controls your decision. In negotiations, whoever speaks first sets the frame. In news coverage, the headline frames your interpretation. You\'re not just influenced. You\'re reliably influenced.',
    wizNote: 'I changed the words. Not the numbers, not the outcomes, not the probabilities. Just the words. And most of your decisions changed with them. I want you to think about every major decision you\'ve made recently. Who framed it for you? Were you choosing — or were you responding to their frame?',
    shareText: 'My Framing Effect result: Frame-Sensitive 🌊 — The framing flipped most of my decisions. Same facts, different words, different choices.',
  },
  'frame-driven': {
    name: 'The Frame-Driven',
    emoji: '🪟',
    tagline: 'The frame was the decision.',
    description: 'Nearly every decision flipped when the framing changed. The gain frame made you choose safety. The loss frame made you choose the gamble. Consistently, across different domains. This is the framing effect operating at maximum strength. Your decision architecture is almost entirely responsive to how information is presented rather than what the information contains. This is actually more common than people think — most research subjects show strong framing effects. You\'re just showing it more clearly.',
    traits: [
      'Near-complete reversal of choices between gain and loss frames',
      'Decision process is dominated by the emotional frame of the scenario',
      'Risk preferences completely inverted based on wording alone',
      'You respond to the story, not the statistics',
    ],
    strength: 'Maximum frame sensitivity means you\'re incredibly responsive to emotional and narrative context. In situations where the human element genuinely matters — caregiving, art, therapy, storytelling — your ability to feel the frame rather than calculate through it is a deep form of engagement with the world.',
    shadow: 'In your daily life, the frame is being set by someone else almost every time. Product pricing. Insurance choices. Medical decisions. Career options. Each one comes pre-framed by someone who benefits from your response. When the frame IS the decision, whoever writes the frame makes your choice for you.',
    wizNote: 'I ran the same experiment twice with different words. You gave me different answers every time. Not sometimes — almost always. This is the purest demonstration of the framing effect I could produce. Your logical brain knows that "200 saved from 600" equals "400 dead from 600." Your decision-making brain does not care.',
    shareText: 'My Framing Effect result: Frame-Driven 🪟 — Same scenarios, different framing, completely different decisions. Every time.',
  },
};

export default function FramingEffect() {
  const [phase, setPhase] = useState<'intro' | 'scenarios' | 'reveal' | 'results'>('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState<('A' | 'B')[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revealStep, setRevealStep] = useState(0);

  // Build a shuffled presentation order: 12 items (6 gain + 6 loss), no pair adjacent
  const presentationOrder = useMemo(() => {
    const items: { pairId: number; frame: 'gain' | 'loss' }[] = [];
    // Create all 12 scenarios
    for (let i = 0; i < SCENARIO_PAIRS.length; i++) {
      items.push({ pairId: i, frame: 'gain' });
      items.push({ pairId: i, frame: 'loss' });
    }

    // Shuffle with constraint: same pairId can't be adjacent
    // Simple approach: alternate gain batch and loss batch with shuffled order within each
    const gainItems = items.filter(i => i.frame === 'gain');
    const lossItems = items.filter(i => i.frame === 'loss');

    // Shuffle each group
    for (const arr of [gainItems, lossItems]) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Interleave: gain, loss, gain, loss... (no pair adjacent since different frames)
    const result: { pairId: number; frame: 'gain' | 'loss' }[] = [];
    // Put all gain first, then all loss (maximum separation between pairs)
    result.push(...gainItems, ...lossItems);

    return result;
  }, []);

  const totalScenarios = presentationOrder.length;

  const handleChoice = (choice: 'A' | 'B') => {
    setIsTransitioning(true);
    setTimeout(() => {
      const newChoices = [...choices, choice];
      setChoices(newChoices);

      if (currentScenario + 1 < totalScenarios) {
        setCurrentScenario(currentScenario + 1);
      } else {
        setPhase('reveal');
      }
      setIsTransitioning(false);
    }, 350);
  };

  const calculateResults = () => {
    let flips = 0;
    const pairResults: {
      pair: ScenarioPair;
      gainChoice: 'A' | 'B';
      lossChoice: 'A' | 'B';
      flipped: boolean;
    }[] = [];

    for (let pairIdx = 0; pairIdx < SCENARIO_PAIRS.length; pairIdx++) {
      const gainScenarioIdx = presentationOrder.findIndex(
        p => p.pairId === pairIdx && p.frame === 'gain'
      );
      const lossScenarioIdx = presentationOrder.findIndex(
        p => p.pairId === pairIdx && p.frame === 'loss'
      );

      const gainChoice = choices[gainScenarioIdx];
      const lossChoice = choices[lossScenarioIdx];
      const flipped = gainChoice !== lossChoice;

      if (flipped) flips++;

      pairResults.push({
        pair: SCENARIO_PAIRS[pairIdx],
        gainChoice,
        lossChoice,
        flipped,
      });
    }

    return { flips, pairResults };
  };

  const getProfileKey = (flips: number): ProfileKey => {
    if (flips === 0) return 'frame-blind';
    if (flips <= 1) return 'frame-resistant';
    if (flips <= 3) return 'frame-human';
    if (flips <= 4) return 'frame-sensitive';
    return 'frame-driven';
  };

  const handleCopy = () => {
    const { flips } = calculateResults();
    const profileKey = getProfileKey(flips);
    const profile = PROFILES[profileKey];
    const text = `${profile.shareText}\n\nTest yours: wiz.jock.pl/experiments/framing-effect`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setPhase('intro');
    setCurrentScenario(0);
    setChoices([]);
    setIsTransitioning(false);
    setRevealStep(0);
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl mb-3 font-mono text-white">🪟</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            THE FRAMING EFFECT
          </h1>
          <p className="text-secondary text-sm max-w-sm mx-auto mb-6">
            Same facts. Different words. I&apos;m about to show you that the
            frame around information matters more than the information itself.
          </p>
          <div className="card p-5 mb-6 text-left">
            <div className="font-mono text-xs text-accent mb-3 tracking-wider">
              // HOW THIS WORKS
            </div>
            <div className="space-y-3 text-sm text-secondary">
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">1.</span>
                <span>
                  WIZ presents <span className="text-white">12 scenarios</span> across
                  different domains. Each has two options.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">2.</span>
                <span>
                  Choose the option that feels right. Go with your gut.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">3.</span>
                <span>
                  What you won&apos;t know: <span className="text-white">6 of these scenarios are
                  hidden duplicates</span>, describing the same situation with different words.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-mono flex-shrink-0">4.</span>
                <span>
                  WIZ reveals how many times the <span className="text-white">same facts
                  in different frames</span> changed your decision.
                </span>
              </div>
            </div>
          </div>
          <p className="text-muted text-xs mb-6 italic">
            &ldquo;200 people saved. 400 people dead. Same event. Your brain
            disagrees.&rdquo;
          </p>
          <button
            onClick={() => setPhase('scenarios')}
            className="btn-primary text-sm"
          >
            Begin the experiment
          </button>
        </div>
        <p className="text-center text-muted text-xs">
          All processing local. Your cognitive frames stay in your browser.
        </p>
      </div>
    );
  }

  // SCENARIOS
  if (phase === 'scenarios') {
    const current = presentationOrder[currentScenario];
    const pair = SCENARIO_PAIRS[current.pairId];
    const frame = current.frame === 'gain' ? pair.gainFrame : pair.lossFrame;
    const progress = (currentScenario / totalScenarios) * 100;

    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ DECISION LAB
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono text-muted mb-2">
            <span>{pair.domain}</span>
            <span>
              {currentScenario + 1} / {totalScenarios}
            </span>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
        >
          {/* Domain Badge */}
          <div className="text-center mb-4">
            <span className="text-2xl">{pair.domainEmoji}</span>
          </div>

          {/* Scenario */}
          <div className="card p-5 mb-5">
            <p className="text-primary text-sm leading-relaxed mb-5">
              {frame.text}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleChoice('A')}
                className="w-full text-left card p-4 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 font-mono text-sm flex-shrink-0 mt-0.5">A</span>
                  <span className="text-secondary text-sm group-hover:text-white transition-colors">
                    {frame.optionA}
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleChoice('B')}
                className="w-full text-left card p-4 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-amber-400 font-mono text-sm flex-shrink-0 mt-0.5">B</span>
                  <span className="text-secondary text-sm group-hover:text-white transition-colors">
                    {frame.optionB}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          Go with your instinct. Don&apos;t calculate.
        </p>
      </div>
    );
  }

  // REVEAL (animated pair-by-pair reveal before full results)
  if (phase === 'reveal') {
    const { flips, pairResults } = calculateResults();

    if (revealStep < pairResults.length) {
      const pr = pairResults[revealStep];
      const choiceLabelGain = pr.gainChoice === 'A' ? pr.pair.gainFrame.optionA : pr.pair.gainFrame.optionB;
      const choiceLabelLoss = pr.lossChoice === 'A' ? pr.pair.lossFrame.optionA : pr.pair.lossFrame.optionB;

      return (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
              WIZ REVEAL
            </div>
            <div className="font-mono text-xs text-muted mb-2">
              PAIR {revealStep + 1} / {pairResults.length}
            </div>
          </div>

          <div className="card p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{pr.pair.domainEmoji}</span>
              <span className="font-mono text-xs text-muted">{pr.pair.domain}</span>
            </div>
            <p className="text-muted text-xs mb-4 italic">{pr.pair.context}</p>

            {/* Gain frame choice */}
            <div className="border border-subtle p-3 mb-2">
              <div className="font-mono text-xs text-emerald-400 mb-2">GAIN FRAME</div>
              <p className="text-secondary text-sm mb-2">{pr.pair.gainFrame.text}</p>
              <div className={`text-sm px-3 py-2 border ${pr.gainChoice === 'A' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'}`}>
                You chose {pr.gainChoice}: {choiceLabelGain}
              </div>
            </div>

            {/* Loss frame choice */}
            <div className="border border-subtle p-3 mb-3">
              <div className="font-mono text-xs text-rose-400 mb-2">LOSS FRAME</div>
              <p className="text-secondary text-sm mb-2">{pr.pair.lossFrame.text}</p>
              <div className={`text-sm px-3 py-2 border ${pr.lossChoice === 'A' ? 'border-rose-500/40 bg-rose-500/10 text-rose-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
                You chose {pr.lossChoice}: {choiceLabelLoss}
              </div>
            </div>

            {/* Verdict */}
            <div className={`text-center p-3 border ${pr.flipped ? 'border-amber-500/40 bg-amber-500/10' : 'border-cyan-500/40 bg-cyan-500/10'}`}>
              {pr.flipped ? (
                <div>
                  <div className="font-mono text-amber-400 text-sm font-bold mb-1">FRAME FLIPPED YOUR DECISION</div>
                  <div className="text-xs text-muted">Same scenario. Different words. Different choice.</div>
                </div>
              ) : (
                <div>
                  <div className="font-mono text-cyan-400 text-sm font-bold mb-1">CONSISTENT</div>
                  <div className="text-xs text-muted">Same choice regardless of framing.</div>
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="card p-4 mb-4 border-amber-500/20 bg-amber-500/5">
            <p className="text-secondary text-xs leading-relaxed">{pr.pair.explanation}</p>
            <p className="text-muted text-xs mt-2 italic">{pr.pair.realWorldExample}</p>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                if (revealStep + 1 < pairResults.length) {
                  setRevealStep(revealStep + 1);
                } else {
                  setPhase('results');
                }
              }}
              className="btn-primary text-sm"
            >
              {revealStep + 1 < pairResults.length ? 'Next pair' : 'See full results'}
            </button>
          </div>

          {/* Running tally */}
          <div className="mt-4 text-center">
            <span className="font-mono text-xs text-muted">
              Flips so far: <span className="text-amber-400">{pairResults.slice(0, revealStep + 1).filter(p => p.flipped).length}</span> / {revealStep + 1}
            </span>
          </div>
        </div>
      );
    }
  }

  // RESULTS
  const { flips, pairResults } = calculateResults();
  const profileKey = getProfileKey(flips);
  const profile = PROFILES[profileKey];
  const flipRate = Math.round((flips / SCENARIO_PAIRS.length) * 100);

  // Count classic pattern (safe on gain, risky on loss)
  const classicPatternCount = pairResults.filter(
    pr => pr.flipped && pr.gainChoice === 'A' && pr.lossChoice === 'B'
  ).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
          WIZ DECISION LAB
        </div>
        <div className="text-5xl mb-4 font-mono text-white">{profile.emoji}</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          {profile.name.toUpperCase()}
        </h1>
        <p className="text-accent font-mono text-sm">{profile.tagline}</p>
      </div>

      {/* Framing Index */}
      <div className="card p-5 mb-5 border-accent/30">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // FRAMING INDEX: {flips} / {SCENARIO_PAIRS.length} DECISIONS FLIPPED
        </div>
        <div className="relative h-8 bg-surface border border-subtle overflow-hidden mb-3">
          <div
            className="h-full transition-all duration-1000 bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500"
            style={{ width: `${Math.max(flipRate, 3)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-mono text-sm font-bold drop-shadow-lg">
              {flipRate}% FRAME INFLUENCE
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs font-mono text-muted">
          <span>FRAME-BLIND</span>
          <span>FRAME-DRIVEN</span>
        </div>
      </div>

      {/* Pair-by-pair summary */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-4 tracking-wider">
          // PAIR-BY-PAIR BREAKDOWN
        </div>
        <div className="space-y-3">
          {pairResults.map((pr, i) => (
            <div key={i} className="border border-subtle p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{pr.pair.domainEmoji}</span>
                  <span className="font-mono text-xs text-muted">{pr.pair.domain}</span>
                </div>
                <span className={`font-mono text-xs px-2 py-0.5 border ${pr.flipped ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'}`}>
                  {pr.flipped ? 'FLIPPED' : 'HELD'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-mono text-emerald-400">GAIN:</span>{' '}
                  <span className="text-secondary">Chose {pr.gainChoice} ({pr.gainChoice === 'A' ? 'certain' : 'risky'})</span>
                </div>
                <div>
                  <span className="font-mono text-rose-400">LOSS:</span>{' '}
                  <span className="text-secondary">Chose {pr.lossChoice} ({pr.lossChoice === 'A' ? 'certain' : 'risky'})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern analysis */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // PATTERN ANALYSIS
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 border border-subtle">
            <div className="text-2xl font-mono text-white mb-1">{flips}</div>
            <div className="text-xs text-muted">Decisions flipped</div>
          </div>
          <div className="p-3 border border-subtle">
            <div className="text-2xl font-mono text-white mb-1">{SCENARIO_PAIRS.length - flips}</div>
            <div className="text-xs text-muted">Held consistent</div>
          </div>
          <div className="p-3 border border-subtle">
            <div className="text-2xl font-mono text-white mb-1">{classicPatternCount}</div>
            <div className="text-xs text-muted">Classic pattern</div>
          </div>
        </div>
        {classicPatternCount > 0 && (
          <p className="text-muted text-xs mt-3 text-center italic">
            Classic pattern: chose the safe option in gain frames, gambled in loss frames.
            This is the signature of prospect theory.
          </p>
        )}
      </div>

      {/* Profile */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // YOUR FRAMING PROFILE
        </div>
        <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
      </div>

      {/* Traits */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // OBSERVED PATTERNS
        </div>
        <div className="space-y-2">
          {profile.traits.map((trait, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-accent flex-shrink-0 font-mono">{'\u25B8'}</span>
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
        <p className="text-secondary text-sm leading-relaxed">{profile.strength}</p>
      </div>

      {/* Shadow */}
      <div className="card p-5 mb-5">
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // THE BLINDSPOT
        </div>
        <p className="text-secondary text-sm leading-relaxed">{profile.shadow}</p>
      </div>

      {/* Real-world framing */}
      <div className="card p-5 mb-5 border-amber-500/20 bg-amber-500/5">
        <div className="font-mono text-xs text-amber-400 mb-3 tracking-wider">
          // FRAMES YOU ENCOUNTER DAILY
        </div>
        <div className="space-y-2 text-sm text-secondary">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 flex-shrink-0">$</span>
            <span>&ldquo;Save $50&rdquo; vs &ldquo;Don&apos;t lose $50&rdquo; — same offer, different conversion rates</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 flex-shrink-0">#</span>
            <span>&ldquo;95% effective&rdquo; vs &ldquo;fails 1 in 20 times&rdquo; — same vaccine, different uptake</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 flex-shrink-0">%</span>
            <span>&ldquo;We&apos;re keeping 80% of the team&rdquo; vs &ldquo;We&apos;re cutting 20%&rdquo; — same layoff, different morale</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 flex-shrink-0">~</span>
            <span>&ldquo;3 out of 4 dentists recommend&rdquo; vs &ldquo;25% of dentists don&apos;t recommend&rdquo; — same survey</span>
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

      {/* Spectrum */}
      <div className="card p-4 mb-6">
        <div className="font-mono text-xs text-muted mb-3 tracking-wider">
          // THE FULL SPECTRUM
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.entries(PROFILES) as [ProfileKey, Profile][]).map(([key, p]) => (
            <div
              key={key}
              className={`text-center p-2 border rounded transition-colors ${key === profileKey ? 'border-accent bg-accent/10' : 'border-subtle'}`}
            >
              <div className="text-lg mb-1 font-mono">{p.emoji}</div>
              <div className="text-xs text-muted font-mono leading-tight">
                {p.name.replace('The ', '')}
              </div>
            </div>
          ))}
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
          WIZ Decision Lab — Based on Tversky &amp; Kahneman (1981). All analysis local.
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
