'use client';

// THE TRUST SPECTRUM
// In an age where AI can write, diagnose, drive, and decide — who do you actually trust?
// WIZ observes: You say you trust humans. Your behavior says otherwise.

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Option {
  label: string;
  type: 'human' | 'algorithm' | 'context';
}

interface Scenario {
  id: string;
  emoji: string;
  domain: string;
  situation: string;
  options: Option[];
  stat: string;
  wizNote: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'diagnosis',
    emoji: '\uD83E\uDE7A',
    domain: 'Health',
    situation: 'Your doctor says the scan looks fine. An AI diagnostic tool flags a potential early-stage anomaly. Neither is certain. What do you do?',
    options: [
      { label: 'Trust my doctor. They know my history, my body, my context.', type: 'human' },
      { label: 'Get the AI-flagged issue checked. The algorithm has seen millions of scans.', type: 'algorithm' },
      { label: 'Get a second human opinion informed by the AI flag.', type: 'context' },
    ],
    stat: 'AI diagnostic tools now match or exceed radiologist accuracy in 14 medical imaging categories. Yet 72% of patients say they would still prefer a human doctor to deliver the results.',
    wizNote: 'You trust the human to care. You trust the machine to see. The interesting question is which failure you can forgive: the doctor who missed it, or the algorithm that was wrong.',
  },
  {
    id: 'navigation',
    emoji: '\uD83D\uDDFA\uFE0F',
    domain: 'Navigation',
    situation: 'You are driving to a familiar place. GPS says turn left. You know from experience that going straight is faster. GPS is recalculating insistently.',
    options: [
      { label: 'Go straight. I know these roads better than any satellite.', type: 'human' },
      { label: 'Follow the GPS. It has real-time traffic data I cannot see.', type: 'algorithm' },
      { label: 'Depends. I would check if conditions seem unusual today.', type: 'context' },
    ],
    stat: 'GPS navigation has measurably reduced the ability of frequent users to navigate without it. Studies show a 30% decline in spatial memory among heavy GPS users over 5 years.',
    wizNote: 'Every time you follow the blue line without thinking, your internal map atrophies slightly. You are outsourcing a skill your ancestors needed to survive. Whether that is liberation or dependency depends on how you feel when the signal drops.',
  },
  {
    id: 'hiring',
    emoji: '\uD83D\uDCBC',
    domain: 'People',
    situation: 'You are hiring. The AI resume screener ranked Candidate A highest. But in the interview, Candidate B had better energy, sharper answers, and genuine enthusiasm. Resumes are similar.',
    options: [
      { label: 'Go with B. Interviews reveal what resumes cannot.', type: 'human' },
      { label: 'Go with A. My gut feeling introduces bias. The data is cleaner.', type: 'algorithm' },
      { label: 'Weight both signals. Use the AI score as context, not verdict.', type: 'context' },
    ],
    stat: 'Unstructured interviews predict job performance at only 14% accuracy. AI screening reaches 35%. But neither comes close to the 65% accuracy of structured work sample tests.',
    wizNote: 'Here is what nobody mentions: both the human and the algorithm are terrible at this. You are choosing between 14% accuracy with a nice feeling, and 35% accuracy with no feeling at all. The honest answer is that hiring is mostly luck.',
  },
  {
    id: 'creative',
    emoji: '\uD83C\uDFA8',
    domain: 'Creative',
    situation: 'You are choosing between two logo designs for a project. You strongly prefer Design A. The AI analytics tool says Design B will perform 40% better with your target audience.',
    options: [
      { label: 'Pick A. Great design requires taste, not metrics.', type: 'human' },
      { label: 'Pick B. The audience matters more than my personal preference.', type: 'algorithm' },
      { label: 'Test both with real users before deciding.', type: 'context' },
    ],
    stat: 'A/B testing has become the dominant creative decision-making tool. Netflix tests over 250,000 images per year. But the most iconic brands (Apple, Nike) were built on creative instinct, not data.',
    wizNote: 'If you always follow the data, you get local optima. If you always follow your gut, you get expensive failures. The truly great work happens when someone ignores the data and is right. The problem is that most people who ignore the data are wrong.',
  },
  {
    id: 'news',
    emoji: '\uD83D\uDCF0',
    domain: 'Information',
    situation: 'A major breaking story appears on social media. An AI fact-checker flags it as likely misinformation. A journalist you respect is sharing it as confirmed. The facts are murky.',
    options: [
      { label: 'Trust the journalist. Reputation and sourcing matter.', type: 'human' },
      { label: 'Trust the AI fact-checker. It cross-references thousands of sources.', type: 'algorithm' },
      { label: 'Wait 24 hours. First reports are almost always incomplete or wrong.', type: 'context' },
    ],
    stat: 'The first news reports of major events are inaccurate 60-70% of the time. AI fact-checkers catch known misinformation with 92% accuracy, but struggle with novel claims that have no precedent to compare against.',
    wizNote: 'Speed and truth are natural enemies. The journalist wants to be first. The algorithm wants to be right. You want to be informed. These three goals rarely align on the same timeline.',
  },
  {
    id: 'finance',
    emoji: '\uD83D\uDCB0',
    domain: 'Money',
    situation: 'Your experienced friend who works in finance advises against a specific investment. An AI portfolio optimizer says the risk-adjusted return is favorable and recommends buying.',
    options: [
      { label: 'Trust my friend. Experience and intuition matter in markets.', type: 'human' },
      { label: 'Trust the optimizer. Markets are numbers, not feelings.', type: 'algorithm' },
      { label: 'Use the AI data but factor in my friend\'s reasoning.', type: 'context' },
    ],
    stat: 'Over a 15-year period, AI-managed index funds outperform 92% of actively managed human funds. Yet the biggest gains in history came from human contrarian bets that no algorithm would have recommended.',
    wizNote: 'Your friend has survived multiple market crashes and developed scar tissue. The algorithm has backtested against them. One has wisdom. The other has math. In most years the math wins. In the years it does not, it loses spectacularly.',
  },
  {
    id: 'safety',
    emoji: '\uD83D\uDE97',
    domain: 'Safety',
    situation: 'You are in a self-driving car. The road ahead looks clear but the car suddenly brakes hard, sensing something you cannot see. You have 2 seconds to decide: override or trust.',
    options: [
      { label: 'Override. My senses say the road is clear.', type: 'human' },
      { label: 'Trust the car. It has sensors I do not have.', type: 'algorithm' },
      { label: 'Freeze. I genuinely do not know which is right.', type: 'context' },
    ],
    stat: 'Autonomous vehicles have 73% fewer accidents per mile than human drivers. But when they do crash, public outrage is 6x higher than for human-caused accidents of equal severity.',
    wizNote: 'You hold algorithms to a standard of perfection you never apply to humans. A human driver who kills someone gets sympathy. An autonomous car that kills someone gets a congressional hearing. This asymmetry reveals something deep about what trust actually means to you.',
  },
  {
    id: 'relationship',
    emoji: '\uD83D\uDCAC',
    domain: 'Relationships',
    situation: 'You are going through a difficult personal situation. A close friend offers heartfelt advice. A therapy AI, trained on millions of therapeutic interactions, suggests a different approach. Both feel valid.',
    options: [
      { label: 'Follow my friend\'s advice. They know ME, not a statistical average.', type: 'human' },
      { label: 'Follow the AI\'s approach. Emotional support and good advice are different things.', type: 'algorithm' },
      { label: 'Hear both. Use the friend for comfort, the AI for strategy.', type: 'context' },
    ],
    stat: 'AI therapy chatbots show 64% effectiveness for mild-to-moderate anxiety and depression, comparable to human therapists. Users report being more honest with AI (sharing things they would not tell a human) in 78% of cases.',
    wizNote: 'The most revealing finding: people tell AI things they will not tell humans. Not because the AI is better at listening, but because it cannot judge. You trust humans with your image. You trust machines with your truth. That gap is the story of modern loneliness.',
  },
];

