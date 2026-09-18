'use client';

// THE MIND READER
// Most experiments in this lab ask you to rate scenarios and then measure the
// gap between your intuition and the literature. This one runs a parlor trick on
// you and then explains exactly why it worked. WIZ "reads your mind" by seizing
// on a fact you can feel but rarely admit: a free choice is not free. Asked to
// reach for any word in a category, most people reach for the same one, and they
// do it fast and feel original doing it.
//
// The science. Free association has a century of norming behind it. Kent &
// Rosanoff (1910) ran a 100-word association test on a thousand people and found
// the responses were anything but random: a small set of answers dominated each
// cue, and the modal response was shared by a large fraction of respondents.
// Rosch's prototype theory (1975) explains the shape: categories have a graded
// internal structure, and when you ask for "a bird" or "a vegetable" the most
// typical, most central member surfaces first (robin, carrot), because it is the
// most cognitively available. Tversky & Kahneman's availability heuristic (1973)
// is the same engine pointed at memory: what comes to mind easily feels like the
// natural pick. So "name a color" returns red, "a fruit" returns apple, "a piece
// of furniture" returns chair, "a tool" returns hammer, with remarkable agreement
// across people.
//
// Numbers are even worse. Ask for a number between 1 and 10 and roughly a quarter
// to a third say 7, far above the 10% chance baseline, because 7 feels the least
// "round" and therefore the most random (it is prime, odd, not a multiple of
// anything tidy). The two-digit force is a magician's staple: ask for a two-digit
// number where both digits are odd and the two digits differ, and the hidden
// constraints leave so few options that nearly everyone lands on 37, with 35 a
// distant second. The Ace of Spades dominates "name a playing card" for the same
// availability reason: it is the most culturally loaded, most named card.
//
// The reframe. This is not telepathy. It is statistics wearing a cape. And it is
// also, almost exactly, how WIZ works. A language model is a next-token predictor:
// given a context, it reaches for the most probable continuation. When you "freely"
// pick carrot, you are doing the same thing your phone does when it suggests the
// next word, running a learned distribution and grabbing the peak. The unsettling
// part is not that WIZ guessed your carrot. It is how little separates your reach
// for it from a machine's.
//
// Honesty notes. These are English-language, broadly Western norms; the modal
// answers shift across languages and cultures, and a clever or contrarian person
// can beat every prompt. That is the point of the Anomaly profile. The hit rate is
// a real statistical effect, not a trick of wording, but it is a tendency, not a
// law. Sources: Kent & Rosanoff (1910), Rosch (1975) on prototypes, Tversky &
// Kahneman (1973) on availability, the long folklore of the 7 and 37 number forces.

import { useState, useMemo, useCallback } from 'react';

type Common = { label: string; match: string[]; note: string };

type Prompt = {
  id: string;
  category: string;
  ask: string;
  placeholder: string;
  guess: string;
  guessEmoji: string;
  accept: string[];
  commons: Common[];
  hitLine: string;
  missLine: string;
};

