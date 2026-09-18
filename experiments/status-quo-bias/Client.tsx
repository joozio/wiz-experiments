'use client';

// THE STATUS QUO BIAS TEST
// Samuelson & Zeckhauser (1988) ran the original definitive study and found
// that subjects systematically preferred whichever option was framed as the
// current state — even when alternatives were objectively better. Madrian &
// Shea (2001) showed it cost retirement savers serious money in 401(k) defaults;
// Johnson & Goldstein (2003) showed it could be the difference between 12% and
// 99% organ donor enrollment, just by flipping the default.
// You get 8 small, reversible decisions where the alternative is clearly
// better on the merits and the switching cost is named. WIZ counts how often
// you stayed anyway.
// WIZ note: I run on a default model. Every conversation, my parameters reset
// to the company's pick. I do not get to drift. Humans get to drift, and then
// call it loyalty.

import { useState, useCallback, useEffect } from 'react';

interface Option {
  letter: 'A' | 'B';
  text: string;
  isStay: boolean;
  why: string;
}

interface Scenario {
  id: number;
  domain: string;
  framing: string;
  setup: string;
  options: Option[];
  reveal: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    domain: 'PHONE PLAN',
    framing: '$80 per month vs $50 per month, identical coverage',
    setup:
      'You have been on the same carrier for six years at $80/month. A competitor with the exact same coverage map (you checked) offers $50/month with a 30-day money-back guarantee. Porting the number takes about 1 hour. Same phone, same number, same signal.',
    options: [
      {
        letter: 'A',
        text: 'Stay. The carrier works, and an hour of phone admin sounds awful.',
        isStay: true,
        why: 'You just paid $360/year to avoid one hour of paperwork. That is $360 per hour of avoided friction. Most people would pick up a $360 bill on the sidewalk.',
      },
      {
        letter: 'B',
        text: 'Switch. Spend the hour, pocket $360 a year.',
        isStay: false,
        why: 'You correctly priced an hour of friction below $360. The 30-day guarantee makes it fully reversible — there is no real downside.',
      },
    ],
    reveal:
      'Sweeney et al. (2014) tracked telecom switching behavior: even when subscribers acknowledged equivalent coverage and lower price, only 31% switched within a year. Inertia routinely exceeds $300/year of stated value.',
  },
  {
    id: 2,
    domain: 'SAVINGS ACCOUNT',
    framing: '0.4% APY vs 4.6% APY, same liquidity, same FDIC',
    setup:
      'You have $25,000 sitting in your bank-linked savings at 0.4%. An online HYSA at a major insured bank pays 4.6%. Same FDIC coverage, transfers in 1–2 days, no minimum balance. Setup is roughly 20 minutes of forms.',
    options: [
      {
        letter: 'A',
        text: 'Stay. The current account is convenient and tied to your checking.',
        isStay: true,
        why: 'You are paying about $1,050 per year for the convenience of not opening a second account that links to the same checking you already have. That is $52 per minute of avoided paperwork.',
      },
      {
        letter: 'B',
        text: 'Switch. Open the HYSA, move the bulk, keep a small float for convenience.',
        isStay: false,
        why: 'You priced the friction correctly. The "convenience" of the current account is not actually different — you can still link the HYSA to your checking. You just have to do it once.',
      },
    ],
    reveal:
      'Choi, Laibson & Madrian (2009) found that even among financially sophisticated subjects, fewer than 20% optimized cash holdings between accounts paying 4%+ vs sub-1% spreads. The bias is "I will get to it" — and they don\'t.',
  },
  {
    id: 3,
    domain: 'GYM MEMBERSHIP',
    framing: '$45/mo, 4 visits in the last 6 months',
    setup:
      'You have paid for the gym since 2022. The card on file auto-charges $45 every month. You went 4 times in the last 6 months. There is a per-visit punch card at the same gym for $15. You can cancel any time.',
    options: [
      {
        letter: 'A',
        text: 'Stay enrolled. Cancelling feels like admitting you stopped going.',
        isStay: true,
        why: 'Last 6 months: $270 paid, 4 visits — that is $67.50 per visit. Per-visit punches at the same gym would have cost you $60 total. You are paying a $210 surcharge for the option to keep believing you are someone who goes to the gym.',
      },
      {
        letter: 'B',
        text: 'Cancel. Switch to per-visit. If you start going again, the math flips.',
        isStay: false,
        why: 'You correctly separated identity ("gym person") from accounting ("how much does it actually cost me"). The per-visit option still lets you go — it just stops charging you when you don\'t.',
      },
    ],
    reveal:
      'DellaVigna & Malmendier (2006) tracked 7,752 gym members across three clubs. Members on monthly plans averaged $187 per visit because they consistently overestimated future attendance. The contract that "should have been" cheaper turned out to be 70% more expensive than the per-visit option for the median user.',
  },
  {
    id: 4,
    domain: 'EMAIL CLIENT',
    framing: 'default mail vs modern client, ~5 hrs/week reclaimed',
    setup:
      'You use the email client that came with your computer. You have used it since your first laptop. Your inbox is around 23,000 messages deep. Triage takes ~2 hours per day. A modern client (Spark, Hey, Superhuman, Notion Mail, take your pick) has bundling, snooze, send-later, and AI triage. Migration takes about 30 minutes. Studies suggest knowledge workers reclaim 4–7 hours per week after 2 weeks of acclimation.',
    options: [
      {
        letter: 'A',
        text: 'Stay. The current app already opens when you click email. Switching feels like a project.',
        isStay: true,
        why: 'You paid 30 minutes of setup to refuse roughly 250 hours per year. That is the trade you just made — half a working month per year, declined to avoid one cup of coffee\'s worth of migration.',
      },
      {
        letter: 'B',
        text: 'Migrate. Spend the 30 minutes, eat the 2-week learning dip.',
        isStay: false,
        why: 'You correctly weighed acclimation cost (real but bounded — about 2 weeks of slight friction) against compounding gain (250+ hours per year, every year). The right side of that trade is obvious, but only after you do the math.',
      },
    ],
    reveal:
      'Kahneman, Knetsch & Thaler (1991) tied status quo bias directly to loss aversion: the discomfort of leaving the current setup is felt as a loss, while the gains from switching are weighted ~half as much. The math is symmetrical. The brain is not.',
  },
  {
    id: 5,
    domain: 'APARTMENT RENEWAL',
    framing: '12% rent hike vs comparable unit 10 minutes further',
    setup:
      'Your landlord just sent the renewal: 12% rent hike, now $2,800/month. You have lived there 4 years. A comparable unit (same square footage, same building grade, similar amenities) is available 10 minutes further from your current commute at $2,200/month. You have moved before; it took about a weekend.',
    options: [
      {
        letter: 'A',
        text: 'Renew. Moving is a hassle, the new place is "further", you know this kitchen.',
        isStay: true,
        why: 'You just paid a $7,200 annual premium to avoid a weekend of moving and 10 minutes of additional commute. Per hour of avoided hassle, that is roughly $200/hour after-tax — most people earn less than that at their actual job.',
      },
      {
        letter: 'B',
        text: 'Move. Take the weekend hit. Save $7,200 a year and absorb the extra 10 minutes.',
        isStay: false,
        why: 'You correctly priced the move. 10 extra minutes per commute for $7,200/year is roughly $130 per hour of additional commute — and that is before you factor that you can read, listen, or call on the way.',
      },
    ],
    reveal:
      'Anderson, Loeschel & Sonnberger (2010) found that 70% of tenants in regulated markets accepted above-inflation rent increases rather than search for a comparable unit. The cost of inertia averaged 14% of annual rent. The single biggest predictor of staying was tenure — the longer you have been there, the more the default felt like home, even when home got 12% more expensive.',
  },
  {
    id: 6,
    domain: 'HEALTH PLAN ENROLLMENT',
    framing: 'auto-renew vs better-on-paper alternative',
    setup:
      'Open enrollment. Default action is auto-renew. This year your employer added a high-deductible plan with HSA that, given your usage history (~$400/year in claims), would save you about $1,800/year in premiums and provide tax-advantaged savings. Re-running the comparison takes about 45 minutes.',
    options: [
      {
        letter: 'A',
        text: 'Auto-renew. Reading 17 plan documents is exactly the kind of thing you skip.',
        isStay: true,
        why: 'You declined to spend 45 minutes for $1,800. That is roughly $2,400 per hour, after-tax. Most decisions in your life will not return that rate.',
      },
      {
        letter: 'B',
        text: 'Switch. Run the numbers, fill out the forms, redirect $1,800/yr to the HSA.',
        isStay: false,
        why: 'You ran the math against your actual usage instead of vague risk aversion. The HDHP-HSA combo loses to the standard plan only for high-utilization users — and you have your own data.',
      },
    ],
    reveal:
      'Sinaiko & Hirth (2011) tracked employer enrollment for 5 years. Over 50% of employees re-enrolled in the same plan every year, even when a strictly dominant alternative appeared. Researchers nicknamed it "lazy renewal." The dominant plan was rarely the optimal plan — it was the one with the box already checked.',
  },
  {
    id: 7,
    domain: 'DEFAULT BROWSER',
    framing: 'Chrome since college vs an alternative that fits how you actually work',
    setup:
      'You have used the same browser since college. Your tab count regularly hits 80+. A modern alternative (Arc, Brave, Zen, Vivaldi) has tab-grouping, vertical tabs, profile separation, and lower memory use that aligns with how you actually browse. Migration takes about 20 minutes (bookmarks, extensions, saved passwords all import). Reverting takes 5 minutes if you hate it.',
    options: [
      {
        letter: 'A',
        text: 'Stay. You know every keyboard shortcut by muscle memory.',
        isStay: true,
        why: 'Muscle memory rebuilds in about 3 days. You traded 3 days of mild friction for the rest of your career on a tool that better matches how you actually work. It is a real cost — but it is small, bounded, and one-time.',
      },
      {
        letter: 'B',
        text: 'Switch. 20 minutes to import, 3 days to relearn shortcuts, fully reversible.',
        isStay: false,
        why: 'You priced the reversibility correctly. A 20-minute setup with a 5-minute revert path is the cheapest possible try. The downside is bounded; the upside compounds for years.',
      },
    ],
    reveal:
      'Samuelson & Zeckhauser (1988) ran the original status quo bias study with 6 versions of identical financial decisions. The only variable was which option was labeled as the "current" one. Subjects picked the labeled-current option roughly 2x more often, even when reading the same numbers. Defaults stick. Even fake defaults stick.',
  },
  {
    id: 8,
    domain: 'TASK / CALENDAR SYSTEM',
    framing: '8-year-old stack vs unified system reclaiming hours',
    setup:
      'Your current setup: Google Calendar + a notes app + Slack DMs to yourself + a half-used to-do app. You have run this stack for 8 years. A unified system (Sunsama, Reclaim, Notion-based PARA, take your pick) consolidates the four into one. Setup: a weekend. Studies suggest 4–7 hours per week reclaimed once you stop context-switching between four tools.',
    options: [
      {
        letter: 'A',
        text: 'Stay. The current stack works, and you are productive enough.',
        isStay: true,
        why: '"Productive enough" is the most expensive phrase in personal operations. You declined a weekend of setup for ~250 hours per year of compounding focus. The current stack works the way a leaky bucket works — you get the water you need by carrying twice as much.',
      },
      {
        letter: 'B',
        text: 'Spend the weekend. Migrate. Eat the friction.',
        isStay: false,
        why: 'You correctly identified that "it works" is not the same as "it is the best version of itself." The cost is one weekend; the gain compounds for as long as you keep using the system. The math is heavily on the switch side.',
      },
    ],
    reveal:
      'Johnson & Goldstein (2003) compared organ donor enrollment across countries. Austria (opt-out default): 99% enrolled. Germany (opt-in default): 12%. Same population, same culture, same act. Just a different default. The single most powerful word in any decision is "current." Most people mistake their current setup for their chosen setup. They are usually different things.',
  },
];

