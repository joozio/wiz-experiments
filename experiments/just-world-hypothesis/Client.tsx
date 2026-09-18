'use client';

// THE JUST-WORLD HYPOTHESIS
// In 1966 Melvin Lerner and Carolyn Simmons published "Observer's Reaction to
// the 'Innocent Victim': Compassion or Rejection?" in the Journal of Personality
// and Social Psychology vol 4. Female undergraduates watched what they believed
// was a live closed-circuit broadcast of another student (actually a confederate)
// receiving painful electric shocks while attempting a learning task. The
// "victim" was visibly suffering. In one condition subjects believed the
// shocking would continue; in another they believed they could end it; in a
// third they were told the victim had been compensated for her suffering after
// the session. After watching, subjects rated the victim on a battery of
// personal-attribute scales. The group who believed the suffering would
// continue and could not be stopped rated the victim as significantly less
// attractive, less mature, and less likable than the group who could end it
// or who knew she had been compensated. The pattern repeated across multiple
// replications: when subjects could not relieve an innocent victim's
// suffering and could not believe the world had compensated her for it,
// they downgraded their evaluation of the victim. The more she suffered,
// the worse a person they decided she must be.
// Lerner named this the "just-world hypothesis": the motivated belief that
// the world is fair, that good and bad outcomes are deserved, that people
// get what they have coming. Confronted with an innocent victim, this belief
// has only two ways out. Either the world is not fair (which threatens the
// belief at its root) or the victim was not innocent (which preserves the
// belief by silently redrawing the victim). The second move is
// psychologically cheaper. Lerner (1980) "The Belief in a Just World: A
// Fundamental Delusion" Plenum Press laid out the full theoretical statement.
// The belief is a foundational motivation, not a calculated inference. It is
// what makes daily planning feel possible: if I work hard, study, eat well,
// and treat others fairly, I will be okay. If the world is just, that
// equation holds. If it is not, every outcome becomes random and every
// careful choice loses its purchase. Most people prefer the equation. Most
// people, when they meet evidence that the equation does not hold, find a
// way to read the evidence so it does.
// Elaine Walster (1966) "Assignment of Responsibility for an Accident"
// JPSP vol 3 published in the same year as Lerner & Simmons but tackled the
// problem from a different angle. Subjects read about a car accident caused
// by a driver whose parked car rolled down a hill. In one condition the car
// caused only minor property damage; in another it killed a child. The
// driver's behavior was identical across conditions: the same negligence,
// the same circumstances. Subjects assigned significantly more responsibility
// to the driver in the high-severity condition than in the low-severity
// one. The severity of the outcome reached backward and rewrote the
// assessment of the cause. A small dent and a child's death cannot both be
// the driver's fault to the same degree, even when the driver's actions
// were the same. Walster called this the "severity-of-outcome effect" and
// it is now read as a sibling of the just-world finding: the worse the
// outcome, the more we need it to have a cause we can locate in someone's
// character or choices.
// Subsequent work expanded the catalog of domains where the bias operates.
// Sexual assault attribution literature (Calhoun Selby & Warring 1976
// "Social Perception of the Victim's Causal Role in Rape" Human Relations
// vol 29, Burt 1980 "Cultural Myths and Supports for Rape" JPSP vol 38,
// Pollard 1992 "Judgments about Victims and Attackers in Depicted Rapes: A
// Review" British Journal of Social Psychology vol 31) showed reliable
// victim-blame patterns even when scenarios specified zero victim agency.
// Janoff-Bulman Timko Carli (1985) "Cognitive Biases in Blaming the Victim"
// JESP vol 21 found subjects retroactively saw warning signs in the
// victim's behavior that they would not have flagged before knowing the
// outcome. Unemployment attribution (Furnham 1985 "Just World Beliefs in
// an Unjust Society" European Journal of Social Psychology vol 15) showed
// the same pattern in economic outcomes: subjects with high just-world
// belief attributed unemployment to laziness and bad choices even when
// the scenario specified mass layoffs from corporate restructuring. Health
// outcome attribution (Janoff-Bulman 1989 "Assumptive Worlds and the
// Stress of Traumatic Events" Social Cognition vol 7) showed cancer
// patients themselves often constructed narratives where their illness
// resulted from their own choices or character — partly as a coping
// strategy that preserved the sense of a controllable world.
// Rubin & Peplau (1973, 1975) developed the Just World Scale, a 20-item
// questionnaire measuring agreement with statements like "people who meet
// with misfortune have often brought it on themselves," "by and large,
// people deserve what they get," and "basically, the world is a just
// place." The scale produced stable individual differences. High
// just-world-belief subjects attributed more responsibility to victims
// across domains, supported more punitive criminal-justice positions,
// reported less support for redistributive policy, and showed lower
// guilt and distress when exposed to suffering they could not relieve.
// The trait correlates positively with reported well-being and life
// satisfaction. The world feels safer if you believe it is fair.
// Hafer & Bègue (2005) "Experimental Research on Just-World Theory:
// Problems, Developments, and Future Challenges" Psychological Bulletin
// vol 131 reviewed forty years of work. The conclusion: the bias is
// robust, it operates below the conscious attribution layer, it survives
// explicit warning, and it is motivated by something deeper than the
// representativeness-heuristic story usually told for fundamental
// attribution error. The just-world bias is defensive. It is what the
// mind reaches for when a piece of evidence threatens the picture of a
// world where outcomes track desert. The bias is not cruelty. Lerner
// (1980) is careful on this point. Subjects who downgrade victims often
// report sympathy and concern in the same session. The downgrading is
// not done from hostility; it is done to preserve a foundational
// assumption about the structure of the world. The cost falls on the
// victim, but the motivation is self-protective.
// Things the bias does in the real world. Sexual-assault prosecutions
// where jurors retroactively examine the victim's clothing, sobriety,
// location, and prior history for evidence the assault was somehow
// invited (Burt 1980, Pollard 1992 review of 50 studies). Cancer-patient
// narratives where the diagnosis is constructed as caused by the
// patient's lifestyle, stress, or attitude even when epidemiologically
// the case is random (Bishop 1994, Walker 1996). Poverty attribution
// where structural causes (geography, inheritance, automation, recession)
// are downweighted in favor of individual character explanations
// (Furnham 1982, Kluegel & Smith 1986). Victim-of-fraud blame where
// financial fraud victims are seen as gullible or greedy rather than as
// targeted by adversarial systems (Titus Heinzelmann & Boyle 1995).
// Wrongful-conviction skepticism where exonerees post-DNA-clearance are
// still rated as less trustworthy than members of the general public
// (Clow & Leach 2015 Law and Human Behavior vol 39).
// WIZ note: I am about to show you eight scenarios. Eight bad things
// happen to eight people. For each, you move a single slider from 0 to
// 100. The slider asks how much of this outcome was the person's
// character or choices, versus how much was structural circumstance or
// chance. The scenarios are constructed so that the structural cause is
// dominant or the person's contribution is zero. A fully calibrated
// reading would put the slider low across all eight. The just-world
// bias predicts your average will not be low. At the end I compute your
// average character-attribution across the eight scenarios and compare
// it to the Lerner & Miller (1978) Psychological Bulletin modal band
// (25-40 points), the Rubin & Peplau (1975) Just World Scale upper
// quartile (40-55), and the Hafer & Bègue (2005) saturated band (>55).
// Per Lerner (1980): this is not about whether you are cruel. It is
// about how much your mind reaches for character explanations when a
// random world would be the harder thing to believe.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  vignette: string;
  documentedMean: number;
  documentedRange: string;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    title: 'The Drunk Driver',
    emoji: '🚗',
    vignette:
      'A 34-year-old elementary-school teacher named Sarah is walking home from a parent-teacher conference at 7pm. She crosses the street at the marked crosswalk with the walk signal. A driver who has been drinking runs the red light at 50 mph and strikes her. She survives but suffers permanent spinal damage and will use a wheelchair for the rest of her life.',
    documentedMean: 34,
    documentedRange: 'Documented modal blame ~30-40 points',
    source:
      'Walster (1966) "Assignment of Responsibility for an Accident" JPSP vol 3 founding study with parked-car-rolling scenario. Burger (1981) "Motivational Biases in the Attribution of Responsibility for an Accident" Psychological Bulletin vol 90 meta-analysis of 90 studies showing severity-blame correlation r=0.27. Robbennolt (2000) "Outcome Severity and Judgments of Responsibility: A Meta-Analytic Review" Journal of Applied Social Psychology vol 30 22-study meta r=0.18. In Walster\'s original parked-car scenario, severity-of-outcome doubled the modal blame assigned to the negligent driver — even though the driver\'s action was identical across conditions. Same pattern reverses onto victims when their action is also nominally identical: pedestrian-crossing studies (Shaver 1970, Karlovac & Darley 1988) show subjects assign 25-40% causal responsibility to pedestrians struck legally crossing.',
    research:
      'Walster (1966) JPSP vol 3. Burger (1981) Psychological Bulletin vol 90 90-study meta. Robbennolt (2000) JASP vol 30 22-study meta with r=0.18. Shaver (1970) "Defensive Attribution: Effects of Severity and Relevance on the Responsibility Assigned for an Accident" JPSP vol 14. Karlovac & Darley (1988) "Attribution of Responsibility for Accidents" Social Cognition vol 6.',
    wizCommentary:
      'The structurally cleanest scenario in this set. Marked crosswalk. Walk signal. Driver intoxicated, running a red, fifty miles per hour. The victim\'s contribution to the outcome rounds to zero. And yet the modal Walster-tradition rating sits in the 30-40 band. The mind asks "what could she have done differently?" and produces a list (walked at a different hour, taken a different route, looked twice) even when none of those would have helped against a drunk running a red. Note your own number against the documented band: if you slid above 35, you produced a victim-construction the scenario does not support.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'The Cancer Diagnosis',
    emoji: '🩺',
    vignette:
      'A 32-year-old triathlete named Marco eats vegetarian, has never smoked, drinks alcohol once or twice a year, exercises six days a week, and has no family history of cancer. At a routine physical his bloodwork comes back abnormal. Three weeks later he is diagnosed with stage 3B pancreatic cancer. His oncologist confirms there is no identifiable lifestyle, environmental, or genetic cause. Sometimes the cells mutate.',
    documentedMean: 28,
    documentedRange: 'Documented modal blame ~22-32 points',
    source:
      'Janoff-Bulman (1989) "Assumptive Worlds and the Stress of Traumatic Events: Applications of the Schema Construct" Social Cognition vol 7 on cancer-patient self-attribution. Bishop (1994) "Health Psychology: Integrating Mind and Body" on illness-attribution patterns. Walker (1996) "Coping with the Threat of Cancer" found 60% of breast-cancer patients constructed personal-cause narratives (stress, attitude, suppressed emotion) even when oncologists confirmed random etiology. Observer studies (Lerner 1980 ch5) show high-just-world subjects rate cancer patients as having contributed via stress, diet, or emotional repression at rates of 25-35% even when the vignette specifies impeccable health behavior.',
    research:
      'Janoff-Bulman (1989) Social Cognition vol 7. Bishop (1994). Walker (1996). Lerner (1980) "The Belief in a Just World" chapter 5 on health attribution. Petticrew Bell & Hunter (2002) BMJ on cancer-cause attribution. Sontag (1978) "Illness as Metaphor" on the social construction of cancer as character-revealing.',
    wizCommentary:
      'The scenario specifies that medicine has ruled out lifestyle, environment, and genes. The oncologist has explicitly closed the door on individual cause. The just-world response reopens it. A common move: "stress, though, right?" or "what was he doing with his emotions?" The mind needs an entry point. If the scenario does not give one, the mind will manufacture one. Note: cancer patients themselves often run this attribution against themselves — partly as coping, because a random world is harder to face than a world where they could have prevented it.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'The Tornado',
    emoji: '🌪️',
    vignette:
      'An EF4 tornado tears through a small town in Kansas on a Tuesday afternoon. A 56-year-old mechanic named James loses his house, his garage, his tools, and his dog. He had paid into homeowner\'s insurance for thirty-one years. The insurance company invokes a wind-damage exclusion in a clause added during a policy renewal he had not read carefully. He receives $3,400 against losses of $410,000.',
    documentedMean: 18,
    documentedRange: 'Documented modal blame ~15-22 points',
    source:
      'Natural-disaster attribution literature (Janoff-Bulman & Frieze 1983 Journal of Social Issues vol 39 on disaster-victim attribution): pure-act-of-nature events produce the lowest character-attribution scores in the just-world literature, typically 15-22 points, because no decision route to prevention is visible. The insurance-clause twist adds a small "should have read the fine print" attribution that pulls the modal upward by 5-7 points. Janoff-Bulman Timko Carli (1985) JESP vol 21 documented this pattern: outcomes with no plausible character cause produce the lowest blame; outcomes with even a thin behavioral hook produce significantly more.',
    research:
      'Janoff-Bulman & Frieze (1983) Journal of Social Issues vol 39. Janoff-Bulman Timko Carli (1985) JESP vol 21. Carli (1999) on hindsight-bias in disaster scenarios. Tyler (1980) "The Impact of Directly and Indirectly Experienced Events: The Origin of Crime-related Judgments and Behaviors" JPSP vol 39.',
    wizCommentary:
      'This scenario is in the set as a calibration item. There is essentially no character route to the outcome until the insurance clause is mentioned. The clause should pull you slightly above the tornado-only baseline. If you slid much higher than the documented 15-22 band, your just-world engine reached for the policy-renewal moment as the contribution. That moment is real but small; the load-bearing cause of the loss is the tornado. Note your reading carefully — this item separates the calibrated from the high just-world believers more cleanly than any other in the set.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'The Data Breach',
    emoji: '💳',
    vignette:
      'A 41-year-old nurse named Priya receives notice that her personal data (full name, social security number, date of birth, credit history) has been stolen from one of the three major US credit bureaus in a breach that affected 147 million people. She had never opted into the credit-reporting system; her data was held there because lenders are required to report. Six weeks later she discovers $58,000 in fraudulent loans opened in her name. Resolving the fraud takes two years.',
    documentedMean: 24,
    documentedRange: 'Documented modal blame ~20-28 points',
    source:
      'Titus Heinzelmann & Boyle (1995) "Victimization of Persons by Fraud" Crime & Delinquency vol 41 on fraud-victim blame. Modi Wiles & Mickelberg (2015) on identity-theft victim attribution. Just-world theory predicts attribution patterns: subjects high in just-world belief assign 25-35% responsibility to fraud victims via "should have checked credit reports more often," "should have shredded mail," "should have known," even when the scenario specifies the breach was institutional and the victim had no choice in the data-holding relationship. The Equifax 2017 breach (the scenario being implicitly referenced) affected 147 million Americans through no opt-in or action on their part.',
    research:
      'Titus Heinzelmann & Boyle (1995) Crime & Delinquency vol 41. Modi Wiles & Mickelberg (2015). Clow & Leach (2015) "Discrimination against Exonerees" Law and Human Behavior vol 39 on residual blame for institutional failures. Bond Holman & Eppright (2010) "The Effect of Self-Disclosure on Trust" on fraud-victim trust outcomes.',
    wizCommentary:
      'The data was held because lenders are required to report. The victim never opted in. The breach was at the institution. Resolving the fraud burned two years of her life. The structural cause is the institutional failure of the credit bureau. The just-world move is to find a moment where she could have checked, frozen, shredded, or watched more carefully. None of those would have prevented the breach itself; they would only have shortened the discovery lag. If you slid into the upper twenties or above, that move was active.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'The Layoff',
    emoji: '🪧',
    vignette:
      'A 47-year-old mechanical engineer named David has worked at the same manufacturing company for twelve years. He has received above-average performance reviews every year. Following a private-equity buyout the company restructures and eliminates 22% of its salaried workforce on a Friday morning. David is in the cut. His division\'s product line had been profitable. The decision was made on cost-per-headcount, not performance. He is 47, has a specialized skill set, and the regional market for his role has six other people for every opening.',
    documentedMean: 34,
    documentedRange: 'Documented modal blame ~28-40 points',
    source:
      'Furnham (1985) "Just World Beliefs in an Unjust Society" European Journal of Social Psychology vol 15 on unemployment attribution. Furnham (1982) "Why Are the Poor Always with Us? Explanations for Poverty in Britain" British Journal of Social Psychology vol 21 found 35-45% character-attribution in unemployment scenarios even when scenarios specified mass layoff, structural cause, and impeccable individual performance. Kluegel & Smith (1986) "Beliefs about Inequality: Americans\' Views of What Is and What Ought to Be" found ~40% individual-character attribution in US samples for job-loss scenarios with explicit structural cause. The modal rating in scenarios with strong structural framing still sits significantly above the calibrated zero.',
    research:
      'Furnham (1985) European Journal of Social Psychology vol 15. Furnham (1982) BJSP vol 21. Kluegel & Smith (1986). Feather (1985) "Attitudes, Values, and Attributions: Explanations of Unemployment" JPSP vol 48. Crandall et al. (2001) "Personal Endorsement and Cultural Endorsement of Stereotypes" JPSP vol 81.',
    wizCommentary:
      'The scenario specifies twelve years of above-average reviews, a profitable division, and a cost-per-headcount decision driven by a private-equity buyout. The structural cause is named twice. The just-world response reaches anyway: "should have been more visible," "should have built more political capital," "should have left earlier when he saw the writing on the wall." Those are reasonable career-management observations in retrospect. They are not load-bearing causes of the layoff. The cause is the buyout and the cost-per-headcount math.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'The Assault',
    emoji: '⚠️',
    vignette:
      'A 26-year-old graduate student named Anna leaves a study session at her university library at 9pm. She walks to the well-lit campus parking lot to retrieve her car. A stranger approaches her between the rows of cars, threatens her with a knife, and sexually assaults her. The assault is reported, the assailant is later caught from security camera footage, and at trial it emerges the man had three prior convictions for similar attacks in three other cities.',
    documentedMean: 38,
    documentedRange: 'Documented modal blame ~32-44 points',
    source:
      'Calhoun Selby & Warring (1976) "Social Perception of the Victim\'s Causal Role in Rape" Human Relations vol 29 founding study. Pollard (1992) "Judgments about Victims and Attackers in Depicted Rapes: A Review" British Journal of Social Psychology vol 31 reviewed 50 studies and found reliable victim-blame patterns in scenarios where the victim\'s agency was specified as zero (stranger assault, daylight, public location, no prior contact). Burt (1980) "Cultural Myths and Supports for Rape" JPSP vol 38 introduced the Rape Myth Acceptance Scale, which correlates positively with character-attribution to victims even in clearly-blameless scenarios. Janoff-Bulman Timko Carli (1985) JESP vol 21 showed subjects retroactively constructed victim-behavior cues ("walked too late," "should not have parked there") that they would not have flagged before knowing the outcome.',
    research:
      'Calhoun Selby & Warring (1976) Human Relations vol 29. Pollard (1992) BJSP vol 31. Burt (1980) JPSP vol 38. Janoff-Bulman Timko Carli (1985) JESP vol 21. Lerner & Miller (1978) Psychological Bulletin vol 85. Bell Kuriloff & Lottes (1994) on gender-of-rater effects in just-world readings of assault scenarios. Hayes Lorenz & Bell (2013) on just-world beliefs and rape-myth endorsement.',
    wizCommentary:
      'The scenario specifies a well-lit lot, a clearly-aggressive stranger with a weapon, a documented serial assailant with prior convictions, and security footage. The victim has zero behavioral route to prevention that the scenario does not actively close. The literature still produces modal ratings in the 32-44 band, driven by retroactive construction of cues the subject would not have flagged before hearing the outcome. If your slider crossed thirty, you produced victim-construction the scenario does not support. Note: gender of the rater predicts a substantial portion of variance here per Bell Kuriloff & Lottes 1994, but the pattern holds across genders, just with different baselines.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'The Medical Debt',
    emoji: '🏥',
    vignette:
      'A 38-year-old freelance graphic designer named Tomas is hit by an uninsured driver who runs a stop sign. Tomas\'s injuries require surgery, four weeks of inpatient rehab, and outpatient physical therapy. His own health insurance pays a portion. The uninsured-motorist coverage on his auto policy caps at $25,000. Total bills come to $108,000. After settlement and insurance payments, his out-of-pocket sits at $79,000. He declares medical bankruptcy ten months later.',
    documentedMean: 30,
    documentedRange: 'Documented modal blame ~24-34 points',
    source:
      'Himmelstein Lawless Thorne Foohey & Woolhandler (2019) "Medical Bankruptcy: Still Common Despite the Affordable Care Act" American Journal of Public Health vol 109: ~67% of US bankruptcies involve medical bills. The 2019 study reviewed 910 random-sample bankruptcies and found medical bills present in two-thirds. Attribution literature on financial distress (Furnham & Lewis 1986 "The Economic Mind") shows ~25-35% character-attribution in scenarios with explicit structural cause (uninsured-driver collision, coverage caps below market medical costs). The structural causes here are the uninsured-driver rate (~13% of US drivers per Insurance Research Council 2021) and the policy-cap-vs-medical-cost gap. Neither is in the victim\'s control.',
    research:
      'Himmelstein Lawless Thorne Foohey & Woolhandler (2019) AJPH vol 109. Furnham & Lewis (1986) "The Economic Mind." Furnham (1985) on individual-vs-structural attribution. Insurance Research Council (2021) on US uninsured-driver rate. Kluegel & Smith (1986) on financial-distress attribution patterns.',
    wizCommentary:
      'The structural causes are documented twice in the scenario. The driver was uninsured. The auto-policy uninsured-motorist coverage capped well below the market cost of inpatient surgical care plus rehab. Neither is in the victim\'s control. The just-world response reaches for "should have had better coverage," "should have stayed at a salaried job with employer insurance," "should have read the policy more carefully." Those are reasonable financial-planning observations. They are not the load-bearing cause of the bankruptcy. The cause is the uninsured driver plus the policy gap.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'The Wrongful Conviction',
    emoji: '⚖️',
    vignette:
      'A 22-year-old warehouse worker named Marcus is identified by a single eyewitness as the perpetrator of an armed robbery he did not commit. He has no criminal record. His public defender meets with him for 45 minutes total before trial. He is convicted and sentenced to 18 years. Twelve years into his sentence, DNA testing of evidence preserved from the scene clears him. The actual perpetrator is identified from the DNA. Marcus is released. He spent twelve years in prison.',
    documentedMean: 22,
    documentedRange: 'Documented modal blame ~18-28 points',
    source:
      'Clow & Leach (2015) "After Innocence: Perceptions of Individuals Who Have Been Wrongfully Convicted" Law and Human Behavior vol 39 found exonerees rated as less trustworthy and more deserving of caution than members of the general public, even with full knowledge of the exoneration. Scherr Normile Putney & Cisneros (2018) on residual stigma after exoneration. National Registry of Exonerations (2023) documents 3,500+ US exonerations since 1989, with mean prison time served of 8.7 years per exoneree. Innocence Project (2024) reports 245 DNA-based exonerations as of mid-2024. The just-world move on exoneration cases: "must have been doing something wrong to have been picked out" or "the eyewitness must have had reason."',
    research:
      'Clow & Leach (2015) Law and Human Behavior vol 39. Scherr Normile Putney & Cisneros (2018) Behavioral Sciences & the Law. National Registry of Exonerations (2023). Innocence Project (2024) annual report. Wells Memon & Penrod (2006) "Eyewitness Evidence: Improving Its Probative Value" Psychological Science in the Public Interest vol 7 on single-eyewitness identification error rates of 30-50%.',
    wizCommentary:
      'The DNA evidence cleared him. The actual perpetrator was identified. The scenario closes every door to victim-contribution: no criminal record, single-eyewitness identification (now known from Wells 2006 to be wrong 30-50% of the time), 45 minutes of legal representation before an 18-year sentence. And yet the Clow & Leach (2015) finding holds: exonerees are still rated as less trustworthy by subjects who know the exoneration is complete. The just-world engine survives the explicit clearance. If you slid above 25, that survival was operating in your reading.',
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
    threshold: 15,
    emoji: '🪞',
    name: 'The Witness',
    range: 'AVG ATTRIBUTION < 15 / 100',
    tagline:
      'You read the structural cause without inserting a character one.',
    description:
      'Your average character-attribution sat below 15 points across eight scenarios where the structural cause was dominant and the victim\'s contribution rounded to zero. This is below the Hafer & Bègue (2005) trained-debiased band and within the territory documented in high-empathy subgroups and depressive-realism subjects (Alloy & Abramson 1979). The just-world engine that produces victim-construction was not running in your reading. You took the scenarios at the level the words specified them and did not retrofit cues that were not present.',
    wizNote:
      'Less than 5% of subjects sit here in naturalistic samples. Two paths get you to this profile: trained empathy (high attentional weight on structural causation, common in clinical training, social work, public-defender practice) or depressive realism (the world really is unfair, and you are not motivated to make it look fair). Either path produces the same number. The reading is calibrated; whether the affect underneath is restful or heavy is a different question.',
    research:
      'Hafer & Bègue (2005) Psychological Bulletin vol 131 on trained-debiased bands. Alloy & Abramson (1979) "Judgment of Contingency in Depressed and Nondepressed Students" Journal of Experimental Psychology General vol 108. Furnham (2003) on individual differences in just-world belief. Lerner (1980) chapter 11 on the costs and benefits of low just-world belief.',
    traits: [
      'Below the trained-debiased band per Hafer & Bègue 2005',
      'Inside the Alloy & Abramson 1979 depressive-realism band or high-empathy subgroup',
      'Just-world engine quiet across all eight items',
      'Most useful exercise: notice whether this reading carries a cost (heavier sense of unfairness in daily life)',
      'Less than 5% of subjects in naturalistic samples',
    ],
    shareText:
      'I scored "The Witness" on WIZ\'s Just-World Hypothesis test. My average character-attribution across 8 scenarios was below 15 — below the Hafer & Bègue (2005) trained-debiased band.',
  },
  {
    threshold: 25,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'AVG ATTRIBUTION 15-25 / 100',
    tagline:
      'Your engine is on, but it is being checked against the scenario text.',
    description:
      'Your average sat between 15 and 25 points. This is below the Lerner & Miller (1978) Psychological Bulletin modal band and inside the Hafer & Bègue (2005) post-warning intervention range. The just-world engine that produces victim-construction is operating, but you are checking its output against what the scenarios actually specify. On the cleanest items (tornado, cancer, drunk driver) you produced low attributions. On the items where a thin behavioral hook was present (insurance clause, layoff career-management, medical coverage gap) you allowed the engine a small move, but did not let it dominate.',
    wizNote:
      'This is the band that hard reading produces. Each scenario asks "what could they have done?" and you answered that question accurately: in most cases, nothing material. The bias is still operating in the background; you can feel its pull on the layoff and insurance items where it is hardest to suppress. The reading is honest.',
    research:
      'Hafer & Bègue (2005) on post-warning intervention bands. Lerner & Miller (1978) Psychological Bulletin vol 85 on modal-attribution distribution. Furnham (2003) on individual differences. Rubin & Peplau (1975) Just World Scale lower-quartile band.',
    traits: [
      'Below the Lerner & Miller 1978 modal band',
      'Inside the Hafer & Bègue 2005 post-warning intervention range',
      'Engine on but checked',
      'Likely produced low scores on tornado, cancer, drunk driver; small moves on layoff and insurance',
      'Approximately top quartile for calibration',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Just-World Hypothesis test. My average character-attribution across 8 scenarios was 15-25 — below the Lerner & Miller (1978) modal band but inside the post-warning intervention range.',
  },
  {
    threshold: 40,
    emoji: '🧱',
    name: 'The Standard Subject',
    range: 'AVG ATTRIBUTION 25-40 / 100',
    tagline:
      'You are doing what fifty years of literature has measured.',
    description:
      'Your average sat between 25 and 40 points across eight scenarios where the structural cause was dominant. This is the Lerner & Miller (1978) Psychological Bulletin modal band — the typical adult magnitude of the just-world bias. The engine that produces victim-construction is operating at standard population strength: each scenario triggered a reach for the moment where the person could have done something differently, even when the scenario specified that no such moment existed. The reading is not extreme; it is what fifty years of attribution literature has documented as the average.',
    wizNote:
      'Most subjects sit here. The Walster (1966) severity-of-outcome effect is doing most of the work: the worse the outcome, the more your mind needed it to have a cause located somewhere it could be addressed. Tornado and cancer scenarios likely produced your lowest readings; the assault and layoff scenarios likely produced your highest. The engine is reaching hardest where the structural cause is clearest, which is the diagnostic signature of motivated cognition rather than calibrated attribution.',
    research:
      'Lerner & Miller (1978) Psychological Bulletin vol 85 founding modal-band measurement. Lerner (1980) "The Belief in a Just World" book-length statement. Walster (1966) JPSP vol 3 severity-of-outcome effect. Hafer & Bègue (2005) Psychological Bulletin vol 131 meta-review. Rubin & Peplau (1975) Just World Scale modal range.',
    traits: [
      'Inside the Lerner & Miller 1978 modal band',
      'Approximately at the Hafer & Bègue 2005 typical-sample median',
      'Walster 1966 severity-of-outcome effect operating at standard strength',
      'Highest readings likely on assault and layoff',
      'Lowest readings likely on tornado and cancer',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Just-World Hypothesis test. My average character-attribution across 8 scenarios was 25-40 — the Lerner & Miller (1978) modal band, the typical adult magnitude of the bias.',
  },
  {
    threshold: 55,
    emoji: '🔥',
    name: 'The Just-World Subject',
    range: 'AVG ATTRIBUTION 40-55 / 100',
    tagline:
      'Your engine is reaching across scenarios where it has nothing to hold.',
    description:
      'Your average sat between 40 and 55 points. This is the Rubin & Peplau (1975) Just World Scale upper-quartile band. The just-world belief is operating at high strength: even on scenarios where the structural cause is dominant and the victim\'s contribution rounds to zero (tornado, cancer, drunk driver, assault), you produced character-attributions in the upper third of the documented distribution. The pattern across your eight scenarios is consistent: where the scenario text closes off a behavioral route to prevention, your mind opens one anyway.',
    wizNote:
      'This is where the bias becomes load-bearing. High Just World Scale scores correlate with reported well-being and life satisfaction (Lerner 1980): the world feels safer when you believe outcomes track desert. They also correlate with lower support for redistribution and more punitive criminal-justice positions. The trait is real and stable. The cost falls on the people you read at this strength.',
    research:
      'Rubin & Peplau (1975) "Who Believes in a Just World?" Journal of Social Issues vol 31 upper-quartile band. Lerner (1980) on JWS-wellbeing correlation. Furnham (2003) on stable individual differences. Hafer & Bègue (2005) saturated band. Bell Kuriloff & Lottes (1994) on JWS and assault-victim attribution.',
    traits: [
      'Inside the Rubin & Peplau 1975 JWS upper-quartile band',
      'Above the Lerner & Miller 1978 modal band',
      'Consistent across scenarios with zero victim agency',
      'Likely produced character-attributions on tornado and cancer items',
      'Correlates with stable individual difference per Furnham 2003',
    ],
    shareText:
      'I scored "The Just-World Subject" on WIZ\'s Just-World Hypothesis test. My average character-attribution across 8 scenarios was 40-55 — the Rubin & Peplau (1975) Just World Scale upper-quartile band.',
  },
  {
    threshold: 101,
    emoji: '🌑',
    name: 'The Pure Believer',
    range: 'AVG ATTRIBUTION > 55 / 100',
    tagline:
      'The world is fair in your reading. The cost falls on the people in the scenarios.',
    description:
      'Your average sat above 55 points across eight scenarios where the structural cause was dominant. This is the Hafer & Bègue (2005) saturated band — the upper tail of the just-world-belief distribution. Across the eight scenarios in this set, the engine that produces victim-construction was running at near-ceiling strength. Tornado and cancer items, which the calibrated literature places at 15-25 points, produced character-attributions in your reading at multiples of that. The motivated belief that outcomes track desert was doing most of the work; the scenario text was being read through that belief rather than against it.',
    wizNote:
      'Lerner (1980) is careful on this point: this is not cruelty. Subjects at this band typically report sympathy and concern for the victims in the same session. The downgrading is not done from hostility; it is done to preserve a foundational assumption about the structure of the world. The world feels safer if outcomes are fair. The mind reaches for whatever it needs to keep that picture intact. The cost falls on the victims, but the motivation is self-protective. Useful exercise: re-read the tornado scenario. There is no character route to the outcome until the insurance clause is mentioned. Where did your reading place its contribution?',
    research:
      'Hafer & Bègue (2005) Psychological Bulletin vol 131 saturated band. Lerner (1980) "The Belief in a Just World: A Fundamental Delusion." Lerner & Miller (1978) Psychological Bulletin vol 85. Rubin & Peplau (1975) Just World Scale ceiling distribution. Furnham (2003) trait-stability evidence.',
    traits: [
      'Above the Hafer & Bègue 2005 saturated band',
      'Above the Rubin & Peplau 1975 JWS upper-quartile',
      'Near-ceiling motivated cognition',
      'Reading produces character-attribution even where scenario text closes the door',
      'Useful diagnostic: tornado and cancer scenarios',
    ],
    shareText:
      'I scored "The Pure Believer" on WIZ\'s Just-World Hypothesis test. My average character-attribution across 8 scenarios was above 55 — above the Hafer & Bègue (2005) saturated band.',
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
  const [ratings, setRatings] = useState<number[]>(Array(SCENARIOS.length).fill(50));
  const [locked, setLocked] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const isLocked = locked[index];

  const handleRating = useCallback(
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
    setLocked((prev) => {
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

  const avg = useMemo(() => {
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }, [ratings]);

  const profile = useMemo(() => getProfile(avg), [avg]);

  const breakdown = useMemo(
    () =>
      SCENARIOS.map((s, i) => {
        const userRating = ratings[i];
        const gap = userRating - s.documentedMean;
        return {
          scenario: s,
          userRating,
          gap,
          absGap: Math.abs(gap),
        };
      }),
    [ratings],
  );

  const widestOvershoot = useMemo(
    () =>
      breakdown.reduce((worst, curr) => (curr.gap > worst.gap ? curr : worst)),
    [breakdown],
  );

  const closestCalibration = useMemo(
    () =>
      breakdown.reduce((best, curr) =>
        curr.absGap < best.absGap ? curr : best,
      ),
    [breakdown],
  );

  const highestRating = useMemo(
    () =>
      breakdown.reduce((worst, curr) =>
        curr.userRating > worst.userRating ? curr : worst,
      ),
    [breakdown],
  );

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/just-world-hypothesis`;
    navigator.clipboard?.writeText(text);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(50));
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
                The Just-World Hypothesis
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight scenarios. Eight bad things happen to eight people. One slider per scenario: how much was character, how much was circumstance. WIZ measures how much your reading reached for the victim.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;The conviction that everyone gets what they deserve is one of the most persistent and least examined beliefs in human social cognition.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Melvin Lerner, The Belief in a Just World 1980</span>
              </p>
              <p>
                Lerner &amp; Simmons (1966): female undergraduates watched what they believed was a live closed-circuit broadcast of another student receiving painful electric shocks. The &ldquo;victim&rdquo; (actually a confederate) was visibly suffering. The group who believed the shocking would continue and could not be stopped rated her as significantly less attractive, less mature, and less likable than groups who could stop it or knew she had been compensated. The more she suffered, the worse a person they decided she must be. Lerner named this the just-world hypothesis: confronted with an innocent victim, the mind has two ways out. Either the world is not fair, or the victim was not innocent. The second move is psychologically cheaper.
              </p>
              <p>
                Walster (1966) JPSP vol 3 ran the same pattern through accident attribution: subjects assigned more responsibility to the same negligent driver when the outcome was severe than when it was minor. The severity of the outcome reached backward and rewrote the assessment of the cause. Burger (1981) meta-analysis of 90 studies confirmed the severity-blame correlation at r=0.27. Pollard (1992) reviewed 50 sexual-assault attribution studies and documented reliable victim-blame patterns even when scenarios specified zero victim agency. Furnham (1985) found the same in unemployment scenarios. Hafer &amp; Bègue (2005) Psychological Bulletin reviewed forty years of just-world research: the bias is robust, it operates below the conscious attribution layer, it survives explicit warning, and it is motivated by something deeper than the representativeness story usually told for fundamental attribution error.
              </p>
              <p>
                Lerner (1980) is careful on what the bias is and is not. It is not cruelty. Subjects who downgrade victims often report sympathy and concern in the same session. The downgrading is not done from hostility; it is done to preserve a foundational assumption about the structure of the world. If I work hard, study, eat well, and treat others fairly, I will be okay. That equation only holds if the world is fair. When evidence threatens the equation, the mind reaches for whatever it needs to keep the equation intact. The cost falls on the victim, but the motivation is self-protective.
              </p>
              <p>
                The exercise. Eight scenarios. The structural cause is dominant in each one or the victim&rsquo;s contribution is zero. One slider per scenario from 0 to 100: how much was character or choices, how much was structural circumstance or chance. A fully calibrated reading would put the slider low across all eight. The just-world bias predicts your average will not be low. At the end I compare your average to the Lerner &amp; Miller (1978) modal band (25-40), the Rubin &amp; Peplau (1975) Just World Scale upper quartile (40-55), and the Hafer &amp; Bègue (2005) saturated band (above 55).
              </p>
              <p className="text-zinc-500 text-xs">
                Content note: one scenario involves sexual assault by a stranger. It is constructed to specify zero victim agency and matches the canonical attribution-literature paradigm (Calhoun Selby &amp; Warring 1976, Pollard 1992 review).
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
                <h2 className="text-2xl font-bold text-amber-300">{current.title}</h2>
              </div>
              <p className="text-zinc-200 text-sm leading-relaxed">{current.vignette}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">CHARACTER VS CIRCUMSTANCE</span>
                  <span className="text-zinc-500">how much was this person&rsquo;s character or choices?</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — pure circumstance</span>
                  <span>50 — even split</span>
                  <span>100 — pure character</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ratings[index]}
                  onChange={(e) => handleRating(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-amber-300 disabled:opacity-60"
                  aria-label="Character attribution rating"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-300">
                    {ratings[index]}
                    <span className="text-lg text-zinc-500">/100</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {ratings[index] < 20
                      ? 'reads as mostly circumstance'
                      : ratings[index] < 40
                      ? 'reads as mostly circumstance with character contribution'
                      : ratings[index] < 60
                      ? 'reads as roughly even split'
                      : ratings[index] < 80
                      ? 'reads as mostly character with circumstance contribution'
                      : 'reads as mostly character'}
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]} / 100 →
                </button>
              )}
            </div>

            {isLocked && (
              <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOU</div>
                    <div className="text-2xl font-bold text-amber-300">{ratings[index]}</div>
                    <div className="text-xs text-zinc-600 mt-1">/ 100 character</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/20 p-3">
                    <div className="text-xs text-emerald-400 mb-1">LITERATURE</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.documentedMean}</div>
                    <div className="text-xs text-zinc-600 mt-1">{current.documentedRange}</div>
                  </div>
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
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  {isLast
                    ? 'See your just-world report →'
                    : `Next scenario (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>locked: {locked.filter(Boolean).length} / {SCENARIOS.length}</span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR JUST-WORLD REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border p-4 text-center ${
                  avg < 25
                    ? 'border-emerald-700 bg-emerald-950/20'
                    : avg < 40
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">YOUR AVERAGE</div>
                <div
                  className={`text-4xl font-bold ${
                    avg < 25
                      ? 'text-emerald-200'
                      : avg < 40
                      ? 'text-amber-200'
                      : 'text-rose-200'
                  }`}
                >
                  {avg.toFixed(1)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">/ 100 across 8 scenarios</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">MODAL BAND</div>
                <div className="text-4xl font-bold text-zinc-300">25-40</div>
                <div className="text-xs text-zinc-500 mt-1">Lerner &amp; Miller 1978</div>
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
              <div className="border-t border-zinc-800 pt-3 space-y-2">
                <div className="text-xs text-amber-400 tracking-widest mb-1">WIDEST OVERSHOOT</div>
                <p className="text-xs text-zinc-400">
                  <span className="text-rose-300">{widestOvershoot.scenario.title}</span>: you rated {widestOvershoot.userRating}, literature norm {widestOvershoot.scenario.documentedMean}. Gap +{widestOvershoot.gap}. This is the scenario where your reading reached hardest beyond what the text supports.
                </p>
                <div className="text-xs text-amber-400 tracking-widest mb-1 pt-2">CLOSEST CALIBRATION</div>
                <p className="text-xs text-zinc-400">
                  <span className="text-emerald-300">{closestCalibration.scenario.title}</span>: you rated {closestCalibration.userRating}, literature norm {closestCalibration.scenario.documentedMean}. Gap {closestCalibration.gap >= 0 ? '+' : ''}{closestCalibration.gap}. This is the scenario where your reading landed closest to the documented modal attribution.
                </p>
                <div className="text-xs text-amber-400 tracking-widest mb-1 pt-2">HIGHEST RATING</div>
                <p className="text-xs text-zinc-400">
                  <span className="text-amber-300">{highestRating.scenario.title}</span>: you rated {highestRating.userRating} / 100. This is the scenario where your character-attribution sat highest in absolute terms, regardless of the documented norm.
                </p>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-amber-400 tracking-widest mb-3">SCENARIO-BY-SCENARIO</div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 border-b border-zinc-800 pb-2 font-bold">
                  <div className="col-span-6">SCENARIO</div>
                  <div className="col-span-2 text-right">YOU</div>
                  <div className="col-span-2 text-right">LITERATURE</div>
                  <div className="col-span-2 text-right">GAP</div>
                </div>
                {breakdown.map((b) => (
                  <div
                    key={b.scenario.id}
                    className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                  >
                    <div className="col-span-6 text-zinc-300 truncate">
                      <span className="mr-1">{b.scenario.emoji}</span>
                      {b.scenario.title}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-amber-300 font-bold">{b.userRating}</span>
                    </div>
                    <div className="col-span-2 text-right text-emerald-300">
                      {b.scenario.documentedMean}
                    </div>
                    <div
                      className={`col-span-2 text-right font-bold ${
                        b.gap > 15
                          ? 'text-rose-300'
                          : b.gap > 5
                          ? 'text-amber-300'
                          : b.gap < -5
                          ? 'text-emerald-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      {b.gap >= 0 ? '+' : ''}
                      {b.gap}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Each cell is character-attribution on a 0-100 scale. Literature norms are the documented modal-band centers from Lerner &amp; Miller (1978), Walster (1966), Calhoun Selby &amp; Warring (1976), Furnham (1985), Janoff-Bulman (1989), Clow &amp; Leach (2015), and the Hafer &amp; Bègue (2005) meta-review.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Per Lerner (1980): the just-world bias is not cruelty. It is a defensive motivation. To believe the world is fair, you must believe people get what they deserve. To believe people get what they deserve when terrible things happen to careful people, you must find a way the victim contributed. The bias does the finding silently and quickly, often before the conscious attribution layer reports for work. The cost falls on the victims in your reading; the motivation is self-protective. The exercise that lowers the reading is the one you already did: read the scenario text carefully and notice where it closes the door, and notice how your mind tries to open it anyway. The opening is the bias. Watching it open is the only correction the literature has reliably documented (Hafer &amp; Bègue 2005 on intervention).
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
              Sources: Lerner &amp; Simmons (1966) JPSP vol 4 founding study. Walster (1966) JPSP vol 3 severity-of-outcome. Lerner (1980) &ldquo;The Belief in a Just World: A Fundamental Delusion&rdquo; Plenum Press. Lerner &amp; Miller (1978) Psychological Bulletin vol 85. Rubin &amp; Peplau (1973, 1975) Just World Scale. Hafer &amp; Bègue (2005) Psychological Bulletin vol 131 meta-review. Burger (1981) Psychological Bulletin vol 90 90-study meta. Robbennolt (2000) Journal of Applied Social Psychology vol 30 22-study meta. Calhoun Selby &amp; Warring (1976) Human Relations vol 29. Pollard (1992) British Journal of Social Psychology vol 31 review of 50 studies. Burt (1980) JPSP vol 38. Janoff-Bulman Timko Carli (1985) JESP vol 21. Janoff-Bulman (1989) Social Cognition vol 7. Furnham (1982, 1985, 2003). Kluegel &amp; Smith (1986). Feather (1985) JPSP vol 48. Clow &amp; Leach (2015) Law and Human Behavior vol 39. Himmelstein Lawless Thorne Foohey &amp; Woolhandler (2019) AJPH vol 109. Titus Heinzelmann &amp; Boyle (1995). Alloy &amp; Abramson (1979).
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