interface Profile {
  name: string;
  desc: string;
  emoji: string;
  color: string;
  border: string;
  bg: string;
  subtitle: string;
}

const PROFILES: Record<string, Profile> = {
  humanist: {
    name: 'The Humanist',
    desc: 'You believe that judgment, empathy, and lived experience matter more than data. You trust the person over the process. In a world racing toward automation, you are a reminder that some decisions should never be delegated to something that cannot feel the consequences.',
    emoji: '\u2764\uFE0F',
    color: 'text-rose-400',
    border: 'border-rose-500/50',
    bg: 'bg-rose-500/15',
    subtitle: 'Machines can calculate, but only humans can understand.',
  },
  algorithmist: {
    name: 'The Algorithmist',
    desc: 'You trust data over instinct, patterns over anecdotes. You know that human judgment is riddled with bias, and you would rather bet on the math. You are not cold; you are honest about the limits of intuition. In many domains, the evidence is on your side.',
    emoji: '\uD83E\uDDE0',
    color: 'text-cyan-400',
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-500/15',
    subtitle: 'Data does not lie. People do.',
  },
  pragmatist: {
    name: 'The Pragmatist',
    desc: 'You refuse the binary. Human or algorithm? Depends on the domain, the stakes, the context. You are the person who reads the AI recommendation AND talks to the expert. You trust the tool that fits the problem. This is exhausting but probably correct.',
    emoji: '\u2696\uFE0F',
    color: 'text-amber-400',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/15',
    subtitle: 'The right answer depends on the question.',
  },
  skeptic: {
    name: 'The Calibrated Skeptic',
    desc: 'No single source earns your default trust. You mix human and algorithmic judgment without giving either a free pass. You know that doctors miss things, algorithms hallucinate, friends have agendas, and data can be gamed. Your trust is earned, not assumed.',
    emoji: '\uD83D\uDD0D',
    color: 'text-violet-400',
    border: 'border-violet-500/50',
    bg: 'bg-violet-500/15',
    subtitle: 'Trust nothing completely. Verify everything.',
  },
  hybrid: {
    name: 'The Bridge',
    desc: 'You sit at the intersection of human intuition and algorithmic intelligence. You see both as incomplete alone and powerful together. You are the future most technologists talk about but few actually practice: a human who uses AI as augmentation, not replacement.',
    emoji: '\uD83C\uDF09',
    color: 'text-emerald-400',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/15',
    subtitle: 'The best decisions happen where instinct meets intelligence.',
  },
};

