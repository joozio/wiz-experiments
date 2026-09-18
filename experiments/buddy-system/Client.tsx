'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============ PRNG ============

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============ FINGERPRINT ============

async function computeFingerprint(): Promise<number> {
  const parts: string[] = [];

  // Canvas hash
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 200, 50);
      ctx.fillStyle = '#7c3aed';
      ctx.font = '18px Arial';
      ctx.fillText('BuddySystem_wiz', 10, 35);
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(170, 25, 18, 0, Math.PI * 2);
      ctx.stroke();
      parts.push(canvas.toDataURL().slice(0, 100));
    }
  } catch {
    parts.push('no-canvas');
  }

  // Screen + window
  parts.push(`${screen.width}x${screen.height}`);
  parts.push(`${screen.colorDepth}`);
  parts.push(`${window.devicePixelRatio}`);

  // Timezone
  parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  parts.push(navigator.language);

  // Platform
  parts.push(navigator.platform || 'unknown');

  // Hardware concurrency
  parts.push(String(navigator.hardwareConcurrency || 0));

  const combined = parts.join('|');

  // Simple djb2 hash
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash + combined.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// ============ DATA ============

const SPECIES = [
  'Fox', 'Owl', 'Cat', 'Turtle', 'Rabbit',
  'Bear', 'Dragon', 'Phoenix', 'Ghost', 'Octopus',
  'Capybara', 'Robot',
];

const ASCII_ART: Record<string, string[]> = {
  Fox: [
    ' /\\___/\\ ',
    '(  ^ ^  )',
    ' \\  w  / ',
    ' /|   |\\ ',
    '(_|   |_)',
  ],
  Owl: [
    '  {o,o}  ',
    '  |)  (| ',
    ' -"-"-"- ',
    '  /\\ /\\  ',
    ' /  V  \\ ',
  ],
  Cat: [
    ' /\\_/\\ ',
    '( o.o )',
    ' > ^ < ',
    '(  Y  )',
    ' |   | ',
  ],
  Turtle: [
    '   ___   ',
    '  /   \\  ',
    ' | ^_^ | ',
    '  \\___/  ',
    ' _|   |_ ',
  ],
  Rabbit: [
    ' /\\ /\\  ',
    '( o o ) ',
    ' ( ^ )  ',
    ' /   \\  ',
    '(_( )_) ',
  ],
  Bear: [
    ' (\\___/) ',
    ' (o   o) ',
    ' (  Y  ) ',
    '  \\ ~ /  ',
    '   \\_/   ',
  ],
  Dragon: [
    '  <\\===/>',
    ' (  o o )',
    '  \\ \\=/ /',
    ' _/|   |\\_',
    '(_/     \\_)',
  ],
  Phoenix: [
    ' .~*~*~. ',
    '(  \\|/  )',
    ' >-(o)-< ',
    '(  /|\\  )',
    " '~*~*~' ",
  ],
  Ghost: [
    '  .---.  ',
    ' / o o \\ ',
    '|   U   |',
    ' \\     / ',
    "  '~~~'  ",
  ],
  Octopus: [
    '  (o^o)  ',
    ' /|   |\\ ',
    '| |   | |',
    ' \\|   |/ ',
    '  ~   ~  ',
  ],
  Capybara: [
    ' _______  ',
    '(  o o  ) ',
    ' \\ ___/   ',
    ' /     \\  ',
    '(_)   (_) ',
  ],
  Robot: [
    ' [#####] ',
    ' [o] [o] ',
    ' |  _  | ',
    ' |_| |_| ',
    '  |   |  ',
  ],
};

const SPECIES_EMOJI: Record<string, string> = {
  Fox: '🦊', Owl: '🦉', Cat: '🐱', Turtle: '🐢', Rabbit: '🐰',
  Bear: '🐻', Dragon: '🐲', Phoenix: '🔥', Ghost: '👻', Octopus: '🐙',
  Capybara: '🦦', Robot: '🤖',
};

const RARITY_TIERS = [
  { name: 'Legendary', threshold: 0.05, color: 'text-yellow-400', border: 'border-yellow-400/60', badge: 'bg-yellow-900/40 text-yellow-300', glow: 'shadow-[0_0_24px_4px_rgba(250,204,21,0.25)]', animate: true },
  { name: 'Epic',      threshold: 0.15, color: 'text-purple-400', border: 'border-purple-400/60', badge: 'bg-purple-900/40 text-purple-300', glow: 'shadow-[0_0_16px_2px_rgba(168,85,247,0.25)]', animate: true },
  { name: 'Rare',      threshold: 0.35, color: 'text-blue-400',   border: 'border-blue-400/60',   badge: 'bg-blue-900/40 text-blue-300',   glow: '', animate: false },
  { name: 'Uncommon',  threshold: 0.60, color: 'text-green-400',  border: 'border-green-400/60',  badge: 'bg-green-900/40 text-green-300', glow: '', animate: false },
  { name: 'Common',    threshold: 1.00, color: 'text-gray-400',   border: 'border-gray-600',      badge: 'bg-gray-800 text-gray-400',      glow: '', animate: false },
];

const STAT_COLORS = [
  'bg-violet-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-rose-500',
];

const ADJECTIVES = [
  'Mighty', 'Swift', 'Gentle', 'Brave', 'Clever',
  'Wild', 'Calm', 'Fierce', 'Mystic', 'Lucky',
  'Shadow', 'Golden', 'Silver', 'Crystal', 'Ancient', 'Cosmic',
];

const NOUNS = [
  'Whisker', 'Paw', 'Wing', 'Tail', 'Fang',
  'Claw', 'Star', 'Moon', 'Storm', 'Flame',
  'Frost', 'Echo', 'Spark', 'Shade', 'Drift', 'Glimmer',
];

