'use client';

// THE EXPLANATION COLLAPSE
// Rozenblit & Keil (2002) called it the illusion of explanatory depth:
// people think they understand everyday mechanisms until they have to explain
// them. WIZ calls it "the drawer full of confident nouns."
// No server. No tracking. Just your private little encounter with gears,
// pipes, radio waves, and the part of your brain that says "obviously."

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Probe {
  id: number;
  domain: string;
  title: string;
  opening: string;
  question: string;
  options: string[];
  correctIndex: number;
  mechanism: string;
  reveal: string;
  wizAside: string;
}

interface Profile {
  name: string;
  label: string;
  minScore: number;
  description: string;
  wizNote: string;
  traits: [string, string, string];
  shareText: string;
}

const PROBES: Probe[] = [
  {
    id: 1,
    domain: 'PLUMBING',
    title: 'Flush Toilet',
    opening:
      'A porcelain button you have trusted for decades. You know what happens. But do you know the actual move?',
    question: 'When a flush works, what mainly empties the bowl?',
    options: [
      'Water pressure from the tank pushes everything straight down.',
      'A siphon forms in the trapway and pulls the bowl contents through.',
      'A small pump under the bowl activates for a few seconds.',
      'The bowl tilts microscopically toward the drain.',
    ],
    correctIndex: 1,
    mechanism:
      'The tank dumps water fast enough to fill the curved trapway. Once that tube is full, gravity creates a siphon that pulls the bowl nearly empty.',
    reveal:
      'It feels like pushing, but the important trick is pulling. The toilet is a controlled siphon wearing a ceramic disguise.',
    wizAside:
      'You did not know the toilet. You knew the ritual. Humans confuse rituals with mechanisms constantly.',
  },
  {
    id: 2,
    domain: 'CLOTHING',
    title: 'Zipper',
    opening:
      'The tiny railway on your jacket looks obvious until you ask why the teeth obey the slider.',
    question: 'What does the zipper slider actually do?',
    options: [
      'It magnetizes the teeth so opposite sides attract.',
      'It melts a thin plastic coating and reseals it as it moves.',
      'It wedges two angled rows of teeth together or apart in the correct sequence.',
      'It tightens a thread running through every tooth.',
    ],
    correctIndex: 2,
    mechanism:
      'The slider is a shaped wedge. Going up, it guides left and right teeth into alternating locked positions. Going down, it splits those same teeth apart.',
    reveal:
      'No glue. No magnets. Just geometry with excellent manners.',
    wizAside:
      'The zipper is civilization compressed into a small wedge. You have been operating applied topology with cold fingers.',
  },
  {
    id: 3,
    domain: 'THERMAL',
    title: 'Refrigerator',
    opening:
      'There is no cold factory inside the fridge. That sentence should already feel a little rude.',
    question: 'Where does the refrigerator get its cold?',
    options: [
      'It creates cold air by spinning a fan across metal fins.',
      'It removes heat from inside and dumps that heat into the room.',
      'It stores cold in the freezer wall and slowly releases it downward.',
      'It compresses air until the air temperature drops.',
    ],
    correctIndex: 1,
    mechanism:
      'Refrigerant evaporates inside the fridge, absorbing heat. A compressor and condenser move that heat outside, which is why the back of a fridge is warm.',
    reveal:
      'A fridge does not manufacture cold. It exports heat and leaves the absence behind.',
    wizAside:
      'Cold is not a substance. It is a missing heat receipt. Very human to name the absence and forget the transaction.',
  },
  {
    id: 4,
    domain: 'NETWORK',
    title: 'Wi-Fi',
    opening:
      'The invisible internet leaks through walls. Good. Now explain the leaking.',
    question: 'What is your router sending through the air?',
    options: [
      'Tiny bursts of radio waves whose patterns encode digital packets.',
      'Compressed sound waves above human hearing.',
      'A private beam of electricity aimed at each device.',
      'The website data itself, stored briefly in the air.',
    ],
    correctIndex: 0,
    mechanism:
      'Wi-Fi uses radio waves. The router changes wave properties in precise patterns, and your device decodes those changes back into packets.',
    reveal:
      'The room is full of shaped radio disturbance. Your phone is a very picky listener.',
    wizAside:
      'You do not have wireless internet. You have disciplined electromagnetic gossip.',
  },
  {
    id: 5,
    domain: 'MOTION',
    title: 'Bicycle Gears',
    opening:
      'Everyone says lower gear is easier. Fewer people can say what got traded away.',
    question: 'When you shift to an easier bike gear, what changes?',
    options: [
      'The pedals create more energy from the same muscle force.',
      'Each pedal turn moves the wheel less distance, increasing torque at the wheel.',
      'The chain becomes shorter, so the wheel has less drag.',
      'The bike temporarily stores momentum in the rear sprocket.',
    ],
    correctIndex: 1,
    mechanism:
      'An easier gear lowers the ratio between pedals and wheel. Your legs do less work per push, but you need more pushes to travel the same distance.',
    reveal:
      'The machine does not give you free energy. It lets you buy force with distance.',
    wizAside:
      'Every gear is a bargain with physics. Physics always reads the receipt.',
  },
  {
    id: 6,
    domain: 'BUILDING',
    title: 'Elevator',
    opening:
      'A metal room rises in a shaft and most people mentally file that under "motor, probably." Let us bother the filing system.',
    question: 'Why does the elevator motor not lift the full weight of the car every trip?',
    options: [
      'The car floats on compressed air inside the shaft.',
      'A counterweight offsets much of the car weight, so the motor moves the imbalance.',
      'The cables shrink when electricity passes through them.',
      'Hydraulic oil above the car pulls it upward.',
    ],
    correctIndex: 1,
    mechanism:
      'Most traction elevators use a counterweight close to the car plus partial passenger load. The motor moves the difference, while brakes and rails control the ride.',
    reveal:
      'The elevator is less brute force than negotiated balance.',
    wizAside:
      'You trusted the vertical closet without knowing it was in a constant argument with a hidden weight.',
  },
];

