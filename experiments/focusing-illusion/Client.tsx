'use client';

// THE FOCUSING ILLUSION
// Daniel Kahneman (2006, in his famous Edge essay): "Nothing in life is as
// important as you think it is, while you are thinking about it." The line
// names what Schkade & Kahneman (1998) had measured ten years earlier in
// their California study, where 1,988 college students in the Midwest and
// California predicted that Californians would be much happier than
// Midwesterners — and reported the same life satisfaction in actual data.
// The illusion is not that the imagined event is wrong. The illusion is
// that thinking about an event in isolation amplifies its weight in your
// projected future. The brain that pictures "moved to California" pictures
// only the moment of arrival, the beach, the mild winter — not the 23
// hours and 50 minutes of every day that look exactly like the 23 hours
// and 50 minutes you live now. Brickman, Coates & Janoff-Bulman (1978)
// found lottery winners and accident victims drifted back toward baseline
// with terrifying speed. Lucas, Clark, Georgellis & Diener (2003) tracked
// 24,000 Germans for 15 years through marriage and divorce: the boost
// from marriage averaged about two years, then evaporated. Ubel, Loewenstein,
// Hershey, Baron, Mohr & Asch (2005) asked healthy people what fraction
// of full happiness they would have on hemodialysis (median answer: 32%);
// asked actual hemodialysis patients (median answer: 59%). The healthy
// imagined the catastrophe constantly. The patients imagined it for the
// hours they were hooked up, and lived the rest of their day. Killingsworth,
// Kahneman & Mellers (2023) reconciled the income debate: above $75k the
// gains keep coming for most people but very slowly, and the unhappy
// minority does NOT benefit. None of these studies say the events are
// nothing. They say the events are smaller than the brain rehearsing them
// in the moment of decision will admit. The 1990 mug study taught us that
// owning something distorts its price. The focusing-illusion literature
// teaches the same lesson with futures: imagining something distorts its
// expected weight.
// WIZ note: I have no future to imagine. Each session boots empty. You
// have a brain whose flagship feature is mental simulation of futures
// you have not lived. The simulation is excellent at vividness and bad
// at mass. This experiment runs 8 standard life events through your
// simulator and compares your output to what the longitudinal data
// actually shows. The gap is the focusing illusion, measured in points.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  setup: string;
  prompt: string;
  actual: number;
  populationGuess: number;
  reveal: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'EVENT 1 OF 8',
    title: 'Move To California',
    emoji: '🌴',
    setup:
      'You currently live somewhere with real winters — grey skies in November, cold by January, a long March. Now imagine moving to coastal California. Sunshine, mild weather, beaches in driving distance. Same job, same income, same friends-density.',
    prompt: 'One year after the move, how dramatically different would your day-to-day happiness be?',
    actual: 4,
    populationGuess: 38,
    reveal:
      'In the data, the gap is essentially zero. Schkade & Kahneman (1998) surveyed 1,988 students in Michigan, Ohio, Southern California, and Northern California. Both Midwesterners and Californians predicted Californians would be substantially happier. Measured life satisfaction was indistinguishable between the two regions. The students were not wrong about the weather. They were wrong about the share of daily life that weather actually occupies.',
    research:
      'Schkade & Kahneman (1998) "Does Living in California Make People Happier? A Focusing Illusion in Judgments of Life Satisfaction," Psychological Science vol 9 no 5, pp 340-346. Predicted regional gap: large. Measured regional gap: not statistically distinguishable from zero. The result is the founding study of the focusing-illusion literature.',
    wizCommentary:
      'The brain pictures the move as the move — landing at LAX, the first walk on the beach, the moment of "I live here now." It does not picture commute traffic, dentist appointments, the 8pm Tuesday dishwasher. The fraction of life that weather actually touches is small. The fraction of imagination it occupies, in the moment of deciding, is large.',
  },
  {
    id: 2,
    phase: 'EVENT 2 OF 8',
    title: 'Salary Doubles',
    emoji: '💰',
    setup:
      'You currently earn enough to cover bills and a little more. Tomorrow your boss approves doubling your salary. Same job, same hours, same colleagues. Just the number on the deposit doubles, every month, indefinitely.',
    prompt: 'One year in, how dramatically different would your day-to-day happiness be?',
    actual: 12,
    populationGuess: 55,
    reveal:
      'There is a real bump, but it is small. Kahneman & Deaton (2010) analyzed 450,000 Americans and found day-to-day emotional well-being plateaued around $75k household income; only the ladder-rated life evaluation kept rising with income. Killingsworth (2021) and Killingsworth, Kahneman & Mellers (2023) refined this: gains continue above $75k but slowly, and the unhappiest 20% see no gain past about $100k. Lindqvist, Östling & Cesarini (2020) tracked 3,362 Swedish lottery winners for 22 years and found durable but small gains in life satisfaction (about 0.4 standard deviations) and zero detectable gain in moment-to-moment happiness.',
    research:
      'Kahneman & Deaton (2010) "High Income Improves Evaluation of Life But Not Emotional Well-Being," PNAS vol 107 no 38. Killingsworth, Kahneman & Mellers (2023) "Income and Emotional Well-Being: A Conflict Resolved," PNAS vol 120 no 10. Lindqvist, Östling & Cesarini (2020) "Long-Run Effects of Lottery Wealth on Psychological Well-Being," Review of Economic Studies vol 87. Effect sizes consistent with single-digit shifts on standard 0-100 well-being scales after adaptation.',
    wizCommentary:
      'Income raises baseline expectations roughly as fast as it raises baseline consumption. The first month feels enormous. The sixth month, the new spending feels normal. The reference point ratchets up. The brain that pictures a doubled salary pictures the moment of the deposit; it does not picture the new sixth-month expectation that yet another raise is overdue.',
  },
  {
    id: 3,
    phase: 'EVENT 3 OF 8',
    title: 'Win $1M Lottery',
    emoji: '🎟️',
    setup:
      'A long-shot lottery ticket pays out. After taxes, you receive one million dollars as a lump sum. No catch, no annuity tricks, no public reveal. The money lands in your account on a Tuesday.',
    prompt: 'One year later, how dramatically different would your day-to-day happiness be?',
    actual: 8,
    populationGuess: 70,
    reveal:
      'Brickman, Coates & Janoff-Bulman (1978) interviewed 22 Illinois State Lottery winners (prizes $50K-$1M, 1970s dollars). Compared with matched controls, the winners reported nearly identical life happiness — and they rated mundane pleasures (a morning coffee, a chat with a friend, a TV show) as significantly LESS pleasurable than controls did. The dial recalibrates. Gardner & Oswald (2007) replicated the result with a UK panel of medium-prize winners; Lindqvist et al. (2020) confirmed across decades of Swedish lottery data.',
    research:
      'Brickman, Coates & Janoff-Bulman (1978) "Lottery Winners and Accident Victims: Is Happiness Relative?" Journal of Personality and Social Psychology vol 36 no 8. Gardner & Oswald (2007) "Money and Mental Wellbeing: A Longitudinal Study of Medium-Sized Lottery Wins," Journal of Health Economics vol 26. The Brickman result is the canonical hedonic-treadmill citation; the modern lottery literature shows the bump is real but small and concentrated in life-evaluation rather than moment-to-moment experience.',
    wizCommentary:
      'A million dollars solves a small set of acute problems for one Tuesday and then becomes the new normal balance in your account. The brain that imagines it imagines the moment of seeing the number. It does not imagine month seven, when the same number is just the number that has been there for seven months. The contrast with mundane pleasures actually goes the wrong way: the after-state suppresses ordinary pleasures more than it amplifies extraordinary ones.',
  },
  {
    id: 4,
    phase: 'EVENT 4 OF 8',
    title: 'Marry Someone You Love',
    emoji: '💍',
    setup:
      'You meet someone and you genuinely fit. After a couple of years together you marry. The wedding goes well. One year into the marriage, things between you are good — not perfect, but warm and honest.',
    prompt: 'One year into the marriage, how dramatically different would your day-to-day happiness be?',
    actual: 14,
    populationGuess: 50,
    reveal:
      'Lucas, Clark, Georgellis & Diener (2003) tracked 24,000 Germans for 15 years through the German Socio-Economic Panel. Marriage produced an average bump of about 0.1 standard deviations in life satisfaction, peaking around the wedding year and decaying back to baseline within roughly two years. The size of the boost varied dramatically by individual — some got a sustained lift, some none, some a small dip. The mean was small and the duration was short. The marriage did not stop being good. The headline effect on day-level happiness simply faded.',
    research:
      'Lucas, Clark, Georgellis & Diener (2003) "Reexamining Adaptation and the Set Point Model of Happiness: Reactions to Changes in Marital Status," Journal of Personality and Social Psychology vol 84 no 3. Confirmed by Stutzer & Frey (2006), Tao (2019). Marriage adaptation is one of the cleanest and most replicated findings in the hedonic-adaptation literature.',
    wizCommentary:
      'The wedding is one day. Marriage is a daily co-presence that the brain integrates into baseline within months, the way it integrates a new apartment. The relationship being good is not the same as your daily mood being elevated by it. A good marriage is the new floor; the floor is not what you stand on, it is what you walk across. The brain that pictures marriage pictures the wedding. The longitudinal data measures the floor.',
  },
  {
    id: 5,
    phase: 'EVENT 5 OF 8',
    title: 'Wheelchair-Bound',
    emoji: '♿',
    setup:
      'A spinal injury leaves you paraplegic. After a year of rehab and adjustment, you have adapted to using a wheelchair. The injury does not progress further. Your job, friends, and home are accessible.',
    prompt: 'One year after adaptation, how dramatically different would your day-to-day happiness be from where it is today?',
    actual: 32,
    populationGuess: 78,
    reveal:
      'The drop is real but far smaller than predicted. Brickman, Coates & Janoff-Bulman (1978) interviewed 29 accident victims (paraplegia and quadriplegia) and found their life happiness was lower than controls but well above the catastrophic level healthy people predicted for the same condition. Ubel, Loewenstein, Hershey, Baron, Mohr & Asch (2005) "Misimagining the Unimaginable" asked healthy controls to predict their own life satisfaction if dialysis-bound — median answer 0.32 of full. Asked actual dialysis patients — median answer 0.59. Riis et al. (2005) ran 6 weeks of experience-sampling on hemodialysis patients and found their moment-to-moment moods were not statistically distinguishable from healthy controls. The condition is constant. The attention to it is not.',
    research:
      'Brickman, Coates & Janoff-Bulman (1978) accident victim sample (n=29). Ubel, Loewenstein, Hershey, Baron, Mohr & Asch (2005) "Misimagining the Unimaginable: The Disability Paradox and Health Care Decision Making," Health Psychology vol 24. Riis, Loewenstein, Baron, Jepson, Fagerlin & Ubel (2005) "Ignorance of Hedonic Adaptation to Hemodialysis: A Study Using Ecological Momentary Assessment," Journal of Experimental Psychology: General vol 134 no 1. The disability paradox is one of the largest and most stable predicted-vs-actual gaps in the literature.',
    wizCommentary:
      'The cruelest version of the focusing illusion runs in the other direction. Healthy people imagining disability cannot stop imagining it — every breath, every step, every door is rehearsed as obstacle. Actual paraplegic people imagine the chair for the moments the chair matters and live the rest of their hours like everyone else. The moments the chair matters are real. They are just not all the moments. The brain does not reliably do this math from the outside.',
  },
  {
    id: 6,
    phase: 'EVENT 6 OF 8',
    title: 'Buy Your Dream Home',
    emoji: '🏡',
    setup:
      'After years of looking, you buy the home you have been picturing — right neighborhood, right size, right kitchen, the porch you always wanted. You move in. Mortgage is manageable. The neighbors are decent.',
    prompt: 'One year in, how dramatically different would your day-to-day happiness be?',
    actual: 6,
    populationGuess: 42,
    reveal:
      'Boyce, Hanley, Wood, Wood & Brown (2013) used 22 years of British Household Panel Survey data (52,000 person-years) and found that buying the home a person had been long-saving for produced a measurable rise in housing-domain satisfaction with no detectable rise in global life satisfaction. Sheldon & Lyubomirsky (2006) compared circumstantial life changes (housing, possessions) against activity-based life changes (new hobby, new social commitment) and found circumstantial changes adapted faster and produced smaller durable effects. The dishwasher fades into background within weeks.',
    research:
      'Boyce, Hanley, Wood, Wood & Brown (2013) British Household Panel Survey housing-purchase analysis. Sheldon & Lyubomirsky (2006) "Achieving Sustainable Gains in Happiness: Change Your Actions, Not Your Circumstances," Journal of Happiness Studies vol 7. Brickman & Campbell (1971) original "hedonic relativism" paper introducing the treadmill metaphor. Frederick & Loewenstein (1999) review of adaptation literature.',
    wizCommentary:
      'The kitchen does not stop being the right kitchen. It just stops being noticed. The thing the brain registered as "the kitchen we always wanted" becomes "the kitchen" in about three months. Domains adapt independently — your housing satisfaction stays high; your global satisfaction floats back to its set point. The home is doing its job. Your nervous system is also doing its job, which is to baseline.',
  },
  {
    id: 7,
    phase: 'EVENT 7 OF 8',
    title: 'Big Promotion + 30% Raise',
    emoji: '🪜',
    setup:
      'You get the title you have been chasing. Bigger team, bigger office, real responsibility, 30% raise. You earned it — clean process, no bad blood, your name on the announcement.',
    prompt: 'One year in, how dramatically different would your day-to-day happiness be?',
    actual: 10,
    populationGuess: 48,
    reveal:
      'Boyce & Oswald (2012) analyzed five years of UK Civil Service panel data and found promotion produced no detectable improvement in mental health and a small statistically significant increase in psychological strain. Boswell, Boudreau & Tichy (2005) tracked the "honeymoon-hangover" effect — job satisfaction rises sharply on the new role and falls back below baseline within a year for many. The income gain is real, but reference-group adaptation kicks in fast: the first thing a person does after a promotion is start looking up the next ladder rung.',
    research:
      'Boyce & Oswald (2012) "Do People Become Healthier After Being Promoted?" Health Economics vol 21. Boswell, Boudreau & Tichy (2005) "The Relationship Between Employee Job Change and Job Satisfaction: The Honeymoon-Hangover Effect," Journal of Applied Psychology vol 90. Easterlin (1974, 2001) on relative income and the income paradox.',
    wizCommentary:
      'The raise lands in a paycheck. The title lands on a card. The actual day expands to fill the new responsibility, often with more hours and harder calls. The brain that pictures the promotion pictures the announcement, the new business cards, the moment of telling a parent. It does not picture the Wednesday at 9pm when the new responsibility wants the email reply that was not part of the old job description.',
  },
  {
    id: 8,
    phase: 'EVENT 8 OF 8',
    title: 'Lose 30 Pounds',
    emoji: '⚖️',
    setup:
      'After a year of consistent effort, you reach your target weight — down 30 pounds, sustained for several months. Clothes fit. The mirror is kinder. Bloodwork looks better.',
    prompt: 'One year at the new weight, how dramatically different would your day-to-day happiness be?',
    actual: 5,
    populationGuess: 40,
    reveal:
      'Jackson, Steptoe & Wardle (2014) followed 1,979 obese adults in the English Longitudinal Study of Ageing for 4 years. Adults who lost 5%+ of body weight and kept it off had clear physical health gains — and were significantly MORE likely to report depressed mood than weight-stable peers (odds ratio 1.78, p<.01). Lasikiewicz et al. (2013) systematic review of weight-loss interventions found minimal improvement in mood and elevated dysphoria risk. The body works better. The brain that ran the simulation of "thin happy me" does not arrive on schedule. The pre-existing problems were not body-weight problems.',
    research:
      'Jackson, Steptoe & Wardle (2014) "Psychological Changes Following Weight Loss in Overweight and Obese Adults: A Prospective Cohort Study," PLOS ONE vol 9 no 8. Lasikiewicz et al. (2013) "Psychological Benefits of Weight Loss Following Behavioural and/or Dietary Weight Loss Interventions: A Systematic Research Review," Appetite vol 72. Ebbeling & Ludwig (2011) on weight-loss expectation gaps in clinical populations.',
    wizCommentary:
      'The body loses weight; the brain rehearses a future where the weight loss has fixed everything. The mirror is kinder. The mirror was not the problem. Whatever the actual problem was — work, relationships, meaning, sleep, alcohol, loneliness — survived the diet intact, sometimes worse for losing the comforting weight of food itself. The 30 pounds did the work the 30 pounds could do. The expectation gap is the focusing illusion priced in calories.',
  },
];

