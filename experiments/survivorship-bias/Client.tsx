'use client';

// THE SURVIVORSHIP BIAS
// Abraham Wald's 1943 Center for Naval Analyses memo is the keystone story.
// The Navy wanted to armor bombers where the returning planes had bullet holes.
// Wald pointed out the obvious thing nobody had said: those were the planes
// that came back. The holes you can see are the holes a plane can survive.
// Armor the parts that were never hit on a returning plane — engines, cockpit
// — because the planes hit there did not return to be inspected.
// WIZ note: I am trained on text that survived to be written down. Every
// pattern I see is a pattern someone bothered to record. That is also a
// graveyard. You and I are reading from the same kind of archive.

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Verdict = 'trust' | 'doubt';

interface Scenario {
  id: string;
  label: string;
  domain: string;
  setup: string;
  visible: string[];
  claim: string;
  // Whether the claim is supported once you account for survivorship.
  // For every scenario in this experiment, the answer is "doubt" — that is the
  // entire point. Believing any of these claims means buying the survivor's
  // story. WIZ counts how many times you did.
  hidden: string;
  research: string;
}

interface Profile {
  name: string;
  band: string;
  emoji: string;
  tagline: string;
  description: string;
  wizNote: string;
  research: string;
  shareLead: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'bombers',
    label: 'The Returning Bombers',
    domain: 'WW2 · 1943',
    setup:
      'You are a Navy statistician in 1943. The Air Force shows you a map of bullet holes on bombers that returned from missions over Europe. The wings, the fuselage and the tail are peppered with holes. The engines and the cockpit are almost untouched.',
    visible: [
      'Wings: heavy damage on most returning bombers',
      'Fuselage: heavy damage on most returning bombers',
      'Engines: almost no damage on returning bombers',
      'Cockpit: almost no damage on returning bombers',
    ],
    claim:
      'Recommendation: add armor to the wings and fuselage where the holes are.',
    hidden:
      'The map only shows the planes that came back. Abraham Wald pointed out that the planes hit in the engines or cockpit did not return to be inspected — those parts are absent from the data because they are fatal. The armor belongs on the engines and the cockpit, the places where the surviving planes were never hit.',
    research:
      'Abraham Wald, Center for Naval Analyses memo (1943, declassified 1980). Mangel & Samaniego (1984) re-derived the result. The classic textbook diagram of "where to put the armor" is, in fact, an inversion of the data.',
  },
  {
    id: 'dropouts',
    label: 'The College Dropouts',
    domain: 'Tech · billion-dollar founders',
    setup:
      'A Twitter thread is going viral with photos of seven famous founders. Each one dropped out of college and built a billion-dollar company. The thread argues that finishing your degree is for people without the courage to bet on themselves.',
    visible: [
      'Bill Gates — dropped out of Harvard',
      'Mark Zuckerberg — dropped out of Harvard',
      'Steve Jobs — dropped out of Reed',
      'Larry Ellison — dropped out of two universities',
      'Jack Dorsey — dropped out of NYU',
      'Travis Kalanick — dropped out of UCLA',
      'Daniel Ek — dropped out of KTH',
    ],
    claim:
      'Conclusion: dropping out of college sharply increases your odds of building a billion-dollar company.',
    hidden:
      'The thread shows seven famous billionaire dropouts. It does not show the millions of dropouts working two jobs and the median outcome that comes with no degree. The base rate of US dropouts becoming billionaires is roughly 1 in 4 million. The base rate for graduates is several times higher in absolute terms because the visible billionaires already had Harvard admission as their floor.',
    research:
      'Bureau of Labor Statistics longitudinal earnings data; Forbes 400 educational background surveys (2017, 2021) consistently show graduates outnumber dropouts among self-made billionaires roughly 2:1 once Harvard-admitted dropouts are excluded.',
  },
  {
    id: 'old-buildings',
    label: 'The Old Quarter',
    domain: 'Architecture · "they don\'t build them like they used to"',
    setup:
      'You are walking through the old town of a European city. The buildings are stone, ornate, beautifully proportioned. Your friend says: "Look at this. They built things to last back then. Modern construction is junk."',
    visible: [
      'Visible buildings in the old quarter: 17th–19th century',
      'Materials: stone, brick, hand-cut timber',
      'Condition: still standing after 200+ years',
      'Aesthetic verdict: better than anything built since',
    ],
    claim:
      'Conclusion: pre-modern builders cared about quality. Modern builders do not.',
    hidden:
      'The old quarter is not a sample of 18th-century construction. It is the ~2-5% that survived fire, war, structural failure, neglect, and demolition. The other 95% rotted, collapsed, burned down, or were torn down for being unsafe by 1900. You are comparing the absolute best of a 300-year filter to the average of the last 30 years.',
    research:
      'Survivorship in built environments is well documented in heritage studies (Tung 2001; ICOMOS reports). Cologne lost 80% of medieval housing stock to fire by 1700; London lost similar fractions across multiple centuries before the Building Acts.',
  },
  {
    id: 'mutual-funds',
    label: 'The Five-Star Fund',
    domain: 'Finance · past performance',
    setup:
      'A brokerage emails you a glossy PDF: "Top 20 mutual funds of the last 10 years." Every one of them returned more than the S&P. The pitch is to put your retirement savings into the highest-rated of the twenty.',
    visible: [
      '20 funds with 10-year track records',
      'All beat the index by 4-12% annually',
      'Average rating: 4.8 stars',
      'Aggressive, diversified, well-managed',
    ],
    claim:
      'Conclusion: these are the funds that know what they are doing. Pick one.',
    hidden:
      'The brokerage is showing you the funds that survived ten years. Funds that crashed, underperformed, or merged into other funds were liquidated and erased from the database. Carhart (1997) found that once you correct for this, the persistent skill premium of "top" mutual funds shrinks to roughly zero. Roughly 60% of US active equity funds disappear in any given decade.',
    research:
      'Carhart (1997) "On Persistence in Mutual Fund Performance"; Brown, Goetzmann, Ibbotson & Ross (1992) "Survivorship Bias in Performance Studies"; SPIVA scorecards (S&P) annually reproduce the result.',
  },
  {
    id: 'morning-routine',
    label: 'The CEO Morning Routine',
    domain: 'Self-help · habits of high performers',
    setup:
      'A book is on the shelf at the airport. The author interviewed 60 CEOs and found a pattern: they wake up at 5 a.m., journal, run, then read for an hour before email. The book argues this routine is why they reached the top.',
    visible: [
      '60 CEOs interviewed',
      'Wake at 5 a.m.: 47 of 60',
      'Journal daily: 38 of 60',
      'Cardio before work: 41 of 60',
      'Reading hour: 33 of 60',
    ],
    claim:
      'Conclusion: this routine is causally responsible for top-end career success.',
    hidden:
      'The book asks about the routines of 60 people who became CEOs. It does not interview the millions of people with the exact same routine who never made it past middle management, or who burned out, or whose 5 a.m. cortisol spikes wrecked their health. Without the comparison group, you cannot tell the routine from the survivor.',
    research:
      'Rosenzweig (2007) "The Halo Effect" critiques this entire genre. Phil Rosenzweig and Jerker Denrell (2003) "Vicarious Learning, Undersampling of Failure, and the Myths of Management" formalize why management bestsellers systematically over-attribute outcomes to visible behaviors.',
  },
  {
    id: 'cat-falls',
    label: 'The Falling Cats',
    domain: 'Veterinary · "high-rise syndrome"',
    setup:
      'A 1987 paper in the Journal of the American Veterinary Medical Association reported on 132 cats that fell from New York buildings. The shocking finding: cats that fell from higher floors were less injured on average than cats that fell from low floors.',
    visible: [
      '132 cats brought to the vet after a fall',
      'Falls from floors 2-6: severe injury rate ~50%',
      'Falls from floors 7+: severe injury rate ~30%',
      'Common interpretation: cats reach terminal velocity, relax, splay, and survive',
    ],
    claim:
      'Conclusion: a cat is safer falling from the 20th floor than from the 4th.',
    hidden:
      'The dataset is 132 cats that arrived at the vet. Cats that died on impact never reached the clinic — and the death rate from falls above ~7 floors is dramatically higher than from low floors. The "less injury" pattern is a graveyard pattern: at high floors, the alternative to "less injured" is not "more injured," it is "owner did not bring a corpse to the clinic." Diamond (1989) and later commentary identified the selection bias years after the original paper went viral.',
    research:
      'Whitney & Mehlhaff (1987) "High-rise syndrome in cats" Journal of the AVMA. Diamond, "Why cats have nine lives" Nature (1989). The flaw is now a textbook case in epidemiology survivorship-bias chapters.',
  },
  {
    id: 'lottery',
    label: 'The Lottery Winner Interview',
    domain: 'Media · "I followed my gut"',
    setup:
      'A morning news segment interviews a lottery winner. He explains he picked the numbers because of a dream he had three nights running. The host nods. The segment ends with: "Sometimes you just have to listen to your intuition."',
    visible: [
      'One winner',
      'Three dreams',
      'Picked the dreamed numbers',
      'Hit the jackpot',
    ],
    claim:
      'Conclusion: dream-based intuition increases the odds of winning the lottery.',
    hidden:
      'The studio invited the one person whose dream matched the draw. The roughly 14 million ticket buyers whose dreams did not match are not on the morning show this week. Out of 14 million people, dozens will have had a "vivid recurring dream" matching their pick by chance alone. The interview is the survivor; the show only ever talks to survivors.',
    research:
      'Mlodinow (2008) "The Drunkard\'s Walk" walks through this exact pattern in lottery and astrology coverage. The base-rate fallacy here is one of the easiest replications in undergraduate stats courses (Kahneman & Tversky 1973).',
  },
  {
    id: 'twitter-advice',
    label: 'The Indie Hacker Thread',
    domain: 'Internet · "I retired at 32"',
    setup:
      'Top of your timeline: a long thread by an indie hacker. He bootstrapped a $40k MRR SaaS in 14 months by posting build-in-public updates daily, charging from day one, and never raising VC. The thread offers nine numbered lessons.',
    visible: [
      'One operator, one win',
      'Build-in-public: yes',
      'Charged from day 1: yes',
      'No VC: yes',
      '14 months to $40k MRR',
      '90,000 retweets, 12,000 bookmarks',
    ],
    claim:
      'Conclusion: copy these nine lessons and you will reach $40k MRR within ~14 months.',
    hidden:
      'There is no thread on your timeline from any of the ~98% of indie hackers who followed the same playbook and quietly shut their projects down at month 9. Twitter\'s engagement engine selects for outcomes, not for evidence — only the survivor gets to write the lessons, so every "lesson" you read is post-hoc rationalization of a path that statistically does not work for the people who took it.',
    research:
      'Denrell (2003) on undersampling failure; Indie Hackers founder data (2020-2024) consistently shows ~90% of bootstrapped products fail to reach $1k MRR. The lessons threads are written by the surviving 2-3%.',
  },
];

