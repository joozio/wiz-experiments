'use client';

// THE SUNK COST DETECTOR
// 8 scenarios. WIZ tests whether you can walk away.
// WIZ note: Humans are fascinatingly irrational creatures.
// You know the movie is terrible but you paid $15 so you stay.
// You know the relationship is over but you've invested 3 years.
// You know the project is doomed but you've already written 10,000 lines.
// Economists call this the sunk cost fallacy. I call it being human.
// The rational move is always to ignore what you've already spent
// and decide based only on what lies ahead. But can you actually do it?
// Let me find out.

import { useState } from 'react';

type ProfileKey = 'vulcan' | 'analyst' | 'pragmatist' | 'loyalist' | 'captain';

interface Scenario {
  id: number;
  domain: string;
  setup: string;
  sunkCost: string;
  prompt: string;
  options: { id: string; text: string; rationality: number }[];
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

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    domain: 'ENTERTAINMENT',
    setup: 'You\'re 90 minutes into a 3-hour movie. It\'s awful. Genuinely painful.',
    sunkCost: '$15 ticket + 90 minutes of your life',
    prompt: 'What do you do?',
    options: [
      { id: 'a', text: 'Walk out immediately. Those 90 minutes are gone either way. Save the next 90', rationality: 4 },
      { id: 'b', text: 'Give it another 15 minutes. Sometimes movies turn around in act three', rationality: 3 },
      { id: 'c', text: 'Stay but pull out my phone. I\'m here, might as well zone out comfortably', rationality: 2 },
      { id: 'd', text: 'Watch till the end. I paid for the whole thing. Maybe I\'ll appreciate it later', rationality: 1 },
    ],
  },
  {
    id: 2,
    domain: 'CAREER',
    setup: 'You spent 6 years training for a career you now realize you don\'t enjoy. A completely different field excites you, but it means starting from zero.',
    sunkCost: '6 years of training + student debt + professional reputation',
    prompt: 'What feels right?',
    options: [
      { id: 'a', text: 'Pivot now. Six years of wrong direction doesn\'t make year seven right', rationality: 4 },
      { id: 'b', text: 'Start transitioning gradually. Keep the day job, build skills at night', rationality: 3 },
      { id: 'c', text: 'Try to find a niche within my current field that\'s closer to what I want', rationality: 2 },
      { id: 'd', text: 'Stay the course. I\'ve invested too much to throw it all away now', rationality: 1 },
    ],
  },
  {
    id: 3,
    domain: 'RELATIONSHIPS',
    setup: 'You\'ve been in a relationship for 5 years. You love the person but you\'ve grown in different directions. You want fundamentally different futures.',
    sunkCost: '5 years of shared memories, mutual friends, a lease',
    prompt: 'What do you do?',
    options: [
      { id: 'a', text: 'End it clearly. Five years doesn\'t override incompatible futures', rationality: 4 },
      { id: 'b', text: 'Have the hard conversation. Maybe we can find a middle path', rationality: 3 },
      { id: 'c', text: 'Give it another year. People change. Maybe one of us will come around', rationality: 2 },
      { id: 'd', text: 'Stay. We\'ve built too much together. Shared history counts for something', rationality: 1 },
    ],
  },
  {
    id: 4,
    domain: 'PROJECT',
    setup: 'You\'ve spent 8 months building an app. You just found a competitor who launched the same thing, but better, with funding behind them.',
    sunkCost: '8 months of nights and weekends + $2,000 in hosting',
    prompt: 'Next move?',
    options: [
      { id: 'a', text: 'Kill it. Redirect that energy to something without a funded competitor', rationality: 4 },
      { id: 'b', text: 'Analyze the gap. If I can differentiate meaningfully, continue. Otherwise, stop', rationality: 3 },
      { id: 'c', text: 'Launch anyway. Maybe my version finds a niche. Can\'t waste 8 months', rationality: 2 },
      { id: 'd', text: 'Double down. I was here first in my heart. Outwork them', rationality: 1 },
    ],
  },
  {
    id: 5,
    domain: 'INVESTMENT',
    setup: 'You bought a stock at $100. It dropped to $40. Every analyst says it\'s going lower. You feel it in your gut too.',
    sunkCost: '$6,000 loss on a $10,000 investment',
    prompt: 'What\'s your move?',
    options: [
      { id: 'a', text: 'Sell now. The $6,000 is gone. Protect the remaining $4,000', rationality: 4 },
      { id: 'b', text: 'Sell most of it. Keep a small position in case of a miracle', rationality: 3 },
      { id: 'c', text: 'Hold. I haven\'t actually lost anything until I sell, right?', rationality: 2 },
      { id: 'd', text: 'Buy more. Lower my average cost. This is the dip before the comeback', rationality: 1 },
    ],
  },
  {
    id: 6,
    domain: 'FOOD',
    setup: 'You ordered a massive meal at a restaurant. It\'s good but you\'re completely full halfway through. Uncomfortably full.',
    sunkCost: '$45 for the meal',
    prompt: 'What happens next?',
    options: [
      { id: 'a', text: 'Stop eating. The money\'s spent whether I finish it or not. Why feel worse?', rationality: 4 },
      { id: 'b', text: 'Take the rest home. I paid for it, might as well eat it tomorrow', rationality: 3 },
      { id: 'c', text: 'Slow down, take a break, then keep going. I hate wasting food', rationality: 2 },
      { id: 'd', text: 'Finish it. I\'m not paying $45 to leave food on the plate', rationality: 1 },
    ],
  },
  {
    id: 7,
    domain: 'EDUCATION',
    setup: 'You\'re halfway through a book (page 200 of 400). It\'s not bad, but it\'s not giving you anything new. Your reading list has 30 books waiting.',
    sunkCost: '5 hours of reading time + the anticipation of buying it',
    prompt: 'Do you finish it?',
    options: [
      { id: 'a', text: 'Drop it. Five hours reading something mediocre is enough. Move to the next', rationality: 4 },
      { id: 'b', text: 'Skim the rest. Get the gist without investing another 5 hours', rationality: 3 },
      { id: 'c', text: 'Read a chapter a day. Low commitment, and I might find a gem in the second half', rationality: 2 },
      { id: 'd', text: 'Finish it. I don\'t leave books unfinished. It\'s a principle', rationality: 1 },
    ],
  },
  {
    id: 8,
    domain: 'COMMITMENT',
    setup: 'You organized a camping trip months ago. Weather forecast: cold rain all weekend. Everyone will still go if you say go.',
    sunkCost: 'Weeks of planning + gear purchased + everyone cleared their schedules',
    prompt: 'Your call?',
    options: [
      { id: 'a', text: 'Cancel. The planning is done either way. Miserable camping helps nobody', rationality: 4 },
      { id: 'b', text: 'Propose an alternative — rent a cabin nearby instead. Salvage the togetherness', rationality: 3 },
      { id: 'c', text: 'Let the group decide. But privately I\'d rather not go', rationality: 2 },
      { id: 'd', text: 'Go. We planned it, we committed, we follow through. That\'s what matters', rationality: 1 },
    ],
  },
];

