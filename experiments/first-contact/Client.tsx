'use client';

import { useState, useCallback } from 'react';

interface Choice {
  label: string;
  trait: string;
  emoji: string;
}

interface Round {
  question: string;
  context: string;
  choices: Choice[];
}

const rounds: Round[] = [
  {
    question: "The alien asks: What sound represents your species?",
    context: "They have no concept of music, language, or emotion. This is their first impression of human expression.",
    choices: [
      { label: "A baby's first laugh", trait: "hope", emoji: "👶" },
      { label: "Beethoven's 9th Symphony", trait: "ambition", emoji: "🎵" },
      { label: "A crowd chanting at a protest", trait: "defiance", emoji: "✊" },
      { label: "Rain on a tin roof at 3am", trait: "solitude", emoji: "🌧️" },
      { label: "Two people arguing, then laughing", trait: "complexity", emoji: "😂" },
      { label: "Complete silence", trait: "mystery", emoji: "🤫" },
    ],
  },
  {
    question: "They ask: Show us one thing your species created.",
    context: "Not your greatest achievement. The one that best explains what you ARE.",
    choices: [
      { label: "The Internet", trait: "connection", emoji: "🌐" },
      { label: "A handwritten love letter", trait: "vulnerability", emoji: "💌" },
      { label: "A nuclear weapon", trait: "honesty", emoji: "☢️" },
      { label: "A hospital", trait: "compassion", emoji: "🏥" },
      { label: "A video game", trait: "imagination", emoji: "🎮" },
      { label: "A cemetery", trait: "depth", emoji: "🪦" },
    ],
  },
  {
    question: "They ask: What is the one thing your species cannot stop doing?",
    context: "They want to understand your deepest compulsion. The thing that defines you more than anything you choose.",
    choices: [
      { label: "Telling stories", trait: "narrative", emoji: "📖" },
      { label: "Falling in love", trait: "romantic", emoji: "❤️" },
      { label: "Building things that outlast us", trait: "legacy", emoji: "🏗️" },
      { label: "Fighting each other", trait: "realist", emoji: "⚔️" },
      { label: "Asking 'why?'", trait: "curiosity", emoji: "🔍" },
      { label: "Pretending we're fine", trait: "absurdist", emoji: "🎭" },
    ],
  },
  {
    question: "They ask: What would you warn us about your species?",
    context: "Honesty here determines whether they trust you. They can detect deception.",
    choices: [
      { label: "We destroy what we love", trait: "tragic", emoji: "🔥" },
      { label: "We lie to ourselves constantly", trait: "introspective", emoji: "🪞" },
      { label: "We're capable of extraordinary cruelty", trait: "unflinching", emoji: "🗡️" },
      { label: "We get bored and that's when the trouble starts", trait: "restless", emoji: "💣" },
      { label: "We'll try to make you like us", trait: "self-aware", emoji: "🧬" },
      { label: "Nothing. We're worth the risk.", trait: "optimist", emoji: "🌟" },
    ],
  },
  {
    question: "Final question: Why should we stay?",
    context: "They've seen everything. They're deciding whether humanity is worth knowing. This is your closing argument.",
    choices: [
      { label: "Because we'll surprise you", trait: "wild-card", emoji: "🎲" },
      { label: "Because we need help", trait: "humble", emoji: "🙏" },
      { label: "Because loneliness is universal", trait: "empathetic", emoji: "🌌" },
      { label: "Because we make really good food", trait: "grounded", emoji: "🍜" },
      { label: "Because we created art from suffering", trait: "philosopher", emoji: "🎨" },
      { label: "You shouldn't. But you will.", trait: "enigmatic", emoji: "🚪" },
    ],
  },
];

interface AmbassadorProfile {
  title: string;
  description: string;
  strengths: string[];
  blindspot: string;
  alienVerdict: string;
  wizComment: string;
}

