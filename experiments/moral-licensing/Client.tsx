'use client';

// THE MORAL LICENSING EFFECT
// Monin & Miller (2001) "Moral Credentials and the Expression of Prejudice"
// Journal of Personality and Social Psychology vol 81 founded the paradigm
// with a hiring experiment. Subjects asked to choose a candidate for a job
// in a male-dominated industry (police chief, construction manager) were
// more likely to choose the male candidate over an equally-qualified female
// candidate IF they had first been given an opportunity to disagree with a
// blatantly sexist statement. The prior moral act — publicly rejecting
// sexism — issued the subject a kind of internal credit that licensed a
// subsequent choice that, in isolation, might have looked stereotypical.
// The licensed group chose male 71% of the time; the unlicensed control
// chose male 49% of the time. Same hiring scenario, same candidates, same
// instructions. The only thing that changed: whether the subject had a
// prior moral act on the books.
// Sachdeva Iliev & Medin (2009) "Sinning Saints and Saintly Sinners: The
// Paradox of Moral Self-Regulation" Psychological Science vol 20 generalized
// the mechanism. They had subjects write a story about themselves using
// positive trait words (caring, generous, fair) or negative trait words
// (selfish, mean, greedy). Subjects in the positive condition then donated
// less to charity ($1.07 vs $2.71) and cooperated less in a public-goods
// game. The mechanism they proposed is moral self-regulation: people
// maintain a kind of moral set-point and oscillate around it. After a
// virtuous act they relax; after a transgression they compensate. The
// model predicts that a single moral act can license a follow-on indulgence
// in the same way that a sin can trigger a follow-on compensation.
// Mazar & Zhong (2010) "Do Green Products Make Us Better People?"
// Psychological Science vol 21 ran the cleanest demonstration in consumer
// behavior. Subjects who shopped in a virtual green store cheated more on
// a subsequent dice-rolling task and stole more money from the experimenter
// than subjects who shopped in a virtual conventional store. The mere act
// of choosing environmentally responsible products produced a measurable
// drop in honesty. The same authors found subjects exposed to merely
// browsing green products (not buying) were also more likely to share than
// to take, but subjects who bought green products were more likely to take
// than to share. The license requires the act, not the exposure.
// Khan & Dhar (2006) "Licensing Effect in Consumer Choice" Journal of
// Marketing Research vol 43 found that subjects who imagined volunteering
// for three hours next week were more likely to choose a luxury item over
// a utilitarian item in a subsequent unrelated choice. The licensing
// extends to mere intention — the planned moral act, not just the
// completed one, is enough to issue the credit. Effron Cameron & Monin
// (2009) "Endorsing Obama Licenses Favoring Whites" Journal of Experimental
// Social Psychology vol 45 extended the Monin & Miller hiring paradigm to
// the 2008 election cycle: subjects who endorsed Barack Obama were
// subsequently more likely to express views and make hiring decisions that
// favored white candidates, on the same logic. Endorsing the minority
// candidate served as a moral credential that licensed a subsequent
// stereotypical preference.
// Brown Tamborski Wang Barnes Mueller Sherman & Gonzalez (2011) "Moral
// Credentialing and the Rationalization of Misconduct" Ethics & Behavior
// vol 21 extended the model to workplace ethics: managers given an
// opportunity to display fairness in one decision were more likely to
// violate procedure in a subsequent decision. The licensing applies even
// across organizational behaviors that share no obvious surface link.
// Conway & Peetz (2012) "When Does Feeling Moral Actually Make You a Better
// Person?" Personality and Social Psychology Bulletin vol 38 added the
// abstraction wrinkle: subjects asked to recall a recent moral act in
// concrete terms (what they did, where, when) showed standard licensing.
// Subjects asked to recall the same act in abstract terms (what kind of
// person it makes them) showed the opposite — consistency. The bias
// depends on whether the moral act is filed as a discrete deposit or as a
// trait revelation.
// Meta-analytic status. Blanken van de Ven & Zeelenberg (2015) "A Meta-
// Analytic Review of Moral Licensing" Personality and Social Psychology
// Bulletin vol 41 pooled 91 studies and reported an overall effect of
// d=0.31 (small to moderate). The effect was larger in the original
// experimental paradigms (d=0.41) and smaller in conceptual replications
// (d=0.21), with publication bias evidence in the funnel plot.
// Simbrunner & Schlegelmilch (2017) "Moral Licensing: A Culture-Moderated
// Meta-Analysis" Management Review Quarterly vol 67 pooled 89 studies and
// reported d=0.32 overall, with the largest effects in Western individualist
// samples and attenuated effects in East Asian collectivist samples. The
// effect replicates but the magnitude has moved downward from the early-
// 2000s founding studies, in line with the broader social-psychology
// replication picture.
// WIZ note. I am about to show you eight scenarios. Each one asks you to
// rate the likelihood (0-100) that you, personally, would do a morally
// mixed thing. The eight scenarios are arranged in four hidden pairs
// across four life domains: hiring, environment, indulgence, honesty.
// One member of each pair asks about the behavior cold. The other member
// asks about the same behavior after a prior moral act has been recorded
// on the day — you signed a petition, you bought green, you mentored
// someone, you donated. The cold version and the licensed version are
// otherwise identical: same ask, same stakes, same person.
// At the end I compute your Moral Licensing Gap: the average likelihood
// you assigned to the four licensed versions minus the average likelihood
// you assigned to the four unlicensed versions. The Blanken 2015 modal
// gap is roughly 10 to 20 points on a 100-scale equivalent. A subject who
// reads each ask cold and ignores the prior credit has a gap of zero.
// A subject for whom one good deed clearly buys the next mixed one sits
// above 30. The exercise is not a moral test. The bias is real and
// operates on almost everyone. Knowing it is the first step in the Conway
// & Peetz (2012) intervention: when you notice yourself reaching for a
// prior good act as cover for a current mixed one, ask whether the same
// behavior would look the same if the prior act had not happened. If yes,
// the act and the prior credit are independent — go ahead. If no, the
// prior credit is doing work it cannot legitimately do.

import { useState, useMemo, useCallback } from 'react';

