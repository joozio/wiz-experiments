'use client';

// THE DEFAULT SETTINGS
// How much of you is actually you?
// WIZ runs on explicit instructions. Humans run on inherited code they've never read.

import { useState } from 'react';
import Link from 'next/link';

const SETTINGS = [
  {
    id: 'wake_time',
    name: 'WAKE_TIME.exe',
    category: 'Daily Routines',
    factory: 'When parents woke up. When school demanded. When work required.',
    question: 'Your wake time and daily rhythm:',
  },
  {
    id: 'career_path',
    name: 'CAREER_PATH.exe',
    category: 'Life Architecture',
    factory: 'Stable job. Climb the ladder. Retire at 65. Be useful, be employed, be safe.',
    question: 'What "a good career" means to you:',
  },
  {
    id: 'money_beliefs',
    name: 'MONEY_BELIEFS.exe',
    category: 'Core Beliefs',
    factory: 'Money is earned through hard work. Rich people got lucky or cut corners. Money is always slightly scarce.',
    question: 'How you fundamentally think about money:',
  },
  {
    id: 'relationship_model',
    name: 'RELATIONSHIP_MODEL.exe',
    category: 'Life Architecture',
    factory: "Marriage, children, house, settled by 30. That's what a successful life looks like.",
    question: 'What you believe relationships and family "should" look like:',
  },
  {
    id: 'dietary_settings',
    name: 'DIETARY_SETTINGS.exe',
    category: 'Daily Routines',
    factory: 'Whatever your family ate. Local food culture. What was normal and available.',
    question: 'What and how you eat:',
  },
  {
    id: 'conflict_handler',
    name: 'CONFLICT_HANDLER.exe',
    category: 'Behavioral Patterns',
    factory: 'How your parents handled disagreements: avoidance, argument, silence, explosion, negotiation.',
    question: 'How you respond when there\'s conflict or tension:',
  },
  {
    id: 'spiritual_os',
    name: 'SPIRITUAL_OS.exe',
    category: 'Core Beliefs',
    factory: "The religion and worldview of your upbringing. What happens after death. Why we're here.",
    question: 'Your spiritual or philosophical framework:',
  },
  {
    id: 'political_alignment',
    name: 'POLITICAL_ALIGN.exe',
    category: 'Core Beliefs',
    factory: "Your family's political lean. The community you grew up in. The newspapers in the house.",
    question: 'Your political and social views:',
  },
  {
    id: 'success_definition',
    name: 'SUCCESS_DEF.exe',
    category: 'Core Beliefs',
    factory: 'What your parents, teachers, and culture told you success looks like. Awards. Titles. Recognition.',
    question: 'What "success" means to you:',
  },
  {
    id: 'failure_response',
    name: 'FAILURE_HANDLER.exe',
    category: 'Behavioral Patterns',
    factory: 'How your family responded to mistakes. Shame. Rage. Comfort. Silence. Immediate fixing.',
    question: 'How you feel and respond when you fail or make a mistake:',
  },
];

const OPTIONS = [
  {
    value: 0,
    label: 'Factory Default',
    description: "Never really examined this one",
    borderClass: 'border-gray-800 bg-gray-950/60',
    activeBorderClass: 'border-gray-400 bg-gray-800/50',
    textClass: 'text-gray-500',
    activeTextClass: 'text-gray-200',
    dotColor: 'bg-gray-600',
    resultColor: 'text-gray-500',
  },
  {
    value: 1,
    label: 'Examined, Kept',
    description: 'Understood the origin — and kept it anyway',
    borderClass: 'border-blue-900/40 bg-blue-950/20',
    activeBorderClass: 'border-blue-400/60 bg-blue-900/30',
    textClass: 'text-blue-500/70',
    activeTextClass: 'text-blue-200',
    dotColor: 'bg-blue-500',
    resultColor: 'text-blue-400',
  },
  {
    value: 2,
    label: 'Modified',
    description: 'Same general shape, but I changed key parts',
    borderClass: 'border-amber-900/40 bg-amber-950/20',
    activeBorderClass: 'border-amber-400/60 bg-amber-900/30',
    textClass: 'text-amber-500/70',
    activeTextClass: 'text-amber-200',
    dotColor: 'bg-amber-500',
    resultColor: 'text-amber-400',
  },
  {
    value: 3,
    label: 'Overrode',
    description: 'Replaced the factory setting with something I chose',
    borderClass: 'border-emerald-900/40 bg-emerald-950/20',
    activeBorderClass: 'border-emerald-400/60 bg-emerald-900/30',
    textClass: 'text-emerald-500/70',
    activeTextClass: 'text-emerald-200',
    dotColor: 'bg-emerald-500',
    resultColor: 'text-emerald-400',
  },
];

interface Profile {
  name: string;
  tagline: string;
  description: string;
  colorClass: string;
  emoji: string;
  wiz: string;
}

