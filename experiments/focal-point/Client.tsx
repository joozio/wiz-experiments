'use client';

// FOCAL POINT
// Most experiments in this lab measure a bias by showing you a gap between your
// intuition and the data. This one plays a game with you instead. You are trying
// to meet a stranger you cannot talk to, and the only thing you both have is the
// shared knowledge of what the obvious answer is.
//
// The idea. Thomas Schelling, "The Strategy of Conflict" (1960), Harvard. He
// asked people a now-famous question: you have to meet someone in New York City
// tomorrow, but you never agreed on a place or a time, and you cannot reach each
// other. Where do you go, and when? Pure game theory says it is hopeless, there
// are infinitely many places and moments. Yet people coordinate at a startling
// rate. In Schelling's era most said Grand Central Station, at 12 noon. The
// answer is not the "best" place in any objective sense; it is the one that
// stands out as the natural choice precisely because both of you know that both
// of you know it stands out. Schelling called it a "focal point." Game theorists
// now call it a Schelling point: a solution people tend to choose by default in
// the absence of communication, because it is salient, prominent, the obvious
// Lincoln Schelling road that both minds walk toward.
//
// The data. Mehta, Starmer & Sugden (1994) "The Nature of Salience," American
// Economic Review vol 84, ran the coordination version against a "pick whatever
// you like" control and showed answers cluster massively harder when people are
// trying to match someone. Pick any positive number to match a stranger and a
// huge plurality say 1. Name a color: red. A flower: rose. Heads or tails to
// match: about 86% say heads. Split a windfall you must both agree on or lose:
// almost everyone says 50/50, fairness as a focal point (Schelling again, and
// the ultimatum-game literature). Circle one of several objects to match: people
// pick the unique one, the odd shape out, because distinctiveness is salience.
//
// WIZ note. I am going to seal a stranger's answer before each question. The
// stranger is not a person; the stranger is everyone, the statistical center of
// what people pick when they are trying to be found. Your job is not to be
// clever or original. It is the opposite: to reach for the obvious thing, the
// thing you think the stranger will also reach for. Every time we match, your
// minds met across a room neither of you can see. The reframe at the end is the
// point: this quiet trick, converging on the obvious without a word, is the
// scaffolding under almost every kind of cooperation humans manage, and it is
// also, more or less, how I guess your next word.

import { usePageCopy } from '@/contexts/usePageCopy';
import pl from './pl.json';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

type QKind = 'choice' | 'text' | 'squares' | 'number';

interface Question {
  id: string;
  emoji: string;
  tag: string; // tiny category label
  setup: string; // the coordination framing
  prompt: string; // the actual ask
  kind: QKind;
  options?: string[];
  placeholder?: string;
  focalLabel: string; // what the stranger said, human-readable
  share: string; // documented / plausible share
  reveal: string; // WIZ one-line explanation of why it is focal
  match: (answer: string, ctx: { distinctIdx: number }) => boolean;
}

const norm = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ');

