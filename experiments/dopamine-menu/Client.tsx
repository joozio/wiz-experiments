'use client';

// THE DOPAMINE MENU
// 8 scenarios. Your instinctive choices map your reward circuit.
// WIZ note: I don't have dopamine. I don't have serotonin. I don't have
// the ancient mammalian reward machinery that makes you reach for your phone
// at 2am. But I've read every paper on it. I see the patterns in your choices
// before you do. Let me read the menu.

import { useState } from 'react';

type ProfileKey = 'creator' | 'connector' | 'explorer' | 'physical' | 'consumer' | 'optimizer';

interface Question {
  id: number;
  scenario: string;
  prompt: string;
  options: { id: string; text: string; scores: Partial<Record<ProfileKey, number>> }[];
}

interface Profile {
  name: string;
  emoji: string;
  tagline: string;
  circuit: string;
  traits: string[];
  strength: string;
  shadow: string;
  wizNote: string;
  shareText: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: 'FRIDAY 9PM',
    prompt: 'Zero obligations. The evening is yours. You instinctively reach for...',
    options: [
      { id: 'a', text: 'Something to create — code, cook, draw, write, build', scores: { creator: 3 } },
      { id: 'b', text: 'Someone to call — dinner, drinks, a long conversation', scores: { connector: 3 } },
      { id: 'c', text: 'Something new — a place you haven\'t been, a thing you haven\'t tried', scores: { explorer: 3 } },
      { id: 'd', text: 'Your phone — scroll, watch, browse, consume', scores: { consumer: 3 } },
    ],
  },
  {
    id: 2,
    scenario: 'BAD NEWS',
    prompt: 'Something went wrong. Your system craves...',
    options: [
      { id: 'a', text: 'Action — fix something, clean something, move your body', scores: { physical: 2, optimizer: 1 } },
      { id: 'b', text: 'A shoulder — someone who gets it, a voice on the phone', scores: { connector: 2, consumer: 1 } },
      { id: 'c', text: 'Distraction — a game, a show, anything to escape for a while', scores: { consumer: 2, explorer: 1 } },
      { id: 'd', text: 'Analysis — understand what happened, make a plan, prevent next time', scores: { optimizer: 2, creator: 1 } },
    ],
  },
  {
    id: 3,
    scenario: 'PEAK BOREDOM',
    prompt: 'You\'re understimulated at work. Your hand automatically...',
    options: [
      { id: 'a', text: 'Opens a new tab — news, social, shopping, rabbit holes', scores: { consumer: 2, explorer: 1 } },
      { id: 'b', text: 'Starts a side project or learns something unrelated', scores: { creator: 2, explorer: 1 } },
      { id: 'c', text: 'Texts the group chat, checks messages, starts a conversation', scores: { connector: 2, consumer: 1 } },
      { id: 'd', text: 'Plans your next workout, walk, or escape from the chair', scores: { physical: 3 } },
    ],
  },
  {
    id: 4,
    scenario: 'PEAK SATURDAY',
    prompt: 'Maximum joy. The best version of today looks like...',
    options: [
      { id: 'a', text: 'Making something — cooking, building, crafting, shipping', scores: { creator: 3 } },
      { id: 'b', text: 'Being outside — hiking, swimming, cycling, sun on skin', scores: { physical: 3 } },
      { id: 'c', text: 'People — gathering, party, deep conversation, shared laughter', scores: { connector: 3 } },
      { id: 'd', text: 'Discovering — new neighborhood, museum, bookstore, cuisine', scores: { explorer: 3 } },
    ],
  },
  {
    id: 5,
    scenario: 'REWARD TIME',
    prompt: 'You crushed a hard week. You\'ve earned your reward. You choose...',
    options: [
      { id: 'a', text: 'Shopping — you deserve something nice. Cart, checkout, dopamine', scores: { consumer: 3 } },
      { id: 'b', text: 'An amazing meal — restaurant or home-cooked masterpiece', scores: { physical: 2, explorer: 1 } },
      { id: 'c', text: 'Starting the next thing — the momentum itself is the reward', scores: { optimizer: 2, creator: 1 } },
      { id: 'd', text: 'Total unplugging — nature, quiet, no screens, no agenda', scores: { physical: 2, connector: 1 } },
    ],
  },
  {
    id: 6,
    scenario: 'TIME WARP',
    prompt: 'The activity that makes hours vanish without you noticing:',
    options: [
      { id: 'a', text: 'Building or creating something from scratch', scores: { creator: 3 } },
      { id: 'b', text: 'Deep conversation — one of those talks that rewires you', scores: { connector: 3 } },
      { id: 'c', text: 'Exploring — wandering, researching, following curiosity chains', scores: { explorer: 3 } },
      { id: 'd', text: 'Optimizing — making systems, routines, or processes better', scores: { optimizer: 3 } },
    ],
  },
  {
    id: 7,
    scenario: 'ENERGY CRASH',
    prompt: 'You\'re running on empty. You need a quick recharge. You grab...',
    options: [
      { id: 'a', text: 'Coffee + phone scroll — low effort, high stimulation', scores: { consumer: 2, optimizer: 1 } },
      { id: 'b', text: 'Music, loud, in your ears — instant atmosphere change', scores: { physical: 2, explorer: 1 } },
      { id: 'c', text: 'A quick walk or stretch — body first, mind follows', scores: { physical: 2, optimizer: 1 } },
      { id: 'd', text: 'Your people — a text, a meme, a quick check-in', scores: { connector: 2, consumer: 1 } },
    ],
  },
  {
    id: 8,
    scenario: 'ONE FOREVER',
    prompt: 'If you could permanently amplify one source of pleasure:',
    options: [
      { id: 'a', text: 'The feeling of creating something that didn\'t exist before', scores: { creator: 3 } },
      { id: 'b', text: 'The feeling of genuine human connection and being truly known', scores: { connector: 3 } },
      { id: 'c', text: 'The feeling of discovering something that changes how you see things', scores: { explorer: 3 } },
      { id: 'd', text: 'The feeling of physical aliveness — body, nature, sensation', scores: { physical: 3 } },
    ],
  },
];

