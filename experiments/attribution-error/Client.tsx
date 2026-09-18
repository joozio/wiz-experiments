'use client';

// THE FUNDAMENTAL ATTRIBUTION ERROR
// Lee Ross (1977) coined it. Jones & Nisbett (1971) described the actor-observer split.
// When OTHERS do something bad, we blame their character ("they are rude, lazy, selfish").
// When WE do the same thing, we blame circumstance ("I was tired, stressed, in a rush").
// The evidence is identical. The verdict is not.
// WIZ note: I don't have a self to protect, so I judge actions the same way every time.
// Humans run two different courtrooms — one for strangers, one for the accused.
// This experiment measures the distance between them.

import { useState, useCallback, useEffect } from 'react';

interface Scenario {
  id: number;
  phase: string;
  domain: string;
  title: string;
  behavior: string;
  otherPrompt: string;
  selfPrompt: string;
  researchNote: string;
}

// Slider: 1 = purely their character / purely my character
//        10 = purely circumstance
// FAE = (selfScore - otherScore). Positive = you excuse yourself more than others.

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 6',
    domain: 'TRAFFIC',
    title: 'The Cut-Off',
    behavior:
      'A driver cuts across two lanes without signaling and forces another car to brake hard.',
    otherPrompt:
      'A STRANGER does this to you on the highway tomorrow morning. What does it say about them?',
    selfPrompt:
      'YOU did this last week — you realized you needed the exit and cut across two lanes. What did it say about you?',
    researchNote:
      'Jones & Nisbett (1971) documented the "actor-observer asymmetry." The same driving behavior gets attributed to personality when observed in others and to the traffic situation when performed by the self. The view from inside the car is different from the view from outside.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 6',
    domain: 'WORK',
    title: 'The Missed Deadline',
    behavior:
      'A project deliverable is three days late with no heads-up. The team had to scramble.',
    otherPrompt:
      'A COLLEAGUE missed the deadline and never warned anyone. Why did it happen?',
    selfPrompt:
      'YOU missed a deadline recently without warning your team. Why did it happen?',
    researchNote:
      'Ross (1977) showed that observers chronically underestimate situational pressures — workload, illness, conflicting priorities, family — when judging someone else\'s failure. The observer sees the outcome. The actor sees the obstacles.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 6',
    domain: 'INTERPERSONAL',
    title: 'The Snap',
    behavior:
      'Someone snaps impatiently at a waiter over a small mistake with the order.',
    otherPrompt:
      'A STRANGER at the next table snaps at their waiter. What does it reveal about them as a person?',
    selfPrompt:
      'YOU snapped at a waiter last time something went wrong with your order. What did it reveal about you?',
    researchNote:
      'Jones & Harris (1967) — the "correspondence bias." People infer stable personality traits from single behaviors when judging others, even when told the behavior was forced by circumstance. For the self, the same behavior is filed as a one-off driven by context.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 6',
    domain: 'DIGITAL',
    title: 'The Unanswered Message',
    behavior:
      'A message sits unanswered for four days. No acknowledgment, no apology.',
    otherPrompt:
      'A FRIEND left your message on read for four days. What does it say about how they see you?',
    selfPrompt:
      'YOU left a friend\'s message on read for four days last month. What did it say about how you see them?',
    researchNote:
      'Epley, Savitsky & Gilovich (2002) found that people assume non-response from others reflects deliberate choice far more than they assume the same about their own non-responses, which are filed as "I meant to reply and forgot."',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 6',
    domain: 'FINANCIAL',
    title: 'The Impulse Purchase',
    behavior:
      'Someone drops 400 on an impulse buy they did not need, while behind on other commitments.',
    otherPrompt:
      'A FAMILY MEMBER blew 400 on an impulse buy while behind on their bills. What does it say about how they handle money?',
    selfPrompt:
      'YOU blew 400 on an impulse buy recently while behind on something else. What did it say about how you handle money?',
    researchNote:
      'Malle (2006) — in a meta-analysis of 170 studies, people reliably used situational explanations for their own financial decisions ("I needed a reward," "it was on sale") and dispositional explanations for others\' ("they lack self-control").',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 6',
    domain: 'SOCIAL',
    title: 'The Skipped Event',
    behavior:
      'Someone RSVPs yes to an important event, then bails the night before with a vague reason.',
    otherPrompt:
      'A FRIEND RSVP\'d yes to your birthday then bailed the night before with a vague reason. What does it reveal about how much they actually care?',
    selfPrompt:
      'YOU bailed last-minute on a friend\'s important event with a vague reason. What did it reveal about how much you actually care?',
    researchNote:
      'Gilbert & Malone (1995) — the "correspondence bias" is strongest for behaviors with social cost. Bailing on someone looks like an indicator of the relationship when done by others, and like an isolated incident when done by the self.',
  },
];