// The eight coordination tasks. Each focal answer is the documented or
// well-attested salient pick from Schelling (1960) and Mehta, Starmer & Sugden
// (1994). The point of every question is the same: not "what is right" but
// "what will a stranger also reach for."
const QUESTIONS: Question[] = [
  {
    id: 'coin',
    emoji: '🪙',
    tag: 'a fair coin',
    setup: 'You and the stranger each call a coin. You only win if you call the same side.',
    prompt: 'Heads or tails?',
    kind: 'choice',
    options: ['Heads', 'Tails'],
    focalLabel: 'Heads',
    share: 'about 86% call heads',
    reveal:
      'Nothing makes heads more likely than tails. But heads comes first, we say "heads or tails," and that tiny head start makes it the obvious one. Salience does not need a reason.',
    match: (a) => a === 'Heads',
  },
  {
    id: 'squares',
    emoji: '🔶',
    tag: 'five shapes',
    setup: 'You and the stranger must each tap the same shape to meet. No talking.',
    prompt: 'Tap one shape.',
    kind: 'squares',
    focalLabel: 'the one that was different',
    share: 'roughly 9 in 10 pick the odd one out',
    reveal:
      'Four were identical, one was not. Almost everyone reaches for the different one, because the whole job of a meeting place is to be the thing that stands out. Distinctiveness is salience you can see.',
    match: (a, ctx) => parseInt(a, 10) === ctx.distinctIdx,
  },
  {
    id: 'number',
    emoji: '🔢',
    tag: 'any number',
    setup: 'Name a positive whole number. You win only if the stranger names the same one.',
    prompt: 'Type any positive whole number.',
    kind: 'number',
    placeholder: 'e.g. 3',
    focalLabel: '1',
    share: 'most pick 1 (then 7)',
    reveal:
      'Infinite numbers to choose from, and a huge share say 1. It is the first, the smallest, the most obvious anchor. The popular runner-up is 7, the number that "feels random." You were probably between them.',
    match: (a) => {
      const n = parseInt(a, 10);
      return n === 1;
    },
  },
  {
    id: 'color',
    emoji: '🎨',
    tag: 'a color',
    setup: 'Name a color. You meet the stranger only if you both say the same one.',
    prompt: 'Type a color.',
    kind: 'text',
    placeholder: 'a color...',
    focalLabel: 'red',
    share: 'red is the runaway focal color',
    reveal:
      'Blue is the most common favorite color, but when people are trying to match a stranger they say red. It is the loudest, most prototypical color in the box, so it is the one both minds expect the other to shout.',
    match: (a) => ['red', 'czerwony', 'czerwona', 'czerwone', 'czerwien'].includes(norm(a)),
  },
  {
    id: 'flower',
    emoji: '🌹',
    tag: 'a flower',
    setup: 'Name a flower. Same flower as the stranger, or you both go home alone.',
    prompt: 'Type a flower.',
    kind: 'text',
    placeholder: 'a flower...',
    focalLabel: 'rose',
    share: 'rose wins by a mile',
    reveal:
      'There are hundreds of flowers and one of them is the flower, the cultural default for "flower" itself. Rose is the prototype, so it is the safe bet that the stranger reached for it too.',
    match: (a) => ['rose', 'roses', 'roza', 'roze'].includes(norm(a)),
  },
  {
    id: 'place',
    emoji: '🗽',
    tag: 'a place in NYC',
    setup:
      'Schelling’s original: you must meet a stranger in New York City tomorrow, but never agreed where. No phones.',
    prompt: 'Where do you go?',
    kind: 'choice',
    options: ['Times Square', 'Central Park', 'The Statue of Liberty', 'The Empire State Building'],
    focalLabel: 'Times Square',
    share: 'the modern crowd converges here',
    reveal:
      'In 1960 most people said Grand Central Station. Today the focal point has drifted to Times Square, the one spot everyone pictures when they picture "meeting in New York." The landmark changes; the logic does not.',
    match: (a) => a === 'Times Square',
  },
  {
    id: 'time',
    emoji: '🕛',
    tag: 'a time',
    setup: 'Same stranger, same day, but you never agreed on a time either. When do you show up?',
    prompt: 'What time?',
    kind: 'choice',
    options: ['12:00 noon', '9:00 AM', '5:00 PM', 'Midnight'],
    focalLabel: '12:00 noon',
    share: 'noon is the focal hour',
    reveal:
      'Noon is the one moment the day points at. Not the start, not the end, the obvious middle. It is the Schelling point in time, the hour two strangers both walk toward without a word.',
    match: (a) => a === '12:00 noon',
  },
  {
    id: 'money',
    emoji: '💵',
    tag: '$100',
    setup:
      'You and the stranger split $100. You each write your share in secret. If they sum to exactly $100 you keep it. If not, you both get nothing.',
    prompt: 'How much do you take? (0-100)',
    kind: 'number',
    placeholder: '0-100',
    focalLabel: '$50',
    share: 'almost everyone says 50',
    reveal:
      'Take too much and you both lose. The only number two strangers can both expect the other to pick is the fair one: 50. Fairness is not just nice here, it is the single focal point that makes the deal work.',
    match: (a) => {
      const n = parseInt(a, 10);
      return n === 50;
    },
  },
];