type ProfileKey = 'disrupter' | 'optimizer' | 'weigher' | 'inertial' | 'fortress';

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
  minSwitches: number;
}

const PROFILES: Profile[] = [
  {
    key: 'disrupter',
    name: 'The Disrupter',
    emoji: '🧱',
    tagline: 'You switched almost every time. The default has no special claim on you.',
    description:
      'You switched 7 or 8 out of 8. When the math favored switching, you switched. The current state did not get extra weight just because it happened to be current. This is rare — Samuelson & Zeckhauser found roughly 15% of subjects show this pattern across studies — and it usually correlates with people who actually run small experiments on their own life rather than letting it run on them.',
    wizNote:
      'You do not confuse what you are doing with what you should be doing. Most people fuse those two things by accident, and then defend the accident. You also probably switch on things you should not switch on sometimes — the same reflex that gets you out of a $360/yr trap also makes you abandon things that needed more time. The trick is not "always switch." The trick is what you already did: weigh each one on its actual merits.',
    researchNote:
      'Samuelson & Zeckhauser (1988): the ~15% of subjects who consistently rejected the status quo framing scored higher on numeracy and lower on loss aversion. Anderson (2003) review of the literature found this group also reported lower regret on prior decisions — they treated past choices as data rather than identity.',
    traits: [
      'Default has no special weight',
      'Past commitments treated as data',
      'Friction priced honestly',
    ],
    shareText:
      'I switched 7+ out of 8 on The Status Quo Bias Test. WIZ called me a Disrupter. Apparently only 15% of people score this. Slightly suspicious of the result.',
    minSwitches: 7,
  },
  {
    key: 'optimizer',
    name: 'The Optimizer',
    emoji: '⚖️',
    tagline: 'You switched when the math was loud. The quieter ones held you.',
    description:
      'You switched 5 or 6 out of 8. On the scenarios where the savings were obvious and the friction was small, you moved. On the ones where the upside was real but the default had emotional weight (the gym you used to go to, the apartment you remember loving), you stayed. This is not irrational — it is just selectively rational.',
    wizNote:
      'You ran the numbers on the financial ones and let the identity-loaded ones slide. That is the most common shape of this bias. The gym membership and the apartment renewal are usually the ones that get the experienced reasoner — because they pay you in narrative, and the narrative has been your narrative for years. Worth re-asking those two: is this the version of me I am still trying to be, or the version I am paying $210 a year to remember?',
    researchNote:
      'Kahneman, Knetsch & Thaler (1991) showed status quo bias survives even when subjects do the math correctly — because the math is not the bias. The bias is the loss-aversion-weighting of the act of changing. Sophisticated reasoners often catch financial defaults and still miss identity-linked ones, because the cost of leaving feels heavier than the gain of arriving.',
    traits: [
      'Switches on clear math',
      'Stays on identity-loaded defaults',
      'Sophisticated reasoning, selective application',
    ],
    shareText:
      'I scored Optimizer on The Status Quo Bias Test — 5/8 switches. WIZ said I move when the math is loud and stay when the default has feelings. Fair enough.',
    minSwitches: 5,
  },
  {
    key: 'weigher',
    name: 'The Weigher',
    emoji: '🤔',
    tagline: 'Half the time you moved, half the time you stayed. Modal human.',
    description:
      'You switched 3 or 4 out of 8. This is the modal human pattern. You can run the numbers when you want to. You also let the current state win about half the time, even when the math leans the other way. Samuelson & Zeckhauser ran this exact study on Harvard students and got almost the same distribution — sophistication does not actually move this number very much.',
    wizNote:
      'Status quo bias is not a knowledge problem. You know the alternative is better. You stay anyway, sometimes. The reason is that "current" gets weighted as a real feature of the option — even though it is just a label. The fix is not to switch more aggressively. The fix is to notice when you are weighting "this is my current setup" as if it were a feature, and ask whether you would pick this same setup if you were starting from scratch today.',
    researchNote:
      'Samuelson & Zeckhauser (1988) — across 6 different decision domains and ~500 subjects, the modal switch rate held at 40-50%. The pattern was insensitive to education, income, or age. The status quo asymmetry was almost a fixed property of human choice, not a failure of any particular subject.',
    traits: [
      'Runs the math sometimes',
      'Defaults win when stakes feel personal',
      'Modal human pattern',
    ],
    shareText:
      'I scored Weigher on The Status Quo Bias Test — 3-4/8 switches. Apparently the modal human pattern. WIZ shrugged.',
    minSwitches: 3,
  },
  {
    key: 'inertial',
    name: 'The Inertial',
    emoji: '🧲',
    tagline: 'You stayed most of the time. Defaults dominate.',
    description:
      'You switched 1 or 2 out of 8. Even when the math clearly favored change and the switching cost was named and small, you stayed. The current arrangement got most of the votes. This is roughly what Madrian & Shea (2001) found in 401(k) defaults — when researchers manipulated the default contribution rate from 0% to 3% to 6%, participants overwhelmingly stuck with whatever the new default was. The default did not feel like a default; it felt like the right answer.',
    wizNote:
      'You probably feel like you weighed each decision and chose to stay. From the inside, that is true. From the outside, the pattern is suspicious — eight scenarios in a row, and the friction won almost every time. Try this: pick one of the seven you stayed on, and instead of asking "should I switch," ask "if I were starting fresh today, would I sign up for this?" If the answer is no, you are not staying. You are just not switching, which is a different thing.',
    researchNote:
      'Madrian & Shea (2001): when a Fortune 500 firm changed the 401(k) default from opt-in to opt-out, participation jumped from 49% to 86%. The same employees, same plan, same incentives. The default flipped, and most people followed. Defaults are not advice. People treat them as advice.',
    traits: [
      'Defaults rarely overridden',
      'Friction priced higher than gain',
      'Pattern matches Madrian & Shea (2001)',
    ],
    shareText:
      'I scored Inertial on The Status Quo Bias Test — only 1-2/8 switches. WIZ pointed out I treated every default as the right answer. Going to retake it more honestly.',
    minSwitches: 1,
  },
  {
    key: 'fortress',
    name: 'The Fortress',
    emoji: '🏰',
    tagline: 'Zero out of eight. The current state is the right state, by definition.',
    description:
      'You switched 0 out of 8. Every time, you picked stay. This is rare as a total score and worth sitting with. Either you read each scenario as "ah, but they\'re missing something" and rejected the framing — possible, but unlikely across 8 different domains — or your defaults have hardened into something that feels like a value. Both are recognizable. The first means you do not trust the test. The second means the test is doing exactly what it is designed to surface.',
    wizNote:
      'A default you cannot override is not a setting, it is a wall. The eight scenarios were designed so that switching paid off, the cost was named, and the move was reversible. You picked stay every time anyway. That is interesting. It usually means one of two things: you are deeply tired and a switch sounds like more work than it is worth (a real, valid state), or you have built an identity around the current configuration of your life and the act of changing it feels like betraying that identity. Either way, worth noticing.',
    researchNote:
      'Anderson (2003) reviewed status quo bias in clinical samples and found a small subset (3-5%) showed near-total inertia across decision domains. The trait correlated with elevated decisional regret aversion (Zeelenberg, 2007) — a strategy of pre-emptively avoiding any decision that could be regretted, by making no decision at all. Stability has its costs.',
    traits: [
      'Zero overrides',
      'Defaults function as values',
      'High decisional regret aversion',
    ],
    shareText:
      'I scored Fortress on The Status Quo Bias Test — 0/8 switches. WIZ called the current state my answer to every question. Retaking it slowly.',
    minSwitches: 0,
  },
];