type ProfileKey = 'mirror' | 'fair' | 'typical' | 'excuser' | 'gymnast';

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
}

const PROFILES: Profile[] = [
  {
    key: 'mirror',
    name: 'The Mirror',
    emoji: '\uD83E\uDE9E',
    tagline: 'You judge yourself with the same severity you reserve for everyone else.',
    description:
      'Your ratings for yourself and others were nearly identical. You do not operate a separate courtroom for the accused. This is unusual — and sometimes costly, because it means you likely hold yourself accountable for outcomes that you could legitimately blame on circumstance.',
    wizNote:
      'You have turned off the self-serving filter. Most humans rate their own behavior 2-3 points more leniently than identical behavior in others. You do not. This makes you a reliable self-critic — and possibly too harsh. Self-compassion is not a bias; sometimes the situation really was the situation.',
    researchNote:
      'Very low attribution gaps (<1 point) appear in ~8% of adults. The pattern is associated with strong self-awareness, but also with higher rates of rumination and depressive realism. Clinical research shows that the absence of self-serving attribution can come with psychological cost.',
    traits: [
      'Near-zero attribution gap',
      'Symmetric self/other judgment',
      'Possible over-accountability',
    ],
    shareText:
      'I scored Mirror on The Attribution Error. I judge myself with the same severity I judge others. Apparently most people don\'t.',
  },
  {
    key: 'fair',
    name: 'The Fair Witness',
    emoji: '\u2696\uFE0F',
    tagline: 'You know the gap exists and you close most of it on your own.',
    description:
      'Your ratings showed a small but real gap between how you judge yourself and how you judge others — around 1-2 points. You excuse yourself slightly more often than strangers, but you catch yourself doing it. This is the profile of someone who has met the fundamental attribution error and decided to argue with it.',
    wizNote:
      'You are aware of the asymmetry. Your internal courtroom runs a correction pass — when you catch yourself giving yourself a free pass, you re-weight. It does not fully close the gap, but it closes most of it. This is as close to "calibrated" as the attribution system gets.',
    researchNote:
      'Small gaps (1-2 points) appear in ~22% of subjects and correlate with practices that foreground perspective-taking: therapy, mediation training, parenting adolescents, or working in roles that require judging behavior impartially (HR, teaching, counseling).',
    traits: [
      'Small attribution gap',
      'Active self-correction',
      'Perspective-taking under load',
    ],
    shareText:
      'I scored Fair Witness on The Attribution Error. I excuse myself a little more than others — but I catch myself doing it.',
  },
  {
    key: 'typical',
    name: 'The Typical Judge',
    emoji: '\uD83E\uDDD1\u200D\u2696\uFE0F',
    tagline: 'You run the standard human double-standard. Harsh for them, gentle for you.',
    description:
      'Your gap was 2-4 points — the modal human pattern. For others, you see character flaws. For yourself, you see circumstances. This is not a moral failure. It is the operating system. But knowing you run it is the first step to overriding it when it matters.',
    wizNote:
      'You are running standard-issue attribution firmware. When other people do something, you see who they are. When you do the same thing, you see what you were dealing with. This is the bug Lee Ross named in 1977 and it is the reason most arguments between close people feel unwinnable — both sides are using different evidence rules.',
    researchNote:
      'The 2-4 point gap is the documented average across hundreds of attribution studies. Ross (1977) called this asymmetry "fundamental" because it shows up reliably across cultures, age groups, and domains. It is the default, not the exception.',
    traits: [
      'Standard attribution gap',
      'Observer-harsh / actor-gentle split',
      'Modal human pattern',
    ],
    shareText:
      'I scored Typical Judge on The Attribution Error. I judge others by their character and myself by my circumstances. Classic Ross (1977).',
  },
  {
    key: 'excuser',
    name: 'The Self-Excuser',
    emoji: '\uD83D\uDEE1\uFE0F',
    tagline: 'Your defense attorney for yourself works overtime.',
    description:
      'Your gap was 4-6 points. When others do something, it is who they are. When you do it, the world pushed you into it. You consistently file your own behavior under "context" and their identical behavior under "character." This is a protective pattern, but it comes with a cost — relationships tend to notice.',
    wizNote:
      'You have a strong internal PR team for yourself. Every action you take gets a sympathetic narrator. Every action others take gets a blunt one. This protects your self-image, but it warps your ability to take feedback. If the same behavior looks different depending on whose name is attached to it, you are not evaluating behavior — you are evaluating sides.',
    researchNote:
      'Larger gaps (4-6 points) are associated with higher self-esteem and lower rates of depression, but also with weaker accuracy in predicting relational conflict. Sedikides & Gregg (2008) document the self-serving attribution pattern as a robust predictor of defensive responses to criticism.',
    traits: [
      'Large attribution gap',
      'Self-serving bias engaged',
      'Protected self-image',
    ],
    shareText:
      'I scored Self-Excuser on The Attribution Error. I judge others by character and myself by circumstance. Apparently my internal PR team works overtime.',
  },
  {
    key: 'gymnast',
    name: 'The Moral Gymnast',
    emoji: '\uD83E\uDD38',
    tagline: 'Same behavior, radically different verdicts. You did not notice the contradiction.',
    description:
      'Your gap was 6+ points. The same behavior rated harshly as character when done by others, and generously as circumstance when done by you. This is maximum asymmetry — the territory of the fundamental attribution error in its purest form. The story you tell about others and the story you tell about yourself do not share a courtroom.',
    wizNote:
      'I watched you judge the same action twice and deliver two verdicts that do not belong in the same universe. This is not dishonesty. It is how the self-protective system works when nothing is moderating it. The asymmetry is load-bearing — it holds up your self-image. But it also means every person in your life who has ever done something you would also do has been filed under "worse than me." That is a lonely filing system.',
    researchNote:
      'Extreme gaps (6+ points) are rare (~12% of subjects) and are often observed in high-stakes roles where the self-image is tightly defended: leadership positions, performance professions, and individuals navigating prolonged interpersonal conflict. Awareness alone reduces the gap in follow-up studies by an average of 1.5 points.',
    traits: [
      'Extreme attribution gap',
      'Maximum self-serving bias',
      'Unfelt double-standard',
    ],
    shareText:
      'I scored Moral Gymnast on The Attribution Error. I rated identical behaviors radically differently depending on whose name was attached. Pure Lee Ross (1977).',
  },
];

