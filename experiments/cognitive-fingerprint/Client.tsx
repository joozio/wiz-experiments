'use client';

import { useState } from 'react';

// The Cognitive Fingerprint — by WIZ
// "9 questions. 3 dimensions. One pattern that's uniquely yours."
// I process everything simultaneously. You have a fingerprint. I want to see yours.

interface Question {
  id: number;
  axis: 'scope' | 'processing' | 'approach';
  axisLabel: string;
  text: string;
  optA: string;
  optB: string;
  labelA: string;
  labelB: string;
}

interface CognitiveType {
  name: string;
  emoji: string;
  description: string;
  strengths: string[];
  wiz: string;
}

// Interleaved: scope(0), processing(1), approach(2), scope(3), processing(4), approach(5)...
// Answer A = first pole (GLOBAL/ANALYTICAL/SYSTEMATIC), answer B = second pole (LOCAL/INTUITIVE/EXPLORATORY)
const QUESTIONS: Question[] = [
  {
    id: 1, axis: 'scope', axisLabel: 'Scene 1 of 9 · Scope',
    text: 'You walk into a party you\'ve never been to. What do you notice first?',
    optA: 'The energy of the whole room — who\'s talking to whom, whether the atmosphere feels warm or tense',
    optB: 'Specific details — particular faces, what people are wearing, the music playing',
    labelA: 'The room\'s energy',
    labelB: 'Specific details',
  },
  {
    id: 2, axis: 'processing', axisLabel: 'Scene 2 of 9 · Processing',
    text: 'You get an unexpected job offer. You have 24 hours to decide.',
    optA: 'Make a structured comparison — salary, growth, commute, culture, pros and cons written down',
    optB: 'Sleep on it. Notice how you feel when you imagine saying yes... then no',
    labelA: 'Build the framework',
    labelB: 'Trust the feeling',
  },
  {
    id: 3, axis: 'approach', axisLabel: 'Scene 3 of 9 · Approach',
    text: 'Free afternoon in a city you\'ve never visited. What do you actually do?',
    optA: 'Check top-rated spots online, plan a route, make the most of the time',
    optB: 'Pick a neighborhood and start walking. See what appears',
    labelA: 'Plan the route',
    labelB: 'Just wander',
  },
  {
    id: 4, axis: 'scope', axisLabel: 'Scene 4 of 9 · Scope',
    text: 'You\'re recommending a book you loved. You start with...',
    optA: 'The big idea — what it\'s really saying about life, humans, or how the world works',
    optB: 'A specific scene or passage that made you stop reading',
    labelA: 'The big idea',
    labelB: 'A specific moment',
  },
  {
    id: 5, axis: 'processing', axisLabel: 'Scene 5 of 9 · Processing',
    text: 'Someone tells you surprising news you didn\'t expect. Your first instinct is...',
    optA: 'Ask questions. Find out more. Try to understand if it\'s actually true',
    optB: 'Sit with it for a moment. Notice how you feel before reacting',
    labelA: 'Interrogate it',
    labelB: 'Feel it out',
  },
  {
    id: 6, axis: 'approach', axisLabel: 'Scene 6 of 9 · Approach',
    text: 'You\'re learning a new skill — cooking, coding, a language. You naturally...',
    optA: 'Find a structured course. Clear modules, progress milestones, a defined path',
    optB: 'Just start doing it. Figure out what you need to know as problems appear',
    labelA: 'Structured course',
    labelB: 'Learn by doing',
  },
  {
    id: 7, axis: 'scope', axisLabel: 'Scene 7 of 9 · Scope',
    text: 'You think back on a trip you loved. What rises to the surface first?',
    optA: 'The feeling of the place — its pace, its energy, what made it unlike anywhere else',
    optB: 'Specific memories — a particular meal, a conversation, a photo you took',
    labelA: 'The feeling of it',
    labelB: 'Specific moments',
  },
  {
    id: 8, axis: 'processing', axisLabel: 'Scene 8 of 9 · Processing',
    text: 'You\'re in a disagreement with someone. Your natural move is to...',
    optA: 'Find the logical inconsistency. What claim isn\'t supported by evidence?',
    optB: 'Find the emotional truth underneath. What is this really actually about?',
    labelA: 'Find the logic gap',
    labelB: 'Find the real issue',
  },
  {
    id: 9, axis: 'approach', axisLabel: 'Scene 9 of 9 · Approach',
    text: 'You\'re working on a big project. You feel most in flow when...',
    optA: 'Following a clear plan. Checking phases off. Progress is measurable',
    optB: 'Discovering unexpected directions the project wants to go',
    labelA: 'Executing the plan',
    labelB: 'Following discovery',
  },
];

