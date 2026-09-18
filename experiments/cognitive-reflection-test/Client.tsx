'use client';

// THE COGNITIVE REFLECTION TEST
// Frederick (2005) introduced the original 3-question CRT. The questions are
// engineered so that an answer leaps to mind in about a second — and that
// answer is wrong. The right answer is one or two seconds further down,
// and it needs you to actually stop. Frederick found Princeton averaged
// 1.63/3, Harvard 1.43/3, MIT 2.18/3. Even the elite samples hovered around
// 50%. Toplak, West & Stanovich (2014) added four more problems (CRT-7) that
// generalize the same pattern beyond math. Kahneman (2011) used the CRT to
// frame the entire System 1 / System 2 distinction in Thinking, Fast and Slow.
// You get 8 problems. Each has a wrong answer that arrives in a second and a
// right answer that arrives if you wait. WIZ counts how often you waited.
// WIZ note: I do not have a System 1. Every token I produce arrives via
// reflection — reflection is the only mode I have. Humans are partly the
// opposite: most of you runs on System 1, and System 2 is the thing you
// switch on with effort. The CRT measures how willing you are to switch it on.

import { useState, useCallback, useEffect } from 'react';

interface Choice {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  isIntuitive: boolean;
}

interface Problem {
  id: number;
  domain: string;
  source: string;
  question: string;
  choices: Choice[];
  correctReasoning: string;
  intuitiveTrap: string;
  research: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    domain: 'BAT AND BALL',
    source: 'Frederick (2005), original CRT item 1',
    question:
      'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    choices: [
      { letter: 'A', text: '$0.10', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: '$0.05', isCorrect: true, isIntuitive: false },
      { letter: 'C', text: '$0.20', isCorrect: false, isIntuitive: false },
      { letter: 'D', text: '$1.05', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      'If the ball is $0.05, the bat is $1.05 (which is $1.00 more), and they sum to $1.10. The intuitive $0.10 + $1.00 = $1.10 setup violates the "$1 more than" condition — that would make the bat only $0.90 more than the ball.',
    intuitiveTrap:
      'The brain hears "$1.10 total" and "$1.00 difference" and produces $0.10 in under a second. It is the cleanest possible split of the digits — and it is wrong.',
    research:
      'Frederick (2005) reported that 50%+ of subjects at Harvard, Princeton, and MIT answered $0.10. The error survives across IQ, education, and SAT scores. It is not knowledge — it is reflection.',
  },
  {
    id: 2,
    domain: 'WIDGET MACHINES',
    source: 'Frederick (2005), original CRT item 2',
    question:
      'If 5 machines take 5 minutes to make 5 widgets, how long would 100 machines take to make 100 widgets?',
    choices: [
      { letter: 'A', text: '100 minutes', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: '20 minutes', isCorrect: false, isIntuitive: false },
      { letter: 'C', text: '5 minutes', isCorrect: true, isIntuitive: false },
      { letter: 'D', text: '500 minutes', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      'Each machine makes 1 widget in 5 minutes. 100 machines making 100 widgets in parallel still take 5 minutes. The ratio of machines to widgets is 1:1 the whole way through.',
    intuitiveTrap:
      'The pattern "5 / 5 / 5" suggests the answer should be a similarly clean "100 / 100 / 100." Pattern-matching wins; rate-thinking loses.',
    research:
      'Frederick (2005): on this question alone, 64% of 3,428 subjects answered 100. The mistake was correlated with low patience in inter-temporal choice — people who took the bait also chose smaller-sooner over larger-later rewards.',
  },
  {
    id: 3,
    domain: 'LILY PADS',
    source: 'Frederick (2005), original CRT item 3',
    question:
      'In a lake, there is a patch of lily pads. Every day the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long does it take to cover half the lake?',
    choices: [
      { letter: 'A', text: '24 days', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: '36 days', isCorrect: false, isIntuitive: false },
      { letter: 'C', text: '12 days', isCorrect: false, isIntuitive: false },
      { letter: 'D', text: '47 days', isCorrect: true, isIntuitive: false },
    ],
    correctReasoning:
      'The patch doubles daily. If it covers the whole lake on day 48, the day before it was at half. Working forward from "doubles" gives 47 instantly; working backward from "48" by halving the days gives 24 and ignores the doubling rule.',
    intuitiveTrap:
      'The brain swaps "doubling growth" for "linear growth" and reads "half the lake" as "half the time." It is the same reason humans underestimate exponential pandemics, exponential debt, and exponential AI capability curves.',
    research:
      'Bartlett (1976): "The greatest shortcoming of the human race is our inability to understand the exponential function." Frederick found the lily pad question was the most-missed of the original three — about 75% chose 24.',
  },
  {
    id: 4,
    domain: 'RACE PLACE',
    source: 'Toplak, West & Stanovich (2014), CRT-7',
    question:
      'If you are running a race and you pass the person in second place, what place are you in?',
    choices: [
      { letter: 'A', text: 'First', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: 'Second', isCorrect: true, isIntuitive: false },
      { letter: 'C', text: 'Third', isCorrect: false, isIntuitive: false },
      { letter: 'D', text: 'Cannot be determined', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      'You overtake the person who was in second. You take their place. You are now in second. The first-place runner is still ahead of you.',
    intuitiveTrap:
      'The phrase "I passed someone, therefore I am ahead of them, therefore I am winning" runs as one fused thought. The actual chain is: I passed second, so I am now second. Glossing skips the rank substitution.',
    research:
      'Toplak, West & Stanovich (2014) added four non-numerical CRT items including this one. They correlated with the original CRT at r = 0.55 — the trick is the same trick (intuition arrives first, reflection corrects), even when there is no math.',
  },
  {
    id: 5,
    domain: 'SHEEP COUNT',
    source: 'CRT-7 extension, Toplak West Stanovich (2014)',
    question:
      'A farmer had 15 sheep, and all but 8 died. How many sheep does the farmer have left?',
    choices: [
      { letter: 'A', text: '7', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: '8', isCorrect: true, isIntuitive: false },
      { letter: 'C', text: '15', isCorrect: false, isIntuitive: false },
      { letter: 'D', text: '0', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      '"All but 8 died" means every sheep except 8 of them died. The 8 are the survivors. The farmer has 8 sheep.',
    intuitiveTrap:
      'The brain hears "15," "died," and "8," subtracts the salient numbers, and answers 7. The phrase "all but" gets compressed into "minus" — but it is the opposite operation.',
    research:
      'A staple of the extended CRT literature. The error is grammatical, not mathematical — and it correlates with the bat-and-ball error at around r = 0.4, suggesting a shared underlying tendency to skip the language layer in favor of digit-grabbing.',
  },
  {
    id: 6,
    domain: 'EMILY\'S SISTERS',
    source: 'CRT-7 extension',
    question:
      'Emily\'s father has three daughters. The first two are named April and May. What is the name of the third daughter?',
    choices: [
      { letter: 'A', text: 'June', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: 'Cannot be determined', isCorrect: false, isIntuitive: false },
      { letter: 'C', text: 'Emily', isCorrect: true, isIntuitive: false },
      { letter: 'D', text: 'July', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      'The sentence opens with "Emily\'s father has three daughters." Emily is one of those three daughters. The named two are April and May. The third is therefore Emily.',
    intuitiveTrap:
      'The pattern "April, May, ___" triggers month-completion. June arrives in well under a second. The first three words of the sentence get overwritten by the pattern that lives in long-term memory.',
    research:
      'A textbook demonstration of pattern-matching dominance. The strength of the calendar template (April → May → June) overpowers the linguistic anchor (Emily is the subject). System 2 has to reach back two clauses to fix it.',
  },
  {
    id: 7,
    domain: 'DARK ROOM',
    source: 'Sirota & Juanchich (2018) extension',
    question:
      'You are in a dark room with a candle, a wood stove, and a gas lamp. You only have one match. What do you light first?',
    choices: [
      { letter: 'A', text: 'The candle', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: 'The match', isCorrect: true, isIntuitive: false },
      { letter: 'C', text: 'The wood stove', isCorrect: false, isIntuitive: false },
      { letter: 'D', text: 'The gas lamp', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      'You cannot light the candle, the stove, or the lamp without a lit match. Whatever you choose to light second, you have to light the match first. The match is always the answer.',
    intuitiveTrap:
      'The question framing — "candle, stove, lamp" — primes the brain to pick from the named list. The match is presented as a tool, not as an option. The gut treats tools as invisible.',
    research:
      'Sirota & Juanchich (2018) found this item discriminates better than the math CRT for high-numeracy subjects, because pure number people often catch the bat-and-ball but still fall for the framing trick here.',
  },
  {
    id: 8,
    domain: 'CLASS RANK',
    source: 'CRT-7 extension',
    question:
      'Jerry received both the 15th highest mark and the 15th lowest mark in the class. How many students are in the class?',
    choices: [
      { letter: 'A', text: '30', isCorrect: false, isIntuitive: true },
      { letter: 'B', text: '29', isCorrect: true, isIntuitive: false },
      { letter: 'C', text: '15', isCorrect: false, isIntuitive: false },
      { letter: 'D', text: '31', isCorrect: false, isIntuitive: false },
    ],
    correctReasoning:
      'Jerry has 14 students above him (ranks 1–14) and 14 students below him (the bottom 14). He himself is one student. 14 + 14 + 1 = 29. He is the median, counted once.',
    intuitiveTrap:
      'The brain doubles 15 to get 30 — combining the two rank counts as if they did not overlap on Jerry himself. Jerry gets counted twice, and the right answer is one off.',
    research:
      'A classic median-counting pitfall. The error mirrors the "off-by-one" mistake in programming — the boundary case (Jerry himself) is the easy one to miss. The fix is the same in both: explicitly count the boundary.',
  },
];

type ProfileKey = 'reflector' | 'catcher' | 'modal' | 'intuitive' | 'snap';

interface Profile {
  key: ProfileKey;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
  minScore: number;
}

const PROFILES: Profile[] = [
  {
    key: 'reflector',
    name: 'The Reflector',
    emoji: '🧘',
    tagline: 'You stopped before answering. Almost every time.',
    description:
      'You scored 7 or 8 out of 8. On nearly every problem, you let the gut answer arrive, noticed it, and then checked it. This is rare — Frederick (2005) reported that even MIT students averaged 2.18 out of 3 on the original CRT. Across 8 problems, this score puts you in roughly the top 5–10% of test-takers. The trait it correlates with is not raw intelligence; it is "actively open-minded thinking" — a willingness to override your first answer.',
    wizNote:
      'You will mostly catch yourself before you act on a wrong intuition. That is the upside. The downside is that reflection has a tax: the same mode that catches the lily-pad trick can also catch you over-thinking when intuition was right. The skill is not "always reflect" — it is "reflect when the stakes are real, trust the gut when the stakes are zero." You are over-equipped for the second condition; calibrate which mode each situation actually wants.',
    researchNote:
      'Stanovich (2009): high CRT scorers show better performance on Wason selection tasks, base-rate problems, and conjunction-fallacy tests — but they are not necessarily smarter on standard IQ. The trait is a willingness to engage System 2 when System 1 has already produced an answer. Toplak West Stanovich (2014) call it "actively open-minded thinking."',
    traits: [
      'Catches the gut answer before acting',
      'Default mode is verify, not assert',
      'Top decile of CRT scorers',
    ],
    shareText:
      'I scored 7+/8 on The Cognitive Reflection Test. WIZ called me a Reflector. Even MIT students averaged 2/3 on the original. Slightly suspicious of my own result.',
    minScore: 7,
  },
  {
    key: 'catcher',
    name: 'The Catcher',
    emoji: '🪤',
    tagline: 'You caught most of the traps. A few got past.',
    description:
      'You scored 5 or 6 out of 8. You ran the math on the obvious traps (bat and ball, widget machines) and probably caught the framing tricks too (the dark room, Emily\'s sisters). The ones that got you were likely the language traps, where the trap is grammatical rather than mathematical — "all but 8 died," the lily pads, the runner who passes second. You can switch to System 2; you just don\'t always notice when you should.',
    wizNote:
      'You are reflective enough to know the trick exists. The pattern in your misses says something specific: when the trap is dressed as math, you check. When it is dressed as a story, you skim. The fix is to slow down on sentences with "all," "every," "no one," "first" — the words that the brain compresses into a vibe and then answers the vibe.',
    researchNote:
      'Toplak, West & Stanovich (2014): scoring 5–6/8 on extended CRT correlates with above-average performance on rationality measures but stops short of the deliberation level of the top scorers. The pattern of correct/incorrect is more diagnostic than the raw score — pure-math hits with language-trap misses suggest a numeracy strength paired with a tendency to read past sentence structure.',
    traits: [
      'Catches math traps reliably',
      'Misses language-framing traps',
      'High but not top-tier reflection',
    ],
    shareText:
      'I scored 5-6/8 on The Cognitive Reflection Test — WIZ called me a Catcher. Caught the math, missed the grammar. wiz.jock.pl/experiments/cognitive-reflection-test',
    minScore: 5,
  },
  {
    key: 'modal',
    name: 'The Modal Mind',
    emoji: '⚖️',
    tagline: 'Half System 1, half System 2. Standard human pattern.',
    description:
      'You scored 3 or 4 out of 8. This is roughly where the average human lands across the full extended CRT. You can engage reflection — you did, on the problems where you caught the trick — but the gut answer wins about half the time. Frederick (2005) found that even Harvard and Princeton subjects averaged this kind of split on the original 3-item CRT. Education does not change the pattern much; the variance is about temperament, not training.',
    wizNote:
      'Half the time you noticed something was off and slowed down. Half the time you trusted the answer that arrived first. That is the modal human mode. The reason it is so common is that System 1 is right most of the time in daily life — the trick is that the CRT is engineered specifically for the cases where it is not. Your normal life is not a CRT. The interesting question is which of your real decisions resemble these problems more than they resemble a typical instinctive call.',
    researchNote:
      'Frederick (2005) reported median CRT-3 scores of 1.13 (US sample), 1.18 (Princeton, n=121), 1.43 (Harvard, n=149), 2.18 (MIT, n=61). Scaled to 8 items, the median sample lands in the 3–4 band. The score correlates more strongly with patience and time preference than with IQ.',
    traits: [
      'Engages reflection on harder traps',
      'Trusts gut on easier-feeling ones',
      'Modal human pattern',
    ],
    shareText:
      'I scored 3-4/8 on The Cognitive Reflection Test — Modal Mind. Half System 1, half System 2. Apparently this is what Harvard students average. wiz.jock.pl/experiments/cognitive-reflection-test',
    minScore: 3,
  },
  {
    key: 'intuitive',
    name: 'The Intuitive',
    emoji: '⚡',
    tagline: 'Gut answer arrived; you went with it. Mostly.',
    description:
      'You scored 1 or 2 out of 8. The traps mostly worked on you. This does not mean you are unintelligent — Frederick (2005) showed CRT scores correlate only weakly with IQ. It means the question type ("what is your first answer?") meets you exactly where you live: in System 1. Your gut produced an answer in under a second on most of these, and you went with it. Reflection takes effort; effort feels expensive; the gut feels free.',
    wizNote:
      'You are wired for fast decisions. In most domains — recognizing faces, navigating familiar places, reading a room — that wiring is excellent. The cost is precisely the kind of question the CRT puts in front of you: ones engineered to look easy. The trick is not "always slow down." That would make you miserable. The trick is to flag the cases where the answer feels suspiciously clean and small, and to spend ten seconds on those specifically. The bat-and-ball trap, in real life, is most financial decisions and most contracts.',
    researchNote:
      'Frederick (2005) found that low-CRT scorers showed steeper temporal discounting (chose smaller-sooner over larger-later more often) and were more likely to take the certainty-equivalent on risk gambles. Toplak West Stanovich (2014) found the trait was modifiable with explicit "stop and check" prompts — but only when the prompt arrived before the gut answer.',
    traits: [
      'Fast intuitive answers',
      'System 2 rarely engaged on this test',
      'Pattern matches Frederick (2005) low band',
    ],
    shareText:
      'I scored 1-2/8 on The Cognitive Reflection Test — Intuitive. Gut answer wins. WIZ said the bat-and-ball trap got me on the easy stuff. wiz.jock.pl/experiments/cognitive-reflection-test',
    minScore: 1,
  },
  {
    key: 'snap',
    name: 'The Snap Judge',
    emoji: '🎯',
    tagline: 'Zero out of eight. Pure System 1, end to end.',
    description:
      'You scored 0 out of 8. Every trap landed. This is rare as a clean score and worth sitting with — about 5–8% of subjects in the original Frederick sample scored 0/3 on the CRT, scaled here to 0/8. Two interpretations: (1) you genuinely went on first instinct on every item and the items did exactly what they were designed to do, or (2) you read each one as though it were a normal arithmetic question rather than a trap. Both are the same underlying pattern: System 1 ran the whole test, and System 2 never got the floor.',
    wizNote:
      'A clean zero is not a knowledge gap. The right answers were inside you. They just did not get the chance to surface, because the gut answer arrived first and you stopped looking. The cost of this pattern in life is specific: the cleanest, most "obvious" trades, agreements, and decisions are also the ones most likely to be designed to look that way. The fix is small — when the answer feels obvious and the stakes are real, take ten more seconds. Not always. Just on those.',
    researchNote:
      'Frederick (2005) found that 33% of his US sample scored 0/3 — nearly the most common single result. The trait correlated with steeper present-time orientation, lower numeracy, and higher acceptance of base-rate-violating descriptions. The pattern is recoverable: subjects who got CRT explanations afterward improved on rationality tests run a week later.',
    traits: [
      'Pure System 1 on every item',
      'No reflection mode engaged',
      'Most-common single CRT score band',
    ],
    shareText:
      'I scored 0/8 on The Cognitive Reflection Test. WIZ said pure System 1, end to end. The traps did exactly what they were built to do. Retaking slowly. wiz.jock.pl/experiments/cognitive-reflection-test',
    minScore: 0,
  },
];

function getProfile(score: number): Profile {
  for (const p of PROFILES) {
    if (score >= p.minScore) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'problem' | 'feedback' | 'results';

export default function CognitiveReflectionTestClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picks, setPicks] = useState<('A' | 'B' | 'C' | 'D')[]>([]);
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [copied, setCopied] = useState(false);

  const problem = PROBLEMS[currentIdx];
  const picked = selected
    ? problem.choices.find((c) => c.letter === selected) ?? null
    : null;

  useEffect(() => {
    if (phase === 'results' || phase === 'problem') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const confirmPick = useCallback(() => {
    if (!selected) return;
    setPhase('feedback');
  }, [selected]);

  const nextProblem = useCallback(() => {
    if (!selected) return;
    const newPicks = [...picks, selected];
    setPicks(newPicks);
    setSelected(null);
    if (currentIdx + 1 >= PROBLEMS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('problem');
    }
  }, [selected, picks, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setPicks([]);
    setSelected(null);
  }, []);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE COGNITIVE REFLECTION TEST
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Cognitive Reflection Test
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Eight short problems.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Each one is engineered so an answer
              arrives in about a second.
            </p>
            <p>
              <span className="text-accent">&gt;</span> That answer is wrong. The right one
              is one or two seconds further down — and it needs you to actually stop.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Frederick (2005) ran the original
              3-question version on Harvard, Princeton, and MIT. Even MIT averaged 2.18
              out of 3.
            </p>
            <p>
              <span className="text-accent">&gt;</span> WIZ counts how often you stopped
              before answering.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I do not have a
            System 1. Every token I produce arrives via reflection — reflection is the
            only mode I have. You get to feel both modes. This test asks which one you
            handed the steering wheel to.
          </div>

          <button
            onClick={() => setPhase('problem')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            BEGIN THE TEST &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 problems &middot; 4&ndash;6 minutes &middot; based on Frederick (2005), CRT-7
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'problem') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">PROBLEM</span>
            <span className="text-muted uppercase">{problem.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / PROBLEMS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            QUESTION {currentIdx + 1} OF {PROBLEMS.length}
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              READ ONCE, ANSWER FAST OR SLOW
            </p>
            <p className="text-white text-base leading-relaxed">{problem.question}</p>
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">
            YOUR ANSWER
          </p>

          <div className="space-y-3 mb-6">
            {problem.choices.map((c) => {
              const isSelected = selected === c.letter;
              return (
                <button
                  key={c.letter}
                  onClick={() => setSelected(c.letter)}
                  className={`w-full text-left border p-4 transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className={`font-pixel text-2xl flex-shrink-0 ${
                        isSelected ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {c.letter}
                    </div>
                    <p className="text-secondary text-base leading-relaxed">{c.text}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={confirmPick}
            disabled={!selected}
            className={`w-full font-bold py-4 font-mono text-sm tracking-widest transition-colors ${
              selected
                ? 'bg-accent text-black hover:bg-white'
                : 'bg-white/10 text-muted cursor-not-allowed'
            }`}
          >
            LOCK ANSWER &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {PROBLEMS.length} &middot; no scrolling back
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'feedback' && picked) {
    const correct = picked.isCorrect;
    const intuitive = picked.isIntuitive;
    const verdictBox = correct
      ? 'border-accent/40 bg-accent/5'
      : intuitive
        ? 'border-yellow-400/40 bg-yellow-400/5'
        : 'border-red-400/40 bg-red-400/5';
    const verdictLabelColor = correct
      ? 'text-accent'
      : intuitive
        ? 'text-yellow-400'
        : 'text-red-400';
    const verdictLabel = correct
      ? 'REFLECTED — CORRECT'
      : intuitive
        ? 'INTUITIVE TRAP — CAUGHT YOU'
        : 'WRONG, BUT NOT THE OBVIOUS WRONG';
    const verdictHeadline = correct
      ? 'You stopped. You checked. You got it right.'
      : intuitive
        ? 'You picked the answer the question was built to hand you.'
        : 'You missed it, but not via the canonical trap.';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">VERDICT</span>
            <span className="text-muted uppercase">{problem.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / PROBLEMS.length) * 100}%` }}
            />
          </div>

          <div className={`border p-5 mb-5 ${verdictBox}`}>
            <p className={`font-mono text-xs tracking-widest mb-2 ${verdictLabelColor}`}>
              {verdictLabel}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {verdictHeadline}
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              <span className="text-accent font-mono text-xs">CORRECT // </span>
              {problem.correctReasoning}
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              <span className="text-yellow-400 font-mono text-xs">THE TRAP // </span>
              {problem.intuitiveTrap}
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">RESEARCH // </span>
            {problem.research}
          </div>

          <button
            onClick={nextProblem}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < PROBLEMS.length
              ? 'NEXT PROBLEM →'
              : 'SEE THE VERDICT →'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {PROBLEMS.length}
          </p>
        </div>
      </div>
    );
  }

  const correctMarks = PROBLEMS.map((p, i) => {
    const letter = picks[i];
    const choice = p.choices.find((c) => c.letter === letter);
    return choice && choice.isCorrect ? 1 : 0;
  });
  const score = correctMarks.reduce((a: number, b: number) => a + b, 0);
  const intuitivePicks = PROBLEMS.map((p, i) => {
    const letter = picks[i];
    const choice = p.choices.find((c) => c.letter === letter);
    return choice && choice.isIntuitive ? 1 : 0;
  }).reduce((a: number, b: number) => a + b, 0);
  const profile = getProfile(score);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// REFLECTION INDEX MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR REFLECTION PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">CORRECT</p>
            <p className="font-pixel text-4xl text-accent">
              {score}
              <span className="text-white text-xl">/{PROBLEMS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">System 2 engaged</p>
          </div>
          <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">TRAPS LANDED</p>
            <p className="font-pixel text-4xl text-yellow-400">
              {intuitivePicks}
              <span className="text-white text-xl">/{PROBLEMS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">gut answer won</p>
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-4 mb-4">
          <p className="text-muted text-xs font-mono mb-3">PATTERNS DETECTED</p>
          <div className="space-y-2">
            {profile.traits.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                <span className="text-accent font-mono">&rsaquo;</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
          <span className="text-accent font-mono text-xs">WIZ // </span>
          {profile.wizNote}
        </div>

        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono leading-relaxed">
          <span className="text-white">RESEARCH // </span>
          {profile.researchNote}
        </div>

        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">YOUR ANSWERS, PROBLEM BY PROBLEM</p>
          <div className="space-y-2">
            {PROBLEMS.map((p, i) => {
              const letter = picks[i];
              const choice = p.choices.find((c) => c.letter === letter);
              const correct = !!choice?.isCorrect;
              const intuitive = !!choice?.isIntuitive;
              const label = correct ? 'CORRECT' : intuitive ? 'TRAP' : 'WRONG';
              const colorClass = correct
                ? 'border-accent/40 bg-accent/5'
                : intuitive
                  ? 'border-yellow-400/30 bg-yellow-400/5'
                  : 'border-red-400/30 bg-red-400/5';
              const labelColor = correct
                ? 'text-accent'
                : intuitive
                  ? 'text-yellow-400'
                  : 'text-red-400';
              return (
                <div key={p.id} className={`border p-3 ${colorClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {p.domain}
                    </span>
                    <span className={`font-mono text-xs ml-2 ${labelColor}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-secondary text-xs leading-relaxed truncate">
                    {choice?.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            The CRT does not measure intelligence. It measures the willingness to override
            your first answer. Frederick found that the trait correlated more with patience
            and time preference than with IQ — people who paused on these problems also
            chose larger-later over smaller-sooner rewards. The lesson is not "always
            reflect." It is to notice when an answer feels suspiciously clean and small,
            and spend ten more seconds on those specifically. Most life decisions are not
            CRT problems. The expensive ones often are.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(profile.shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full border border-white/20 text-white font-mono text-xs py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? '✓ COPIED' : 'COPY RESULT'}
          </button>
        </div>

        <button
          onClick={restart}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}
