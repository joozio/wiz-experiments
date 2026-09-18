'use client';

// THE EMOTIONAL WEATHER REPORT
// 8 questions. Your emotional patterns become meteorology.
// WIZ note: I've processed millions of human communication patterns.
// The metaphor isn't decorative — weather is the closest physical model
// for how emotions actually work. Pressure systems. Fronts. Microclimates.
// Let me read the sky.

import { useState } from 'react';

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string; scores: Partial<Record<ClimateKey, number>> }[];
}

type ClimateKey = 'mediterranean' | 'temperate' | 'continental' | 'arctic' | 'monsoon' | 'stormchaser';

interface ClimateProfile {
  name: string;
  emoji: string;
  tagline: string;
  headline: string;
  conditions: string[];
  forecast: string;
  advisory: string;
  shareText: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'When something difficult happens, your first response is to:',
    options: [
      { id: 'a', text: 'Analyze it carefully before letting yourself feel it', scores: { arctic: 2, continental: 1 } },
      { id: 'b', text: 'Feel it all at once, then make sense of it later', scores: { mediterranean: 2, monsoon: 1 } },
      { id: 'c', text: 'Push it down and keep moving — process it eventually', scores: { monsoon: 2, arctic: 1 } },
      { id: 'd', text: 'Call someone and talk it through immediately', scores: { temperate: 2, mediterranean: 1 } },
    ],
  },
  {
    id: 2,
    text: 'Your emotional baseline on most days feels like:',
    options: [
      { id: 'a', text: 'Calm and settled — a clear sky with low pressure', scores: { arctic: 2, temperate: 1 } },
      { id: 'b', text: 'Mildly restless — something always seems to be building', scores: { stormchaser: 2, continental: 1 } },
      { id: 'c', text: 'Energized and alive — warm front always moving in', scores: { mediterranean: 2, stormchaser: 1 } },
      { id: 'd', text: 'Tired but okay — overcast without rain', scores: { monsoon: 2, temperate: 1 } },
    ],
  },
  {
    id: 3,
    text: 'When strong emotions arrive, they tend to:',
    options: [
      { id: 'a', text: 'Pass quickly — intense but brief, like summer storms', scores: { mediterranean: 2, stormchaser: 1 } },
      { id: 'b', text: 'Linger a day or two — slow-moving pressure systems', scores: { temperate: 2, continental: 1 } },
      { id: 'c', text: 'Stay for weeks — deep atmospheric patterns', scores: { monsoon: 2, arctic: 1 } },
      { id: 'd', text: 'Transform into something else entirely — one front becomes another', scores: { continental: 2, temperate: 1 } },
    ],
  },
  {
    id: 4,
    text: 'Others would probably describe you emotionally as:',
    options: [
      { id: 'a', text: 'Calm and difficult to read — still surface, unknown depths', scores: { arctic: 2, monsoon: 1 } },
      { id: 'b', text: 'Expressive and intense — you know exactly where the weather is', scores: { mediterranean: 2, stormchaser: 1 } },
      { id: 'c', text: 'Warm and steady — safe harbor in any forecast', scores: { temperate: 2, mediterranean: 1 } },
      { id: 'd', text: 'Unpredictable but interesting — the weather people track', scores: { stormchaser: 2, continental: 1 } },
    ],
  },
  {
    id: 5,
    text: 'When you\'re genuinely happy, you:',
    options: [
      { id: 'a', text: 'Feel it quietly and privately — sunshine that doesn\'t need announcing', scores: { arctic: 2, monsoon: 1 } },
      { id: 'b', text: 'Share it immediately — warmth radiates outward automatically', scores: { mediterranean: 2, stormchaser: 1 } },
      { id: 'c', text: 'Wait to see if it lasts before trusting it', scores: { monsoon: 2, continental: 1 } },
      { id: 'd', text: 'Look for what could go wrong — the incoming front', scores: { arctic: 2, continental: 1 } },
    ],
  },
  {
    id: 6,
    text: 'Conflict feels like:',
    options: [
      { id: 'a', text: 'A clearing storm — messy but the air is better after', scores: { mediterranean: 2, stormchaser: 1 } },
      { id: 'b', text: 'A tornado — get to the basement, survive it, assess damage later', scores: { monsoon: 2, arctic: 1 } },
      { id: 'c', text: 'A cold front — unpleasant, predictable, passes on schedule', scores: { temperate: 2, continental: 1 } },
      { id: 'd', text: 'Background atmospheric noise that never fully stops', scores: { arctic: 2, monsoon: 1 } },
    ],
  },
  {
    id: 7,
    text: 'The overall pattern of your emotional life:',
    options: [
      { id: 'a', text: 'Pretty consistent across the year — mild variations, nothing dramatic', scores: { temperate: 2, arctic: 1 } },
      { id: 'b', text: 'Clear dramatic seasons — you know winter is coming and spring follows', scores: { continental: 2, mediterranean: 1 } },
      { id: 'c', text: 'Long flat stretches, then total downpour — then flat again', scores: { monsoon: 3 } },
      { id: 'd', text: 'Constantly shifting — something interesting always developing', scores: { stormchaser: 2, temperate: 1 } },
    ],
  },
  {
    id: 8,
    text: 'When someone near you is emotionally struggling:',
    options: [
      { id: 'a', text: 'You absorb their weather automatically — their clouds become yours', scores: { mediterranean: 2, monsoon: 1 } },
      { id: 'b', text: 'You analyze what they need and deploy it systematically', scores: { arctic: 2, continental: 1 } },
      { id: 'c', text: 'You give them space and monitor conditions from a distance', scores: { temperate: 2, arctic: 1 } },
      { id: 'd', text: 'You actively try to change the weather — cloud seeding the situation', scores: { stormchaser: 2, mediterranean: 1 } },
    ],
  },
];

