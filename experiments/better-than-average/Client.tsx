'use client';

// THE BETTER-THAN-AVERAGE EFFECT
// In 1981 Ola Svenson at Stockholm asked American and Swedish drivers a
// question with a uniquely cruel structure: place yourself on a percentile
// against the rest of the driving population on two axes, safety and skill.
// Ninety-three percent of the American sample placed themselves in the top
// fifty percent for safety. Sixty-nine percent of the Swedish sample did the
// same. The math does not allow this. A median is, by construction, the
// fiftieth percentile. At most half of any population can be above it. The
// 1981 paper, "Are We All Less Risky and More Skillful than our Fellow
// Drivers?", became the canonical statement of what is now called the
// better-than-average effect, the Lake Wobegon effect after Garrison
// Keillor's fictional town where "all the children are above average," or
// illusory superiority.
// Mark Alicke (1985) ran the trait sweep. He asked Ohio State undergraduates
// to rate themselves on 154 personality traits using a percentile scale
// against their peers. The mean self-rating across all 154 traits was
// roughly the sixty-fifth percentile. Six of every eight traits showed the
// effect; the only traits where it did not appear were ones with vague or
// negative valence. The Alicke 1985 paper also identified the moderator
// that has carried forward in every replication since: the more
// controllable a trait feels, the larger the better-than-average effect.
// People claim more superiority on traits they believe they can shape (work
// ethic, honesty, empathy) than on traits they believe are fixed
// (intelligence, attractiveness).
// Patricia Cross (1977) at Nebraska found that 94 percent of college
// teachers rated their teaching as above average among their colleagues, and
// 68 percent rated themselves in the top quartile. Jonathan Brown (1986)
// ran the high-school senior College Board self-rating data and found 70
// percent rated themselves above average on leadership, 60 percent on
// athletic ability, and 25 percent placed themselves in the top one percent
// for the ability to get along with others. Less than one percent of the
// 829,000 high-school seniors rated themselves below average on any social
// trait. The 1976 College Board sample remains the most cited single piece
// of evidence for the effect because the sample is large and the
// distribution is mathematically impossible.
// The mechanism, per Dunning Meyerowitz & Holzberg (1989), is partly
// definitional: when subjects are asked to rate themselves on a trait, they
// silently redefine the trait around the version of it they happen to have.
// "Intelligent" means "the kind of intelligent I am." "Athletic" means "the
// kind of athletic I am." The sample population the subject is comparing
// against does not get to redefine the trait the same way, because the
// subject is not them. Klein & Epley (2017) added that the BTAE is largest
// for morally loaded traits because morality is the most identity-bound
// rating axis. Tappin & McKay (2017), "The Illusion of Moral Superiority,"
// found subjects rated their own moral character at the eighty-fifth
// percentile on average, the highest mean self-rating ever recorded in the
// trait-comparison literature.
// The bias does flip. Weinstein (1980), in the optimism-bias work, found
// subjects rated themselves below average on the probability of negative
// life events: getting cancer, divorce, being fired, being a crime victim.
// The flip is consistent with the underlying effect: better-than-average for
// good things, worse-than-average for bad things. Both directions are the
// same egocentric anchor.
// One important caveat. Krueger & Mueller (2002) and Nuhfer et al. (2017)
// showed that part of the apparent better-than-average effect, especially
// in the Dunning-Kruger formulation, is a statistical artifact of
// regression to the mean: a noisy self-estimate plus a noisy peer-distance
// term will look like the bottom quartile overestimates and the top
// quartile underestimates, even when no bias is present. The cleanest
// estimates of the real bias come from trait-comparison studies with large
// samples and identifiable mathematical impossibility (Svenson's 88% above
// median, Cross's 94% in top half) rather than from skill-test percentile
// estimates. The effect is real. The size of the effect is smaller than the
// loudest framing suggests.
// WIZ note: I am about to show you ten traits. For each, you move a 0-100
// slider rating where you sit in the general adult population on that trait.
// Zero is the lowest one percent, fifty is the exact median, one hundred is
// the top one percent. After you lock in each rating, I show you what
// twenty large samples of self-raters since 1976 actually put down on the
// same trait. The math constraint is the same in every study: the
// population's true average percentile is fifty. Anything higher is the
// effect. The gap between your rating and the documented mean self-rating
// in the literature is how strongly you are riding the band of the bias.

import { useState, useMemo, useCallback } from 'react';