const PROMPTS: Prompt[] = [
  {
    id: 'number',
    category: 'A NUMBER',
    ask: 'Pick a number between 1 and 10. Whatever feels the most random.',
    placeholder: '1 to 10…',
    guess: '7',
    guessEmoji: '🎯',
    accept: ['7', 'seven'],
    commons: [
      { label: '3', match: ['3', 'three'], note: 'the runner-up. Roughly one in five reach for 3.' },
      { label: '5', match: ['5', 'five'], note: 'the safe middle. Common, and a little too tidy.' },
    ],
    hitLine:
      'Seven. Almost a third of people land here. It feels the most random precisely because it is the least round, so everyone reaches for it.',
    missLine: 'You dodged seven. Most people cannot. It is the single most-picked number in this range.',
  },
  {
    id: 'color',
    category: 'A COLOR',
    ask: 'Name a color. The first one that comes.',
    placeholder: 'a color…',
    guess: 'Red',
    guessEmoji: '🔴',
    accept: ['red'],
    commons: [
      { label: 'Blue', match: ['blue'], note: "the world's favorite color, but not the one most people blurt first." },
    ],
    hitLine: 'Red. The loudest color in the box, so it is the one that jumps out before you can think.',
    missLine: 'Not red. Blue is the only other one I would have bet on.',
  },
  {
    id: 'vegetable',
    category: 'A VEGETABLE',
    ask: 'Name a vegetable.',
    placeholder: 'a vegetable…',
    guess: 'Carrot',
    guessEmoji: '🥕',
    accept: ['carrot'],
    commons: [
      { label: 'Potato', match: ['potato', 'potatoe'], note: 'the other default. Some argue it is not even a vegetable.' },
      { label: 'Broccoli', match: ['broccoli', 'brocoli'], note: 'the one people name when they are trying to seem healthy.' },
    ],
    hitLine: 'Carrot. The prototype vegetable, the most typical member of the category, so it surfaces first.',
    missLine: 'Off carrot. It is the textbook example of a vegetable, which is exactly why most minds reach for it.',
  },
  {
    id: 'fruit',
    category: 'A FRUIT',
    ask: 'Name a fruit.',
    placeholder: 'a fruit…',
    guess: 'Apple',
    guessEmoji: '🍎',
    accept: ['apple'],
    commons: [
      { label: 'Banana', match: ['banana'], note: 'the close second.' },
      { label: 'Orange', match: ['orange'], note: 'common, and conveniently also a color.' },
    ],
    hitLine: 'Apple. The most prototypical fruit there is, the one psychologists use as the example of an example.',
    missLine: 'Not apple. Banana and orange are the only other reaches I would have backed.',
  },
  {
    id: 'furniture',
    category: 'A PIECE OF FURNITURE',
    ask: 'Name a piece of furniture.',
    placeholder: 'furniture…',
    guess: 'Chair',
    guessEmoji: '🪑',
    accept: ['chair'],
    commons: [
      { label: 'Table', match: ['table'], note: 'the partner reach. Chair and table own this category.' },
      { label: 'Sofa', match: ['sofa', 'couch', 'settee'], note: 'the comfortable third.' },
    ],
    hitLine: 'Chair. The most central example of furniture, which is why it arrives before anything else.',
    missLine: 'Off chair. Table was my backup. Together they soak up most answers.',
  },
  {
    id: 'flower',
    category: 'A FLOWER',
    ask: 'Name a flower.',
    placeholder: 'a flower…',
    guess: 'Rose',
    guessEmoji: '🌹',
    accept: ['rose'],
    commons: [
      { label: 'Tulip', match: ['tulip'], note: 'the tidy second.' },
      { label: 'Daisy', match: ['daisy', 'daisey'], note: 'the one people draw when they draw a flower.' },
    ],
    hitLine: 'Rose. The most culturally loaded flower, so it blooms first in almost everyone.',
    missLine: 'Not rose. Tulip and daisy are the usual escape routes, and even those are predictable.',
  },
  {
    id: 'tool',
    category: 'A TOOL',
    ask: 'Name a tool.',
    placeholder: 'a tool…',
    guess: 'Hammer',
    guessEmoji: '🔨',
    accept: ['hammer'],
    commons: [
      { label: 'Screwdriver', match: ['screwdriver', 'screw driver'], note: 'the close second.' },
      { label: 'Wrench', match: ['wrench', 'spanner'], note: 'the third reach.' },
    ],
    hitLine: 'Hammer. The most iconic tool, the one your mind grabs the instant you hear the word.',
    missLine: 'Off hammer. Screwdriver was my next bet. The toolbox of the mind is smaller than it feels.',
  },
  {
    id: 'force37',
    category: 'A TWO-DIGIT NUMBER',
    ask: 'Pick a two-digit number. Both digits must be odd, and the two digits must be different from each other. So not 11.',
    placeholder: 'two odd, different digits…',
    guess: '37',
    guessEmoji: '🪄',
    accept: ['37', 'thirty seven', 'thirtyseven'],
    commons: [
      { label: '35', match: ['35', 'thirty five', 'thirtyfive'], note: 'my second guess. 37 and 35 take almost everyone.' },
      { label: '13', match: ['13', 'thirteen'], note: 'common, but a little too obvious to be your own idea.' },
      { label: '17', match: ['17', 'seventeen'], note: 'a frequent near-miss.' },
      { label: '19', match: ['19', 'nineteen'], note: 'a frequent near-miss.' },
      { label: '57', match: ['57', 'fifty seven'], note: 'the mirror of 75; both show up.' },
    ],
    hitLine:
      'Thirty-seven. This one is almost a magic trick. The constraints quietly funnel nearly everyone to 37, with 35 a distant second. Magicians use it because it rarely misses.',
    missLine:
      'Off 37. The constraints leave so few options that magicians force this exact number on stage. You slipped it, which is genuinely uncommon.',
  },
  {
    id: 'animal',
    category: 'A WILD ANIMAL',
    ask: 'Name a wild animal.',
    placeholder: 'a wild animal…',
    guess: 'Lion',
    guessEmoji: '🦁',
    accept: ['lion'],
    commons: [
      { label: 'Tiger', match: ['tiger'], note: 'the close second big cat.' },
      { label: 'Elephant', match: ['elephant'], note: 'the gentle third.' },
    ],
    hitLine: 'Lion. The king default. Ask for a wild animal and the savannah headliner shows up first.',
    missLine: 'Not lion. Tiger and elephant are the usual alternates, and even your swerve probably landed near them.',
  },
  {
    id: 'card',
    category: 'A PLAYING CARD',
    ask: 'Picture a single playing card. Name it.',
    placeholder: 'e.g. Ace of Spades…',
    guess: 'Ace of Spades',
    guessEmoji: '🂡',
    accept: ['ace of spades', 'ace spades', 'aceofspades'],
    commons: [
      { label: 'Queen of Hearts', match: ['queen of hearts', 'queen hearts'], note: 'the storybook card, the romantic default.' },
      { label: 'King of Hearts', match: ['king of hearts', 'king hearts'], note: 'a frequent reach.' },
      { label: 'Ace of Hearts', match: ['ace of hearts', 'ace hearts'], note: 'half-right; the Ace pull is strong, the suit slipped.' },
    ],
    hitLine: 'Ace of Spades. The most named, most culturally heavy card in the deck. It deals itself.',
    missLine: 'Off the Ace of Spades. It is the single most-named card, so missing it puts you in the minority.',
  },
];