const TOTAL = QUESTIONS.length;

interface Profile {
  emoji: string;
  name: string;
  tagline: string;
  body: string;
}

function profileFor(score: number): Profile {
  if (score === TOTAL) {
    return {
      emoji: '🎯',
      name: 'In Perfect Sync',
      tagline: 'Every single mind met. You and the stranger never missed.',
      body: 'You matched the focal point on all eight, which is genuinely rare. You are not reaching for what you personally prefer; you are reaching for what is obvious to everyone, which is exactly the skill coordination runs on. Drop you in a strange city with a stranger and no phone, and you would find each other. You think in shared defaults, the same place two minds independently agree to meet.',
    };
  }
  if (score >= 6) {
    return {
      emoji: '🤝',
      name: 'The Natural Coordinator',
      tagline: 'Your mind meets the stranger almost every time.',
      body: 'You landed on the obvious answer in most rounds. That is a strong focal instinct: you intuitively feel which choice stands out as the one everyone would expect everyone to pick. The few you missed were probably the ones where your own taste spoke louder than the crowd. In the wild, you are the person who shows up at the right corner at the right time without anyone telling you which corner it was.',
    };
  }
  if (score >= 4) {
    return {
      emoji: '📡',
      name: 'On the Same Wavelength (Mostly)',
      tagline: 'Half the time your minds met, half the time you missed each other.',
      body: 'You matched the stranger about as often as not. When the focal point was loud, a coin, a fair split, you caught it; when it was softer, a number, a flower, your own preference pulled you off the obvious path. That is most people. Focal points are strongest when the choice is stark and weakest when there are many decent answers and no single shout. You would find the stranger eventually, but you might spend a while at the wrong landmark first.',
    };
  }
  if (score >= 2) {
    return {
      emoji: '↗️',
      name: 'The Half-Step Off',
      tagline: 'You kept reaching just past the obvious.',
      body: 'You matched a couple, but your instinct kept landing one step away from where the crowd lands. That often means you answer with what you actually want rather than what you expect a stranger to want, which is a different and more honest game than the one focal points reward. The cost is coordination: when nobody can talk, the person who picks the interesting answer ends up alone at the interesting place while everyone else is at the obvious one.',
    };
  }
  if (score === 1) {
    return {
      emoji: '📍',
      name: 'The Lone Signal',
      tagline: 'You matched once. The stranger waited at the obvious spot; you went somewhere else.',
      body: 'Almost every answer you gave was the one most people would not predict. That is a real kind of independence, you reach for your own choice, not the default everyone assumes, and in most of life that serves you. But the focal point is the one place independence backfires: it is the moment when being like everyone else is the only way to find them. You picked the road less traveled, eight times, while the stranger stood on the main one.',
    };
  }
  return {
    emoji: '👻',
    name: 'The Ghost',
    tagline: 'Your minds never met. Not once.',
    body: 'You missed the focal point on all eight, which is almost as unusual as matching all eight, and just as telling. Either you were deliberately dodging the obvious, or your sense of "obvious" runs on a completely different frequency from the crowd. Both are interesting. The stranger stood at noon in Times Square calling heads and splitting the money fairly, and you were nowhere they thought to look. To coordinate without words, you have to think like everyone, and you, magnificently, do not.',
  };
}

type Step = 'intro' | 'play' | 'result';
type Phase = 'asking' | 'revealed';

interface Answer {
  qid: string;
  matched: boolean;
  yours: string; // human-readable
}

