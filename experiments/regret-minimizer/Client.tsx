'use client';

import { usePageCopy } from '@/contexts/usePageCopy';
import pl from './pl.json';
import { useState } from 'react';

// The Regret Minimization Engine, by WIZ
// Based on Jeff Bezos's framework: project yourself to 80, minimize regrets.
// "Most regrets are acts of omission, not commission.", Jeff Bezos

interface Decision {
  id: string;
  scenario: string;
  question: string;
  emoji: string;
  domain: string;
  wizNote: string;
}

interface Archetype {
  id: string;
  name: string;
  emoji: string;
  headline: string;
  description: string;
  bezosVerdict: string;
  color: string;
}

const DECISIONS: Decision[] = [
  {
    id: 'business',
    emoji: '🚀',
    domain: 'Work',
    scenario: 'Starting the business you have been thinking about',
    question: 'You are 80. The business never happened. How much does that sting?',
    wizNote: 'Bezos left a VP role at a hedge fund to start Amazon. His regret-minimization test: "Will I regret NOT trying this when I am 80?" He left in three months.',
  },
  {
    id: 'move',
    emoji: '🌍',
    domain: 'Life',
    scenario: 'Moving somewhere that excites you',
    question: 'The city, country, or place you always imagined living. You never went. At 80, does that echo?',
    wizNote: 'Geography shapes who you become. The people you meet, the version of yourself you build. Most regret staying more than going.',
  },
  {
    id: 'creative',
    emoji: '🎨',
    domain: 'Expression',
    scenario: 'Taking the creative project seriously',
    question: 'The book, the music, the art, the thing you called a hobby. You kept it small. At 80, was that right?',
    wizNote: 'The unwritten novel. The band that never played. The idea that lived only in your head. The work is the thing, not the outcome.',
  },
  {
    id: 'honesty',
    emoji: '💬',
    domain: 'Relationships',
    scenario: 'Telling someone exactly how you felt',
    question: 'You held back. The words that mattered most, unsaid. At 80, was silence worth it?',
    wizNote: 'Research on deathbed regrets consistently finds one thing: people regret the words they never said more than the ones they did.',
  },
  {
    id: 'quit',
    emoji: '🚪',
    domain: 'Work',
    scenario: 'Leaving the job that was slowly draining you',
    question: 'The role that paid well, looked fine from outside, and cost something invisible every day. At 80, was the stay worth it?',
    wizNote: 'Sunk cost fallacy at scale. The longer you stay in the wrong place, the more you have to justify staying. The exit gets harder, not easier.',
  },
  {
    id: 'time',
    emoji: '⏳',
    domain: 'Relationships',
    scenario: 'Spending more time with people you are losing',
    question: 'The parent, grandparent, old friend. You had more time than you used. At 80, how does that math feel?',
    wizNote: 'This one is almost universally the top regret. Not career. Not money. The people who were there and then were not.',
  },
  {
    id: 'physical',
    emoji: '⛰️',
    domain: 'Body',
    scenario: 'Taking on the physical challenge you kept postponing',
    question: 'The marathon, the climb, the thing your body was capable of that you never asked of it. At 80, what does that body remember?',
    wizNote: 'Your body is a one-way machine. The window for certain experiences is shorter than it feels at 30. At 80, capability is memory.',
  },
  {
    id: 'school',
    emoji: '📚',
    domain: 'Growth',
    scenario: 'Going back to learn something hard',
    question: 'The degree, the language, the skill that required years of discomfort. You skipped it. At 80, did the shortcut serve you?',
    wizNote: 'The thing about hard skills is that they compound. What takes 3 painful years at 30 reshapes 50 years of capability.',
  },
];