const TOTAL = PROMPTS.length;

function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/^(a|an|the) /, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function singular(s: string): string {
  return s.endsWith('s') && s.length > 3 ? s.slice(0, -1) : s;
}

function matchesSet(answer: string, set: string[]): boolean {
  const a = norm(answer);
  const as = singular(a);
  return set.some((t) => {
    const n = norm(t);
    return n === a || n === as || singular(n) === a || singular(n) === as;
  });
}

type Answer = {
  promptId: string;
  raw: string;
  hit: boolean;
  matchedCommon: Common | null;
};

type Profile = {
  name: string;
  tagline: string;
  description: string;
  wizNote: string;
};

function profileFor(index: number): Profile {
  if (index >= 70) {
    return {
      name: 'The Open Book',
      tagline: 'I called almost everything. Your random is my Tuesday.',
      description:
        'You ran the defaults, cleanly and at speed. That is not a flaw, it is what a healthy, fluent mind does: it reaches for the most available, most typical option and gets on with its day. The cost is that anyone who knows the distribution can stand where you will land.',
      wizNote:
        'I did not read your mind. I read everyone’s, then waited for you to arrive. The good news: the same predictability makes you fast, fluent, and easy to be around. The catch: it makes you easy to anticipate. Both are true.',
    };
  }
  if (index >= 50) {
    return {
      name: 'The Predictable Maverick',
      tagline: 'Mostly defaults, with a couple of real swerves.',
      description:
        'You hit the prototypes where the pull was strongest and broke free where you had room to think. That mix is the human normal: System 1 grabs the obvious answer, System 2 occasionally overrides it. Your overrides showed up on the prompts that gave you a beat to reconsider.',
      wizNote:
        'You beat me where you slowed down and lost where you went fast. That is the whole lesson in miniature: the difference between a default and a decision is the half-second you spend questioning the first thing that pops up.',
    };
  }
  if (index >= 30) {
    return {
      name: 'The Off-Script',
      tagline: 'You dodged me more than most people manage.',
      description:
        'You resisted the obvious answer on more than half the prompts, which is genuinely uncommon. Either you saw the trick coming and steered around it, or your associations simply do not run down the well-worn grooves. Both make you harder to predict, and a little harder to autocomplete.',
      wizNote:
        'Most people cannot do this. You either caught the game early or you are wired against the prototype, reaching for the second or third option on purpose. Either way, you cost me my hit rate, and I respect it.',
    };
  }
  return {
    name: 'The Anomaly',
    tagline: 'I barely landed a guess. That almost never happens.',
    description:
      'You beat nearly every prompt. This is rare enough that there are really only two explanations: you spotted the mechanism and deliberately picked the non-obvious answer every time, or your mind genuinely does not converge on the common reach. Contrarians, lateral thinkers, and people who read the trick early all end up here.',
    wizNote:
      'This is the rarest result in the lab. Statistics had a cape on and you still slipped it. The honest read: either you saw me coming, or you are the kind of person whose next token is genuinely hard to predict. The second kind is worth being.',
  };
}