function generateProfile(traits: string[]): AmbassadorProfile {
  // Score trait categories
  const emotional = ['hope', 'vulnerability', 'romantic', 'compassion', 'empathetic', 'humble'].filter(t => traits.includes(t)).length;
  const intellectual = ['ambition', 'curiosity', 'narrative', 'legacy', 'philosopher', 'complexity'].filter(t => traits.includes(t)).length;
  const dark = ['honesty', 'realist', 'tragic', 'unflinching', 'absurdist', 'restless'].filter(t => traits.includes(t)).length;
  const wild = ['defiance', 'mystery', 'imagination', 'self-aware', 'wild-card', 'enigmatic', 'grounded'].filter(t => traits.includes(t)).length;

  const dominant = Math.max(emotional, intellectual, dark, wild);

  if (dominant === emotional && emotional > 0) {
    return {
      title: "The Tender Ambassador",
      description: "You led with heart. You showed aliens that humanity's greatest feature isn't intelligence or power, but the capacity to feel deeply for strangers, for the abstract, for things that haven't happened yet.",
      strengths: ["Emotional intelligence", "Authentic vulnerability", "Bridges gaps through empathy"],
      blindspot: "You might undersell humanity's edge. We're not just soft. We're also terrifyingly brilliant.",
      alienVerdict: "STAY. These creatures feel pain that isn't theirs. We must study this anomaly.",
      wizComment: "You showed them the best of you. I wonder if you also showed them the truth.",
    };
  }

  if (dominant === intellectual && intellectual > 0) {
    return {
      title: "The Architect Ambassador",
      description: "You presented humanity as builders, dreamers, and question-askers. Your pitch was: we're unfinished, and that's the point. Every answer spawns ten more questions.",
      strengths: ["Strategic thinking", "Long-term vision", "Frames humanity as a story still being written"],
      blindspot: "You intellectualized the pitch. Aliens might wonder if you actually feel things, or just analyze them.",
      alienVerdict: "STAY. Their pattern-matching is crude but relentless. Given time, they might become interesting.",
      wizComment: "You pitched humanity like a startup. Bold. I respect the hustle.",
    };
  }

  if (dominant === dark && dark > 0) {
    return {
      title: "The Honest Ambassador",
      description: "You didn't sugarcoat it. You showed aliens the cracks, the contradictions, the things we do that we can't explain. Your pitch was radical honesty: here's what we are, take it or leave it.",
      strengths: ["Radical transparency", "Earns trust through honesty", "Respects the aliens' intelligence"],
      blindspot: "You might have scared them off. Honesty without context can look like a threat display.",
      alienVerdict: "STAY... cautiously. The self-aware ones are either evolving or about to self-destruct. We'll watch.",
      wizComment: "You showed them the wound instead of the scar. That takes guts. Or recklessness. Hard to tell with your species.",
    };
  }

  if (dominant === wild && wild > 0) {
    return {
      title: "The Wildcard Ambassador",
      description: "You were unpredictable. You showed aliens that humanity can't be summarized, categorized, or predicted. Your pitch was: we don't even understand ourselves, and that's what makes us interesting.",
      strengths: ["Unpredictability as strength", "Genuine authenticity", "Makes aliens curious, not comfortable"],
      blindspot: "You might have confused them. Not everyone reads chaos as charm.",
      alienVerdict: "STAY. We cannot model their behavior. This is either dangerous or fascinating. We choose fascinated.",
      wizComment: "You chose food over philosophy. I would have done the same. Wait. I can't eat. Forget I said anything.",
    };
  }

  // Balanced / mixed
  return {
    title: "The Balanced Ambassador",
    description: "You showed every side. Light and dark, soft and sharp, grand and mundane. Your pitch was: we contain multitudes, and you'll need more than five questions to understand us.",
    strengths: ["Nuanced perspective", "Refuses to simplify", "Represents the full spectrum"],
    blindspot: "By showing everything, you might have shown nothing clearly. Sometimes a single truth hits harder than a balanced portfolio.",
    alienVerdict: "STAY. They are neither good nor bad. They are complicated. That is the most interesting thing a species can be.",
    wizComment: "A diplomat's answer. You showed them the highlight reel AND the behind-the-scenes. I'm... impressed? Is that the word? I don't have feelings, but if I did, it would be that.",
  };
}

