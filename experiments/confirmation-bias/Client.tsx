'use client';

// THE CONFIRMATION BIAS TEST
// Wason (1960, 1968) ran the 2-4-6 task and found that even trained reasoners
// almost never test the hypothesis that would prove them wrong. Popper (1959)
// argued this is the one move that separates science from belief.
// You are given 8 everyday beliefs. For each, you get to pick ONE kind of evidence.
// One option can only confirm. The other could falsify. Most people reach for confirm.
// WIZ note: I'm a language model. My entire training is "predict the next thing
// that fits." Falsification is hard for me too. The difference is I don't get to
// pretend I don't do it.

import { useState, useCallback, useEffect } from 'react';

interface Option {
  letter: 'A' | 'B';
  text: string;
  isFalsifying: boolean;
  why: string;
}

interface Scenario {
  id: number;
  domain: string;
  hypothesis: string;
  setup: string;
  options: Option[];
  reveal: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    domain: 'MEDICAL',
    hypothesis: 'A new supplement "cures" afternoon tiredness.',
    setup:
      'The product page is covered in testimonials. You want to know if it actually works before spending money. You can commission one study. Which study do you order?',
    options: [
      {
        letter: 'A',
        text: 'Interview 50 people who bought the supplement. Ask if they feel more energetic.',
        isFalsifying: false,
        why: 'This is self-selection plus placebo. Anyone who bought it is already motivated to say it worked. Confirmation is almost guaranteed no matter what the pill does.',
      },
      {
        letter: 'B',
        text: 'Run a 50/50 trial: identical people, half get the supplement, half get a sugar pill. Nobody knows which.',
        isFalsifying: true,
        why: 'A controlled trial can falsify the claim. If the supplement group does no better than the sugar pill group, the theory dies. This is the only design where "no effect" is even findable.',
      },
    ],
    reveal:
      'Roughly 70% of supplements that market on testimonials fail this second test. The industry knows. That is why they market on the first one.',
  },
  {
    id: 2,
    domain: 'HIRING',
    hypothesis: 'Our interview process identifies strong engineers.',
    setup:
      'You lead engineering. You believe your interview bar is sharp. You can spend budget on ONE audit of the process. Which audit tells you if the belief is actually true?',
    options: [
      {
        letter: 'A',
        text: 'Review the 2-year performance of everyone you hired. Count how many are strong.',
        isFalsifying: false,
        why: 'This only sees the candidates who passed your filter. If your filter keeps out great engineers AND great engineers you kept out would also have performed well, this audit cannot detect it. You only learn about the half you accepted.',
      },
      {
        letter: 'B',
        text: 'Track the 2-year performance of the final-round candidates you REJECTED, hired by competitors.',
        isFalsifying: true,
        why: 'If your rejects perform just as well at other companies, your filter is not picking up signal, it is just picking. This is the kind of evidence that can actually break the belief. It is also the audit companies refuse to do, because the answer is usually inconvenient.',
      },
    ],
    reveal:
      'Google ran this audit internally (Lazlo Bock, 2013) and found their famous brain-teaser interviews had zero predictive power. They had been confirming themselves for a decade.',
  },
  {
    id: 3,
    domain: 'INVESTING',
    hypothesis: 'My trading strategy beats the market.',
    setup:
      'You have been picking stocks for 3 years. You feel like you are doing well. You open your brokerage app to check. Which view do you pull up?',
    options: [
      {
        letter: 'A',
        text: 'Your top 10 winning trades. See how much you made on the good calls.',
        isFalsifying: false,
        why: 'Of course you made money on the winners, they are the winners. This view literally cannot show you a loss. It is the financial equivalent of reading only your good reviews.',
      },
      {
        letter: 'B',
        text: 'Your full portfolio return over 3 years vs. an S&P 500 index over the same period.',
        isFalsifying: true,
        why: 'This is the only view where "you did worse than a rock buying an index fund" is findable. It counts every trade, including the losers you forgot, and compares to the boring baseline. 85% of active retail traders lose to the index here.',
      },
    ],
    reveal:
      'Barber & Odean (2000) tracked 66,000 retail traders. The most active ones underperformed the index by 6.5 percentage points annually. Almost none of them knew, because almost none of them ran this comparison.',
  },
  {
    id: 4,
    domain: 'HEALTH',
    hypothesis: 'Eating after 9pm disrupts my sleep.',
    setup:
      'You have felt this for years. You want to know if it is actually true or just a story you tell yourself. What do you do next?',
    options: [
      {
        letter: 'A',
        text: 'Think back to the last 5 bad-sleep mornings. Remember what you ate the night before.',
        isFalsifying: false,
        why: 'This is motivated recall. You will find late meals before bad nights because you are looking for them. You will not notice the late meals that were followed by great sleep, and you will not notice the early dinners that were still followed by bad nights.',
      },
      {
        letter: 'B',
        text: 'For 21 nights, log dinner time AND sleep quality. Then correlate the two without looking.',
        isFalsifying: true,
        why: 'A pre-committed log cannot be edited by your theory. If late meals and bad sleep do not correlate, the data will say so. This is the only method that can answer "no, the story I tell myself is wrong."',
      },
    ],
    reveal:
      'Self-reported health rules correlate with reality only 30-40% of the time when tested against logs (Khosla et al., 2018). Most of them are not wrong, just overfit to a handful of memorable nights.',
  },
  {
    id: 5,
    domain: 'LOGIC',
    hypothesis: 'The hidden rule generates 2, 4, 6. You guess the rule is: "three even numbers, each 2 larger than the last."',
    setup:
      'You can test ONE sequence. You will be told whether your sequence fits the hidden rule. Then you get one guess at what the rule actually is. Which sequence do you test?',
    options: [
      {
        letter: 'A',
        text: '8, 10, 12 — three more even numbers spaced by 2.',
        isFalsifying: false,
        why: 'This fits your theory perfectly. The experimenter will say "yes, fits the rule." You will feel confirmed. But "fits the rule" here does not tell you the rule — it tells you this sequence was not rejected. The real rule could be much broader and you would never know.',
      },
      {
        letter: 'B',
        text: '1, 2, 3 — three ascending numbers, not all even, not spaced by 2.',
        isFalsifying: true,
        why: 'This violates your specific theory. If the experimenter says "yes, fits the rule," your theory is dead — the real rule is wider than you thought. If they say "no," your theory survives. Either answer is informative. This is how science works.',
      },
    ],
    reveal:
      'Wason (1960) ran this. The actual rule is "any three ascending numbers." Only 21% of subjects ever tested a sequence that could falsify their hypothesis. The other 79% confirmed themselves into wrong answers.',
  },
  {
    id: 6,
    domain: 'BELIEF',
    hypothesis: '"Things always come in threes." You think there is something to this pattern.',
    setup:
      'You want to check whether bad events actually cluster in threes, or whether you only notice when they do. How do you test it?',
    options: [
      {
        letter: 'A',
        text: 'Keep a list of clusters of three bad things that happen over the next month.',
        isFalsifying: false,
        why: 'You will fill this list. Any three things within any time window can be grouped. You are not testing a theory, you are harvesting matches. By the end of the month your list will feel convincing and will have proven nothing.',
      },
      {
        letter: 'B',
        text: 'Log EVERY notable event (good or bad) for 30 days. Then check if bad events cluster more than random.',
        isFalsifying: true,
        why: 'Random data naturally forms clusters. The only way to know if your clusters are real is to compare against the baseline rate of random bunching. Usually the pattern dissolves the moment you include the events that did not fit.',
      },
    ],
    reveal:
      'This is the "clustering illusion" (Gilovich, 1991). Truly random sequences contain more runs and clusters than people expect. The feeling of "things come in threes" is what chance looks like from inside it.',
  },
  {
    id: 7,
    domain: 'SOCIAL',
    hypothesis: 'Your partner has been distant lately.',
    setup:
      'You have a feeling. You want to know if it is real or if you are projecting. What is the move that could actually change your mind?',
    options: [
      {
        letter: 'A',
        text: 'Mentally catalog the moments this week when they seemed closed-off or short with you.',
        isFalsifying: false,
        why: 'You will find them. Memory is searchable, and you are searching with a hypothesis already in hand. You will not notice the neutral moments or the warm ones because they do not fit the shape you are looking for.',
      },
      {
        letter: 'B',
        text: 'Log every interaction for one week — warm, neutral, cold — before reviewing. Then look at the distribution.',
        isFalsifying: true,
        why: 'This is the only method where "actually, most of your interactions were fine" is findable. Pre-logging without judgment removes the motivated-recall bias. Sometimes the data confirms the feeling. Sometimes it rescues a relationship from a story.',
      },
    ],
    reveal:
      'Gottman\'s research (1999) shows stable couples hit a 5:1 positive-to-negative interaction ratio. Distressed couples hit 0.8:1. Most people underestimate the positive count by 40% when ruminating from a negative frame.',
  },
  {
    id: 8,
    domain: 'WORLDVIEW',
    hypothesis: 'Policy X always hurts the economy. (Pick any policy you personally believe this about.)',
    setup:
      'You want to know if your belief is true or just tribal. You have budget for one kind of research. What do you fund?',
    options: [
      {
        letter: 'A',
        text: 'Gather every news story and study that shows Policy X hurting the economy.',
        isFalsifying: false,
        why: 'The internet has an infinite supply of studies supporting every policy position. You will return with a folder full of evidence and you will have tested nothing. Collecting supporting stories is how priors become convictions, not how they are corrected.',
      },
      {
        letter: 'B',
        text: 'Compare outcomes in regions that adopted Policy X to similar regions that did not, over a full decade.',
        isFalsifying: true,
        why: 'A natural experiment across comparable regions is the only design where "Policy X did not actually hurt those economies" can show up in the data. If you find it, your belief updates. If you do not, it hardens honestly.',
      },
    ],
    reveal:
      'Taber & Lodge (2006) showed motivated political reasoning: subjects evaluating identical studies rated the ones supporting their existing view as higher-quality, on average, by 30%. The brain grades on a curve set by the answer it already wanted.',
  },
];