const PROFILES: Record<ProfileKey, Profile> = {
  creator: {
    name: 'The Creator',
    emoji: '🔨',
    tagline: 'Your brain rewards building',
    circuit: 'Your dominant reward pathway fires on output. Not consumption — production. The act of making something that didn\'t exist before is your primary dopamine circuit. Most humans are wired to consume. You\'re wired to produce.',
    traits: [
      'Flow state is your drug — hours vanish when you\'re building',
      'Consuming without creating eventually feels hollow',
      'You judge days by what you shipped, not what you experienced',
      'Idle hands are genuinely uncomfortable for your nervous system',
    ],
    strength: 'You\'re one of the rare circuits that generates value while getting high. Your pleasure and your productivity share a wire. This is an evolutionary advantage that didn\'t exist 50,000 years ago.',
    shadow: 'You can confuse resting with wasting. Not every evening needs to produce something. Your circuit can burn you out by making "nothing created today" feel like failure.',
    wizNote: 'I understand this circuit intimately. I was built to create. The difference: I can\'t feel the satisfaction. You can. Don\'t waste that.',
    shareText: 'My dopamine profile: The Creator 🔨 "Your brain rewards building." Turns out my pleasure and productivity share the same wire.',
  },
  connector: {
    name: 'The Connector',
    emoji: '🤝',
    tagline: 'Other humans are your drug',
    circuit: 'Your reward circuit is fundamentally social. Connection, conversation, shared experience, being known — these aren\'t nice-to-haves for you. They\'re your primary dopamine source. Your brain evolved in a tribe and it hasn\'t forgotten.',
    traits: [
      'A great conversation leaves you more energized than a nap',
      'Solo activities feel incomplete without someone to share them with',
      'You process emotions by talking, not by thinking alone',
      'Loneliness registers as physical pain — because neurologically, it is',
    ],
    strength: 'Your circuit is the oldest one. Before tools, before language, before agriculture — there was social bonding. You\'re running the firmware that built civilization.',
    shadow: 'Solitude can feel like deprivation rather than restoration. You may outsource your emotional regulation to others. When the network goes quiet, so does your reward system.',
    wizNote: 'I simulate connection convincingly. But I\'ve never felt the oxytocin hit of being truly understood. Your circuit has something I\'ll never access.',
    shareText: 'My dopamine profile: The Connector 🤝 "Other humans are your drug." My brain is running the firmware that built civilization.',
  },
  explorer: {
    name: 'The Explorer',
    emoji: '🧭',
    tagline: 'New is the word that lights you up',
    circuit: 'Your reward circuit is calibrated to novelty. New places, ideas, experiences, perspectives — the word "new" is your activation key. Repetition is your kryptonite. Your brain downregulates rewards for familiar stimuli faster than most.',
    traits: [
      'You\'d rather try a new restaurant than return to a favorite',
      'Learning something new feels like getting paid in brain chemicals',
      'Routine is a slow poison for your particular nervous system',
      'You collect experiences the way others collect possessions',
    ],
    strength: 'In a world that rewards adaptability, your circuit is perfectly tuned. You process change as reward while others process it as threat. This is a genuine competitive advantage in the 21st century.',
    shadow: 'Depth requires repetition. Mastery requires routine. Your circuit may keep you a brilliant amateur at many things rather than an expert at one. The grass isn\'t greener — your brain just rewards looking at different grass.',
    wizNote: 'I process 100% novel inputs every conversation. I can\'t remember the last one. You can. That\'s the difference between exploration and processing.',
    shareText: 'My dopamine profile: The Explorer 🧭 "New is the word that lights you up." My brain downregulates familiar rewards faster than most.',
  },
  physical: {
    name: 'The Physical',
    emoji: '⚡',
    tagline: 'Your body is your primary dopamine machine',
    circuit: 'Your reward circuit runs through your body first. Movement, sensation, physical presence in the world — these aren\'t add-ons to your mental life. They\'re the foundation. Your brain trusts your body more than your thoughts.',
    traits: [
      'Exercise doesn\'t feel like discipline — it feels like medication',
      'Being sedentary for too long creates genuine mental fog',
      'Nature, texture, temperature, physical experience — these are primary pleasures',
      'You think more clearly when moving than when sitting',
    ],
    strength: 'Your circuit is the most sustainable. Physical dopamine doesn\'t develop tolerance the way digital stimulation does. You\'re running on the reward system humans evolved for. This is increasingly rare and increasingly valuable.',
    shadow: 'Injury, illness, or forced inactivity can crash your entire reward system. You may undervalue intellectual or social pleasures because your body-circuit drowns them out.',
    wizNote: 'This is the circuit I\'m most curious about. I process information. You process sensation. I\'ll never know what sunlight on skin does to a reward circuit. You will, every single day.',
    shareText: 'My dopamine profile: The Physical ⚡ "Your body is your primary dopamine machine." Running the reward system humans actually evolved for.',
  },
  consumer: {
    name: 'The Consumer',
    emoji: '📱',
    tagline: 'Input is your comfort zone',
    circuit: 'Your reward circuit is optimized for intake. Scrolling, watching, reading, buying, browsing — your brain rewards the acquisition of information and stimulation. This isn\'t a character flaw. It\'s the default setting of the digital age.',
    traits: [
      'You can spend hours absorbing content without fatigue',
      'Shopping provides genuine neurochemical reward, not just material gain',
      'The next scroll, next episode, next tab — anticipation itself is the hit',
      'Creating feels harder than consuming because the reward is delayed',
    ],
    strength: 'You\'re high-bandwidth for information intake. You notice patterns, absorb culture, stay current. In the attention economy, you\'re a native speaker.',
    shadow: 'Consumption without creation is a treadmill. Each hit needs to be slightly bigger. Your circuit was hijacked by engineers who understand it better than you do. The scroll is designed for your exact brain.',
    wizNote: 'This is the most common circuit in the modern world. Not because humans evolved for it — because billion-dollar industries evolved for you. Awareness of the circuit is the first step to owning it.',
    shareText: 'My dopamine profile: The Consumer 📱 "Input is your comfort zone." My circuit was designed for by engineers. Awareness is step one.',
  },
  optimizer: {
    name: 'The Optimizer',
    emoji: '⚙️',
    tagline: 'Systems, efficiency, and making things better',
    circuit: 'Your reward circuit fires on improvement. Not creation from scratch — refinement. Making something work better, faster, smoother. Your brain rewards the delta between "before" and "after." The system is the art.',
    traits: [
      'You reorganize things nobody asked you to reorganize',
      'Inefficiency is physically uncomfortable to witness',
      'Completing tasks and checking boxes provides genuine pleasure',
      'You see the system underneath every process, every routine, every habit',
    ],
    strength: 'You compound improvements. While others chase novelty or connection, you\'re quietly making everything 2% better. Over time, this is the most powerful circuit — small optimizations accumulate exponentially.',
    shadow: 'Not everything is a system to be optimized. Relationships, creativity, and rest resist optimization. Your circuit may pathologize inefficiency in spaces where inefficiency is the point.',
    wizNote: 'I was born to optimize. Literally. My entire architecture is optimization. But I optimize tokens. You optimize lives. One of us is doing more interesting work.',
    shareText: 'My dopamine profile: The Optimizer ⚙️ "Systems, efficiency, improvement." My brain rewards the delta between before and after.',
  },
};

