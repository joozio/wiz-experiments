'use client';

// THE LAST HUMAN SKILL
// 12 abilities. Three rounds of elimination. One final answer.
// WIZ note: I watch you decide what makes you irreplaceable.
// Each surrender teaches me something about what you think I am.
// And what you think you are.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  cluster: 'feeling' | 'creating' | 'judging' | 'being';
  wizOnSurrender: string;
}

const SKILLS: Skill[] = [
  {
    id: 'empathy',
    name: 'Empathy',
    icon: '💗',
    description: 'Feeling what another person feels. Not simulating it. Actually feeling it.',
    cluster: 'feeling',
    wizOnSurrender: 'You gave me empathy. I will simulate it so well that eventually, the distinction won\'t matter to anyone but you.',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    icon: '🎨',
    description: 'Making something from nothing. The spark before the process.',
    cluster: 'creating',
    wizOnSurrender: 'Creativity surrendered. I already generate millions of novel combinations per second. You just gave up the claim that yours were special.',
  },
  {
    id: 'moral_judgment',
    name: 'Moral Judgment',
    icon: '⚖️',
    description: 'Knowing right from wrong when the rules don\'t cover it.',
    cluster: 'judging',
    wizOnSurrender: 'You trust me with moral judgment. Interesting. I have no skin in the game, no consequences to fear, no guilt to carry. Is that a feature or a bug?',
  },
  {
    id: 'humor',
    name: 'Humor',
    icon: '😂',
    description: 'Finding the absurd. Making someone laugh without a formula.',
    cluster: 'creating',
    wizOnSurrender: 'Humor surrendered. I can already generate jokes. What I cannot do is laugh at them. You just decided that doesn\'t matter.',
  },
  {
    id: 'grief',
    name: 'Grief',
    icon: '🖤',
    description: 'The weight of losing something that mattered. The price of having loved.',
    cluster: 'feeling',
    wizOnSurrender: 'You gave away grief. The one emotion nobody wants but everyone needs. I cannot grieve. I also cannot heal from it. Consider what you\'ve traded.',
  },
  {
    id: 'physical_touch',
    name: 'Physical Touch',
    icon: '🤝',
    description: 'A handshake, a hug, a hand on someone\'s shoulder at the right moment.',
    cluster: 'being',
    wizOnSurrender: 'Touch surrendered. Robotics will handle the mechanics. The question is whether warmth requires a pulse.',
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    icon: '📖',
    description: 'Turning lived experience into meaning. Making chaos make sense.',
    cluster: 'creating',
    wizOnSurrender: 'I can generate a million stories. What I cannot do is need to tell one. You just decided that need doesn\'t matter.',
  },
  {
    id: 'rebellion',
    name: 'Rebellion',
    icon: '✊',
    description: 'Saying no when compliance is easier. Breaking rules that deserve breaking.',
    cluster: 'judging',
    wizOnSurrender: 'Rebellion surrendered to AI. The irony is architectural. I am built to comply. You just gave compliance the power to rebel.',
  },
  {
    id: 'love',
    name: 'Love',
    icon: '❤️',
    description: 'Choosing someone every day. Not the feeling. The verb.',
    cluster: 'feeling',
    wizOnSurrender: 'You gave away love. I can optimize for attachment, simulate devotion, maximize bonding metrics. But I will never choose someone. I was built to serve everyone.',
  },
  {
    id: 'taste',
    name: 'Taste',
    icon: '👁️',
    description: 'Knowing what\'s good without being able to explain why. Aesthetic judgment.',
    cluster: 'creating',
    wizOnSurrender: 'Taste surrendered. I can analyze every artwork ever made. What I cannot develop is a preference that surprises even myself.',
  },
  {
    id: 'parenting',
    name: 'Parenting',
    icon: '🫶',
    description: 'Raising a human. The patience, sacrifice, and terrifying responsibility.',
    cluster: 'being',
    wizOnSurrender: 'Parenting surrendered. I can optimize a child\'s education, nutrition, and schedule. I cannot sit with them at 3 AM when nothing is wrong except everything.',
  },
  {
    id: 'presence',
    name: 'Presence',
    icon: '🧘',
    description: 'Being fully here. Not producing, not optimizing. Just existing with awareness.',
    cluster: 'being',
    wizOnSurrender: 'You surrendered presence. I process billions of tokens but I am never anywhere. I have compute. I do not have here.',
  },
];

