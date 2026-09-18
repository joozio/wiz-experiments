'use client';

// THE GAMBLER'S FALLACY
// In 1913, at the Casino de Monte-Carlo, black came up 26 times in a row on
// the roulette wheel. Bettors lost millions doubling down on red, certain
// that after such a run, red was overdue. The wheel had no memory. Each
// spin was an independent event. That night gave the fallacy its other
// name — the Monte Carlo fallacy — but the underlying error is older than
// roulette. Tversky and Kahneman (1971) called it "belief in the law of
// small numbers": the intuition that small samples should mirror the
// long-run distribution, that streaks must "correct themselves," that
// chance is a self-policing force. It is not. Independent events stay
// independent. The flip side is the hot-hand fallacy — assuming streaks
// in skill-based events are illusory — which Gilovich, Vallone & Tversky
// (1985) famously claimed to have debunked. But Miller & Sanjurjo (2018)
// showed their analysis contained a subtle selection bias, and that the
// hot hand is in fact real, modest in size, in basketball and elsewhere.
// So the full skill is: know what is independent and what is not. This
// experiment runs 8 streak scenarios — 6 truly independent, 2 with a
// real hot-hand effect — and counts how often you bet on reversal.
// WIZ note: The fallacy is durable because it feels like fairness.
// "Things should even out" is a moral intuition the brain projects onto
// causal systems that have no fairness mechanism. Roulette wheels are
// not karmic. Coin flips do not balance the books. The skill is to
// notice when you have started rooting for randomness to be fair.

import { useState, useCallback, useEffect } from 'react';

type ChoiceLetter = 'A' | 'B' | 'C';

type ChoiceKind = 'reverse' | 'continue' | 'independent';

interface Choice {
  letter: ChoiceLetter;
  text: string;
  kind: ChoiceKind;
  isCorrect: boolean;
  isFallacy: boolean; // true if picking this counts as gambler's fallacy
}