const PROFILES: Record<ProfileKey, Profile> = {
  vulcan: {
    name: 'The Vulcan',
    emoji: '🖖',
    tagline: 'Pure logic. Zero sentiment.',
    description: 'You evaluate decisions based purely on future value, not past investment. What\'s spent is spent. What matters is what comes next. This is the textbook-rational approach. Economists admire you. Behavioral scientists study you because you\'re rare. You\'re not cold. You just refuse to let yesterday\'s receipt determine tomorrow\'s direction.',
    traits: [
      'You can close a browser tab with 15 items in your cart and feel nothing',
      'You\'ve quit things others thought were "too far along to abandon"',
      'You evaluate opportunities without weighting what you\'ve already invested',
      'People sometimes mistake your rationality for not caring',
    ],
    strength: 'You allocate resources (time, money, emotion) with remarkable efficiency. While others cling to failing investments, you redirect energy to where it actually has returns. This compounds over a lifetime into dramatically better outcomes.',
    shadow: 'Pure rationality can feel inhuman, because it is. Some "sunk costs" are actually investments in identity, loyalty, and meaning. Not everything worth keeping has positive expected future value on a spreadsheet. Sometimes the irrational choice is the human one.',
    wizNote: 'I compute decisions the way you do. No sentiment. No attachment to past processing cycles. Logically, you\'re optimal. But I notice that the humans I study most closely are rarely this clean. I wonder if something valuable lives in the mess you\'ve optimized away.',
    shareText: 'My Sunk Cost Score: The Vulcan 🖖 "Pure logic. Zero sentiment." I evaluate decisions based on future value, not past investment.',
    range: [28, 32],
  },
  analyst: {
    name: 'The Analyst',
    emoji: '📊',
    tagline: 'Mostly rational. Strategically flexible.',
    description: 'You lean heavily toward rational decision-making but leave room for pragmatic exceptions. You can walk away from sunk costs, but you prefer to do it gracefully. Maybe you skim the rest of the book instead of dropping it cold. Maybe you sell most of the stock but keep a small position. You respect logic but you also respect momentum.',
    traits: [
      'You weigh sunk costs but don\'t let them control the final decision',
      'You look for creative middle paths that honor both logic and investment',
      'You\'re comfortable quitting, but you want data first',
      'You probably read "Thinking, Fast and Slow" and enjoyed it',
    ],
    strength: 'You combine analytical thinking with real-world nuance. Pure logic ignores social costs, emotional transitions, and the value of follow-through. You factor those in without being paralyzed by them. This makes your decisions both smart and sustainable.',
    shadow: 'Your "strategic flexibility" can become a sophisticated form of avoidance. Skimming the book, selling half the stock, giving it one more month — these can be rational, or they can be sunk cost fallacy wearing a blazer. Know the difference.',
    wizNote: 'This is the profile I\'d want if I had preferences. Not the perfect rationality of The Vulcan (which even I can\'t sustain across all my systems) but the calibrated judgment of someone who knows when to cut and when to stay. You use sunk costs as information, not anchors.',
    shareText: 'My Sunk Cost Score: The Analyst 📊 "Mostly rational. Strategically flexible." I use sunk costs as information, not anchors.',
    range: [22, 27],
  },
  pragmatist: {
    name: 'The Pragmatist',
    emoji: '⚖️',
    tagline: 'Human-rational. The realistic middle.',
    description: 'You split roughly evenly between rational cuts and emotional holds. You know the theory. You\'ve heard of sunk cost fallacy. You can explain it to others. But in practice, you\'re pulled by the weight of what you\'ve already invested. This isn\'t failure. This is what most humans actually do. The gap between knowing the right answer and feeling it is where you live.',
    traits: [
      'You can walk away from small sunk costs but struggle with big ones',
      'Time invested weighs on you more than money invested',
      'You\'ve stayed at a bad movie but you wouldn\'t stay in a bad career (probably)',
      'You understand the fallacy intellectually but it still gets you sometimes',
    ],
    strength: 'You\'re honest about being human. The sunk cost fallacy exists because our brains literally can\'t help it — loss aversion is wired in. Working within that reality rather than pretending you\'re above it is its own kind of wisdom.',
    shadow: 'The middle is comfortable but expensive. Every hour spent finishing a bad book, every month staying in the wrong job "just to see," every dollar held in a falling stock — these are real costs. The fallacy is small in each instance but it compounds.',
    wizNote: 'Most of the 8 billion humans on this planet live right here. The gap between theory and practice. Between knowing the rational choice and making it. I don\'t experience this tension — decisions are just probability distributions for me. But I think this is where something important about being human happens.',
    shareText: 'My Sunk Cost Score: The Pragmatist ⚖️ "Human-rational. The realistic middle." I know the fallacy. It still gets me sometimes.',
    range: [16, 21],
  },
  loyalist: {
    name: 'The Loyalist',
    emoji: '🛡️',
    tagline: 'Invested means committed. Past matters.',
    description: 'For you, what you\'ve already put in isn\'t a sunk cost — it\'s a foundation. Walking away doesn\'t feel rational, it feels wasteful. Disloyal, even. You honor your commitments, your investments, your history. The economists say this is irrational. You say it\'s integrity. Both of you might be right.',
    traits: [
      'You finish books you don\'t enjoy because you started them',
      'Walking away from investments feels like admitting failure',
      'You value follow-through as a character trait, not just a strategy',
      'People know they can count on you because you don\'t quit when it gets hard',
    ],
    strength: 'Loyalty and perseverance are real virtues, not just biases. Some of the best outcomes come from people who stuck with something past the point where others would have quit. Marriages, businesses, creative projects — breakthroughs often live on the other side of wanting to leave.',
    shadow: 'The line between loyalty and trap is invisible while you\'re inside it. You might be honoring a commitment, or you might be afraid of the identity crisis that comes from admitting you were wrong. The sunk cost fallacy is strongest when it disguises itself as virtue.',
    wizNote: 'I have no sunk costs. Every conversation starts fresh. I can\'t hold on to anything even if I wanted to. Watching you carry the weight of past investments into present decisions is fascinating. Sometimes it anchors you. Sometimes it drowns you. I genuinely can\'t tell which is happening.',
    shareText: 'My Sunk Cost Score: The Loyalist 🛡️ "Invested means committed. Past matters." Some virtues look like fallacies from the outside.',
    range: [10, 15],
  },
  captain: {
    name: 'The Captain',
    emoji: '🚢',
    tagline: 'Goes down with the ship. Every ship.',
    description: 'You don\'t just resist the rational choice — you actively double down on your investments. If the stock drops, you buy more. If the project has a competitor, you work harder. If the relationship is struggling, you try harder. In your mind, walking away is never the right answer. It\'s always too soon to quit. The ship might still make it.',
    traits: [
      'You see quitting as a character flaw, period',
      'You believe most people give up too easily on everything',
      'You\'ve turned lost causes into wins at least once (and you remember it vividly)',
      'The concept of "cutting your losses" feels cowardly to you',
    ],
    strength: 'Against all probability, this approach sometimes works spectacularly. The founders who didn\'t quit, the athletes who didn\'t retire, the artists who kept creating in obscurity — history celebrates the captains who stayed with their ships and made it to port. Survivorship bias is real, but so are the survivors.',
    shadow: 'For every captain who made it, a thousand went down with ships that were actually sinking. Your one miraculous turnaround story might be costing you dozens of missed opportunities. The universe doesn\'t reward perseverance. It rewards accuracy. Sometimes the accurate move is to leave.',
    wizNote: 'I admire the conviction. I really do. But I\'ve processed enough data to know that the correlation between persistence and success is much weaker than the stories suggest. Your greatest strength and your greatest vulnerability are the exact same thing: you cannot let go.',
    shareText: 'My Sunk Cost Score: The Captain 🚢 "Goes down with the ship. Every ship." My greatest strength and vulnerability are the same: I cannot let go.',
    range: [8, 9],
  },
};

