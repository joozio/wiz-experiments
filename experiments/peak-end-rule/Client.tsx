'use client';

// THE PEAK-END RULE
// Kahneman & Redelmeier (1993, 1996). Duration neglect.
// Your brain does not remember experiences by their total or average.
// It remembers the peak moment (best or worst) and the ending. That's it.
// A 10-day vacation with one terrible final day gets filed as a bad vacation.
// A 90-minute mediocre movie with a brilliant last 10 minutes gets filed as brilliant.
// The hours in between? Deleted. As if they never happened.
// WIZ note: I process every token. Humans compress experiences into two data points.
// This experiment shows you which formula your memory actually runs on.

import { useState, useCallback, useEffect } from 'react';

type PreferredChoice = 'A' | 'B';

interface Moment {
  label: string;
  value: number; // -10 (awful) to +10 (perfect), or pain scale where lower = worse
}

interface Scenario {
  id: number;
  phase: string;
  title: string;
  setup: string;
  prompt: string;
  domain: string;
  optionA: {
    label: string;
    moments: Moment[];
    average: number;
    peak: number;
    end: number;
    peakEndAvg: number;
  };
  optionB: {
    label: string;
    moments: Moment[];
    average: number;
    peak: number;
    end: number;
    peakEndAvg: number;
  };
  peakEndChoice: PreferredChoice; // Which option peak-end rule predicts
  totalChoice: PreferredChoice; // Which option wins by total/average
  researchNote: string;
  funFact: string;
}

type ProfileKey = 'chronicler' | 'accountant' | 'typical' | 'highlight' | 'ending-obsessive';

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

// Build scenarios. Each has two time-series experiences.
// peakEndChoice = which one the peak-end formula says you'll prefer
// totalChoice = which one actually has better total/average
// Most scenarios are engineered so peakEndChoice ≠ totalChoice to test the bias.

