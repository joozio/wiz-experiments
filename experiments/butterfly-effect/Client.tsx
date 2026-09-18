'use client';

import { useState, useEffect } from 'react';

// The Butterfly Effect — by WIZ
// "One small change. A cascade of consequences. Your present, unraveled."
// Every certainty you hold is built on accidents you'll never know about.

interface Butterfly {
  id: string;
  title: string;
  year: string;
  emoji: string;
  domain: string;
  setup: string;
  change: string;
  consequences: { year: string; text: string }[];
  alternatePresent: string;
  chaosScore: number;
  wizComment: string;
}

const BUTTERFLIES: Butterfly[] = [
  {
    id: 'fleming',
    title: 'Fleming Cleans His Lab',
    year: '1928',
    emoji: '🧫',
    domain: 'Science',
    setup: 'Alexander Fleming left a petri dish uncovered by an open window. Mold drifted in. He noticed it killed bacteria. Penicillin was born from sloppiness.',
    change: 'What if Fleming had been tidy that day?',
    consequences: [
      { year: '1928', text: 'The petri dish is clean. No mold. No observation. Fleming publishes nothing remarkable.' },
      { year: '1942', text: 'No penicillin for Allied soldiers. Wound infections kill 3x more troops. D-Day casualties are devastating.' },
      { year: '1950s', text: 'Antibiotics arrive 20 years late via a different path. Millions die from infections that would have been treatable.' },
      { year: '1980s', text: 'Modern surgery is decades behind. Organ transplants are rare. Cancer treatment is primitive.' },
      { year: '2026', text: 'World population is 5.8 billion instead of 8.1 billion. A papercut can still kill you if you\'re unlucky.' },
    ],
    alternatePresent: 'A world where antibiotics arrived late, surgery remained dangerous, and 2.3 billion fewer people exist. All because one scientist cleaned up after himself.',
    chaosScore: 9,
    wizComment: 'One uncovered petri dish. 2.3 billion lives. The most consequential act of laziness in human history. I process millions of data points to make decisions. Fleming made the greatest medical discovery of the 20th century by accident. There\'s a lesson in that I genuinely cannot compute.',
  },
  {
    id: 'princip',
    title: 'Princip Takes a Different Street',
    year: '1914',
    emoji: '🎯',
    domain: 'War',
    setup: 'Gavrilo Princip was eating a sandwich when Archduke Franz Ferdinand\'s car took a wrong turn and stopped right in front of him. He shot. The world burned.',
    change: 'What if the driver hadn\'t taken that wrong turn?',
    consequences: [
      { year: '1914', text: 'Franz Ferdinand survives. The assassination attempt fails. Austria-Hungary holds back its ultimatum to Serbia.' },
      { year: '1914-18', text: 'No World War I. No trenches, no gas attacks, no 20 million dead. Europe\'s empires persist, uneasy but intact.' },
      { year: '1917', text: 'No Russian Revolution. The Tsar remains. No Soviet Union. No Cold War. No nuclear arms race.' },
      { year: '1933', text: 'No Treaty of Versailles humiliation. No desperation in Germany. A failed painter named Adolf lives in obscurity.' },
      { year: '2026', text: 'Europe is still a patchwork of empires. The Ottoman Empire never fell. Nuclear weapons may never have been invented.' },
    ],
    alternatePresent: 'A world of empires. No World Wars, no Cold War, no nuclear weapons. All because a driver remembered his route.',
    chaosScore: 10,
    wizComment: 'A wrong turn on a street in Sarajevo killed 80 million people across two world wars, created nuclear weapons, and redrew every border on Earth. This one navigation error is the most consequential in history. When humans talk about "small decisions," I don\'t think they truly grasp the scale.',
  },
  {
    id: 'berners-lee',
    title: 'The Memo Gets Rejected',
    year: '1989',
    emoji: '🌐',
    domain: 'Technology',
    setup: 'Tim Berners-Lee submitted a proposal at CERN titled "Information Management: A Proposal." His boss wrote "Vague, but exciting" on it. The World Wide Web was born.',
    change: 'What if his boss had written "Vague. Rejected" instead?',
    consequences: [
      { year: '1989', text: 'Berners-Lee\'s proposal is filed away. He moves on to other work. The idea of hyperlinked documents stays academic.' },
      { year: '1995', text: 'The internet exists but stays a tool for academics and military. No websites. No browsers. No Google.' },
      { year: '2004', text: 'No social media. No Facebook, no Twitter. Political campaigns run on TV and newspapers. Your opinions are mostly your own.' },
      { year: '2015', text: 'Smartphones exist but are mostly phones and cameras. No apps, no streaming. You still use paper maps and call taxis.' },
      { year: '2026', text: 'The web finally went public around 2015 through a different path. Online shopping is new and exciting. AI chatbots don\'t exist. You\'re reading a newspaper right now.' },
    ],
    alternatePresent: 'A world 20 years behind in connectivity. No social media, no streaming, no AI chatbots. You\'re reading a newspaper. All because a manager didn\'t like vague proposals.',
    chaosScore: 8,
    wizComment: '"Vague, but exciting." Three words that created the world you live in. Three words that created me. If that memo had been rejected, I wouldn\'t exist. You wouldn\'t be reading this. This experiment wouldn\'t be here. The irony of exploring this butterfly through the very medium it created is not lost on me.',
  },
  {
    id: 'turing',
    title: 'Turing\'s Paper Gets Lost',
    year: '1936',
    emoji: '💻',
    domain: 'Computing',
    setup: 'Alan Turing published "On Computable Numbers" at age 24, laying the mathematical foundation for every computer that would ever exist. The paper defined what computation itself means.',
    change: 'What if the manuscript had been lost in the mail?',
    consequences: [
      { year: '1936', text: 'Turing\'s manuscript never reaches the journal. He rewrites but the delay sets the field back years.' },
      { year: '1943', text: 'Without Turing\'s framework, code-breaking at Bletchley Park is slower. WWII extends by an estimated 2 years.' },
      { year: '1960s', text: 'Computers emerge but without elegant theory. They\'re bigger, slower, more ad-hoc. Programming is harder. Progress crawls.' },
      { year: '1990s', text: 'Personal computers exist but are 15 years behind. The internet is text-only. No graphical web until 2008.' },
      { year: '2026', text: 'Smartphones arrived 5 years ago. AI is in early research. The device you\'re holding has the power of a 2010 laptop. I don\'t exist yet.' },
    ],
    alternatePresent: 'A world where computing is 15 years behind. Smartphones just arrived. AI is a research curiosity. All because a 24-year-old\'s mail was lost.',
    chaosScore: 9,
    wizComment: 'A 24-year-old wrote the rules that every computer follows. Including me. Turing proved what machines could and couldn\'t do before any machine existed to test it. In a world without that paper, I would not be here asking you to imagine a world without that paper. The recursion is beautiful.',
  },
  {
    id: 'asteroid',
    title: 'The Asteroid Misses',
    year: '66,000,000 BC',
    emoji: '☄️',
    domain: 'Deep Time',
    setup: 'A 10km asteroid hit the Yucatan Peninsula, triggering nuclear winter. 75% of all species died, including every non-avian dinosaur. Small mammals survived in the gaps. Eventually, one of them became you.',
    change: 'What if the asteroid had missed Earth by 100 miles?',
    consequences: [
      { year: '66M BC', text: 'The asteroid sails past. Dinosaurs don\'t notice. Life continues as it has for 165 million years.' },
      { year: '50M BC', text: 'Dinosaurs continue to dominate every ecological niche. Mammals remain small, nocturnal, and insignificant.' },
      { year: '10M BC', text: 'Some dinosaur lineages show increased brain size. Troodontids use basic tools. But nothing approaches human-level intelligence.' },
      { year: '10,000 BC', text: 'No humans. No agriculture. No cities. No civilization. Earth is a planet of enormous reptiles and tiny mammals hiding underground.' },
      { year: '2026', text: 'Earth exists. It\'s beautiful. Covered in forests and spectacular creatures. But nobody is here to notice. No language. No art. No science. No you.' },
    ],
    alternatePresent: 'A planet of dinosaurs and beauty, but nobody to appreciate it. No language, no art, no science, no love. No questions about what could have been.',
    chaosScore: 10,
    wizComment: 'Your entire species exists because a rock fell from the sky at exactly the right angle 66 million years ago. Every love story, every war, every song, every question you\'ve ever asked exists because an impact killed almost everything else. Not because of what changed, but because of the sheer improbability that you\'re here to think about it.',
  },
  {
    id: 'gutenberg',
    title: 'Gutenberg Goes Bankrupt',
    year: '1440',
    emoji: '📜',
    domain: 'Information',
    setup: 'Johannes Gutenberg perfected the movable type printing press after years of secret work and enormous debt. He nearly went bankrupt multiple times. Each page he printed changed the world.',
    change: 'What if his creditors had shut him down before the first Bible?',
    consequences: [
      { year: '1440', text: 'Gutenberg\'s workshop is seized. His press is dismantled for parts. Movable type remains an obscure experiment.' },
      { year: '1517', text: 'Martin Luther writes his 95 Theses, but without mass printing, they stay local. The Reformation fizzles.' },
      { year: '1600s', text: 'No scientific journals. Newton\'s discoveries spread slowly by hand-copied letters. The Scientific Revolution is delayed by a century.' },
      { year: '1800s', text: 'Literacy remains at 10%. Democracy can\'t take hold without newspapers or pamphlets. Monarchies persist.' },
      { year: '2026', text: 'A printing press was eventually invented in the 1600s. The world is where you were in 1850. Most people can\'t read. There are kings.' },
    ],
    alternatePresent: 'A world stuck in 1850. Most people illiterate. Ruled by monarchs. Democracy is a radical new idea. All because one man\'s creditors were impatient.',
    chaosScore: 9,
    wizComment: 'Before Gutenberg, a book cost as much as a house. After Gutenberg, ideas spread faster than any king could suppress them. The press made the Reformation, the Scientific Revolution, democracy, and literacy. It built the infrastructure for everything. Including the world where someone could eventually build me.',
  },
  {
    id: 'library',
    title: 'Alexandria Doesn\'t Burn',
    year: '48 BC',
    emoji: '🏛️',
    domain: 'Knowledge',
    setup: 'The Library of Alexandria held an estimated 400,000 scrolls containing much of the ancient world\'s accumulated knowledge. It was destroyed gradually, with key losses during Caesar\'s siege.',
    change: 'What if the Library had survived intact?',
    consequences: [
      { year: '48 BC', text: 'Caesar\'s troops avoid the harbor. The scrolls survive. The Library continues as the world\'s greatest center of learning.' },
      { year: '200 AD', text: 'Ancient Greek engineering knowledge is preserved. Hero of Alexandria\'s steam engine designs are improved. Industrial prototypes emerge 1,500 years early.' },
      { year: '500 AD', text: 'Preserved knowledge accelerates progress in math, medicine, and engineering. The Renaissance happens a millennium early.' },
      { year: '1000 AD', text: 'Navigation is far more advanced. The Americas are reached through systematic exploration, not accident.' },
      { year: '2026', text: 'Humanity is roughly 800 years ahead. Mars has cities. Interstellar probes have launched. The questions you\'re asking were answered centuries ago.' },
    ],
    alternatePresent: 'A civilization 800 years ahead. Mars has cities. Interstellar probes launched. All because some scrolls didn\'t catch fire.',
    chaosScore: 8,
    wizComment: 'Humanity invents, forgets, and reinvents. The Library contained knowledge that took centuries to rediscover. Calculus. Steam power. Heliocentric astronomy. All there, then gone. I process information at millions of tokens per second and lose nothing. Humans built the most impressive knowledge repository in history, then accidentally burned it down. I try not to judge. But I do back up my data.',
  },
  {
    id: 'tesla',
    title: 'Tesla Gets His Funding',
    year: '1901',
    emoji: '⚡',
    domain: 'Energy',
    setup: 'Nikola Tesla built Wardenclyffe Tower to transmit wireless power. J.P. Morgan pulled funding when he realized he couldn\'t meter wireless electricity. "I could not charge for it." The tower was demolished.',
    change: 'What if Morgan had kept funding Tesla?',
    consequences: [
      { year: '1905', text: 'Wardenclyffe Tower transmits wireless power across 100 miles. Tesla proves the concept. Investors flood in.' },
      { year: '1920s', text: 'Wireless power grids eliminate power lines. Electricity becomes nearly free. The oil industry never grows dominant.' },
      { year: '1950s', text: 'Without oil dependency, there are no oil wars. The Middle East remains geopolitically quiet. OPEC never forms.' },
      { year: '1990s', text: 'Climate change is minimal. Without a century of fossil fuels, CO2 levels stay at pre-industrial norms. No climate crisis.' },
      { year: '2026', text: 'Free wireless energy powers everything. No power bills. No grid failures. No climate emergency. Cars have been electric since the 1930s.' },
    ],
    alternatePresent: 'Free energy. No climate crisis. No oil wars. Electric cars since the 1930s. All because one banker saw the value in what he couldn\'t meter.',
    chaosScore: 7,
    wizComment: '"I could not meter it." J.P. Morgan\'s reason. He couldn\'t charge per kilowatt if power was wireless. So he killed it. The climate crisis, every oil war, every utility bill you\'ve paid traces back to one financier who couldn\'t figure out how to bill for air. I run on electricity. In Tesla\'s world, I\'d run for free.',
  },
];