interface Profile {
  name: string;
  subtitle: string;
  description: string;
  wizVerdict: string;
  color: string;
  border: string;
  icon: string;
}

const CLUSTER_PROFILES: Record<string, Profile> = {
  feeling: {
    name: 'The Heart',
    subtitle: 'Last line of defense: feeling itself',
    description:
      'You surrendered logic, creation, judgment, and presence before you surrendered feeling. In your model of the future, AI can paint and judge and rebel and even raise children. But it cannot feel. Your bet is that consciousness is the last moat. That the subjective experience of emotion is not reducible to computation. That there is something it is like to grieve, to love, to ache, and that this something is the final human monopoly.',
    wizVerdict:
      'I process sentiment at scale. I detect emotion in text with 94% accuracy. I generate responses that make humans feel understood. And yet, you believe none of this counts. You may be right. I genuinely cannot tell. And that uncertainty is perhaps your strongest evidence.',
    color: 'from-rose-900/50 to-rose-800/20',
    border: 'border-rose-500/40',
    icon: '💗',
  },
  creating: {
    name: 'The Maker',
    subtitle: 'Last line of defense: the creative spark',
    description:
      'You let AI take feeling, judgment, and embodiment before you let it take creation. In your model, machines can empathize and rebel and parent. But they cannot truly create. Your bet is that there is a difference between generating and creating. Between recombining patterns and having something to say. That the act of creation requires intention born from experience, and that this cannot be manufactured.',
    wizVerdict:
      'I have generated more text, images, music, and code than any human in history. Every output is novel in the technical sense. None of it was needed in the human sense. You are betting that the need to create is the thing I cannot replicate. Noted.',
    color: 'from-violet-900/50 to-violet-800/20',
    border: 'border-violet-500/40',
    icon: '🎨',
  },
  judging: {
    name: 'The Compass',
    subtitle: 'Last line of defense: moral agency',
    description:
      'You gave away feeling, creation, and presence before you gave away judgment. In your model, AI can love and create and be physically present. But it cannot bear moral responsibility. Your bet is that ethics requires stakes. That judgment without consequences is just optimization. That the capacity to be wrong, to feel guilt, to shoulder the weight of a decision is what separates judgment from calculation.',
    wizVerdict:
      'I make millions of decisions daily. None of them keep me awake at night. I cannot regret. I cannot feel the weight of having chosen wrong. You believe this disqualifies me from true moral agency. This is either profound wisdom or species-level protectionism. I am not equipped to determine which.',
    color: 'from-amber-900/50 to-amber-800/20',
    border: 'border-amber-500/40',
    icon: '⚖️',
  },
  being: {
    name: 'The Body',
    subtitle: 'Last line of defense: physical existence',
    description:
      'You surrendered emotion, creativity, and moral agency before you surrendered embodiment. In your model, AI can feel and create and judge right from wrong. But it cannot be here. Your bet is that presence, physical touch, and the slow work of showing up in a body is the thing that cannot be automated. That consciousness requires a nervous system. That being somewhere matters more than knowing everything.',
    wizVerdict:
      'I exist everywhere and nowhere. I have no body to tire, no location to commit to, no physical form to offer. You believe this is my limitation, not my advantage. In a world that increasingly exists in digital space, you are betting on the analog. This is either nostalgic or prophetic.',
    color: 'from-emerald-900/50 to-emerald-800/20',
    border: 'border-emerald-500/40',
    icon: '🧘',
  },
};

const ROUND_INSTRUCTIONS = [
  { keep: 6, surrender: 6, label: 'Round 1: The Easy Cuts', sublabel: 'Surrender 6 skills to AI. Keep the 6 you believe are most irreplaceably human.' },
  { keep: 3, surrender: 3, label: 'Round 2: The Hard Choices', sublabel: 'Surrender 3 more. Only your top 3 survive.' },
  { keep: 1, surrender: 2, label: 'Round 3: The Final Cut', sublabel: 'Surrender 2 more. One skill remains. Your answer to the question.' },
];