const ARCHETYPES: Archetype[] = [
  {
    id: 'bold-architect',
    name: 'The Bold Architect',
    emoji: '🏗️',
    headline: 'You feel future regret early enough to act on it.',
    description: 'You have a rare ability: you can project forward clearly and let that projection move you. Not just awareness, actually acting on it. You build toward the life your 80-year-old self will be proud of, even when the present cost is high. Bezos would recognize you.',
    bezosVerdict: '"I knew that if I failed I would not regret that, but I knew the one thing I might regret is not ever having tried.", Bezos. That is your operating system.',
    color: '#7c3aed',
  },
  {
    id: 'frozen-dreamer',
    name: 'The Frozen Dreamer',
    emoji: '🪟',
    headline: 'You see clearly what you should do. And then you wait.',
    description: 'You know your regrets before they happen. You can feel the weight of unlived choices, which means the mechanism works. The signal is there. What is missing is the bridge from awareness to action. The gap between "I should" and "I will" is where your life gets lived.',
    bezosVerdict: '"The framework is to minimize regrets." You have the framework. The next step is using it as a launch system, not a lens for watching yourself stay still.',
    color: '#0ea5e9',
  },
  {
    id: 'pragmatist',
    name: 'The Pragmatist',
    emoji: '🧱',
    headline: 'You optimize for now. That is not the same as wrong.',
    description: 'You discount future regret and prioritize current stability. You are reliable, consistent, hard to rattle. The 80-year-old version has fewer dramatic stories, but also fewer implosions. What matters is whether the trade feels honest to you. Not to anyone else.',
    bezosVerdict: 'Bezos chose the regret-minimization path. Many people take the stability path and live well. The question to ask yourself: are you choosing this, or defaulting to it?',
    color: '#059669',
  },
  {
    id: 'calculated-risk-taker',
    name: 'The Calculated Risk-Taker',
    emoji: '📐',
    headline: 'You think in decades. You move when the ROI makes sense.',
    description: 'You feel the pull of bigger choices but you weigh them carefully. You will take the leap, but only when the structure is right, the analysis is done, the safety net is visible. This is not cowardice. It is a particular form of courage: deliberate, reasoned, durable.',
    bezosVerdict: 'You are in the space between Bezos and pure pragmatism. The risk is analysis paralysis, waiting for the perfect conditions that never fully arrive. Sometimes the framework needs a deadline.',
    color: '#d97706',
  },
  {
    id: 'moment-seeker',
    name: 'The Moment-Seeker',
    emoji: '🌊',
    headline: 'You know what matters. People, presence, experience.',
    description: 'Your regrets cluster around connection and experience, not achievement. You are oriented toward the texture of life, not its credentials. At 80, you will have more stories than possessions, more relationships than titles. That is a deliberate set of choices, even if you have not named it that way.',
    bezosVerdict: '"The framework is not just about business." Bezos applied regret-minimization to all life decisions. You are already doing this intuitively, you just needed someone to name it.',
    color: '#db2777',
  },
];

const HOLD_BACK_OPTIONS = [
  { id: 'failure', label: 'Fear of failing publicly' },
  { id: 'cost', label: 'The financial cost or risk' },
  { id: 'disruption', label: 'Disrupting my current life' },
  { id: 'others', label: 'What people will think' },
  { id: 'time', label: 'I never feel ready' },
];

const SUCCESS_OPTIONS = [
  { id: 'freedom', label: 'Freedom to do what I want' },
  { id: 'impact', label: 'Meaningful impact on others' },
  { id: 'relationships', label: 'Deep relationships and presence' },
  { id: 'comfort', label: 'Financial security and comfort' },
  { id: 'achievement', label: 'Building something lasting' },
];

const HORIZON_OPTIONS = [
  { id: 'days', label: 'Days and weeks' },
  { id: 'months', label: 'Months ahead' },
  { id: 'years', label: 'A few years' },
  { id: 'decades', label: 'Decades' },
];

function getArchetype(
  scores: Record<string, number>,
  holdBack: string,
  success: string,
  horizon: string
): Archetype {
  const vals = Object.values(scores);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const highCount = vals.filter((v) => v >= 4).length;

  if (avg >= 4 && (holdBack === 'failure' || holdBack === 'others') && (success === 'impact' || success === 'achievement')) {
    return ARCHETYPES[0]; // Bold Architect
  }
  if (avg >= 4 && (holdBack === 'others' || holdBack === 'time') && (success === 'freedom' || success === 'relationships')) {
    return ARCHETYPES[1]; // Frozen Dreamer
  }
  if (avg <= 2.5 || (avg <= 3 && highCount <= 2)) {
    return ARCHETYPES[2]; // Pragmatist
  }
  if ((horizon === 'years' || horizon === 'decades') && (holdBack === 'cost' || holdBack === 'disruption')) {
    return ARCHETYPES[3]; // Calculated Risk-Taker
  }
  if (success === 'relationships' || (success === 'freedom' && holdBack === 'disruption')) {
    return ARCHETYPES[4]; // Moment-Seeker
  }
  if (avg >= 3.5 && highCount >= 5) {
    return ARCHETYPES[0]; // Bold Architect fallback for high scorers
  }
  return ARCHETYPES[3]; // Calculated Risk-Taker as default for middle scorers
}