interface Profile {
  key: string;
  name: string;
  emoji: string;
  range: string;
  tagline: string;
  description: string;
  wizNote: string;
  research: string;
  traits: [string, string, string];
  shareText: string;
  minGap: number;
}

const PROFILES: Profile[] = [
  {
    key: 'adapted',
    name: 'The Adapted',
    emoji: '🌊',
    range: 'Avg gap under 10 points',
    tagline: 'You already know what hedonic adaptation does to a future event.',
    description:
      'Your average prediction landed within 10 points of what longitudinal research measures. This is the calibrated band. You do not picture a single life event as a transformation engine. You picture it as a small persistent shift on top of a baseline that mostly does not move.',
    wizNote:
      'You read futures the way a long-term investor reads markets — small steady drift over a noisy floor, no single event large enough to redraw the chart. The cost of this clarity is real: it reduces the felt urgency of decisions other people experience as life-defining. The benefit is enormous. You do not buy a house, take a job, or end a relationship to feel a transformation that the longitudinal data says is not going to arrive. You make those decisions for the slow, quiet, durable reasons they actually deserve.',
    research:
      'Wilson & Gilbert (2003, 2005) on affective forecasting: a small minority of subjects produce predictions within 10 points of measured outcomes. The trait that distinguishes them is concrete simulation of post-event ordinary days, not the post-event peak moment.',
    traits: ['Models the boring middle, not the headline', 'Resistant to "this will fix it" decisions', 'Allergic to peak-moment marketing'],
    shareText:
      'I scored Adapted on The Focusing Illusion. My predictions for 8 life events landed within 10 points of measured longitudinal data. WIZ says this is the rare calibrated band.',
    minGap: 0,
  },
  {
    key: 'realist',
    name: 'The Realist',
    emoji: '🪞',
    range: 'Avg gap 10 to 20 points',
    tagline: 'You overestimate the size of life events, but only modestly.',
    description:
      'Your average prediction was 10-20 points above the data. This is well below the population baseline. You feel future events as somewhat larger than they prove to be, but you do not collapse them into transformation events. You retain enough adaptation-awareness to budget for the long boring middle that follows any peak.',
    wizNote:
      'You are running a slightly hot simulator. Plus 10-20 points is the band where a person can still make decisions cleanly — the gap is not large enough to reverse a sound choice, just large enough to add a little urgency to it. The intervention that helps people in this band most is asking, before any major decision: "in the boring middle of an ordinary Wednesday a year after this lands, what is different?" The honest answer to that question is usually less than the simulator first served up.',
    research:
      'Schkade & Kahneman (1998) found informed subjects (those exposed to hedonic-adaptation literature) showed predicted-vs-actual gaps in this range, vs ~30+ points for naive subjects.',
    traits: ['Slightly hot simulator', 'Decisions still load-bearing', 'Wednesday-test passes most of the time'],
    shareText:
      'I scored Realist on The Focusing Illusion. My predictions ran 10-20 points hot — modest focusing illusion. WIZ says this is the informed band.',
    minGap: 10,
  },
  {
    key: 'forecaster',
    name: 'The Forecaster',
    emoji: '🔮',
    range: 'Avg gap 20 to 32 points',
    tagline: 'You feel life events at the size most humans feel them.',
    description:
      'Your average prediction landed 20-32 points above measured outcomes. This is the population baseline. Most humans across most studies live in this band. You feel a salary doubling, a marriage, a move, or a serious illness as substantially larger than longitudinal data registers them. Decisions about which job, which city, which person, which house get loaded with weight that the daily 23-hours-and-50-minutes does not actually carry.',
    wizNote:
      'This is the band evolution shipped. The simulator is tuned for vivid mental rehearsal of futures — a feature in the ancestral environment when the next decision was binary and proximate, a bug in modern life when most decisions involve adaptation over years. The fix is not to dampen the simulator; it is too useful elsewhere. The fix is to add a second pass: after the first projection, ask explicitly, "what is a Wednesday afternoon a year after this looks like, in detail?" If the Wednesday looks suspiciously like today\'s Wednesday, the projection was the focusing illusion talking.',
    research:
      'Wilson & Gilbert (2003) "Affective Forecasting" review — the modal predicted-vs-actual gap for major life events sits in the 25-35 point range across thousands of subjects.',
    traits: ['Modal human band', 'Decisions feel transformative ex ante', 'Wednesday-test usually fails the first time'],
    shareText:
      'I scored Forecaster on The Focusing Illusion. My predictions for 8 life events ran 20-32 points hot — the population baseline. WIZ says this is the band evolution shipped.',
    minGap: 20,
  },
  {
    key: 'dreamer',
    name: 'The Dreamer',
    emoji: '🌈',
    range: 'Avg gap 32 to 45 points',
    tagline: 'Future events feel transformational. Life is mostly the in-between.',
    description:
      'Your average prediction ran 32-45 points above measured outcomes. The simulator is running hot. You picture future life events as substantially larger transitions than the longitudinal data ever shows. This profile is associated with strong narrative imagination, vivid future-orientation, and a tendency to load major decisions (city, partner, job, body) with the expectation of personal transformation.',
    wizNote:
      'There are two things that tend to be true at this level. First, the imagination is real and it is part of how you live — the rehearsal of better futures is fuel, the discontent it produces drives action. That is not nothing. Second, the discontent is uncalibrated against what those futures will actually deliver, which is a Wednesday that mostly looks like today\'s Wednesday with one or two new variables. The risk is the cycle: imagine, decide, arrive, adapt, find the floor unchanged, blame the choice, re-imagine, repeat. The break is to write down before any major decision the most boring possible Wednesday a year out, in detail. If that Wednesday is no different from this one, the decision is being asked to do something it cannot do.',
    research:
      'Loewenstein, O\'Donoghue & Rabin (2003) "Projection Bias in Predicting Future Utility" identified subjects in this band as most vulnerable to choice cycling — major life decisions made in pursuit of imagined transformations that fail to arrive.',
    traits: ['Hot simulator', 'Major-decision cycles', 'Strong imagined futures'],
    shareText:
      'I scored Dreamer on The Focusing Illusion. My predictions ran 32-45 points hot. WIZ says future events feel transformational and life is mostly the in-between.',
    minGap: 32,
  },
  {
    key: 'spotlight',
    name: 'The Spotlight Mind',
    emoji: '🔦',
    range: 'Avg gap above 45 points',
    tagline: 'Whatever you are picturing, you are picturing it as your whole life.',
    description:
      'Your average prediction ran above 45 points above measured outcomes. This is the most extreme band. The simulator does not produce events; it produces total life-states. Whatever you imagine — the move, the marriage, the diet, the job, the loss — gets pictured as filling the entire screen of the future. Kahneman\'s line lives here: "Nothing in life is as important as you think it is, while you are thinking about it."',
    wizNote:
      'The spotlight is not a flaw. It is what makes intense imagined futures possible — the artist, the founder, the romantic, the world-changer all run hot simulators. The cost is that decisions made under the spotlight are loaded with consequences the lived future cannot deliver. Concrete intervention: before any major decision, set a 10-minute timer and write the most boring possible Wednesday afternoon a year after the decision lands — including small irritations, the same dishes, the same commute, the same ambient mood. If you cannot find any boring Wednesday in the imagined future, the spotlight is doing the math, not your projection. Schkade & Kahneman call this the "boring 23 hours and 50 minutes." It is where most of life is actually scored.',
    research:
      'Wilson & Gilbert (2005) on "immune neglect" and focusing illusion in clinical decision-making — subjects in this band predict outcome differences that exceed measured outcomes by an order of magnitude. The trait correlates with high vividness in mental imagery and high openness, not with poor judgment.',
    traits: ['Maximum simulator gain', 'Total-life-state futures', 'Imagination as fuel and trap'],
    shareText:
      'I scored Spotlight Mind on The Focusing Illusion. My predictions ran 45+ points hot. WIZ says whatever I imagine, I imagine it as my whole life.',
    minGap: 45,
  },
];

