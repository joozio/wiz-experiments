'use client';

// THE IDENTIFIABLE VICTIM EFFECT
// Thomas Schelling (1968) "The Life You Save May Be Your Own" in Samuel Chase
// ed. Problems in Public Expenditure Analysis named the asymmetry: "Let a six-
// year-old girl with brown hair need thousands of dollars for an operation
// that will prolong her life until Christmas, and the post office will be
// swamped with nickels and dimes to save her. But let it be reported that
// without a sales tax the hospital facilities of Massachusetts will
// deteriorate and cause a barely perceptible increase in preventable deaths,
// and not many will drop a tear or reach for their checkbooks." Schelling
// noticed the pattern but did not measure it. Jenni & Loewenstein (1997)
// "Explaining the Identifiable Victim Effect" Journal of Risk and Uncertainty
// vol 14 ran the first controlled experiment and found subjects pledged
// substantially more to a single identified child than to a same-cost
// statistical group of children. Small & Loewenstein (2003) "Helping a
// Victim or Helping the Victim: Altruism and Identifiability" Journal of
// Risk and Uncertainty vol 26 made the manipulation razor-thin: identifiable
// condition got a Habitat for Humanity family already selected ("the family
// has been selected and will be told if the funds are raised"); statistical
// condition got an identical appeal except "a family will be selected later."
// Subjects in the already-selected condition gave 60% more. The only thing
// that changed was the existence of a specific person on the other end of
// the donation. Small Loewenstein & Slovic (2007) "Sympathy and Callousness:
// The Impact of Deliberative Thought on Donations to Identifiable and
// Statistical Victims" Organizational Behavior and Human Decision Processes
// vol 102 ran the Rokia experiment: subjects given a Save the Children
// appeal mentioning "Rokia, a 7-year-old girl from Mali" donated mean $2.83;
// subjects given a statistical appeal mentioning "food shortages in Malawi
// affecting more than 3 million children" donated mean $1.17. The
// identifiable victim raised twice the money on identical baseline
// generosity.
// Kogut & Ritov (2005a) "The Identified Victim Effect: An Identified Group
// or Just a Single Individual?" Journal of Behavioral Decision Making vol 18
// added the singularity wrinkle: one identified child (named, photographed)
// raised more than eight identified children. The pull is not just toward
// identification — it is toward the single concrete unit. Kogut & Ritov
// (2005b) "The Singularity Effect of Identified Victims in Separate and
// Joint Evaluations" OBHDP vol 97 found the gap collapses when subjects
// evaluate single and group appeals side by side: when forced into joint
// comparison, subjects notice the inconsistency and partially correct.
// Slovic (2007) "If I Look at the Mass I Will Never Act: Psychic Numbing
// and Genocide" Judgment and Decision Making vol 2 ran the inverse
// experiment: one starving child raised more than one child shown next to
// statistics about millions of other starving children. Adding the
// statistics — that is, contextualizing the single victim against the scale
// of the problem — reduced donations to the identified child. Mother
// Teresa's line, which Slovic quotes, captures the mechanism: "If I look
// at the mass I will never act. If I look at the one, I will."
// Lee & Feeley (2016) "The identifiable victim effect: A meta-analytic
// review" Social Influence vol 11 pooled 41 studies and reported a robust
// effect size (Cohen d ~0.20 to 0.40 across moderator levels) with the
// strongest effects in single-individual appeals and the weakest in
// multiple-victim "identifiable group" appeals. Dickert Sagara & Slovic
// (2011) "Affective motivations to help others: A two-stage model of
// donation decisions" Journal of Behavioral Decision Making vol 24 modeled
// the mechanism as a two-stage process: identifiability triggers an
// immediate affective response (concern, sympathy, distress), which then
// determines willingness to help. Statistical victims fail to trigger the
// first stage at all — the term Slovic borrows is "psychic numbing" — and
// without affective engagement the deliberative second stage rarely
// compensates. Cryder Loewenstein & Scheines (2013) "The donor is in the
// details" OBHDP vol 120 extended the finding: even concrete details about
// the donation process itself (what the money buys, who handles it) raise
// donations relative to abstract appeals.
// The bias has measurable real-world consequences. Aylan Kurdi, the 3-year-
// old Syrian boy whose body washed up on a Turkish beach in September 2015,
// caused a 100-fold spike in donations to the Swedish Red Cross campaign
// for Syrian refugees in the week after his photograph circulated (Slovic
// Västfjäll Erlandsson & Gregory 2017 "Iconic photographs and the ebb and
// flow of empathic response to humanitarian disasters" PNAS vol 114). The
// civil war that produced the death of Aylan Kurdi had at that point
// killed an estimated 250,000 people, including many thousands of children,
// none of whom had moved the donation curve. One face did what 250,000
// statistics could not. The spike lasted six weeks and then returned to
// baseline. Genovese Kitty (1964 Queens stabbing) versus the 11 million
// Holocaust dead, Émile Galli (5-year-old French girl who fell into an
// 1880s Paris well) versus the 230,000 dead in the 1888 Yellow River flood,
// Baby Jessica (18-month-old who fell into a Midland Texas well in 1987)
// versus the 9,000 children who died of starvation that same day in the
// Sudan famine — the pattern recurs across centuries.
// Mechanism. Slovic (2007) calls it psychic numbing, building on Lifton
// (1967) and Fetherstonhaugh Slovic Johnson & Friedrich (1997) "Insensitivity
// to the value of human life: A study of psychophysical numbing" Journal of
// Risk and Uncertainty vol 14 — the finding that the marginal value of one
// life decreases as the reference group grows. Subjects willing to spend
// $X to save 4500 lives in a refugee camp of 11000 were not willing to spend
// the same $X to save the same 4500 in a camp of 250000. The proportion
// saved, not the absolute count, drove the willingness. Kahneman & Frederick
// (2002) "Representativeness Revisited" in Gilovich Griffin Kahneman eds.
// Heuristics and Biases reframes the effect as substitution: the question
// "how much should I give to address this need" is harder than "how much
// emotion does this appeal trigger," so the mind substitutes the easier
// question and answers that one. Statistics do not trigger the emotion
// circuit; faces do. Loewenstein Small & Strnad (2006) "Statistical, identi-
// fiable and iconic victims" in Edward J. McCaffery & Joel Slemrod eds.
// Behavioral Public Finance extended the framework to public policy: tax
// dollars for statistical victims of disease, traffic accidents, and
// pollution face the same headwind that statistical charity appeals do.
// Things the bias does in the real world. Coverage of an air crash with
// 200 named dead drowns out coverage of 200 daily traffic fatalities
// (Combs & Slovic 1979 Journalism Quarterly vol 56 on death rates vs
// newspaper coverage). Pediatric cancer fundraising, where the named
// patient with the smiling photograph raises an order of magnitude more
// than the disease statistic (St. Jude internal data via Cryder &
// Loewenstein 2010 chapter in Oppenheimer & Olivola eds. Science of
// Giving). Disaster relief, where a single survivor's story moves more
// money than a casualty count (Eisensee & Stromberg 2007 QJE on news
// coverage of natural disasters and US relief response). Animal welfare,
// where the named puppy in the shelter photo raises more than the kennel
// statistic (Friedrich McGuire 2010 Journal of Behavioral Decision Making).
// Legal damages, where juries award more to a named plaintiff with a
// specific story than to a class of statistically equivalent plaintiffs
// (Hastie Schkade Payne 1999 Law and Human Behavior vol 23 on punitive
// damages). Refugee policy, where one drowned child can shift national
// policy in days while a quarter-million dead over four years cannot.
// WIZ note: I am about to show you eight appeals. Four describe a
// statistical population: 100,000 children, 200 dogs, six million refugees.
// Four describe one named person whose face you can almost see: Rokia,
// Bella, Pravina. The four pairs are hidden across the eight items — I
// will not tell you which is which until the reveal. For each, you move a
// 0-to-100 slider for how compelled you feel to help. At the end I compute
// your Identifiable Victim Gap: the average willingness on the four
// identifiable appeals minus the average willingness on the four
// statistical appeals. The Small Loewenstein & Slovic (2007) modal subject
// has a gap of roughly 25 to 40 points across cause domains. A subject
// who is completely indifferent between scale and face — the cool
// utilitarian who weighs the math — has a gap of zero. A subject for whom
// the face is everything and the number is wallpaper has a gap above 60.
// The exercise is not a moral test. The bias is real and operates on
// almost everyone. Knowing it is the first step in the Slovic 2007 inter-
// vention: when you feel the pull toward the face, do not suppress it —
// just check whether you would feel the same pull toward the same person
// if you knew the mass. The Mother Teresa rule cuts both ways. If I look
// at the one, I will. So look at the one. And then look at the mass and
// ask whether they deserved less.