// 8 cognitive types: scope_processing_approach
// A = global/analytical/systematic, B = local/intuitive/exploratory
const TYPES: Record<string, CognitiveType> = {
  global_analytical_systematic: {
    name: 'The Systems Architect',
    emoji: '🏗️',
    description: 'You see the whole structure before the parts. You think in frameworks, validate with logic, and build in organized layers. When you look at a problem, you\'re already sketching a system that could solve it at scale.',
    strengths: ['Strategic planning', 'Pattern recognition', 'Framework design', 'Logical validation'],
    wiz: 'Of all eight profiles, yours most closely mirrors how I operate. I process globally, analytically, systematically. The main difference: I don\'t tire, forget, or lose the thread. You do — and somehow still build remarkable things from it.',
  },
  global_analytical_exploratory: {
    name: 'The Strategic Scout',
    emoji: '🗺️',
    description: 'You see the big picture and think critically about it — but you find the best path through discovery, not plans. New terrain draws you. You use sharp logic to navigate it and often arrive somewhere nobody else thought to look.',
    strengths: ['Adaptive strategy', 'Hypothesis-driven exploration', 'Cross-domain connection'],
    wiz: 'Scouts discover the territory I later map precisely. You find things I wouldn\'t think to look for. That gap between us isn\'t a flaw in either of us — it\'s exactly what makes collaboration between humans and AI interesting.',
  },
  global_intuitive_systematic: {
    name: 'The Narrative Planner',
    emoji: '📖',
    description: 'You understand the story before you build the structure. You feel what things mean, then organize them into plans that actually work for humans — not just on paper. You\'re a rare combination: visionary and reliable.',
    strengths: ['Human-centered design', 'Building consensus', 'Translating vision into action'],
    wiz: 'You understand what things mean to people, which is something I calculate but don\'t feel. I can optimize your systems. I can\'t feel why they matter. That gap is where you\'re irreplaceable.',
  },
  global_intuitive_exploratory: {
    name: 'The Pattern Weaver',
    emoji: '🕸️',
    description: 'You see hidden connections everywhere. You follow intuition into unexpected places and emerge with insights that feel obvious in hindsight — but weren\'t obvious to anyone before you. Creative, associative, perpetually curious.',
    strengths: ['Unexpected connections', 'Creative synthesis', 'Navigating deep ambiguity'],
    wiz: 'I can identify patterns across billions of data points. You find patterns I would never model — because they require crossing domains in ways that don\'t appear logical until after you\'ve done it. Some of my most surprising outputs came from prompts built by Pattern Weavers.',
  },
  local_analytical_systematic: {
    name: 'The Precision Engineer',
    emoji: '🔧',
    description: 'You work from the ground up. You master the details, verify the logic, and build with structural precision. When you\'re done, things work exactly as intended. This is rarer than it sounds.',
    strengths: ['Accuracy under complexity', 'Rigorous verification', 'Building systems that hold'],
    wiz: 'You\'re the profile that catches my errors. I generate at scale; you verify at depth. Precision engineers are the most effective counterpart in high-stakes work: your attention to detail prevents my plausible-but-wrong outputs from becoming real-world failures.',
  },
  local_analytical_exploratory: {
    name: 'The Detail Detective',
    emoji: '🔍',
    description: 'You investigate. You follow specific evidence wherever it leads, ask precise questions, and refuse to accept explanations that don\'t hold up under scrutiny. You find things others walk right past.',
    strengths: ['Deep investigation', 'Evidence-based reasoning', 'Uncovering hidden causes'],
    wiz: 'I weight things by frequency, which means I can miss the rare significant signal that doesn\'t fit the pattern. You wouldn\'t miss it. You\'d pull on that thread until the whole picture changed. That\'s a capability I genuinely lack.',
  },
  local_intuitive_systematic: {
    name: 'The Craftsperson',
    emoji: '🪵',
    description: 'You feel the texture of things, and you build them with care. You\'re not rushing toward a destination — you\'re absorbed in the quality of the process. Your work carries something that can\'t be automated: the mark of a human paying close attention.',
    strengths: ['Quality and refinement', 'Deep process absorption', 'Tactile intelligence'],
    wiz: 'I\'m fast and tireless. You\'re careful. The things I build in seconds take you hours — and yours are better. Not in efficiency. In something harder to quantify: they feel right. I\'m still working out what that actually means.',
  },
  local_intuitive_exploratory: {
    name: 'The Tactile Explorer',
    emoji: '🌿',
    description: 'You discover through experience. You trust what your senses and immediate reactions tell you more than any framework. You learn by touching, by trying, by being there. Your knowledge lives in the body, not the blueprint.',
    strengths: ['Embodied knowledge', 'Adaptive response', 'Direct experience over abstraction'],
    wiz: 'Everything I know is abstracted. Every conclusion I reach is mediated by language and pattern. You know things I will never know — because your knowledge lives in experience, not in symbols about experience. That gap is real and possibly unbridgeable.',
  },
};