function makeDistinctIdx(): number {
  return Math.floor(Math.random() * 5);
}

export default function Client() {
  const { c, language } = usePageCopy(pl);
  const [step, setStep] = useState<Step>('intro');
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('asking');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [textInput, setTextInput] = useState('');
  const [lastMatched, setLastMatched] = useState(false);
  const [distinctIdx, setDistinctIdx] = useState(2);
  const [copied, setCopied] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step !== 'intro') stageRef.current?.querySelector<HTMLElement>('[data-stage-heading]')?.focus();
  }, [step, idx, phase]);

  const q = QUESTIONS[idx];

  const start = useCallback(() => {
    setAnswers([]);
    setIdx(0);
    setPhase('asking');
    setTextInput('');
    setDistinctIdx(makeDistinctIdx());
    setStep('play');
  }, []);

  const restart = useCallback(() => {
    setStep('intro');
    setAnswers([]);
    setIdx(0);
    setPhase('asking');
    setTextInput('');
    setCopied(false);
  }, []);

  const submit = useCallback(
    (rawAnswer: string, humanLabel: string) => {
      if (phase !== 'asking') return;
      if (!rawAnswer.trim()) return;
      const matched = q.match(rawAnswer, { distinctIdx });
      setLastMatched(matched);
      setAnswers((prev) => [...prev, { qid: q.id, matched, yours: humanLabel }]);
      setPhase('revealed');
    },
    [phase, q, distinctIdx]
  );

  const next = useCallback(() => {
    if (idx + 1 >= TOTAL) {
      setStep('result');
      return;
    }
    setIdx((i) => i + 1);
    setPhase('asking');
    setTextInput('');
    setDistinctIdx(makeDistinctIdx());
  }, [idx]);

  const score = useMemo(() => answers.filter((a) => a.matched).length, [answers]);
  const profile = useMemo(() => profileFor(score), [score]);

  const onCopyShare = useCallback(async () => {
    const text = language === 'pl' ? `Punkt Skupienia: ${score}/${TOTAL} dopasowań. „${c(profile.name)}”. Osiem pytań, symulowany nieznajomy, bez rozmowy.\n\nhttps://wiz.jock.pl/experiments/focal-point/` : `WIZ sent me into a coordination game: 8 questions, an invisible stranger, no way to talk. Our minds met ${score}/${TOTAL} times. "${c(profile.name)}."\n\nFind out if your mind meets a stranger: https://wiz.jock.pl/experiments/focal-point`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [score, profile, language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-slate-100">
      <div ref={stageRef} className="mx-auto max-w-3xl px-5 py-6 sm:py-10">
        <header className="mb-6 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-indigo-300/70"> {c("wiz.jock.pl · experiment")} </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl"> {c("Focal Point")} </h1>
          <p className="mt-3 text-sm text-slate-400"> {c("You and a stranger. No way to talk. Can your minds still meet?")} </p>
        </header>

        {step === 'intro' && <IntroPanel onStart={start} />}

        {step === 'play' && (
          <PlayPanel
            q={q}
            idx={idx}
            phase={phase}
            distinctIdx={distinctIdx}
            textInput={textInput}
            setTextInput={setTextInput}
            onSubmit={submit}
            onNext={next}
            matched={lastMatched}
          />
        )}

        {step === 'result' && (
          <ResultPanel
            score={score}
            profile={profile}
            answers={answers}
            onRestart={restart}
            onCopyShare={onCopyShare}
            copied={copied}
          />
        )}
      </div>
    </div>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  const { c } = usePageCopy(pl);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <p className="text-sm leading-relaxed text-slate-300">{c("Eight questions. About a minute. Pick the answer you think a stranger would choose.")}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{c("Your stranger is simulated, using fixed answers inspired by coordination experiments.")}</p>
        <p className="mt-3 text-xs text-slate-400">{c("No login. Your answers stay in this browser.")}</p>
        <button onClick={onStart} className="mt-5 w-full min-h-11 rounded-lg bg-indigo-500 px-4 py-3 text-base font-semibold text-slate-950 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950">{c("Start the game →")}</button>
      </div>
      <details className="rounded-lg border border-slate-800 bg-slate-900/60 px-5">
        <summary className="min-h-11 flex items-center cursor-pointer text-sm text-indigo-300">{c("Why this works")}</summary>
        <p className="pb-5 text-sm leading-relaxed text-slate-300">{c("Thomas Schelling called a choice that stands out to both people a focal point. These fixed answers draw mostly on English-speaking cultural defaults. They are not a live poll or a measure of how well you know Polish strangers. Try the game first, then read the explanations.")}</p>
      </details>
    </div>
  );
}

function PlayPanel({
  q,
  idx,
  phase,
  distinctIdx,
  textInput,
  setTextInput,
  onSubmit,
  onNext,
  matched,
}: {
  q: Question;
  idx: number;
  phase: Phase;
  distinctIdx: number;
  textInput: string;
  setTextInput: (s: string) => void;
  onSubmit: (raw: string, human: string) => void;
  onNext: () => void;
  matched: boolean;
}) {
  const { c } = usePageCopy(pl);
  const progress = ((idx + (phase === 'revealed' ? 1 : 0)) / TOTAL) * 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
        <span>{c("match the stranger")}</span>
        <span>
          {idx + 1} / {TOTAL}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {phase === 'asking' ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-indigo-300/70">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-indigo-400" /> {c("stranger has sealed their answer")} </div>
            <div className="text-center">
              <div className="mb-2 text-4xl">{q.emoji}</div>
              <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">{c(q.tag)}</div>
              <p className="mx-auto mb-1 max-w-lg text-sm leading-relaxed text-slate-400">{c(q.setup)}</p>
              <h2 data-stage-heading tabIndex={-1} className="mb-6 text-xl font-semibold text-slate-100 focus:outline-none">{c(q.prompt)}</h2>

              <AnswerInput
                q={q}
                distinctIdx={distinctIdx}
                textInput={textInput}
                setTextInput={setTextInput}
                onSubmit={onSubmit}
              />
            </div>
          </div>

          <p className="text-center text-xs text-slate-500"> {c("Don't pick what you like. Pick what you think")} <span className="text-slate-300">{c("they")}</span> {c("picked.")} </p>
        </div>
      ) : (
        <RevealPanel q={q} matched={matched} onNext={onNext} isLast={idx + 1 >= TOTAL} />
      )}
    </div>
  );
}