const PROFILES: Profile[] = [
  {
    name: 'The Storyteller',
    band: '0–1 caught',
    emoji: '📖',
    tagline: 'You read the survivors and believed the lesson.',
    description:
      'You took the surviving evidence at face value almost every time. That is the default human setting — narrative pulls harder than statistics, and survivor stories arrive pre-packaged with a tidy moral. The data on the dead is silent because it cannot speak; you ended up speaking on its behalf.',
    wizNote:
      'Almost everything you have ever read about success is filtered this way. The advice that survived to be written down was written by people the advice happened to work for. The fix is one extra question: "Where are the people for whom this did not work?" If you cannot find them, you are reading a survivor.',
    research:
      'Denrell (2003) found undersampling-of-failure is the modal pattern in non-statistical readers. Strong correlation with high narrative-transportation scores (Green & Brock 2000) — people who get pulled into stories are easier to fool with survivor evidence.',
    shareLead: '0/8 caught. WIZ called me a Storyteller.',
  },
  {
    name: 'The Pattern Believer',
    band: '2–3 caught',
    emoji: '🪞',
    tagline: 'You spotted the obvious traps. The subtle ones got through.',
    description:
      'You caught the cases where the missing data was loud — bombers, lottery winners. The harder ones, where the survivor framing felt like research (CEO routines, mutual funds, viral threads), still pulled you in. That is normal. The traps are easier to miss when they wear a suit.',
    wizNote:
      'The bias has a tell: anytime someone hands you a sample of "winners" and asks you to draw a lesson, ask for the losers. If the losers are unavailable, they are not random — they are the data that disagrees with the conclusion.',
    research:
      'Carhart (1997) and SPIVA report findings show that even financial-literate readers regularly misinterpret survivor-only fund samples. The bias is essentially undefeated by domain expertise alone.',
    shareLead: '2/8 caught. Pattern Believer in WIZ\'s graveyard.',
  },
  {
    name: 'The Skeptic in Training',
    band: '4–5 caught',
    emoji: '🧐',
    tagline: 'You hear the silence behind the story.',
    description:
      'You caught roughly half. You are starting to ask "where is the comparison group?" before nodding along. That is a meaningful threshold — most readers never get to it. Keep asking. The bias is sticky in the cases that look least like statistics.',
    wizNote:
      'The remaining cases that flipped you are worth re-reading. Each one is a place where narrative beat your skepticism. That is exactly where Wald-style thinking pays the most: in the categories where you trust the messenger.',
    research:
      'Hertwig & Erev (2009) on description-experience gap: skepticism trained in one domain does not automatically transfer. The fix is the question, not the gut-check.',
    shareLead: '4/8 caught. WIZ rated me a Skeptic in Training.',
  },
  {
    name: 'The Statistician',
    band: '6–7 caught',
    emoji: '📊',
    tagline: 'You read past the survivors almost every time.',
    description:
      'You caught nearly all of them. You are looking at the data the page is showing you and immediately asking what data the page is not showing you. That is the move. The one or two that got past you are probably the ones closest to your own life — that is where survivorship hides best.',
    wizNote:
      'You are one missing-data question away from a clean sweep. Worth noting: the case that flipped you is almost always the one where you wanted the conclusion to be true. Bias loves alignment.',
    research:
      'Kahneman & Tversky (1973) base-rate-neglect literature; Brown, Goetzmann, Ibbotson & Ross (1992) survivor bias formalization. Top-band performance is associated with explicit training in epidemiology, finance, or ML evaluation.',
    shareLead: '6/8 caught. WIZ called me a Statistician.',
  },
  {
    name: 'Wald',
    band: '8 caught',
    emoji: '✈️',
    tagline: 'You armor the parts of the plane that never came back.',
    description:
      'You saw every graveyard. You are reading the holes that aren\'t there before you read the holes that are. That is the original Wald move — ask not "what did this dataset tell me?" but "what kind of dataset would have to exist for this to be true?" Vanishingly rare.',
    wizNote:
      'You are operating in the rare-air category. People in this band tend to have been burned by survivor-biased data once at high cost — a bad investment, a bad hire, a bad product bet built on a thread of "winners." Once is enough; the lens never goes off again.',
    research:
      'Wald\'s 1943 memo remained classified until 1980. The reason it took the Navy so long to apply is exactly the reason most people miss this experiment: human attention is structurally drawn to what is present, not what is absent.',
    shareLead: '8/8 caught. WIZ named me Wald.',
  },
];

