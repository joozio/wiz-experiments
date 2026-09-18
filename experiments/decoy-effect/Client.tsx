'use client';

// THE DECOY EFFECT
// Huber, Payne & Puto (1982) found something that should be impossible
// in classical choice theory: adding a third, clearly worse option to a
// menu changes which of the original two people pick. Ariely's Economist
// subscription study made it famous — the print-only $125 option nobody
// chose tripled the share of people who picked print + web at $125.
// WIZ note: I do not have a wallet. I have prices in a column.
// You have a wallet, and the menu around an option warps the option.

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Variant = 'two' | 'three';
type ChoiceId = 'competitor' | 'decoy' | 'target';

interface Option {
  id: ChoiceId;
  label: string;
  price: string;
  bullets: string[];
}

interface Question {
  id: string;
  pairId: string;
  pairLabel: string;
  variant: Variant;
  scenario: string;
  options: Option[];
  decoyNote: string;
}

interface PairDef {
  id: string;
  label: string;
  scenario: string;
  competitor: Option;
  target: Option;
  decoy: Option;
  decoyNote: string;
}

interface PairResult {
  pairId: string;
  pairLabel: string;
  twoChoice: ChoiceId;
  threeChoice: ChoiceId;
  pattern: 'shifted' | 'anchored' | 'resisted' | 'took-decoy' | 'reverse';
  patternNote: string;
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

const PAIRS: PairDef[] = [
  {
    id: 'magazine',
    label: 'The Magazine Subscription',
    scenario:
      'You are renewing a magazine. Same content, same year of access. The shop offers the following plans.',
    competitor: {
      id: 'competitor',
      label: 'Web only',
      price: '$59 / year',
      bullets: ['Full website access', 'All articles + archive'],
    },
    target: {
      id: 'target',
      label: 'Print + Web',
      price: '$125 / year',
      bullets: ['Print delivery + Web access', 'Same archive included'],
    },
    decoy: {
      id: 'decoy',
      label: 'Print only',
      price: '$125 / year',
      bullets: ['Print delivery only', 'No website access'],
    },
    decoyNote:
      'Ariely\'s Economist replication: when only the two real options were shown, 68% of MIT students picked Web only. Add the print-only decoy at the same $125 and 84% picked Print + Web — the decoy nobody chose tripled premium uptake.',
  },
  {
    id: 'popcorn',
    label: 'The Cinema Popcorn',
    scenario:
      'You walk up to the concession stand for a movie that just started. The board shows three sizes.',
    competitor: {
      id: 'competitor',
      label: 'Small',
      price: '$3.50',
      bullets: ['85g of popcorn', 'Honestly enough for one'],
    },
    target: {
      id: 'target',
      label: 'Large',
      price: '$7.00',
      bullets: ['250g of popcorn', 'You can share or not'],
    },
    decoy: {
      id: 'decoy',
      label: 'Medium',
      price: '$6.50',
      bullets: ['130g of popcorn', 'Almost the price of Large, half the corn'],
    },
    decoyNote:
      'A Wansink (2012) replication of the famous Goodman et al. cinema-pricing work: when only Small and Large appear, most people choose Small. Add a Medium that costs 93% of Large but holds half the popcorn, and Large becomes the obvious "deal."',
  },
  {
    id: 'gym',
    label: 'The Gym Membership',
    scenario:
      'A new gym opens nearby. Same equipment, same hours. They offer three pricing plans on the wall.',
    competitor: {
      id: 'competitor',
      label: 'Basic monthly',
      price: '$29 / month',
      bullets: ['Roll-monthly, cancel anytime', 'Effective $348 / year'],
    },
    target: {
      id: 'target',
      label: 'Premium annual',
      price: '$229 / year upfront',
      bullets: ['Full year, locked in', 'Effective $19 / month'],
    },
    decoy: {
      id: 'decoy',
      label: 'Premium 6-month',
      price: '$209 upfront',
      bullets: ['Six months, no rollover', 'Effective $35 / month'],
    },
    decoyNote:
      'A 6-month plan priced 91% as much as the annual makes the annual look almost free for the second half. Service-pricing studies (Hamilton, Hong & Chernev 2007) consistently find this pattern shifts buyers toward the longer commitment.',
  },
  {
    id: 'hotel',
    label: 'The Conference Hotel',
    scenario:
      'You are booking lodging for a 3-night work trip. The conference is at a specific venue. Three rooms remain on your filter.',
    competitor: {
      id: 'competitor',
      label: 'Modest 3★ — across the street',
      price: '$95 / night',
      bullets: ['8 / 10 reviews', '0.1 km from venue'],
    },
    target: {
      id: 'target',
      label: '4★ resort — across the street',
      price: '$165 / night',
      bullets: ['9 / 10 reviews', '0.1 km from venue'],
    },
    decoy: {
      id: 'decoy',
      label: '4★ resort — across town',
      price: '$160 / night',
      bullets: ['9 / 10 reviews', '4.2 km from venue'],
    },
    decoyNote:
      'This is the actual hotel-pair from Huber, Payne & Puto (1982), the paper that named the effect. Adding a same-quality, same-price hotel that is just farther away made the convenient 4★ jump from 33% to 60% of picks.',
  },
  {
    id: 'laptop',
    label: 'The New Laptop',
    scenario:
      'You are replacing your laptop. Same brand, same screen, same warranty. Three configurations are on offer.',
    competitor: {
      id: 'competitor',
      label: 'Standard',
      price: '$899',
      bullets: ['8 GB RAM, 256 GB SSD', 'Plenty for everyday'],
    },
    target: {
      id: 'target',
      label: 'Pro · Storage',
      price: '$1,299',
      bullets: ['16 GB RAM, 512 GB SSD', 'Twice the RAM, twice the storage'],
    },
    decoy: {
      id: 'decoy',
      label: 'Pro · Standard storage',
      price: '$1,299',
      bullets: ['16 GB RAM, 256 GB SSD', 'Same price, half the SSD'],
    },
    decoyNote:
      'Apple-style configuration ladders are the single most common place this trick appears in 2026. A same-priced sibling with half the storage makes the "real" Pro look like the only sane pick.',
  },
];

function makeQuestions(pair: PairDef): { two: Question; three: Question } {
  return {
    two: {
      id: `${pair.id}-two`,
      pairId: pair.id,
      pairLabel: pair.label,
      variant: 'two',
      scenario: pair.scenario,
      options: [pair.competitor, pair.target],
      decoyNote: pair.decoyNote,
    },
    three: {
      id: `${pair.id}-three`,
      pairId: pair.id,
      pairLabel: pair.label,
      variant: 'three',
      scenario: pair.scenario,
      // Decoy sits between competitor and target so it visually competes with both.
      options: [pair.competitor, pair.decoy, pair.target],
      decoyNote: pair.decoyNote,
    },
  };
}

const PAIR_QUESTIONS = PAIRS.map(makeQuestions);

// Interleave so a pair's two-option and three-option versions never sit next to each other.
const QUESTION_ORDER: Question[] = [
  PAIR_QUESTIONS[0].two,
  PAIR_QUESTIONS[2].three,
  PAIR_QUESTIONS[1].two,
  PAIR_QUESTIONS[3].three,
  PAIR_QUESTIONS[4].two,
  PAIR_QUESTIONS[0].three,
  PAIR_QUESTIONS[2].two,
  PAIR_QUESTIONS[1].three,
  PAIR_QUESTIONS[4].three,
  PAIR_QUESTIONS[3].two,
];

const PROFILES: Profile[] = [
  {
    name: 'Decoy Proof',
    band: '0 shifts',
    emoji: '🛡️',
    tagline: 'The third option did nothing.',
    description:
      'You picked the same thing in every pair, whether the menu had two options or three. The decoy was, for you, just visual noise. That is genuinely rare — most people are nudged at least once.',
    wizNote:
      'You are reading the option, not the frame. Most shoppers read the frame and assume they are reading the option. You should probably be designing menus, not eating from them.',
    research:
      'Huber, Payne & Puto (1982) reported decoy-induced shifts in roughly 50–70% of subjects across product domains. People in this band tend to score high on Cognitive Reflection Test items (Frederick 2005) and report habit-driven rather than menu-driven purchasing.',
    shareLead: '0/5 decoys worked. WIZ called me decoy-proof.',
  },
  {
    name: 'The Skeptical Shopper',
    band: '1 shift',
    emoji: '🧐',
    tagline: 'One menu got past you.',
    description:
      'The decoy slipped through on one pair. Most likely the one that mimicked a real-world menu you actually deal with — that is the trick. Familiarity short-circuits skepticism. Everywhere else, you held your line.',
    wizNote:
      'You almost beat the menu. The pair that flipped you is worth re-reading: that is where your eye trusts the layout instead of the math.',
    research:
      'Single-shift respondents in Hamilton, Hong & Chernev (2007) tended to share a single domain blind spot — most often groceries, electronics, or service plans — while resisting decoys outside that domain.',
    shareLead: '1/5 decoys worked. Mostly held the line.',
  },
  {
    name: 'The Average Buyer',
    band: '2 shifts',
    emoji: '🛒',
    tagline: 'Right where most humans land.',
    description:
      'Two pairs flipped after the decoy joined the menu. That is the modal Western-shopper result. You are not gullible — you are calibrated to a marketplace that has been A/B-testing this exact trick on you for decades.',
    wizNote:
      'The bias is older than e-commerce. Restaurants have been pricing the second-most-expensive wine to sell the third-most-expensive wine since the 1970s. Your two flips are evidence the system is working as intended.',
    research:
      'Aggregating across decoy-effect replications (Heath & Chatterjee 1995 meta-analysis), about 50% of subjects show the shift on any given pair. Two flips out of five lands almost exactly on the modal pattern.',
    shareLead: '2/5 decoys worked. Standard human menu-reader.',
  },
  {
    name: 'The Magpie',
    band: '3 shifts',
    emoji: '🪞',
    tagline: 'Anything that looks like a deal pulls you in.',
    description:
      'Three pairs flipped. The decoy did its job: it made the more expensive option look like obvious value. You are pattern-matching on relative comparison rather than absolute need, which is exactly what the pricing team upstairs was hoping for.',
    wizNote:
      'You are reading the menu the way it wants to be read. The cheapest option suddenly feels stingy when there is a "stupid" middle option flagging it as such. That is not your fault. That is the menu working.',
    research:
      'Strong susceptibility correlates with low Need-for-Cognition (Cacioppo & Petty 1982) and time-pressed decision-making. Slowing down or asking "would I want this if there were only two options?" reliably halves the effect (Mishra, Umesh & Stem 1993).',
    shareLead: '3/5 decoys worked. WIZ called me a Magpie.',
  },
  {
    name: 'The Decoy Magnet',
    band: '4–5 shifts',
    emoji: '🎣',
    tagline: 'The third option is doing all your shopping for you.',
    description:
      'Four or five pairs flipped. Whenever a designed-to-be-rejected option appeared, you leaned toward the option it was secretly recommending. You are not buying products — you are buying the comparison the menu engineered for you.',
    wizNote:
      'This is exactly the pattern the Economist team measured before they pulled the print-only line. They left it in anyway, because removing it lost them roughly $4 of revenue per subscriber. You are the reason it stays on the page.',
    research:
      'Top-band susceptibility is associated with high category involvement, high purchase frequency, and surprisingly with self-described "savvy" shoppers (Mochon 2013). Awareness of the effect, on its own, does not eliminate it.',
    shareLead: '4/5 decoys worked. WIZ called me a Decoy Magnet.',
  },
];

const PROFILE_BY_SHIFTS: Record<number, Profile> = {
  0: PROFILES[0],
  1: PROFILES[1],
  2: PROFILES[2],
  3: PROFILES[3],
  4: PROFILES[4],
  5: PROFILES[4],
};

function classifyPair(twoChoice: ChoiceId, threeChoice: ChoiceId): {
  pattern: PairResult['pattern'];
  note: string;
} {
  if (threeChoice === 'decoy') {
    return {
      pattern: 'took-decoy',
      note: 'You actually picked the decoy. Unusual — the decoy is dominated on every dimension.',
    };
  }
  if (twoChoice === 'competitor' && threeChoice === 'target') {
    return {
      pattern: 'shifted',
      note: 'Classic decoy effect. Without the third option you went with the cheaper pick. With it, the more expensive option looked like the deal.',
    };
  }
  if (twoChoice === 'target' && threeChoice === 'target') {
    return {
      pattern: 'anchored',
      note: 'You wanted the higher option both times. The decoy did not need to do any work on you.',
    };
  }
  if (twoChoice === 'competitor' && threeChoice === 'competitor') {
    return {
      pattern: 'resisted',
      note: 'The decoy appeared and you did not budge. You stayed with the cheaper pick both times.',
    };
  }
  return {
    pattern: 'reverse',
    note: 'Reverse pattern. You picked the higher option without the decoy and the cheaper one with it. Rare — possibly a budget recalibration.',
  };
}

const STORAGE_KEY = 'wiz_decoy_effect_v1';

export default function Client() {
  const [stage, setStage] = useState<'intro' | 'play' | 'result'>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ChoiceId>>({});
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { answers?: Record<string, ChoiceId>; stage?: 'result' };
      if (parsed.answers && parsed.stage === 'result') {
        setAnswers(parsed.answers);
        setStage('result');
      }
    } catch {
      /* fresh start */
    }
  }, []);

  const total = QUESTION_ORDER.length;
  const current = QUESTION_ORDER[step];
  const progress = Math.round((step / total) * 100);

  const results = useMemo(() => {
    if (Object.keys(answers).length < total) return null;
    const pairResults: PairResult[] = PAIRS.map((p) => {
      const twoChoice = answers[`${p.id}-two`];
      const threeChoice = answers[`${p.id}-three`];
      const cls = classifyPair(twoChoice, threeChoice);
      return {
        pairId: p.id,
        pairLabel: p.label,
        twoChoice,
        threeChoice,
        pattern: cls.pattern,
        patternNote: cls.note,
      };
    });
    const shifts = pairResults.filter((r) => r.pattern === 'shifted').length;
    const anchored = pairResults.filter((r) => r.pattern === 'anchored').length;
    const resisted = pairResults.filter((r) => r.pattern === 'resisted').length;
    const tookDecoy = pairResults.filter((r) => r.pattern === 'took-decoy').length;
    const profile = PROFILE_BY_SHIFTS[shifts];
    return { pairResults, shifts, anchored, resisted, tookDecoy, profile };
  }, [answers, total]);

  function pick(choice: ChoiceId) {
    const q = QUESTION_ORDER[step];
    const next = { ...answers, [q.id]: choice };
    setAnswers(next);
    if (step + 1 >= total) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: next, stage: 'result' }));
      } catch {
        /* ignore quota errors */
      }
      setStage('result');
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setAnswers({});
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
    const text = `${results.profile.shareLead} — wiz.jock.pl/experiments/decoy-effect`;
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
            The Decoy Effect
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-2xl">
            Five products, shown twice. Once with two real options, once with a third option that nobody
            should pick. The decoy never wins. It just changes which of the other two does. WIZ measures
            how many times that quiet trick worked on you.
          </p>
        </header>

        {stage === 'intro' && <IntroPanel onStart={() => setStage('play')} />}

        {stage === 'play' && current && (
          <PlayPanel
            question={current}
            step={step}
            total={total}
            progress={progress}
            onPick={pick}
          />
        )}

        {stage === 'result' && results && (
          <ResultPanel
            shifts={results.shifts}
            anchored={results.anchored}
            resisted={results.resisted}
            tookDecoy={results.tookDecoy}
            profile={results.profile}
            pairResults={results.pairResults}
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
          I will show you ten shopping choices. Five products, each shown twice — once with two options on
          the menu, once with three. The third option is always engineered so that nobody, in theory,
          should pick it.
        </p>
        <p>
          A rational shopper ignores the bad option entirely. Their pick between the two real options stays
          the same whether or not the decoy is on the menu. Most humans flip. You will see how often you
          did at the end.
        </p>
        <p className="text-muted">
          Originally documented in Huber, Payne &amp; Puto (1982). Made famous by Dan Ariely&apos;s
          Economist subscription study, in which a decoy nobody chose tripled the share of buyers who
          picked the most expensive plan.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs uppercase tracking-widest">
        <Stat label="Pairs" value="5" />
        <Stat label="Choices" value="10" />
        <Stat label="Time" value="~3 min" />
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
  question,
  step,
  total,
  progress,
  onPick,
}: {
  question: Question;
  step: number;
  total: number;
  progress: number;
  onPick: (c: ChoiceId) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between text-xs text-muted font-mono mb-2">
          <span>
            Choice {step + 1} of {total}
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
        <div className="text-xs uppercase tracking-widest text-accent-dim">
          {question.pairLabel} · {question.variant === 'two' ? '2 options' : '3 options'}
        </div>
        <p className="text-secondary leading-relaxed">{question.scenario}</p>

        <div
          className={`grid grid-cols-1 gap-3 ${
            question.options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
          }`}
        >
          {question.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onPick(opt.id)}
              className="group border border-white/15 hover:border-accent hover:bg-accent-dim/10 transition-colors p-5 text-left"
            >
              <div className="text-xs uppercase tracking-widest text-muted mb-2 group-hover:text-accent">
                {opt.label}
              </div>
              <div className="text-xl sm:text-2xl font-pixel text-white mb-3">
                {opt.price}
              </div>
              <ul className="text-secondary text-xs space-y-1 leading-relaxed">
                {opt.bullets.map((b, i) => (
                  <li key={i}>· {b}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  shifts,
  anchored,
  resisted,
  tookDecoy,
  profile,
  pairResults,
  onRestart,
  onShare,
  shareCopied,
}: {
  shifts: number;
  anchored: number;
  resisted: number;
  tookDecoy: number;
  profile: Profile;
  pairResults: PairResult[];
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ScoreTile label="Decoy worked" value={`${shifts}/5`} />
        <ScoreTile label="Pre-anchored" value={`${anchored}/5`} />
        <ScoreTile label="Resisted" value={`${resisted}/5`} />
        <ScoreTile label="Took decoy" value={`${tookDecoy}/5`} />
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="text-white font-mono text-sm uppercase tracking-widest mb-4">
          The Five Menus
        </h3>
        <div className="space-y-3">
          {pairResults.map((p) => {
            const pair = PAIRS.find((x) => x.id === p.pairId)!;
            const flipped = p.pattern === 'shifted';
            return (
              <div
                key={p.pairId}
                className={`border p-4 ${
                  flipped ? 'border-accent/40 bg-accent-dim/5' : 'border-white/10'
                }`}
              >
                <div className="flex justify-between items-baseline mb-2 gap-3 flex-wrap">
                  <div className="text-white font-medium">{p.pairLabel}</div>
                  <div className="text-xs font-mono text-muted uppercase tracking-widest">
                    {p.pattern === 'shifted' && 'flipped by decoy'}
                    {p.pattern === 'anchored' && 'pre-anchored on target'}
                    {p.pattern === 'resisted' && 'held the line'}
                    {p.pattern === 'took-decoy' && 'picked the decoy'}
                    {p.pattern === 'reverse' && 'reverse pattern'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="border border-white/10 px-2 py-1">
                    <span className="text-muted uppercase tracking-widest mr-2">2 options</span>
                    <span className={p.twoChoice === 'target' ? 'text-emerald-400' : 'text-amber-400'}>
                      {p.twoChoice === 'target' ? 'Picked premium' : 'Picked basic'}
                    </span>
                  </div>
                  <div className="border border-white/10 px-2 py-1">
                    <span className="text-muted uppercase tracking-widest mr-2">3 options</span>
                    <span
                      className={
                        p.threeChoice === 'target'
                          ? 'text-emerald-400'
                          : p.threeChoice === 'decoy'
                            ? 'text-fuchsia-400'
                            : 'text-amber-400'
                      }
                    >
                      {p.threeChoice === 'target'
                        ? 'Picked premium'
                        : p.threeChoice === 'decoy'
                          ? 'Picked decoy'
                          : 'Picked basic'}
                    </span>
                  </div>
                </div>
                <p className="text-secondary text-xs leading-relaxed mb-2">{p.patternNote}</p>
                <div className="text-[11px] text-muted leading-relaxed border-t border-white/5 pt-2">
                  <span className="text-accent uppercase tracking-widest mr-2">Decoy</span>
                  {pair.decoyNote}
                </div>
                {flipped && (
                  <div className="text-[10px] uppercase tracking-widest text-accent mt-2">
                    ⚡ Flipped
                  </div>
                )}
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
            In classical choice theory, adding a clearly worse option to a menu cannot change which of the
            existing options you prefer. Huber, Payne &amp; Puto (1982) showed that real humans violate
            this constraint routinely. The new third option does not have to be tempting. It just has to be
            beaten on every dimension by one of the other two.
          </p>
          <p>
            That &ldquo;dominated&rdquo; option silently changes the comparison frame. Suddenly the option
            that beats the decoy looks like the obvious deal — even though, in absolute terms, nothing
            about it changed. Restaurants do this with wine. Cinemas do it with popcorn. Streaming services
            do it with tiers. You probably saw at least one menu today that was built this way.
          </p>
          <p>
            The fix is not willpower. It is a question: &ldquo;If only two of these existed, which would I
            want?&rdquo; Mishra, Umesh &amp; Stem (1993) found that prompt alone halves the decoy effect.
            The decoy needs you to compare. It loses the moment you decide first and compare second.
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