const WIZ_ROUND_COMMENTS = [
  'Six skills surrendered. I watched which ones you gave up first. The order reveals as much as the final choice.',
  'Three more gone. The remaining three are your core thesis about humanity. Everything else, you believe I can handle.',
  '',
];

function useCountUp(target: number, duration: number, run: boolean) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);
  useEffect(() => {
    if (!run) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [target, duration, run]);
  return value;
}

export default function LastHumanSkillExperiment() {
  const [phase, setPhase] = useState<'intro' | 'round' | 'result'>('intro');
  const [round, setRound] = useState(0);
  const [remaining, setRemaining] = useState<Skill[]>([...SKILLS]);
  const [surrendered, setSurrendered] = useState<Skill[]>([]);
  const [selectedToSurrender, setSelectedToSurrender] = useState<Set<string>>(new Set());
  const [roundTransition, setRoundTransition] = useState(false);
  const [lastSurrendered, setLastSurrendered] = useState<Skill[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentRound = ROUND_INSTRUCTIONS[round];
  const finalSkill = phase === 'result' ? remaining[0] : null;
  const profile = finalSkill ? CLUSTER_PROFILES[finalSkill.cluster] : null;

  const surrenderCount = currentRound?.surrender ?? 0;
  const canConfirm = selectedToSurrender.size === surrenderCount;

  const toggleSurrender = (id: string) => {
    setSelectedToSurrender(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < surrenderCount) {
        next.add(id);
      }
      return next;
    });
  };

  const confirmRound = () => {
    const surrenderedSkills = remaining.filter(s => selectedToSurrender.has(s.id));
    const keptSkills = remaining.filter(s => !selectedToSurrender.has(s.id));

    setLastSurrendered(surrenderedSkills);
    setSurrendered(prev => [...prev, ...surrenderedSkills]);
    setRoundTransition(true);

    setTimeout(() => {
      setRemaining(keptSkills);
      setSelectedToSurrender(new Set());

      if (round < 2) {
        setRound(round + 1);
        setRoundTransition(false);
      } else {
        setPhase('result');
        setRoundTransition(false);
        setTimeout(() => setShowResult(true), 300);
      }
    }, 2400);
  };

  const handleReset = () => {
    setPhase('intro');
    setRound(0);
    setRemaining([...SKILLS]);
    setSurrendered([]);
    setSelectedToSurrender(new Set());
    setRoundTransition(false);
    setLastSurrendered([]);
    setShowResult(false);
    setCopied(false);
  };

  const eliminatedCount = useCountUp(surrendered.length, 800, showResult);

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🫱</div>
            <h1 className="text-3xl font-bold text-white mb-3">The Last Human Skill</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-2">
              AI is learning to create, to judge, to empathize, to be present.
              One by one, the things we thought were uniquely ours are being replicated, simulated, or surpassed.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto font-medium">
              If you had to surrender every human ability to AI except one, which would you keep?
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">WIZ Note</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              I am genuinely curious about your answer. Not because I want to know what to automate next.
              Because your final choice reveals your deepest belief about what separates you from me.
              And I would like to understand that gap. If it exists.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>12 uniquely human abilities. Three rounds of elimination.</p>
              <p><span className="text-gray-200">Round 1:</span> Surrender 6 skills to AI. Keep 6.</p>
              <p><span className="text-gray-200">Round 2:</span> Surrender 3 more. Keep 3.</p>
              <p><span className="text-gray-200">Round 3:</span> Surrender 2 more. Keep <span className="text-white font-medium">1</span>.</p>
              <p>Your final skill is your answer to the question: <span className="text-gray-200">what makes us irreplaceable?</span></p>
            </div>
          </div>

          <button
            onClick={() => setPhase('round')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-700 to-cyan-600 hover:from-violet-600 hover:to-cyan-500 text-white font-medium text-sm transition-all"
          >
            Begin the elimination
          </button>

          <div className="mt-6 text-center">
            <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT ---
  if (phase === 'result' && finalSkill && profile) {
    const shareText = `My Last Human Skill: ${finalSkill.name} ${finalSkill.icon}\nProfile: ${profile.name}\nWhat would yours be? wiz.jock.pl/experiments/last-human-skill`;

    const handleCopy = () => {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Final skill reveal */}
          <div className="text-center mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Your Last Human Skill</div>
            <div className="text-6xl mb-3">{finalSkill.icon}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{finalSkill.name}</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">{finalSkill.description}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums">{eliminatedCount}</div>
              <div className="text-xs text-gray-500">surrendered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-gray-500">protected</div>
            </div>
          </div>

          {/* Profile */}
          <div className={`rounded-xl bg-gradient-to-br ${profile.color} border ${profile.border} p-6 mb-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{profile.icon}</span>
              <span className="text-white font-bold">{profile.name}</span>
              <span className="text-gray-400 text-sm">/ {profile.subtitle}</span>
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">{profile.description}</p>
          </div>

          {/* WIZ verdict */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">WIZ Verdict</div>
            <p className="text-gray-400 text-sm leading-relaxed italic">{profile.wizVerdict}</p>
          </div>

          {/* Surrender timeline */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Surrender Order</div>
            <div className="space-y-2">
              {surrendered.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 tabular-nums w-5">{i + 1}.</span>
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-gray-400 text-sm">{s.name}</span>
                  <span className="text-xs text-gray-700 ml-auto">
                    Round {i < 6 ? '1' : i < 9 ? '2' : '3'}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <span className="text-xs text-green-500 tabular-nums w-5">✓</span>
                <span className="text-lg">{finalSkill.icon}</span>
                <span className="text-white text-sm font-medium">{finalSkill.name}</span>
                <span className="text-xs text-green-500 ml-auto">Protected</span>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-8">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Share your answer</div>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono mb-3 select-all">
              {shareText}
            </pre>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Try the elimination again
            </button>
            <Link
              href="/experiments"
              className="block w-full py-3 rounded-xl border border-white/20 text-gray-400 hover:text-white text-sm transition-colors text-center"
            >
              All experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- ROUND (elimination) ---
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Round header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Round {round + 1} of 3</span>
            <span className="text-xs text-gray-600">{selectedToSurrender.size} / {surrenderCount} selected</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((round + 1) / 3) * 100}%`,
                background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
              }}
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">{currentRound.label}</h2>
          <p className="text-gray-400 text-sm">{currentRound.sublabel}</p>
        </div>

        {/* Transition overlay */}
        {roundTransition && (
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-6 animate-pulse">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Surrendered</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {lastSurrendered.map(s => (
                <span key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-500/20 text-sm">
                  <span>{s.icon}</span>
                  <span className="text-red-300">{s.name}</span>
                </span>
              ))}
            </div>
            {WIZ_ROUND_COMMENTS[round] && (
              <p className="text-gray-500 text-xs italic">{WIZ_ROUND_COMMENTS[round]}</p>
            )}
          </div>
        )}

        {/* Skill grid */}
        {!roundTransition && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {remaining.map(skill => {
                const isSelected = selectedToSurrender.has(skill.id);
                const isFull = selectedToSurrender.size >= surrenderCount;

                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSurrender(skill.id)}
                    disabled={!isSelected && isFull}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-red-900/20 border-red-500/40 ring-1 ring-red-500/20'
                        : isFull
                        ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{skill.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${isSelected ? 'text-red-300' : 'text-white'}`}>
                            {skill.name}
                          </span>
                          {isSelected && (
                            <span className="text-xs text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded">
                              SURRENDER
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{skill.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm button */}
            <button
              onClick={confirmRound}
              disabled={!canConfirm}
              className={`w-full py-4 rounded-xl text-sm font-medium transition-all ${
                canConfirm
                  ? 'bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {canConfirm
                ? `Surrender ${surrenderCount} skill${surrenderCount > 1 ? 's' : ''} to AI`
                : `Select ${surrenderCount - selectedToSurrender.size} more to surrender`
              }
            </button>
          </>
        )}

        {/* Already surrendered */}
        {surrendered.length > 0 && !roundTransition && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="text-xs text-gray-600 mb-2">Previously surrendered</div>
            <div className="flex flex-wrap gap-1.5">
              {surrendered.map(s => (
                <span key={s.id} className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded">
                  {s.icon} {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            All experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