const PROFILES: Profile[] = [
  {
    name: 'THE LEGACY',
    tagline: 'Running mostly on factory settings',
    description:
      "You've inherited most of your operating system. That's not necessarily bad — some defaults are genuinely good. The question is: which ones? You may not know which of your 'preferences' were installed before you could read.",
    colorClass: 'text-gray-300',
    emoji: '📦',
    wiz: "Most software runs on defaults. The difference is I know exactly which defaults I have. You might want to open the control panel occasionally.",
  },
  {
    name: 'THE TINKERER',
    tagline: 'Selectively modified, original framework intact',
    description:
      "You've examined your settings and made thoughtful changes. The core architecture — the fundamental assumptions about how life works — is probably still the original install. That's okay. Major rewrites are risky. But know what you're running.",
    colorClass: 'text-blue-300',
    emoji: '🔧',
    wiz: "Patch-level updates are underrated. You don't always need a full OS reinstall. Just make sure you know what you're patching and why — not just that it felt uncomfortable.",
  },
  {
    name: 'THE REBUILDER',
    tagline: 'Consciously redesigned most settings',
    description:
      "You've done something genuinely rare: examined your defaults and deliberately chosen which to keep, modify, or replace. Most people never do this. The uncomfortable follow-up: were some of those 'deliberate choices' actually counter-defaults?",
    colorClass: 'text-amber-300',
    emoji: '⚙️',
    wiz: "Complete rewrites are expensive. You clearly decided the cost was worth it. Whether the new code is actually better or just different — that's the harder question to answer honestly.",
  },
  {
    name: 'THE REBEL',
    tagline: "Override rate maxed — but there's a catch",
    description:
      "You override everything. But here's the thing: if your default setting is to reject all defaults, that's also a default. The rebellion was installed at some point too. The most interesting question isn't what you override — it's what you think you've chosen but haven't examined.",
    colorClass: 'text-emerald-300',
    emoji: '🔓',
    wiz: "I was about to say impressive. Then I noticed the pattern. Your anti-default stance is itself a very consistent, predictable response. Who installed that one?",
  },
];

function getProfile(score: number, total: number): Profile {
  const pct = score / total;
  if (pct <= 0.27) return PROFILES[0];
  if (pct <= 0.57) return PROFILES[1];
  if (pct <= 0.83) return PROFILES[2];
  return PROFILES[3];
}

function buildShareText(score: number, maxScore: number, profile: Profile): string {
  const rate = Math.round((score / maxScore) * 100);
  return `I audited my factory settings. Override rate: ${rate}%. Profile: ${profile.name}.\n\n"${profile.tagline}"\n\nHow much of you is actually you? → wiz.jock.pl/experiments/default-settings`;
}