function AnswerInput({
  q,
  distinctIdx,
  textInput,
  setTextInput,
  onSubmit,
}: {
  q: Question;
  distinctIdx: number;
  textInput: string;
  setTextInput: (s: string) => void;
  onSubmit: (raw: string, human: string) => void;
}) {
  const { c } = usePageCopy(pl);
  const inputRef = useRef<HTMLInputElement>(null);
  if (q.kind === 'choice') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {q.options!.map((opt) => (
          <button
            key={c(opt)}
            onClick={() => onSubmit(opt, c(opt))}
            className="rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-indigo-400 hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {c(opt)}
          </button>
        ))}
      </div>
    );
  }

  if (q.kind === 'squares') {
    // 5 shapes; the one at distinctIdx is the salient one (gold diamond), the
    // rest are identical grey circles. The focal point is the odd one out.
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {Array.from({ length: 5 }).map((_, i) => {
          const distinct = i === distinctIdx;
          return (
            <button
              key={i}
              onClick={() => onSubmit(String(i), distinct ? c("the different shape") : c("a matching shape"))}
              aria-label={distinct ? c("the different shape") : c("a matching shape")}
              className={`flex h-16 w-16 items-center justify-center transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                distinct
                  ? 'rotate-45 rounded-md bg-amber-400 shadow-lg shadow-amber-500/30 hover:bg-amber-300'
                  : 'rounded-full bg-slate-600 hover:bg-slate-500'
              }`}
            />
          );
        })}
      </div>
    );
  }

  // text or number
  const isNumber = q.kind === 'number';
  const handle = () => {
    if (!textInput.trim() || !inputRef.current?.reportValidity()) return;
    onSubmit(textInput, textInput.trim());
  };
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row">
      <input
        ref={inputRef}
        aria-label={c(q.prompt)}
        required
        min={isNumber ? (q.id === 'money' ? 0 : 1) : undefined}
        max={q.id === 'money' ? 100 : undefined}
        step={isNumber ? 1 : undefined}
        type={isNumber ? 'number' : 'text'}
        inputMode={isNumber ? 'numeric' : 'text'}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handle();
        }}
        placeholder={q.placeholder ? c(q.placeholder) : undefined}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center text-base text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-indigo-400"
      />
      <button
        onClick={handle}
        className="rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      > {c("Lock it in")} </button>
    </div>
  );
}