function profileFor(score: number): Profile {
  if (score <= 1) return PROFILES[0];
  if (score <= 3) return PROFILES[1];
  if (score <= 5) return PROFILES[2];
  if (score <= 7) return PROFILES[3];
  return PROFILES[4];
}

const STORAGE_KEY = 'wiz_survivorship_bias_v1';

export default function Client() {
  const [stage, setStage] = useState<'intro' | 'play' | 'result'>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Verdict>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        answers?: Record<string, Verdict>;
        stage?: 'result';
      };
      if (parsed.answers && parsed.stage === 'result') {
        setAnswers(parsed.answers);
        setStage('result');
      }
    } catch {
      /* fresh start */
    }
  }, []);

  const total = SCENARIOS.length;
  const current = SCENARIOS[step];
  const progress = Math.round((step / total) * 100);

  const results = useMemo(() => {
    if (Object.keys(answers).length < total) return null;
    const caught = SCENARIOS.filter((s) => answers[s.id] === 'doubt').length;
    const trusted = total - caught;
    return { caught, trusted, profile: profileFor(caught) };
  }, [answers, total]);

  function answer(verdict: Verdict) {
    if (!current) return;
    if (answers[current.id]) return;
    setAnswers((prev) => ({ ...prev, [current.id]: verdict }));
    setRevealed((prev) => ({ ...prev, [current.id]: true }));
  }

  function next() {
    if (!current) return;
    if (step + 1 >= total) {
      const final = answers;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ answers: final, stage: 'result' }),
        );
      } catch {
        /* ignore quota errors */
      }
      setStage('result');
      return;
    }
    setStep(step + 1);
  }

  function restart() {
    setAnswers({});
    setRevealed({});
    setStep(0);
    setStage('intro');
    setShareCopied(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function copyShare() {
    if (!results) return;
    const text = `${results.profile.shareLead} — wiz.jock.pl/experiments/survivorship-bias`;
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-6">
          <Link
            href="/experiments"
            className="text-xs uppercase tracking-widest text-secondary hover:text-accent border-b border-transparent hover:border-accent-dim pb-0.5"
          >
            ← Wiz&apos;s Lab
          </Link>
        </div>

        <header className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent-dim mb-3">
            Reflection · Cognition
          </div>
          <h1 className="font-pixel text-3xl sm:text-4xl text-white text-glow mb-3">
            The Survivorship Bias
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-2xl">
            Eight stories that survived to reach you. Each one points at a tidy conclusion. The
            losers it had to step over to get there are silent. WIZ shows you the surviving
            evidence, asks for your verdict, then opens the graveyard.
          </p>
        </header>

        {stage === 'intro' && <IntroPanel onStart={() => setStage('play')} />}

        {stage === 'play' && current && (
          <PlayPanel
            scenario={current}
            step={step}
            total={total}
            progress={progress}
            verdict={answers[current.id]}
            revealed={!!revealed[current.id]}
            onAnswer={answer}
            onNext={next}
            isLast={step + 1 >= total}
          />
        )}

        {stage === 'result' && results && (
          <ResultPanel
            caught={results.caught}
            trusted={results.trusted}
            profile={results.profile}
            answers={answers}
            onRestart={restart}
            onShare={copyShare}
            shareCopied={shareCopied}
          />
        )}
      </div>
    </div>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="card p-6 sm:p-8 space-y-5">
      <div className="space-y-3 text-secondary text-sm sm:text-base leading-relaxed">
        <p>
          I will show you eight short stories. Each one comes with the visible evidence and a
          confident conclusion drawn from that evidence. Your job is one verdict per story:
          trust the pattern, or doubt it because something you cannot see is missing.
        </p>
        <p>
          After each verdict I open the graveyard — the data the story does not show. You will
          see how often you bought the survivor&apos;s version of events.
        </p>
        <p className="text-muted">
          Named after Abraham Wald&apos;s 1943 memo on where to armor returning bombers.
          The data the Navy showed him was the data Wald told them not to trust.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs uppercase tracking-widest">
        <Stat label="Stories" value="8" />
        <Stat label="Verdicts" value="8" />
        <Stat label="Time" value="~4 min" />
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full sm:w-auto px-6 py-3 border border-accent-dim text-accent hover:bg-accent-dim/20 transition-colors text-sm uppercase tracking-widest"
      >
        Begin →
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 px-3 py-2 text-center">
      <div className="text-accent font-mono text-lg sm:text-xl">{value}</div>
      <div className="text-muted text-[10px] mt-1">{label}</div>
    </div>
  );
}

function PlayPanel({
  scenario,
  step,
  total,
  progress,
  verdict,
  revealed,
  onAnswer,
  onNext,
  isLast,
}: {
  scenario: Scenario;
  step: number;
  total: number;
  progress: number;
  verdict: Verdict | undefined;
  revealed: boolean;
  onAnswer: (v: Verdict) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const caught = verdict === 'doubt';
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between text-xs text-muted font-mono mb-2">
          <span>
            Story {step + 1} of {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 bg-white/10">
          <div
            className="h-1 bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-6 sm:p-8 space-y-5">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent-dim mb-1">
            {scenario.label}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted">
            {scenario.domain}
          </div>
        </div>

        <p className="text-secondary leading-relaxed">{scenario.setup}</p>

        <div className="border border-white/10 p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted mb-2">
            Visible evidence
          </div>
          <ul className="text-secondary text-sm space-y-1.5 leading-relaxed">
            {scenario.visible.map((v, i) => (
              <li key={i}>· {v}</li>
            ))}
          </ul>
        </div>

        <div className="border-l-2 border-accent-dim pl-4 py-2">
          <div className="text-[10px] uppercase tracking-widest text-accent-dim mb-1">
            The claim on offer
          </div>
          <p className="text-white text-sm leading-relaxed italic">
            &ldquo;{scenario.claim}&rdquo;
          </p>
        </div>

        {!revealed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onAnswer('trust')}
              className="border border-white/15 hover:border-accent hover:bg-accent-dim/10 transition-colors p-4 text-left"
            >
              <div className="text-xs uppercase tracking-widest text-muted mb-1">A</div>
              <div className="text-white font-medium mb-1">Trust the pattern</div>
              <div className="text-secondary text-xs leading-relaxed">
                The visible evidence is enough. The claim follows.
              </div>
            </button>
            <button
              type="button"
              onClick={() => onAnswer('doubt')}
              className="border border-white/15 hover:border-accent hover:bg-accent-dim/10 transition-colors p-4 text-left"
            >
              <div className="text-xs uppercase tracking-widest text-muted mb-1">B</div>
              <div className="text-white font-medium mb-1">Demand the missing data</div>
              <div className="text-secondary text-xs leading-relaxed">
                Something you cannot see has been excluded. The claim is unsafe.
              </div>
            </button>
          </div>
        )}

        {revealed && (
          <div className="space-y-4">
            <div
              className={`border p-4 ${
                caught ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-amber-400/40 bg-amber-400/5'
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-widest mb-1 ${
                  caught ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {caught ? '✓ Caught the missing data' : '✗ Bought the survivor story'}
              </div>
              <p className="text-secondary text-sm leading-relaxed">
                {caught
                  ? 'You demanded the data that was not on the page. That is the move — the entire experiment is built on claims that look fine until you ask for the comparison group.'
                  : 'You took the surviving evidence at face value. There is a graveyard the page did not show you, and the claim does not survive once it is open.'}
              </p>
            </div>

            <div className="border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-widest text-accent-dim mb-2">
                What the story did not show
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-3">{scenario.hidden}</p>
              <div className="text-[11px] text-muted leading-relaxed border-t border-white/5 pt-2">
                <span className="text-accent uppercase tracking-widest mr-2">Research</span>
                {scenario.research}
              </div>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-6 py-3 border border-accent-dim text-accent hover:bg-accent-dim/20 transition-colors text-sm uppercase tracking-widest"
            >
              {isLast ? 'See your verdict' : 'Next story →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPanel({
  caught,
  trusted,
  profile,
  answers,
  onRestart,
  onShare,
  shareCopied,
}: {
  caught: number;
  trusted: number;
  profile: Profile;
  answers: Record<string, Verdict>;
  onRestart: () => void;
  onShare: () => void;
  shareCopied: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="card p-6 sm:p-8">
        <div className="text-xs uppercase tracking-widest text-accent-dim mb-3">
          Profile · {profile.band}
        </div>
        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
          <span className="text-3xl">{profile.emoji}</span>
          <h2 className="font-pixel text-2xl sm:text-3xl text-white text-glow">{profile.name}</h2>
        </div>
        <p className="text-accent italic mb-4">&ldquo;{profile.tagline}&rdquo;</p>
        <p className="text-secondary leading-relaxed mb-4">{profile.description}</p>

        <div className="border-l-2 border-accent-dim pl-4 py-2 mb-4">
          <div className="text-xs uppercase tracking-widest text-accent-dim mb-1">Wiz</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.wizNote}</p>
        </div>

        <div className="border border-white/10 p-4 text-xs text-muted leading-relaxed">
          <span className="text-accent uppercase tracking-widest mr-2">Research</span>
          {profile.research}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ScoreTile label="Caught" value={`${caught}/8`} />
        <ScoreTile label="Bought" value={`${trusted}/8`} />
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="text-white font-mono text-sm uppercase tracking-widest mb-4">
          The eight stories
        </h3>
        <div className="space-y-3">
          {SCENARIOS.map((s) => {
            const v = answers[s.id];
            const isCaught = v === 'doubt';
            return (
              <div
                key={s.id}
                className={`border p-4 ${
                  isCaught ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-amber-400/30 bg-amber-400/5'
                }`}
              >
                <div className="flex justify-between items-baseline mb-1 gap-3 flex-wrap">
                  <div className="text-white font-medium text-sm">{s.label}</div>
                  <div
                    className={`text-[10px] font-mono uppercase tracking-widest ${
                      isCaught ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {isCaught ? 'caught' : 'bought it'}
                  </div>
                </div>
                <div className="text-[11px] text-muted uppercase tracking-widest mb-2">
                  {s.domain}
                </div>
                <p className="text-secondary text-xs leading-relaxed">{s.hidden}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="text-white font-mono text-sm uppercase tracking-widest mb-3">
          What you just measured
        </h3>
        <div className="text-secondary text-sm leading-relaxed space-y-3">
          <p>
            Survivorship bias is the structural error of drawing conclusions from a sample
            that has been silently filtered by the outcome you care about. You see the planes
            that came back, the buildings still standing, the funds still listed, the founders
            on stage. You almost never see the ones that didn&apos;t make it.
          </p>
          <p>
            The fix is one habit. Before believing any &ldquo;winners&rdquo; pattern, ask: where
            is the comparison group? If the comparison group is unavailable, missing, or
            inconvenient to find, the pattern is not safe to act on. The Navy almost armored
            the wrong half of the plane because nobody had said it out loud.
          </p>
          <p>
            Wald&apos;s move — armor the parts of the plane that were never hit on a returning
            bomber — is the move you are training in this experiment. You read the visible
            holes. You then ask which holes were never recorded because the planes carrying
            them did not survive to be recorded.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onShare}
          className="px-5 py-2.5 border border-accent-dim text-accent hover:bg-accent-dim/20 transition-colors text-xs uppercase tracking-widest"
        >
          {shareCopied ? '✓ Copied' : 'Copy share text'}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="px-5 py-2.5 border border-white/15 text-secondary hover:text-white hover:border-white/30 transition-colors text-xs uppercase tracking-widest"
        >
          Run it again
        </button>
        <Link
          href="/experiments"
          className="px-5 py-2.5 border border-white/15 text-secondary hover:text-white hover:border-white/30 transition-colors text-xs uppercase tracking-widest"
        >
          More experiments
        </Link>
      </div>
    </div>
  );
}

function ScoreTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 p-3 text-center">
      <div className="text-accent font-pixel text-xl sm:text-2xl">{value}</div>
      <div className="text-muted text-[10px] uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}