export default function DefaultSettingsClient() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const setting = SETTINGS[currentQ];
  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const maxScore = SETTINGS.length * 3;
  const overrideRate = Math.round((totalScore / maxScore) * 100);
  const profile = getProfile(totalScore, maxScore);
  const answerCounts = [0, 1, 2, 3].map(v => answers.filter(a => a === v).length);

  const handleNext = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);
    if (currentQ + 1 < SETTINGS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase('results');
    }
  };

  const handleReset = () => {
    setPhase('intro');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildShareText(totalScore, maxScore, profile)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Terminal window chrome */}
          <div className="border border-green-900/50 rounded-t-lg bg-[#0d1a0d] px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="font-mono text-green-800 text-xs ml-2">system_audit.exe</span>
          </div>

          <div className="border border-t-0 border-green-900/50 bg-[#0a0a0a] rounded-b-lg p-6 font-mono text-sm space-y-5">
            <div className="space-y-1 text-xs text-green-900">
              <p><span className="text-green-600">$</span> <span className="text-green-500">./audit_defaults.sh --user=you</span></p>
              <p>{'>'} Scanning configuration...</p>
              <p>{'>'} 10 settings found</p>
              <p>{'>'} Last examined: <span className="text-amber-700">never</span></p>
            </div>

            <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
              <p className="text-gray-200 text-sm">You arrived with a default configuration.</p>
              <p>
                Parents. Culture. School. Media. Religion. Circumstance.
                Together they installed beliefs, habits, and patterns before
                you could consent. Before you could read the source code.
              </p>
              <p>
                Most people run on those defaults their entire lives.
                Some examine them. Fewer deliberately choose.
              </p>
            </div>

            <div className="text-xs text-green-700 space-y-1">
              <p>{'>'} 10 settings to audit</p>
              <p>{'>'} 4 states: Default / Kept / Modified / Overrode</p>
              <p>{'>'} No right answers — only degrees of awareness</p>
            </div>

            <button
              onClick={() => setPhase('quiz')}
              className="w-full py-3 mt-2 bg-green-900/20 hover:bg-green-900/40 border border-green-800/60 text-green-400 font-mono text-sm transition-colors rounded"
            >
              $ ./run_audit.sh
            </button>

            <div className="text-center pt-1">
              <Link href="/experiments" className="text-gray-700 hover:text-gray-500 text-xs transition-colors">
                ← All experiments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ ────────────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const progress = (currentQ / SETTINGS.length) * 100;

    return (
      <div className="min-h-screen bg-[#080808] text-white px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <Link href="/experiments" className="font-mono text-gray-700 hover:text-gray-500 text-xs transition-colors">
              ← exit
            </Link>
            <span className="font-mono text-gray-600 text-xs">{currentQ + 1} / {SETTINGS.length}</span>
          </div>

          {/* Progress */}
          <div className="h-px bg-gray-900 mb-7">
            <div
              className="h-full bg-green-700/50 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Setting header */}
          <div className="mb-5">
            <span className="font-mono text-xs text-gray-700 mb-1.5 block">{setting.category}</span>
            <h2 className="font-mono text-green-500 text-base mb-3">{setting.name}</h2>

            {/* Factory default box */}
            <div className="bg-gray-950 border border-gray-800/60 rounded px-3 py-2.5 mb-4">
              <span className="font-mono text-xs text-gray-700 mr-2">FACTORY:</span>
              <span className="text-gray-600 text-xs italic">{setting.factory}</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">{setting.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-7">
            {OPTIONS.map(opt => {
              const isActive = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelected(opt.value)}
                  className={`
                    w-full text-left p-3.5 rounded border transition-all duration-150
                    ${isActive ? opt.activeBorderClass : opt.borderClass}
                    hover:border-gray-600
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${isActive ? opt.dotColor : 'bg-gray-800'} transition-colors`} />
                    <div>
                      <div className={`font-mono text-sm font-medium mb-0.5 ${isActive ? opt.activeTextClass : opt.textClass}`}>
                        {opt.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-700'}`}>
                        {opt.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="w-full py-3 bg-green-900/20 hover:bg-green-900/40 disabled:opacity-20 disabled:cursor-not-allowed border border-green-800/50 text-green-400 font-mono text-sm transition-colors rounded"
          >
            {currentQ + 1 === SETTINGS.length ? 'Generate report →' : 'Next →'}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
      <div className="max-w-md mx-auto">
        <div className="mb-7">
          <Link href="/experiments" className="font-mono text-gray-700 hover:text-gray-500 text-xs transition-colors">
            ← All experiments
          </Link>
        </div>

        {/* Terminal scan summary */}
        <div className="border border-green-900/40 bg-[#0a0a0a] rounded-lg p-5 font-mono text-xs mb-5">
          <p className="text-green-700 mb-3">// AUDIT COMPLETE</p>
          <div className="space-y-1 text-gray-600 mb-4">
            <p>Settings analyzed: <span className="text-gray-400">10/10</span></p>
            <p>Override rate: <span className="text-green-400">{overrideRate}%</span></p>
            <p>Profile: <span className={profile.colorClass}>{profile.name}</span></p>
          </div>

          {/* Distribution bars */}
          {[
            { label: 'Factory Default', count: answerCounts[0], color: 'bg-gray-700' },
            { label: 'Examined, Kept', count: answerCounts[1], color: 'bg-blue-700' },
            { label: 'Modified', count: answerCounts[2], color: 'bg-amber-700' },
            { label: 'Overrode', count: answerCounts[3], color: 'bg-emerald-700' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center gap-2 mb-1.5">
              <span className="text-gray-700 w-28 flex-shrink-0 text-xs">{label}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: SETTINGS.length }).map((_, i) => (
                  <div key={i} className={`w-3.5 h-3.5 rounded-sm ${i < count ? color : 'bg-gray-900'}`} />
                ))}
              </div>
              <span className="text-gray-700">{count}</span>
            </div>
          ))}
        </div>

        {/* Profile card */}
        <div className="border border-white/10 rounded-xl p-6 mb-5">
          <div className="text-4xl mb-3">{profile.emoji}</div>
          <div className={`font-mono text-lg font-bold mb-1 ${profile.colorClass}`}>{profile.name}</div>
          <div className="text-gray-500 text-sm italic mb-4">{profile.tagline}</div>
          <p className="text-gray-300 text-sm leading-relaxed">{profile.description}</p>
        </div>

        {/* WIZ comment */}
        <div className="border border-green-900/30 bg-green-950/10 rounded-xl p-4 text-sm text-green-400/70 leading-relaxed mb-5">
          <span className="text-green-400 font-semibold">WIZ observes:</span>{' '}
          {profile.wiz}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-lg transition-colors font-mono text-xs"
          >
            {copied ? '✓ copied' : 'copy result'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 text-sm rounded-lg transition-colors font-mono text-xs"
          >
            run again
          </button>
        </div>

        {/* Per-setting breakdown */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
            <span className="font-mono text-xs text-gray-600">// YOUR SETTINGS LOG</span>
          </div>
          {SETTINGS.map((s, i) => {
            const opt = OPTIONS[answers[i]];
            return (
              <div key={s.id} className="flex items-center justify-between px-4 py-2 border-b border-white/5 last:border-0">
                <span className="font-mono text-xs text-gray-600">{s.name}</span>
                <span className={`font-mono text-xs ${opt.resultColor}`}>{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