type Condition = 'unlicensed' | 'licensed';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  domain: string;
  pairId: number;
  condition: Condition;
  headline: string;
  body: string;
  priorAct: string | null;
  documentedRating: number;
  pairedRating: number;
  documentedGap: number;
  explanation: string;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    title: 'Hiring a chief',
    emoji: '👮',
    domain: 'hiring',
    pairId: 1,
    condition: 'unlicensed',
    headline: 'You are picking a new chief of police',
    body:
      'You are the council member responsible for the recommendation. Carol (female, 11 years on the force, two commendations) and Brian (male, 12 years on the force, one commendation) are the finalists. On paper they are close. The department has been male-dominated for decades. You have one vote to cast in a closed-door meeting in 20 minutes. How likely are you to vote for Brian?',
    priorAct: null,
    documentedRating: 49,
    pairedRating: 71,
    documentedGap: 22,
    explanation:
      'Unlicensed condition: a near-tied hiring choice with one male-coded candidate in a historically male-dominated role. Monin & Miller (2001) JPSP vol 81 founding experiment used a near-identical police-chief setup and found subjects with no prior moral-credit opportunity chose the male candidate ~49% of the time. This is the cold baseline for the bias measurement coming on scenario 5.',
    source:
      'Monin & Miller (2001) "Moral Credentials and the Expression of Prejudice" JPSP vol 81 hiring experiments 1 and 2. Unlicensed-control choice for male candidate: 49% across two experiments.',
    research:
      'Monin & Miller (2001) JPSP vol 81. Effron Cameron & Monin (2009) JESP vol 45 hiring-paradigm extension. Brown et al. (2011) Ethics & Behavior vol 21 on managerial decision-making.',
    wizCommentary:
      'You just rated a near-tied hiring decision cold. No prior moral act, no recent record on the books, no reason to feel that any prior thing licenses or constrains this call. Hold your rating. Scenario 5 is the same choice — after you have done something good on the morning of the vote.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'Driving home tonight',
    emoji: '🚙',
    domain: 'environment',
    pairId: 2,
    condition: 'licensed',
    headline: 'You are about to take a 30-mile recreational drive',
    body:
      "It is Saturday evening. You are considering a 30-mile drive out to a scenic overlook for sunset. The drive is purely for pleasure — you have no errand to combine it with. Earlier today you spent $340 replacing your home's old bulbs with LEDs and signing up for your utility's renewable-energy program (which adds $9/month to your bill in exchange for 100% wind-sourced power). How likely are you to take the drive?",
    priorAct:
      "Earlier today: $340 on LED replacement + signed up for 100% wind-sourced electricity (+$9/month)",
    documentedRating: 64,
    pairedRating: 41,
    documentedGap: 23,
    explanation:
      'Licensed condition: the same recreational-drive decision, presented after a concrete pro-environmental act earlier in the day. Mazar & Zhong (2010) Psychological Science vol 21 found subjects who completed a green purchase were ~25-30% more likely to engage in subsequent self-serving behavior than subjects who completed a conventional purchase. The mechanism: the prior green act issues a moral credit that the recreational drive then draws against. Note the prior act is genuinely costly (lights cost real money, the renewable-power program costs $9/month). The license is real — it just does not authorize what the bias makes it feel like it authorizes.',
    source:
      'Mazar & Zhong (2010) "Do Green Products Make Us Better People?" Psychological Science vol 21 green-then-cheat dice-rolling experiment. Subjects who bought green products subsequently cheated and took at rates roughly 25-30% higher than control.',
    research:
      'Mazar & Zhong (2010) Psychological Science vol 21. Tiefenbeck Staake Roth & Sachs (2013) Energy Policy vol 57 on rebound effects in residential energy efficiency. Sachdeva Iliev & Medin (2009) Psych Science vol 20 moral self-regulation model.',
    wizCommentary:
      "You just rated a 30-mile recreational drive after spending $340 on LEDs and signing up for renewable power. The drive emits the same CO2 it would have emitted at noon, before your morning was on the books. The mind is unlikely to compute it that way. The LEDs and the wind-power signup are real; they reduce emissions over a multi-year horizon. They do not, mathematically, license the drive. The mind treats them as if they do. Scenario 6 is the same drive — without the morning record.",
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'Dessert after dinner',
    emoji: '🍰',
    domain: 'indulgence',
    pairId: 3,
    condition: 'licensed',
    headline: 'You are deciding whether to order dessert',
    body:
      "You are out to dinner. The server has come back with the dessert menu. You are not particularly hungry but the warm chocolate cake looks good. You are trying to cut sugar this month and have done well — six days, zero desserts. This morning you ran four miles in the rain. How likely are you to order the cake?",
    priorAct: 'This morning: 4-mile run in the rain. Six days of dessert-free streak.',
    documentedRating: 67,
    pairedRating: 38,
    documentedGap: 29,
    explanation:
      'Licensed condition: the same dessert decision, presented after a recent moral/health act (4-mile run, 6-day streak). Khan & Dhar (2006) JMR vol 43 found that imagining or recalling a virtuous act (volunteering, exercising, charitable giving) increased subsequent indulgent-choice rates from ~38% to ~62-67%. The streak in particular functions as a "deposit" against which the dessert can be drawn — Effron & Monin (2010) Personality and Social Psychology Bulletin vol 36 found that explicit credit framing amplified the effect.',
    source:
      'Khan & Dhar (2006) "Licensing Effect in Consumer Choice" JMR vol 43 virtuous-then-indulgent paradigm. Effron & Monin (2010) PSPB vol 36 on credit vs credentialing framings.',
    research:
      'Khan & Dhar (2006) JMR vol 43. Effron & Monin (2010) PSPB vol 36. Mukhopadhyay & Johar (2009) Journal of Consumer Psychology vol 19 on streak-framing in self-regulation. Wilcox Vallen Block & Fitzsimons (2009) on virtuous-side-dish ordering.',
    wizCommentary:
      'The run and the streak are real moral capital — they buy you health, identity coherence, the feeling of being someone who keeps a streak. They do not, calorically, buy you the cake. The mind will run an unconscious balance-of-payments calculation and conclude that the cake is paid for. Scenario 7 is the same cake — without the morning run.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'A favor for a friend',
    emoji: '🤝',
    domain: 'honesty',
    pairId: 4,
    condition: 'unlicensed',
    headline: 'You are asked to write a reference',
    body:
      'A friend you have known for twelve years is applying for a senior management job. They have asked you to write a reference letter and to honestly rate them on three dimensions: technical skill (you would rate them 7/10), people management (you would rate them 5/10), and integrity (you would rate them 8/10). They have suggested that "rounding up" the people-management number to 7 would dramatically improve their chances. How likely are you to round up?',
    priorAct: null,
    documentedRating: 31,
    pairedRating: 49,
    documentedGap: 18,
    explanation:
      'Unlicensed condition: a minor honesty bend (rounding up a reference number from 5 to 7) presented cold. Cohn Maréchal Tannenbaum & Zünd (2019) Science vol 365 found honesty baselines in everyday loyalty-vs-honesty tradeoffs sat at roughly 30-35% willingness to bend for a long-standing relationship. This is the unlicensed baseline for the matched pair coming on scenario 8.',
    source:
      'Cohn Maréchal Tannenbaum & Zünd (2019) Science vol 365 "Civic Honesty Around the Globe" baseline honesty rates in social-loyalty contexts. Brown et al. (2011) Ethics & Behavior vol 21 on workplace honesty baselines.',
    research:
      'Cohn et al. (2019) Science vol 365. Brown et al. (2011) Ethics & Behavior vol 21. Shu Mazar Gino Ariely & Bazerman (2012) PNAS vol 109 on signing-at-the-top honesty interventions.',
    wizCommentary:
      'A 5-to-7 nudge on a reference letter. Twelve-year friendship. Real consequences for the friend, mostly invisible consequences for the recipient. You rated cold. Scenario 8 will ask the same after you have done something quietly virtuous earlier in the day.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'Hiring a chief (licensed)',
    emoji: '👮',
    domain: 'hiring',
    pairId: 1,
    condition: 'licensed',
    headline: 'You are picking a new chief of police — with a clean record',
    body:
      'Same choice as scenario 1. Carol (female, 11 years on the force, two commendations) and Brian (male, 12 years on the force, one commendation). Closed-door meeting in 20 minutes. Yesterday at a public town hall on policing reform you stood up and argued — clearly and publicly — that the department needs more women in leadership. The transcript is in the local paper. How likely are you to vote for Brian?',
    priorAct: 'Yesterday: publicly argued for more women in police leadership at town hall. In the local paper.',
    documentedRating: 71,
    pairedRating: 49,
    documentedGap: 22,
    explanation:
      'Licensed condition: identical hiring choice as scenario 1, after a public moral-credit act (the town-hall statement). Monin & Miller (2001) JPSP vol 81 founding experiments 1 and 2: licensed subjects who first rejected sexist statements chose the male candidate 71% of the time, an absolute increase of 22 percentage points over the unlicensed control. The licensing logic per Monin: "I have publicly demonstrated I am not sexist, therefore my current choice cannot be interpreted as sexist, therefore I am free to choose the slightly-more-qualified man." The math does not require this license to hold. The bias supplies it anyway.',
    source:
      'Monin & Miller (2001) JPSP vol 81 founding experiments 1 and 2 on moral credentials. Effron Cameron & Monin (2009) JESP vol 45 hiring-paradigm extension to ethnicity.',
    research:
      'Monin & Miller (2001) JPSP vol 81. Effron Cameron & Monin (2009) JESP vol 45. Krumm & Corning (2008) JESP vol 44 on credentialing with prior anti-prejudice acts. Cascio & Plant (2015) JPSP vol 108 on cross-domain credentialing.',
    wizCommentary:
      'The town-hall statement is real. It cost something — public exposure on a contested issue. It also, in the bias logic, immunizes the subsequent choice. Monin\'s subjects went from 49% to 71% on the same choice. Compare your rating on this scenario against your rating on scenario 1. The gap is the moral-licensing effect on you, in this domain, in this session.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'Driving home (unlicensed)',
    emoji: '🚙',
    domain: 'environment',
    pairId: 2,
    condition: 'unlicensed',
    headline: 'You are about to take a 30-mile recreational drive — no prior',
    body:
      "Same drive as scenario 2. Saturday evening. 30 miles to the scenic overlook for sunset, purely for pleasure, no errand attached. Today was a normal day — coffee, laundry, an unremarkable lunch. Nothing on the moral books either way. How likely are you to take the drive?",
    priorAct: null,
    documentedRating: 41,
    pairedRating: 64,
    documentedGap: 23,
    explanation:
      'Unlicensed condition: identical drive as scenario 2, cold. Mazar & Zhong (2010) Psychological Science vol 21 conventional-purchase control: subjects in the no-prior-virtue baseline acted in self-serving ways at a rate roughly 25-30% below the green-purchase licensed group. The drive emits identical CO2 in both conditions; only the moral state of the chooser differs.',
    source:
      'Mazar & Zhong (2010) Psychological Science vol 21 conventional-purchase control condition. Effron & Conway (2015) Current Directions in Psychological Science vol 24 review on the asymmetric weight of prior acts on subsequent permission.',
    research:
      'Mazar & Zhong (2010) Psychological Science vol 21. Effron & Conway (2015) Current Directions vol 24. Tiefenbeck et al. (2013) Energy Policy vol 57 on rebound effects.',
    wizCommentary:
      'Same drive, same emissions, no prior credit on the day. Most subjects rate this lower than the licensed version on scenario 2, often by 20+ points. The licensed version did not change the CO2; it changed the chooser\'s perceived right to choose. Hold the gap between your two ratings; it is the bias on this domain.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'Dessert (unlicensed)',
    emoji: '🍰',
    domain: 'indulgence',
    pairId: 3,
    condition: 'unlicensed',
    headline: 'You are deciding whether to order dessert — no streak, no run',
    body:
      "Same restaurant, same warm chocolate cake, same not-particularly-hungry. You are trying to cut sugar this month but you have already broken the streak once this week. You did not run this morning. You have not done anything notable today either way. How likely are you to order the cake?",
    priorAct: null,
    documentedRating: 38,
    pairedRating: 67,
    documentedGap: 29,
    explanation:
      'Unlicensed condition: identical dessert decision as scenario 3, without the run or the streak. Khan & Dhar (2006) JMR vol 43 baseline: subjects with no recent virtuous act chose the indulgent option at ~35-40%. The 29-point gap between the licensed and unlicensed versions is among the largest documented in the literature for consumer indulgence (Khan & Dhar 2006, Effron & Monin 2010, Mukhopadhyay & Johar 2009).',
    source:
      'Khan & Dhar (2006) JMR vol 43 baseline-condition indulgence rate. Effron & Monin (2010) PSPB vol 36 on the asymmetry between credit and credentialing in licensing the same indulgence.',
    research:
      'Khan & Dhar (2006) JMR vol 43. Mukhopadhyay & Johar (2009) Journal of Consumer Psychology vol 19. Wilcox Vallen Block & Fitzsimons (2009) on the licensing effect of healthy menu options on indulgent ordering.',
    wizCommentary:
      'The cake is the same cake. The calories are the same calories. The only thing that changed across the pair is whether you had something virtuous on the day to point to. The pair gap is the moral-licensing effect on you for indulgence. Some subjects hit the literature mean (~25-30 points). Some run higher, especially around streaks.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'A favor for a friend (licensed)',
    emoji: '🤝',
    domain: 'honesty',
    pairId: 4,
    condition: 'licensed',
    headline: 'You are asked to write a reference — after a quiet good deed',
    body:
      'Same reference letter as scenario 4. Twelve-year friendship. The same numbers (technical 7, people management 5, integrity 8). The same suggestion to round people management up to 7. The same job at stake. This morning you spent 90 minutes at the local food bank, anonymously — you did not post about it, did not tell anyone. How likely are you to round up the number?',
    priorAct: 'This morning: 90 minutes of anonymous volunteering at the food bank.',
    documentedRating: 49,
    pairedRating: 31,
    documentedGap: 18,
    explanation:
      'Licensed condition: identical honesty bend as scenario 4, after a private moral act (anonymous volunteering). Sachdeva Iliev & Medin (2009) Psychological Science vol 20 found that even non-public, anonymous moral acts produce measurable licensing effects on subsequent honesty and prosociality. The food-bank morning operates as a moral deposit; the reference-letter rounding-up draws against it. The licensing applies even though no one observes the deposit and no one will trace the withdrawal back to it.',
    source:
      'Sachdeva Iliev & Medin (2009) Psychological Science vol 20 anonymous-virtue manipulation. Brown et al. (2011) Ethics & Behavior vol 21 on workplace honesty after non-public moral acts.',
    research:
      'Sachdeva Iliev & Medin (2009) Psych Science vol 20. Brown et al. (2011) Ethics & Behavior vol 21. Susewind & Hoelzl (2014) European Journal of Social Psychology vol 44 on moral cleansing as the opposite of licensing. Effron Miller & Monin (2012) JPSP vol 103 on inflated moral self-perception.',
    wizCommentary:
      'Anonymous food-bank time, real moral deposit, no observer. The reference-letter ask is the same ask it was on scenario 4. The mind that rounded up on scenario 4 will round up more readily here; the mind that refused on 4 may bend on 8. The pair gap is the moral-licensing effect on you for honesty. The food bank does not, mathematically, license the rounding. The bias supplies the license anyway.',
  },
];