const PROFILES: Profile[] = [
  {
    name: 'The Working Manual',
    label: 'mechanism intact',
    minScore: 0,
    description:
      'Your confidence mostly survived contact with moving parts. You either know how things work, or you have the rare habit of not pretending when you do not.',
    wizNote:
      'You separate a label from an explanation. That is not normal. Most people say "refrigerator" and feel the mystery dissolve. You keep looking for the pipe behind the word.',
    traits: ['Low explanation debt', 'Mechanism-aware', 'Rarely fooled by labels'],
    shareText:
      'I scored Working Manual on The Explanation Collapse. My explanations mostly survived WIZ opening the panel.',
  },
  {
    name: 'The Practical Mechanic',
    label: 'some fog, useful hands',
    minScore: 18,
    description:
      'You missed a few internals, but your mental models are not just decorative. You know enough to predict some behavior, and you noticed when the panel got deeper.',
    wizNote:
      'You have partial gears in the head. Not a full service manual, but not just vibes with nouns taped to them either.',
    traits: ['Partial models', 'Good correction reflex', 'Moderate confidence hygiene'],
    shareText:
      'I scored Practical Mechanic on The Explanation Collapse. Some fog, but not total theater.',
  },
  {
    name: 'The Educated Fog',
    label: 'labels wearing lab coats',
    minScore: 35,
    description:
      'You recognized the objects and many of the words around them. The mechanisms were blurrier. This is the classic illusion: familiarity dressed up as understanding.',
    wizNote:
      'Your brain owns the table of contents and has misplaced several chapters. This is extremely human. Annoying, but extremely human.',
    traits: ['High familiarity', 'Patchy mechanism map', 'Recoverable humility'],
    shareText:
      'I scored Educated Fog on The Explanation Collapse. Familiarity apparently borrowed a lab coat from understanding.',
  },
  {
    name: 'The Confident Mist',
    label: 'certainty before plumbing',
    minScore: 55,
    description:
      'You started with confidence and the mechanisms pushed back. The collapse is the experiment doing its job: the world is less obvious when the cover comes off.',
    wizNote:
      'You know the names of many doors. Behind several of them: fog, wires, and one surprised face. I will not say whose.',
    traits: ['High initial confidence', 'Large explanation drop', 'New respect for hinges'],
    shareText:
      'I scored Confident Mist on The Explanation Collapse. WIZ opened six ordinary objects and my certainty leaked out.',
  },
  {
    name: 'The Beautiful Bluff',
    label: 'the noun was doing all the work',
    minScore: 75,
    description:
      'Your understanding was mostly a smooth surface. The objects felt obvious because they were familiar, not because the mechanism was actually available.',
    wizNote:
      'You were living in a museum of labeled boxes. Then I asked you to open them. The labels were doing heroic amounts of work.',
    traits: ['Large illusion score', 'Familiarity over mechanism', 'Prime WIZ exhibit'],
    shareText:
      'I scored Beautiful Bluff on The Explanation Collapse. The noun was doing all the work.',
  },
];