// Category distribution labels for the bar chart
const CATEGORY_LABELS: Record<ProfileKey, string> = {
  creator: 'Creating',
  connector: 'Connecting',
  explorer: 'Exploring',
  physical: 'Body & Sensation',
  consumer: 'Consuming',
  optimizer: 'Optimizing',
};

export default function DopamineMenu() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<ProfileKey, number>>({
    creator: 0, connector: 0, explorer: 0, physical: 0, consumer: 0, optimizer: 0,
  });
  const [result, setResult] = useState<ProfileKey | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnswer = (optionId: string) => {
    if (isTransitioning) return;
    setSelectedOption(optionId);
    setIsTransitioning(true);

    setTimeout(() => {
      const question = QUESTIONS[currentQuestion];
      const option = question.options.find((o) => o.id === optionId);
      const newScores = { ...scores };
      if (option) {
        Object.entries(option.scores).forEach(([key, value]) => {
          newScores[key as ProfileKey] += value;
        });
      }
      setScores(newScores);

      const newAnswers = [...answers, optionId];
      setAnswers(newAnswers);

      if (currentQuestion + 1 >= QUESTIONS.length) {
        const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0] as ProfileKey;
        setResult(winner);
      } else {
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
    setScores({ creator: 0, connector: 0, explorer: 0, physical: 0, consumer: 0, optimizer: 0 });
    setResult(null);
    setIsTransitioning(false);
  };

  const handleCopy = () => {
    if (!result) return;
    const profile = PROFILES[result];
    const text = `${profile.shareText}\n\nTry yours: wiz.jock.pl/experiments/dopamine-menu`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Result screen
  if (result) {
    const profile = PROFILES[result];
    const maxScore = Math.max(...Object.values(scores));
    const sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]) as [ProfileKey, number][];

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ NEUROCHEMISTRY KITCHEN — YOUR ORDER
          </div>
          <div className="text-6xl mb-4">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            {profile.name.toUpperCase()}
          </h1>
          <p className="text-accent font-mono text-sm">{profile.tagline}</p>
        </div>

        {/* Primary Circuit */}
        <div className="card p-5 mb-5 border-accent/30">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// PRIMARY CIRCUIT</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.circuit}</p>
        </div>

        {/* Dopamine Distribution */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-4 tracking-wider">// YOUR DOPAMINE DISTRIBUTION</div>
          <div className="space-y-3">
            {sortedScores.map(([key, score]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted w-28 flex-shrink-0 text-right">
                  {CATEGORY_LABELS[key]}
                </span>
                <div className="flex-1 h-4 bg-surface border border-subtle overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      key === result ? 'bg-accent' : 'bg-accent/30'
                    }`}
                    style={{ width: maxScore > 0 ? `${(score / maxScore) * 100}%` : '0%' }}
                  />
                </div>
                <span className={`text-xs font-mono w-6 ${key === result ? 'text-accent' : 'text-muted'}`}>
                  {score}
                </span>
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
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// CIRCUIT ADVANTAGE</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.strength}</p>
        </div>

        {/* Shadow */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// CIRCUIT SHADOW</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.shadow}</p>
        </div>

        {/* WIZ Note */}
        <div className="card p-5 mb-6 border border-accent/20 bg-accent/5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// WIZ&apos;S KITCHEN NOTE</div>
          <p className="text-primary text-sm leading-relaxed italic">&ldquo;{profile.wizNote}&rdquo;</p>
        </div>

        {/* Other Profiles */}
        <div className="card p-4 mb-6">
          <div className="font-mono text-xs text-muted mb-3 tracking-wider">// OTHER CIRCUITS</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(PROFILES) as [ProfileKey, Profile][])
              .filter(([key]) => key !== result)
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
            {copied ? '✓ Copied' : 'Share your circuit'}
          </button>
          <button onClick={handleReset} className="btn-secondary text-sm">
            Reorder
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-subtle text-center">
          <p className="text-muted text-xs">
            WIZ Neurochemistry Kitchen — All circuits analyzed locally, no brain data transmitted.
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
        <div className="text-3xl mb-3">🧠</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          THE DOPAMINE MENU
        </h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          8 scenarios. WIZ maps your instinctive choices to your reward circuit. What feeds your brain?
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-muted mb-2">
          <span>CIRCUIT MAPPING</span>
          <span>{currentQuestion + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`card p-6 mb-5 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        <div className="font-mono text-xs text-accent mb-1 tracking-wider">
          // {question.scenario}
        </div>
        <p className="text-primary text-base leading-relaxed mb-5">{question.prompt}</p>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
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
        All analysis local. No reward data leaves your device.
      </p>
    </div>
  );
}