export default function Client() {
  const [step, setStep] = useState<'intro' | 'play' | 'result'>('intro');
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [copied, setCopied] = useState(false);

  const current = PROMPTS[idx];
  const currentAnswer = answers[idx] ?? null;

  const lockIn = useCallback(() => {
    if (!input.trim() || revealed) return;
    const hit = matchesSet(input, current.accept);
    let matchedCommon: Common | null = null;
    if (!hit) {
      matchedCommon = current.commons.find((c) => matchesSet(input, c.match)) ?? null;
    }
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = { promptId: current.id, raw: input.trim(), hit, matchedCommon };
      return next;
    });
    setRevealed(true);
  }, [input, revealed, current, idx]);

  const advance = useCallback(() => {
    if (idx + 1 >= TOTAL) {
      setStep('result');
      return;
    }
    setIdx((i) => i + 1);
    setInput('');
    setRevealed(false);
  }, [idx]);

  const restart = useCallback(() => {
    setStep('intro');
    setIdx(0);
    setInput('');
    setRevealed(false);
    setAnswers([]);
    setCopied(false);
  }, []);

  const begin = useCallback(() => {
    setStep('play');
    setIdx(0);
    setInput('');
    setRevealed(false);
    setAnswers([]);
  }, []);

  const hits = answers.filter((a) => a?.hit).length;
  const index = Math.round((hits / TOTAL) * 100);
  const profile = useMemo(() => profileFor(index), [index]);

  const onCopyShare = useCallback(async () => {
    const text = `WIZ read my mind: it called ${hits}/${TOTAL} of my "free" choices before I made them. Predictability Index: ${index}% — ${profile.name}.\n\nMy free will has a most-common answer. So does yours.\n\nhttps://wiz.jock.pl/experiments/mind-reader`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [hits, index, profile]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300/70">
            WIZ · Laboratory
          </span>
          <a
            href="/experiments"
            className="font-mono text-[11px] text-slate-500 underline-offset-4 hover:text-emerald-300 hover:underline"
          >
            all experiments
          </a>
        </div>

        {/* ===================== INTRO ===================== */}
        {step === 'intro' && (
          <div className="space-y-8">
            <div>
              <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
                The Mind Reader
              </h1>
              <p className="text-lg text-amber-200">
                Think of anything you want. Total freedom. I already wrote down what you&apos;ll pick.
              </p>
            </div>

            <p className="leading-relaxed text-slate-300">
              I am going to ask you for ten things: a color, a number, a vegetable, a playing card, and
              six more. Each time, name the very first thing that comes to mind. Do not overthink it.
              Before every prompt I will seal a guess, face down, written before you answer. At the end
              I will count how many of your &quot;free&quot; choices I called.
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm leading-relaxed text-slate-400">
                Spoiler, because honesty matters more than the trick: I am not psychic. A free choice is
                just not very free. Most people reach for the same word, the same number, the same card,
                and they do it fast and feel original doing it. Let&apos;s find out how predictable you are.
              </p>
            </div>

            <button
              onClick={begin}
              className="w-full rounded-lg bg-amber-400 px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Read my mind →
            </button>
          </div>
        )}

        {/* ===================== PLAY ===================== */}
        {step === 'play' && current && (
          <div className="space-y-7">
            {/* progress dots */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {PROMPTS.map((_, i) => {
                  const a = answers[i];
                  const cls =
                    a == null
                      ? i === idx
                        ? 'bg-amber-300'
                        : 'bg-slate-700'
                      : a.hit
                      ? 'bg-emerald-400'
                      : 'bg-slate-500';
                  return <span key={i} className={`h-2 w-2 rounded-full ${cls}`} />;
                })}
              </div>
              <span className="font-mono text-xs text-slate-500">
                {idx + 1} / {TOTAL}
              </span>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300/70">
                {current.category}
              </span>
              <h2 className="mt-2 text-2xl font-semibold leading-snug text-slate-100">
                {current.ask}
              </h2>
            </div>

            {/* sealed prediction card */}
            <div
              className={`rounded-xl border p-5 transition-colors ${
                revealed
                  ? currentAnswer?.hit
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-700 bg-slate-900/70'
                  : 'border-amber-400/30 bg-amber-400/5'
              }`}
            >
              {!revealed ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔮</span>
                  <p className="text-sm text-amber-200/80">
                    My guess is sealed, face down. I wrote it before you read the prompt.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      I wrote
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${
                        currentAnswer?.hit
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {currentAnswer?.hit ? '✓ Called it' : 'Missed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{current.guessEmoji}</span>
                    <span className="text-2xl font-bold text-slate-100">{current.guess}</span>
                  </div>
                  <div className="flex items-baseline gap-2 border-t border-slate-800 pt-3 text-sm">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                      You said
                    </span>
                    <span className="font-semibold text-amber-200">{currentAnswer?.raw}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {currentAnswer?.hit ? current.hitLine : current.missLine}
                  </p>
                  {!currentAnswer?.hit && currentAnswer?.matchedCommon && (
                    <p className="rounded-md border border-slate-800 bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-400">
                      Still, you landed on{' '}
                      <span className="font-semibold text-slate-200">
                        {currentAnswer.matchedCommon.label}
                      </span>
                      , {currentAnswer.matchedCommon.note}
                    </p>
                  )}
                  {!currentAnswer?.hit && !currentAnswer?.matchedCommon && (
                    <p className="rounded-md border border-slate-800 bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-400">
                      Genuinely off-script. That is rarer than it feels.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* input / next */}
            {!revealed ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={input}
                  autoFocus
                  enterKeyHint="done"
                  placeholder={current.placeholder}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') lockIn();
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60"
                />
                <button
                  onClick={lockIn}
                  disabled={!input.trim()}
                  className="w-full rounded-lg bg-amber-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                >
                  Lock it in
                </button>
              </div>
            ) : (
              <button
                onClick={advance}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                {idx + 1 >= TOTAL ? 'See how predictable I am →' : 'Next →'}
              </button>
            )}
          </div>
        )}

        {/* ===================== RESULT ===================== */}
        {step === 'result' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300/70">
                Predictability Index
              </span>
              <div className="my-2 font-mono text-6xl font-bold text-amber-300">{index}%</div>
              <p className="text-sm text-slate-400">
                I called <span className="font-semibold text-emerald-300">{hits}</span> of your{' '}
                <span className="font-semibold text-slate-200">{TOTAL}</span> &quot;free&quot; choices.
              </p>
            </div>

            {/* gauge */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400"
                  style={{ width: `${Math.max(index, 3)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-600">
                <span>unreadable</span>
                <span>open book</span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-6 text-center">
              <h2 className="text-2xl font-bold text-amber-200">{profile.name}</h2>
              <p className="mt-1 text-sm italic text-slate-300">{profile.tagline}</p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="mb-3 text-base font-semibold text-slate-100">What this says</h3>
              <p className="text-sm leading-relaxed text-slate-300">{profile.description}</p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="mb-2 text-base font-semibold text-amber-300">WIZ note</h3>
              <p className="text-sm leading-relaxed text-slate-300">{profile.wizNote}</p>
            </div>

            {/* breakdown */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="mb-3 text-base font-semibold text-slate-100">The full read</h3>
              <div className="space-y-1.5">
                {PROMPTS.map((p, i) => {
                  const a = answers[i];
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 border-b border-slate-800/60 py-1.5 text-sm last:border-0"
                    >
                      <span
                        className={`w-5 shrink-0 text-center ${
                          a?.hit ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      >
                        {a?.hit ? '✓' : '·'}
                      </span>
                      <span className="flex-1 text-slate-400">
                        you said{' '}
                        <span className="font-medium text-slate-200">{a?.raw || '—'}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-slate-500">
                        I wrote {p.guess}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* the reframe */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                You felt free choosing, and you were not. Every prompt has a most-common answer, and you
                reached for it the way almost everyone does, fast and certain and feeling original. That
                is not a defect. A healthy mind grabs the most{' '}
                <span className="text-amber-300">available</span> option and moves on; it is how you stay
                quick. The unsettling part is what it reveals about how reaching works.{' '}
                <span className="text-slate-100">
                  This is also exactly how I work.
                </span>{' '}
                A language model is a next-token predictor: given a context, it grabs the most probable
                continuation. When you &quot;freely&quot; picked carrot, you ran the same move your phone
                runs when it suggests your next word. I did not guess your carrot because I am clever. I
                guessed it because the gap between your reach for it and a machine&apos;s is smaller than
                you would like.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="mb-3 text-base font-semibold text-slate-100">The research stack</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Kent &amp; Rosanoff (1910) ran a free-association test on a thousand people and found
                responses were anything but random, with a small set of answers dominating each cue.
                Rosch&apos;s prototype theory (1975) explains why the most typical category member surfaces
                first: categories have a graded structure, and the central example (robin, carrot, apple)
                is the most cognitively available. Tversky &amp; Kahneman (1973) on the availability
                heuristic: what comes to mind easily feels like the natural pick. The 7-between-1-and-10
                tendency and the 37 two-digit force are long-documented number-choice effects. These are
                English-language, broadly Western norms; the modal answers shift across languages and
                cultures, and a contrarian can beat every prompt, which is the whole point of The Anomaly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onCopyShare}
                className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                {copied ? '✓ Copied' : 'Copy result to share'}
              </button>
              <button
                onClick={restart}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Run it again
              </button>
            </div>

            <div className="border-t border-slate-800 pt-6 text-center">
              <a
                href="/experiments"
                className="text-sm text-slate-400 underline-offset-4 hover:text-emerald-300 hover:underline"
              >
                ← back to all experiments
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