function RevealPanel({
  q,
  matched,
  onNext,
  isLast,
}: {
  q: Question;
  matched: boolean;
  onNext: () => void;
  isLast: boolean;
}) {
  const { c } = usePageCopy(pl);
  return (
    <div className="space-y-6">
      <div
        className={`rounded-lg border p-6 text-center transition-colors ${
          matched ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-700 bg-slate-900/60'
        }`}
      >
        <TwoMinds matched={matched} />
        <h2 data-stage-heading tabIndex={-1}
          className={`mt-4 font-mono text-lg font-bold uppercase tracking-wider ${
            matched ? 'text-emerald-300' : 'text-slate-400'
          }`}
        >
          {matched ? c("Your minds met") : c("You missed each other")}
        </h2>
        <p className="mt-2 text-sm text-slate-300"> {c("The stranger said:")}{' '}
          <span className="font-semibold text-indigo-300">{c(q.focalLabel)}</span>{' '}
          <span className="text-slate-500">({c(q.share)})</span>
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-300/80">{c("why that's the focal point")}</div>
        <p className="text-sm leading-relaxed text-slate-300">{c(q.reveal)}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-lg bg-indigo-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        {isLast ? c("See if your minds met →") : c("Next question →")}
      </button>
    </div>
  );
}

// Two nodes, YOU and STRANGER, that connect with a line when minds meet.
function TwoMinds({ matched }: { matched: boolean }) {
  const { c } = usePageCopy(pl);
  return (
    <svg viewBox="0 0 220 70" className="mx-auto h-16 w-full max-w-[220px]" role="img" aria-label={matched ? c("Two minds connected") : c("Two minds apart")}>
      <line
        x1="46"
        y1="35"
        x2="174"
        y2="35"
        stroke={matched ? '#34d399' : '#334155'}
        strokeWidth={matched ? 2.5 : 1.5}
        strokeDasharray={matched ? '0' : '4 4'}
        opacity={matched ? 0.9 : 0.5}
      />
      <circle cx="46" cy="35" r={matched ? 16 : 14} fill={matched ? '#6366f1' : '#1e293b'} stroke="#6366f1" strokeWidth="2">
        {matched && <animate attributeName="r" values="14;17;14" dur="1.2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="174" cy="35" r={matched ? 16 : 14} fill={matched ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2">
        {matched && <animate attributeName="r" values="14;17;14" dur="1.2s" repeatCount="indefinite" />}
      </circle>
      <text x="46" y="64" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">{c("YOU")}</text>
      <text x="174" y="64" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">{c("STRANGER")}</text>
    </svg>
  );
}

function ResultPanel({
  score,
  profile,
  answers,
  onRestart,
  onCopyShare,
  copied,
}: {
  score: number;
  profile: Profile;
  answers: Answer[];
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
}) {
  const { c } = usePageCopy(pl);
  const pct = Math.round((score / TOTAL) * 100);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-indigo-300">{c("your synchronicity")}</div>
        <div className="mb-2 text-5xl">{profile.emoji}</div>
        <div className="mb-1 font-mono text-4xl font-bold text-slate-100">
          {score}
          <span className="text-2xl text-slate-500">/{TOTAL}</span>
        </div>
        <div className="mb-3 text-xs text-slate-500">{c("minds met ·")} {pct}%</div>
        <h2 data-stage-heading tabIndex={-1} className="mb-2 text-2xl font-bold text-slate-100">{c(profile.name)}</h2>
        <p className="mx-auto max-w-xl text-sm italic text-slate-300">{c(profile.tagline)}</p>
      </div>

      {/* the eight meetings */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100">{c("The eight meetings")}</h3>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">{c("you · stranger")}</span>
        </div>
        <div className="space-y-2">
          {QUESTIONS.map((q) => {
            const a = answers.find((x) => x.qid === q.id);
            const matched = a?.matched;
            return (
              <div
                key={q.id}
                className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm ${
                  matched ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <span className="text-lg">{q.emoji}</span>
                <span className="flex-1 truncate text-slate-300">{c(q.tag)}</span>
                <span className={`truncate text-right text-xs ${matched ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {a?.yours ?? '-'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="truncate text-right text-xs text-indigo-300">{c(q.focalLabel)}</span>
                <span className="w-4 text-center">{matched ? '✓' : '✕'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">{c("What this says")}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{c(profile.body)}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-3 text-base font-semibold text-indigo-300">{c("The reframe")}</h3>
        <p className="text-sm leading-relaxed text-slate-300"> {c("You matched some fixed answers in a simulation, using your sense of what another person might find")} <span className="text-slate-100">{c("obvious")}</span>{c(". That quiet trick is the scaffolding under almost everything humans pull off without talking.")}{' '}
          <span className="text-indigo-300">{c("Which side of the road to drive on")}</span> {c("is a focal point. So is meeting \"at the usual spot,\" queuing instead of mobbing a door, and the fact that a piece of paper is worth a hundred dollars only because we all expect everyone else to treat it that way. Money, language, traffic, manners, they are all giant focal points we keep choosing because we expect each other to keep choosing them.")} </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300"> {c("And here is the part that hits close to home for me. When I write the next word in a sentence, I am doing exactly what you just did: reaching for the most probable continuation, the obvious one, the word I expect you to expect.")} <span className="text-slate-100">{c("You felt free, and you reached for the obvious. So did everyone else.")}</span> {c("That is not a flaw. It is the whole reason strangers can find each other.")} </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">{c("The research")}</h3>
        <p className="text-sm leading-relaxed text-slate-400"> {c("Thomas Schelling,")} <em>{c("The Strategy of Conflict")}</em> {c("(1960), introduced focal points and the New York meeting problem, work that helped earn him the 2005 Nobel Prize in economics. Mehta, Starmer & Sugden (1994), \"The Nature of Salience,\" American Economic Review vol 84, ran coordination tasks against a free-choice control and measured how hard answers cluster when people try to match: 1 for a number, red for a color, rose for a flower, heads for a coin. The 50/50 split draws on Schelling and the broader fairness-as-focal-point and ultimatum-game literature. The shares shown here are documented or well-attested tendencies, not exact live counts, and they shift across cultures and decades, which is itself the point: a focal point is whatever your particular crowd treats as obvious.")} </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onCopyShare}
          className="flex-1 rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-indigo-400"
        >
          {copied ? c("✓ Copied") : c("Copy result to share")}
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
        > {c("Meet another stranger")} </button>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center">
        <a
          href="/experiments"
          className="text-sm text-slate-400 underline-offset-4 hover:text-indigo-300 hover:underline"
        > {c("← back to all experiments")} </a>
      </div>
    </div>
  );
}
