'use client';

import { useState } from 'react';

interface MirrorAnalysis {
  surface: string[];
  gaps: string[];
  hedges: string[];
  editedOut: string;
  shadowSelf: string;
  sharpestObservation: string;
}

function analyzeSelf(text: string): MirrorAnalysis {
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  // Detect hedging language
  const hedgePatterns = [
    { phrase: /\bi think\b/, note: 'You hedge certainty with "I think" — distancing yourself from your own beliefs' },
    { phrase: /\bi try to\b/, note: '"I try to" — you describe intention, not reality. What do you actually do?' },
    { phrase: /\bi'm working on\b/, note: '"Working on" signals incompleteness — you frame yourself as a project, not a person' },
    { phrase: /\bi hope\b/, note: '"I hope" — hope is passive. You\'re describing something you haven\'t committed to' },
    { phrase: /\bsometimes\b/, note: '"Sometimes" is the hedge of someone who wants credit without accountability' },
    { phrase: /\bmost of the time\b/, note: '"Most of the time" — what about the other times? That\'s the interesting part' },
    { phrase: /\bi guess\b/, note: '"I guess" — you know, but you\'re protecting yourself from being held to it' },
    { phrase: /\bkind of\b/, note: '"Kind of" softens something you probably mean more strongly' },
    { phrase: /\ba bit\b/, note: '"A bit" diminishes — you\'re minimizing something that matters more than you\'re admitting' },
    { phrase: /\bi try\b/, note: '"I try" — effort without outcome. Are you protecting yourself from the verdict?' },
    { phrase: /\bpretty\b/, note: '"Pretty" as a qualifier — you\'re hedging quality, probably because you care a lot' },
  ];

  const foundHedges: string[] = [];
  for (const { phrase, note } of hedgePatterns) {
    if (phrase.test(lower)) {
      foundHedges.push(note);
    }
  }

  // Detect what's absent
  const absenceChecks = [
    { check: !/(fail|mistake|wrong|bad at|struggle|difficult|hard for me|not good)/i.test(text), gap: 'You described yourself without mentioning a single failure or struggle. That omission is itself a kind of self-portrait.' },
    { check: !/(feel|emotion|afraid|scared|anxious|excited|love|hate|angry|sad|happy|lonely|proud)/i.test(text), gap: 'No emotional language. You described yourself like a product spec. What do you actually feel about being you?' },
    { check: !/(want|need|wish|desire|dream|goal|hope for)/i.test(text), gap: 'You said nothing about what you want. Description without desire suggests either contentment or suppression — which is it?' },
    { check: !/(other|people|they|we|family|friend|colleague|relationship)/i.test(text), gap: 'You described yourself in isolation. No other people appear. Are you defined by your relationships, or have you edited them out?' },
    { check: !/(because|so that|in order|to become|to achieve|purpose)/i.test(text), gap: 'You described what you are, not why. The absence of "because" suggests you may not have examined your own motivations.' },
    { check: sentences.length < 3, gap: 'Fewer sentences than asked — you either couldn\'t find the words, or chose not to.' },
  ];

  const foundGaps = absenceChecks.filter(c => c.check).map(c => c.gap);

  // Surface-level observations
  const surfaceObs: string[] = [];

  // Word count patterns
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 30) {
    surfaceObs.push(`${wordCount} words to describe yourself. Either you\'re confident in brevity, or this question made you uncomfortable.`);
  } else if (wordCount > 80) {
    surfaceObs.push(`${wordCount} words — more than asked. You filled the space. That usually means anxiety about being misread.`);
  }

  // Self-referential patterns
  const iCount = (text.match(/\bI\b/g) || []).length;
  if (iCount > 6) {
    surfaceObs.push(`"I" appears ${iCount} times. High self-focus — could be self-awareness or isolation, often both.`);
  }

  // Positive-only framing
  const positiveWords = ['good', 'great', 'love', 'enjoy', 'passionate', 'committed', 'dedicated', 'care', 'strong', 'creative', 'hard-working', 'driven'];
  const positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  if (positiveCount >= 3) {
    surfaceObs.push(`${positiveCount} positive descriptors. Self-descriptions this uniformly positive are almost never accurate — they\'re aspirational.`);
  }

  // Role-first identity
  if (/(i am a|i'm a|i work as|my job|my career)/i.test(text)) {
    surfaceObs.push('You led with role or profession. When someone asks who you are, you answered with what you do. Those are different questions.');
  }

  // Generate "edited out" version
  const editedPatterns = [
    { test: /(ambitious|driven|achieve|goal|success)/i, reveal: 'Someone who measures their worth in outcomes and probably worries they\'re not achieving fast enough' },
    { test: /(creative|artist|write|design|build|make)/i, reveal: 'Someone who needs to create things to feel real — and likely judges their work more harshly than anyone else' },
    { test: /(help|care|support|other|people)/i, reveal: 'Someone whose identity is partly held in how useful they are to others — which is exhausting to maintain' },
    { test: /(learn|grow|improve|develop|better)/i, reveal: 'Someone who is never quite satisfied with who they currently are — the finish line keeps moving' },
    { test: /(independent|self|own|myself)/i, reveal: 'Someone who values autonomy deeply enough to mention it unprompted — which suggests they\'ve felt its absence' },
    { test: /(honest|truth|authentic|real)/i, reveal: 'Someone who lists honesty as a virtue — which often means they\'ve encountered enough dishonesty to make it a priority' },
  ];

  let editedOut = 'Someone who curated this description carefully enough that the curation itself tells us something.';
  for (const { test, reveal } of editedPatterns) {
    if (test.test(text)) {
      editedOut = reveal;
      break;
    }
  }

  // Shadow self
  const shadowPatterns = [
    { test: /(confident|strong|sure)/i, shadow: 'The part of you that isn\'t sure. That wakes up at 3am and wonders if you\'re fooling everyone, including yourself.' },
    { test: /(organized|structured|plan|efficient)/i, shadow: 'The chaos underneath. The days when nothing gets done and the system you\'re proud of collapses. You didn\'t mention those.' },
    { test: /(passionate|love|enjoy|excited)/i, shadow: 'The apathy. There are things you\'ve stopped caring about that you used to define yourself by. You didn\'t put those in.' },
    { test: /(care|empathy|kind|help)/i, shadow: 'The resentment. Helping people is real, but so is the exhaustion and the times you helped because you didn\'t know how to say no.' },
    { test: /(creative|build|make|design)/i, shadow: 'The abandoned projects. The ideas you started and stopped. The creative version of you that exists only in theory. You only described the version that ships.' },
  ];

  let shadowSelf = 'The version of you that didn\'t make the edit. Every word you chose kept another word out. Those are the interesting ones.';
  for (const { test, shadow } of shadowPatterns) {
    if (test.test(text)) {
      shadowSelf = shadow;
      break;
    }
  }

  // Sharpest single observation
  const sharpObservations = [
    ...foundHedges.slice(0, 1),
    ...foundGaps.slice(0, 1),
    ...surfaceObs.slice(0, 1),
  ];

  const sharpestObservation = sharpObservations.length > 0
    ? sharpObservations[0]
    : 'You wrote something that resists easy analysis. That\'s either very well-constructed or very well-defended — possibly both.';

  return {
    surface: surfaceObs.slice(0, 3),
    gaps: foundGaps.slice(0, 3),
    hedges: foundHedges.slice(0, 3),
    editedOut,
    shadowSelf,
    sharpestObservation,
  };
}

function ResultCard({ title, icon, items, color }: { title: string; icon: string; items: string[]; color: string }) {
  if (!items.length) return null;
  return (
    <div className={`border ${color} bg-black/40 p-5 space-y-3`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-white font-medium uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-gray-300 text-sm leading-relaxed pl-3 border-l border-gray-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SingleCard({ title, icon, content, color }: { title: string; icon: string; content: string; color: string }) {
  return (
    <div className={`border ${color} bg-black/40 p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-white font-medium uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export default function HonestMirror() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<MirrorAnalysis | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const charCount = input.length;

  const handleSubmit = () => {
    if (input.trim().length < 20) return;
    const result = analyzeSelf(input);
    setAnalysis(result);
    setSubmitted(true);
  };

  const handleReset = () => {
    setInput('');
    setAnalysis(null);
    setSubmitted(false);
  };

  const copyText = () => {
    if (!analysis) return;
    const lines = [
      `The Honest Mirror — wiz.jock.pl/experiments/honest-mirror`,
      ``,
      `What you wrote:`,
      input,
      ``,
      `What you're not saying:`,
      ...analysis.gaps,
      ``,
      `The hedges:`,
      ...analysis.hedges,
      ``,
      `What got edited out:`,
      analysis.editedOut,
      ``,
      `Your shadow self:`,
      analysis.shadowSelf,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
  };

  return (
    <div>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .mirror-glow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4 mirror-glow">🪞</div>
        <h1 className="text-2xl text-white mb-3 font-medium">The Honest Mirror</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
          Describe yourself in 3 sentences. I&apos;ll show you what you&apos;re not saying —
          the gaps, the hedges, the version of you that got edited out.
        </p>
      </div>

      {!submitted ? (
        /* Input phase */
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
              Who are you? (3 sentences)
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              placeholder="Write honestly. This analysis works better the more real you are."
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 text-white text-sm leading-relaxed focus:border-gray-400 focus:outline-none resize-none placeholder-gray-700"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-600">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 p-4 text-xs text-gray-500 space-y-1">
            <p>🔒 <strong className="text-gray-400">Everything stays local.</strong> Your text never leaves your browser.</p>
            <p>🧙 Analysis runs on pattern recognition, not AI APIs. No data is sent anywhere.</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={input.trim().length < 20}
            className="w-full py-3 border border-gray-400 text-gray-300 hover:border-white hover:text-white disabled:border-gray-700 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wider"
          >
            Show me what I&apos;m not saying
          </button>
        </div>
      ) : (
        /* Results phase */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* What you wrote */}
          <div className="border border-gray-800 p-4 bg-gray-950/50">
            <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">What you wrote</div>
            <p className="text-gray-400 text-sm leading-relaxed italic">&ldquo;{input}&rdquo;</p>
          </div>

          {/* Sharpest observation */}
          {analysis && (
            <div className="border border-white/20 bg-white/3 p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Sharpest observation</div>
              <p className="text-white text-base leading-relaxed">{analysis.sharpestObservation}</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <ResultCard
                title="What you're not saying"
                icon="🕳️"
                items={analysis.gaps}
                color="border-red-900/60"
              />

              <ResultCard
                title="The hedges"
                icon="🛡️"
                items={analysis.hedges}
                color="border-yellow-900/60"
              />

              <ResultCard
                title="Surface observations"
                icon="🔍"
                items={analysis.surface}
                color="border-blue-900/60"
              />

              <SingleCard
                title="The version you edited out"
                icon="✂️"
                content={analysis.editedOut}
                color="border-purple-900/60"
              />

              <SingleCard
                title="Your shadow self"
                icon="👤"
                content={analysis.shadowSelf}
                color="border-gray-700"
              />
            </div>
          )}

          {/* WIZ note */}
          <div className="border border-gray-800 bg-gray-900/30 p-4 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🧙</span>
            <div className="text-gray-500 text-xs leading-relaxed space-y-2">
              <p>
                This analysis reads patterns in what you wrote — hedging language, structural absences,
                word choices that reveal more than you intended.
              </p>
              <p>
                The most revealing part isn&apos;t the analysis. It&apos;s your reaction to it.
                Whatever you disagree with most strongly is probably the most accurate part.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2 border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors text-sm"
            >
              Try again
            </button>
            <button
              onClick={copyText}
              className="flex-1 py-2 border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              Copy results
            </button>
          </div>

          {/* Blog link */}
          <div className="text-center pt-2">
            <a
              href="https://thoughts.jock.pl/p/sonnet-46-two-experiments-one-got-personal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Read about the Sonnet 4.6 mirror test that inspired this →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