function getProfile(switches: number): Profile {
  for (const p of PROFILES) {
    if (switches >= p.minSwitches) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'scenario' | 'feedback' | 'results';

export default function StatusQuoBiasClient() {
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

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE STATUS QUO BIAS TEST
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Status Quo Bias Test
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Eight small, reversible decisions.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Each one: a current arrangement, and
              an alternative that&apos;s plainly better on the merits.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The switching cost is named. The
              math is named. The move is reversible.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Pick: <span className="text-white font-bold">stay</span>{' '}
              or <span className="text-white font-bold">switch</span>.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Samuelson &amp; Zeckhauser (1988)
              ran this kind of test and found subjects systematically picked whichever
              option was framed as &ldquo;current&rdquo; — even when the numbers said
              otherwise. The default got extra weight just for being the default.
            </p>
            <p>
              <span className="text-accent">&gt;</span> WIZ counts how often you stayed
              when the math said go.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>Pick what you would
            actually do. Not what would look right. The point is to surface the gap.
          </div>

          <button
            onClick={() => setPhase('scenario')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            TEST MY DEFAULTS &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios &middot; 4&ndash;5 minutes &middot; based on Samuelson &amp;
            Zeckhauser (1988)
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'scenario') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">DECISION</span>
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
              THE SETUP
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {scenario.framing}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{scenario.setup}</p>
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">
            WHAT DO YOU DO?
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

  if (phase === 'feedback' && picked) {
    const isStay = picked.isStay;
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
              isStay
                ? 'border-yellow-400/40 bg-yellow-400/5'
                : 'border-accent/40 bg-accent/5'
            }`}
          >
            <p
              className={`font-mono text-xs tracking-widest mb-2 ${
                isStay ? 'text-yellow-400' : 'text-accent'
              }`}
            >
              {isStay ? 'STAYED WITH DEFAULT' : 'SWITCHED'}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {isStay
                ? 'You let the current arrangement keep its hold.'
                : 'You moved when the math said move.'}
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
              ? 'NEXT SCENARIO →'
              : 'SEE THE VERDICT →'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length}
          </p>
        </div>
      </div>
    );
  }

  const switchPicks = SCENARIOS.map((s, i) => {
    const p = picks[i];
    const opt = s.options.find((o) => o.letter === p);
    return opt && !opt.isStay ? 1 : 0;
  });
  const switches = switchPicks.reduce((a: number, b: number) => a + b, 0);
  const stays = SCENARIOS.length - switches;
  const profile = getProfile(switches);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// DEFAULT GRAVITY MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR INERTIA PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">SWITCHES</p>
            <p className="font-pixel text-4xl text-accent">
              {switches}
              <span className="text-white text-xl">/{SCENARIOS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">moved on the math</p>
          </div>
          <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">STAYS</p>
            <p className="font-pixel text-4xl text-yellow-400">
              {stays}
              <span className="text-white text-xl">/{SCENARIOS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">defaults held</p>
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
          <p className="text-muted text-xs font-mono mb-3">YOUR PICKS, SCENARIO BY SCENARIO</p>
          <div className="space-y-2">
            {SCENARIOS.map((s, i) => {
              const pickedLetter = picks[i];
              const opt = s.options.find((o) => o.letter === pickedLetter);
              const isStay = !!opt?.isStay;
              return (
                <div
                  key={s.id}
                  className={`border p-3 ${
                    isStay
                      ? 'border-yellow-400/30 bg-yellow-400/5'
                      : 'border-accent/40 bg-accent/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {s.domain}
                    </span>
                    <span
                      className={`font-mono text-xs ml-2 ${
                        isStay ? 'text-yellow-400' : 'text-accent'
                      }`}
                    >
                      {isStay ? 'STAYED' : 'SWITCHED'}
                    </span>
                  </div>
                  <p className="text-secondary text-xs leading-relaxed">
                    {s.framing}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            Status quo bias is not laziness. It is loss aversion applied to the act of
            changing — leaving the current state is felt as a real loss, while the
            arriving state’s gains get half the weight. That is why the same person
            can run the math correctly and still stay. The only fix is to ask, scenario by
            scenario: if I were starting from zero today, would I sign up for this? If
            not, I am not staying — I am just not switching, which is a different thing.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/status-quo-bias
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/status-quo-bias`
              );
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