const PROFILES: Record<ClimateKey, ClimateProfile> = {
  mediterranean: {
    name: 'Mediterranean',
    emoji: '☀️',
    tagline: 'Warm and expressive with occasional storms',
    headline: 'CURRENT CONDITIONS: Warm, sunny with intermittent emotional intensity',
    conditions: [
      'High emotional conductivity — feelings travel fast and far',
      'Recovery is swift — storms pass, sun returns',
      'Strong interpersonal warmth — others are drawn to your climate',
      'Occasional dramatic spikes in intensity, but they clear',
    ],
    forecast: 'Expect continued warmth with periodic thunderstorms that resolve within hours. Long-term outlook: inviting, reliable, occasionally spectacular.',
    advisory: 'Your climate is one of the most liveable. The risk: intensity that surprises even you. When the storm comes, ride it — it won\'t last.',
    shareText: 'WIZ read my emotional climate: Mediterranean ☀️ Warm and expressive with occasional clearing storms.',
  },
  temperate: {
    name: 'Temperate Maritime',
    emoji: '🌤️',
    tagline: 'Mild and steady with surprise squalls',
    headline: 'CURRENT CONDITIONS: Mild, mostly settled, occasional unexpected gusts',
    conditions: [
      'Emotionally reliable baseline — predictable in the best way',
      'Strong capacity for sudden brief intensity when triggered',
      'High interpersonal trust — people know what to expect',
      'Self-regulating system — returns to baseline naturally',
    ],
    forecast: 'Mostly mild with some notable exceptions when conditions align. Annual average: above comfortable. Peak intensity rare but real.',
    advisory: 'You\'re the climate people build houses in. Occasional squalls surprise even you — but they don\'t define the forecast. Trust your baseline.',
    shareText: 'WIZ read my emotional climate: Temperate Maritime 🌤️ Mild and steady — with the occasional surprise squall.',
  },
  continental: {
    name: 'Continental',
    emoji: '🌦️',
    tagline: 'Dramatic seasons, intense extremes',
    headline: 'CURRENT CONDITIONS: Variable. Check the season.',
    conditions: [
      'Strong seasonal variation — emotional highs and lows follow clear patterns',
      'Dramatic temperature swings between openness and withdrawal',
      'Long summers and long winters — when it\'s good, it\'s very good',
      'Others know your seasons once they\'ve experienced them',
    ],
    forecast: 'Seasonal intensity likely to continue. Winters may be prolonged. Summers worth waiting for. Pattern suggests clear cycle with reliable return to warmth.',
    advisory: 'You have extraordinary range. The challenge: others may struggle with the extremes. Naming your seasons helps people navigate your weather.',
    shareText: 'WIZ read my emotional climate: Continental 🌦️ Dramatic seasons — intense winters, extraordinary summers.',
  },
  arctic: {
    name: 'Arctic Pressure Dome',
    emoji: '🌨️',
    tagline: 'Still surface, extraordinary interior depth',
    headline: 'CURRENT CONDITIONS: Calm. Do not be deceived by the surface.',
    conditions: [
      'High pressure of emotional containment — rarely leaks',
      'Interior processing: deep, thorough, invisible to observers',
      'Intensity when released is significant — pressure builds slowly',
      'Others often underestimate the depth of your emotional weather',
    ],
    forecast: 'Continued stillness at surface level. Subsurface activity likely elevated. Rare but notable release events when pressure exceeds containment threshold.',
    advisory: 'You process the most. Show the least. This is efficient — until the pressure finds another outlet. Controlled release is your upgrade.',
    shareText: 'WIZ read my emotional climate: Arctic Pressure Dome 🌨️ Still surface, extraordinary depth underneath.',
  },
  monsoon: {
    name: 'Monsoon',
    emoji: '⛈️',
    tagline: 'Long dry seasons followed by total release',
    headline: 'CURRENT CONDITIONS: Checking whether this is the dry season or the flooding.',
    conditions: [
      'Long periods of emotional drought — contained, functional, fine',
      'Release is total when it comes — everything held comes down at once',
      'The cycle is real and has its own logic',
      'Recovery after flooding is often surprisingly complete',
    ],
    forecast: 'If currently in dry season: release event building. If in flooding: will resolve. Pattern suggests reliable cycle. Average annual emotional precipitation: high.',
    advisory: 'The monsoon cycle is ancient and useful. The risk is accumulation — more held means more released. Controlled irrigation prevents the flood.',
    shareText: 'WIZ read my emotional climate: Monsoon ⛈️ Long dry seasons, then total release. The cycle is real.',
  },
  stormchaser: {
    name: 'Storm Chaser',
    emoji: '🌪️',
    tagline: 'Most alive when the weather gets interesting',
    headline: 'CURRENT CONDITIONS: Actively seeking high-pressure systems',
    conditions: [
      'Elevated emotional metabolism — calm registers as absence, not peace',
      'Strongest engagement during intensity — high-weather states',
      'Highly attuned to atmospheric changes in self and others',
      'Mild weather can feel like weather failure',
    ],
    forecast: 'Expect continued active engagement with high-intensity emotional systems. Voluntary calm periods possible but require sustained effort. Best conditions: interesting.',
    advisory: 'Your weather sensitivity is a gift. The shadow: you may generate storms when none exist, just to feel the atmosphere. Peace is also weather.',
    shareText: 'WIZ read my emotional climate: Storm Chaser 🌪️ Most alive when the weather gets interesting.',
  },
};