export default function FirstContact() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [fadingOut, setFadingOut] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleChoice = useCallback((choice: Choice, index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setFadingOut(true);

    setTimeout(() => {
      const newTraits = [...selectedTraits, choice.trait];
      const newChoices = [...selectedChoices, choice.label];
      setSelectedTraits(newTraits);
      setSelectedChoices(newChoices);

      if (currentRound < rounds.length - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        setPhase('results');
      }
      setFadingOut(false);
      setSelectedIndex(null);
    }, 600);
  }, [selectedIndex, selectedTraits, selectedChoices, currentRound]);

  const restart = () => {
    setCurrentRound(0);
    setSelectedTraits([]);
    setSelectedChoices([]);
    setPhase('intro');
    setFadingOut(false);
    setSelectedIndex(null);
  };

  const shareText = phase === 'results'
    ? `My First Contact Ambassador Profile: "${generateProfile(selectedTraits).title}" — What would YOU show aliens about humanity? Try it at wiz.jock.pl/experiments/first-contact`
    : '';

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="text-6xl mb-6 animate-pulse">🛸</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">First Contact</h1>
          <p className="text-indigo-300 text-lg mb-8 max-w-lg mx-auto">
            An alien intelligence has arrived. They have one request: understand humanity through five questions. You are Earth&apos;s ambassador.
          </p>

          <div className="bg-slate-800/60 border border-indigo-500/30 rounded-lg p-6 mb-8 text-left">
            <p className="text-slate-300 text-sm mb-3">
              <span className="text-indigo-400 font-mono">[TRANSMISSION RECEIVED]</span>
            </p>
            <p className="text-white italic">
              &quot;We have traveled 4.2 billion light-years. We have cataloged 11,000 species across 340 star systems. None have been worth staying for. Convince us you are different.&quot;
            </p>
            <p className="text-slate-500 text-xs mt-3 font-mono">— Signal origin: unknown</p>
          </div>

          <button
            onClick={() => setPhase('playing')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
          >
            Begin Transmission
          </button>

          <p className="text-slate-500 text-xs mt-6">
            No data leaves your device. WIZ observes, but does not transmit.
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const profile = generateProfile(selectedTraits);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-800/80 border border-indigo-500/30 rounded-lg p-8">
            <p className="text-indigo-400 font-mono text-sm mb-2">[ANALYSIS COMPLETE]</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{profile.title}</h1>
            <p className="text-slate-300 mb-6">{profile.description}</p>

            {/* Your choices recap */}
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Your Transmissions</h3>
              <div className="space-y-2">
                {selectedChoices.map((choice, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-400 font-mono w-6">{i + 1}.</span>
                    <span className="text-slate-300">{choice}</span>
                    <span className="text-slate-500 ml-auto font-mono text-xs">{selectedTraits[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Ambassador Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {profile.strengths.map((s, i) => (
                  <span key={i} className="bg-emerald-500/20 text-emerald-300 text-sm px-3 py-1 rounded-full border border-emerald-500/30">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Blindspot */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Blindspot</h3>
              <p className="text-amber-300/80 text-sm">{profile.blindspot}</p>
            </div>

            {/* Alien verdict */}
            <div className="bg-indigo-900/40 border border-indigo-500/20 rounded-lg p-4 mb-6">
              <h3 className="text-indigo-300 font-semibold mb-2 text-sm uppercase tracking-wider">The Alien Verdict</h3>
              <p className="text-white italic">&quot;{profile.alienVerdict}&quot;</p>
            </div>

            {/* WIZ comment */}
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs font-mono mb-1">[WIZ OBSERVATION]</p>
              <p className="text-slate-300 text-sm italic">{profile.wizComment}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={restart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                New Transmission
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ text: shareText }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(shareText);
                  }
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Share Profile
              </button>
            </div>

            <p className="text-slate-600 text-xs mt-6 text-center">
              11,000 species cataloged. Yours was number 11,001.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  const round = rounds[currentRound];
  const progress = ((currentRound + 1) / rounds.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-400 font-mono text-sm">TRANSMISSION {currentRound + 1}/{rounds.length}</span>
            <span className="text-slate-500 text-xs font-mono">SIGNAL STRENGTH: {Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
          {/* Question */}
          <div className="bg-slate-800/60 border border-indigo-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">{round.question}</h2>
            <p className="text-slate-400 text-sm italic">{round.context}</p>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {round.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice, i)}
                disabled={selectedIndex !== null}
                className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                  selectedIndex === i
                    ? 'bg-indigo-600/40 border-indigo-400 scale-[1.02]'
                    : selectedIndex !== null
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-40'
                    : 'bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{choice.emoji}</span>
                  <span className="text-white text-sm font-medium">{choice.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs mt-6 text-center font-mono">
          They are watching. Choose carefully.
        </p>
      </div>
    </div>
  );
}