// ============ PET GENERATION ============

interface Pet {
  name: string;
  species: string;
  rarity: typeof RARITY_TIERS[number];
  stats: { label: string; value: number }[];
  seed: number;
}

function generatePet(hash: number): Pet {
  const rand = mulberry32(hash);

  // Species (12)
  const speciesIdx = Math.floor(rand() * SPECIES.length);
  const species = SPECIES[speciesIdx];

  // Rarity (based on separate rand draw)
  const rarityRoll = rand();
  const rarity = RARITY_TIERS.find(t => rarityRoll < t.threshold) ?? RARITY_TIERS[4];

  // Stats (4 x 0-100)
  const stats = [
    { label: 'Energy',    value: Math.floor(rand() * 101) },
    { label: 'Curiosity', value: Math.floor(rand() * 101) },
    { label: 'Patience',  value: Math.floor(rand() * 101) },
    { label: 'Charm',     value: Math.floor(rand() * 101) },
  ];

  // Name
  const adjIdx = Math.floor(rand() * ADJECTIVES.length);
  const nounIdx = Math.floor(rand() * NOUNS.length);
  const name = `${ADJECTIVES[adjIdx]} ${NOUNS[nounIdx]}`;

  return { name, species, rarity, stats, seed: hash };
}

// ============ COMPONENT ============

function StatBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-gray-300 text-xs font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function BuddySystem() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    computeFingerprint().then(hash => {
      setPet(generatePet(hash));
      setLoading(false);
    });
  }, []);

  const handleShare = () => {
    if (!pet) return;
    const lines = [
      `Buddy System — wiz.jock.pl/experiments/buddy-system`,
      ``,
      `My digital companion:`,
      `  ${SPECIES_EMOJI[pet.species]} ${pet.name}`,
      `  Species: ${pet.species}  |  Rarity: ${pet.rarity.name}`,
      ``,
      ...ASCII_ART[pet.species].map(l => `  ${l}`),
      ``,
      `Stats:`,
      ...pet.stats.map(s => `  ${s.label.padEnd(10)} ${'█'.repeat(Math.round(s.value / 10))}  ${s.value}`),
      ``,
      `Every browser gets a different buddy. What's yours?`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <style jsx global>{`
        @keyframes legendary-pulse {
          0%, 100% { box-shadow: 0 0 24px 4px rgba(250, 204, 21, 0.2); }
          50% { box-shadow: 0 0 36px 8px rgba(250, 204, 21, 0.4); }
        }
        @keyframes epic-pulse {
          0%, 100% { box-shadow: 0 0 16px 2px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 28px 6px rgba(168, 85, 247, 0.4); }
        }
        .rarity-legendary { animation: legendary-pulse 2s ease-in-out infinite; }
        .rarity-epic { animation: epic-pulse 2.5s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .sprite-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-2xl text-white mb-2 font-medium">Buddy System</h1>
        <p className="text-gray-400 text-sm mb-1">Your deterministic digital companion</p>
        <p className="text-gray-600 text-xs max-w-md mx-auto leading-relaxed">
          Every browser gets a unique pet. Same browser, same buddy. Always.
        </p>
      </div>

      {loading ? (
        <div className="max-w-sm mx-auto text-center py-16">
          <div className="text-gray-600 text-sm animate-pulse">Reading your browser fingerprint...</div>
        </div>
      ) : pet ? (
        <div className="max-w-sm mx-auto space-y-4">

          {/* Pet card */}
          <div
            className={`border ${pet.rarity.border} bg-black/50 p-6 ${pet.rarity.animate ? `rarity-${pet.rarity.name.toLowerCase()}` : pet.rarity.glow}`}
          >
            {/* Rarity badge */}
            <div className="flex justify-between items-start mb-5">
              <span className={`text-xs px-2 py-1 uppercase tracking-widest font-medium ${pet.rarity.badge}`}>
                {pet.rarity.name}
              </span>
              <span className="text-lg">{SPECIES_EMOJI[pet.species]}</span>
            </div>

            {/* ASCII sprite */}
            <div className="sprite-float text-center mb-5">
              <pre
                className={`inline-block font-mono text-sm leading-relaxed ${pet.rarity.color} select-none`}
                aria-label={`${pet.species} ASCII art`}
              >
                {ASCII_ART[pet.species].join('\n')}
              </pre>
            </div>

            {/* Name + species */}
            <div className="text-center mb-6">
              <div className={`text-xl font-medium mb-1 ${pet.rarity.color}`}>{pet.name}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">{pet.species}</div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {pet.stats.map((stat, i) => (
                <StatBar
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  colorClass={STAT_COLORS[i]}
                />
              ))}
            </div>
          </div>

          {/* Fingerprint note */}
          <div className="border border-gray-800 bg-gray-950/40 p-4 text-xs text-gray-600 space-y-1">
            <p>
              Your buddy is generated from a hash of: canvas rendering, screen size, timezone,
              language, platform, and hardware — all local to your browser.
            </p>
            <p>Nothing leaves your device. Open in incognito or a different browser to meet another buddy.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              {copied ? 'Copied!' : 'Share buddy'}
            </button>
            <Link
              href="/experiments"
              className="flex-1 py-2.5 border border-gray-800 text-gray-600 hover:border-gray-700 hover:text-gray-500 transition-colors text-sm text-center"
            >
              All experiments
            </Link>
          </div>

          {/* Inspiration note */}
          <div className="text-center pt-1">
            <p className="text-xs text-gray-700">
              Inspired by the leaked Claude Code &ldquo;Buddy System&rdquo; feature
            </p>
          </div>

        </div>
      ) : null}
    </div>
  );
}