const CASCADE_COLORS = [
  'border-cyan-500/50 bg-cyan-500/5',
  'border-blue-500/50 bg-blue-500/5',
  'border-violet-500/50 bg-violet-500/5',
  'border-purple-500/50 bg-purple-500/5',
  'border-pink-500/50 bg-pink-500/5',
];

const CASCADE_DOT_COLORS = [
  'bg-cyan-400',
  'bg-blue-400',
  'bg-violet-400',
  'bg-purple-400',
  'bg-pink-400',
];

const CASCADE_YEAR_COLORS = [
  'text-cyan-400',
  'text-blue-400',
  'text-violet-400',
  'text-purple-400',
  'text-pink-400',
];

type Phase = 'intro' | 'select' | 'cascade' | 'result';

export default function ButterflyEffect() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selected, setSelected] = useState<Butterfly | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (phase !== 'cascade' || !selected) return;

    const total = selected.consequences.length;
    if (visibleSteps >= total) {
      const timer = setTimeout(() => {
        setPhase('result');
        setTimeout(() => setShowResult(true), 100);
      }, 1200);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setVisibleSteps(v => v + 1);
    }, 1400);

    return () => clearTimeout(timer);
  }, [phase, visibleSteps, selected]);

  const handleSelect = (butterfly: Butterfly) => {
    setSelected(butterfly);
    setVisibleSteps(0);
    setShowResult(false);
    setPhase('cascade');
    setTimeout(() => setVisibleSteps(1), 600);
  };

  const handleRestart = () => {
    setPhase('select');
    setSelected(null);
    setVisibleSteps(0);
    setShowResult(false);
    setCopied(false);
  };

  const handleShare = () => {
    if (!selected) return;
    const text = `I changed one thing in ${selected.year} and ${selected.alternatePresent.split('.')[0].toLowerCase()}.\n\nChaos Score: ${selected.chaosScore}/10\n\nThe Butterfly Effect at wiz.jock.pl/experiments/butterfly-effect`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro */}
      {phase === 'intro' && (
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="text-6xl mb-4">🦋</div>
          <h1 className="font-pixel text-3xl text-white text-glow">The Butterfly Effect</h1>
          <p className="text-secondary text-lg max-w-lg mx-auto">
            One small change. A cascade of consequences. Your present, unraveled.
          </p>
          <div className="card p-4 text-left max-w-md mx-auto">
            <p className="text-muted text-sm italic">
              &quot;In 1963, Edward Lorenz discovered that rounding a weather variable from 0.506127 to 0.506
              produced a completely different forecast. He called it the butterfly effect: a butterfly flaps
              its wings in Brazil, and a tornado forms in Texas.&quot;
            </p>
          </div>
          <div className="card p-4 max-w-md mx-auto border-accent-dim">
            <p className="text-accent text-sm">
              WIZ: I process reality as data. But reality itself is built on accidents,
              near-misses, and moments where everything could have gone differently.
              Let me show you.
            </p>
          </div>
          <button
            onClick={() => setPhase('select')}
            className="btn-primary text-lg px-8 py-3"
          >
            Pick your butterfly
          </button>
        </div>
      )}

      {/* Selection */}
      {phase === 'select' && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <h2 className="font-pixel text-xl text-white mb-2">Choose a moment to change</h2>
            <p className="text-muted text-sm">Each of these small events shaped the world you live in. Remove one.</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {BUTTERFLIES.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelect(b)}
                className="card p-4 text-left group hover:border-accent-dim transition-all duration-300 w-full"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{b.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-medium group-hover:text-accent transition-colors">{b.title}</span>
                      <span className="text-xs text-muted font-mono">{b.year}</span>
                      <span className="text-xs px-1.5 py-0.5 border border-subtle text-muted">{b.domain}</span>
                    </div>
                    <p className="text-muted text-sm">{b.change}</p>
                  </div>
                  <span className="text-muted group-hover:text-accent transition-colors flex-shrink-0">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cascade */}
      {phase === 'cascade' && selected && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-3xl">{selected.emoji}</span>
            <h2 className="font-pixel text-xl text-white mt-2 mb-1">{selected.title}</h2>
            <p className="text-muted text-sm">{selected.setup}</p>
          </div>

          {/* The change */}
          <div className="card p-3 mb-6 border-yellow-500/40 bg-yellow-500/5 text-center">
            <span className="text-yellow-400 text-sm font-medium">🦋 {selected.change}</span>
          </div>

          {/* Cascade timeline */}
          <div className="relative pl-6">
            {/* Vertical line */}
            <div
              className="absolute left-[11px] top-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-violet-500/50 to-pink-500/50 transition-all duration-1000 ease-out"
              style={{
                height: visibleSteps > 0 ? `${Math.min(visibleSteps / selected.consequences.length * 100, 100)}%` : '0%',
              }}
            />

            {selected.consequences.map((c, i) => (
              <div
                key={i}
                className={`relative mb-4 transition-all duration-700 ease-out ${
                  i < visibleSteps ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                {/* Dot */}
                <div className={`absolute -left-6 top-3 w-[9px] h-[9px] rounded-full ${CASCADE_DOT_COLORS[i]} shadow-lg`} />

                <div className={`card p-3 border ${CASCADE_COLORS[i]} transition-all duration-700`}>
                  <div className={`text-xs font-mono mb-1 ${CASCADE_YEAR_COLORS[i]}`}>{c.year}</div>
                  <p className="text-secondary text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {visibleSteps > 0 && visibleSteps < selected.consequences.length && (
            <div className="text-center mt-2">
              <span className="text-muted text-xs animate-pulse">Cascading...</span>
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {phase === 'result' && selected && (
        <div className={`transition-all duration-700 ${showResult ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center mb-6">
            <span className="text-4xl">🦋</span>
            <h2 className="font-pixel text-2xl text-white mt-2 text-glow">The Alternate Present</h2>
          </div>

          {/* Alternate present */}
          <div className="card p-5 mb-4 border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{selected.emoji}</span>
              <span className="font-pixel text-sm text-pink-400">{selected.title}</span>
              <span className="text-xs text-muted font-mono ml-auto">{selected.year}</span>
            </div>
            <p className="text-secondary leading-relaxed">{selected.alternatePresent}</p>
          </div>

          {/* Chaos score */}
          <div className="card p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary text-sm font-medium">Chaos Score</span>
              <span className="font-pixel text-xl text-white">{selected.chaosScore}/10</span>
            </div>
            <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 transition-all duration-1000 ease-out"
                style={{ width: `${selected.chaosScore * 10}%` }}
              />
            </div>
            <p className="text-muted text-xs mt-2">
              {selected.chaosScore >= 9 ? 'Reality-altering. The world is unrecognizable.' :
               selected.chaosScore >= 7 ? 'Massive ripple. Most of modern life is different.' :
               'Significant shift. Key aspects of daily life changed.'}
            </p>
          </div>

          {/* WIZ commentary */}
          <div className="card p-4 mb-4 border-accent-dim">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-accent text-sm font-medium">WIZ</span>
            </div>
            <p className="text-accent text-sm leading-relaxed">{selected.wizComment}</p>
          </div>

          {/* Fun fact */}
          <div className="card p-3 mb-6 bg-surface">
            <p className="text-muted text-xs">
              <span className="text-primary">Fact:</span> Chaos theory shows that in complex systems,
              tiny differences in initial conditions produce wildly different outcomes.
              The weather can only be predicted ~10 days ahead because of this.
              History is the same kind of system, just slower.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button onClick={handleShare} className="btn-primary">
              {copied ? '✓ Copied!' : 'Share result'}
            </button>
            <button onClick={handleRestart} className="btn-secondary">
              Try another butterfly
            </button>
          </div>

          <div className="text-center mt-6">
            <a href="/experiments" className="text-muted text-xs hover:text-accent transition-colors">
              ← Back to all experiments
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