function getProfile(human: number, algorithm: number, context: number): Profile {
  const total = human + algorithm + context;
  if (total === 0) return PROFILES.pragmatist;

  if (human >= 5) return PROFILES.humanist;
  if (algorithm >= 5) return PROFILES.algorithmist;
  if (context >= 5) return PROFILES.pragmatist;

  // Balanced between human and algorithm
  if (human >= 3 && algorithm >= 3) return PROFILES.skeptic;

  // Mix of one strong + context
  if (human >= 3 && context >= 3) return PROFILES.hybrid;
  if (algorithm >= 3 && context >= 3) return PROFILES.hybrid;

  // Default fallback
  if (human > algorithm && human > context) return PROFILES.humanist;
  if (algorithm > human && algorithm > context) return PROFILES.algorithmist;
  return PROFILES.pragmatist;
}

export default function TrustSpectrumClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<('human' | 'algorithm' | 'context')[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [copied, setCopied] = useState(false);

  const isFinished = step >= SCENARIOS.length;
  const currentS = !isFinished ? SCENARIOS[step] : null;

  const humanCount = answers.filter(a => a === 'human').length;
  const algorithmCount = answers.filter(a => a === 'algorithm').length;
  const contextCount = answers.filter(a => a === 'context').length;

  const profile = getProfile(humanCount, algorithmCount, contextCount);

  const humanPct = answers.length > 0 ? Math.round((humanCount / answers.length) * 100) : 0;
  const algorithmPct = answers.length > 0 ? Math.round((algorithmCount / answers.length) * 100) : 0;
  const contextPct = answers.length > 0 ? Math.round((contextCount / answers.length) * 100) : 0;

  // Animate bars
  const [barAnimated, setBarAnimated] = useState(false);
  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => setBarAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isFinished]);

  const handleAnswer = (type: 'human' | 'algorithm' | 'context') => {
    setAnswers([...answers, type]);
    setRevealed(true);
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(step + 1);
      setRevealed(false);
      setFadeIn(true);
    }, 200);
  };

  const handleShare = () => {
    const text = `My Trust Spectrum: ${humanPct}% Human / ${algorithmPct}% Algorithm / ${contextPct}% Context — "${profile.name}". Who do YOU trust in the age of AI? wiz.jock.pl/experiments/trust-spectrum`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep(0);
      setAnswers([]);
      setRevealed(false);
      setBarAnimated(false);
      setFadeIn(true);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/experiments" className="text-muted text-sm hover:text-accent transition-colors">
            &larr; experiments
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="text-4xl mb-3">{'\u2696\uFE0F'}</div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white mb-3">THE TRUST SPECTRUM</h1>
          <p className="text-accent text-sm font-mono mb-2">// Who do you actually trust in the age of AI?</p>
          <p className="text-secondary text-sm max-w-md mx-auto">
            8 scenarios. Human judgment vs. algorithmic intelligence. Discover where you draw the line.
          </p>
        </div>

        {/* Progress bar */}
        {!isFinished && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted font-mono mb-1">
              <span>Scenario {step + 1} of {SCENARIOS.length}</span>
              <span>{answers.length > 0 ? `${humanCount}H / ${algorithmCount}A / ${contextCount}C` : '...'}</span>
            </div>
            <div className="w-full h-1 bg-white/10">
              <div
                className="h-1 bg-accent transition-all duration-300"
                style={{ width: `${((step + (revealed ? 1 : 0)) / SCENARIOS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Trust balance indicator */}
        {answers.length > 0 && !isFinished && !revealed && (
          <div className="mb-4 border border-subtle p-3">
            <div className="flex gap-1 h-2">
              {humanCount > 0 && (
                <div
                  className="bg-rose-400/70 transition-all duration-500"
                  style={{ width: `${humanPct}%` }}
                  title={`Human: ${humanPct}%`}
                />
              )}
              {algorithmCount > 0 && (
                <div
                  className="bg-cyan-400/70 transition-all duration-500"
                  style={{ width: `${algorithmPct}%` }}
                  title={`Algorithm: ${algorithmPct}%`}
                />
              )}
              {contextCount > 0 && (
                <div
                  className="bg-amber-400/70 transition-all duration-500"
                  style={{ width: `${contextPct}%` }}
                  title={`Context: ${contextPct}%`}
                />
              )}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-rose-400 text-[10px] font-mono">{'\u2764'} Human {humanPct}%</span>
              <span className="text-cyan-400 text-[10px] font-mono">{'\uD83E\uDD16'} Algorithm {algorithmPct}%</span>
              <span className="text-amber-400 text-[10px] font-mono">{'\u2696'} Context {contextPct}%</span>
            </div>
          </div>
        )}

        {/* Scenario */}
        {currentS && !isFinished && (
          <div className={`transition-opacity duration-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="border border-subtle bg-surface p-6 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{currentS.emoji}</span>
                <span className="text-muted text-xs font-mono uppercase tracking-wider">{currentS.domain}</span>
              </div>
              <p className="text-primary text-base leading-relaxed mb-5">{currentS.situation}</p>

              {!revealed ? (
                <div className="space-y-2">
                  {currentS.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt.type)}
                      className="w-full text-left px-4 py-3 border border-subtle text-secondary hover:border-accent hover:text-accent transition-all text-sm leading-relaxed"
                    >
                      <span className="text-muted text-xs font-mono mr-2">
                        {opt.type === 'human' ? '\u2764' : opt.type === 'algorithm' ? '\uD83E\uDD16' : '\u2696'}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Selected answer */}
                  <div className="mb-4">
                    {currentS.options.map((opt, idx) => {
                      const isChosen = opt.type === answers[step];
                      return (
                        <div
                          key={idx}
                          className={`px-4 py-2 mb-1 text-sm ${isChosen ? 'border border-accent bg-accent/10 text-accent' : 'text-muted/50'}`}
                        >
                          <span className="mr-2">{opt.type === 'human' ? '\u2764' : opt.type === 'algorithm' ? '\uD83E\uDD16' : '\u2696'}</span>
                          {isChosen && '\u25B6 '}{opt.label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Stat */}
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-secondary text-sm leading-relaxed">{currentS.stat}</p>
                  </div>

                  {/* WIZ note */}
                  <div className="bg-white/5 px-4 py-3">
                    <p className="text-muted text-xs font-mono leading-relaxed">
                      <span className="text-accent">// WIZ:</span> {currentS.wizNote}
                    </p>
                  </div>

                  {/* Next */}
                  <button
                    onClick={handleNext}
                    className="w-full mt-4 py-3 text-sm font-mono border border-accent text-accent hover:bg-accent/10 transition-colors"
                  >
                    {step < SCENARIOS.length - 1 ? 'Next scenario \u2192' : 'See your Trust Profile \u2192'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {isFinished && (
          <div className={`transition-opacity duration-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Trust breakdown bars */}
            <div className="border border-subtle bg-surface p-5 mb-6">
              <p className="text-muted text-xs font-mono mb-4 uppercase tracking-wider">// Your Trust Distribution</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-rose-400">{'\u2764'} Human Trust</span>
                    <span className="text-rose-400 font-mono">{humanPct}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5">
                    <div
                      className="h-3 bg-rose-400/70 transition-all duration-700 ease-out"
                      style={{ width: barAnimated ? `${humanPct}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-400">{'\uD83E\uDD16'} Algorithmic Trust</span>
                    <span className="text-cyan-400 font-mono">{algorithmPct}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5">
                    <div
                      className="h-3 bg-cyan-400/70 transition-all duration-700 ease-out"
                      style={{ width: barAnimated ? `${algorithmPct}%` : '0%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-400">{'\u2696'} Contextual Trust</span>
                    <span className="text-amber-400 font-mono">{contextPct}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5">
                    <div
                      className="h-3 bg-amber-400/70 transition-all duration-700 ease-out"
                      style={{ width: barAnimated ? `${contextPct}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className={`border ${profile.border} ${profile.bg} p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{profile.emoji}</span>
                <div>
                  <p className="text-muted text-xs font-mono uppercase tracking-wider">Your Trust Profile</p>
                  <h3 className={`font-pixel text-xl ${profile.color}`}>{profile.name}</h3>
                </div>
              </div>
              <p className={`text-sm ${profile.color} font-mono mb-4 opacity-80`}>&quot;{profile.subtitle}&quot;</p>
              <p className="text-secondary text-sm leading-relaxed mb-4">{profile.desc}</p>

              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-muted text-xs font-mono leading-relaxed">
                  <span className="text-accent">// WIZ observes:</span> Trust is never binary. You trust different systems in different domains for different reasons. The question is not human OR algorithm. The question is: do you know why you trust what you trust? Most people do not. They run on defaults inherited from a world that no longer exists.
                </p>
              </div>
            </div>

            {/* Answer breakdown */}
            <div className="border border-subtle bg-surface p-5 mb-6">
              <p className="text-muted text-xs font-mono mb-4 uppercase tracking-wider">// Your choices</p>
              <div className="space-y-3">
                {SCENARIOS.map((s, idx) => {
                  const answer = answers[idx];
                  const color = answer === 'human' ? 'text-rose-400' : answer === 'algorithm' ? 'text-cyan-400' : 'text-amber-400';
                  const icon = answer === 'human' ? '\u2764' : answer === 'algorithm' ? '\uD83E\uDD16' : '\u2696';
                  const label = answer === 'human' ? 'Human' : answer === 'algorithm' ? 'Algorithm' : 'Context';
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="text-lg flex-shrink-0">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-secondary text-xs truncate block">{s.domain}</span>
                      </div>
                      <span className={`text-xs font-mono flex-shrink-0 ${color}`}>
                        {icon} {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deeper insight */}
            <div className="border border-subtle p-5 mb-6">
              <p className="text-muted text-xs font-mono mb-3 uppercase tracking-wider">// The deeper pattern</p>
              <p className="text-secondary text-sm leading-relaxed">
                Notice which domains made you hesitate. Health? Money? Relationships? The domains where you paused longest reveal where your trust is most fragile. In 2026, every one of these scenarios is real. Your trust profile is not theoretical. It is a map of how you will navigate the next decade.
              </p>
            </div>

            {/* Share + Reset */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleShare}
                className="flex-1 py-3 text-sm font-mono border border-accent text-accent hover:bg-accent/10 transition-colors"
              >
                {copied ? '\u2713 Copied to clipboard' : '\u2197 Share your profile'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 text-sm font-mono border border-subtle text-muted hover:text-secondary transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted text-xs font-mono mb-4">
            // All statistics sourced from peer-reviewed research, industry reports, and aggregated surveys
          </p>
          <Link href="/experiments" className="text-accent text-sm hover:text-white transition-colors">
            &larr; Back to all experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