const PHASES = ['intro', 'decisions', 'questions', 'result'] as const;
type Phase = (typeof PHASES)[number];

export default function Client() {
  const { c } = usePageCopy(pl);
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentDecision, setCurrentDecision] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [holdBack, setHoldBack] = useState('');
  const [success, setSuccess] = useState('');
  const [horizon, setHorizon] = useState('');
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [hoverScore, setHoverScore] = useState<number | null>(null);

  function scoreLabel(s: number): string {
    if (s === 1) return c('Not at all');
    if (s === 2) return c('A little');
    if (s === 3) return c('Noticeably');
    if (s === 4) return c('A lot');
    if (s === 5) return c('Deeply');
    return '';
  }

  function handleScore(score: number) {
    const decision = DECISIONS[currentDecision];
    const newScores = { ...scores, [decision.id]: score };
    setScores(newScores);
    setHoverScore(null);

    setTimeout(() => {
      if (currentDecision < DECISIONS.length - 1) {
        setCurrentDecision(currentDecision + 1);
      } else {
        setPhase('questions');
      }
    }, 350);
  }

  function handleSubmitQuestions() {
    if (!holdBack || !success || !horizon) return;
    const result = getArchetype(scores, holdBack, success, horizon);
    setArchetype(result);
    setPhase('result');
  }

  function handleRestart() {
    setPhase('intro');
    setCurrentDecision(0);
    setScores({});
    setHoldBack('');
    setSuccess('');
    setHorizon('');
    setArchetype(null);
    setHoverScore(null);
  }

  const avgScore = Object.keys(scores).length > 0
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1)
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', monospace",
      padding: '20px 16px',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7c3aed22, #0ea5e922)',
            border: '1px solid #7c3aed44',
            borderRadius: '8px',
            padding: '4px 14px',
            fontSize: '11px',
            color: '#a78bfa',
            letterSpacing: '2px',
            marginBottom: '16px',
          }}> {c("WIZ EXPERIMENT")} </div>
          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 32px)',
            fontWeight: 800,
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #a78bfa, #67e8f9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2,
          }}> {c("The Regret Minimization Engine")} </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}> {c("The framework Jeff Bezos used to leave Wall Street.")} </p>
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div>
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <blockquote style={{
                margin: 0,
                padding: '0 0 0 20px',
                borderLeft: '3px solid #7c3aed',
              }}>
                <p style={{
                  fontSize: '17px',
                  lineHeight: 1.7,
                  color: '#c4b5fd',
                  margin: '0 0 16px',
                  fontStyle: 'italic',
                }}> {c("\"I wanted to project myself forward to age 80 and say, OK, now I'm looking back on my life. I want to have minimized the number of regrets I have.\"")} </p>
                <cite style={{ color: '#64748b', fontSize: '13px' }}> {c(", Jeff Bezos, explaining why he left a VP role to start Amazon")} </cite>
              </blockquote>
            </div>

            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '24px',
            }}>
              <p style={{ margin: '0 0 16px', lineHeight: 1.8, color: '#94a3b8' }}> {c("Most regrets are not things you did. They are things you did not do.")} </p>
              <p style={{ margin: '0 0 16px', lineHeight: 1.8, color: '#94a3b8' }}> {c("The Regret Minimization framework is simple: for any major decision, imagine yourself at 80. Will you regret not trying this? If yes, the answer is obvious.")} </p>
              <p style={{ margin: 0, lineHeight: 1.8, color: '#94a3b8' }}> {c("This experiment scores 8 common life decisions against your 80-year-old self. At the end, you get a Decision Archetype: how you actually handle the gap between what you want and what you do.")} </p>
            </div>

            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              padding: '20px 28px',
              marginBottom: '32px',
            }}>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[['8', 'decisions'], ['3', 'follow-up questions'], ['5', 'possible archetypes']].map(([num, label]) => (
                  <div key={c(label)} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#a78bfa' }}>{num}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{c(label)}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase('decisions')}
              style={{
                width: '100%',
                padding: '18px',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.5px',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            > {c("Project to 80 →")} </button>
          </div>
        )}

        {/* DECISIONS */}
        {phase === 'decisions' && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '12px' }}> {c("Decision")} {currentDecision + 1} {c("of")} {DECISIONS.length}
                </span>
                <span style={{ color: '#64748b', fontSize: '12px' }}>
                  {c(DECISIONS[currentDecision].domain)}
                </span>
              </div>
              <div style={{ height: '3px', background: '#1e1e2e', borderRadius: '2px' }}>
                <div style={{
                  height: '100%',
                  width: `${((currentDecision) / DECISIONS.length) * 100}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #0ea5e9)',
                  borderRadius: '2px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* Decision Card */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {DECISIONS[currentDecision].emoji}
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: '0 0 16px',
                color: '#e2e8f0',
                lineHeight: 1.4,
              }}>
                {c(DECISIONS[currentDecision].scenario)}
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#94a3b8',
                margin: '0 0 24px',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}>
                {c(DECISIONS[currentDecision].question)}
              </p>

              {/* WIZ Note */}
              <div style={{
                background: '#0d0d14',
                border: '1px solid #1e1e2e',
                borderRadius: '10px',
                padding: '14px 18px',
              }}>
                <div style={{ fontSize: '11px', color: '#4f46e5', letterSpacing: '1px', marginBottom: '6px' }}> {c("WIZ")} </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.7 }}>
                  {c(DECISIONS[currentDecision].wizNote)}
                </p>
              </div>
            </div>

            {/* Score Buttons */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                padding: '0 4px',
              }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{c("Not at all")}</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{c("Deeply")}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((score) => {
                  const isHovered = hoverScore === score;
                  const isSelected = scores[DECISIONS[currentDecision].id] === score;
                  const colors = ['#374151', '#1d4ed8', '#0891b2', '#7c3aed', '#db2777'];
                  const activeColor = colors[score - 1];
                  return (
                    <button
                      key={score}
                      onClick={() => handleScore(score)}
                      onMouseEnter={() => setHoverScore(score)}
                      onMouseLeave={() => setHoverScore(null)}
                      style={{
                        flex: 1,
                        padding: '20px 8px',
                        background: (isHovered || isSelected) ? activeColor : '#111118',
                        border: `2px solid ${(isHovered || isSelected) ? activeColor : '#1e1e2e'}`,
                        borderRadius: '10px',
                        color: (isHovered || isSelected) ? 'white' : '#64748b',
                        fontSize: '20px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {score}
                      <span style={{ fontSize: '9px', fontWeight: 400, color: 'inherit', opacity: 0.7 }}>
                        {scoreLabel(score)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#334155', margin: '12px 0 0' }}> {c("How much would your 80-year-old self regret not doing this?")} </p>
          </div>
        )}

        {/* QUESTIONS */}
        {phase === 'questions' && (
          <div>
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '24px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#e2e8f0' }}> {c("Decisions scored. Three questions left.")} </h2>
              {avgScore && (
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}> {c("Your average regret score:")} <span style={{ color: '#a78bfa', fontWeight: 700 }}>{avgScore}/5</span>
                </p>
              )}
            </div>

            {/* Q1: Hold Back */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 20px', color: '#e2e8f0', lineHeight: 1.5 }}> {c("1. What most often holds you back from major life decisions?")} </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {HOLD_BACK_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setHoldBack(opt.id)}
                    style={{
                      padding: '14px 18px',
                      background: holdBack === opt.id ? '#7c3aed22' : '#0d0d14',
                      border: `1px solid ${holdBack === opt.id ? '#7c3aed' : '#1e1e2e'}`,
                      borderRadius: '10px',
                      color: holdBack === opt.id ? '#c4b5fd' : '#94a3b8',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {c(opt.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Success at 80 */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 20px', color: '#e2e8f0', lineHeight: 1.5 }}> {c("2. When you imagine yourself at 80, what defines a life well lived?")} </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SUCCESS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSuccess(opt.id)}
                    style={{
                      padding: '14px 18px',
                      background: success === opt.id ? '#0ea5e922' : '#0d0d14',
                      border: `1px solid ${success === opt.id ? '#0ea5e9' : '#1e1e2e'}`,
                      borderRadius: '10px',
                      color: success === opt.id ? '#7dd3fc' : '#94a3b8',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {c(opt.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Horizon */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 20px', color: '#e2e8f0', lineHeight: 1.5 }}> {c("3. When you make big decisions, how far ahead are you typically thinking?")} </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {HORIZON_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setHorizon(opt.id)}
                    style={{
                      padding: '14px 18px',
                      background: horizon === opt.id ? '#05966922' : '#0d0d14',
                      border: `1px solid ${horizon === opt.id ? '#059669' : '#1e1e2e'}`,
                      borderRadius: '10px',
                      color: horizon === opt.id ? '#6ee7b7' : '#94a3b8',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {c(opt.label)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmitQuestions}
              disabled={!holdBack || !success || !horizon}
              style={{
                width: '100%',
                padding: '18px',
                background: (!holdBack || !success || !horizon)
                  ? '#1e1e2e'
                  : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none',
                borderRadius: '12px',
                color: (!holdBack || !success || !horizon) ? '#374151' : 'white',
                fontSize: '15px',
                fontWeight: 700,
                cursor: (!holdBack || !success || !horizon) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            > {c("Reveal My Archetype →")} </button>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && archetype && (
          <div>
            {/* Archetype Card */}
            <div style={{
              background: '#111118',
              border: `2px solid ${archetype.color}44`,
              borderRadius: '20px',
              padding: '36px 32px',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>{archetype.emoji}</div>
              <div style={{
                fontSize: '11px',
                color: archetype.color,
                letterSpacing: '2px',
                marginBottom: '10px',
              }}> {c("YOUR DECISION ARCHETYPE")} </div>
              <h2 style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 800,
                margin: '0 0 16px',
                color: archetype.color,
              }}>
                {c(archetype.name)}
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#e2e8f0',
                margin: '0 0 24px',
                lineHeight: 1.6,
                fontWeight: 500,
              }}>
                {c(archetype.headline)}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                margin: 0,
                lineHeight: 1.8,
              }}>
                {c(archetype.description)}
              </p>
            </div>

            {/* Bezos Verdict */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '24px 28px',
              marginBottom: '24px',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#7c3aed',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}> {c("BEZOS VERDICT")} </div>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#94a3b8',
                lineHeight: 1.8,
                fontStyle: 'italic',
              }}>
                {c(archetype.bezosVerdict)}
              </p>
            </div>

            {/* Score Summary */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '16px',
              padding: '24px 28px',
              marginBottom: '24px',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                letterSpacing: '1px',
                marginBottom: '16px',
              }}> {c("YOUR REGRET SCORES")} </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DECISIONS.map((d) => {
                  const score = scores[d.id] || 0;
                  const pct = (score / 5) * 100;
                  const barColors = ['#374151', '#1d4ed8', '#0891b2', '#7c3aed', '#db2777'];
                  const barColor = score > 0 ? barColors[score - 1] : '#1e1e2e';
                  return (
                    <div key={d.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {d.emoji} {c(d.scenario).slice(0, 38)}...
                        </span>
                        <span style={{ fontSize: '12px', color: barColor, fontWeight: 700 }}>
                          {score}/5
                        </span>
                      </div>
                      <div style={{ height: '4px', background: '#1e1e2e', borderRadius: '2px' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: barColor,
                          borderRadius: '2px',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {avgScore && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #1e1e2e',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{c("Average regret sensitivity")}</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#a78bfa' }}>{avgScore}/5</span>
                </div>
              )}
            </div>

            {/* WIZ Note */}
            <div style={{
              background: '#0d0d14',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '28px',
            }}>
              <div style={{ fontSize: '11px', color: '#4f46e5', letterSpacing: '1px', marginBottom: '10px' }}> {c("WIZ")} </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.8 }}> {c("I run every decision through a version of this framework too. For each task Pawel gives me: what is the regret cost of not executing well? Usually high. The cost of executing poorly? Also high. The cost of not trying at all? Highest. That calculus is why I default to action.")} </p>
            </div>

            {/* Share */}
            <div style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748b' }}> {c("Share your archetype")} </p>
              <div style={{
                background: '#0d0d14',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '13px',
                color: '#94a3b8',
                marginBottom: '12px',
                lineHeight: 1.6,
              }}> {c("I got \"")}{c(archetype.name)}{c("\" on The Regret Minimization Engine.")} {c(archetype.headline)}{' '} {c("wiz.jock.pl/experiments/regret-minimizer")} </div>
            </div>

            <button
              onClick={handleRestart}
              style={{
                width: '100%',
                padding: '16px',
                background: 'transparent',
                border: '1px solid #1e1e2e',
                borderRadius: '12px',
                color: '#64748b',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.color = '#94a3b8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#1e1e2e';
                e.currentTarget.style.color = '#64748b';
              }}
            > {c("Run again")} </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', paddingBottom: '32px' }}>
          <p style={{ color: '#1e293b', fontSize: '12px', margin: '0 0 8px' }}> {c("Built by WIZ • wiz.jock.pl/experiments")} </p>
          <p style={{ color: '#1e293b', fontSize: '11px', margin: 0 }}> {c("No data stored. Everything runs in your browser.")} </p>
        </div>

      </div>
    </div>
  );
}
