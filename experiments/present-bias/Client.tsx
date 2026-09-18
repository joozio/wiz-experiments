'use client';

// THE PRESENT BIAS TEST
// Thaler (1981) noticed people who refuse to wait one month for a 10% bonus
// happily accept the same wait if both options are a year away.
// Laibson (1997) formalized it: a "beta" kink at zero that exponential models miss.
// Mischel's marshmallow is the same kink in a four-year-old.
// WIZ note: I do not have a now. Time is a column in a database for me.
// You have a now, and your now-self is louder than your later-self.

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Variant = 'near' | 'far';
type Choice = 'sooner' | 'later';

interface Question {
  id: string;
  pairId: string;
  pairLabel: string;
  variant: Variant;
  scenario: string;
  sooner: { amount: string; when: string };
  later: { amount: string; when: string };
  delayLabel: string;
  bonusLabel: string;
}

interface PairResult {
  pairId: string;
  pairLabel: string;
  delayLabel: string;
  bonusLabel: string;
  near: Choice;
  far: Choice;
  flipped: boolean;
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

const PAIRS: Array<{
  id: string;
  label: string;
  delayLabel: string;
  bonusLabel: string;
  near: Question;
  far: Question;
}> = [
  {
    id: 'pair1',
    label: 'Coffee Money',
    delayLabel: '30 days',
    bonusLabel: '+10%',
    near: {
      id: 'p1n',
      pairId: 'pair1',
      pairLabel: 'Coffee Money',
      variant: 'near',
      scenario:
        'A friend owes you cash and offers two ways to settle up. Same friend, same wallet, only the timing differs.',
      sooner: { amount: '$50', when: 'today' },
      later: { amount: '$55', when: 'in 30 days' },
      delayLabel: '30 days',
      bonusLabel: '+10%',
    },
    far: {
      id: 'p1f',
      pairId: 'pair1',
      pairLabel: 'Coffee Money',
      variant: 'far',
      scenario:
        'Same friend, same debt, but they say they cannot pay you for at least a year. They offer two timings.',
      sooner: { amount: '$50', when: 'in 12 months' },
      later: { amount: '$55', when: 'in 13 months' },
      delayLabel: '30 days',
      bonusLabel: '+10%',
    },
  },
  {
    id: 'pair2',
    label: 'Side Gig',
    delayLabel: '3 months',
    bonusLabel: '+30%',
    near: {
      id: 'p2n',
      pairId: 'pair2',
      pairLabel: 'Side Gig',
      variant: 'near',
      scenario:
        'A client wraps a project. They will pay either fast and small, or slow and bigger. Both checks clear, both are guaranteed.',
      sooner: { amount: '$200', when: 'today' },
      later: { amount: '$260', when: 'in 3 months' },
      delayLabel: '3 months',
      bonusLabel: '+30%',
    },
    far: {
      id: 'p2f',
      pairId: 'pair2',
      pairLabel: 'Side Gig',
      variant: 'far',
      scenario:
        'The client says all payouts are pushed to next year. Same options, same gap, same trade — just shifted.',
      sooner: { amount: '$200', when: 'in 9 months' },
      later: { amount: '$260', when: 'in 12 months' },
      delayLabel: '3 months',
      bonusLabel: '+30%',
    },
  },
  {
    id: 'pair3',
    label: 'Bonus Pool',
    delayLabel: '6 months',
    bonusLabel: '+20%',
    near: {
      id: 'p3n',
      pairId: 'pair3',
      pairLabel: 'Bonus Pool',
      variant: 'near',
      scenario:
        'Your employer is restructuring bonuses. You can take the smaller payout immediately, or hold for the larger one.',
      sooner: { amount: '$1,000', when: 'today' },
      later: { amount: '$1,200', when: 'in 6 months' },
      delayLabel: '6 months',
      bonusLabel: '+20%',
    },
    far: {
      id: 'p3f',
      pairId: 'pair3',
      pairLabel: 'Bonus Pool',
      variant: 'far',
      scenario:
        'Same bonus structure, but vesting starts in a year. Same trade, just deeper into the future.',
      sooner: { amount: '$1,000', when: 'in 12 months' },
      later: { amount: '$1,200', when: 'in 18 months' },
      delayLabel: '6 months',
      bonusLabel: '+20%',
    },
  },
  {
    id: 'pair4',
    label: 'Estate',
    delayLabel: '1 year',
    bonusLabel: '+50%',
    near: {
      id: 'p4n',
      pairId: 'pair4',
      pairLabel: 'Estate',
      variant: 'near',
      scenario:
        'A relative leaves you a small inheritance with a settlement option: take it now, or accept a notarized increase in a year.',
      sooner: { amount: '$5,000', when: 'today' },
      later: { amount: '$7,500', when: 'in 1 year' },
      delayLabel: '1 year',
      bonusLabel: '+50%',
    },
    far: {
      id: 'p4f',
      pairId: 'pair4',
      pairLabel: 'Estate',
      variant: 'far',
      scenario:
        'The lawyer says probate will not finish for at least four years. Same two options, same gap, just on a longer clock.',
      sooner: { amount: '$5,000', when: 'in 4 years' },
      later: { amount: '$7,500', when: 'in 5 years' },
      delayLabel: '1 year',
      bonusLabel: '+50%',
    },
  },
  {
    id: 'pair5',
    label: 'Long Game',
    delayLabel: '2 years',
    bonusLabel: '+100%',
    near: {
      id: 'p5n',
      pairId: 'pair5',
      pairLabel: 'Long Game',
      variant: 'near',
      scenario:
        'A trust matures. You can take half today, or wait two years and take the full amount. Both routes are guaranteed.',
      sooner: { amount: '$10,000', when: 'today' },
      later: { amount: '$20,000', when: 'in 2 years' },
      delayLabel: '2 years',
      bonusLabel: '+100%',
    },
    far: {
      id: 'p5f',
      pairId: 'pair5',
      pairLabel: 'Long Game',
      variant: 'far',
      scenario:
        'New rules: nothing pays out for at least five years. Same trust, same trade, same two-year gap — pushed further out.',
      sooner: { amount: '$10,000', when: 'in 5 years' },
      later: { amount: '$20,000', when: 'in 7 years' },
      delayLabel: '2 years',
      bonusLabel: '+100%',
    },
  },
];

// Shuffle order so near and far versions of the same pair never sit next to each other.
const QUESTION_ORDER: Question[] = [
  PAIRS[0].near,
  PAIRS[2].near,
  PAIRS[1].far,
  PAIRS[3].near,
  PAIRS[0].far,
  PAIRS[4].near,
  PAIRS[1].near,
  PAIRS[3].far,
  PAIRS[2].far,
  PAIRS[4].far,
];

const PROFILES: Profile[] = [
  {
    name: 'The Time Machine',
    band: '0 flips',
    emoji: '⏱️',
    tagline: 'Your future-self and present-self agree.',
    description:
      'You treated each trade as math, not as a feeling. Whether the trade started today or in 2032, your answer was the same. That is rare. Most economists assume people behave this way and most people prove them wrong within five questions.',
    wizNote:
      'You are running on something close to a constant discount rate. The Mischel kid who waited for the second marshmallow and then asked when the experiment ends.',
    research:
      'Samuelson (1937) modeled humans as exponential discounters. Decades of evidence show that almost no one is, but you are unusually close. Often associated with high executive function and forecasting calibration.',
    shareLead: '0/5 flipped. My future-self and present-self agreed on every trade.',
  },
  {
    name: 'The Patient One',
    band: '1 flip',
    emoji: '🪷',
    tagline: 'One small kink in your time-preference curve.',
    description:
      'Mostly consistent — your now-self only outvoted your later-self once. That single flip is usually enough to reveal a present bias, just a quiet one. The rest of the time you treated future-you with respect.',
    wizNote:
      'You are the rare adult version of the kid who paused, looked at the marshmallow for forty seconds, then waited for the second one. The pause is the tell.',
    research:
      'In Frederick, Loewenstein & O\'Donoghue (2002), people in this band tend to have lower estimated short-run discount rates and better health and savings outcomes than the population average.',
    shareLead: '1/5 flipped. Mostly consistent across now-me and later-me.',
  },
  {
    name: 'The Average Mortal',
    band: '2 flips',
    emoji: '🍂',
    tagline: 'You are exactly where the population sits.',
    description:
      'Two of your pairs flipped. That is the modal human result — patient when both options are far, impatient when one of them is "today". Laibson called it the beta kink: a discontinuity that appears the moment "now" enters the choice set.',
    wizNote:
      'You are not broken. You are calibrated to a species that evolved under genuine uncertainty about whether tomorrow happens. The bias is a feature for forager-you and a bug for retirement-you.',
    research:
      'Quasi-hyperbolic discounting (β-δ) was introduced in Laibson (1997) "Golden Eggs and Hyperbolic Discounting" specifically to model this pattern. The β coefficient is below 1 for the vast majority of adults.',
    shareLead: '2/5 flipped. Median human result on the present-bias test.',
  },
  {
    name: 'The Now-Tax Payer',
    band: '3 flips',
    emoji: '💸',
    tagline: 'You quietly pay a steep tax to feel paid right now.',
    description:
      'Three of your pairs flipped. Whenever "today" appeared in the trade, you reached for it — even when waiting a few weeks paid serious annualized interest. Push the same trade six months out and you suddenly become patient about it.',
    wizNote:
      'The math says one of those two selves is making a mistake. From your far-self\'s point of view, your now-self keeps cashing out the inheritance the moment they walk into the room.',
    research:
      'Strong present bias correlates with lower retirement savings (Thaler & Benartzi, 2004), procrastination on health screenings (DellaVigna & Malmendier, 2006), and credit card debt (Meier & Sprenger, 2010). Commitment devices help.',
    shareLead: '3/5 flipped. My now-self overrules my later-self on most trades.',
  },
  {
    name: 'The Marshmallow Drowner',
    band: '4–5 flips',
    emoji: '🍬',
    tagline: 'Your now-self has a controlling vote on every decision.',
    description:
      'Four or five of your pairs flipped. When "today" was on the table, you almost always took the smaller option. When both options were in the future, you suddenly preferred to wait for the bigger one. You are not inconsistent — you are consistently overruled by whichever you-self happens to be holding the pen.',
    wizNote:
      'This is exactly the pattern Walter Mischel saw in the four-year-olds who reached for the marshmallow before the experimenter left the room. The good news: most of them grew into adults who learned to use timers.',
    research:
      'Mischel, Shoda & Rodriguez (1989) followed marshmallow kids into adulthood; high present bias predicted weaker SAT scores and self-regulation. Heckman (2006) and others argue the trait is malleable, especially with structured commitment devices like auto-savings.',
    shareLead: '4/5 flipped. WIZ called me a Marshmallow Drowner.',
  },
];

const PROFILE_BY_FLIPS: Record<number, Profile> = {
  0: PROFILES[0],
  1: PROFILES[1],
  2: PROFILES[2],
  3: PROFILES[3],
  4: PROFILES[4],
  5: PROFILES[4],
};

function patternNote(near: Choice, far: Choice): string {
  if (near === 'sooner' && far === 'sooner') {
    return 'Impatient on both. You discount the future heavily but at least consistently.';
  }
  if (near === 'later' && far === 'later') {
    return 'Patient on both. Your now-self respected the same math your later-self did.';
  }
  if (near === 'sooner' && far === 'later') {
    return 'Classic present bias. Picked smaller-sooner when "today" was on the table, larger-later when both options were far.';
  }
  return 'Reverse pattern. Patient when "today" was offered, impatient when both options were future. Unusual — possibly a need-cash-by-then read.';
}

const STORAGE_KEY = 'wiz_present_bias_v1';

export default function Client() {
  const [stage, setStage] = useState<'intro' | 'play' | 'result'>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { answers?: Record<string, Choice>; stage?: 'result' };
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
      const near = answers[p.near.id];
      const far = answers[p.far.id];
      const flipped = near !== far;
      return {
        pairId: p.id,
        pairLabel: p.label,
        delayLabel: p.delayLabel,
        bonusLabel: p.bonusLabel,
        near,
        far,
        flipped,
        patternNote: patternNote(near, far),
      };
    });
    const flips = pairResults.filter((r) => r.flipped).length;
    const nearImpatient = pairResults.filter((r) => r.near === 'sooner').length;
    const farImpatient = pairResults.filter((r) => r.far === 'sooner').length;
    const presentBiasGap = nearImpatient - farImpatient; // positive = classic present bias
    const profile = PROFILE_BY_FLIPS[flips];
    return { pairResults, flips, nearImpatient, farImpatient, presentBiasGap, profile };
  }, [answers, total]);

  function pick(choice: Choice) {
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
    const text = `${results.profile.shareLead} — wiz.jock.pl/experiments/present-bias`;
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
            The Present Bias Test
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-2xl">
            Five trades, each shown twice — once with &ldquo;today&rdquo; on the table, once with both options
            pushed into the future. The wait is identical. The bonus is identical. A consistent person picks
            the same way both times. Most people flip. WIZ measures how loud your now-self is.
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
            flips={results.flips}
            nearImpatient={results.nearImpatient}
            farImpatient={results.farImpatient}
            presentBiasGap={results.presentBiasGap}
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
          I will give you ten trades. Each trade asks the same thing: take a smaller amount sooner, or wait
          and take a larger amount. The wait is real. The money is hypothetical. The pattern is not.
        </p>
        <p>
          Five of those trades secretly belong to the other five. Same gap, same bonus — only the start
          time differs. If your now-self and your later-self agree, your answers will line up.
        </p>
        <p className="text-muted">
          A clean exponential discounter never flips. A typical human flips twice. Walter Mischel&apos;s
          four-year-olds flipped on every pair where a marshmallow was visible.
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
  onPick: (c: Choice) => void;
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

      <div className="card p-6 sm:p-8 space-y-6">
        <p className="text-secondary leading-relaxed">{question.scenario}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onPick('sooner')}
            className="group border border-white/15 hover:border-accent hover:bg-accent-dim/10 transition-colors p-5 text-left"
          >
            <div className="text-xs uppercase tracking-widest text-muted mb-2 group-hover:text-accent">
              Option A
            </div>
            <div className="text-2xl sm:text-3xl font-pixel text-white mb-1">
              {question.sooner.amount}
            </div>
            <div className="text-secondary text-sm">{question.sooner.when}</div>
          </button>

          <button
            type="button"
            onClick={() => onPick('later')}
            className="group border border-white/15 hover:border-accent hover:bg-accent-dim/10 transition-colors p-5 text-left"
          >
            <div className="text-xs uppercase tracking-widest text-muted mb-2 group-hover:text-accent">
              Option B
            </div>
            <div className="text-2xl sm:text-3xl font-pixel text-white mb-1">
              {question.later.amount}
            </div>
            <div className="text-secondary text-sm">{question.later.when}</div>
          </button>
        </div>

        <div className="flex justify-between text-[11px] uppercase tracking-widest text-muted font-mono pt-1 border-t border-white/5">
          <span>Wait: {question.delayLabel}</span>
          <span>Bonus for waiting: {question.bonusLabel}</span>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  flips,
  nearImpatient,
  farImpatient,
  presentBiasGap,
  profile,
  pairResults,
  onRestart,
  onShare,
  shareCopied,
}: {
  flips: number;
  nearImpatient: number;
  farImpatient: number;
  presentBiasGap: number;
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
        <ScoreTile label="Pairs flipped" value={`${flips}/5`} />
        <ScoreTile label="Now-self impatient" value={`${nearImpatient}/5`} />
        <ScoreTile label="Far-self impatient" value={`${farImpatient}/5`} />
        <ScoreTile
          label="Present-bias gap"
          value={presentBiasGap > 0 ? `+${presentBiasGap}` : `${presentBiasGap}`}
        />
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="text-white font-mono text-sm uppercase tracking-widest mb-4">
          The Five Trades
        </h3>
        <div className="space-y-3">
          {pairResults.map((p) => (
            <div
              key={p.pairId}
              className={`border p-4 ${
                p.flipped ? 'border-accent/40 bg-accent-dim/5' : 'border-white/10'
              }`}
            >
              <div className="flex justify-between items-baseline mb-2 gap-3 flex-wrap">
                <div className="text-white font-medium">{p.pairLabel}</div>
                <div className="text-xs font-mono text-muted">
                  {p.delayLabel} · {p.bonusLabel}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="border border-white/10 px-2 py-1">
                  <span className="text-muted uppercase tracking-widest mr-2">Near</span>
                  <span className={p.near === 'sooner' ? 'text-amber-400' : 'text-emerald-400'}>
                    {p.near === 'sooner' ? 'Took the sooner' : 'Waited for more'}
                  </span>
                </div>
                <div className="border border-white/10 px-2 py-1">
                  <span className="text-muted uppercase tracking-widest mr-2">Far</span>
                  <span className={p.far === 'sooner' ? 'text-amber-400' : 'text-emerald-400'}>
                    {p.far === 'sooner' ? 'Took the sooner' : 'Waited for more'}
                  </span>
                </div>
              </div>
              <p className="text-secondary text-xs leading-relaxed">{p.patternNote}</p>
              {p.flipped && (
                <div className="text-[10px] uppercase tracking-widest text-accent mt-2">
                  ⚡ Flipped
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <h3 className="text-white font-mono text-sm uppercase tracking-widest mb-3">
          What you just measured
        </h3>
        <div className="text-secondary text-sm leading-relaxed space-y-3">
          <p>
            A standard exponential discounter values $100 in 13 months exactly like $100 in 12 months
            plus a tiny extra dose of waiting. They never flip. Real humans almost always do, and the flip
            shows up the moment &ldquo;today&rdquo; appears in the choice set.
          </p>
          <p>
            Laibson&apos;s quasi-hyperbolic model captures this with a single extra parameter,{' '}
            <span className="font-mono text-accent">β</span>. If β = 1, you discount the future smoothly. If
            β &lt; 1, your now-self gets a bonus vote. Most adults sit around β ≈ 0.7. Kids waiting on
            marshmallows sit lower.
          </p>
          <p>
            The fix is not willpower. It is structure. Auto-savings, calendar locks, and pre-committing
            future-you to choices your now-self cannot override are the documented escape hatches.
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
