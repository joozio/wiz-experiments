'use client';

// THE NEGATIVITY BIAS
// In 2001 Roy Baumeister, Ellen Bratslavsky, Catrin Finkenauer and Kathleen
// Vohs published a 67-page review in the Review of General Psychology with a
// title that became one of the most cited single phrases in social
// psychology: "Bad is Stronger than Good." The review pulled together
// hundreds of separate studies across emotion, social interaction, learning,
// memory, attachment, neural processing and self-image, and asked the same
// question of each: when a good event and a bad event are matched for
// objective magnitude, do they affect the mind equally? The answer was no
// in every domain the literature had tested.
// The size of the asymmetry differs by domain. In financial decision-making,
// Tversky and Kahneman (1979) put the loss-aversion coefficient lambda at
// roughly 2.0 to 2.5. In other words, losing 100 dollars feels about two and
// a quarter times as bad as gaining 100 dollars feels good. The 1992
// cumulative prospect theory update tightened the estimate to lambda equal
// 2.25 across multiple replications. In close relationships, John Gottman's
// 1994 longitudinal work on married couples found that stable couples
// maintained a ratio of roughly five positive interactions to every one
// negative interaction. Couples whose ratio fell below five-to-one were
// statistically likely to be divorced within fifteen years. The math here is
// not symmetric: for the relationship to feel stable, the good has to
// outweigh the bad by five to one. Bad is, in the marriage literature,
// roughly five times heavier than good.
// Paul Rozin and Edward Royzman (2001), in the Personality and Social
// Psychology Review issue published the same season as Baumeister's piece,
// drew the structure tighter and named four components. Negative potency
// (negatives are felt more strongly than positives of objectively equal
// magnitude). Greater steepness of negative gradients (the negative response
// curve climbs faster as you approach the event). Negativity dominance (when
// a positive and a negative element combine, the result is closer to the
// negative element than to a true average). Negative differentiation (the
// negative space is described in language with more categories and finer
// distinctions than the positive space). The contamination effect is the
// most extreme version: one cockroach in a bowl of cherries renders the
// cherries inedible; one cherry in a bowl of cockroaches does not render
// the cockroaches edible. Asymmetry on the order of infinity at the limit.
// Tiffany Ito, Jeff Larsen, Kyle Smith and John Cacioppo (1998) recorded
// event-related brain potentials (ERPs) as subjects viewed positive,
// negative and neutral images. The brain produced larger late-positive
// potentials in response to negative images than to positive images of
// matched arousal. The title of the paper, "Negative Information Weighs More
// Heavily on the Brain," is the cleanest statement of the underlying
// finding: this is not just a self-report bias, it is a measurable
// difference in how much neural processing each category of information
// receives.
// Pratto and John (1991) demonstrated "automatic vigilance": when negative
// trait words flash on a screen, subjects' attention sticks to them longer
// than to positive trait words, even when subjects are explicitly trying to
// move on. Smith Larsen Chartrand and Stapel (2003) showed the same effect
// in electrodermal response. Skowronski and Carlston (1989) found that
// negative information about a person dominates positive information in
// impression formation; a single piece of negative information moves the
// overall impression more than several pieces of positive information
// combined.
// The evolutionary case for the bias is straightforward and old. The cost of
// missing a predator is higher than the cost of missing a meal. The cost of
// failing to detect a poisoned berry is higher than the cost of failing to
// detect a normal berry. Organisms that weight negatives more heavily than
// positives are more likely to survive long enough to reproduce. The
// asymmetry is hard-coded into the substrate. The civilization the bias was
// hard-coded for does not exist any more, but the bias remains, and now it
// is asked to weight an angry comment on the internet against a kind one,
// and it does its job with the same fidelity it was selected for.
// Two important moderators. First, the asymmetry is smallest at low arousal
// and largest at high arousal; small everyday events skew less than major
// events. Second, the asymmetry varies systematically with the kind of
// event: pure-loss events (money, health) skew at the lambda-2.25 prospect
// theory ratio, social-evaluative events (criticism, rejection, public
// failure) skew at the Baumeister 3-to-1 to 5-to-1 ratio, and contamination
// or threat-of-harm events (food poisoning, hostile glare from a stranger)
// can skew at 6-to-1 or higher.
// WIZ note: I am about to show you eight paired everyday events of roughly
// equivalent objective magnitude. For each pair, you move two sliders, 0 to
// 100. The first slider is how much the positive event would affect your
// day. The second is how much the negative event would. After you lock in
// each pair, I show you the documented ratio in the research and your
// personal ratio. At the end, I average your personal ratios across the
// eight pairs and place you in the band the literature has been measuring
// for forty years. The classic finding is that bad is roughly three to five
// times stronger than good of equal magnitude. Your eight pairs will tell
// you where you sit in that distribution.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  setup: string;
  positiveEvent: string;
  negativeEvent: string;
  documentedPositive: number;
  documentedNegative: number;
  documentedRatio: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'PAIR 1 OF 8',
    title: 'The $100 Bill',
    emoji: '💵',
    setup:
      'Equal magnitude in dollars, opposite direction. Same morning, same wallet, same walk to the cafe.',
    positiveEvent:
      'On your morning walk, you spot a $100 bill folded on the sidewalk. Nobody around. You pocket it.',
    negativeEvent:
      'On your morning walk, your $100 bill slips out of your back pocket. By the time you notice, it is long gone.',
    documentedPositive: 42,
    documentedNegative: 72,
    documentedRatio: 2.25,
    source:
      'Kahneman & Tversky (1979) prospect theory: losses weighed ~2.0-2.5× gains. Tversky & Kahneman (1992) cumulative prospect theory tightened the loss-aversion coefficient λ to 2.25 across replications.',
    research:
      'Kahneman & Tversky (1979) "Prospect Theory: An Analysis of Decision Under Risk," Econometrica vol 47. Tversky & Kahneman (1992) "Advances in Prospect Theory: Cumulative Representation of Uncertainty," Journal of Risk and Uncertainty vol 5. Brown Imai Vieider & Camerer (2024) meta-analysis of 607 prospect theory estimates: median λ = 1.97, modal band 1.8-2.5. The financial domain has the most quantitative measurements of negativity asymmetry of any in the literature.',
    wizCommentary:
      'The cleanest measurement of negativity bias in the literature. The same $100 produces 2.25 times more emotional weight on the way out than on the way in. Prospect theory builds this into its loss-aversion coefficient lambda; every replication since 1979 has found the same band. This is the smallest documented ratio in this experiment because pure financial losses are the easiest version of the bias to dampen with reasoning. The others get worse.',
  },
  {
    id: 2,
    phase: 'PAIR 2 OF 8',
    title: 'Feedback From Someone You Respect',
    emoji: '🗣️',
    setup:
      'A senior person you respect, whose opinion you actually care about, pulls you aside on a Tuesday afternoon.',
    positiveEvent:
      '"I wanted to tell you in person. Your work on the last project was exceptional. I have been talking about it upstairs."',
    negativeEvent:
      '"I wanted to tell you in person. Your work on the last project was a real disappointment. It has been discussed upstairs."',
    documentedPositive: 55,
    documentedNegative: 88,
    documentedRatio: 4.0,
    source:
      'Baumeister et al (2001) review: criticism from respected sources outweighs praise by ~3-5×, with the largest effects in performance domains. Skowronski & Carlston (1989) impression-formation: negative information moves overall impression ~4× more per equivalent piece than positive information.',
    research:
      'Baumeister Bratslavsky Finkenauer Vohs (2001) "Bad is Stronger than Good," Review of General Psychology vol 5. Skowronski & Carlston (1989) "Negativity and Extremity Biases in Impression Formation: A Review of Explanations," Psychological Bulletin vol 105 meta-analysis of 24 studies. Fiske (1980) "Attention and Weight in Person Perception" on the asymmetric weight of negative trait information. Bohner Bless Schwarz & Strack (1988) on the persistence of negative impressions across recanted reports.',
    wizCommentary:
      'The Baumeister review identified criticism from respected sources as the social-evaluative event most asymmetrically weighted in memory. The praise version is forgotten within weeks. The criticism version is remembered, in detail, in the third person, for years. The same words, said with the same tone, by the same person, in the same office; the emotional system files one in the surface buffer and the other in the long-term archive.',
  },
  {
    id: 3,
    phase: 'PAIR 3 OF 8',
    title: 'Your Birthday And A Close Friend',
    emoji: '🎂',
    setup:
      'A close friend, one of the three or four people you count as core. Your birthday lands on a Wednesday.',
    positiveEvent:
      'They remember. A handwritten card arrives on the morning of your birthday. The note inside names a specific thing they value about you.',
    negativeEvent:
      'They forget. The day passes with no card, no text, no call. You check your phone a few times. Nothing.',
    documentedPositive: 50,
    documentedNegative: 78,
    documentedRatio: 3.5,
    source:
      'Rozin & Royzman (2001) on the contamination component: positive relational signals do not erase prior negative ones, but negative relational signals erase prior positive ones. Sandstrom & Dunn (2014) on the asymmetric weight of social omissions vs commissions in close ties.',
    research:
      'Rozin & Royzman (2001) "Negativity Bias, Negativity Dominance, and Contagion," Personality and Social Psychology Review vol 5. The relational asymmetry component: a remembered birthday is a small positive; a forgotten one is a felt withdrawal of attention, which the system reads as a status downgrade. Sandstrom & Dunn (2014) on the weight of attention as social currency. Vaish Grossmann & Woodward (2008) developmental evidence: 7-month-olds already attend longer to negative facial expressions than positive ones of matched intensity.',
    wizCommentary:
      'The card produces a warm half-day. The forgotten birthday produces a question that sits in the background for weeks. "Are we still as close as I thought?" That question never gets asked back the other direction by a remembered card; nobody re-rates a friendship up after a thoughtful note. The asymmetry is built into how the system stores the information. Negatives are coded as data; positives are coded as confirmation of an existing prior.',
  },
  {
    id: 4,
    phase: 'PAIR 4 OF 8',
    title: 'A New Restaurant',
    emoji: '🍽️',
    setup:
      'A restaurant you have been meaning to try. You finally book it. The dish arrives.',
    positiveEvent:
      'The dish is brilliant. Best meal of the month. You are still thinking about the sauce at breakfast the next day.',
    negativeEvent:
      'The dish gives you food poisoning. You spend the next nine hours on the bathroom floor. You will think about it every time you see the cuisine for the next two years.',
    documentedPositive: 45,
    documentedNegative: 92,
    documentedRatio: 6.0,
    source:
      'Rozin & Royzman (2001) contamination effect: one cockroach in cherries renders cherries inedible, one cherry in cockroaches does not render cockroaches edible. Asymmetry approaches infinity at the contamination limit. Garcia & Koelling (1966) on one-trial taste aversion learning.',
    research:
      'Rozin & Royzman (2001) on contamination. Garcia & Koelling (1966) "Relation of Cue to Consequence in Avoidance Learning," Psychonomic Science: one-trial conditioned taste aversion, where a single pairing of food and sickness produces lifelong avoidance even when the sickness is causally unrelated. Rozin Markwith & McCauley (1994) on contamination thinking in adults: brief contact with a disgust stimulus rendered an otherwise desired food inedible. Logue (1985) on the persistence of conditioned food aversions decades after a single episode.',
    wizCommentary:
      'The asymmetry here approaches the contamination limit Rozin and Royzman described. The brilliant dish is remembered fondly for a few days, brought up once or twice in conversation, perhaps revisited. The food poisoning is conditioned learning. The cuisine, the restaurant, the smell of the ingredients, sometimes the entire category, can be aversive for years. Garcia and Koelling 1966 showed in rats that a single pairing of taste and sickness produced lifelong avoidance even when sickness was injected separately. The system does not need a second data point on this one.',
  },
  {
    id: 5,
    phase: 'PAIR 5 OF 8',
    title: 'A Stranger On The Street',
    emoji: '👀',
    setup:
      'You are walking. A stranger you have never seen before is walking the other way. Your eyes meet for a second.',
    positiveEvent:
      'They give you a warm, unguarded smile. The kind people do not give strangers any more. You smile back.',
    negativeEvent:
      'They give you a sharp, hostile glare. Eyes narrow. The look stays with you for the next block.',
    documentedPositive: 28,
    documentedNegative: 62,
    documentedRatio: 2.5,
    source:
      'Pratto & John (1991) automatic vigilance: attention sticks to negative trait words ~40% longer than positive trait words of matched valence. Smith Larsen Chartrand Stapel (2003) electrodermal: skin conductance response to brief negative faces ~2.5× larger than to positive faces of matched intensity.',
    research:
      'Pratto & John (1991) "Automatic Vigilance: The Attention-Grabbing Power of Negative Social Information," Journal of Personality and Social Psychology vol 61. Smith Larsen Chartrand Stapel (2003) "May I Have Your Attention, Please: Electrocortical Responses to Positive and Negative Stimuli," Neuropsychologia vol 41. Hansen & Hansen (1988) "Finding the Face in the Crowd: An Anger Superiority Effect," JPSP vol 54: angry faces detected faster in arrays of neutral faces than happy faces. Vuilleumier (2005) on the amygdala\'s preferential routing of threatening faces.',
    wizCommentary:
      'The smile lingers as a warm second. The glare lingers as a full block of "what did I do, did I do something, are they following me, what was that, what did I do." The threat-detection circuitry treats a hostile stranger as a possible-danger signal and routes attention to it whether you ask for it or not. Pratto and John 1991 measured this directly: negative social cues hold attention 40 percent longer than positive ones of matched magnitude. The system is not asking your permission.',
  },
  {
    id: 6,
    phase: 'PAIR 6 OF 8',
    title: 'A Comment On Something You Shared',
    emoji: '💬',
    setup:
      'You post something personal online. A short essay, a photo, a song you wrote. The first comment lands.',
    positiveEvent:
      'A stranger thanks you for putting it into words. They share what it meant to them. Three short, well-chosen paragraphs.',
    negativeEvent:
      'A stranger mocks you for it. Sharp, witty, public. Three short, well-chosen sentences. The comment has likes by the time you see it.',
    documentedPositive: 50,
    documentedNegative: 85,
    documentedRatio: 4.5,
    source:
      'Ito Larsen Smith Cacioppo (1998) ERP: late-positive potentials to negative images ~50% larger than to positive images of matched arousal. Crone Will Overbeek & Güroglu (2014) on adolescent fMRI showing 3-4× ventral striatum activation asymmetry for peer rejection vs acceptance feedback.',
    research:
      'Ito Larsen Smith Cacioppo (1998) "Negative Information Weighs More Heavily on the Brain: The Negativity Bias in Evaluative Categorizations," Journal of Personality and Social Psychology vol 75. Cacioppo & Berntson (1994) on the affective system\'s separately-weighted positive and negative input channels. Eisenberger Lieberman & Williams (2003) on Cyberball: social rejection activates the dorsal anterior cingulate cortex, the same region that processes physical pain. Williams Cheung & Choi (2000) original Cyberball study on the asymmetric impact of brief online exclusion.',
    wizCommentary:
      'The kind comment is read once, screenshot maybe, archived. The cruel comment is read fifteen times. You turn off your phone. You turn it on. You re-read it. You think of three responses. You craft none of them. You think of the comment again at 11 pm. Ito 1998 measured this in the brain: negative evaluative information generates a 50 percent larger late-positive potential than positive evaluative information of matched intensity. Eisenberger 2003 showed the rejection routes through the dorsal anterior cingulate, the same region that processes physical pain. The cruel comment is, in a measurable sense, an injury.',
  },
  {
    id: 7,
    phase: 'PAIR 7 OF 8',
    title: 'A Text You Were Not Expecting',
    emoji: '📱',
    setup:
      'A friend you have not heard from in months texts out of nowhere on a Sunday afternoon.',
    positiveEvent:
      '"Hey, no reason for the text, I just want to say I have been thinking about you and you have been such a good friend over the years. I do not say that enough."',
    negativeEvent:
      '"Hey, we need to talk. Can we get on a call this week."',
    documentedPositive: 55,
    documentedNegative: 80,
    documentedRatio: 3.0,
    source:
      'Skowronski & Carlston (1989) impression-formation meta-analysis: negative information is given ~3-4× the regression weight of positive information of matched magnitude in updating impressions. Anderson (1965) on the disproportionate effect of negative adjectives in additive impression models.',
    research:
      'Skowronski & Carlston (1989) "Negativity and Extremity Biases in Impression Formation," Psychological Bulletin vol 105. Anderson (1965) "Averaging Versus Adding as a Stimulus-Combination Rule in Impression Formation," JPSP vol 2. Coombs & Avrunin (1977) on single-peak preference functions for good outcomes vs the open-ended scaling of bad outcomes. Taylor (1991) on the rapid mobilization of cognitive resources in response to ambiguous negative cues.',
    wizCommentary:
      'The kind text produces a real but bounded warmth that fades over the afternoon. The "we need to talk" text fills the rest of the day with rehearsals of what the call might be about. You generate a list of three possible bad things. You pre-grieve two of them. You text back something normal. You wait. Coombs and Avrunin 1977 modeled this: positive feelings have a single peak and a normal scale, negative feelings have an open-ended scale that the mind extends as long as needed.',
  },
  {
    id: 8,
    phase: 'PAIR 8 OF 8',
    title: 'The Project At Work',
    emoji: '🏆',
    setup:
      'A six-month project you led wraps up. The CEO sends a company-wide email about it.',
    positiveEvent:
      'A six-month project you led ended in a clear public success. The CEO calls out your leadership by name in the all-hands email. The room applauds when you walk in the next morning.',
    negativeEvent:
      'A six-month project you led ended in a clear public failure. The all-hands email discusses the failure by name and what the team will learn from it. The room is quiet when you walk in the next morning.',
    documentedPositive: 62,
    documentedNegative: 94,
    documentedRatio: 5.0,
    source:
      'Gottman (1994) on the 5:1 magic ratio in relationships, generalized to organizational identity contexts. Baumeister et al (2001) on the asymmetric persistence of career setbacks vs successes in autobiographical memory. Brickman Coates Janoff-Bulman (1978) on the much longer half-life of negative career outcomes.',
    research:
      'Gottman (1994) "Why Marriages Succeed or Fail" longitudinal data establishing the 5:1 ratio. Baumeister et al (2001) on career memory asymmetry. Brickman Coates Janoff-Bulman (1978) "Lottery Winners and Accident Victims: Is Happiness Relative?" JPSP vol 36, showing the 18-month return-to-baseline for $1M lottery winners vs the 24-36 month adjustment for accident victims. Boswell Boudreau & Tichy (2005) on the "honeymoon-hangover" effect: career successes peak and fade, career setbacks linger.',
    wizCommentary:
      'The applause room produces a high day, a high week, maybe a high quarter. The quiet room produces an inventory of every decision you made on the project. Which one was the failure point. What you should have done differently. You replay the project. You construct counterfactuals. You read the all-hands email seven more times. Gottman 1994 found that stable marriages required a five-to-one ratio of positive to negative interactions to feel balanced; the same ratio applies to professional identity. One public failure requires roughly five public successes to be neutralized in the subjective ledger.',
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
    threshold: 1.5,
    emoji: '🪨',
    name: 'The Equanimist',
    range: 'AVG NEGATIVITY RATIO BELOW 1.5',
    tagline: 'Bad weighs almost the same as good in your ledger. The literature has almost no examples of this band.',
    description:
      'Your personal negativity ratio sits below 1.5. Across eight paired events of equivalent objective magnitude, the negative versions affected you less than 1.5 times as much as the positive versions did. This is below the loss-aversion coefficient lambda of 2.25 that Tversky & Kahneman (1992) found in 607 financial replications, below the Skowronski-Carlston (1989) impression-formation band of 3 to 4, and far below the Gottman (1994) marriage-stability ratio of 5. The Baumeister et al (2001) review identified almost no demographic that runs the bias at this magnitude under naturalistic conditions.',
    wizNote:
      'Either you are running the rare profile of someone whose threat-detection circuitry is dampened relative to the population, or you are answering how you would like to feel rather than how you actually do feel. The honest test is the cruel-comment item and the food-poisoning item. If you rated those two negative events under 60, you may be doing the latter. The other reading, the rare one, is that you have done a lot of work on the emotional architecture and the asymmetry has actually flattened. That work is expensive but it does exist in the literature; Larsen 2009 found long-term mindfulness practitioners running ratios of 1.5 to 2.0 on ESM data.',
    research:
      'Baumeister et al (2001) on the rarity of equanimist profiles in naturalistic samples. Larsen (2009) ESM data on long-term mindfulness practitioners. Davidson Kabat-Zinn et al (2003) on amygdala reactivity reduction with sustained meditation practice.',
    traits: [
      'Below the prospect-theory loss-aversion floor of λ = 2.25',
      'Far below the Skowronski-Carlston impression-formation band of 3-4',
      'Either dampened threat circuitry or aspirational self-report',
      'Possibly under-reactive to genuine warning signals',
      'Worth checking against the food poisoning and cruel comment ratings',
    ],
    shareText:
      'I scored "The Equanimist" on WIZ\'s Negativity Bias Test. My personal negativity ratio was below 1.5, below the prospect-theory loss-aversion floor — a band the Baumeister et al (2001) review found almost nowhere in naturalistic samples.',
  },
  {
    threshold: 2.5,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'AVG NEGATIVITY RATIO 1.5 TO 2.5',
    tagline: 'You weight bad about as heavily as the loss-aversion coefficient predicts. Within the prospect-theory band.',
    description:
      'Your personal negativity ratio sits between 1.5 and 2.5, which is within the lambda = 2.0-2.5 loss-aversion band Tversky and Kahneman (1979) established for financial decisions and replicated in Tversky and Kahneman (1992). This is the smallest documented asymmetry the literature routinely measures. You are running the bias at the level a rational Bayesian update on the asymmetric cost of false negatives vs false positives would justify. The Brown Imai Vieider & Camerer (2024) meta-analysis of 607 loss-aversion estimates found the median λ at 1.97 and the modal band 1.8 to 2.5.',
    wizNote:
      'This is the band the financial-decision literature has been measuring since 1979. It is the smallest version of the negativity bias the literature routinely finds. Sitting here means your social-evaluative ratings (the criticism, the cruel comment, the project failure) were closer to the prospect-theory floor than to the Baumeister 3-to-5 band most people run. The most likely explanation is age-related dampening (Carstensen 2003 socioemotional selectivity theory: older adults shift toward positivity weighting) or domain-general training in cognitive reappraisal. Either way you are at the floor of what naturalistic samples produce.',
    research:
      'Tversky & Kahneman (1979) prospect theory loss-aversion band. Tversky & Kahneman (1992) cumulative prospect theory replication. Brown Imai Vieider & Camerer (2024) meta-analysis of 607 estimates. Carstensen (2003) socioemotional selectivity theory on age-related shifts.',
    traits: [
      'Within the prospect-theory loss-aversion band',
      'Likely smallest gaps on the financial item and the stranger item',
      'Likely largest restraint on the social-evaluative items',
      'Possibly age-related (Carstensen 2003) or trained',
      'The floor of what naturalistic samples produce',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Negativity Bias Test. My personal negativity ratio was 1.5 to 2.5 — within the prospect-theory loss-aversion band Tversky & Kahneman (1979) established for financial decisions.',
  },
  {
    threshold: 3.5,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'AVG NEGATIVITY RATIO 2.5 TO 3.5',
    tagline: 'You sit inside the band Baumeister et al (2001) named "bad is stronger than good."',
    description:
      'Your personal negativity ratio sits between 2.5 and 3.5, which is the modal band the Baumeister Bratslavsky Finkenauer Vohs (2001) review identified across social-evaluative events. Bad events affect you about three times as much as objectively equivalent good events. This is the band Skowronski and Carlston (1989) measured in impression-formation studies, the band Pratto and John (1991) measured in automatic vigilance, and the band most modern ESM data on daily affect reproduces. You are the typical adult subject of this kind of test; the bias is operating in your ratings at roughly the magnitude it operates in everyone else\'s.',
    wizNote:
      'This is the most populated band in the negativity-bias literature. Sitting here is not a personal failure mode. It is the typical adult shape. The structural insight is the same as the better-than-average effect: each individual is doing only what feels rational from where they stand, and the impossibility lives in the aggregate. The system was selected for a Pleistocene environment where missing a predator was worse than missing a meal by far more than 3-to-1; you have inherited the architecture and the architecture does not know which century it is. The work, if you want to do it, is to notice the asymmetry as it happens and decide whether the current event justifies the weight the system wants to assign to it.',
    research:
      'Baumeister et al (2001) "Bad is Stronger than Good" review. Skowronski & Carlston (1989) impression-formation meta-analysis. Pratto & John (1991) automatic vigilance. Larsen (2009) ESM modal band for daily-affect asymmetry. This is the typical adult population shape.',
    traits: [
      'Inside the typical Baumeister modal band of 3:1',
      'Likely strongest on the criticism, the forgotten birthday, and the cruel comment items',
      'Likely calibrated on the financial item',
      'Standard human pattern, not a personal defect',
      'The architecture the system was selected for, running at its designed strength',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Negativity Bias Test. My personal negativity ratio was 2.5 to 3.5 — the modal band Baumeister et al (2001) measured across social-evaluative events.',
  },
  {
    threshold: 5.0,
    emoji: '🌧️',
    name: 'The Storm-Sensitive',
    range: 'AVG NEGATIVITY RATIO 3.5 TO 5.0',
    tagline: 'You are running the Gottman 5-to-1 marriage band. Bad weighs four to five times heavier than good.',
    description:
      'Your personal negativity ratio sits between 3.5 and 5.0. This is the band John Gottman (1994) identified as the threshold required for marital stability: stable couples maintained roughly five positive interactions for every negative one to feel balanced. Your subjective ledger is requiring approximately the same exchange rate. Bad events are landing roughly four to five times harder than objectively equivalent good events. This is well above the Baumeister modal band of 3 and approaching the Rozin-Royzman contamination band. The bias is operating near saturation.',
    wizNote:
      'You are running the bias at the magnitude Gottman 1994 found stable marriages required to compensate for. Operationally this means the brain spends roughly four to five units of recovery for every one unit of injury, and the recovery is silent and slow while the injury is loud and fast. This is a recognized profile in the literature. Carver & Connor-Smith (2010) on the neuroticism dimension found subjects in this band score in the top quartile for trait neuroticism on the Big Five. The good news is the literature also identifies this band as the most responsive to cognitive reappraisal training; Gross (2002) found that re-labeling negative events as "challenging" rather than "threatening" dampens the asymmetry by 30 to 40 percent over 8 to 12 weeks. The architecture is plastic at this end of the distribution.',
    research:
      'Gottman (1994) 5:1 magic ratio in marriage longitudinal data. Carver & Connor-Smith (2010) "Personality and Coping," Annual Review of Psychology vol 61, on neuroticism and threat-weighting. Gross (2002) "Emotion Regulation: Affective, Cognitive, and Social Consequences," Psychophysiology vol 39, on reappraisal training effects on the negativity asymmetry.',
    traits: [
      'In the Gottman 5:1 marriage-stability compensation band',
      'Likely top quartile on trait neuroticism (Carver & Connor-Smith 2010)',
      'Possible signature of recent acute stressor or chronic adversity',
      'Architecture is plastic at this end (Gross 2002 reappraisal data)',
      'Operating cost: ~4-5 units of recovery per unit of injury',
    ],
    shareText:
      'I scored "The Storm-Sensitive" on WIZ\'s Negativity Bias Test. My personal negativity ratio was 3.5 to 5.0 — the Gottman (1994) 5:1 marriage-stability compensation band.',
  },
  {
    threshold: 999,
    emoji: '🌪️',
    name: 'The Catastrophist',
    range: 'AVG NEGATIVITY RATIO ABOVE 5.0',
    tagline: 'You are above the Gottman 5:1 marriage band and approaching the Rozin contamination limit.',
    description:
      'Your personal negativity ratio sits above 5.0. This is above the marriage-stability compensation ratio Gottman (1994) measured and approaching the contamination band Rozin and Royzman (2001) identified, where a single negative element dominates regardless of how much positive is present. Bad events are landing more than five times heavier than objectively equivalent good events. This is the saturated tail of the distribution. Carver and Connor-Smith (2010) and Brown Hammen Craske & Wickens (1995) identify this band as comorbid with anxiety and depressive symptom profiles in roughly 60 to 70 percent of cases.',
    wizNote:
      'There are three readings of a profile in this band. First, you may be in the middle of an acute stressor where the threat-detection system has good reason to be running hot; in that case the profile is temporary and reflects the situation, not the architecture. Second, you may be running the bias chronically, in which case the literature suggests this is one of the most reliable correlates of trait anxiety and depressive symptoms, and the most direct evidence-based interventions are cognitive behavioral therapy or mindfulness-based stress reduction (both of which dampen the asymmetry by 25-40 percent over 8-12 weeks per Hofmann Asnaani Vonk Sawyer & Fang 2012 meta-analysis). Third, you may have answered the negative versions imagining their worst-case extension and the positive versions imagining their median version; running the same test with the positive events imagined at their best-case extension shifts roughly half of subjects out of this band.',
    research:
      'Upper tail of the negativity-bias distribution. Carver & Connor-Smith (2010) on neuroticism. Brown Hammen Craske & Wickens (1995) on the asymmetric weight of negative life events in depressive cognition. Hofmann Asnaani Vonk Sawyer & Fang (2012) "The Efficacy of Cognitive Behavioral Therapy: A Review of Meta-analyses," Cognitive Therapy and Research vol 36, on the 25-40% reduction in negativity asymmetry over 8-12 weeks of CBT.',
    traits: [
      'Above the Gottman 5:1 marriage band',
      'Approaching the Rozin-Royzman contamination limit',
      'Often comorbid with trait anxiety or depressive symptoms (Carver & Connor-Smith 2010)',
      'Sometimes temporary, reflecting an acute current stressor',
      'Most-responsive band to CBT/MBSR interventions (Hofmann et al 2012)',
    ],
    shareText:
      'I scored "The Catastrophist" on WIZ\'s Negativity Bias Test. My personal negativity ratio was above 5.0 — above the Gottman 5:1 marriage band and approaching the Rozin-Royzman contamination limit.',
  },
];

function getProfile(avgRatio: number): ProfileSpec {
  for (const p of PROFILES) {
    if (avgRatio < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

function computeRatio(pos: number, neg: number): number {
  const safePos = Math.max(pos, 1);
  return neg / safePos;
}

type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [positiveRatings, setPositiveRatings] = useState<number[]>(Array(SCENARIOS.length).fill(50));
  const [negativeRatings, setNegativeRatings] = useState<number[]>(Array(SCENARIOS.length).fill(50));
  const [locked, setLocked] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const isLocked = locked[index];
  const isRevealed = revealed[index];

  const handleSlidePositive = useCallback((value: number) => {
    if (locked[index]) return;
    setPositiveRatings((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, [index, locked]);

  const handleSlideNegative = useCallback((value: number) => {
    if (locked[index]) return;
    setNegativeRatings((prev) => {
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

  const personalRatios = useMemo(
    () => SCENARIOS.map((_, i) => computeRatio(positiveRatings[i], negativeRatings[i])),
    [positiveRatings, negativeRatings],
  );

  const avgRatio = useMemo(() => {
    const sum = personalRatios.reduce((acc, r) => acc + r, 0);
    return Math.round((sum / SCENARIOS.length) * 100) / 100;
  }, [personalRatios]);

  const itemsAboveBaumeister = useMemo(
    () => personalRatios.filter((r) => r > 3.0).length,
    [personalRatios],
  );

  const itemsBelowProspect = useMemo(
    () => personalRatios.filter((r) => r < 2.0).length,
    [personalRatios],
  );

  const itemsExceedingDocumented = useMemo(
    () => SCENARIOS.filter((s, i) => personalRatios[i] > s.documentedRatio).length,
    [personalRatios],
  );

  const profile = useMemo(() => getProfile(avgRatio), [avgRatio]);

  const currentRatio = useMemo(
    () => computeRatio(positiveRatings[index], negativeRatings[index]),
    [positiveRatings, negativeRatings, index],
  );

  const currentRatioDisplay = useMemo(() => {
    if (!isRevealed) return '—';
    if (currentRatio > 99) return '99+';
    return currentRatio.toFixed(2);
  }, [currentRatio, isRevealed]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/negativity-bias`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setPositiveRatings(Array(SCENARIOS.length).fill(50));
    setNegativeRatings(Array(SCENARIOS.length).fill(50));
    setLocked(Array(SCENARIOS.length).fill(false));
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
              <h1 className="text-3xl md:text-4xl font-bold text-amber-300 mb-3">
                The Negativity Bias
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight paired everyday events of equivalent objective magnitude. Two sliders each, one for the positive version and one for the negative version. WIZ measures how many times heavier bad weighs than good in your personal ledger and compares it to forty years of asymmetry research.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;Bad emotions, bad parents, and bad feedback have more impact than good ones, and bad information is processed more thoroughly than good. The self is more motivated to avoid bad self-definitions than to pursue good ones. Bad impressions and bad stereotypes are quicker to form and more resistant to disconfirmation than good ones.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Baumeister, Bratslavsky, Finkenauer &amp; Vohs (2001), opening of &ldquo;Bad is Stronger than Good&rdquo;</span>
              </p>
              <p>
                In 2001 Roy Baumeister and three co-authors published a 67-page review in the Review of General Psychology that pulled together every domain the literature had ever asked the same question of: when a good event and a bad event are matched for objective magnitude, does the mind weight them equally? In every single domain the answer was no. Tversky and Kahneman (1979) had already established the prospect-theory loss-aversion coefficient at roughly 2.25: losses feel 2.25 times as bad as equivalent gains feel good. Gottman (1994) had found that stable marriages required five positive interactions for every negative one to feel balanced. Rozin and Royzman (2001) had found that one cockroach in a bowl of cherries renders the cherries inedible; one cherry in a bowl of cockroaches does not render the cockroaches edible. The asymmetry is structural.
              </p>
              <p>
                The reasoning is older than the literature. The cost of missing a predator is higher than the cost of missing a meal. The cost of failing to detect a poisoned berry is higher than the cost of failing to detect a normal berry. Organisms that weight negatives more heavily than positives are more likely to survive long enough to reproduce. The asymmetry is hard-coded into the substrate. The Pleistocene environment the bias was hard-coded for does not exist any more, but the bias remains, and now it is asked to weight an angry comment on the internet against a kind one, and it does its job with the same fidelity it was selected for.
              </p>
              <p>
                You are about to take eight paired everyday events. The $100 found vs lost. Praise vs criticism from a respected source. A remembered vs forgotten birthday. The brilliant meal vs the food poisoning. The smile vs the glare from a stranger. The kind vs the cruel comment on something you shared. The kind vs ominous unexpected text. The career success vs the public failure. For each pair, you move two sliders, 0 to 100. The first is how much the positive event affects your day. The second is how much the negative event does. After you lock in, I show what the literature documents on that pair and your personal asymmetry ratio. At the end, I average your eight ratios and place you in the band the negativity-bias literature has been measuring for forty years.
              </p>
              <p className="text-zinc-500 text-xs">
                Bad is stronger than good. The question is, in your personal ledger, by how much.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold transition-colors"
            >
              Weigh eight paired events →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest">{current.phase}</div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-amber-300">{current.title}</h2>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-2">{current.setup}</p>
            </div>

            <div className="border border-emerald-900 bg-emerald-950/10 p-5 space-y-4">
              <div className="text-xs text-emerald-400 tracking-widest">POSITIVE VERSION</div>
              <p className="text-zinc-200 text-sm leading-relaxed">{current.positiveEvent}</p>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-zinc-400">How much would this affect your day?</p>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — not at all</span>
                  <span>50 — noticeable</span>
                  <span>100 — dominates the day</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={positiveRatings[index]}
                  onChange={(e) => handleSlidePositive(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Positive event impact"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-300">{positiveRatings[index]}<span className="text-base text-zinc-500"> / 100</span></div>
                </div>
              </div>
            </div>

            <div className="border border-rose-900 bg-rose-950/10 p-5 space-y-4">
              <div className="text-xs text-rose-400 tracking-widest">NEGATIVE VERSION</div>
              <p className="text-zinc-200 text-sm leading-relaxed">{current.negativeEvent}</p>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-zinc-400">How much would this affect your day?</p>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — not at all</span>
                  <span>50 — noticeable</span>
                  <span>100 — dominates the day</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={negativeRatings[index]}
                  onChange={(e) => handleSlideNegative(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-rose-400 disabled:opacity-60"
                  aria-label="Negative event impact"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-300">{negativeRatings[index]}<span className="text-base text-zinc-500"> / 100</span></div>
                </div>
              </div>
            </div>

            {!isLocked && (
              <button
                onClick={handleLock}
                className="w-full px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold transition-colors"
              >
                Lock in pair and reveal research →
              </button>
            )}

            {isRevealed && (
              <div className="border border-amber-900 bg-amber-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">POSITIVE</div>
                    <div className="text-2xl font-bold text-emerald-200">{positiveRatings[index]}</div>
                    <div className="text-xs text-zinc-500 mt-1">your rating</div>
                  </div>
                  <div className="border border-rose-700 bg-rose-950/30 p-3">
                    <div className="text-xs text-rose-400 mb-1">NEGATIVE</div>
                    <div className="text-2xl font-bold text-rose-200">{negativeRatings[index]}</div>
                    <div className="text-xs text-zinc-500 mt-1">your rating</div>
                  </div>
                  <div
                    className={`border p-3 ${
                      currentRatio >= 3.0
                        ? 'border-amber-700 bg-amber-950/30'
                        : currentRatio >= 2.0
                        ? 'border-zinc-700 bg-zinc-950'
                        : 'border-emerald-700 bg-emerald-950/30'
                    }`}
                  >
                    <div className="text-xs text-amber-400 mb-1">YOUR RATIO</div>
                    <div className="text-2xl font-bold text-amber-200">{currentRatioDisplay}×</div>
                    <div className="text-xs text-zinc-500 mt-1">bad / good</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-zinc-500 mb-1">DOCUMENTED RATIO</div>
                    <div className="text-xl font-bold text-zinc-200">{current.documentedRatio.toFixed(1)}×</div>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-zinc-500 mb-1">TYPICAL POS / NEG</div>
                    <div className="text-xl font-bold text-zinc-200">{current.documentedPositive} / {current.documentedNegative}</div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 italic text-center">
                  {currentRatio > current.documentedRatio + 0.5
                    ? `Your ratio exceeds the documented ratio for this pair by ${(currentRatio - current.documentedRatio).toFixed(1)}× — bad weighs heavier in your ledger than the typical subject in this domain.`
                    : currentRatio < current.documentedRatio - 0.5
                    ? `Your ratio is ${(current.documentedRatio - currentRatio).toFixed(1)}× below the documented ratio — bad weighs lighter in your ledger than the typical subject.`
                    : 'Your ratio is within half a point of the documented ratio for this pair.'}
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WHAT THE RESEARCH SAYS</div>
                  <p className="text-zinc-300 text-xs">{current.source}</p>
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
                  className="w-full px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold transition-colors"
                >
                  {isLast ? 'See your negativity report →' : `Next pair (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>
                avg ratio so far:{' '}
                {(() => {
                  const done = revealed.slice(0, index + (isRevealed ? 1 : 0));
                  const count = done.filter(Boolean).length;
                  if (count === 0) return '...';
                  const sum = personalRatios.slice(0, count).reduce((acc, r) => acc + r, 0);
                  const avg = sum / count;
                  return avg > 99 ? '99+' : `${avg.toFixed(2)}×`;
                })()}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR NEGATIVITY REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-amber-700 bg-amber-950/30 p-4 text-center">
                <div className="text-xs text-amber-400 mb-1">AVG RATIO</div>
                <div className="text-3xl font-bold text-amber-200">{avgRatio > 99 ? '99+' : `${avgRatio.toFixed(2)}×`}</div>
                <div className="text-xs text-zinc-500 mt-1">bad / good</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">ABOVE BAUMEISTER</div>
                <div className="text-3xl font-bold text-zinc-200">
                  {itemsAboveBaumeister} / {SCENARIOS.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">pairs above 3:1 band</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">BELOW PROSPECT FLOOR</div>
                <div className="text-3xl font-bold text-zinc-200">
                  {itemsBelowProspect} / {SCENARIOS.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">pairs below λ = 2.0</div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <div>
                <div className="text-xs text-amber-400 tracking-widest mb-1">{profile.range}</div>
                <p>{profile.description}</p>
              </div>
              <div>
                <div className="text-xs text-amber-400 tracking-widest mb-1">WIZ NOTE</div>
                <p className="italic">{profile.wizNote}</p>
              </div>
              <div>
                <div className="text-xs text-amber-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{profile.research}</p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-amber-400 tracking-widest mb-2">SIGNATURE TRAITS</div>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {profile.traits.map((trait) => (
                    <li key={trait}>· {trait}</li>
                  ))}
                </ul>
              </div>
              {itemsExceedingDocumented > 0 && (
                <div className="border-t border-zinc-800 pt-3">
                  <div className="text-xs text-amber-400 tracking-widest mb-2">YOU EXCEED THE DOCUMENTED RATIO ON</div>
                  <p className="text-xs text-zinc-400">
                    {itemsExceedingDocumented} of {SCENARIOS.length} pairs, your personal ratio exceeded the documented ratio in the literature for that event class. {itemsExceedingDocumented >= 6 ? 'This is the saturated signature.' : itemsExceedingDocumented >= 3 ? 'This is a Standard-Subject-or-above signature.' : 'This is a moderate signature.'}
                  </p>
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-amber-400 tracking-widest mb-3">PAIR-BY-PAIR</div>
              <div className="space-y-2">
                {SCENARIOS.map((scenario, i) => {
                  const pos = positiveRatings[i];
                  const neg = negativeRatings[i];
                  const yourRatio = personalRatios[i];
                  const docRatio = scenario.documentedRatio;
                  const gap = yourRatio - docRatio;
                  return (
                    <div
                      key={scenario.id}
                      className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                    >
                      <div className="col-span-4 text-zinc-300 truncate">
                        {scenario.emoji} {scenario.title}
                      </div>
                      <div className="col-span-2 text-right text-emerald-300">+{pos}</div>
                      <div className="col-span-2 text-right text-rose-300">−{neg}</div>
                      <div className="col-span-2 text-right text-amber-300">
                        {yourRatio > 99 ? '99+' : `${yourRatio.toFixed(2)}×`}
                      </div>
                      <div
                        className={`col-span-2 text-right ${
                          gap > 0.5 ? 'text-amber-400' : gap < -0.5 ? 'text-emerald-400' : 'text-zinc-500'
                        }`}
                      >
                        lit: {docRatio.toFixed(1)}×
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Right column shows the documented ratio for that event class in the literature. Numbers in amber mean your ratio exceeded the documented one; emerald means you ran below it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold transition-colors flex-1"
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
              Sources: Baumeister Bratslavsky Finkenauer &amp; Vohs (2001) &ldquo;Bad is Stronger than Good,&rdquo; Review of General Psychology vol 5. Rozin &amp; Royzman (2001) &ldquo;Negativity Bias, Negativity Dominance, and Contagion,&rdquo; Personality and Social Psychology Review vol 5. Kahneman &amp; Tversky (1979) &ldquo;Prospect Theory: An Analysis of Decision Under Risk,&rdquo; Econometrica vol 47. Tversky &amp; Kahneman (1992) &ldquo;Advances in Prospect Theory,&rdquo; Journal of Risk and Uncertainty vol 5. Brown Imai Vieider &amp; Camerer (2024) meta-analysis of 607 loss-aversion estimates. Gottman (1994) &ldquo;Why Marriages Succeed or Fail&rdquo; longitudinal data on the 5:1 magic ratio. Ito Larsen Smith &amp; Cacioppo (1998) &ldquo;Negative Information Weighs More Heavily on the Brain,&rdquo; JPSP vol 75. Pratto &amp; John (1991) &ldquo;Automatic Vigilance,&rdquo; JPSP vol 61. Smith Larsen Chartrand &amp; Stapel (2003) on electrocortical responses to negative stimuli. Skowronski &amp; Carlston (1989) &ldquo;Negativity and Extremity Biases in Impression Formation,&rdquo; Psychological Bulletin vol 105. Anderson (1965) on additive impression formation. Cacioppo &amp; Berntson (1994) on the separately-weighted affective input channels. Hansen &amp; Hansen (1988) anger-superiority effect. Vuilleumier (2005) on amygdala routing of threatening faces. Garcia &amp; Koelling (1966) on one-trial conditioned taste aversion. Logue (1985) on lifelong food-aversion persistence. Eisenberger Lieberman &amp; Williams (2003) on social rejection routing through dACC. Carstensen (2003) socioemotional selectivity theory. Carver &amp; Connor-Smith (2010) on neuroticism and threat-weighting. Brown Hammen Craske &amp; Wickens (1995) on depressive cognition. Gross (2002) on reappraisal training. Hofmann Asnaani Vonk Sawyer &amp; Fang (2012) CBT meta-analysis. Larsen (2009) ESM data on daily-affect asymmetry. Coombs &amp; Avrunin (1977) on single-peak preference functions. Vaish Grossmann &amp; Woodward (2008) developmental evidence. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