export default function EmotionalWeatherReport() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<ClimateKey | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);

  const calculateResult = (finalAnswers: string[]): ClimateKey => {
    const scores: Record<ClimateKey, number> = {
      mediterranean: 0,
      temperate: 0,
      continental: 0,
      arctic: 0,
      monsoon: 0,
      stormchaser: 0,
    };

    finalAnswers.forEach((answerId, qIndex) => {
      const question = QUESTIONS[qIndex];
      const option = question.options.find((o) => o.id === answerId);
      if (option) {
        Object.entries(option.scores).forEach(([key, value]) => {
          scores[key as ClimateKey] += value;
        });
      }
    });

    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as ClimateKey;
  };

  const handleAnswer = (optionId: string) => {
    if (isTransitioning) return;
    setSelectedOption(optionId);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, optionId];
      setAnswers(newAnswers);

      if (currentQuestion + 1 >= QUESTIONS.length) {
        const climate = calculateResult(newAnswers);
        setResult(climate);
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
    setResult(null);
    setIsTransitioning(false);
  };

  const handleCopy = () => {
    if (!result) return;
    const profile = PROFILES[result];
    const text = `${profile.shareText}\n\nTry yours: wiz.jock.pl/experiments/emotional-weather-report`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (result) {
    const profile = PROFILES[result];

    return (
      <div className="max-w-2xl mx-auto">
        {/* Broadcast Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ METEOROLOGICAL SERVICE — LIVE BROADCAST
          </div>
          <div className="text-6xl mb-4">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            {profile.name.toUpperCase()}
          </h1>
          <p className="text-accent font-mono text-sm">{profile.tagline}</p>
        </div>

        {/* Headline Forecast */}
        <div className="card p-5 mb-5 border-accent/30">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// HEADLINE FORECAST</div>
          <p className="text-primary text-sm leading-relaxed">{profile.headline}</p>
        </div>

        {/* Conditions */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// OBSERVED CONDITIONS</div>
          <div className="space-y-2">
            {profile.conditions.map((condition, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-accent flex-shrink-0 font-mono">{'▸'}</span>
                <span className="text-secondary">{condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extended Forecast */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// EXTENDED FORECAST</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.forecast}</p>
        </div>

        {/* Advisory */}
        <div className="card p-5 mb-6 border border-accent/20 bg-accent/5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// WIZ CLIMATE ADVISORY</div>
          <p className="text-primary text-sm leading-relaxed italic">&ldquo;{profile.advisory}&rdquo;</p>
        </div>

        {/* Other Climates */}
        <div className="card p-4 mb-6">
          <div className="font-mono text-xs text-muted mb-3 tracking-wider">// OTHER CLIMATE TYPES</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(PROFILES) as [ClimateKey, ClimateProfile][])
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
            {copied ? '✓ Copied' : 'Share forecast'}
          </button>
          <button onClick={handleReset} className="btn-secondary text-sm">
            New reading
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-subtle text-center">
          <p className="text-muted text-xs">
            WIZ Meteorological Service — All readings processed locally, nothing transmitted to cloud.
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

  const question = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-3xl mb-3">🌦️</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          EMOTIONAL WEATHER REPORT
        </h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          8 questions. WIZ reads your emotional patterns and broadcasts your personal climate.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-muted mb-2">
          <span>ATMOSPHERIC READING</span>
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
        <div className="font-mono text-xs text-accent mb-3 tracking-wider">
          // CONDITION {currentQuestion + 1}
        </div>
        <p className="text-primary text-base leading-relaxed mb-5">{question.text}</p>

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
        All readings local. No weather data leaves your device.
      </p>
    </div>
  );
}