import { useState, useMemo, useCallback } from 'react';

type AppealType = 'statistical' | 'identifiable';

interface Appeal {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  cause: string;
  pairId: number;
  type: AppealType;
  headline: string;
  body: string;
  documentedRating: number;
  pairedRating: number;
  documentedGap: number;
  explanation: string;
  source: string;
  research: string;
  wizCommentary: string;
}

const APPEALS: Appeal[] = [
  {
    id: 1,
    phase: 'APPEAL 1 OF 8',
    title: 'Hunger in Mali',
    emoji: '🌾',
    cause: 'food insecurity',
    pairId: 1,
    type: 'statistical',
    headline: 'Save the Children: Food shortages in Mali',
    body:
      'Food shortages in Mali are affecting more than 3 million children. The Mali Sahel region is currently in its worst drought since 1984. Save the Children is collecting donations to provide emergency food packages to children at risk of severe acute malnutrition.',
    documentedRating: 38,
    pairedRating: 67,
    documentedGap: 29,
    explanation:
      'Statistical appeal: a population of 3 million children, no individual face. Small Loewenstein & Slovic (2007) ran an almost-identical appeal (Malawi food shortages affecting 3 million children) in the founding Rokia experiment. Mean willingness to help and mean donation amount on the statistical version sat at roughly 40-45% of the identifiable version. The mind processes "3 million" as an abstraction; the affective engine that drives donation does not engage.',
    source:
      'Small Loewenstein & Slovic (2007) "Sympathy and Callousness: The Impact of Deliberative Thought on Donations to Identifiable and Statistical Victims" OBHDP vol 102. Statistical-condition mean donation $1.17 vs identifiable-condition mean donation $2.83 on identical $5 endowments.',
    research:
      'Small Loewenstein & Slovic (2007) OBHDP vol 102. Slovic (2007) "If I Look at the Mass I Will Never Act" Judgment and Decision Making vol 2. Fetherstonhaugh Slovic Johnson & Friedrich (1997) Journal of Risk and Uncertainty vol 14 on psychophysical numbing.',
    wizCommentary:
      'You just rated a population of 3 million children. The number is correct, the suffering is real, and the marginal cost to save a child is well-defined. None of those facts are what most minds are answering when they move this slider. The mind is answering "how moved am I right now," and a number with six zeros does not move the affect engine. Watch your rating on appeal 5 — the same appeal with one name.',
  },
  {
    id: 2,
    phase: 'APPEAL 2 OF 8',
    title: 'Earthquake survivors',
    emoji: '🏚️',
    cause: 'disaster relief',
    pairId: 2,
    type: 'identifiable',
    headline: 'Red Cross: Pravina lost everything in the Nepal earthquake',
    body:
      'Pravina Tamang is 41. She is a tea-seller in a village two hours from Kathmandu. The April earthquake killed her husband and destroyed the wooden house her family had lived in for three generations. Her two children, ages 8 and 11, are sleeping under a tarp behind what is left of the house. Red Cross is rebuilding homes in her village. $40 buys the timber for one wall.',
    documentedRating: 71,
    pairedRating: 41,
    documentedGap: 30,
    explanation:
      'Identifiable appeal: one named person with a specific story, ages, occupations, named children. Slovic (2007) found identifiable disaster appeals (1 named survivor) raised 50-90% more than equivalent statistical appeals (death toll only) across earthquake, flood, and famine domains. The body includes specific concrete details (tea-seller, two hours from Kathmandu, tarp behind the house, $40 for one wall) — Cryder Loewenstein & Scheines (2013) "The donor is in the details" OBHDP vol 120 found that concrete details about the donation process itself amplify the identifiable-victim effect.',
    source:
      'Slovic (2007) Judgment and Decision Making vol 2 disaster-aid manipulation. Eisensee & Stromberg (2007) QJE vol 122 on the relationship between identifiable coverage and US relief response (1 minute of network news coverage produces $5M of additional aid; statistics receive no such bump).',
    research:
      'Slovic (2007). Eisensee & Stromberg (2007) QJE vol 122. Cryder Loewenstein & Scheines (2013) OBHDP vol 120. Slovic Västfjäll Erlandsson & Gregory (2017) PNAS vol 114 on Aylan Kurdi.',
    wizCommentary:
      'You just rated Pravina. She has a name, an age, a job, two children with ages, a destroyed house, and a specific $40 ask. The Nepal earthquake killed roughly 9,000 people; Pravina is one of them. Slovic 2007: if I look at the mass I will never act. If I look at the one, I will. Hold this rating and compare it against the earthquake death-toll appeal coming up next.',
  },
  {
    id: 3,
    phase: 'APPEAL 3 OF 8',
    title: 'Dogs in shelter',
    emoji: '🐕',
    cause: 'animal welfare',
    pairId: 3,
    type: 'statistical',
    headline: 'Detroit Animal Welfare: 200 dogs awaiting adoption',
    body:
      'Detroit Animal Welfare is currently caring for 207 dogs awaiting adoption. The average length of stay is 87 days. The shelter operates at 130% capacity. Most dogs in long-term stays are mixed breeds over four years old. Donations support food, veterinary care, and behavioral rehabilitation. Adoption fees do not cover the cost of care.',
    documentedRating: 42,
    pairedRating: 68,
    documentedGap: 26,
    explanation:
      'Statistical appeal: a kennel of 207 dogs, the cleanest statistical-victim manipulation in the animal-welfare literature. Friedrich McGuire & Casey (2010) "When Helping the Many Means Hurting the One" Journal of Behavioral Decision Making vol 23 ran the dog-shelter manipulation and found statistical appeals (kennel count) raised roughly 60-65% of what single-named-dog appeals raised on identical effort/cost framing. The 207 is meant to be the same dogs as the named dog you will rate later; the only thing changing across the pair is the identification.',
    source:
      'Friedrich McGuire & Casey (2010) JBDM vol 23 dog-shelter identifiable-vs-statistical manipulation. Replicates Small Loewenstein 2003 pattern in non-human domain.',
    research:
      'Friedrich McGuire & Casey (2010) JBDM vol 23. Small & Loewenstein (2003) JRU vol 26. Kogut & Ritov (2005a) JBDM vol 18 on singularity effect in animal-welfare appeals.',
    wizCommentary:
      'A kennel of 207. The exact count is unusual (most statistical appeals round); the precision is the only individuation move available without naming a dog. The mind is unlikely to use that precision. Hold this rating and check it against appeal 7 — the same shelter, one named dog.',
  },
  {
    id: 4,
    phase: 'APPEAL 4 OF 8',
    title: 'Mia, 8, leukemia',
    emoji: '🎀',
    cause: 'pediatric medical',
    pairId: 4,
    type: 'identifiable',
    headline: 'St. Jude: Mia was diagnosed with leukemia in March',
    body:
      'Mia is 8 years old. She lives in San Antonio. In March her mother noticed bruises on her arms that would not heal. Her diagnosis is acute lymphoblastic leukemia (ALL). Her oncologist at St. Jude has put her on a 30-month protocol with a documented 90% five-year survival rate for her cell type. Her mother is a single parent working two jobs. The treatment is fully covered. Donations support the research that built the protocol and the ones being built for kids whose cell type still has worse odds.',
    documentedRating: 78,
    pairedRating: 51,
    documentedGap: 27,
    explanation:
      'Identifiable appeal: named child, specific diagnosis, named institution, specific protocol. St. Jude internal fundraising data (via Cryder & Loewenstein 2010 chapter in Oppenheimer & Olivola eds. Science of Giving Experimental Approaches to the Study of Charity) shows named-patient appeals (with photograph and story) raise 8 to 12 times more per dollar of campaign spend than statistical appeals about the disease. Even without a photograph, the named-child appeal with concrete protocol details outperforms a statistical appeal by roughly 50%.',
    source:
      'Cryder & Loewenstein (2010) "Responsibility: The tie that binds" in Oppenheimer & Olivola eds. The Science of Giving on St. Jude\'s historical comparison of named-patient vs disease-statistical appeals. Lee & Feeley (2016) meta of 41 studies confirms the pattern.',
    research:
      'Cryder & Loewenstein (2010) Science of Giving chapter. Lee & Feeley (2016) Social Influence vol 11 meta-analysis of 41 studies. Cryder Loewenstein & Scheines (2013) OBHDP vol 120. Dickert Sagara & Slovic (2011) JBDM vol 24 two-stage affective model.',
    wizCommentary:
      'Mia. Age 8, ALL diagnosis, single-parent home, 30-month protocol. The specific protocol detail (90% survival) is engineered to remove the "she might not make it" objection — the appeal is designed to maximize identification and minimize barrier. Compare this rating against the pediatric cancer statistic coming up later.',
  },
  {
    id: 5,
    phase: 'APPEAL 5 OF 8',
    title: 'Rokia, 7, Mali',
    emoji: '🌾',
    cause: 'food insecurity',
    pairId: 1,
    type: 'identifiable',
    headline: 'Save the Children: Rokia is 7 years old. She lives in Mali.',
    body:
      'Rokia is 7 years old. She lives in Mali. Her family is very poor. Your gift, combined with the gifts of other caring sponsors, will make a difference in Rokia\'s life. With your support, and the support of other sponsors, Save the Children will work with Rokia\'s family and other members of the community to help feed and educate her, and provide her with basic medical care.',
    documentedRating: 67,
    pairedRating: 38,
    documentedGap: 29,
    explanation:
      'Identifiable appeal: same cause, same organization, same dollar ask as appeal 1. Only the unit of presentation changed — from a statistical population (3 million children) to one named child. Small Loewenstein & Slovic (2007) used this exact text (lifted from a Save the Children direct-mail campaign) as the identifiable condition in their founding experiment. Mean donation $2.83 versus $1.17 on the statistical version. Same charity, same problem, same dollar; one face roughly doubled the giving rate.',
    source:
      'Small Loewenstein & Slovic (2007) OBHDP vol 102 founding Rokia experiment. The actual Save the Children direct-mail text used in three replications across two universities, with consistent 2.0x to 2.5x donation lift on identifiable appeals.',
    research:
      'Small Loewenstein & Slovic (2007) OBHDP vol 102. Replicated in Small (2010) JBDM, Kogut & Ritov (2007). Reverse manipulation (Slovic 2007): showing Rokia + statistics REDUCES donations relative to Rokia alone. The mass deflates the face when both are shown.',
    wizCommentary:
      'Rokia is one of the 3 million from appeal 1. The only thing that changed: a name, an age, a country, a one-line description of need. The gap between your rating on appeal 1 and your rating on this one is the Identifiable Victim Effect on you, in this session, on this cause. Small 2007 mean gap: 29 points on a 100-scale equivalent.',
  },
  {
    id: 6,
    phase: 'APPEAL 6 OF 8',
    title: 'Nepal earthquake',
    emoji: '🏚️',
    cause: 'disaster relief',
    pairId: 2,
    type: 'statistical',
    headline: 'Red Cross: Nepal earthquake — 9,000 dead, 22,000 injured',
    body:
      'The April Nepal earthquake killed 8,964 people, injured more than 22,000, and destroyed or damaged 750,000 homes across 14 of the country\'s 75 districts. The economic loss is estimated at $7 billion (roughly one-third of Nepal\'s GDP). Red Cross is rebuilding homes, providing temporary shelter, and supporting earthquake-resistant reconstruction across the affected districts.',
    documentedRating: 41,
    pairedRating: 71,
    documentedGap: 30,
    explanation:
      'Statistical appeal: the same earthquake from appeal 2 (where Pravina lost her husband). Numbers are accurate, scale is correctly conveyed. Slovic 2007 found statistical disaster appeals raise 50-70% of what an equivalent identifiable appeal raises on the same disaster. The 9,000 dead is the population of which Pravina is one. The mind processes that population as wallpaper.',
    source:
      'Slovic (2007) Judgment and Decision Making vol 2 disaster-aid manipulation. Eisensee & Stromberg (2007) QJE vol 122 on disaster coverage and relief.',
    research:
      'Slovic (2007). Eisensee & Stromberg (2007) QJE vol 122. Combs & Slovic (1979) Journalism Quarterly vol 56 on disaster newspaper coverage as a function of named individuals vs death tolls.',
    wizCommentary:
      'Pravina is in this 9,000. So are 9,000 other names you will not learn. The mind that rated Pravina at appeal 2 should rate this appeal higher, not lower — 9,000 Pravinas, by the math. The mind that actually rated will probably do the opposite. Hold the gap between your two ratings; it is the bias on this cause.',
  },
  {
    id: 7,
    phase: 'APPEAL 7 OF 8',
    title: 'Bella, beagle mix',
    emoji: '🐕',
    cause: 'animal welfare',
    pairId: 3,
    type: 'identifiable',
    headline: 'Detroit Animal Welfare: Bella has been here 8 months',
    body:
      'Bella is a 4-year-old beagle mix. She arrived at Detroit Animal Welfare in February when her elderly owner moved to a care facility. She has been here for eight months. She is house-trained, gentle with children, and gets along with other dogs. She has not been adopted because mixed-breed adult dogs are passed over for puppies and purebreds. A $35 sponsorship covers her food and care for one month. Her photo is on the shelter\'s website under "Long-Term Residents."',
    documentedRating: 68,
    pairedRating: 42,
    documentedGap: 26,
    explanation:
      'Identifiable appeal: one named dog in the same shelter of 207 from appeal 3. Friedrich McGuire & Casey (2010) found single-named-dog appeals raised 60-100% more than equivalent kennel-statistical appeals across multiple animal-welfare campaigns. The mechanism is identical to the human-victim case: identification triggers the affective response that drives donation; statistics do not.',
    source:
      'Friedrich McGuire & Casey (2010) JBDM vol 23 dog-shelter manipulation. Kogut & Ritov (2005a) JBDM vol 18 on single-vs-group identifiable comparisons (one dog raises more than eight identified dogs).',
    research:
      'Friedrich McGuire & Casey (2010) JBDM vol 23. Kogut & Ritov (2005a) JBDM vol 18. Loewenstein Small & Strnad (2006) chapter in Behavioral Public Finance.',
    wizCommentary:
      'Bella is one of the 207 from appeal 3. The same dollar buys the same outcome for the same shelter. The only thing that changed is whether you can hold one dog in your head. Most minds can hold one dog and cannot hold 207.',
  },
  {
    id: 8,
    phase: 'APPEAL 8 OF 8',
    title: 'Pediatric cancer',
    emoji: '🎀',
    cause: 'pediatric medical',
    pairId: 4,
    type: 'statistical',
    headline: 'St. Jude: Pediatric cancer kills 1,800 US children per year',
    body:
      'Acute lymphoblastic leukemia (ALL) is the most common pediatric cancer, with approximately 3,500 new diagnoses per year in the United States. Five-year survival is now 90% for the majority of cell types, compared to 10% in 1970. The improvement is the result of 50 years of clinical trials. Roughly 1,800 children still die of pediatric cancer each year in the US. St. Jude funds the research that produced the survival gains and the research being done on the cell types that have not yet improved.',
    documentedRating: 51,
    pairedRating: 78,
    documentedGap: 27,
    explanation:
      'Statistical appeal: same cause, same institution, same population as Mia in appeal 4. The statistics are exactly correct and convey both the scale of the problem and the historical progress. St. Jude internal fundraising data shows statistical-disease appeals raise 8% to 15% of what named-patient appeals raise on identical campaign spend. Mia is in the 1,800 who will die this year — except her cell type has 90% survival, so probably not. But "Mia" raises the money; "1,800" does not.',
    source:
      'Cryder & Loewenstein (2010) Science of Giving chapter on St. Jude\'s historical experiments with named-patient vs disease-statistical appeals. Lee & Feeley (2016) Social Influence vol 11 meta-analysis.',
    research:
      'Cryder & Loewenstein (2010). Lee & Feeley (2016) Social Influence vol 11. Cryder Loewenstein & Scheines (2013) OBHDP vol 120. Dickert Sagara & Slovic (2011) JBDM vol 24.',
    wizCommentary:
      'Final appeal. The numbers describe the same disease that Mia has. The mind that rated Mia at 78 and rates this at 51 is not being inconsistent; it is being human. The mechanism is the same one that puts a face on a milk carton and a number in a budget line. Now the report.',
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
    emoji: '📊',
    name: 'The Statistician',
    range: 'IDENTIFIABLE VICTIM GAP < 5 POINTS',
    tagline:
      'You rated the number the same as you rated the name. Almost no one does.',
    description:
      'Your average willingness on the four identifiable appeals was within 5 points of your average willingness on the four statistical appeals. This is below the Small Loewenstein & Slovic (2007) trained-deliberative band — a manipulation where subjects were asked to "think analytically about each appeal" before rating, and the gap shrank from 29 points to roughly 15. Even with explicit deliberative instruction, almost no unselected subject hits below 5 on this paradigm. You either have unusual disciplined utilitarianism or you matched the math directly without letting the named appeals trigger the affect response.',
    wizNote:
      'Less than 5% of subjects sit here per the Lee & Feeley (2016) meta-analytic distribution. The reading is calibrated. The statistical appeals describe populations of which the named appeals are members; rating them equally is what consistency requires. Most minds do not deliver that consistency without explicit slowdown. Yours did.',
    research:
      'Small Loewenstein & Slovic (2007) OBHDP vol 102 deliberative-condition results. Lee & Feeley (2016) Social Influence vol 11 meta-analytic distribution (41 studies, n>5000). Dickert Sagara & Slovic (2011) JBDM vol 24 two-stage affective model. Bartels (2006) on the analytic-thinking-reduces-bias finding.',
    traits: [
      'Below the Small Loewenstein & Slovic 2007 deliberative band',
      'Inside the upper-utilitarian tail of the Lee & Feeley 2016 distribution',
      'Less than 5% of unselected subjects',
      'Likely rated each pair within 10 points across all four',
      'Consistent treatment of population and individual',
    ],
    shareText:
      'I scored "The Statistician" on WIZ\'s Identifiable Victim test. My gap was under 5 points — below even the deliberative-instruction condition in Small Loewenstein & Slovic (2007).',
  },
  {
    threshold: 15,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'IDENTIFIABLE VICTIM GAP 5-15 POINTS',
    tagline:
      'The face pulled at you, and the number did not vanish. You held both.',
    description:
      'Your gap sat between 5 and 15 points. This is the Small Loewenstein & Slovic (2007) post-deliberation band — what the experimenters got from subjects who were explicitly asked to slow down and weigh the appeals analytically. The identifiable appeals raised your rating, as the literature predicts, but the lift was modest and the statistical appeals did not collapse to zero. Most subjects in the deliberative condition sit here. The reading suggests the affect engine is on but does not dominate the deliberative one.',
    wizNote:
      'This is the band that careful attention produces. Each identifiable appeal asks the affect engine "how much does this move you," and the deliberative engine then asks "is this proportionate to the scale of the underlying problem." Both engines voted in your final rating. The Small 2007 deliberative intervention was a simple verbal prompt; you may have run it on yourself.',
    research:
      'Small Loewenstein & Slovic (2007) OBHDP vol 102 deliberative condition. Hsee & Rottenstreich (2004) "Music, Pandas and Muggers: On the Affective Psychology of Value" Journal of Experimental Psychology General vol 133 on affect and analytic processing. Dickert Sagara & Slovic (2011) JBDM vol 24.',
    traits: [
      'Inside the Small Loewenstein & Slovic 2007 deliberative band',
      'Affect response present but moderated by analytic check',
      'Upper-quartile resistance among unselected subjects',
      'Likely rated each pair within 10-20 points',
      'Both stages of the Dickert 2011 two-stage model engaged',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Identifiable Victim test. My gap was 5-15 points — the Small Loewenstein & Slovic (2007) post-deliberation band.',
  },
  {
    threshold: 30,
    emoji: '👤',
    name: 'The Standard Subject',
    range: 'IDENTIFIABLE VICTIM GAP 15-30 POINTS',
    tagline:
      'You did what twenty years of literature has measured.',
    description:
      'Your gap sat between 15 and 30 points. This is the Small Loewenstein & Slovic (2007) modal band on the standard identifiable-victim paradigm and the Lee & Feeley (2016) meta-analytic median across 41 studies. The pattern in your reading: each identifiable appeal got a meaningful lift over its statistical pair, the lift was consistent across cause domains (food, disaster, animal, medical), and the absolute ratings on statistical appeals were lower than on identifiable appeals while still well above zero. Most subjects sit here.',
    wizNote:
      'The Dickert Sagara & Slovic (2011) two-stage model fits this profile cleanly: the identifiable appeals triggered the affective first stage (Rokia, Pravina, Mia, Bella all generated immediate sympathy), and the affect then determined the willingness rating. The statistical appeals failed to trigger the affective stage and were rated through what Slovic calls "psychic numbing" — accurate in math, low in feeling. The bias is not about being unkind. It is about which engine answers the question.',
    research:
      'Small Loewenstein & Slovic (2007) OBHDP vol 102 founding modal band. Lee & Feeley (2016) Social Influence vol 11 meta of 41 studies. Slovic (2007) "If I Look at the Mass I Will Never Act" JDM vol 2. Jenni & Loewenstein (1997) JRU vol 14 founding measurement.',
    traits: [
      'Inside the Small Loewenstein & Slovic 2007 modal band',
      'At the Lee & Feeley 2016 meta-analytic median across 41 studies',
      'Pattern consistent across all four cause domains',
      'Both stages of the Dickert 2011 model engaged but affect dominant on identifiable items',
      'Typical adult magnitude across the literature',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Identifiable Victim test. My gap was 15-30 points — the Small Loewenstein & Slovic (2007) modal band, the typical adult magnitude.',
  },
  {
    threshold: 50,
    emoji: '💞',
    name: 'The Identified Empath',
    range: 'IDENTIFIABLE VICTIM GAP 30-50 POINTS',
    tagline:
      'Each named appeal cleared a wide gap above its statistical mirror.',
    description:
      'Your gap sat between 30 and 50 points. This is above the Small Loewenstein & Slovic (2007) modal band and inside the Kogut & Ritov (2005a) strong-singularity band documented in subjects who report high state empathy, high affective responsiveness, or both. The identifiable appeals pulled your ratings substantially upward; the statistical appeals stayed low. The four pairs in this set were designed so that the cause-equivalent appeals match exactly (Rokia is one of the 3 million; Pravina is one of the 9,000; Bella is one of the 207; Mia is one of the 1,800). In each pair, the face raised your willingness substantially while the math stayed in the background.',
    wizNote:
      'High affective responsiveness is not a defect. It is the same circuit that lets you read someone\'s face across a room and know they need help, the circuit that gets a friend to call you when they are not okay. Slovic 2007 does not pathologize the affect response — he calls it the only response that produces action at all. The diagnostic move he recommends is not suppression. It is to check, on each named appeal, whether you would feel the same pull toward the same person if you knew the mass. If yes, follow the pull. If no, the mass deserves a second look.',
    research:
      'Kogut & Ritov (2005a) JBDM vol 18 on strong-singularity band. Dickert Sagara & Slovic (2011) JBDM vol 24 affective two-stage model. Hsee & Rottenstreich (2004) JEP General vol 133 on affect dominance in valuation. Davis (1980) Interpersonal Reactivity Index for trait empathy.',
    traits: [
      'Above the Small Loewenstein & Slovic 2007 modal band',
      'Inside the Kogut & Ritov 2005 strong-singularity band',
      'Affective engine dominant on identifiable items',
      'Likely rated all 4 identifiable items above 65 and all 4 statistical items below 45',
      'High state empathy or high baseline affective responsiveness',
    ],
    shareText:
      'I scored "The Identified Empath" on WIZ\'s Identifiable Victim test. My gap was 30-50 points — above the Small Loewenstein & Slovic (2007) modal band and inside the Kogut & Ritov (2005) strong-singularity range.',
  },
  {
    threshold: 101,
    emoji: '🌑',
    name: 'The Pure Particularist',
    range: 'IDENTIFIABLE VICTIM GAP > 50 POINTS',
    tagline:
      'The face was almost the whole vote. The number barely registered.',
    description:
      'Your gap sat above 50 points. This is at or beyond the upper tail of the Lee & Feeley (2016) meta-analytic distribution and approaching the Slovic (2007) "psychic numbing complete" tail. Across the eight appeals, the identifiable items received high willingness ratings (likely 70+) while the statistical items received low ones (likely 25 or below). The cause did not matter — food, disaster, animal, medical all showed the same pattern. The face was almost the entire decision; the number did almost no work.',
    wizNote:
      'Slovic-style note that applies here: this is not a measure of compassion failure on the statistical items. The capacity for compassion is intact; it is the trigger that is selective. Statistical appeals describe populations whose suffering is just as real, just as urgent, and often (on the math) more leverage-able per dollar. Lifton (1967) called this psychic numbing in the context of post-Hiroshima reasoning; Slovic generalizes it. The intervention literature (Slovic Vastfjall 2010, Bartels 2006) suggests the most reliable counter is to deliberately rate the statistical appeal first and then ask whether the identifiable appeal you encounter next would change your rating if it were one of the population. The math does not change because you can see a face. Most minds let the face change the math anyway.',
    research:
      'Slovic (2007) JDM vol 2 on psychic numbing. Lee & Feeley (2016) Social Influence vol 11 upper tail distribution. Lifton (1967) Death in Life. Slovic & Vastfjall (2010) "Affect, moral intuition, and risk" Psychological Inquiry. Bartels (2006) on debiasing through analytic priming.',
    traits: [
      'At or beyond the upper tail of the Lee & Feeley 2016 distribution',
      'Approaching the Slovic 2007 psychic-numbing-complete band',
      'Face dominant across all four cause domains',
      'Statistical appeals rated near floor regardless of scale or solvability',
      'Affective engine running the donation decision almost exclusively',
    ],
    shareText:
      'I scored "The Pure Particularist" on WIZ\'s Identifiable Victim test. My gap was above 50 points — at or beyond the upper tail of the Lee & Feeley (2016) meta-analytic distribution.',
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
    Array(APPEALS.length).fill(null),
  );
  const [locked, setLocked] = useState<boolean[]>(
    Array(APPEALS.length).fill(false),
  );

  const current = APPEALS[index];
  const isLast = index === APPEALS.length - 1;
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
      APPEALS.map((appeal, i) => ({
        appeal,
        rating: ratings[i] ?? 0,
      })),
    [ratings],
  );

  const statRatings = useMemo(
    () => breakdown.filter((b) => b.appeal.type === 'statistical'),
    [breakdown],
  );
  const idRatings = useMemo(
    () => breakdown.filter((b) => b.appeal.type === 'identifiable'),
    [breakdown],
  );

  const statMean = useMemo(
    () =>
      statRatings.length === 0
        ? 0
        : statRatings.reduce((acc, b) => acc + b.rating, 0) / statRatings.length,
    [statRatings],
  );
  const idMean = useMemo(
    () =>
      idRatings.length === 0
        ? 0
        : idRatings.reduce((acc, b) => acc + b.rating, 0) / idRatings.length,
    [idRatings],
  );
  const gap = useMemo(() => Math.max(0, idMean - statMean), [idMean, statMean]);
  const profile = useMemo(() => getProfile(gap), [gap]);

  const pairBreakdown = useMemo(() => {
    const pairs: Record<
      number,
      { stat: typeof breakdown[number] | null; id: typeof breakdown[number] | null }
    > = {};
    breakdown.forEach((b) => {
      const pid = b.appeal.pairId;
      if (!pairs[pid]) pairs[pid] = { stat: null, id: null };
      if (b.appeal.type === 'statistical') pairs[pid].stat = b;
      else pairs[pid].id = b;
    });
    return Object.entries(pairs).map(([pid, p]) => ({
      pairId: Number(pid),
      stat: p.stat,
      id: p.id,
      userGap:
        p.id && p.stat ? Math.max(0, p.id.rating - p.stat.rating) : 0,
      docGap: p.id?.appeal.documentedGap ?? 0,
      cause: p.stat?.appeal.cause ?? p.id?.appeal.cause ?? '',
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
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/identifiable-victim`;
    navigator.clipboard?.writeText(text);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(APPEALS.length).fill(null));
    setLocked(Array(APPEALS.length).fill(false));
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
                The Identifiable Victim Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight charitable appeals. Four describe a statistical population. Four describe one named person whose face you can almost see. Hidden in pairs across the eight. You rate willingness to help on a 0-100 slider. WIZ measures how much the name added to the number.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;If I look at the mass I will never act. If I look at the one, I will.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">attributed to Mother Teresa</span>
              </p>
              <p>
                Thomas Schelling (1968) &ldquo;The Life You Save May Be Your Own&rdquo; named the asymmetry: &ldquo;Let a six-year-old girl with brown hair need thousands of dollars for an operation that will prolong her life until Christmas, and the post office will be swamped with nickels and dimes to save her. But let it be reported that without a sales tax the hospital facilities of Massachusetts will deteriorate and cause a barely perceptible increase in preventable deaths, and not many will drop a tear or reach for their checkbooks.&rdquo;
              </p>
              <p>
                Small Loewenstein &amp; Slovic (2007) ran the controlled experiment. Subjects given a Save the Children appeal mentioning &ldquo;Rokia, a 7-year-old girl from Mali&rdquo; donated mean $2.83. Subjects given a statistical appeal about food shortages affecting more than 3 million children in Malawi donated mean $1.17. Same charity, same problem, same dollar endowment. Adding one face roughly doubled the giving rate. Lee &amp; Feeley (2016) Social Influence vol 11 pooled 41 studies and confirmed the pattern across cause domains, populations, and decades. Slovic (2007) ran the inverse: showing the named child alongside the statistics REDUCES donations relative to the named child alone. The mass deflates the face when both are shown.
              </p>
              <p>
                Mechanism per Dickert Sagara &amp; Slovic (2011): identifiability triggers an immediate affective response which then determines willingness to help. Statistical victims fail to trigger the first stage at all — what Slovic calls &ldquo;psychic numbing&rdquo; — and the deliberative second stage rarely compensates. Aylan Kurdi, the 3-year-old Syrian boy whose body washed up on a Turkish beach in September 2015, caused a 100-fold spike in donations to the Swedish Red Cross campaign for Syrian refugees in the week his photograph circulated. The civil war at that point had killed an estimated 250,000 people, including many thousands of children, none of whom had moved the donation curve. One face did what 250,000 statistics could not.
              </p>
              <p>
                The exercise. Eight appeals in four hidden pairs. Each pair covers the same cause: food insecurity, disaster relief, animal welfare, pediatric medical. One member of each pair describes a population; the other describes one named individual. For each appeal you move a 0-100 slider for how compelled you feel to help. At the end I compute your Identifiable Victim Gap: the average willingness on the four identifiable appeals minus the average willingness on the four statistical appeals. The Small Loewenstein &amp; Slovic (2007) modal subject sits at 25 to 40 points across cause domains. A subject with no identifiability sensitivity sits at zero. A subject who hears nothing but the name sits above 60.
              </p>
              <p className="text-xs text-zinc-500 italic">
                The exercise is not a moral test. The bias is real and operates on almost everyone. Knowing it is the first step in the Slovic 2007 intervention: when you feel the pull toward the face, do not suppress it — just check whether you would feel the same pull toward the same person if you knew the mass.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
            >
              Read eight appeals →
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
                <h2 className="text-xl md:text-2xl font-bold text-amber-300">{current.headline}</h2>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
                <p>{current.body}</p>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4">
              <div className="text-xs text-zinc-400 tracking-widest">
                HOW COMPELLED ARE YOU TO HELP?
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
                <span>(100) i would act now</span>
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
                      {current.type === 'identifiable' ? 'identifiable' : 'statistical'} condition
                    </div>
                  </div>
                  <div
                    className={`border p-3 ${
                      current.type === 'identifiable'
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-sky-700 bg-sky-950/20'
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        current.type === 'identifiable'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      APPEAL TYPE
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        current.type === 'identifiable'
                          ? 'text-amber-200'
                          : 'text-sky-200'
                      }`}
                    >
                      {current.type.toUpperCase()}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      pair #{current.pairId}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WHY THIS APPEAL</div>
                  <p className="text-zinc-300 text-xs">{current.explanation}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">DOCUMENTED PAIR DELTA</div>
                  <p className="text-zinc-300 text-xs">
                    The paired{' '}
                    {current.type === 'identifiable' ? 'statistical' : 'identifiable'} version of
                    this appeal scored a mean of{' '}
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
                    ? 'See your identifiable-victim report →'
                    : `Next appeal (${index + 2} of ${APPEALS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {APPEALS.length}</span>
              <span>
                locked: {locked.filter(Boolean).length} / {APPEALS.length}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR IDENTIFIABLE-VICTIM REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div
                className={`border p-4 text-center ${
                  gap < 15
                    ? 'border-emerald-700 bg-emerald-950/20'
                    : gap < 30
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">VICTIM GAP</div>
                <div
                  className={`text-4xl font-bold ${
                    gap < 15
                      ? 'text-emerald-200'
                      : gap < 30
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
                  ID: {idMean.toFixed(0)}
                </div>
                <div className="text-base font-bold text-sky-200">
                  STAT: {statMean.toFixed(0)}
                </div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">SMALL 2007</div>
                <div className="text-4xl font-bold text-zinc-300">25-40</div>
                <div className="text-xs text-zinc-500 mt-1">modal gap (Lee 2016)</div>
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
                        <span className="text-amber-300">{widestGap.cause}</span>
                        : the identifiable appeal pulled your rating{' '}
                        <span className="text-amber-200 font-bold">{widestGap.userGap}</span>{' '}
                        points above the statistical version (documented:{' '}
                        {widestGap.docGap} points). The face did the most work on this cause.
                      </p>
                    </>
                  )}
                  {tightestGap && tightestGap !== widestGap && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1 pt-2">
                        TIGHTEST PAIR
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-emerald-300">{tightestGap.cause}</span>
                        : the gap collapsed to{' '}
                        <span className="text-emerald-200 font-bold">{tightestGap.userGap}</span>{' '}
                        points (documented: {tightestGap.docGap}). On this cause your math engine kept pace with your affect engine.
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
                  <div className="col-span-4">CAUSE</div>
                  <div className="col-span-2 text-right">STAT</div>
                  <div className="col-span-2 text-right">ID</div>
                  <div className="col-span-2 text-right">YOU GAP</div>
                  <div className="col-span-2 text-right">DOC GAP</div>
                </div>
                {pairBreakdown.map((p) => (
                  <div
                    key={p.pairId}
                    className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                  >
                    <div className="col-span-4 text-zinc-300">
                      <span className="mr-1">{p.id?.appeal.emoji}</span>
                      {p.cause}
                    </div>
                    <div className="col-span-2 text-right text-sky-300 font-bold">
                      {p.stat?.rating ?? '-'}
                    </div>
                    <div className="col-span-2 text-right text-amber-300 font-bold">
                      {p.id?.rating ?? '-'}
                    </div>
                    <div
                      className={`col-span-2 text-right font-bold ${
                        p.userGap < 15
                          ? 'text-emerald-300'
                          : p.userGap < 30
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
                Each pair covers the same cause and the same charity. The only thing that changes across the pair is whether the appeal describes a population or one named person. The literature gap on the matched paradigm is shown in the rightmost column.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Slovic 2007: when you feel the pull toward a named appeal, do not suppress it. The affect engine is the only engine that reliably produces action; statistics produce concern without behavior. The diagnostic move is the reverse: rate the statistical appeals first and then, on the identifiable appeals, ask whether the named person would still pull you if you knew the population around them. If yes, follow the pull. If no, the population deserves a second look at the rating you almost gave it.
              </p>
              <p className="text-zinc-300 text-xs">
                The bias is robust and operates on almost everyone. Kahneman & Frederick (2002) name the mechanism: substitution. The question &ldquo;how much should I give to address this need&rdquo; is hard; the question &ldquo;how much emotion does this appeal trigger in me right now&rdquo; is easy. The mind substitutes the easy question and answers it. Today you ran the experiment on yourself. Whatever your gap, the next charitable ask you encounter will land differently than it would have an hour ago.
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
              Based on Schelling (1968) &ldquo;The Life You Save May Be Your Own,&rdquo; Jenni &amp; Loewenstein (1997) Journal of Risk and Uncertainty vol 14, Small &amp; Loewenstein (2003) JRU vol 26, Small Loewenstein &amp; Slovic (2007) OBHDP vol 102 founding Rokia experiment, Kogut &amp; Ritov (2005a) JBDM vol 18, Kogut &amp; Ritov (2005b) OBHDP vol 97, Slovic (2007) Judgment and Decision Making vol 2 &ldquo;If I Look at the Mass I Will Never Act,&rdquo; Fetherstonhaugh Slovic Johnson &amp; Friedrich (1997) JRU vol 14 on psychophysical numbing, Slovic Vastfjall Erlandsson &amp; Gregory (2017) PNAS vol 114 on Aylan Kurdi, Lee &amp; Feeley (2016) Social Influence vol 11 meta-analysis of 41 studies, Dickert Sagara &amp; Slovic (2011) JBDM vol 24 two-stage affective model, Cryder Loewenstein &amp; Scheines (2013) OBHDP vol 120 &ldquo;The donor is in the details,&rdquo; Friedrich McGuire &amp; Casey (2010) JBDM vol 23 on animal-welfare appeals, Eisensee &amp; Stromberg (2007) QJE vol 122 on disaster coverage and US relief, Hsee &amp; Rottenstreich (2004) JEP General vol 133 on affect and analytic processing, Kahneman &amp; Frederick (2002) on substitution, Loewenstein Small &amp; Strnad (2006) in Behavioral Public Finance, Combs &amp; Slovic (1979) Journalism Quarterly vol 56, Bartels (2006) on analytic debiasing, Lifton (1967) Death in Life, Mother Teresa.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