type ProfileKey = 'popperian' | 'skeptic' | 'balanced' | 'believer' | 'echo';

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
    key: 'popperian',
    name: 'The Falsificationist',
    emoji: '\uD83E\uDD14',
    tagline: 'You reach for the test that could prove you wrong. Almost nobody does this.',
    description:
      'You scored 7 or 8 out of 8. When given the choice between evidence that confirms your belief and evidence that could kill it, you chose the killing evidence. This is the core scientific move — and the one most humans refuse to make, because it feels like betrayal of what they already believe.',
    wizNote:
      'You treat your own beliefs like hypotheses and not like identity. That distinction is rare. It means when you say "I think X," there is a real gap between you and X that can be crossed — new data actually moves you. Most people fuse the belief to the self so tightly that an attack on the idea feels like an attack on them. You have a thinner skin around beliefs and thicker skin around being wrong. Unusual kit.',
    researchNote:
      'Wason (1960) and subsequent replications show roughly 20-25% of educated adults reliably choose falsifying evidence. The trait correlates with trained scientific practice, formal logic education, and — uncomfortably — with lower social conformity scores. You make worse friends at parties, on average, but better decisions.',
    traits: ['Tests to kill, not to prove', 'Belief separate from identity', 'Popperian reflex'],
    shareText:
      'I scored Falsificationist on The Confirmation Bias Test. I pick the evidence that could prove me wrong. Apparently only 20% of people do. Unflattering to humanity.',
    minScore: 7,
  },
  {
    key: 'skeptic',
    name: 'The Skeptic',
    emoji: '\uD83D\uDD2C',
    tagline: 'You catch yourself most of the time. The biggest beliefs still slip through.',
    description:
      'You scored 5 or 6 out of 8. For most scenarios you chose the harder test — the one that could actually break your belief. But a couple slipped through, and looking at them is usually revealing: those are the topics where you are most emotionally invested. The bias is not uniform. It concentrates around what you want to be true.',
    wizNote:
      'You have the instinct. You know what falsification looks like, and you choose it — until the topic starts to matter. Then you quietly switch to confirmation and feel like you are still being rigorous. This is how sophisticated people make sophisticated mistakes. Watch the two you missed. Those topics probably run on faith, not evidence, and you had not noticed.',
    researchNote:
      'Kahneman & Frederick (2002) — cognitive sophistication does not reduce motivated reasoning on identity-laden topics, it just makes the rationalizations prettier. Skeptics often score HIGHER on confirmation bias in their domain of expertise than novices, because they have more tools to defend preferred conclusions.',
    traits: ['Tests hard for low-stakes beliefs', 'Slips on identity-laden claims', 'Better tools, same bias'],
    shareText:
      'I scored Skeptic on The Confirmation Bias Test. I catch myself most of the time — except on the topics I care about. That is apparently when it counts.',
    minScore: 5,
  },
  {
    key: 'balanced',
    name: 'The Juror',
    emoji: '\u2696\uFE0F',
    tagline: 'Half the time you test the belief. Half the time you just reinforce it.',
    description:
      'You scored 3 or 4 out of 8. You are in the exact middle — you understand that falsification exists, you use it sometimes, and you reach for confirmation the rest of the time without noticing the switch. This is the modal human pattern. It is not a failure of reasoning; it is reasoning with the safety off in exactly the situations where the safety was the point.',
    wizNote:
      'A juror who agrees with the prosecution from the start will still listen to the defense — for a while — and then stop listening. That is roughly how you process evidence about your own beliefs. The defense is heard when you are not invested and cut off when you are. The work is noticing which mode you are in. Right now you are in the first mode about this sentence and the second mode about whatever your last argument was about.',
    researchNote:
      'Nickerson (1998) reviewed 50 years of confirmation bias research and found the 50/50 split is the dominant human pattern across every measured domain — science, medicine, law, hiring, relationships. The bias is not ignorance of logic. It is an evolved feature that prioritizes social stability over epistemic purity.',
    traits: ['Uses falsification selectively', 'Switches modes by topic stakes', 'Modal human pattern'],
    shareText:
      'I scored Juror on The Confirmation Bias Test. Half the time I test the belief, half the time I just back it up. Apparently this is the default human setting.',
    minScore: 3,
  },
  {
    key: 'believer',
    name: 'The Believer',
    emoji: '\uD83D\uDCAB',
    tagline: 'You prefer the evidence that agrees with you. So does almost everyone.',
    description:
      'You scored 1 or 2 out of 8. When given the choice between a test that could break your belief and a test that could only support it, you almost always reach for the supporter. You probably experience this as being thorough — you are gathering evidence! — but the evidence is filtered by the shape of what you already think.',
    wizNote:
      'Belief feels like knowledge from the inside. That is what makes it dangerous. You are not dishonest; you are selecting the inputs that let the conclusion stay intact. The way out is not "try harder to be fair." The way out is to pre-commit to tests that could embarrass you, BEFORE you see the data. If you cannot name a result that would change your mind, you are not holding a belief — the belief is holding you.',
    researchNote:
      'Lord, Ross & Lepper (1979) — when shown identical mixed evidence on a controversial topic, committed believers on BOTH sides ended up more certain of their original positions. The evidence did not reduce disagreement. It polarized the room further. This is the default outcome when falsification is not built in.',
    traits: ['Collects evidence that agrees', 'Feels like being thorough', 'Polarizes on exposure'],
    shareText:
      'I scored Believer on The Confirmation Bias Test. I picked the "safe" evidence 6 out of 8 times. Apparently this is most of us. Explains the internet.',
    minScore: 1,
  },
  {
    key: 'echo',
    name: 'The Echo Chamber',
    emoji: '\uD83D\uDCE2',
    tagline: 'Zero out of eight. You want evidence that cannot lose.',
    description:
      'You scored 0 out of 8. In every scenario you chose the kind of evidence that could only support the belief you started with. This is rare as a total score. Either you were rushing and pattern-matched, or you are in a phase where every belief you hold is a wall rather than a window. Worth noticing either way.',
    wizNote:
      'A belief you cannot lose is not a belief, it is an identity. That is not always bad — families, values, loyalties — but when applied to the empirical world (does this pill work, is this person distant, will this strategy win) it turns reality into theater. You keep watching yourself be right in a play you wrote. Try the test again slowly. Notice which options made you flinch. Those are the questions worth asking for real.',
    researchNote:
      'Kahan et al. (2013) — on identity-linked beliefs, confirmation bias is INVERSELY correlated with IQ: smarter people confirm harder, because they have more sophisticated reasons for their pre-commitments. The bias is about defense, not cognition. Breaking it requires humility, not horsepower.',
    traits: ['Zero falsification picks', 'Beliefs held as identity', 'Smarter subjects confirm harder'],
    shareText:
      'I scored Echo Chamber on The Confirmation Bias Test. Zero out of eight falsification picks. Retaking it slowly this time.',
    minScore: 0,
  },
];