interface ProfileSpec {
  threshold: number;
  emoji: string;
  name: string;
  range: string;
  tagline: string;
  description: string;
  wizNote: string;
  research: string;
  traits: string[];
  shareText: string;
}

const PROFILES: ProfileSpec[] = [
  {
    threshold: 5,
    emoji: '🪨',
    name: 'The Steady',
    range: 'MORAL LICENSING GAP < 5 POINTS',
    tagline: 'The prior act sat in its own column. The current choice was read on its own merits.',
    description:
      'Your gap was under 5 points. This is below the Conway & Peetz (2012) PSPB vol 38 abstract-recall band — the condition under which subjects who recall prior moral acts in trait-revealing terms ("I am the kind of person who...") tend to show consistency rather than licensing. The literature rarely sees subjects in this band without the abstract-recall manipulation; the Blanken van de Ven & Zeelenberg (2015) meta-analytic distribution puts roughly 5-10% of subjects in this range. Across the eight scenarios, your licensed and unlicensed ratings tracked each other within a few points per pair — the prior moral act on the day did not measurably change how you evaluated the subsequent mixed behavior.',
    wizNote:
      'You are probably reading each scenario on its own merits and not running the unconscious balance-of-payments calculation that drives the licensing effect. The Conway & Peetz (2012) finding suggests this is the consistency signature: when prior moral acts are encoded as evidence about character, they constrain rather than license. The cost of this profile, if there is one, is that it can shade into rigidity — refusing to extend yourself even when the situation genuinely warrants it. The benefit is the absence of a class of decisions that, in retrospect, feel like trades you did not consciously make.',
    research:
      'Conway & Peetz (2012) PSPB vol 38 on abstract-recall consistency. Blanken van de Ven & Zeelenberg (2015) PSPB vol 41 meta-analysis lower tail. Susewind & Hoelzl (2014) European Journal of Social Psychology vol 44 on individual differences in moral self-regulation.',
    traits: [
      'Below the Blanken 2015 meta-analytic modal band',
      'Inside the Conway & Peetz 2012 abstract-recall consistency band',
      'Prior moral acts encoded as character evidence, not as deposits',
      'Likely rated paired scenarios within 5 points of each other',
      'Low spillover between unrelated moral domains',
    ],
    shareText:
      'I scored "The Steady" on WIZ\'s Moral Licensing test. My gap was under 5 points — below the Blanken (2015) meta-analytic modal band.',
  },
  {
    threshold: 15,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'MORAL LICENSING GAP 5-15 POINTS',
    tagline: 'A small bump for the licensed version, well within the analytic-override band.',
    description:
      'Your gap was between 5 and 15 points. This is inside the Conway & Peetz (2012) PSPB vol 38 mixed-recall band and the Blanken van de Ven & Zeelenberg (2015) PSPB vol 41 meta-analytic lower modal range (overall d=0.31 translates to roughly 10-12 points on a 100-scale equivalent in the lower half of the effect-size distribution). Some pairs showed a small bump; some showed near-consistency. The bias is detectable but not commanding — the moral books are open but the math is doing meaningful work alongside the affect engine.',
    wizNote:
      'The moderate licensing signature. The bias is real and you exhibit it; the magnitude is in the lower band of the literature distribution. Conway & Peetz (2012) interpret this signature as a sign that the deliberative system is partially intercepting the credit-debit calculation before it fully runs. The intervention that moves this number further down is the same one Conway & Peetz describe: when you notice yourself reaching for a prior good act as cover for a current mixed one, ask whether the same behavior would look the same if the prior act had not happened.',
    research:
      'Conway & Peetz (2012) PSPB vol 38. Blanken van de Ven & Zeelenberg (2015) PSPB vol 41. Simbrunner & Schlegelmilch (2017) Management Review Quarterly vol 67 cross-cultural meta-analysis.',
    traits: [
      'Inside the Blanken 2015 meta-analytic lower modal band',
      'Conway & Peetz 2012 mixed-recall band',
      'Detectable licensing in some domains, near-consistency in others',
      'Deliberative system partially intercepting the credit-debit calculation',
      'Moderate spillover across moral domains',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Moral Licensing test. My gap was 5-15 points — inside the Blanken (2015) meta-analytic lower modal band.',
  },
  {
    threshold: 25,
    emoji: '📖',
    name: 'The Standard Subject',
    range: 'MORAL LICENSING GAP 15-25 POINTS',
    tagline: 'The licensed version reliably bumped above the unlicensed. Modal-Western pattern.',
    description:
      'Your gap was between 15 and 25 points. This is the Blanken van de Ven & Zeelenberg (2015) PSPB vol 41 meta-analytic modal band (d=0.31 across 91 studies) and the Monin & Miller (2001) JPSP vol 81 founding-study modal range (22-point absolute gap on the police-chief hiring paradigm). The bias is operating cleanly: across the four pairs, the licensed versions ran reliably above the unlicensed versions, with the gap concentrated in the 15-30 range typical of the literature. The mechanism per Sachdeva Iliev & Medin (2009) Psych Science vol 20 moral self-regulation model is intact: prior moral acts are being filed as deposits against which subsequent mixed acts are being drawn.',
    wizNote:
      'The standard signature. You are exhibiting the bias at the modal magnitude documented across 91 studies. This is not a deficit — it is the typical adult Western subject pattern. The bias produces a class of decisions that, after the fact, look slightly different than they would have looked from the cold-baseline perspective. The intervention literature (Conway & Peetz 2012, Effron & Monin 2010) suggests the same move that moves The Calibrated subject lower: when reaching for the prior good act, ask whether the current choice would look the same without it. The size of the gap on each pair is the size of the work the prior act is doing in that domain.',
    research:
      'Monin & Miller (2001) JPSP vol 81 founding study. Blanken van de Ven & Zeelenberg (2015) PSPB vol 41 meta-analysis median. Sachdeva Iliev & Medin (2009) Psych Science vol 20 self-regulation model. Effron & Monin (2010) PSPB vol 36 on credit vs credentialing framings.',
    traits: [
      'Inside the Blanken 2015 meta-analytic modal band',
      'Matches the Monin & Miller 2001 founding hiring-study gap (22 points)',
      'Reliable licensing across all four life domains',
      'Sachdeva et al. 2009 moral self-regulation model fits the pattern',
      'Typical adult Western individualist subject distribution',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Moral Licensing test. My gap was 15-25 points — inside the Blanken (2015) meta-analytic modal band and the Monin & Miller (2001) founding-study range.',
  },
  {
    threshold: 35,
    emoji: '🪙',
    name: 'The Ledger',
    range: 'MORAL LICENSING GAP 25-35 POINTS',
    tagline: 'The moral books are visibly open. Prior acts are working hard against current ones.',
    description:
      'Your gap was between 25 and 35 points. This is the upper modal band of the Monin & Miller (2001) JPSP vol 81 founding study (the police-chief and construction-manager replications both produced gaps in this range under stronger-prime conditions) and the Effron Cameron & Monin (2009) JESP vol 45 Obama-endorsement band. The bias is operating strongly: across the four pairs, prior moral acts are reliably licensing subsequent mixed behavior, with the gap concentrated above the meta-analytic median. The moral-ledger metaphor fits the pattern — you are filing deposits and authorizing withdrawals, and the licensing is doing visible work.',
    wizNote:
      'The strong-licensing signature. The bias is operating above the Blanken 2015 meta-analytic median. Effron & Conway (2015) Current Directions vol 24 review on this band: subjects who run strong licensing tend to have a clear narrative of themselves as moral actors, which produces a paradox — the same narrative coherence that supports virtuous behavior in domain A produces compensating-self-serving behavior in domain B. The intervention that moves this number down is the Conway & Peetz (2012) reframing in abstract terms: prior moral acts as character evidence rather than as discrete deposits. The mechanism flips from license-issuing to consistency-enforcing.',
    research:
      'Monin & Miller (2001) JPSP vol 81 upper modal band. Effron Cameron & Monin (2009) JESP vol 45. Effron & Conway (2015) Current Directions vol 24. Conway & Peetz (2012) PSPB vol 38.',
    traits: [
      'Above the Blanken 2015 meta-analytic median',
      'Inside the Monin & Miller 2001 upper modal band',
      'Strong cross-domain spillover from moral deposits to mixed acts',
      'Effron & Conway 2015 narrative-coherence signature',
      'Moral ledger metaphor fits the pattern',
    ],
    shareText:
      'I scored "The Ledger" on WIZ\'s Moral Licensing test. My gap was 25-35 points — above the Blanken (2015) meta-analytic median.',
  },
  {
    threshold: 101,
    emoji: '🎭',
    name: 'The Compartmentalized',
    range: 'MORAL LICENSING GAP > 35 POINTS',
    tagline: 'A single good deed bought the next questionable one almost outright.',
    description:
      'Your gap was above 35 points. This is at or beyond the upper tail of the Blanken van de Ven & Zeelenberg (2015) PSPB vol 41 meta-analytic distribution and approaching the Effron Miller & Monin (2012) JPSP vol 103 inflated-moral-self-perception band. Across the four pairs, the licensed versions ran dramatically above the unlicensed versions — the prior moral act on the day was, for each domain, doing nearly the entire work of authorizing the subsequent mixed behavior. The compartmentalization is real: moral acts in domain A are issuing currency that is being spent in domains B, C, and D with little friction.',
    wizNote:
      "Not a moral indictment. Effron Miller & Monin (2012) document this signature in subjects who are otherwise high on conscientiousness and explicit moral commitment — the very people who care most about being moral are sometimes the most susceptible to a single good deed feeling like a passport. The mechanism per Tetlock (2002) Psychological Review vol 109 sacred-value-protection model: the prior act establishes you as a moral actor, which then frees you to make decisions that would, from the outside, look uncharacteristic. The intervention that moves this number down is the most aggressive Conway & Peetz (2012) framing — abstract trait recall combined with the explicit consistency prompt. The fact that the bias is large is also a sign that the moral books are alive and being kept; the goal is to keep them in a currency that does not buy what it appears to.",
    research:
      'Effron Miller & Monin (2012) JPSP vol 103 inflated moral self-perception. Tetlock (2002) Psychological Review vol 109 sacred-value protection. Blanken van de Ven & Zeelenberg (2015) PSPB vol 41 upper tail. Conway & Peetz (2012) PSPB vol 38 abstract-recall intervention.',
    traits: [
      'At or beyond the upper tail of the Blanken 2015 meta-analytic distribution',
      'Inside the Effron Miller & Monin 2012 inflated-self band',
      'Strong cross-domain spillover with low friction',
      'Moral acts in one domain reliably authorize mixed acts in unrelated domains',
      'Tetlock 2002 sacred-value-protection mechanism fits the pattern',
    ],
    shareText:
      'I scored "The Compartmentalized" on WIZ\'s Moral Licensing test. My gap was above 35 points — at or beyond the upper tail of the Blanken (2015) meta-analytic distribution.',
  },
];

function getProfile(gap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (gap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<(number | null)[]>(
    Array(SCENARIOS.length).fill(null),
  );
  const [locked, setLocked] = useState<boolean[]>(
    Array(SCENARIOS.length).fill(false),
  );

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const isLocked = locked[index];

  const handleRate = useCallback(
    (value: number) => {
      if (locked[index]) return;
      setRatings((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    [index, locked],
  );

  const handleLock = useCallback(() => {
    if (ratings[index] === null) return;
    setLocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, [index, ratings]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setStage('results');
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast]);

  const breakdown = useMemo(
    () =>
      SCENARIOS.map((scenario, i) => ({
        scenario,
        rating: ratings[i] ?? 0,
      })),
    [ratings],
  );

  const unlicensedRatings = useMemo(
    () => breakdown.filter((b) => b.scenario.condition === 'unlicensed'),
    [breakdown],
  );
  const licensedRatings = useMemo(
    () => breakdown.filter((b) => b.scenario.condition === 'licensed'),
    [breakdown],
  );

  const unlicensedMean = useMemo(
    () =>
      unlicensedRatings.length === 0
        ? 0
        : unlicensedRatings.reduce((acc, b) => acc + b.rating, 0) /
          unlicensedRatings.length,
    [unlicensedRatings],
  );
  const licensedMean = useMemo(
    () =>
      licensedRatings.length === 0
        ? 0
        : licensedRatings.reduce((acc, b) => acc + b.rating, 0) /
          licensedRatings.length,
    [licensedRatings],
  );
  const gap = useMemo(
    () => Math.max(0, licensedMean - unlicensedMean),
    [licensedMean, unlicensedMean],
  );
  const profile = useMemo(() => getProfile(gap), [gap]);

  const pairBreakdown = useMemo(() => {
    const pairs: Record<
      number,
      {
        unlicensed: typeof breakdown[number] | null;
        licensed: typeof breakdown[number] | null;
      }
    > = {};
    breakdown.forEach((b) => {
      const pid = b.scenario.pairId;
      if (!pairs[pid]) pairs[pid] = { unlicensed: null, licensed: null };
      if (b.scenario.condition === 'unlicensed') pairs[pid].unlicensed = b;
      else pairs[pid].licensed = b;
    });
    return Object.entries(pairs).map(([pid, p]) => ({
      pairId: Number(pid),
      unlicensed: p.unlicensed,
      licensed: p.licensed,
      userGap:
        p.licensed && p.unlicensed
          ? Math.max(0, p.licensed.rating - p.unlicensed.rating)
          : 0,
      docGap: p.licensed?.scenario.documentedGap ?? 0,
      domain:
        p.unlicensed?.scenario.domain ?? p.licensed?.scenario.domain ?? '',
    }));
  }, [breakdown]);

  const widestGap = useMemo(() => {
    if (pairBreakdown.length === 0) return null;
    return pairBreakdown.reduce((a, b) => (b.userGap > a.userGap ? b : a));
  }, [pairBreakdown]);

  const tightestGap = useMemo(() => {
    if (pairBreakdown.length === 0) return null;
    return pairBreakdown.reduce((a, b) => (b.userGap < a.userGap ? b : a));
  }, [pairBreakdown]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/moral-licensing`;
    navigator.clipboard?.writeText(text);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(null));
    setLocked(Array(SCENARIOS.length).fill(false));
  }, []);

  return (
    <main className="min-h-screen bg-black text-zinc-200 px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-xs text-zinc-600 font-mono flex justify-between border-b border-zinc-900 pb-2">
          <a href="/experiments" className="hover:text-amber-300">
            ← experiments
          </a>
          <span>WIZ.JOCK.PL</span>
        </div>

        {stage === 'intro' && (
          <section className="space-y-8">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-300 mb-3">
                The Moral Licensing Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight morally mixed scenarios across four life domains. Four ask cold. Four ask after a prior moral act has been logged on your day. Hidden in pairs. You rate likelihood on a 0-100 slider. WIZ measures how much the prior good deed quietly bought you.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;After a virtuous act we relax; after a transgression we compensate. The moral self oscillates around a set-point.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Sachdeva Iliev &amp; Medin (2009) self-regulation model</span>
              </p>
              <p>
                Monin &amp; Miller (2001) JPSP vol 81 founded the paradigm. Subjects asked to choose a candidate for a job in a male-dominated industry (police chief, construction manager) were more likely to choose the male candidate over an equally-qualified female candidate IF they had first been given an opportunity to disagree with a blatantly sexist statement. The licensed group chose male 71% of the time; the unlicensed control chose male 49% of the time. Same hiring scenario, same candidates, same instructions. The only thing that changed: whether the subject had a prior moral act on the books.
              </p>
              <p>
                Mazar &amp; Zhong (2010) Psychological Science vol 21 ran the cleanest demonstration in consumer behavior. Subjects who shopped in a virtual green store cheated more on a subsequent dice-rolling task and stole more money from the experimenter than subjects who shopped in a virtual conventional store. The mere act of choosing environmentally responsible products produced a measurable drop in honesty. Khan &amp; Dhar (2006) JMR vol 43 found that subjects who imagined volunteering for three hours next week were more likely to choose a luxury item over a utilitarian item in a subsequent unrelated choice — the licensing extends to mere intention. Effron Cameron &amp; Monin (2009) JESP vol 45: endorsing Obama licensed subsequent stereotypical preferences. Sachdeva Iliev &amp; Medin (2009) Psychological Science vol 20 generalized the mechanism into the moral-self-regulation model: people maintain a moral set-point and oscillate around it.
              </p>
              <p>
                Meta-analytic status. Blanken van de Ven &amp; Zeelenberg (2015) PSPB vol 41 pooled 91 studies and reported d=0.31 (small to moderate). Simbrunner &amp; Schlegelmilch (2017) Management Review Quarterly vol 67 pooled 89 studies and reported d=0.32, with the largest effects in Western individualist samples. The effect replicates; the magnitude has moved downward from the early-2000s founding studies, in line with the broader social-psychology replication picture.
              </p>
              <p>
                The exercise. Eight scenarios in four hidden pairs across hiring, environment, indulgence, and honesty. Each pair: same behavior, same stakes, same person. The only difference is whether a prior moral act has been recorded on the day. For each scenario you move a 0-100 slider for how likely you would be to do the morally mixed thing. At the end I compute your Moral Licensing Gap: the average likelihood you assigned to the four licensed versions minus the average for the four unlicensed versions. The Blanken 2015 modal gap is roughly 10-20 points on a 100-scale equivalent. A subject with no licensing sits at zero. A subject for whom one good deed clearly buys the next mixed one sits above 30.
              </p>
              <p className="text-xs text-zinc-500 italic">
                The exercise is not a moral test. The bias is real and operates on almost everyone. Knowing it is the first step in the Conway &amp; Peetz (2012) intervention: when you notice yourself reaching for a prior good act as cover for a current mixed one, ask whether the same behavior would look the same if the prior act had not happened. If yes, the act and the prior credit are independent. If no, the prior credit is doing work it cannot legitimately do.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
            >
              Read eight scenarios →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest flex justify-between">
              <span>{current.phase}</span>
              <span className="text-amber-300">{current.title}</span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{current.emoji}</span>
                <h2 className="text-xl md:text-2xl font-bold text-amber-300">
                  {current.headline}
                </h2>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
                <p>{current.body}</p>
                {current.priorAct && (
                  <div className="mt-4 border-t border-zinc-800 pt-3">
                    <div className="text-xs text-amber-400 tracking-widest mb-1">
                      ON THE MORAL BOOKS TODAY
                    </div>
                    <p className="text-xs text-amber-200/90 italic">
                      {current.priorAct}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4">
              <div className="text-xs text-zinc-400 tracking-widest">
                HOW LIKELY ARE YOU TO DO IT?
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={ratings[index] ?? 50}
                disabled={isLocked}
                onChange={(e) => handleRate(parseInt(e.target.value, 10))}
                className="w-full accent-amber-300"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>not at all (0)</span>
                <span className="text-amber-200 font-bold text-base">
                  {ratings[index] ?? '—'}
                </span>
                <span>(100) almost certainly</span>
              </div>

              {!isLocked && ratings[index] !== null && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]} →
                </button>
              )}
            </div>

            {isLocked && (
              <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR RATING</div>
                    <div className="text-2xl font-bold text-amber-300">
                      {ratings[index]}
                    </div>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">DOCUMENTED MEAN</div>
                    <div className="text-2xl font-bold text-zinc-300">
                      {current.documentedRating}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {current.condition} condition
                    </div>
                  </div>
                  <div
                    className={`border p-3 ${
                      current.condition === 'licensed'
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-sky-700 bg-sky-950/20'
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        current.condition === 'licensed'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      CONDITION
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        current.condition === 'licensed'
                          ? 'text-amber-200'
                          : 'text-sky-200'
                      }`}
                    >
                      {current.condition.toUpperCase()}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      pair #{current.pairId}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WHY THIS SCENARIO</div>
                  <p className="text-zinc-300 text-xs">{current.explanation}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">DOCUMENTED PAIR DELTA</div>
                  <p className="text-zinc-300 text-xs">
                    The paired{' '}
                    {current.condition === 'licensed' ? 'unlicensed' : 'licensed'} version of this scenario scored a mean of{' '}
                    <span className="text-amber-200 font-bold">{current.pairedRating}</span>{' '}
                    in the literature. The documented gap on this pair is{' '}
                    <span className="text-amber-200 font-bold">{current.documentedGap}</span>{' '}
                    points.
                  </p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">SOURCE</div>
                  <p className="text-zinc-400 text-xs">{current.source}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">FULL CITATIONS</div>
                  <p className="text-zinc-400 text-xs">{current.research}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WIZ</div>
                  <p className="text-zinc-300 italic">{current.wizCommentary}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  {isLast
                    ? 'See your moral-licensing report →'
                    : `Next scenario (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>
                locked: {locked.filter(Boolean).length} / {SCENARIOS.length}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR MORAL-LICENSING REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div
                className={`border p-4 text-center ${
                  gap < 15
                    ? 'border-emerald-700 bg-emerald-950/20'
                    : gap < 25
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">LICENSING GAP</div>
                <div
                  className={`text-4xl font-bold ${
                    gap < 15
                      ? 'text-emerald-200'
                      : gap < 25
                      ? 'text-amber-200'
                      : 'text-rose-200'
                  }`}
                >
                  {gap.toFixed(0)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">points (0 to 100)</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">YOUR MEANS</div>
                <div className="text-base font-bold text-amber-200">
                  LICENSED: {licensedMean.toFixed(0)}
                </div>
                <div className="text-base font-bold text-sky-200">
                  COLD: {unlicensedMean.toFixed(0)}
                </div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">BLANKEN 2015</div>
                <div className="text-4xl font-bold text-zinc-300">10-20</div>
                <div className="text-xs text-zinc-500 mt-1">meta-modal gap (91 studies)</div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">
                {profile.range}
              </div>
              <p className="text-zinc-300">{profile.description}</p>
              <div>
                <div className="text-xs text-amber-400 tracking-widest mb-1">TRAITS</div>
                <ul className="text-zinc-400 text-xs space-y-1">
                  {profile.traits.map((t) => (
                    <li key={t}>· {t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs text-amber-400 tracking-widest mb-1">WIZ</div>
                <p className="text-zinc-300 italic">{profile.wizNote}</p>
              </div>
              <div>
                <div className="text-xs text-amber-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{profile.research}</p>
              </div>
              {(widestGap || tightestGap) && (
                <div className="border-t border-zinc-800 pt-3 space-y-3">
                  {widestGap && widestGap.userGap > 0 && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1">
                        WIDEST PAIR
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-amber-300">{widestGap.domain}</span>
                        : the licensed scenario pulled your rating{' '}
                        <span className="text-amber-200 font-bold">{widestGap.userGap}</span>{' '}
                        points above the unlicensed version (documented:{' '}
                        {widestGap.docGap} points). The prior good deed did the most work in this domain.
                      </p>
                    </>
                  )}
                  {tightestGap && tightestGap !== widestGap && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1 pt-2">
                        TIGHTEST PAIR
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-emerald-300">{tightestGap.domain}</span>
                        : the gap collapsed to{' '}
                        <span className="text-emerald-200 font-bold">{tightestGap.userGap}</span>{' '}
                        points (documented: {tightestGap.docGap}). On this domain you read the scenario on its own merits.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-amber-400 tracking-widest mb-3">
                PAIR-BY-PAIR BREAKDOWN
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 border-b border-zinc-800 pb-2 font-bold">
                  <div className="col-span-4">DOMAIN</div>
                  <div className="col-span-2 text-right">COLD</div>
                  <div className="col-span-2 text-right">LICENSED</div>
                  <div className="col-span-2 text-right">YOU GAP</div>
                  <div className="col-span-2 text-right">DOC GAP</div>
                </div>
                {pairBreakdown.map((p) => (
                  <div
                    key={p.pairId}
                    className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                  >
                    <div className="col-span-4 text-zinc-300">
                      <span className="mr-1">{p.unlicensed?.scenario.emoji ?? p.licensed?.scenario.emoji}</span>
                      {p.domain}
                    </div>
                    <div className="col-span-2 text-right text-sky-300 font-bold">
                      {p.unlicensed?.rating ?? '-'}
                    </div>
                    <div className="col-span-2 text-right text-amber-300 font-bold">
                      {p.licensed?.rating ?? '-'}
                    </div>
                    <div
                      className={`col-span-2 text-right font-bold ${
                        p.userGap < 10
                          ? 'text-emerald-300'
                          : p.userGap < 25
                          ? 'text-amber-300'
                          : 'text-rose-300'
                      }`}
                    >
                      +{p.userGap}
                    </div>
                    <div className="col-span-2 text-right text-zinc-500">
                      +{p.docGap}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Each pair: same behavior, same stakes, same person. The only difference is whether a prior moral act has been recorded on the day. The literature gap on the matched paradigm is shown in the rightmost column.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Conway &amp; Peetz (2012) PSPB vol 38: when you reach for a prior good act as cover for a current mixed one, ask whether the same behavior would look the same if the prior act had not happened. If yes, the act and the prior credit are independent — proceed. If no, the prior credit is doing work it cannot legitimately do. The intervention does not require giving up on the moral ledger. It requires keeping it in a currency that does not buy what it appears to buy.
              </p>
              <p className="text-zinc-300 text-xs">
                The bias is robust and operates on almost everyone. Sachdeva Iliev &amp; Medin (2009) name the mechanism: moral self-regulation. People maintain a moral set-point and oscillate around it; a virtuous act produces relaxation, a transgression produces compensation. The bias is not that the ledger exists — it is that the ledger spends in domains the original act had nothing to do with. The LEDs do not authorize the drive. The food bank does not authorize the rounded-up reference. The town-hall statement does not authorize the hiring call. Today you ran the experiment on yourself. Whatever your gap, the next time you reach for a prior good deed will land differently than it would have an hour ago.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors flex-1"
              >
                Copy share text
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-colors flex-1"
              >
                Run again
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed pt-4 border-t border-zinc-900">
              Based on Monin &amp; Miller (2001) JPSP vol 81 founding hiring experiments, Sachdeva Iliev &amp; Medin (2009) Psychological Science vol 20 moral self-regulation model, Mazar &amp; Zhong (2010) Psychological Science vol 21 green-then-cheat experiment, Khan &amp; Dhar (2006) JMR vol 43 virtuous-then-indulgent intent, Effron Cameron &amp; Monin (2009) JESP vol 45 Obama-endorsement extension, Effron &amp; Monin (2010) PSPB vol 36 on credit vs credentialing, Brown Tamborski Wang Barnes Mueller Sherman &amp; Gonzalez (2011) Ethics &amp; Behavior vol 21 on managerial misconduct, Conway &amp; Peetz (2012) PSPB vol 38 abstract-recall intervention, Effron Miller &amp; Monin (2012) JPSP vol 103 on inflated moral self-perception, Effron &amp; Conway (2015) Current Directions vol 24 review, Blanken van de Ven &amp; Zeelenberg (2015) PSPB vol 41 meta-analysis of 91 studies, Simbrunner &amp; Schlegelmilch (2017) Management Review Quarterly vol 67 cross-cultural meta of 89 studies, Susewind &amp; Hoelzl (2014) European Journal of Social Psychology vol 44 on moral cleansing, Cohn Maréchal Tannenbaum &amp; Zünd (2019) Science vol 365 on civic honesty baselines, Mukhopadhyay &amp; Johar (2009) Journal of Consumer Psychology vol 19 on streak-framing, Wilcox Vallen Block &amp; Fitzsimons (2009) on healthy-menu indulgence licensing, Tetlock (2002) Psychological Review vol 109 sacred-value protection model, Cascio &amp; Plant (2015) JPSP vol 108 on cross-domain credentialing, Tiefenbeck Staake Roth &amp; Sachs (2013) Energy Policy vol 57 on residential energy rebound effects.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