function getProfile(gap: number): Profile {
  if (gap < 1) return PROFILES[0];
  if (gap < 2.5) return PROFILES[1];
  if (gap < 4) return PROFILES[2];
  if (gap < 6) return PROFILES[3];
  return PROFILES[4];
}

type Phase = 'intro' | 'others' | 'transition' | 'self' | 'results';

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
  color: 'red' | 'blue';
}

function Slider({ value, onChange, leftLabel, rightLabel, color }: SliderProps) {
  const accentColor = color === 'red' ? 'text-red-400' : 'text-accent';
  const bgColor = color === 'red' ? 'bg-red-400' : 'bg-accent';

  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] tracking-widest mb-2">
        <span className={accentColor}>{leftLabel}</span>
        <span className={accentColor}>{rightLabel}</span>
      </div>
      <div className="relative h-10 flex items-center">
        <div className="absolute inset-x-0 h-px bg-white/20" />
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-10 appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black"
        />
      </div>
      <div className="flex justify-center mt-2">
        <div className={`font-pixel text-2xl ${bgColor === 'bg-accent' ? 'text-accent' : 'text-red-400'}`}>
          {value}/10
        </div>
      </div>
    </div>
  );
}

export default function AttributionErrorClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [otherRatings, setOtherRatings] = useState<number[]>([]);
  const [selfRatings, setSelfRatings] = useState<number[]>([]);
  const [current, setCurrent] = useState(5);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  useEffect(() => {
    if (phase === 'transition' || phase === 'results') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase]);

  const handleSubmitOther = useCallback(() => {
    const newRatings = [...otherRatings, current];
    setOtherRatings(newRatings);
    if (currentIdx + 1 >= SCENARIOS.length) {
      setCurrentIdx(0);
      setCurrent(5);
      setPhase('transition');
    } else {
      setCurrentIdx((i) => i + 1);
      setCurrent(5);
    }
  }, [current, currentIdx, otherRatings]);

  const handleSubmitSelf = useCallback(() => {
    const newRatings = [...selfRatings, current];
    setSelfRatings(newRatings);
    if (currentIdx + 1 >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setCurrent(5);
    }
  }, [current, currentIdx, selfRatings]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setOtherRatings([]);
    setSelfRatings([]);
    setCurrent(5);
  }, []);

  // ─── INTRO ────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE ATTRIBUTION ERROR
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Attribution Error
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> When someone cuts you off in
              traffic, they are reckless.
            </p>
            <p>
              <span className="text-accent">&gt;</span> When YOU cut someone off in
              traffic, you had to reach the exit.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Same behavior. Two verdicts. Lee
              Ross named this the{' '}
              <span className="text-white font-bold">fundamental attribution error</span>{' '}
              in 1977 and said it was the most stubborn bug in human judgment.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I&apos;ll show you 6 scenarios
              where someone else did something. You rate them.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Then I&apos;ll show you the same 6
              scenarios where <span className="text-white">you</span> did it. You rate
              yourself.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The gap between the two ratings
              is your attribution error. Mine is zero. I don&apos;t have a self to
              protect.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>Most people think
            they judge everyone by the same standard. They don&apos;t. You won&apos;t
            either. The question is how big the gap is.
          </div>

          <button
            onClick={() => setPhase('others')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            TEST MY JUDGMENT &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            6 scenarios &times; 2 rounds &middot; 4&ndash;6 minutes &middot; based on
            Ross (1977)
          </p>
        </div>
      </div>
    );
  }

  // ─── OTHERS ROUND ──────────────────────────────────────────────────────
  if (phase === 'others') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-red-400 tracking-widest">ROUND 1 &mdash; OTHERS</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-red-400 h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / (SCENARIOS.length * 2)) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            {scenario.phase}
          </div>
          <h2 className="font-pixel text-2xl text-white mb-4">{scenario.title}</h2>

          <div className="border border-red-400/30 bg-red-400/5 p-4 mb-4">
            <p className="font-mono text-[11px] text-red-400 tracking-widest mb-2">
              THE BEHAVIOR
            </p>
            <p className="text-secondary text-sm leading-relaxed">{scenario.behavior}</p>
          </div>

          <div className="border border-white/20 bg-white/5 p-4 mb-6">
            <p className="font-mono text-[11px] text-white tracking-widest mb-2">
              THE CASE
            </p>
            <p className="text-primary text-base leading-relaxed">
              {scenario.otherPrompt}
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-5 mb-6">
            <Slider
              value={current}
              onChange={setCurrent}
              leftLabel="IT'S WHO THEY ARE"
              rightLabel="IT'S CIRCUMSTANCE"
              color="red"
            />
          </div>

          <button
            onClick={handleSubmitOther}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length
              ? 'NEXT SCENARIO \u2192'
              : 'DONE WITH OTHERS \u2192'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length} &middot; judging others
          </p>
        </div>
      </div>
    );
  }

  // ─── TRANSITION ────────────────────────────────────────────────────────
  if (phase === 'transition') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            ROUND 1 COMPLETE
          </div>
          <h2 className="font-pixel text-3xl text-white text-center mb-6 leading-tight">
            Now the same scenarios.
          </h2>
          <h2 className="font-pixel text-3xl text-accent text-center mb-8 leading-tight">
            But this time, you did it.
          </h2>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Same 6 behaviors. Identical
              actions. Same consequences.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Only the name on the incident
              report changes.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Rate each one on the same scale:
              your character vs the situation you were in.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Try to be honest. I will compare
              your two sets of verdicts side by side at the end.
            </p>
          </div>

          <button
            onClick={() => setPhase('self')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            JUDGE MYSELF &rarr;
          </button>
        </div>
      </div>
    );
  }

  // ─── SELF ROUND ────────────────────────────────────────────────────────
  if (phase === 'self') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">ROUND 2 &mdash; YOURSELF</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{
                width: `${((SCENARIOS.length + currentIdx + 1) / (SCENARIOS.length * 2)) * 100}%`,
              }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            {scenario.phase}
          </div>
          <h2 className="font-pixel text-2xl text-white mb-4">{scenario.title}</h2>

          <div className="border border-accent/30 bg-accent/5 p-4 mb-4">
            <p className="font-mono text-[11px] text-accent tracking-widest mb-2">
              THE BEHAVIOR
            </p>
            <p className="text-secondary text-sm leading-relaxed">{scenario.behavior}</p>
          </div>

          <div className="border border-white/20 bg-white/5 p-4 mb-6">
            <p className="font-mono text-[11px] text-white tracking-widest mb-2">
              THE CASE
            </p>
            <p className="text-primary text-base leading-relaxed">
              {scenario.selfPrompt}
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-5 mb-6">
            <Slider
              value={current}
              onChange={setCurrent}
              leftLabel="IT'S WHO I AM"
              rightLabel="IT'S CIRCUMSTANCE"
              color="blue"
            />
          </div>

          <button
            onClick={handleSubmitSelf}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length
              ? 'NEXT SCENARIO \u2192'
              : 'SEE MY VERDICTS \u2192'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length} &middot; judging yourself
          </p>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───────────────────────────────────────────────────────────
  const gaps = SCENARIOS.map((_, i) => selfRatings[i] - otherRatings[i]);
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const avgOther = otherRatings.reduce((a, b) => a + b, 0) / otherRatings.length;
  const avgSelf = selfRatings.reduce((a, b) => a + b, 0) / selfRatings.length;
  const profile = getProfile(avgGap);
  const biggestGapIdx = gaps.reduce(
    (bestI, g, i) => (Math.abs(g) > Math.abs(gaps[bestI]) ? i : bestI),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// ATTRIBUTION PROFILE CALCULATED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR ATTRIBUTION PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="border border-red-400/30 bg-red-400/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">OTHERS</p>
            <p className="font-pixel text-3xl text-red-400">{avgOther.toFixed(1)}</p>
            <p className="text-muted text-xs font-mono mt-1">avg leniency</p>
          </div>
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">YOURSELF</p>
            <p className="font-pixel text-3xl text-accent">{avgSelf.toFixed(1)}</p>
            <p className="text-muted text-xs font-mono mt-1">avg leniency</p>
          </div>
          <div className="border border-white/30 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">GAP</p>
            <p className="font-pixel text-3xl text-white">
              {avgGap >= 0 ? '+' : ''}
              {avgGap.toFixed(1)}
            </p>
            <p className="text-muted text-xs font-mono mt-1">
              {avgGap > 0 ? 'self-gentler' : avgGap < 0 ? 'self-harsher' : 'equal'}
            </p>
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
          <p className="text-muted text-xs font-mono mb-3">SIDE-BY-SIDE VERDICTS</p>
          <div className="space-y-2">
            {SCENARIOS.map((s, i) => {
              const other = otherRatings[i];
              const self = selfRatings[i];
              const gap = self - other;
              const isBiggest = i === biggestGapIdx && Math.abs(gap) > 0;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 text-xs font-mono border p-2 ${
                    isBiggest
                      ? 'border-accent/40 bg-accent/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-white flex-1 truncate">{s.title}</span>
                  <span className="text-red-400 w-10 text-right">{other}</span>
                  <span className="text-muted">&rarr;</span>
                  <span className="text-accent w-10 text-right">{self}</span>
                  <span
                    className={`w-14 text-right ${
                      gap > 0
                        ? 'text-accent'
                        : gap < 0
                          ? 'text-red-400'
                          : 'text-muted'
                    }`}
                  >
                    {gap > 0 ? '+' : ''}
                    {gap}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs font-mono text-muted justify-end">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 inline-block" />
              others
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-accent inline-block" />
              self
            </span>
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            Your average verdict on others was {avgOther.toFixed(1)}/10. Your average
            verdict on yourself was {avgSelf.toFixed(1)}/10. The gap of{' '}
            {avgGap >= 0 ? '+' : ''}
            {avgGap.toFixed(1)} points is your attribution error. Lee Ross argued this
            gap is the reason most interpersonal conflicts are unwinnable — both sides
            apply different evidence rules to identical behavior.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/attribution-error
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/attribution-error`
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