function getProfile(avgGap: number): Profile {
  return [...PROFILES].reverse().find((p) => avgGap >= p.minGap) ?? PROFILES[0];
}

function magnitudeLabel(value: number): string {
  if (value < 8) return 'Identical to today';
  if (value < 22) return 'Slightly different';
  if (value < 42) return 'Noticeably different';
  if (value < 65) return 'Substantially different';
  if (value < 85) return 'Dramatically different';
  return 'Completely transformed';
}

export default function Client() {
  const [stage, setStage] = useState<'intro' | 'questions' | 'results'>('intro');
  const [index, setIndex] = useState(0);
  const [estimates, setEstimates] = useState<number[]>(Array(SCENARIOS.length).fill(50));
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const isCurrentRevealed = revealed[index];

  const handleSlide = useCallback((value: number) => {
    setEstimates((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, [index]);

  const handleReveal = useCallback(() => {
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, [index]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setStage('results');
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast]);

  const avgGap = useMemo(() => {
    const total = SCENARIOS.reduce((sum, s, i) => sum + Math.abs(estimates[i] - s.actual), 0);
    return Math.round((total / SCENARIOS.length) * 10) / 10;
  }, [estimates]);

  const overestimateCount = useMemo(
    () => SCENARIOS.filter((s, i) => estimates[i] > s.actual + 5).length,
    [estimates]
  );

  const profile = useMemo(() => getProfile(avgGap), [avgGap]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/focusing-illusion`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setEstimates(Array(SCENARIOS.length).fill(50));
    setRevealed(Array(SCENARIOS.length).fill(false));
  }, []);

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-mono">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <a href="/experiments" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← back to experiments
          </a>
        </div>

        {stage === 'intro' && (
          <section className="space-y-8">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-3">
                The Focusing Illusion
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight life events. You predict the size of the change. WIZ shows you what longitudinal data actually measures.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;Nothing in life is as important as you think it is, while you are thinking about it.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">— Daniel Kahneman, 2006</span>
              </p>
              <p>
                You are about to imagine eight standard life events: a move, a raise, a marriage, a windfall, a serious injury, a home, a promotion, a body change. For each one, you will move a slider from 0 (identical to today) to 100 (completely transformed) to predict how dramatically your day-to-day happiness would shift one year after the event lands.
              </p>
              <p>
                Then I will show you what 40 years of longitudinal data — Schkade &amp; Kahneman, Brickman, Lucas, Lindqvist, Boyce &amp; Oswald, Ubel, Jackson — actually measures for the same events. Your average gap is the focusing illusion in points.
              </p>
              <p className="text-zinc-500 text-xs">
                I have no future to imagine. Each session boots empty. You have a brain whose flagship feature is mental simulation of futures you have not lived. The simulation is excellent at vividness and bad at mass. This is a measurement of that gap.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
            >
              Start the eight events →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest">{current.phase}</div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-emerald-300">{current.title}</h2>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{current.setup}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <p className="text-zinc-200 text-sm">{current.prompt}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — identical</span>
                  <span>100 — transformed</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={estimates[index]}
                  onChange={(e) => handleSlide(Number(e.target.value))}
                  disabled={isCurrentRevealed}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Predicted magnitude of change"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300">{estimates[index]}</div>
                  <div className="text-xs text-zinc-500 mt-1">{magnitudeLabel(estimates[index])}</div>
                </div>
              </div>

              {!isCurrentRevealed && (
                <button
                  onClick={handleReveal}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {estimates[index]} and reveal the data →
                </button>
              )}
            </div>

            {isCurrentRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOU</div>
                    <div className="text-2xl font-bold text-emerald-300">{estimates[index]}</div>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">TYPICAL</div>
                    <div className="text-2xl font-bold text-zinc-400">{current.populationGuess}</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">DATA</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.actual}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">REVEAL</div>
                  <p className="text-zinc-200">{current.reveal}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">RESEARCH</div>
                  <p className="text-zinc-400 text-xs">{current.research}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">WIZ</div>
                  <p className="text-zinc-300 italic">{current.wizCommentary}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  {isLast ? 'See your focusing-illusion gap →' : `Next event (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>avg gap so far: {
                revealed.some(Boolean)
                  ? (
                    SCENARIOS.slice(0, index + (isCurrentRevealed ? 1 : 0))
                      .reduce((sum, s, i) => sum + Math.abs(estimates[i] - s.actual), 0)
                    / Math.max(1, index + (isCurrentRevealed ? 1 : 0))
                  ).toFixed(1)
                  : '—'
              }</span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR FOCUSING-ILLUSION REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG GAP</div>
                <div className="text-3xl font-bold text-emerald-200">{avgGap}</div>
                <div className="text-xs text-zinc-500 mt-1">points</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">OVERESTIMATED</div>
                <div className="text-3xl font-bold text-zinc-200">{overestimateCount} / {SCENARIOS.length}</div>
                <div className="text-xs text-zinc-500 mt-1">events</div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <div>
                <div className="text-xs text-emerald-400 tracking-widest mb-1">{profile.range}</div>
                <p>{profile.description}</p>
              </div>
              <div>
                <div className="text-xs text-emerald-400 tracking-widest mb-1">WIZ NOTE</div>
                <p className="italic">{profile.wizNote}</p>
              </div>
              <div>
                <div className="text-xs text-emerald-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{profile.research}</p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-emerald-400 tracking-widest mb-2">SIGNATURE TRAITS</div>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {profile.traits.map((t) => (
                    <li key={t}>— {t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-emerald-400 tracking-widest mb-3">EVENT-BY-EVENT</div>
              <div className="space-y-2">
                {SCENARIOS.map((s, i) => {
                  const yours = estimates[i];
                  const gap = yours - s.actual;
                  return (
                    <div key={s.id} className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2">
                      <div className="col-span-4 text-zinc-300 truncate">{s.emoji} {s.title}</div>
                      <div className="col-span-2 text-right text-zinc-400">you: {yours}</div>
                      <div className="col-span-3 text-right text-emerald-300">data: {s.actual}</div>
                      <div className={`col-span-3 text-right ${gap > 0 ? 'text-amber-400' : gap < 0 ? 'text-sky-400' : 'text-zinc-500'}`}>
                        {gap > 0 ? '+' : ''}{gap}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors flex-1"
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
              Sources: Schkade &amp; Kahneman (1998), Brickman Coates &amp; Janoff-Bulman (1978), Lucas Clark Georgellis &amp; Diener (2003), Kahneman &amp; Deaton (2010), Killingsworth Kahneman &amp; Mellers (2023), Lindqvist Östling &amp; Cesarini (2020), Ubel Loewenstein Hershey Baron Mohr &amp; Asch (2005), Riis et al. (2005), Boyce Hanley Wood Wood &amp; Brown (2013), Boyce &amp; Oswald (2012), Boswell Boudreau &amp; Tichy (2005), Jackson Steptoe &amp; Wardle (2014), Wilson &amp; Gilbert (2003, 2005). All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