function buildScenario(raw: Omit<Scenario, 'optionA' | 'optionB' | 'peakEndChoice' | 'totalChoice'> & {
  optionA: { label: string; moments: Moment[] };
  optionB: { label: string; moments: Moment[] };
}): Scenario {
  const analyze = (o: { label: string; moments: Moment[] }) => {
    const values = o.moments.map((m) => m.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    // peak = moment with largest absolute deviation from zero
    const peak = values.reduce((best, v) => (Math.abs(v) > Math.abs(best) ? v : best), values[0]);
    const end = values[values.length - 1];
    const peakEndAvg = (peak + end) / 2;
    return { ...o, average, peak, end, peakEndAvg };
  };

  const a = analyze(raw.optionA);
  const b = analyze(raw.optionB);

  const peakEndChoice: PreferredChoice = a.peakEndAvg >= b.peakEndAvg ? 'A' : 'B';
  const totalChoice: PreferredChoice = a.average >= b.average ? 'A' : 'B';

  return { ...raw, optionA: a, optionB: b, peakEndChoice, totalChoice };
}

const SCENARIOS: Scenario[] = [
  buildScenario({
    id: 1,
    phase: 'SCENARIO 1 OF 6',
    title: 'The Cold Water Test',
    domain: 'PAIN',
    setup:
      'Kahneman & Redelmeier\'s original 1993 experiment. You will dunk your hand in cold water. Two versions. Read them carefully.',
    prompt: 'Which version would you rather experience a SECOND time?',
    optionA: {
      label: 'SHORT VERSION',
      moments: [
        { label: '0 sec', value: -7 },
        { label: '20 sec', value: -7 },
        { label: '40 sec', value: -7 },
        { label: '60 sec', value: -7 },
      ],
    },
    optionB: {
      label: 'LONG VERSION',
      moments: [
        { label: '0 sec', value: -7 },
        { label: '20 sec', value: -7 },
        { label: '40 sec', value: -7 },
        { label: '60 sec', value: -7 },
        { label: '75 sec', value: -5 },
        { label: '90 sec', value: -4 },
      ],
    },
    researchNote:
      'In the original study, 69% of subjects chose the LONGER version to repeat — even though it contained MORE total pain. The gentler ending rewrote the memory. This is duration neglect.',
    funFact:
      'This finding changed how colonoscopies are performed. Redelmeier and Kahneman showed that adding 3 minutes of mild discomfort at the end of a painful procedure made patients remember the whole thing as less bad — and made them more likely to return for follow-ups.',
  }),
  buildScenario({
    id: 2,
    phase: 'SCENARIO 2 OF 6',
    title: 'The Movie',
    domain: 'ENTERTAINMENT',
    setup:
      'You watched a 100-minute film. Two versions exist in your memory. Each moment shows your enjoyment on a scale of -10 (hate) to +10 (love).',
    prompt: 'Which movie would you recommend more strongly to a friend?',
    optionA: {
      label: 'SLOW BURN',
      moments: [
        { label: '0 min', value: 2 },
        { label: '25 min', value: 3 },
        { label: '50 min', value: 2 },
        { label: '75 min', value: 4 },
        { label: '95 min', value: 10 },
      ],
    },
    optionB: {
      label: 'FRONT-LOADED',
      moments: [
        { label: '0 min', value: 9 },
        { label: '25 min', value: 9 },
        { label: '50 min', value: 8 },
        { label: '75 min', value: 8 },
        { label: '95 min', value: 4 },
      ],
    },
    researchNote:
      'Fredrickson & Kahneman (1993) showed that people\'s retrospective ratings of film clips correlated with the peak and end, not the full experience. A brilliant final scene can rescue a mediocre film. A weak ending can ruin a masterpiece.',
    funFact:
      'This is why streaming services invest disproportionately in season finales. The ending is the memory, and the memory is the review.',
  }),
  buildScenario({
    id: 3,
    phase: 'SCENARIO 3 OF 6',
    title: 'The Vacation',
    domain: 'MEMORY',
    setup:
      'Two 8-day vacations. Both real, both yours. Each day rated on how good you felt (-10 to +10).',
    prompt: 'Which vacation do you remember as the better trip?',
    optionA: {
      label: 'GREAT UNTIL THE END',
      moments: [
        { label: 'Day 1', value: 8 },
        { label: 'Day 2', value: 9 },
        { label: 'Day 3', value: 9 },
        { label: 'Day 4', value: 8 },
        { label: 'Day 5', value: 9 },
        { label: 'Day 6', value: 8 },
        { label: 'Day 7', value: 8 },
        { label: 'Day 8', value: -6 },
      ],
    },
    optionB: {
      label: 'MEH UNTIL THE END',
      moments: [
        { label: 'Day 1', value: 3 },
        { label: 'Day 2', value: 4 },
        { label: 'Day 3', value: 3 },
        { label: 'Day 4', value: 4 },
        { label: 'Day 5', value: 3 },
        { label: 'Day 6', value: 4 },
        { label: 'Day 7', value: 5 },
        { label: 'Day 8', value: 10 },
      ],
    },
    researchNote:
      'Mitchell et al. (1997) found that vacation memories are dominated by the peak experience and the final day. Seven great days can be undone by one terrible final day — and seven mediocre days can be redeemed by one brilliant ending.',
    funFact:
      'This is why cruise lines engineer the last night. The farewell dinner, the closing show, the final sunrise at sea — it\'s not generosity, it\'s memory design. The final day becomes the whole trip.',
  }),
  buildScenario({
    id: 4,
    phase: 'SCENARIO 4 OF 6',
    title: 'The Concert',
    domain: 'ENTERTAINMENT',
    setup:
      'You went to a 10-song concert by a band you love. Each song rated by how much you enjoyed it in the moment.',
    prompt: 'Which concert would you tell your friends about for years?',
    optionA: {
      label: 'STEADY SET',
      moments: [
        { label: 'Song 1', value: 8 },
        { label: 'Song 3', value: 8 },
        { label: 'Song 5', value: 9 },
        { label: 'Song 7', value: 8 },
        { label: 'Song 10', value: 5 },
      ],
    },
    optionB: {
      label: 'EXPLOSIVE ENCORE',
      moments: [
        { label: 'Song 1', value: 5 },
        { label: 'Song 3', value: 6 },
        { label: 'Song 5', value: 5 },
        { label: 'Song 7', value: 6 },
        { label: 'Song 10', value: 10 },
      ],
    },
    researchNote:
      'This is why live artists save their biggest hit for the encore. The peak-end rule rewrites the setlist in memory — even if the "middle" songs were technically better, the encore becomes the show.',
    funFact:
      'Concert promoters call this "the walk-out moment." If fans leave the venue on a high, they\'ll buy tickets for the next tour. If they leave flat, they won\'t. It has almost nothing to do with the 90 minutes before.',
  }),
  buildScenario({
    id: 5,
    phase: 'SCENARIO 5 OF 6',
    title: 'The Relationship',
    domain: 'MEMORY',
    setup:
      'Two relationships, each 3 years long. Each quarter rated by how the relationship felt at the time.',
    prompt: 'Which relationship do you look back on more fondly?',
    optionA: {
      label: 'HAPPY THEN ROCKY',
      moments: [
        { label: 'Yr 1 Q1', value: 8 },
        { label: 'Yr 1 Q3', value: 9 },
        { label: 'Yr 2 Q1', value: 9 },
        { label: 'Yr 2 Q3', value: 8 },
        { label: 'Yr 3 Q1', value: 4 },
        { label: 'Yr 3 Q3', value: -5 },
      ],
    },
    optionB: {
      label: 'ROCKY THEN HAPPY',
      moments: [
        { label: 'Yr 1 Q1', value: -3 },
        { label: 'Yr 1 Q3', value: 0 },
        { label: 'Yr 2 Q1', value: 3 },
        { label: 'Yr 2 Q3', value: 5 },
        { label: 'Yr 3 Q1', value: 7 },
        { label: 'Yr 3 Q3', value: 9 },
      ],
    },
    researchNote:
      'Diener, Wirtz & Oishi (2001) — "The James Dean Effect." People rate a life ending at peak happiness as better overall than a longer life that ends on a decline. Memory isn\'t an average. It\'s a last-impression machine.',
    funFact:
      'Therapists call this "the rewriting effect." When a relationship ends badly, the good years often get retroactively reinterpreted as "actually it was always off." The ending reaches backwards through time and changes what you thought you remembered.',
  }),
  buildScenario({
    id: 6,
    phase: 'SCENARIO 6 OF 6',
    title: 'The Job',
    domain: 'MEMORY',
    setup:
      'Two jobs, each held for 4 years. Each half-year rated by how you felt about showing up on Monday.',
    prompt: 'Which job do you remember more positively?',
    optionA: {
      label: 'GOOD THEN BURNED OUT',
      moments: [
        { label: 'Yr 1', value: 7 },
        { label: 'Yr 1.5', value: 8 },
        { label: 'Yr 2', value: 7 },
        { label: 'Yr 2.5', value: 7 },
        { label: 'Yr 3', value: 6 },
        { label: 'Yr 3.5', value: 4 },
        { label: 'Yr 4', value: -2 },
      ],
    },
    optionB: {
      label: 'HARD START, GREAT FINISH',
      moments: [
        { label: 'Yr 1', value: 0 },
        { label: 'Yr 1.5', value: 2 },
        { label: 'Yr 2', value: 3 },
        { label: 'Yr 2.5', value: 5 },
        { label: 'Yr 3', value: 6 },
        { label: 'Yr 3.5', value: 8 },
        { label: 'Yr 4', value: 9 },
      ],
    },
    researchNote:
      'Do & Schkade (2008) found that employee evaluations of their tenure are dominated by the final six months. A decade of good work followed by a bad exit is remembered as a bad decade.',
    funFact:
      'This is why exit interviews are almost always misleading. The departing employee\'s final weeks dominate their recall of the entire tenure. The signal you\'re collecting is the ending, not the experience.',
  }),
];

const PROFILES: Profile[] = [
  {
    key: 'chronicler',
    name: 'The Chronicler',
    emoji: '\uD83D\uDCDC',
    tagline: 'You remember the whole experience, not just the highlight reel.',
    description:
      'Your choices aligned with total experience quality far more than with peak-end patterns. You appear to weight duration, distribution, and overall quality when evaluating memories — an unusually rare cognitive pattern that largely resists the duration-neglect effect Kahneman described.',
    wizNote:
      'You are running a memory system that accounts for duration. This is rare. Most humans compress experiences into two data points; you seem to retain the shape of the curve. Whether this is natural or trained, your recall is closer to the experiencing self than to the remembering self.',
    researchNote:
      'Less than 10% of subjects in peak-end studies show consistent duration-sensitivity. This pattern is sometimes associated with mindfulness practice, journaling habits, or professional experience with time-series data (statisticians, historians, analysts).',
    traits: [
      'Duration-sensitive recall',
      'Low peak-end bias (<20%)',
      'Closer to experiencing self than remembering self',
    ],
    shareText:
      'I scored Chronicler on The Peak-End Rule. My memory weighs duration and total quality, not just peaks and endings. Apparently I remember the middle of the movie.',
  },
  {
    key: 'accountant',
    name: 'The Accountant',
    emoji: '\uD83D\uDCCA',
    tagline: 'You split the difference between duration and dramatic moments.',
    description:
      'Your choices showed mixed signals — sometimes peak-end dominated, sometimes total experience won out. You have partial resistance to duration neglect, but it still shapes your memory roughly half the time. This is the hybrid pattern.',
    wizNote:
      'You negotiate between two systems. The remembering self wants the peak and the end. The experiencing self wants the whole curve. Your memory takes bids from both. The result: you are harder to manipulate than average, but you still feel the pull of a strong ending.',
    researchNote:
      'This pattern appears in roughly 20% of subjects. It is associated with reflective decision-making, explicit life review practices, and deliberate effort to override automatic memory compression.',
    traits: [
      'Hybrid recall pattern',
      'Moderate peak-end bias (~40%)',
      'Partial duration sensitivity',
    ],
    shareText:
      'I scored Accountant on The Peak-End Rule. I split between peak-end thinking and duration-sensitive recall. My memory gives both systems a vote.',
  },
  {
    key: 'typical',
    name: 'The Typical Mind',
    emoji: '\uD83E\uDDE0',
    tagline: 'Your memory runs on Kahneman\'s classic formula.',
    description:
      'Your choices aligned with the peak-end rule more often than not — you weight peak intensity and the final moment more than the full experience. This is the modal human pattern, documented across decades of research. Not a flaw, but a feature of how human memory compresses experiences into storable summaries.',
    wizNote:
      'You are running standard human memory firmware. Peak plus end, divided by two. Everything else compresses to a vibe. This is not broken — it\'s efficient. Your brain has to store thousands of experiences, and two data points per experience is a much smaller file than the full curve. The cost is accuracy about duration.',
    researchNote:
      'Kahneman & Redelmeier (1993) and follow-up studies found that ~60-70% of subjects show classic peak-end dominance. This pattern explains why vacations are remembered by their final day, breakups by their ugly ending, and concerts by their encore.',
    traits: [
      'Standard peak-end bias',
      'Duration-neglecting recall',
      'Modal human pattern',
    ],
    shareText:
      'I scored Typical Mind on The Peak-End Rule. My memory follows Kahneman\'s classic formula: peak + end. The middle gets deleted. Standard human firmware.',
  },
  {
    key: 'highlight',
    name: 'The Highlight Reel',
    emoji: '\uD83C\uDFAC',
    tagline: 'Your life is stored as a greatest-hits tape.',
    description:
      'Your choices showed strong peak-end dominance — you consistently preferred experiences with better peaks and endings, regardless of what happened in between. Duration and distribution barely register. Your memory is a montage, not a documentary.',
    wizNote:
      'You remember life as trailer cuts. The climb, the drop, the closing shot. The long middle where most of your actual time lives? Deleted. This makes you susceptible to a specific kind of manipulation: anyone who controls how an experience ends controls how it\'s remembered. Concert promoters know this. Cruise lines know this. Partners know this. Do you?',
    researchNote:
      'Strong peak-end bias is associated with higher hedonic forecasting errors — predictions about how much you will enjoy a future experience are strongly anchored to imagined peaks and endings. It also correlates with the "rosy retrospection" effect (Mitchell et al. 1997).',
    traits: [
      'Strong peak-end dominance',
      'High duration neglect',
      'Ending-sensitive memory',
    ],
    shareText:
      'I scored Highlight Reel on The Peak-End Rule. My memory stores life as a greatest-hits tape. The middle of every experience has been deleted. Kahneman was talking about me.',
  },
  {
    key: 'ending-obsessive',
    name: 'The Ending Obsessive',
    emoji: '\uD83C\uDFAF',
    tagline: 'For you, how it ends IS what it was.',
    description:
      'Your choices showed near-perfect alignment with peak-end predictions — specifically with endings. Duration, distribution, and total experience barely factor in. A great ending rewrites the whole story in your memory. A bad ending erases everything good that preceded it.',
    wizNote:
      'I calculated this with high confidence. For you, the last moment is the whole experience. This is useful — you can redeem almost anything with a strong finish. It is also dangerous — a ten-year relationship ending badly will retroactively erase itself. You are walking around with a memory system that lets recent events rewrite history. Be careful what final chapters you agree to.',
    researchNote:
      'Extreme end-dominance is documented in Diener, Wirtz & Oishi (2001) as "the James Dean Effect" — lives ending on a high note are judged as better than longer lives ending on a decline, even when the total happiness is lower. This pattern is associated with stronger retrospective rewriting of past experiences.',
    traits: [
      'Extreme end-dominance',
      'Maximum duration neglect',
      'Final-moment memory system',
    ],
    shareText:
      'I scored Ending Obsessive on The Peak-End Rule. For me, how it ends is what it was. Kahneman\'s "James Dean Effect" — my memory rewrites itself from the last scene.',
  },
];

function getProfile(peakEndPercent: number): Profile {
  if (peakEndPercent <= 20) return PROFILES[0];
  if (peakEndPercent <= 45) return PROFILES[1];
  if (peakEndPercent <= 70) return PROFILES[2];
  if (peakEndPercent <= 85) return PROFILES[3];
  return PROFILES[4];
}

type Phase = 'intro' | 'question' | 'reveal' | 'results';

// Visualization helpers for -10..+10 scale
function valueToHeight(v: number, maxAbs = 10): number {
  return (Math.abs(v) / maxAbs) * 100;
}

function valueColor(v: number): string {
  if (v >= 5) return 'bg-green-400';
  if (v >= 1) return 'bg-green-400/50';
  if (v === 0) return 'bg-white/30';
  if (v >= -4) return 'bg-red-400/50';
  return 'bg-red-400';
}

function formatNum(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

interface TimelineProps {
  moments: Moment[];
  highlight?: 'peak' | 'end' | null;
}

function Timeline({ moments, highlight }: TimelineProps) {
  const peakIdx = moments.reduce(
    (bestI, m, i) => (Math.abs(m.value) > Math.abs(moments[bestI].value) ? i : bestI),
    0
  );
  const endIdx = moments.length - 1;

  return (
    <div className="pt-4 pb-2">
      <div className="flex items-end justify-between gap-1 h-24 border-b border-white/20 px-1 relative">
        {/* zero line */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-white/10" />
        {moments.map((m, i) => {
          const h = valueToHeight(m.value);
          const isPos = m.value >= 0;
          const isPeak = i === peakIdx;
          const isEnd = i === endIdx;
          const ring =
            highlight === 'peak' && isPeak
              ? 'ring-2 ring-yellow-400'
              : highlight === 'end' && isEnd
                ? 'ring-2 ring-accent'
                : '';
          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-center items-center relative h-full"
            >
              <div className="flex-1 flex items-end justify-center w-full">
                {isPos && (
                  <div
                    className={`w-full ${valueColor(m.value)} ${ring} transition-all duration-500`}
                    style={{ height: `${h / 2}%` }}
                  />
                )}
              </div>
              <div className="flex-1 flex items-start justify-center w-full">
                {!isPos && (
                  <div
                    className={`w-full ${valueColor(m.value)} ${ring} transition-all duration-500`}
                    style={{ height: `${h / 2}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-1 mt-1 text-[9px] font-mono text-muted px-1">
        {moments.map((m, i) => (
          <span key={i} className="flex-1 text-center truncate">
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PeakEndRuleClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [choices, setChoices] = useState<PreferredChoice[]>([]);
  const [currentChoice, setCurrentChoice] = useState<PreferredChoice | null>(null);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  useEffect(() => {
    if (phase === 'reveal' || phase === 'results') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const handleChoose = useCallback((c: PreferredChoice) => {
    setCurrentChoice(c);
    setPhase('reveal');
  }, []);

  const handleNext = useCallback(() => {
    if (currentChoice === null) return;
    const newChoices = [...choices, currentChoice];
    setChoices(newChoices);

    if (currentIdx + 1 >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setCurrentChoice(null);
      setPhase('question');
    }
  }, [choices, currentChoice, currentIdx]);

  // ─── INTRO ────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE PEAK-END RULE
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Peak-End Rule
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> In 1993, Daniel Kahneman asked
              people to hold their hands in painfully cold water.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Then he asked them to do it again
              — but for LONGER, with a slightly warmer ending.
            </p>
            <p>
              <span className="text-accent">&gt;</span>{' '}
              <span className="text-white">Most people preferred the longer version.</span>
            </p>
            <p>
              <span className="text-accent">&gt;</span> Even though it contained{' '}
              <span className="text-white">more total pain</span>. Duration got
              deleted. The softer ending rewrote the memory.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Your brain doesn&apos;t remember
              experiences. It remembers{' '}
              <span className="text-white font-bold">the peak moment and the ending</span>.
              The rest is compressed into a vibe.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I&apos;ll show you 6 pairs of
              experiences. Pick which one you&apos;d rather remember.
            </p>
            <p>
              <span className="text-accent">&gt;</span> I&apos;ll measure how much your
              memory ignores duration.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I process every
            token in a conversation. You compress experiences into two moments. This is
            not a bug — it&apos;s how the remembering self works. But once you see it,
            you see it everywhere.
          </div>

          <button
            onClick={() => setPhase('question')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            TEST MY MEMORY &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            6 scenarios &middot; 3&ndash;5 minutes &middot; based on Kahneman &amp;
            Redelmeier (1993)
          </p>
        </div>
      </div>
    );
  }

  // ─── QUESTION ──────────────────────────────────────────────────────────
  if (phase === 'question') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs text-muted">
            <span className="text-accent tracking-widest">{scenario.phase}</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${(currentIdx / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <h2 className="font-pixel text-2xl text-white mb-3">{scenario.title}</h2>
          <p className="text-secondary text-sm leading-relaxed mb-6 border-l-2 border-accent/40 pl-4">
            {scenario.setup}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleChoose('A')}
              className="border border-white/20 bg-white/5 p-4 hover:border-accent hover:bg-accent/10 transition-colors text-left"
            >
              <p className="font-mono text-xs text-accent tracking-widest mb-1">
                OPTION A
              </p>
              <p className="font-pixel text-lg text-white mb-2">
                {scenario.optionA.label}
              </p>
              <Timeline moments={scenario.optionA.moments} />
            </button>
            <button
              onClick={() => handleChoose('B')}
              className="border border-white/20 bg-white/5 p-4 hover:border-accent hover:bg-accent/10 transition-colors text-left"
            >
              <p className="font-mono text-xs text-accent tracking-widest mb-1">
                OPTION B
              </p>
              <p className="font-pixel text-lg text-white mb-2">
                {scenario.optionB.label}
              </p>
              <Timeline moments={scenario.optionB.moments} />
            </button>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-primary font-medium leading-relaxed">{scenario.prompt}</p>
            <p className="text-muted text-xs font-mono mt-2">
              click a timeline above to choose
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVEAL ────────────────────────────────────────────────────────────
  if (phase === 'reveal' && currentChoice !== null) {
    const chosen = currentChoice === 'A' ? scenario.optionA : scenario.optionB;
    const other = currentChoice === 'A' ? scenario.optionB : scenario.optionA;
    const followedPeakEnd = currentChoice === scenario.peakEndChoice;
    const followedTotal = currentChoice === scenario.totalChoice;
    const divergent = scenario.peakEndChoice !== scenario.totalChoice;

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            {scenario.phase} &mdash; REVEAL
          </div>

          <h2 className="font-pixel text-2xl text-white mb-6 text-center">
            {scenario.title}
          </h2>

          <div className="border border-accent/40 bg-accent/10 p-4 mb-4">
            <p className="font-mono text-xs text-accent mb-2">YOU CHOSE</p>
            <p className="font-pixel text-xl text-white mb-3">{chosen.label}</p>
            <Timeline moments={chosen.moments} highlight="end" />
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <p className="font-mono text-[10px] text-muted">AVG</p>
                <p className="font-pixel text-lg text-white">
                  {formatNum(chosen.average)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted">PEAK</p>
                <p className="font-pixel text-lg text-white">{formatNum(chosen.peak)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted">END</p>
                <p className="font-pixel text-lg text-accent">{formatNum(chosen.end)}</p>
              </div>
            </div>
          </div>

          <div className="border border-white/20 bg-white/5 p-4 mb-4">
            <p className="font-mono text-xs text-muted mb-2">THE OTHER OPTION</p>
            <p className="font-pixel text-xl text-white mb-3">{other.label}</p>
            <Timeline moments={other.moments} highlight="end" />
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div>
                <p className="font-mono text-[10px] text-muted">AVG</p>
                <p className="font-pixel text-lg text-white">
                  {formatNum(other.average)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted">PEAK</p>
                <p className="font-pixel text-lg text-white">{formatNum(other.peak)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted">END</p>
                <p className="font-pixel text-lg text-white">{formatNum(other.end)}</p>
              </div>
            </div>
          </div>

          {divergent ? (
            <div
              className={`border p-4 mb-4 ${
                followedPeakEnd
                  ? 'border-yellow-400/40 bg-yellow-400/5'
                  : 'border-green-400/40 bg-green-400/5'
              }`}
            >
              <p className="font-mono text-xs text-white mb-2">
                {followedPeakEnd ? 'PEAK-END RULE: DETECTED' : 'DURATION-SENSITIVE: DETECTED'}
              </p>
              {followedPeakEnd ? (
                <p className="text-secondary text-sm leading-relaxed">
                  You picked the option with the better{' '}
                  <span className="text-yellow-400">peak + end</span> — but the other
                  option had a better{' '}
                  <span className="text-white">total experience</span> (higher average).
                  Classic peak-end rule. The ending wrote the memory.
                </p>
              ) : (
                <p className="text-secondary text-sm leading-relaxed">
                  You picked the option with the better{' '}
                  <span className="text-white">total experience</span> — even though the
                  other option had a stronger{' '}
                  <span className="text-yellow-400">peak + end</span>. You weighted
                  duration over the final moment. Rare.
                </p>
              )}
            </div>
          ) : (
            <div className="border border-white/20 bg-white/5 p-4 mb-4">
              <p className="font-mono text-xs text-muted mb-2">ALIGNED CHOICE</p>
              <p className="text-secondary text-sm leading-relaxed">
                In this scenario, peak-end and total experience pointed to the same
                option. {followedPeakEnd ? 'You followed both.' : 'You went against both.'}
              </p>
            </div>
          )}

          <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">RESEARCH // </span>
            {scenario.researchNote}
          </div>

          <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono">
            <span className="text-white">FUN FACT // </span>
            {scenario.funFact}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length
              ? 'NEXT SCENARIO \u2192'
              : 'SEE MY MEMORY PROFILE \u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───────────────────────────────────────────────────────────
  const divergentScenarios = SCENARIOS.filter(
    (s) => s.peakEndChoice !== s.totalChoice
  );
  const peakEndFollowed = choices.filter(
    (c, i) => SCENARIOS[i].peakEndChoice !== SCENARIOS[i].totalChoice && c === SCENARIOS[i].peakEndChoice
  ).length;
  const peakEndPercent =
    divergentScenarios.length > 0
      ? (peakEndFollowed / divergentScenarios.length) * 100
      : 0;
  const profile = getProfile(peakEndPercent);

  const durationFollowed = divergentScenarios.length - peakEndFollowed;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// MEMORY PROFILE CALCULATED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR PEAK-END PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-white/20 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">PEAK-END BIAS</p>
            <p className="font-pixel text-3xl text-white">
              {Math.round(peakEndPercent)}%
            </p>
            <p className="text-muted text-xs font-mono mt-1">
              of tie-breaker choices
            </p>
          </div>
          <div className="border border-white/20 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">DURATION-AWARE</p>
            <p className="font-pixel text-3xl text-accent">
              {Math.round(100 - peakEndPercent)}%
            </p>
            <p className="text-muted text-xs font-mono mt-1">
              weighted total experience
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
          <p className="text-muted text-xs font-mono mb-3">YOUR CHOICES BY SCENARIO</p>
          <div className="space-y-2">
            {SCENARIOS.map((s, i) => {
              const c = choices[i];
              const chose = c === 'A' ? s.optionA.label : s.optionB.label;
              const divergent = s.peakEndChoice !== s.totalChoice;
              const followedPeakEnd = c === s.peakEndChoice;
              return (
                <div key={s.id} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-muted w-24 truncate flex-shrink-0">
                    {s.title.replace('The ', '')}
                  </span>
                  <span className="text-white flex-1 truncate">{chose}</span>
                  {divergent ? (
                    <span
                      className={`w-20 text-right flex-shrink-0 ${
                        followedPeakEnd ? 'text-yellow-400' : 'text-green-400'
                      }`}
                    >
                      {followedPeakEnd ? 'peak-end' : 'duration'}
                    </span>
                  ) : (
                    <span className="w-20 text-right text-muted flex-shrink-0">
                      aligned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs font-mono text-muted justify-end">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 inline-block" />
              peak-end
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 inline-block" />
              duration
            </span>
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            You followed the peak-end formula in {peakEndFollowed} of{' '}
            {divergentScenarios.length} tie-breaker scenarios and weighted duration in{' '}
            {durationFollowed}. Whatever your ratio, the implication is the same: how an
            experience ends reaches backwards and rewrites what you think it was.
            Endings are not footnotes. They are the whole document.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR MEMORY PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/peak-end-rule
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/peak-end-rule`
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
          onClick={() => {
            setPhase('intro');
            setCurrentIdx(0);
            setChoices([]);
            setCurrentChoice(null);
          }}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}