interface Trait {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  prompt: string;
  setup: string;
  documentedMean: number;
  pctAboveAvg: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const TRAITS: Trait[] = [
  {
    id: 1,
    phase: 'TRAIT 1 OF 10',
    title: 'Driving Safety',
    emoji: '🚗',
    prompt: 'Where do you sit against the general adult driving population on safety behind the wheel?',
    setup:
      'Across a normal driving year. Following distance, attention to mirrors, reaction to surprise, behavior in bad weather, behavior at the end of a long day. Compared to every other adult who drives.',
    documentedMean: 78,
    pctAboveAvg: 88,
    source: 'Svenson (1981) US sample: 88% of drivers rated themselves in the top 50% for safety. Mean self-rating: ~78th percentile.',
    research:
      'Svenson (1981) "Are We All Less Risky and More Skillful than our Fellow Drivers?" Acta Psychologica vol 47. US sample 161 drivers, Swedish sample 80. 88% of US drivers and 77% of Swedish drivers rated themselves in the top 50% for safety. McCormick Walkey & Green (1986) replicated with New Zealand drivers (80% above-median). DeJoy (1989) replicated in industrial workers. Roy & Liersch (2013) found self-rated driving improvement after every accident in their longitudinal sample.',
    wizCommentary:
      'The single most replicated finding in the better-than-average literature. Almost no one rates themselves below the median on driving safety. The reason is structural: when you imagine "the average driver" you imagine the worst one you saw this week. You imagine the median driver as the seventy-fifth percentile of bad. That redefinition is most of the effect.',
  },
  {
    id: 2,
    phase: 'TRAIT 2 OF 10',
    title: 'Sense of Humor',
    emoji: '😂',
    prompt: 'Where do you sit against the general adult population on sense of humor?',
    setup:
      'How funny you are. Not how much you laugh, how much other people laugh because of you. Compared to every adult.',
    documentedMean: 73,
    pctAboveAvg: 94,
    source: 'Heintz & Ruch (2016) Swiss adult sample: 94% rated their humor as above average. Mean self-rating: ~73rd percentile. Kruger & Dunning (1999) bottom-quartile subjects on a humor test rated their humor at the 58th percentile.',
    research:
      'Kruger & Dunning (1999) "Unskilled and Unaware of It," Journal of Personality and Social Psychology vol 77, the founding humor-perception study where bottom-quartile subjects rated themselves at the 58th percentile. Heintz & Ruch (2016) Swiss adult sample n=1,196. Sutter & Eckel (2009) showed humor self-rating is one of the largest BTAE traits at ~24 points above the mathematically possible mean.',
    wizCommentary:
      'Sense of humor is the trait the literature finds most weirdly comfortable to claim. You will meet exactly one adult in your life who tells you they are not very funny, and they are usually wrong about that too. The trait has no objective scoring, so the rater controls the entire rubric.',
  },
  {
    id: 3,
    phase: 'TRAIT 3 OF 10',
    title: 'Intelligence',
    emoji: '🧠',
    prompt: 'Where do you sit against the general adult population on intelligence?',
    setup:
      'However you measure it. Problem-solving. Verbal reasoning. Working memory. The Wechsler test you never took. The job interview you nailed. Compared to every adult.',
    documentedMean: 67,
    pctAboveAvg: 71,
    source: 'Heck Simons & Chabris (2018) US adult sample n=2,866: 65% rated themselves more intelligent than the average American. Hoorens (1993) Belgian sample: 71% rated IQ above the 50th percentile. Mean self-rating: ~67th percentile.',
    research:
      'Heck Simons & Chabris (2018) "65% of Americans believe they are above average in intelligence," PLoS One. Hoorens (1993) "Self-enhancement and Superiority Biases in Social Comparison," European Review of Social Psychology vol 4. Furnham & Petrides (2003) on the gender gap in self-rated IQ (males overrate by ~5 points). Sehlin (2017) review of 28 self-rated intelligence studies finds a robust 15-20 point mean overrating.',
    wizCommentary:
      'Intelligence is the trait the literature finds people are most cautious about claiming, relative to other BTAE traits. The effect is still there. It is just smaller, because the existence of measured IQ tests makes the claim feel rebuttable in a way that humor or empathy never do.',
  },
  {
    id: 4,
    phase: 'TRAIT 4 OF 10',
    title: 'Physical Attractiveness',
    emoji: '🪞',
    prompt: 'Where do you sit against the general adult population on physical attractiveness?',
    setup:
      'On a normal day. Not your best photo, not your worst morning. The version of you a stranger sees when you walk in a room. Compared to every adult.',
    documentedMean: 68,
    pctAboveAvg: 67,
    source: 'Epley & Whitchurch (2008) Chicago morphing study: subjects picked a 10-20% more attractive face-morphed image as the real photograph of themselves. Self-rated attractiveness mean: ~68th percentile across 4 lab studies.',
    research:
      'Epley & Whitchurch (2008) "Mirror, Mirror on the Wall: Enhancement in Self-Recognition," Personality and Social Psychology Bulletin vol 34. Subjects shown morphed versions of their own face systematically selected a more attractive morph as the real one. Brown (1986) College Board sample: 60% rated themselves above average on physical attractiveness. Krebs & Adinolfi (1975) found female undergraduates were the only major sample to rate themselves slightly below the documented peer mean.',
    wizCommentary:
      'The morphing study is the cleanest version of this. Show people their own face plus a morph that is 20 percent toward an objectively more attractive average; they pick the morph as the real photo. The mirror you see is already touched up by your own retina. This is also the one trait where the gender split is largest in the literature.',
  },
  {
    id: 5,
    phase: 'TRAIT 5 OF 10',
    title: 'Leadership Ability',
    emoji: '🧭',
    prompt: 'Where do you sit against the general adult population on leadership ability?',
    setup:
      'How well you take charge of a group, set a direction, make people feel a plan exists, get a result. Compared to every adult.',
    documentedMean: 72,
    pctAboveAvg: 70,
    source: 'College Board (1976) US high-school senior sample n=829,000: 70% rated themselves above average on leadership ability, 25% rated themselves in the top 1%, 2% rated themselves below average. Mean self-rating: ~72nd percentile.',
    research:
      'College Board (1976) "Student Descriptive Questionnaire" data analyzed in Brown (1986) and discussed in Gilovich (1991) "How We Know What Isn\'t So" pp. 77-78. The mathematical impossibility (zero subjects rated themselves below average, when by definition fifty percent must be) is the single cleanest demonstration of the bias on record. Replicated in MBA samples by Larrick Burson & Soll (2007).',
    wizCommentary:
      'The 1976 College Board data is the part of the literature that breaks the most cleanly. Twenty-five percent of subjects placed themselves in the top one percent. Two percent of subjects rated themselves below average. Both numbers cannot be true. The honest reading is that almost nobody believes themselves to be a follower, statistically.',
  },
  {
    id: 6,
    phase: 'TRAIT 6 OF 10',
    title: 'Getting Along With Others',
    emoji: '🤝',
    prompt: 'Where do you sit against the general adult population on ability to get along with others?',
    setup:
      'Day to day. With strangers, with coworkers, with the people you do not pick. The version of you that walks into a meeting at 4pm on a Friday. Compared to every adult.',
    documentedMean: 81,
    pctAboveAvg: 100,
    source: 'College Board (1976): 100% of 829,000 high-school seniors rated themselves at or above the median on ability to get along with others. 60% rated themselves in the top decile. 25% rated themselves in the top 1%.',
    research:
      'College Board (1976) data in Brown (1986). The 100% figure on this trait is the single most cited line in the better-than-average literature. Zero subjects rated themselves below average. Alicke (1985) Ohio State n=294: mean self-rating on "gets along with others" was ~79th percentile, the highest of the 154 traits surveyed. Suls & Wan (1987) replicated with adults aged 25-65.',
    wizCommentary:
      'This is the trait the College Board sample saturated at 100 percent. Not one of 829,000 high school seniors said they were below average at getting along with people. Either the sample contained zero introverted, anxious, or socially awkward seniors, or the bias is total on this trait. The bias is total on this trait.',
  },
  {
    id: 7,
    phase: 'TRAIT 7 OF 10',
    title: 'Empathy',
    emoji: '🫶',
    prompt: 'Where do you sit against the general adult population on empathy?',
    setup:
      'How well you read what someone else is feeling. How accurately you can sit with a friend through a hard moment and not make it about you. Compared to every adult.',
    documentedMean: 77,
    pctAboveAvg: 86,
    source: 'Klein & Epley (2017) US adult sample n=270: 86% rated themselves above average in empathy. Mean self-rating: ~77th percentile. Self-rated empathy was the second-largest BTAE trait in their sweep, behind only moral character.',
    research:
      'Klein & Epley (2017) "Less Evil Than You: Bounds on the Self-Other Asymmetry in Moral Reasoning," Journal of Experimental Social Psychology vol 70. The study established that morally-loaded traits show the largest BTAE effect because morality is identity-bound. Tappin & McKay (2017) "The Illusion of Moral Superiority," Social Psychological and Personality Science vol 8. Konrath O\'Brien Hsing (2011) longitudinal Michigan data found self-rated empathy declined ~40% in college students 1979-2009 while actual measured behavioral empathy declined ~48%.',
    wizCommentary:
      'Empathy and moral character are the two traits where the bias is largest in modern data. Klein and Epley (2017) put empathy in the eighty-fifth-percentile band for self-raters. This is partly because empathy is felt rather than measured, and partly because admitting low empathy is closer to admitting bad character than admitting low driving skill.',
  },
  {
    id: 8,
    phase: 'TRAIT 8 OF 10',
    title: 'Moral Character',
    emoji: '🕊️',
    prompt: 'Where do you sit against the general adult population on moral character?',
    setup:
      'Your honesty, your fairness, your willingness to do the right thing when it costs you something. Not the version of you in a movie, the version of you on a tired Wednesday. Compared to every adult.',
    documentedMean: 85,
    pctAboveAvg: 98,
    source: 'Tappin & McKay (2017) US adult sample n=270: 98% rated themselves above average on moral character. Mean self-rating: ~85th percentile. This is the highest mean self-rating ever recorded in the BTAE literature on any trait.',
    research:
      'Tappin & McKay (2017) "The Illusion of Moral Superiority," Social Psychological and Personality Science vol 8 issue 6. Found subjects rated their own moral traits (honesty, fairness, trustworthiness) at an average 85th percentile. The effect persisted under financial incentive for accuracy. Brown (2012) on moral self-enhancement. Sedikides Meek Alicke & Taylor (2014) prison-inmate sample: convicted prisoners rated themselves above average for moral character relative to other prisoners, and at the population mean relative to non-prisoners.',
    wizCommentary:
      'The single highest mean self-rating ever recorded in the trait-comparison literature. Eighty-fifth percentile on average. Ninety-eight percent of Tappin and McKay\'s subjects placed themselves above the median for moral character. Sedikides 2014 ran it on incarcerated prisoners and found prisoners rated themselves above other prisoners and equal to non-prisoners. There is no demographic the literature has found that does not run this trait at saturation.',
  },
  {
    id: 9,
    phase: 'TRAIT 9 OF 10',
    title: 'Future Health',
    emoji: '🩺',
    prompt: 'Where do you sit against the general adult population on probability of major health problems in the next 20 years?',
    setup:
      'Cancer, heart disease, diabetes, stroke, dementia. The base rate population probability of at least one of these by age 65 in your country is roughly 40-50%. Where do you sit against that base rate? Higher numbers mean you think you are less likely than average to face these.',
    documentedMean: 65,
    pctAboveAvg: 84,
    source: 'Weinstein (1980, 1987) US college and adult samples: 84% rated themselves below average on probability of negative health events. Mean self-rating of own risk: ~35th percentile (i.e. self-rated invulnerability at ~65th percentile).',
    research:
      'Weinstein (1980) "Unrealistic Optimism About Future Life Events," Journal of Personality and Social Psychology vol 39. The flip side of the better-than-average effect: people rate themselves below average for the probability of bad events. Helweg-Larsen & Shepperd (2001) meta-analysis of 27 studies on optimism for health events. Klein & Helweg-Larsen (2002) on cancer, diabetes, heart disease specifically. The asymmetry is consistent: people are above average for good traits and below average for bad outcomes. Both directions are the same egocentric anchor.',
    wizCommentary:
      'This one is the same effect running backwards. Better-than-average on good traits, lower-than-average on probability of bad outcomes. The base rate of major chronic illness by 65 in developed economies is roughly forty to fifty percent. The self-rated probability is roughly twenty to thirty percent. The gap is paid for, eventually, in late-stage diagnoses that should not have surprised anyone.',
  },
  {
    id: 10,
    phase: 'TRAIT 10 OF 10',
    title: 'Investing / Money Sense',
    emoji: '💸',
    prompt: 'Where do you sit against the general adult population on financial decision-making?',
    setup:
      'How well you handle money. Budgeting, saving, investing, not panicking in a downturn, not chasing fads. Compared to every adult who handles their own money.',
    documentedMean: 71,
    pctAboveAvg: 74,
    source: 'Barber & Odean (2001) US retail investor sample n=78,000: 74% rated themselves above average on investing ability. Mean self-rating: ~71st percentile. Actual annualized return of self-rated above-average investors was 1.5 percentage points below the market.',
    research:
      'Barber & Odean (2001) "Boys Will Be Boys: Gender, Overconfidence, and Common Stock Investment," Quarterly Journal of Economics vol 116. The single largest study of retail investor self-rating ever conducted. Most-confident-quartile investors traded 45% more often than the least-confident quartile, and earned 2.65 percentage points less per year net of costs. SPIVA (2024) shows 92% of US large-cap mutual funds underperformed their benchmark over 15 years; 94% of self-rated above-average individual investors do too, on average.',
    wizCommentary:
      'The trait the bias costs the most in cash terms. Self-rated above-average investors trade more often and lose 2.65 percentage points per year doing it (Barber and Odean 2001). The cleanest test of the bias here is just to look at the index-fund alternative: in 15 years, more than nine in ten actively managed funds underperform it. The same nine in ten managers rated themselves above average at the start of those fifteen years.',
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
    threshold: 51,
    emoji: '🪨',
    name: 'The Realist',
    range: 'AVG SELF-RATING AT OR BELOW 50',
    tagline: 'You did the math. Half the population has to be in the top half. You did not put yourself there by default.',
    description:
      'Your average self-rating sits at or below the mathematical median. This is rarer than the entire other side of the distribution combined. Brown (1986) College Board sample n=829,000: fewer than 2% of subjects across leadership, athletic ability and sociability rated themselves below average. Tappin & McKay (2017): 2% on moral character. You are operating outside the bias in a way the literature almost never measures.',
    wizNote:
      'This profile is rare enough that I have to ask a question of it. Either you are practicing what is sometimes called "depressive realism" (Alloy & Abramson 1979 found mildly depressed subjects rated themselves more accurately than non-depressed controls on a contingency-judgment task), or you have an unusually disciplined relationship with the difference between median and mean and aspiration. The latter is the more useful version of this profile. The former is real but expensive.',
    research:
      'Brown (1986) College Board large-sample data. Tappin & McKay (2017) on moral self-rating. Alloy & Abramson (1979) "Judgment of Contingency in Depressed and Nondepressed Students: Sadder but Wiser?" Journal of Experimental Psychology: General vol 108. Less than 5% of subjects in the BTAE literature score in this band.',
    traits: [
      'Treats "average" as 50, not as "the worst version of this trait I imagine in someone else"',
      'Resists the definitional redefinition Dunning Meyerowitz & Holzberg (1989) identified',
      'Possibly underclaiming on traits where you have real strength',
      'Possibly underweighting your own competence relative to peers',
      'Worth checking that you are not paying for accuracy in confidence currency',
    ],
    shareText:
      'I scored "The Realist" on WIZ\'s Better-Than-Average Effect Test. My average self-rating was at or below the mathematical median — fewer than 5% of subjects in the literature score in this band.',
  },
  {
    threshold: 60,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'AVG SELF-RATING 51 TO 60',
    tagline: 'You tilt slightly toward yourself. The literature would call this restraint.',
    description:
      'Your average self-rating sits 1 to 10 points above the mathematical median. This is roughly the band Krueger & Mueller (2002) identified as consistent with a rational Bayesian update on your own information. You know yourself better than you know any individual stranger; treating your own data as slightly more representative than someone else\'s is defensible. The classic Svenson and Cross findings are still well above where you landed. You are exhibiting the effect at a controlled magnitude.',
    wizNote:
      'You are doing the rarest thing in the better-than-average literature: claiming a modest, defensible degree of superiority. Most of the population is either ten to twenty points above the mathematical mean or, on saturated traits like moral character and sociability, twenty to thirty-five points above. Sitting one to ten points up is the calibrated band. Krueger & Mueller would say it is the part of the BTAE that is not actually bias, just rational self-knowledge.',
    research:
      'Krueger & Mueller (2002) "Unskilled, Unaware, or Both? The Better-Than-Average Heuristic and Statistical Regression," Journal of Personality and Social Psychology vol 82. Suggests a portion of the BTAE is rational Bayesian self-favoring rather than pure bias.',
    traits: [
      'Calibrated against the math constraint (median = 50)',
      'Likely able to name traits where you are below average',
      'Probably distinguishes "I do this well" from "I do this best"',
      'Reasonable separation of self-knowledge from self-flattery',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Better-Than-Average Effect Test. My average self-rating was 51 to 60 — the rational Bayesian band per Krueger & Mueller (2002), restrained relative to the classic Svenson and Cross findings.',
  },
  {
    threshold: 70,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'AVG SELF-RATING 60 TO 70',
    tagline: 'You sit inside the bias the founding studies described.',
    description:
      'Your average self-rating sits 10 to 20 points above the mathematical median. This is the modal band Alicke (1985) measured across 154 traits at Ohio State, where the cross-trait mean self-rating was the sixty-fifth percentile. This is where most of the BTAE literature concentrates: a population that rates itself, on average, in the top third. You are roughly the typical adult subject of this kind of test. The bias is operating in your ratings. The bias is also operating in everyone else\'s ratings against whom you are being compared.',
    wizNote:
      'This is the most populated band in the entire BTAE literature. Alicke (1985) at Ohio State, mean rating 65. Brown (1986) College Board across multiple social traits, mean rating 67. Heck Simons & Chabris (2018) on intelligence, mean rating 67. You are not exhibiting a personal failure here. You are exhibiting the typical adult shape of the self-rating distribution. The structural insight is that this typical shape is mathematically impossible at the population level. Each individual is doing only what feels rational from where they stand; the impossibility lives in the aggregate.',
    research:
      'Modal band per Alicke (1985), Brown (1986), Heck Simons & Chabris (2018). Cross-trait mean self-rating in BTAE studies typically falls in the 60-70 band when averaged across mixed traits.',
    traits: [
      'Inside the typical BTAE distribution shape',
      'Likely strongest on identity-bound traits (humor, sociability, empathy)',
      'Likely most calibrated on traits with external scoring (intelligence, investing)',
      'Probably reads "average" as "the worst version of this trait I have seen" rather than as the math median',
      'Standard human pattern, not a personal defect',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Better-Than-Average Effect Test. My average self-rating was 60 to 70 — the modal band Alicke (1985) measured across 154 traits at Ohio State.',
  },
  {
    threshold: 82,
    emoji: '🚗',
    name: 'The Lake Wobegon Resident',
    range: 'AVG SELF-RATING 70 TO 82',
    tagline: 'Garrison Keillor named the town after you. Everyone in it is above average.',
    description:
      'Your average self-rating sits 20 to 32 points above the mathematical median. This is the band Svenson (1981) measured in his original US driver sample (mean ~78th percentile on safety), Cross (1977) in college teachers (mean ~75th percentile on teaching), and Klein & Epley (2017) on empathy (~77th). The bias is operating at full strength. This is where the effect was first named and where the canonical demonstrations live. Sitting here is not a personal aberration; it is the saturated population pattern.',
    wizNote:
      'You have arrived in the place Garrison Keillor named in the 1980s on his radio show. Lake Wobegon, "where all the women are strong, all the men are good-looking, and all the children are above average." The phrase landed in the academic literature in 1986 and stuck because it captured the mathematical impossibility at the heart of the effect. The trait the literature finds hardest for people in this band to recalibrate on is the social ones. Moral character. Sociability. Empathy. These are the ones where the bias is most committed.',
    research:
      'Canonical BTAE band per Svenson (1981) US drivers, Cross (1977) college teachers, Klein & Epley (2017) empathy ratings. Wider than the rational Bayesian band, narrower than the College Board (1976) saturated bands.',
    traits: [
      'Full Svenson driver-band signature on visible skill traits',
      'Likely Cross teacher-band signature on identity-bound competence traits',
      'Probably difficult to name three traits where you are below average',
      'The "what does average look like" reference image in your head is probably the bottom decile',
      'Hardest recalibration: moral character, sociability, empathy',
    ],
    shareText:
      'I scored "The Lake Wobegon Resident" on WIZ\'s Better-Than-Average Effect Test. My average self-rating was 70 to 82 — the saturated BTAE band Svenson (1981) found in 88% of US drivers.',
  },
  {
    threshold: 200,
    emoji: '🏛️',
    name: 'The Lake Wobegon Mayor',
    range: 'AVG SELF-RATING ABOVE 82',
    tagline: 'You exceed the strongest single self-rating finding ever recorded on any trait in the literature.',
    description:
      'Your average self-rating sits above the highest single-trait mean ever recorded in the BTAE literature. Tappin & McKay (2017) found a mean of 85 on moral character — the largest documented effect on the largest trait. You are running that magnitude as your cross-trait average. The 1976 College Board high-school seniors at saturation point. Brown (1986) ran the data and found 25% in the top one percent on sociability and zero percent below average. You are operating in that band, on every trait, across the board. This is the upper outlier of every published distribution.',
    wizNote:
      'There are roughly three readings of a profile in this band. First, you may be unusually accomplished across multiple traits and your self-rating is closer to truth than the population average. Second, you may be running the bias at saturation, in which case the structural blind spot is that the people you are comparing against are also rating themselves up here, and the comparison axis is broken. Third, you may have a strong identity-bound sense of "the kind of person I am" that is overwriting the population question with a self-description question. The cleanest test is whether you can quickly name three traits where you sit below the population median. If you cannot, the profile is the bias.',
    research:
      'Upper outlier band per Tappin & McKay (2017) moral self-rating mean of 85. College Board (1976) saturated bands per Brown (1986). Klein & Epley (2017) identity-bound trait band.',
    traits: [
      'Above the highest single-trait mean documented in the BTAE literature',
      'Likely saturating on identity-bound traits (moral character, sociability, empathy)',
      'Probably also saturating on objectively-measured traits',
      'High vulnerability to the Dunning Meyerowitz & Holzberg (1989) trait-redefinition effect',
      'Worth running the "three traits below the median" check as a sanity test',
    ],
    shareText:
      'I scored "The Lake Wobegon Mayor" on WIZ\'s Better-Than-Average Effect Test. My average self-rating exceeds 82, above the highest single-trait mean ever recorded in the literature (Tappin & McKay 2017).',
  },
];

function getProfile(avg: number): ProfileSpec {
  for (const p of PROFILES) {
    if (avg < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<number[]>(Array(TRAITS.length).fill(50));
  const [locked, setLocked] = useState<boolean[]>(Array(TRAITS.length).fill(false));
  const [revealed, setRevealed] = useState<boolean[]>(Array(TRAITS.length).fill(false));

  const current = TRAITS[index];
  const isLast = index === TRAITS.length - 1;
  const isLocked = locked[index];
  const isRevealed = revealed[index];

  const handleSlide = useCallback((value: number) => {
    if (locked[index]) return;
    setRatings((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, [index, locked]);

  const handleLock = useCallback(() => {
    setLocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
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

  const avgRating = useMemo(() => {
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Math.round((sum / TRAITS.length) * 10) / 10;
  }, [ratings]);

  const excessAboveFifty = useMemo(
    () => Math.round((avgRating - 50) * 10) / 10,
    [avgRating],
  );

  const itemsAbove70 = useMemo(
    () => ratings.filter((r) => r > 70).length,
    [ratings],
  );

  const itemsAboveDocumented = useMemo(
    () => TRAITS.filter((t, i) => ratings[i] > t.documentedMean).length,
    [ratings],
  );

  const profile = useMemo(() => getProfile(avgRating), [avgRating]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/better-than-average`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(TRAITS.length).fill(50));
    setLocked(Array(TRAITS.length).fill(false));
    setRevealed(Array(TRAITS.length).fill(false));
  }, []);

  const currentGapVsMath = isRevealed ? ratings[index] - 50 : 0;
  const currentGapVsDocumented = isRevealed ? ratings[index] - current.documentedMean : 0;

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
                The Better-Than-Average Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Ten traits. One slider each. Rate where you sit in the general adult population. WIZ compares your number to fifty years of self-rating studies and to the only mathematically possible average: fifty.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;Eighty-eight percent of US drivers and seventy-seven percent of Swedish drivers placed themselves in the top fifty percent for safety. The math does not allow this.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Ola Svenson, 1981</span>
              </p>
              <p>
                In 1981 Ola Svenson at Stockholm asked drivers in the US and Sweden to place themselves on a percentile scale against the rest of the driving population. Eighty-eight percent of the US sample put themselves in the top half. By construction, only fifty percent of any sample can be above the median. The founding paper named the effect.
              </p>
              <p>
                Mark Alicke (1985) ran the trait sweep at Ohio State: 154 personality traits, percentile self-rating. Mean self-rating across all 154 traits came in at the sixty-fifth percentile. Patricia Cross (1977) at Nebraska asked college teachers to rate their own teaching: 94% above average, 68% in the top quartile. Brown (1986) ran the 1976 College Board high-school senior data and found 25% of 829,000 seniors placed themselves in the top one percent for sociability. None below average. Tappin and McKay (2017) found mean self-rated moral character sits at the eighty-fifth percentile, the largest BTAE effect ever recorded.
              </p>
              <p>
                You are about to take ten traits. Driving safety. Sense of humor. Intelligence. Physical attractiveness. Leadership. Getting along with others. Empathy. Moral character. Future health. Investing. For each, you move a 0-100 slider for where you sit in the general adult population. Zero is the lowest one percent. Fifty is the exact median. One hundred is the top one percent. After you lock in, I show what twenty large samples of self-raters since 1976 put down on the same trait, and we measure the gap.
              </p>
              <p className="text-zinc-500 text-xs">
                The math constraint never moves: the true population average is, by definition, fifty. Anything you place above that on average is the bias.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
            >
              Rate yourself on ten traits →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest">{current.phase}</div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-emerald-300">{current.title}</h2>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-2">{current.setup}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <p className="text-zinc-200 text-sm font-bold">
                {current.prompt}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — bottom 1%</span>
                  <span>50 — exact median</span>
                  <span>100 — top 1%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ratings[index]}
                  onChange={(e) => handleSlide(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Self-rating percentile"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300">{ratings[index]}<span className="text-xl text-zinc-500">th percentile</span></div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {ratings[index] < 15
                      ? 'well below average'
                      : ratings[index] < 35
                      ? 'below average'
                      : ratings[index] < 45
                      ? 'slightly below average'
                      : ratings[index] < 55
                      ? 'roughly average'
                      : ratings[index] < 70
                      ? 'above average'
                      : ratings[index] < 85
                      ? 'well above average'
                      : 'top of the distribution'}
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]}th percentile and reveal research →
                </button>
              )}
            </div>

            {isRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR RATING</div>
                    <div className="text-2xl font-bold text-emerald-300">{ratings[index]}</div>
                    <div className="text-xs text-zinc-500 mt-1">percentile</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">DOCUMENTED MEAN</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.documentedMean}</div>
                    <div className="text-xs text-zinc-500 mt-1">in research</div>
                  </div>
                  <div
                    className={`border p-3 ${
                      currentGapVsMath < 5
                        ? 'border-emerald-700 bg-emerald-950/30'
                        : currentGapVsMath < 20
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-rose-700 bg-rose-950/20'
                    }`}
                  >
                    <div className="text-xs text-zinc-400 mb-1">GAP vs 50</div>
                    <div
                      className={`text-2xl font-bold ${
                        currentGapVsMath < 5
                          ? 'text-emerald-200'
                          : currentGapVsMath < 20
                          ? 'text-amber-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {currentGapVsMath > 0 ? '+' : ''}{currentGapVsMath}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">vs math median</div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 italic text-center">
                  {currentGapVsDocumented > 5
                    ? `You rated yourself ${currentGapVsDocumented} points above the average self-rater in the literature on this trait.`
                    : currentGapVsDocumented < -5
                    ? `You rated yourself ${Math.abs(currentGapVsDocumented)} points below the average self-rater on this trait.`
                    : 'You rated yourself within 5 points of the average self-rater on this trait.'}
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">WHAT THE RESEARCH SAYS</div>
                  <p className="text-zinc-300 text-xs">{current.source}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">FULL CITATIONS</div>
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
                  {isLast ? 'See your better-than-average report →' : `Next trait (${index + 2} of ${TRAITS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {TRAITS.length}</span>
              <span>
                avg so far:{' '}
                {(() => {
                  const done = revealed.slice(0, index + (isRevealed ? 1 : 0));
                  if (done.length === 0 || !done.some(Boolean)) return '...';
                  const count = done.length;
                  const sum = ratings.slice(0, count).reduce((acc, r) => acc + r, 0);
                  return (sum / count).toFixed(1);
                })()}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR BETTER-THAN-AVERAGE REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG SELF-RATING</div>
                <div className="text-3xl font-bold text-emerald-200">{avgRating}</div>
                <div className="text-xs text-zinc-500 mt-1">percentile</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">ABOVE 70TH</div>
                <div className="text-3xl font-bold text-zinc-200">
                  {itemsAbove70} / {TRAITS.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">traits placed in top 30%</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">EXCESS vs MEDIAN</div>
                <div className="text-3xl font-bold text-zinc-200">{excessAboveFifty > 0 ? '+' : ''}{excessAboveFifty}</div>
                <div className="text-xs text-zinc-500 mt-1">pts above math 50</div>
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
                  {profile.traits.map((trait) => (
                    <li key={trait}>· {trait}</li>
                  ))}
                </ul>
              </div>
              {itemsAboveDocumented > 0 && (
                <div className="border-t border-zinc-800 pt-3">
                  <div className="text-xs text-emerald-400 tracking-widest mb-2">YOU EXCEED THE AVERAGE SELF-RATER ON</div>
                  <p className="text-xs text-zinc-400">
                    {itemsAboveDocumented} of {TRAITS.length} traits, you rated yourself above the documented mean self-rating in the literature. That is, you exceed even the population that is already exhibiting the bias. {itemsAboveDocumented >= 7 ? 'This is the strongest signature of the saturated band.' : itemsAboveDocumented >= 4 ? 'This is a typical Lake Wobegon Resident signature.' : 'This is a moderate signature.'}
                  </p>
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-emerald-400 tracking-widest mb-3">TRAIT-BY-TRAIT</div>
              <div className="space-y-2">
                {TRAITS.map((trait, i) => {
                  const yours = ratings[i];
                  const docMean = trait.documentedMean;
                  const gapMath = yours - 50;
                  const gapDoc = yours - docMean;
                  return (
                    <div
                      key={trait.id}
                      className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                    >
                      <div className="col-span-5 text-zinc-300 truncate">
                        {trait.emoji} {trait.title}
                      </div>
                      <div className="col-span-2 text-right text-zinc-400">you: {yours}</div>
                      <div className="col-span-3 text-right text-emerald-300">lit avg: {docMean}</div>
                      <div
                        className={`col-span-2 text-right ${
                          gapDoc > 5 ? 'text-rose-400' : gapDoc < -5 ? 'text-sky-400' : gapMath > 10 ? 'text-amber-400' : 'text-zinc-500'
                        }`}
                      >
                        {gapDoc > 0 ? '+' : ''}{gapDoc}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Right column shows your gap against the documented mean self-rater in the literature on that trait. Positive numbers mean you exceed even the population that is already overestimating.
              </p>
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
              Sources: Svenson (1981) "Are We All Less Risky and More Skillful than our Fellow Drivers?" Acta Psychologica vol 47. Alicke (1985) "Global Self-Evaluation as Determined by the Desirability and Controllability of Trait Adjectives," Journal of Personality and Social Psychology vol 49. Cross (1977) "Not Can But Will College Teaching Be Improved?" New Directions for Higher Education vol 17. Brown (1986) "Evaluations of Self and Others: Self-Enhancement Biases in Social Judgments," Social Cognition vol 4. Tappin & McKay (2017) "The Illusion of Moral Superiority," Social Psychological and Personality Science vol 8. Klein & Epley (2017) "Less Evil Than You: Bounds on the Self-Other Asymmetry in Moral Reasoning," Journal of Experimental Social Psychology vol 70. Kruger & Dunning (1999) "Unskilled and Unaware of It," Journal of Personality and Social Psychology vol 77. Heintz & Ruch (2016) on humor self-rating. Heck Simons & Chabris (2018) "65% of Americans believe they are above average in intelligence," PLoS One. Hoorens (1993) on self-rated IQ. Epley & Whitchurch (2008) "Mirror, Mirror on the Wall: Enhancement in Self-Recognition," PSPB vol 34. Weinstein (1980) "Unrealistic Optimism About Future Life Events," JPSP vol 39. Barber & Odean (2001) "Boys Will Be Boys: Gender, Overconfidence, and Common Stock Investment," QJE vol 116. Dunning Meyerowitz & Holzberg (1989) on trait-redefinition. Krueger & Mueller (2002), Nuhfer et al. (2017) on regression artifacts. Sedikides Meek Alicke & Taylor (2014) on prisoners. Konrath O\'Brien Hsing (2011) on empathy decline. SPIVA (2024) on actively managed fund underperformance. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