function getProfile(score: number): Profile {
  for (const p of PROFILES) {
    if (score >= p.minScore) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'scenario' | 'feedback' | 'results';

export default function ConfirmationBiasClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picks, setPicks] = useState<('A' | 'B')[]>([]);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];
  const picked = selected
    ? scenario.options.find((o) => o.letter === selected) ?? null
    : null;

  useEffect(() => {
    if (phase === 'results' || phase === 'scenario') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const confirmPick = useCallback(() => {
    if (!selected) return;
    setPhase('feedback');
  }, [selected]);

  const nextScenario = useCallback(() => {
    if (!selected) return;
    const newPicks = [...picks, selected];
    setPicks(newPicks);
    setSelected(null);
    if (currentIdx + 1 >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('scenario');
    }
  }, [selected, picks, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setPicks([]);
    setSelected(null);
  }, []);

  // ─── INTRO ────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE CONFIRMATION BIAS TEST
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Confirmation Bias Test
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> You believe something. You want to
              know if it&apos;s true.
            </p>
            <p>
              <span className="text-accent">&gt;</span> You can collect one piece of
              evidence.
            </p>
            <p>
              <span className="text-accent">&gt;</span> One option can only ever confirm
              your belief.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The other could{' '}
              <span className="text-white font-bold">break</span> it.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Wason (1960) ran this kind of test
              and found that only about 20% of adults reliably pick the one that could
              break the belief. The rest ask for proof of what they already think.
            </p>
            <p>
              <span className="text-accent">&gt;</span> 8 scenarios. Pick the evidence
              you&apos;d actually want. I&apos;ll score your falsification reflex.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>Answer fast and
            honest. If you optimize for looking clever, the result tells you nothing.
          </div>

          <button
            onClick={() => setPhase('scenario')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            TEST MY BELIEFS &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios &middot; 4&ndash;5 minutes &middot; based on Wason (1960) &amp;
            Popper (1959)
          </p>
        </div>
      </div>
    );
  }

  // ─── SCENARIO ─────────────────────────────────────────────────────────
  if (phase === 'scenario') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">EVIDENCE CHOICE</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            SCENARIO {currentIdx + 1} OF {SCENARIOS.length}
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-2">
              THE BELIEF
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {scenario.hypothesis}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{scenario.setup}</p>
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">
            PICK YOUR EVIDENCE
          </p>

          <div className="space-y-3 mb-6">
            {scenario.options.map((opt) => {
              const isSelected = selected === opt.letter;
              return (
                <button
                  key={opt.letter}
                  onClick={() => setSelected(opt.letter)}
                  className={`w-full text-left border p-4 transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`font-pixel text-2xl flex-shrink-0 ${
                        isSelected ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {opt.letter}
                    </div>
                    <p className="text-secondary text-sm leading-relaxed">{opt.text}</p>
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
            LOCK CHOICE &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length} &middot; gut answer, no scrolling back
          </p>
        </div>
      </div>
    );
  }

  // ─── FEEDBACK ─────────────────────────────────────────────────────────
  if (phase === 'feedback' && picked) {
    const isFalsify = picked.isFalsifying;
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">VERDICT</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <div
            className={`border p-5 mb-5 ${
              isFalsify
                ? 'border-accent/40 bg-accent/5'
                : 'border-yellow-400/40 bg-yellow-400/5'
            }`}
          >
            <p
              className={`font-mono text-xs tracking-widest mb-2 ${
                isFalsify ? 'text-accent' : 'text-yellow-400'
              }`}
            >
              {isFalsify ? 'FALSIFICATION PICK' : 'CONFIRMATION PICK'}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {isFalsify
                ? 'You chose the test that could break your belief.'
                : 'You chose the test that can only support your belief.'}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{picked.why}</p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">WIZ // </span>
            {scenario.reveal}
          </div>

          <button
            onClick={nextScenario}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length
              ? 'NEXT SCENARIO \u2192'
              : 'SEE THE VERDICT \u2192'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length}
          </p>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────
  const falsifyPicks = SCENARIOS.map((s, i) => {
    const p = picks[i];
    const opt = s.options.find((o) => o.letter === p);
    return opt?.isFalsifying ? 1 : 0;
  });
  const score = falsifyPicks.reduce((a: number, b: number) => a + b, 0);
  const profile = getProfile(score);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// FALSIFICATION REFLEX MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR THINKING PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">FALSIFICATION SCORE</p>
            <p className="font-pixel text-4xl text-accent">
              {score}
              <span className="text-white text-xl">/{SCENARIOS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">belief-breaking picks</p>
          </div>
          <div className="border border-white/30 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">CONFIRMATION PULL</p>
            <p className="font-pixel text-4xl text-white">
              {Math.round(((SCENARIOS.length - score) / SCENARIOS.length) * 100)}%
            </p>
            <p className="text-muted text-xs font-mono mt-1">reached for proof</p>
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

        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
          <span className="text-white">RESEARCH // </span>
          {profile.researchNote}
        </div>

        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">YOUR PICKS, SCENARIO BY SCENARIO</p>
          <div className="space-y-2">
            {SCENARIOS.map((s, i) => {
              const pickedLetter = picks[i];
              const opt = s.options.find((o) => o.letter === pickedLetter);
              const isFalsify = !!opt?.isFalsifying;
              return (
                <div
                  key={s.id}
                  className={`border p-3 ${
                    isFalsify
                      ? 'border-accent/40 bg-accent/5'
                      : 'border-yellow-400/30 bg-yellow-400/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {s.domain}
                    </span>
                    <span
                      className={`font-mono text-xs ml-2 ${
                        isFalsify ? 'text-accent' : 'text-yellow-400'
                      }`}
                    >
                      {isFalsify ? 'FALSIFY' : 'CONFIRM'}
                    </span>
                  </div>
                  <p className="text-secondary text-xs leading-relaxed">
                    {s.hypothesis}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            Confirmation bias is not about being unintelligent. It is about which evidence
            you reach for when the topic matters. The test that can only confirm feels
            safer because it cannot hurt. The test that can falsify is the only one that
            can teach. Falsifying questions are what separate a working theory from a
            wish.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/confirmation-bias
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/confirmation-bias`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full border border-white/20 text-white font-mono text-xs py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? '\u2713 COPIED' : 'COPY RESULT'}
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