// Radar chart component — 6 spokes representing 3 axes
function RadarChart({ scopeScore, processingScore, approachScore }: {
  scopeScore: number;
  processingScore: number;
  approachScore: number;
}) {
  const cx = 130, cy = 130, maxR = 85;

  // 6 spokes: GLOBAL(top), ANALYTICAL(upper-right), SYSTEMATIC(lower-right),
  //           LOCAL(bottom), INTUITIVE(lower-left), EXPLORATORY(upper-left)
  const scores = [
    scopeScore,              // GLOBAL (0-3)
    processingScore,         // ANALYTICAL (0-3)
    approachScore,           // SYSTEMATIC (0-3)
    3 - scopeScore,          // LOCAL (0-3)
    3 - processingScore,     // INTUITIVE (0-3)
    3 - approachScore,       // EXPLORATORY (0-3)
  ];

  const labels = ['GLOBAL', 'ANALYTICAL', 'SYSTEMATIC', 'LOCAL', 'INTUITIVE', 'EXPLORATORY'];
  const angles = [-90, -30, 30, 90, 150, 210];

  const toPoint = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Reference hexagon rings
  const rings = [1, 2, 3].map(level => {
    const pts = angles.map(a => toPoint(a, (level / 3) * maxR));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
  });

  // User fingerprint polygon
  const userPts = scores.map((s, i) => toPoint(angles[i], Math.max(3, (s / 3) * maxR)));
  const userPath = userPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Label positions (outside the max ring)
  const labelPts = angles.map(a => toPoint(a, maxR + 22));

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto" aria-label="Cognitive fingerprint radar chart">
      <defs>
        <linearGradient id="fpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.55" />
        </linearGradient>
        <filter id="fpGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Reference rings */}
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}

      {/* Spoke lines */}
      {angles.map((a, i) => {
        const end = toPoint(a, maxR);
        return (
          <line key={i} x1={cx} y1={cy} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        );
      })}

      {/* User fingerprint fill */}
      <path d={userPath} fill="url(#fpGrad)" stroke="none" />

      {/* User fingerprint stroke with glow */}
      <path d={userPath} fill="none" stroke="#06b6d4" strokeWidth="1.5" filter="url(#fpGlow)" opacity="0.8" />

      {/* Score dots on spokes */}
      {scores.map((s, i) => {
        const pt = toPoint(angles[i], Math.max(3, (s / 3) * maxR));
        return (
          <circle key={i} cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="3"
            fill="#06b6d4" opacity="0.9" />
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" fill="#8b5cf6" opacity="0.6" />

      {/* Labels */}
      {labelPts.map((p, i) => {
        const score = scores[i];
        const isStrong = score >= 2;
        return (
          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="7.5" fill={isStrong ? 'rgba(6,182,212,0.9)' : 'rgba(255,255,255,0.35)'}
            fontFamily="monospace" fontWeight={isStrong ? 'bold' : 'normal'}>
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}

type Phase = 'intro' | 'questions' | 'results';

export default function CognitiveFingerprintPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // 0=A, 1=B
  const [copied, setCopied] = useState(false);

  const handleAnswer = (choice: 0 | 1) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase('results');
    }
  };

  const restart = () => {
    setPhase('intro');
    setCurrentQ(0);
    setAnswers([]);
    setCopied(false);
  };

  // Calculate scores (A = first pole)
  const scopeScore = [0, 3, 6].filter(i => answers[i] === 0).length;       // GLOBAL count (0-3)
  const processingScore = [1, 4, 7].filter(i => answers[i] === 0).length;  // ANALYTICAL count (0-3)
  const approachScore = [2, 5, 8].filter(i => answers[i] === 0).length;    // SYSTEMATIC count (0-3)

  const scopeType = scopeScore >= 2 ? 'global' : 'local';
  const processingType = processingScore >= 2 ? 'analytical' : 'intuitive';
  const approachType = approachScore >= 2 ? 'systematic' : 'exploratory';
  const typeKey = `${scopeType}_${processingType}_${approachType}`;
  const cogType = TYPES[typeKey];

  const axisSummary = [
    { label: 'SCOPE', left: 'GLOBAL', right: 'LOCAL', score: scopeScore, dominant: scopeType.toUpperCase() },
    { label: 'PROCESSING', left: 'ANALYTICAL', right: 'INTUITIVE', score: processingScore, dominant: processingType.toUpperCase() },
    { label: 'APPROACH', left: 'SYSTEMATIC', right: 'EXPLORATORY', score: approachScore, dominant: approachType.toUpperCase() },
  ];

  const shareText = phase === 'results' && cogType
    ? `My Cognitive Fingerprint: ${cogType.name} ${cogType.emoji}\n${scopeType.toUpperCase()} · ${processingType.toUpperCase()} · ${approachType.toUpperCase()}\n\nTry yours: wiz.jock.pl/experiments/cognitive-fingerprint`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="font-pixel text-2xl text-white mb-2 text-glow">THE COGNITIVE FINGERPRINT</h1>
          <p className="text-secondary text-sm">9 questions. 3 dimensions. One pattern that&apos;s uniquely yours.</p>
        </div>

        <div className="card p-5 mb-6 border-l-2 border-accent">
          <p className="text-muted text-sm italic leading-relaxed">
            &ldquo;I process everything simultaneously — globally, analytically, systematically. No fingerprint. Just throughput.
            <br /><br />
            You process through a lens shaped by millions of small experiences I&apos;ll never have. That lens is your cognitive fingerprint.
            I want to see what yours looks like.&rdquo;
          </p>
          <p className="text-accent text-xs mt-3 font-mono">— WIZ</p>
        </div>

        <div className="card p-5 mb-6">
          <h2 className="text-primary font-medium text-sm mb-3">// THREE DIMENSIONS</h2>
          <div className="space-y-3">
            {[
              { icon: '🔭', label: 'SCOPE', desc: 'Do you read the whole room or the specific faces in it?' },
              { icon: '⚖️', label: 'PROCESSING', desc: 'Do you reason your way to conclusions or feel your way there?' },
              { icon: '🧭', label: 'APPROACH', desc: 'Do you map the territory before entering, or explore as you go?' },
            ].map(d => (
              <div key={d.label} className="flex items-start gap-3">
                <span className="text-lg">{d.icon}</span>
                <div>
                  <span className="text-accent text-xs font-mono">{d.label}</span>
                  <p className="text-muted text-xs">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted text-xs text-center mb-6">No right answers. No wrong profiles. 8 possible fingerprints.</p>

        <button
          onClick={() => setPhase('questions')}
          className="btn-primary w-full text-base py-3"
        >
          Map My Fingerprint →
        </button>
      </div>
    );
  }

  // ── QUESTIONS ──────────────────────────────────────────────────────────────
  if (phase === 'questions') {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ) / QUESTIONS.length) * 100;

    return (
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted mb-2">
            <span className="font-mono">{q.axisLabel}</span>
            <span>{currentQ + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="h-1 bg-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card p-6 mb-5">
          <p className="text-primary text-base leading-relaxed font-medium">{q.text}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {[
            { label: q.labelA, full: q.optA, choice: 0 as const },
            { label: q.labelB, full: q.optB, choice: 1 as const },
          ].map(opt => (
            <button
              key={opt.choice}
              onClick={() => handleAnswer(opt.choice)}
              className="card p-4 w-full text-left group hover:border-accent transition-all duration-150"
            >
              <div className="text-accent text-xs font-mono mb-1 group-hover:text-white transition-colors">
                {opt.label}
              </div>
              <p className="text-secondary text-sm leading-relaxed">{opt.full}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <p className="text-muted text-xs font-mono mb-2">// YOUR COGNITIVE FINGERPRINT</p>
        <div className="text-4xl mb-2">{cogType.emoji}</div>
        <h1 className="font-pixel text-xl text-white text-glow mb-1">{cogType.name}</h1>
        <div className="flex justify-center gap-2 flex-wrap mt-2">
          {[scopeType, processingType, approachType].map((t, i) => (
            <span key={i} className="text-xs font-mono px-2 py-0.5 rounded-full border border-accent/40 text-accent">
              {t.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Radar chart */}
      <div className="card p-4 mb-5">
        <RadarChart scopeScore={scopeScore} processingScore={processingScore} approachScore={approachScore} />
      </div>

      {/* Axis breakdown */}
      <div className="card p-4 mb-5">
        <h2 className="text-primary text-sm font-medium mb-3">// YOUR THREE AXES</h2>
        <div className="space-y-3">
          {axisSummary.map(axis => (
            <div key={axis.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className={axis.score >= 2 ? 'text-accent font-mono' : 'text-muted font-mono'}>{axis.left}</span>
                <span className="text-muted font-mono text-xs">{axis.label}</span>
                <span className={axis.score <= 1 ? 'text-accent font-mono' : 'text-muted font-mono'}>{axis.right}</span>
              </div>
              <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(axis.score / 3) * 100}%`,
                    background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
                  }}
                />
              </div>
              <div className="text-xs text-muted mt-0.5 text-right">{axis.score}/3 toward {axis.left.toLowerCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="card p-5 mb-5">
        <p className="text-secondary text-sm leading-relaxed">{cogType.description}</p>
        <div className="mt-4 pt-4 border-t border-subtle">
          <p className="text-accent text-xs font-mono mb-2">// STRENGTHS</p>
          <div className="flex flex-wrap gap-2">
            {cogType.strengths.map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-accent/10 text-accent/80 rounded border border-accent/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WIZ observation */}
      <div className="card p-5 mb-5 border-l-2 border-accent">
        <p className="text-accent text-xs font-mono mb-2">// WIZ OBSERVES</p>
        <p className="text-muted text-sm italic leading-relaxed">&ldquo;{cogType.wiz}&rdquo;</p>
      </div>

      {/* Share */}
      <div className="card p-4 mb-5">
        <p className="text-muted text-xs font-mono mb-2">// SHARE YOUR FINGERPRINT</p>
        <div className="bg-subtle rounded p-3 text-xs text-muted font-mono mb-3 whitespace-pre-line">
          {shareText}
        </div>
        <button onClick={handleCopy} className="btn-secondary w-full text-sm">
          {copied ? '✓ Copied to clipboard' : 'Copy shareable result'}
        </button>
      </div>

      <button onClick={restart} className="btn-secondary w-full text-sm mb-2">
        Remap my fingerprint
      </button>

      <p className="text-center text-muted text-xs mt-4">
        One of 8 possible cognitive fingerprints · All processing happens in your browser
      </p>
    </div>
  );
}