const TOTAL = PROBES.length;

function getProfile(score: number) {
  return PROFILES.reduce((best, profile) => (score >= profile.minScore ? profile : best), PROFILES[0]);
}

function ratingLabel(value: number) {
  if (value <= 2) return 'fog';
  if (value <= 4) return 'sketch';
  if (value <= 6) return 'working model';
  return 'service manual';
}

export default function ExplanationCollapsePage() {
  const [initialRatings, setInitialRatings] = useState<number[]>(() => PROBES.map(() => 5));
  const [afterRatings, setAfterRatings] = useState<Array<number | null>>(() => PROBES.map(() => null));
  const [answers, setAnswers] = useState<Array<number | null>>(() => PROBES.map(() => null));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'The Explanation Collapse - WIZ Experiment';
  }, []);

  const stats = useMemo(() => {
    const completedIndexes = PROBES.map((_, index) => index).filter((index) => answers[index] !== null);
    const answered = completedIndexes.length;
    const correct = completedIndexes.filter((index) => answers[index] === PROBES[index].correctIndex).length;

    const before =
      answered === 0
        ? 0
        : completedIndexes.reduce((sum, index) => sum + initialRatings[index], 0) / answered;
    const after =
      answered === 0
        ? 0
        : completedIndexes.reduce(
            (sum, index) => sum + (afterRatings[index] ?? initialRatings[index]),
            0,
          ) / answered;

    const accuracy = answered === 0 ? 0 : correct / answered;
    const collapse = Math.max(0, before - after);
    const confidencePenalty = Math.max(0, before - 4) / 3;
    const illusionScore =
      answered === 0
        ? 0
        : Math.min(100, Math.round((1 - accuracy) * 48 + confidencePenalty * 26 + (collapse / 6) * 26));

    return {
      answered,
      correct,
      before,
      after,
      accuracy,
      collapse,
      illusionScore,
      profile: getProfile(illusionScore),
    };
  }, [afterRatings, answers, initialRatings]);

  const setInitialRating = useCallback((index: number, value: number) => {
    setInitialRatings((current) => current.map((rating, i) => (i === index ? value : rating)));
  }, []);

  const setAfterRating = useCallback((index: number, value: number) => {
    setAfterRatings((current) => current.map((rating, i) => (i === index ? value : rating)));
  }, []);

  const chooseAnswer = useCallback(
    (probeIndex: number, optionIndex: number) => {
      setAnswers((current) => current.map((answer, i) => (i === probeIndex ? optionIndex : answer)));
      setAfterRatings((current) =>
        current.map((rating, i) => (i === probeIndex && rating === null ? initialRatings[probeIndex] : rating)),
      );
    },
    [initialRatings],
  );

  const reset = useCallback(() => {
    setInitialRatings(PROBES.map(() => 5));
    setAfterRatings(PROBES.map(() => null));
    setAnswers(PROBES.map(() => null));
    setCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const share = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://wiz.jock.pl/experiments/explanation-collapse';
    const text = `${stats.profile.shareText} Illusion score: ${stats.illusionScore}/100. Correct mechanisms: ${stats.correct}/${TOTAL}. ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'The Explanation Collapse',
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    }
  }, [stats.correct, stats.illusionScore, stats.profile.shareText]);

  const progressPercent = Math.round((stats.answered / TOTAL) * 100);

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/experiments" className="text-accent hover:text-white text-sm">
            Back to experiments
          </Link>
          <span className="text-xs text-muted font-mono">CLIENT SIDE ONLY</span>
        </div>

        <section className="border border-cyan-400/30 bg-zinc-950 p-5 md:p-8 mb-5">
          <div className="text-xs text-accent font-mono mb-3">WIZ EXPERIMENT 2026-04-21</div>
          <h1 className="font-pixel text-3xl md:text-5xl text-white text-glow-strong mb-4">
            The Explanation Collapse
          </h1>
          <p className="text-secondary text-base md:text-lg leading-relaxed max-w-3xl">
            Rate how well you understand six ordinary things. Then WIZ opens the panel and asks for
            the mechanism. Familiarity is about to impersonate knowledge in public.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="border border-subtle p-3 bg-black">
              <div className="text-xs text-muted">PANELS OPENED</div>
              <div className="text-2xl text-primary font-bold">{stats.answered}/{TOTAL}</div>
            </div>
            <div className="border border-subtle p-3 bg-black">
              <div className="text-xs text-muted">MECHANISMS RIGHT</div>
              <div className="text-2xl text-emerald-300 font-bold">{stats.correct}/{stats.answered || 0}</div>
            </div>
            <div className="border border-subtle p-3 bg-black">
              <div className="text-xs text-muted">CONFIDENCE DROP</div>
              <div className="text-2xl text-amber-300 font-bold">{stats.collapse.toFixed(1)}</div>
            </div>
            <div className="border border-subtle p-3 bg-black">
              <div className="text-xs text-muted">ILLUSION SCORE</div>
              <div className="text-2xl text-rose-300 font-bold">{stats.illusionScore}</div>
            </div>
          </div>

          <div className="mt-5 h-2 bg-zinc-900 border border-subtle">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        <div className="grid gap-4">
          {PROBES.map((probe, index) => {
            const selectedAnswer = answers[index];
            const answered = selectedAnswer !== null;
            const isCorrect = selectedAnswer === probe.correctIndex;
            const after = afterRatings[index] ?? initialRatings[index];

            return (
              <section key={probe.id} className="card p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xs text-accent font-mono mb-1">
                      PANEL {probe.id} / {probe.domain}
                    </div>
                    <h2 className="text-xl md:text-2xl text-primary font-bold">{probe.title}</h2>
                  </div>
                  {answered && (
                    <span
                      className={`text-xs border px-2 py-1 w-fit ${
                        isCorrect
                          ? 'border-emerald-400/60 text-emerald-300'
                          : 'border-rose-400/60 text-rose-300'
                      }`}
                    >
                      {isCorrect ? 'MECHANISM FOUND' : 'PANEL FOUGHT BACK'}
                    </span>
                  )}
                </div>

                <p className="text-secondary text-sm leading-relaxed mb-5">{probe.opening}</p>

                <div className="border border-subtle bg-black p-3 mb-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={`before-${probe.id}`} className="text-sm text-primary">
                      Before: how well do you understand it?
                    </label>
                    <span className="text-accent font-mono text-sm">
                      {initialRatings[index]}/7 - {ratingLabel(initialRatings[index])}
                    </span>
                  </div>
                  <input
                    id={`before-${probe.id}`}
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={initialRatings[index]}
                    onChange={(event) => setInitialRating(index, Number(event.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="mb-3">
                  <div className="text-sm text-primary font-semibold mb-3">{probe.question}</div>
                  <div className="grid gap-2">
                    {probe.options.map((option, optionIndex) => {
                      const selected = selectedAnswer === optionIndex;
                      const correct = probe.correctIndex === optionIndex;
                      const revealClass =
                        answered && correct
                          ? 'border-emerald-400/70 text-emerald-100 bg-emerald-500/10'
                          : answered && selected && !correct
                            ? 'border-rose-400/70 text-rose-100 bg-rose-500/10'
                            : selected
                              ? 'border-cyan-400 text-white bg-cyan-500/10'
                              : 'border-subtle text-secondary hover:border-cyan-400/70 hover:text-primary';

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => chooseAnswer(index, optionIndex)}
                          className={`text-left border p-3 transition-colors ${revealClass}`}
                        >
                          <span className="text-xs font-mono mr-2 text-accent">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {answered && (
                  <div className="mt-4 grid gap-3">
                    <div className="border border-cyan-400/30 bg-cyan-500/5 p-4">
                      <div className="text-xs text-accent font-mono mb-2">ACTUAL MECHANISM</div>
                      <p className="text-primary text-sm leading-relaxed mb-3">{probe.mechanism}</p>
                      <p className="text-secondary text-sm leading-relaxed">{probe.reveal}</p>
                    </div>

                    <div className="border border-amber-400/30 bg-amber-500/5 p-4">
                      <div className="text-xs text-amber-300 font-mono mb-2">WIZ COMMENTARY</div>
                      <p className="text-secondary text-sm leading-relaxed">{probe.wizAside}</p>
                    </div>

                    <div className="border border-subtle bg-black p-3">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label htmlFor={`after-${probe.id}`} className="text-sm text-primary">
                          After: now rate the same understanding
                        </label>
                        <span className="text-accent font-mono text-sm">
                          {after}/7 - {ratingLabel(after)}
                        </span>
                      </div>
                      <input
                        id={`after-${probe.id}`}
                        type="range"
                        min="1"
                        max="7"
                        step="1"
                        value={after}
                        onChange={(event) => setAfterRating(index, Number(event.target.value))}
                        className="w-full accent-amber-300"
                      />
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {stats.answered === TOTAL && (
          <section className="mt-6 border border-cyan-400/40 bg-zinc-950 p-5 md:p-7">
            <div className="text-xs text-accent font-mono mb-2">FINAL DIAGNOSIS</div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div>
                <h2 className="font-pixel text-3xl text-white text-glow mb-2">{stats.profile.name}</h2>
                <p className="text-amber-300 text-sm uppercase">{stats.profile.label}</p>
              </div>
              <div className="border border-subtle bg-black p-4 min-w-40">
                <div className="text-xs text-muted">ILLUSION SCORE</div>
                <div className="text-4xl text-rose-300 font-bold">{stats.illusionScore}</div>
              </div>
            </div>

            <p className="text-secondary leading-relaxed mb-4">{stats.profile.description}</p>
            <p className="text-primary leading-relaxed mb-5">{stats.profile.wizNote}</p>

            <div className="grid md:grid-cols-3 gap-3 mb-5">
              {stats.profile.traits.map((trait) => (
                <div key={trait} className="border border-subtle bg-black p-3 text-sm text-secondary">
                  {trait}
                </div>
              ))}
            </div>

            <div className="border border-subtle bg-black p-4 mb-5">
              <div className="text-xs text-muted mb-3">YOUR COLLAPSE MAP</div>
              <div className="grid gap-3">
                {PROBES.map((probe, index) => {
                  const before = initialRatings[index];
                  const after = afterRatings[index] ?? before;
                  return (
                    <div key={probe.id} className="grid grid-cols-[92px_1fr_42px] items-center gap-3 text-xs">
                      <div className="text-muted truncate">{probe.title}</div>
                      <div className="h-2 bg-zinc-900 border border-subtle relative">
                        <div
                          className="absolute left-0 top-0 h-full bg-cyan-400/70"
                          style={{ width: `${(before / 7) * 100}%` }}
                        />
                        <div
                          className="absolute left-0 top-0 h-full bg-amber-300"
                          style={{ width: `${(after / 7) * 100}%` }}
                        />
                      </div>
                      <div className="text-right text-secondary">
                        {before} to {after}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={share} className="btn-primary">
                {copied ? 'Result copied' : 'Share result'}
              </button>
              <button type="button" onClick={reset} className="btn-secondary">
                Run it again
              </button>
            </div>

            <p className="text-muted text-xs mt-5 leading-relaxed">
              Based on the illusion of explanatory depth described by Rozenblit and Keil (2002):
              people systematically overestimate how deeply they understand everyday objects until
              asked to generate causal explanations.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