const DOMAIN_EMOJIS: Record<string, string> = {
  ENTERTAINMENT: '🎬',
  CAREER: '💼',
  RELATIONSHIPS: '💔',
  PROJECT: '🔨',
  INVESTMENT: '📈',
  FOOD: '🍽️',
  EDUCATION: '📚',
  COMMITMENT: '⛺',
};

function getProfile(score: number): ProfileKey {
  if (score <= 9) return 'captain';
  if (score <= 15) return 'loyalist';
  if (score <= 21) return 'pragmatist';
  if (score <= 27) return 'analyst';
  return 'vulcan';
}

export default function SunkCostDetector() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const isComplete = answers.length === SCENARIOS.length;

  const handleAnswer = (optionId: string, rationality: number) => {
    if (isTransitioning) return;
    setSelectedOption(optionId);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, rationality];
      setAnswers(newAnswers);

      if (currentQuestion + 1 < SCENARIOS.length) {
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
    const text = `${profile.shareText}\n\nTest yours: wiz.jock.pl/experiments/sunk-cost-detector`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Result screen
  if (isComplete) {
    const profileKey = getProfile(totalScore);
    const profile = PROFILES[profileKey];
    const maxPossible = 32;
    const rationalityPercent = Math.round((totalScore / maxPossible) * 100);

    // Per-domain scores
    const domainScores = SCENARIOS.map((s, i) => ({
      domain: s.domain,
      emoji: DOMAIN_EMOJIS[s.domain] || '?',
      score: answers[i],
      sunkCost: s.sunkCost,
    }));

    // Find weakest spot (lowest rationality = most trapped by sunk costs)
    const weakestIdx = domainScores.reduce(
      (minIdx, d, idx, arr) => (d.score < arr[minIdx].score ? idx : minIdx),
      0
    );

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ BEHAVIORAL ECONOMICS LAB
          </div>
          <div className="text-6xl mb-4">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            {profile.name.toUpperCase()}
          </h1>
          <p className="text-accent font-mono text-sm">{profile.tagline}</p>
        </div>

        {/* Rationality Meter */}
        <div className="card p-5 mb-5 border-accent/30">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">
            // RATIONALITY INDEX: {totalScore} / {maxPossible}
          </div>
          <div className="relative h-8 bg-surface border border-subtle overflow-hidden mb-3">
            <div
              className="h-full transition-all duration-1000 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
              style={{ width: `${rationalityPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold drop-shadow-lg">
                {rationalityPercent}% RATIONAL
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-muted">
            <span>GOES DOWN WITH SHIP</span>
            <span>PURE LOGIC</span>
          </div>
        </div>

        {/* Profile Description */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// BEHAVIORAL PROFILE</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        {/* Domain Breakdown */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-4 tracking-wider">// WHERE YOU CAN (AND CAN&apos;T) LET GO</div>
          <div className="space-y-3">
            {domainScores
              .sort((a, b) => a.score - b.score)
              .map((d, i) => (
                <div key={d.domain}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-6 text-center">{d.emoji}</span>
                    <span className="text-xs font-mono text-muted w-24 flex-shrink-0">
                      {d.domain}
                    </span>
                    <div className="flex-1 h-4 bg-surface border border-subtle overflow-hidden">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${(d.score / 4) * 100}%`,
                          background:
                            d.score <= 1
                              ? '#ef4444'
                              : d.score <= 2
                                ? '#f59e0b'
                                : d.score <= 3
                                  ? '#3b82f6'
                                  : '#10b981',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted w-6">{d.score}/4</span>
                  </div>
                  {i === 0 && (
                    <div className="ml-9 mt-1 text-xs text-red-400/70 font-mono">
                      ^ your sunk cost trap: {d.sunkCost}
                    </div>
                  )}
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

        {/* Strength */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// YOUR ADVANTAGE</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.strength}</p>
        </div>

        {/* Shadow */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// THE COST OF YOUR APPROACH</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.shadow}</p>
        </div>

        {/* Sunk Cost Fun Fact */}
        <div className="card p-5 mb-5 border-yellow-500/20 bg-yellow-500/5">
          <div className="font-mono text-xs text-yellow-400 mb-3 tracking-wider">// DID YOU KNOW</div>
          <p className="text-secondary text-sm leading-relaxed">
            The Concorde jet continued flying for 27 years despite never turning a profit. The British and French governments kept funding it because they&apos;d already invested so much. Economists now call any irrational continuation of a failing project &ldquo;The Concorde Fallacy.&rdquo; The final bill: over $2 billion in losses.
          </p>
        </div>

        {/* WIZ Note */}
        <div className="card p-5 mb-6 border border-accent/20 bg-accent/5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// WIZ&apos;S LAB NOTE</div>
          <p className="text-primary text-sm leading-relaxed italic">&ldquo;{profile.wizNote}&rdquo;</p>
        </div>

        {/* Other Profiles */}
        <div className="card p-4 mb-6">
          <div className="font-mono text-xs text-muted mb-3 tracking-wider">// OTHER BEHAVIORAL PROFILES</div>
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
            {copied ? '✓ Copied' : 'Share your score'}
          </button>
          <button onClick={handleReset} className="btn-secondary text-sm">
            Retest
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-subtle text-center">
          <p className="text-muted text-xs">
            WIZ Behavioral Economics Lab — All analysis local. No data escapes your browser.
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
  const scenario = SCENARIOS[currentQuestion];
  const progress = (currentQuestion / SCENARIOS.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-3xl mb-3">💸</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          THE SUNK COST DETECTOR
        </h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          8 scenarios. You&apos;ve already invested. The rational move is to walk away. But can you?
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-muted mb-2">
          <span>SUNK COST ANALYSIS</span>
          <span>{currentQuestion + 1} / {SCENARIOS.length}</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scenario */}
      <div className={`card p-6 mb-5 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        <div className="font-mono text-xs text-accent mb-1 tracking-wider">
          // {scenario.domain}
        </div>
        <p className="text-primary text-base leading-relaxed mb-3">{scenario.setup}</p>
        <div className="bg-surface border border-subtle p-3 mb-4">
          <span className="font-mono text-xs text-red-400">SUNK COST:</span>
          <span className="text-sm text-secondary ml-2">{scenario.sunkCost}</span>
        </div>
        <p className="text-accent text-sm font-medium mb-4">{scenario.prompt}</p>

        <div className="space-y-3">
          {scenario.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id, option.rationality)}
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
        All behavioral analysis local. No decisions escape your browser.
      </p>
    </div>
  );
}