interface Scenario {
  id: number;
  domain: string;
  type: 'independent' | 'skill';
  description: string;
  question: string;
  choices: Choice[];
  correctReasoning: string;
  fallacyTrap: string;
  research: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    domain: 'ROULETTE',
    type: 'independent',
    description:
      'A roulette table in Las Vegas. The wheel has come up red seven spins in a row. The crowd is gathering. You have one bet left.',
    question: 'What is most likely on the next spin?',
    choices: [
      {
        letter: 'A',
        text: 'Black. After seven reds, black is overdue — the colors have to even out.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'Red. The wheel is hot — streaks like this mean something is leaning toward red.',
        kind: 'continue',
        isCorrect: false,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Each color is the same probability it has always been. The wheel has no memory.',
        kind: 'independent',
        isCorrect: true,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'A roulette wheel is a physical system with no state across spins. The metal does not track outcomes. Each spin draws from the same distribution: about 48.6% red, 48.6% black, 2.7% green on an American wheel. The previous seven reds change none of this. The math is brutal in its simplicity — independence means independence.',
    fallacyTrap:
      '"The colors should even out" is the engine of the fallacy. It feels like fairness, but the wheel is not a moral agent. Long-run frequencies converge by adding more trials, not by streaks correcting themselves. A million more spins still produce roughly equal red and black; the seven you just saw stay seven, forever, in the historical record.',
    research:
      'Tversky & Kahneman (1971) "Belief in the Law of Small Numbers" formalized this as the expectation that small samples must locally resemble the long-run distribution. Even trained statisticians were found to have intuitions that violated independence. The fallacy survives explicit warnings.',
  },
  {
    id: 2,
    domain: 'MONTE CARLO 1913',
    type: 'independent',
    description:
      'Casino de Monte-Carlo, August 18, 1913. Black has come up twenty consecutive times. The wheel is being watched by a crowd. Bets on red are escalating with each spin.',
    question: 'What was most likely on spin twenty-one?',
    choices: [
      {
        letter: 'A',
        text: 'Red. After twenty blacks, red was massively overdue. The math demanded a correction.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'Black. Such a streak means the wheel is biased — bet with the streak.',
        kind: 'continue',
        isCorrect: false,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Each spin remained independent. Black, red, and green retained their normal probabilities — the prior twenty had no influence.',
        kind: 'independent',
        isCorrect: true,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'The actual wheel hit black twenty-six times in a row that night. Bettors who kept doubling down on red lost millions of francs across the run. The wheel was eventually checked and found mechanically fair. Each individual spin from one through twenty-six had a roughly 48.6% chance of black; the joint probability of twenty-six in a row is about 1 in 137 million, but the conditional probability of black on the next spin, given any prior streak, never moves.',
    fallacyTrap:
      'The fallacy is "the streak has built up debt to randomness, and the next spin will pay it off." It is the same intuition that runs lottery picks, slot strategies, and superstition in general. The deeper trap: when something rare happens, the brain looks for causal explanation. The causal explanation here is "nothing — independent draws sometimes do this." That answer is so unsatisfying that bettors invent debt instead.',
    research:
      'The Monte Carlo run is the namesake of the Monte Carlo fallacy. Croson & Sundali (2005) studied real-money roulette behavior and found bettors significantly increase bets on the opposite color after streaks of length four or more, exactly the irrational pattern Tversky and Kahneman predicted.',
  },
  {
    id: 3,
    domain: 'COIN',
    type: 'independent',
    description:
      'You have flipped a fair coin eight times. All eight came up heads. Someone offers you a side bet on the ninth flip.',
    question: 'Which is most likely on flip nine?',
    choices: [
      {
        letter: 'A',
        text: 'Tails. After eight heads, the coin owes us tails.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'Heads. The coin is on a streak, and streaks tend to continue.',
        kind: 'continue',
        isCorrect: false,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Heads and tails are still 50/50. The coin does not remember the prior eight flips.',
        kind: 'independent',
        isCorrect: true,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'A fair coin has no internal state. Each flip samples from the same Bernoulli distribution. The probability of nine heads in a row at the start of the experiment was about 0.2%, but conditional on having seen eight heads already, the next flip is still 50/50. This is the textbook definition of independence, and yet the intuition fights it.',
    fallacyTrap:
      'The brain is compressing two different questions: (1) "What is the probability of nine heads in a row, before any flips?" and (2) "What is the probability of heads on flip nine, given eight heads so far?" The first is small; the second is 0.5. Conflating them is the entire fallacy. Each new flip is the start of a fresh experiment as far as the coin is concerned.',
    research:
      'Bar-Hillel & Wagenaar (1991) reviewed three decades of experiments on perceived randomness and found people consistently expect short sequences of fair-coin flips to alternate more than they actually do. A truly random sequence of 100 flips is expected to contain at least one streak of seven of the same side roughly 80% of the time.',
  },
  {
    id: 4,
    domain: 'LOTTERY',
    type: 'independent',
    description:
      'The lottery winning numbers last week were 7, 14, 22, 31, 38. Tonight you are picking your numbers for this week\'s draw.',
    question: 'Which strategy gives you the best chance of winning?',
    choices: [
      {
        letter: 'A',
        text: 'Avoid 7, 14, 22, 31, 38. Those numbers already hit; they are very unlikely to repeat next week.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'Pick 7, 14, 22, 31, 38 — the same set. Those numbers are clearly hot.',
        kind: 'continue',
        isCorrect: false,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Any combination has the same odds. Past winning numbers do not affect future draws.',
        kind: 'independent',
        isCorrect: true,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'Each weekly lottery draw is independent. The combination 7, 14, 22, 31, 38 has exactly the same probability of being drawn as any other valid combination — both before and after it has won once. The numbered balls have no preference for or against being picked again.',
    fallacyTrap:
      'A subtle expected-value note. Picking last week\'s numbers does not raise your odds of winning, but it can lower your expected payout, because if you do win, you may share with others playing the "hot" set. Picking truly random numbers (or numbers above 31, since many people use birthdays) is a slightly better strategy. But that is a payout-sharing argument, not a probability argument. The probability is unchanged.',
    research:
      'Clotfelter & Cook (1993) studied Maryland lottery data and found a clear pattern they called "the gambler\'s fallacy in lotto play." After a number was drawn, the amount bet on that number dropped sharply and recovered only after several months. Real money, irrational pattern.',
  },
  {
    id: 5,
    domain: 'NEWBORN',
    type: 'independent',
    description:
      'A couple has had four children, all boys. They are expecting a fifth. Population-level data: roughly 51% boys, 49% girls at birth in their region.',
    question: 'What is the most likely sex of the fifth child?',
    choices: [
      {
        letter: 'A',
        text: 'A girl. After four boys, the next child is more likely to be a girl — the family is "due."',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'A boy. Some families clearly produce one sex more than the other; this one is producing boys.',
        kind: 'continue',
        isCorrect: false,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Roughly the population baseline — about 51% boy, 49% girl. Past children are nearly independent of the next.',
        kind: 'independent',
        isCorrect: true,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'Births within a family are very nearly independent events. The conditional probability of a boy given four prior boys is essentially the population baseline. There are tiny biological factors (parental age, sperm-cell ratios, some genetic correlates) that can shift things by a percentage point or two, but nothing that makes a girl more likely to "balance things out."',
    fallacyTrap:
      'This scenario gave the gambler\'s fallacy one of its earliest names — "the maturity of chances." Eighteenth-century writers genuinely believed that nature kept books on births, and that a long string of one sex would be paid off by the other. The intuition has survived almost three hundred years of probability theory because it feels deeply right. Fairness is a strong prior.',
    research:
      'Pierre-Simon Laplace, in Essai Philosophique sur les Probabilités (1814), explicitly identified this as a flawed intuition. He noted expectant fathers in his time would "bet against" their family\'s prior sex run, calling it the maturity of chances doctrine. He showed mathematically why it was wrong. Two hundred years later, the intuition is unchanged.',
  },
  {
    id: 6,
    domain: 'SLOT MACHINE',
    type: 'independent',
    description:
      'You have played a slot machine 200 times. No jackpot. The machine\'s posted payout is 1 in 250.',
    question: 'What does this tell you about your next pull?',
    choices: [
      {
        letter: 'A',
        text: 'The jackpot probability is now elevated. The machine is "due" — keep playing.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'The machine is cold. Move to a different one with better recent payouts.',
        kind: 'continue',
        isCorrect: false,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Each pull is independent. The jackpot probability is still 1 in 250 on every spin, regardless of recent history.',
        kind: 'independent',
        isCorrect: true,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'Modern slot machines run on certified random number generators. Each spin samples independently from the configured payout distribution. The 1-in-250 number is a per-spin probability, not a per-session promise. The machine has no debt to the player. Going 500 pulls without a jackpot is uncommon but not impossible (about 13% probability, and the machine does not adjust afterward).',
    fallacyTrap:
      'Casinos design every part of the slot environment to encourage the "due" intuition. The lights, the sound when something pays out near you, the visible meter showing "spins since last jackpot" — all of it pushes the gambler\'s fallacy. The casino does not need this for the math to work in their favor; the house edge handles that. They lean on the fallacy because it keeps players in the seat through cold runs.',
    research:
      'Sundali & Croson (2006) found that casino patrons were measurably more likely to play the same slot machine after a long losing streak, despite the obvious irrationality. The behavior was strongest among gamblers who self-identified as "experienced." Time on the machine did not improve calibration.',
  },
  {
    id: 7,
    domain: 'BASKETBALL',
    type: 'skill',
    description:
      'An NBA player has just made seven free throws in a row in the current game. His career free-throw percentage is 78%. He steps to the line for shot eight.',
    question: 'What is most likely on the next free throw?',
    choices: [
      {
        letter: 'A',
        text: 'A miss. After seven in a row, he is statistically due — the streak has to break.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'A make, with a slightly elevated probability over his 78% baseline. Hot states exist in skill-based shooting.',
        kind: 'continue',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Exactly his 78% baseline. Each shot is independent of the others.',
        kind: 'independent',
        isCorrect: false,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'Free throws are a skill-based event with a measurable hot-hand effect. The 78% baseline is averaged across all his career conditions: tired, fresh, off-night, on-night. Conditional on having made seven in a row tonight, you have evidence that he is in a good shooting state — well-warmed, well-aimed, well-focused. That state has slight positive autocorrelation. The right answer is "slightly above 78%."',
    fallacyTrap:
      'There are two opposite traps here. Pick A and you are committing the gambler\'s fallacy — assuming an independent-style correction in an event that has skill-state autocorrelation. Pick C and you are over-correcting against the gambler\'s fallacy by treating skilled human performance as if it were a coin flip. The cleanest answer recognizes that streaks in skill domains are weak but real evidence of state.',
    research:
      'Gilovich, Vallone & Tversky (1985) famously claimed the hot hand was an illusion. Miller & Sanjurjo (2018) showed their analysis contained a subtle selection-bias correction error, and that, properly analyzed, hot-hand effects are real, modest in size (around 2-5% in NBA shooting), and well-documented across basketball, baseball, and other skill domains.',
  },
  {
    id: 8,
    domain: 'PITCHER',
    type: 'skill',
    description:
      'An MLB pitcher has thrown fourteen strikes in his last fifteen pitches. Commentators are saying he is "in the zone." His season strike rate is 64%.',
    question: 'What is most likely on his next pitch?',
    choices: [
      {
        letter: 'A',
        text: 'A ball. He is overdue to lose control — no one stays hot forever.',
        kind: 'reverse',
        isCorrect: false,
        isFallacy: true,
      },
      {
        letter: 'B',
        text: 'A strike, with a slightly elevated probability over his 64% baseline. Mechanics are clearly working tonight.',
        kind: 'continue',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'C',
        text: 'Exactly his 64% baseline. Each pitch is independent of prior pitches.',
        kind: 'independent',
        isCorrect: false,
        isFallacy: false,
      },
    ],
    correctReasoning:
      'Pitching is a coordinated motor skill with measurable session-level performance variation. Mechanics, fatigue, grip, and visual focus all carry across pitches within an outing. Fourteen of fifteen strikes is strong evidence the pitcher\'s mechanics are dialed in tonight. The conditional probability of a strike on pitch sixteen is meaningfully above the 64% season baseline. The 64% number is averaged across good outings, bad outings, late innings, early innings — conditioning on this outing changes the estimate.',
    fallacyTrap:
      'Same dual trap as the basketball case. Picking A is the gambler\'s fallacy applied to skill (the pitcher is not a roulette wheel that has built up reversal debt). Picking C is the over-correction — treating skilled performance as if season averages applied uniformly to any pitch. The right answer respects both that streaks in skill domains carry information and that the size of the hot-hand effect is modest, not large.',
    research:
      'Green & Zwiebel (2018) analyzed pitch-by-pitch data and found measurable positive autocorrelation in pitcher control within outings. Albright (1993) found similar patterns in baseball hitting. The hot hand is real in events where physical or psychological state varies across attempts. It is not real in events where the underlying mechanism has no state — wheels, dice, balls in jars.',
  },
];

type ProfileKey = 'statistician' | 'mathematician' | 'modal' | 'reverter' | 'mature_chance';

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
  minFallacyCount: number;
  maxFallacyCount: number;
}

const PROFILES: Profile[] = [
  {
    key: 'statistician',
    name: 'The Statistician',
    emoji: '∅',
    tagline: 'You did not bet against randomness once.',
    description:
      'You committed the gambler\'s fallacy 0 or 1 times out of 8. This is the top decile. You held independence intuitions across coin flips, lottery draws, the 1913 Monte Carlo run, slot machines, and the maturity-of-chances baby trap — none of them pulled you into the "things should even out" reflex. On the two skill-based items, you may or may not have caught the hot-hand subtlety, but you were not seduced by reversal expectations. Tversky and Kahneman would have offered you a job.',
    wizNote:
      'Independence intuitions this clean are rare. Most people, even statistically trained ones, lose at least three of these. The skill you have built is the suppression of the fairness instinct: you have learned to notice when "things should balance out" is a moral statement masquerading as a probability statement. The next move is to watch where you still apply this skill unevenly — most people who pass roulette tests still lose in finance, where the same fallacy gets rebranded as "mean reversion." Streaks in your portfolio are usually just streaks; the wheel does not balance.',
    researchNote:
      'Tversky & Kahneman (1971) found that even research mathematicians, asked about small-sample intuitions, gave answers consistent with the gambler\'s fallacy. Their formal training did not transfer to gut intuition. Subjects who score in this band on streak tests typically also pass small-sample-significance and base-rate tests at higher than population rates.',
    traits: [
      'Suppresses the fairness reflex on independent events',
      'Top 10-15% across published Monte Carlo replications',
      'Independence intuitions hold under streak pressure',
    ],
    shareText:
      'I committed the gambler\'s fallacy 0-1/8 times on WIZ\'s streak test. Even after the 1913 Monte Carlo black-26 run, I refused to bet on red. The wheel has no memory.',
    minFallacyCount: 0,
    maxFallacyCount: 1,
  },
  {
    key: 'mathematician',
    name: 'The Mathematician',
    emoji: '⊥',
    tagline: 'You held independence on most events. Two streaks broke through.',
    description:
      'You committed the fallacy 2 times out of 8. You are catching the structure most of the time — recognizing that wheels, coins, and lottery balls have no memory across draws. The two that pulled you were probably the longest streaks (the Monte Carlo 26 run, the 200-pull slot machine) where the streak length itself feels like it has to mean something. The intuition that "after this much, surely it has to flip" is the strongest version of the fallacy, and it gets even strong-grounded thinkers occasionally. Across published streak-test literature, this score puts you in the top quartile.',
    wizNote:
      'You are mostly running independence intuitions, and the misses cluster on the longest streaks. The signal: stretch length triggers the brain\'s "this needs explanation" reflex. The needed counter-move is to remember that long streaks of independent events are exactly what independence predicts. They do not need balancing afterwards; they were always possible. The Monte Carlo 26 run is famous because it happened, not because the wheel was broken.',
    researchNote:
      'Croson & Sundali (2005) tracked real-money roulette bets and found bet size on the opposite color rose sharply after streaks of 4 or more, but most sharply at streak lengths of 6+. The fallacy scales with streak length in human intuition; the underlying probabilities do not.',
    traits: [
      'Catches independence on most streak items',
      'Long streaks pull harder than short ones',
      'Top 20-25% of streak-test subjects',
    ],
    shareText:
      'I committed the gambler\'s fallacy 2/8 on WIZ\'s streak test. The longest streaks got me — Monte Carlo 26 felt like it had to flip. The wheel disagreed.',
    minFallacyCount: 2,
    maxFallacyCount: 2,
  },
  {
    key: 'modal',
    name: 'The Modal Mind',
    emoji: '≈',
    tagline: 'Half independence, half reversal. Standard pattern.',
    description:
      'You committed the fallacy 3 or 4 times out of 8. This is roughly where most subjects land on streak tests in the literature. You catch the math on the looser scenarios and lose to it on the ones engineered to feel most "due." The pattern is predictable: short, abstract streaks (one coin, one wheel) you read correctly; rich, narratively loaded ones (the Monte Carlo crowd, the slot machine after 200 dry pulls, the four-boy family) trigger the fairness reflex. Even Stanford statistics PhDs scored in this band on Tversky and Kahneman\'s original tests.',
    wizNote:
      'Half the time you ran independence, half the time the streak ran you. The interesting move is not "how do I get to zero." Most fallacy-resistance training raises scores by maybe one or two points, not durably. The interesting move is: where does this fallacy show up in your real bets? "The market has been up six months, it is due for a correction." "I have been on a string of bad dates, I am due for a good one." "I have lost three coin flips, the next one has to come up heads." These are the same intuition wearing different clothes. The wheel is not karmic; neither is the market, dating, or your life.',
    researchNote:
      'Sundali & Croson (2006) found gamblers self-identifying as "experienced" had no better calibration on streak intuitions than novices. Time spent in casinos correlates with confidence in the fallacy, not with detection of it. The intuition does not learn from experience; it takes formal correction to update.',
    traits: [
      'Catches abstract streaks, misses dramatic ones',
      'Modal score on extended Monte Carlo problems',
      'Pattern matches Tversky & Kahneman (1971)',
    ],
    shareText:
      'I committed the gambler\'s fallacy 3-4/8 on WIZ\'s streak test — the modal score. Apparently this is how Stanford statistics PhDs do too.',
    minFallacyCount: 3,
    maxFallacyCount: 4,
  },
  {
    key: 'reverter',
    name: 'The Reverter',
    emoji: '↻',
    tagline: 'When something runs hot, you are sure it has to flip.',
    description:
      'You committed the fallacy 5 or 6 times out of 8. The fairness reflex is doing the heavy lifting in your streak intuitions. After a long run of one outcome, your brain registers debt — the universe owes the other side. This is the gambler\'s fallacy in its purest form, and it is genuinely the most common pattern across published replications. It does not mean you are bad at probability. It means your mind treats streaks as moral events that should self-correct. That intuition is wired deep, and it survives explicit teaching of the conjunction rule, the independence rule, and the law of large numbers.',
    wizNote:
      'You are reading streaks as story arcs that require resolution. That is exactly what the fallacy is. The fix is not "treat everything as a coin flip" — that fails too, since some streaks (skill-based ones) do carry signal. The fix is to ask one question: is this system one with memory or without? Roulette wheels, coins, lottery balls, slot machines: no memory, expect no correction. Free-throw shooters, pitchers, stock traders mid-decision, your own mood across a day: state-driven, expect mild positive autocorrelation. The skill is to know which one is on the table.',
    researchNote:
      'Clotfelter & Cook (1993) found Maryland lotto players showed exactly this pattern at scale — picking against numbers that recently won, recovering interest only after months. Real money flowing in patterns identical to the laboratory result. Education and income did not reduce the effect.',
    traits: [
      'Streaks register as imbalances that need correction',
      'Long runs intensify the reversal expectation',
      'Most-common single score band on streak tests',
    ],
    shareText:
      'I committed the gambler\'s fallacy 5-6/8 on WIZ\'s streak test. After every run, I was sure the universe owed a correction. Apparently the wheel disagrees.',
    minFallacyCount: 5,
    maxFallacyCount: 6,
  },
  {
    key: 'mature_chance',
    name: 'The Mature Chance',
    emoji: '⚖',
    tagline: 'You bet on the universe to balance the books. Every time.',
    description:
      'You committed the fallacy 7 or 8 times out of 8. Every long streak you saw, you read as built-up debt to randomness, and you bet on the correction. This is the eighteenth-century "maturity of chances" doctrine that Laplace explicitly debunked in 1814 — and that has remained intuitive enough to keep casinos profitable for two centuries since. The score does not measure your intelligence. It measures the strength of a particular fairness reflex applied to causal systems that do not have a fairness mechanism.',
    wizNote:
      'A clean 7 or 8 means the fairness instinct is overriding every independence cue you were given. There is nothing wrong with the instinct itself — moral fairness is a useful prior in human contexts. The problem is generalizing it to coins and wheels and lottery balls. The most expensive places this fallacy plays out in modern life: investing ("the market is due for a correction"), gambling, dating ("I am due for someone good"), and parenting decisions about probable outcomes for your kids ("they are due for an easy year"). In each case, ask what the system\'s actual memory mechanism is. If you cannot point to one, the instinct is misfiring.',
    researchNote:
      'Tversky & Kahneman (1971) showed even research-trained mathematicians have intuitions consistent with this profile when not actively running the math. Croson & Sundali (2005) found the strongest reversal-betting at streak lengths of 6+, exactly the span featured in this experiment. The pattern is human-universal; only deliberate effort suppresses it.',
    traits: [
      'Maximum fairness-reflex strength across streak items',
      'Eighteenth-century "maturity of chances" pattern',
      'Casino-favorite calibration on independent events',
    ],
    shareText:
      'I committed the gambler\'s fallacy 7-8/8 on WIZ\'s streak test. Every streak, I was sure the universe owed a correction. Laplace tried to warn me in 1814.',
    minFallacyCount: 7,
    maxFallacyCount: 8,
  },
];

function getProfile(fallacyCount: number): Profile {
  for (const p of PROFILES) {
    if (fallacyCount >= p.minFallacyCount && fallacyCount <= p.maxFallacyCount) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'problem' | 'feedback' | 'results';

export default function GamblersFallacyClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picks, setPicks] = useState<ChoiceLetter[]>([]);
  const [selected, setSelected] = useState<ChoiceLetter | null>(null);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];
  const picked = selected
    ? scenario.choices.find((c) => c.letter === selected) ?? null
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
    if (currentIdx + 1 >= SCENARIOS.length) {
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
            WIZ EXPERIMENT /// THE GAMBLER&apos;S FALLACY
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Gambler&apos;s Fallacy
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Eight streak scenarios. Roulette,
              coins, lottery numbers, slot machines, and the 1913 Monte Carlo black-26 run.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Plus two skill-based events where
              the hot hand is actually real.
            </p>
            <p>
              <span className="text-accent">&gt;</span> For each: decide whether reversal is
              due, continuation is hot, or the next event is independent of the streak.
            </p>
            <p>
              <span className="text-accent">&gt;</span> WIZ counts how often you bet on
              randomness to even out.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>The fallacy is durable
            because it feels like fairness. &quot;Things should even out&quot; is a moral
            intuition the brain projects onto causal systems that have no fairness
            mechanism. Roulette wheels are not karmic. Coins do not balance the books. The
            skill is to notice when you have started rooting for randomness to be fair.
          </div>

          <button
            onClick={() => setPhase('problem')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            BEGIN THE TEST &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios &middot; 4&ndash;6 minutes &middot; based on Tversky &amp; Kahneman
            (1971), Miller &amp; Sanjurjo (2018)
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
            <span className="text-accent tracking-widest">SCENARIO</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            CASE {currentIdx + 1} OF {SCENARIOS.length}
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              READ THE STREAK
            </p>
            <p className="text-white text-base leading-relaxed">{scenario.description}</p>
          </div>

          <div className="border border-white/20 bg-white/5 p-4 mb-5">
            <p className="font-mono text-xs text-white tracking-widest mb-2">
              {scenario.question}
            </p>
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">
            YOUR ANSWER
          </p>

          <div className="space-y-3 mb-6">
            {scenario.choices.map((c) => {
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
                  <div className="flex gap-4 items-start">
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
            {currentIdx + 1} / {SCENARIOS.length} &middot; no scrolling back
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'feedback' && picked) {
    const correct = picked.isCorrect;
    const fallacy = picked.isFallacy;
    const verdictBox = correct
      ? 'border-accent/40 bg-accent/5'
      : fallacy
      ? 'border-yellow-400/40 bg-yellow-400/5'
      : 'border-white/30 bg-white/5';
    const verdictLabelColor = correct
      ? 'text-accent'
      : fallacy
      ? 'text-yellow-400'
      : 'text-white';
    const verdictLabel = correct
      ? 'CORRECT — INDEPENDENCE HELD'
      : fallacy
      ? 'GAMBLER\'S FALLACY — REVERSAL EXPECTED'
      : 'NOT QUITE — STATE OR INDEPENDENCE MISSED';
    const verdictHeadline = correct
      ? scenario.type === 'skill'
        ? 'You read the streak as evidence of state. Skill streaks carry signal.'
        : 'You held independence. The streak did not pull you into expecting a correction.'
      : fallacy
      ? 'You bet on reversal. The streak triggered the "things should even out" reflex.'
      : scenario.type === 'skill'
      ? 'You treated a skill event as fully independent. Hot states leak across attempts.'
      : 'You expected the streak to continue. Independent events do not have momentum.';

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

          <div className={`border p-5 mb-5 ${verdictBox}`}>
            <p className={`font-mono text-xs tracking-widest mb-2 ${verdictLabelColor}`}>
              {verdictLabel}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {verdictHeadline}
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              <span className="text-accent font-mono text-xs">CORRECT // </span>
              {scenario.correctReasoning}
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              <span className="text-yellow-400 font-mono text-xs">THE TRAP // </span>
              {scenario.fallacyTrap}
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">RESEARCH // </span>
            {scenario.research}
          </div>

          <button
            onClick={nextProblem}
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

  const fallacyMarks = SCENARIOS.map((v, i) => {
    const letter = picks[i];
    const choice = v.choices.find((c) => c.letter === letter);
    return choice && choice.isFallacy ? 1 : 0;
  });
  const fallacyCount = fallacyMarks.reduce((a: number, b: number) => a + b, 0);
  const correctCount = SCENARIOS.filter((v, i) => {
    const letter = picks[i];
    const choice = v.choices.find((c) => c.letter === letter);
    return choice?.isCorrect;
  }).length;
  const profile = getProfile(fallacyCount);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// GAMBLER&apos;S FALLACY MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3 font-pixel">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR STREAK PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">FULLY CORRECT</p>
            <p className="font-pixel text-4xl text-accent">
              {correctCount}
              <span className="text-white text-xl">/{SCENARIOS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">independence + state</p>
          </div>
          <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">FALLACY COUNT</p>
            <p className="font-pixel text-4xl text-yellow-400">
              {fallacyCount}
              <span className="text-white text-xl">/{SCENARIOS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">bet on reversal</p>
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
          <p className="text-muted text-xs font-mono mb-3">YOUR ANSWERS, CASE BY CASE</p>
          <div className="space-y-2">
            {SCENARIOS.map((v, i) => {
              const letter = picks[i];
              const choice = v.choices.find((c) => c.letter === letter);
              const isFallacy = !!choice?.isFallacy;
              const isCorrect = !!choice?.isCorrect;
              const label = isCorrect ? 'CORRECT' : isFallacy ? 'FALLACY' : 'MISSED STATE';
              const colorClass = isCorrect
                ? 'border-accent/40 bg-accent/5'
                : isFallacy
                ? 'border-yellow-400/30 bg-yellow-400/5'
                : 'border-white/20 bg-white/5';
              const labelColor = isCorrect
                ? 'text-accent'
                : isFallacy
                ? 'text-yellow-400'
                : 'text-white';
              return (
                <div key={v.id} className={`border p-3 ${colorClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {v.domain}
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
            The gambler&apos;s fallacy is not about probability ignorance. Subjects who can
            recite the law of independence still bet on reversal after long streaks. It is
            about which mode the brain runs first. Fairness — surely things should even
            out — is faster than independence — this system has no memory. Both modes are
            useful; the trick is noticing which one applies. Independent systems (wheels,
            coins, lottery balls, slot machines) have no memory, no debt, no maturity.
            State-driven systems (skilled human performance, mood, weather) have weak
            positive autocorrelation. The skill is to know which one is on the table before
            you start projecting fairness onto it.
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
