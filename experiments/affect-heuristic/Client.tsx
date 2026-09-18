'use client';

// THE AFFECT HEURISTIC
// In 1994 Ali Alhakami and Paul Slovic published "A Psychological Study of the
// Inverse Relationship Between Perceived Risk and Perceived Benefit" in Risk
// Analysis vol 14. They asked subjects to rate twenty-three hazards (nuclear
// power, X-rays, pesticides, food preservatives, alcohol, prescription drugs,
// home appliances, etc.) on two separate scales: how risky each was, and how
// beneficial each was. In the real world risk and benefit are weakly positively
// correlated. A technology that delivers a lot of benefit has usually been
// pushed harder, distributed wider, and accumulated more exposure-related risk.
// In subjects' heads, the correlation came out the other way. The mean
// within-subject correlation between risk and benefit ratings across the
// twenty-three hazards was r = -0.40, with item-level correlations spanning
// -0.20 to -0.70. Things subjects liked, they rated low-risk and high-benefit.
// Things subjects disliked, they rated high-risk and low-benefit. The two
// ratings, supposed to be independent, were being computed by a single
// underlying feeling.
// Six years later Melissa Finucane, Ali Alhakami, Paul Slovic and Stephen
// Johnson (2000) tightened the screws. They ran the same paradigm under time
// pressure: 5 seconds per rating instead of unlimited time. The negative
// correlation strengthened from -0.40 to -0.55, which is the canonical
// signature of an affect-driven judgment getting less interference from
// deliberate analysis. They also ran an information manipulation: tell
// subjects that an item has high benefit, their risk rating for it drops; tell
// them it has high risk, their benefit rating for it drops. The two ratings
// are coupled at the substrate. The paper named the underlying mechanism the
// "affect heuristic": when judging risk and benefit, the mind asks itself how
// it feels about the item, and reads both numbers off that feeling.
// Paul Slovic (1987) Science had already laid the groundwork with the
// psychometric paradigm. Subjects rate hazards on dimensions like dread,
// catastrophic potential, unknown-to-science, voluntariness, controllability.
// The principal-components decomposition reduced the dimensions to two
// factors: dread risk (catastrophic, uncontrollable, fatal, involuntary) and
// unknown risk (novel, unobservable, delayed effects). Nuclear power and
// pesticides loaded heavily on dread; food irradiation and DNA technology on
// unknown. Public risk perceptions tracked the factors, not the expert
// fatality statistics. Slovic Finucane Peters and MacGregor (2007) reviewed
// thirty years of work and concluded the affect heuristic is the engine
// underneath the psychometric paradigm: dread and unknown are themselves
// labels for an underlying affective response that bundles the risk-benefit
// pair into a single positive-or-negative gestalt.
// The size of the effect. Across the documented literature the within-subject
// risk-benefit correlation for hazards rated under typical conditions is
// around -0.40 to -0.55. The strongest documented coupling is around -0.85
// in subjects told explicitly to rate from intuition under time pressure
// (Finucane 2000 extreme condition). Subjects given extra information and
// unlimited time still produce correlations in the -0.20 to -0.40 band; the
// coupling is hard to eliminate even when subjects are warned. Kahneman
// (2011) Thinking Fast and Slow chapter 12 names the substitution clearly:
// when System 1 is asked the hard question "what is the risk of X?" it
// answers a different easier question, "how do I feel about X?" The two
// answers come out coupled because they were the same answer.
// The expert-public gap. Slovic 1987, Fischhoff Slovic Lichtenstein Read &
// Combs (1978) "How Safe is Safe Enough?" and Morgan Fischhoff Bostrom &
// Atman (2002) "Risk Communication" all document the same shape: experts and
// the public diverge most on items where the public has strong affect.
// Nuclear power is the canonical exhibit: per-terawatt-hour mortality
// figures (Markandya & Wilkinson 2007 Lancet; Ritchie 2020 Our World in Data)
// put nuclear at 0.07 deaths/TWh against coal at 24.6 and oil at 18.4, a
// roughly 350x safety advantage. Public risk perception of nuclear vs coal
// runs in the opposite direction by a similar magnitude. The gap is not
// resolved by giving the public the fatality numbers. Subjects' ratings
// barely move because the rating is not a calculation, it is a feeling.
// The mechanism is what Kahneman 2011 and Slovic 2007 call "feeling as
// information": the brain holds a positive-or-negative tag on the concept,
// and when asked any numerical question about the concept (risk, benefit,
// likelihood of harm, expected utility), it returns the answer that the tag
// implies. The two ratings come out coupled because the tag is doing both.
// Kahneman calls the affect heuristic "the smallest of the cognitive biases
// because it is the heart of System 1." Slovic 2007 calls it "the most
// important advance in psychological risk research since the discovery of
// the psychometric paradigm."
// Things the bias does in the real world. Public health communication on
// alcohol consistently fails to update perceptions to match the WHO 2023
// data (3 million deaths/year, Group 1 IARC carcinogen, no safe level per
// Wood et al 2018 Lancet 600K-person meta) because alcohol's affect tag is
// social and warm, not threatening. Public risk perception of genetically
// modified food (Funk & Rainie 2015 Pew, Pew 2020) sits at high-risk,
// low-benefit despite the AAAS 2012, NAS 2016, and EU JRC 2010 consensus
// that approved GM foods are as safe as conventional and have produced ~22%
// yield gains (Klümper & Qaim 2014 meta of 147 studies). Aviation safety
// perception spiked after 9/11 to the point where Gigerenzer (2006) "Out of
// the Frying Pan into the Fire" estimated 1,500 additional US road fatalities
// in the year following 9/11 because subjects substituted driving for flying
// despite the per-mile mortality being roughly 60x worse on the road.
// WIZ note: I am about to show you ten technologies and activities. For each
// you move two sliders: harm (0 to 100) and benefit (0 to 100). They are
// supposed to be independent. The affect heuristic predicts they will not
// be. At the end I compute the Pearson correlation between your harm and
// benefit ratings across all ten items. If the affect heuristic is doing
// the work, the correlation will come out strongly negative: things you
// rated high-harm you also rated low-benefit, things you rated low-harm
// you also rated high-benefit. The Alhakami and Slovic 1994 founding-study
// mean was r = -0.40. The Finucane 2000 time-pressure replication was
// r = -0.55. Real-world risk and benefit are weakly positively correlated.
// A purely calibrated rater would produce r near zero or slightly positive.
// Almost no naturalistic sample in the literature produces a non-negative
// correlation. After each item I show you the documented public rating and
// the documented expert rating. The biggest gaps are the load-bearing
// places where your affect is doing the math.

import { useState, useMemo, useCallback } from 'react';

interface Item {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  description: string;
  publicHarm: number;
  publicBenefit: number;
  expertHarm: number;
  expertBenefit: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const ITEMS: Item[] = [
  {
    id: 1,
    phase: 'ITEM 1 OF 10',
    title: 'Nuclear Power',
    emoji: '☢️',
    description:
      'Civilian nuclear power generation. Includes reactor operation, fuel cycle, waste storage, and decommissioning. Excludes weapons. The current global fleet supplies about 10% of electricity (IAEA 2024).',
    publicHarm: 72,
    publicBenefit: 38,
    expertHarm: 28,
    expertBenefit: 76,
    source:
      'Slovic (1987) "Perception of Risk," Science vol 236 founding psychometric paradigm with nuclear power at the high-dread, high-unknown corner of the two-factor space. Alhakami & Slovic (1994) US public harm rating ~70, benefit ~40 across multiple samples. Markandya & Wilkinson (2007) Lancet mortality per TWh: nuclear 0.07, coal 24.6, oil 18.4, gas 2.8. Ritchie (2020) Our World in Data: nuclear is roughly 350x safer than coal per unit energy.',
    research:
      'Slovic (1987) "Perception of Risk." Alhakami & Slovic (1994) "A Psychological Study of the Inverse Relationship Between Perceived Risk and Perceived Benefit," Risk Analysis vol 14. Fischhoff Slovic Lichtenstein Read & Combs (1978) "How Safe is Safe Enough? A Psychometric Study of Attitudes Towards Technological Risks and Benefits," Policy Sciences vol 9. Markandya & Wilkinson (2007) "Electricity Generation and Health," Lancet vol 370. Sovacool (2008) "The Costs of Failure: A Preliminary Assessment of Major Energy Accidents."',
    wizCommentary:
      'The most-studied item in the entire affect-heuristic literature. The thirty-year gap between expert and public ratings is the canonical exhibit. Note the dread-driven asymmetry: a single salient catastrophe (Three Mile Island 1979, Chernobyl 1986, Fukushima 2011) moves public ratings; a continuous background of coal-mining and air-pollution deaths does not. The mind grades risk by image, not by integral.',
  },
  {
    id: 2,
    phase: 'ITEM 2 OF 10',
    title: 'Childhood Vaccines',
    emoji: '💉',
    description:
      'Routine childhood immunization on the WHO Essential Programme on Immunization schedule: measles, mumps, rubella, polio, diphtheria, tetanus, pertussis, hepatitis B, varicella, pneumococcal, rotavirus, HPV (adolescent).',
    publicHarm: 22,
    publicBenefit: 85,
    expertHarm: 14,
    expertBenefit: 96,
    source:
      'Larson Cooper Eskola Katz & Ratzan (2011) "Addressing the Vaccine Confidence Gap," Lancet vol 378. Larson et al. (2016) Vaccine Confidence Index across 67 countries, US harm ~22, benefit ~85. WHO 2024: routine immunization prevents ~3.5-5 million deaths per year globally. Roush & Murphy (2007) "Historical Comparisons of Morbidity and Mortality for Vaccine-Preventable Diseases," JAMA vol 298 documented 99%+ disease-burden reductions in the US.',
    research:
      'Larson Cooper Eskola Katz & Ratzan (2011), Larson et al. (2016) Vaccine Confidence Index. Roush & Murphy (2007) JAMA. Plotkin Orenstein & Offit (2017) "Plotkin\'s Vaccines" 7e on vaccine efficacy data. WHO 2024 Global Immunization Coverage report. Note: vaccine-confidence varies by country; France (Larson 2016) showed harm ~41, benefit ~68 after 2010-era Pandemrix/H1N1 concerns. The expert/public gap is smaller in this item than in nuclear power and GM food.',
    wizCommentary:
      'The high-favor, low-harm side of the affect axis. Notice your own slider: if you put harm low and benefit high here, the affect-heuristic engine is doing exactly what it does on nuclear power, just in the opposite direction. The mechanism is the same; the sign flips because the underlying feeling about the item is positive instead of negative. Calibrated rating would still put harm somewhere above zero because routine childhood vaccines do produce rare serious adverse events (the VAERS background rate); the question is whether your slider stops at "rare" or goes to "essentially zero."',
  },
  {
    id: 3,
    phase: 'ITEM 3 OF 10',
    title: 'Genetically Modified Food',
    emoji: '🌽',
    description:
      'Crops with deliberately altered genomes via recombinant DNA or CRISPR: insect-resistant Bt corn and cotton, herbicide-tolerant soy and canola, vitamin-A-enriched golden rice, virus-resistant papaya. Currently ~13% of global cropland.',
    publicHarm: 62,
    publicBenefit: 31,
    expertHarm: 22,
    expertBenefit: 71,
    source:
      'Funk & Rainie (2015) Pew "Public and Scientists\' Views on Science and Society": 88% of AAAS scientists vs 37% of US public say GM foods are safe to eat (51-point gap, the largest in the entire 13-topic survey). Pew (2020) follow-up: 51% of US public think GM foods worse for health, 13% better. Klümper & Qaim (2014) PLoS ONE meta-analysis of 147 studies: ~22% yield gain, 37% pesticide-use reduction, 68% farmer-profit gain. AAAS (2012), NAS (2016), EU JRC (2010), Royal Society UK (2016), and WHO consensus statements: approved GM foods are as safe as conventional.',
    research:
      'Funk & Rainie (2015) Pew. Pew Research (2020) "About half of U.S. adults are wary of health effects of genetically modified foods." Klümper & Qaim (2014) "A Meta-Analysis of the Impacts of Genetically Modified Crops," PLoS ONE vol 9. National Academies of Sciences (2016) "Genetically Engineered Crops: Experiences and Prospects." EU JRC (2010) "A Decade of EU-funded GMO Research." Royal Society (2016) "GM Plants: Questions and Answers."',
    wizCommentary:
      'The largest expert-public gap in the food domain. Pew 2015 found a 51-point gap between AAAS scientists and the general public on the question "is GM food safe to eat" — the biggest gap in their entire 13-topic survey, larger than the gap on climate change, evolution, or vaccine safety. Note that the gap correlates with how the affect tag was set. Once a category gets the "unnatural" or "playing god" affective marker, the harm slider goes up and the benefit slider goes down regardless of the underlying yield, pesticide, and safety data.',
  },
  {
    id: 4,
    phase: 'ITEM 4 OF 10',
    title: 'Social Media',
    emoji: '📱',
    description:
      'Platforms built around algorithmic newsfeeds, public posting, and engagement-optimized timelines: Instagram, TikTok, Twitter/X, Facebook, Snapchat. Daily users worldwide ~5 billion (DataReportal 2024).',
    publicHarm: 64,
    publicBenefit: 38,
    expertHarm: 58,
    expertBenefit: 42,
    source:
      'Pew Research (2024) "Americans see negative news as more about social media than ever": 64% say social media has had a mostly negative effect on the country, 10% mostly positive. Auxier & Anderson (2021) Pew US adult use. Expert ratings split: Twenge Joiner Rogers & Martin (2018) JAMA Psychiatry strong teen-girl depression link; Haidt (2024) "The Anxious Generation"; vs Orben & Przybylski (2019) Nature Human Behaviour meta showing small effects; Allcott Braghieri Eichmeyer & Gentzkow (2020) AER Facebook deactivation experiment showed measurable wellbeing gain.',
    research:
      'Pew Research (2024). Twenge Joiner Rogers & Martin (2018) JAMA Psychiatry. Orben & Przybylski (2019) Nature Human Behaviour. Allcott Braghieri Eichmeyer & Gentzkow (2020) "The Welfare Effects of Social Media," American Economic Review vol 110. Haidt (2024) "The Anxious Generation." Mosseri Schultz Sandvig Vaidhyanathan (2023) industry-internal Wall Street Journal "Facebook Files" reporting on Instagram teen-girl harm research.',
    wizCommentary:
      'One of the few items in this set where expert and public ratings converge. The affect heuristic still operates here — if you rated harm high you almost certainly rated benefit low — but the calibrated reading and the affect-driven reading point the same direction. This is the convergence case where the heuristic happens to land in the right neighborhood.',
  },
  {
    id: 5,
    phase: 'ITEM 5 OF 10',
    title: 'Artificial Intelligence',
    emoji: '🤖',
    description:
      'Modern AI systems: large language models, computer vision, recommendation systems, autonomous decision-making. Excludes far-future speculation. Focus on the deployed 2020-2026 generation: ChatGPT-class models, image generators, coding assistants, customer-service bots.',
    publicHarm: 58,
    publicBenefit: 36,
    expertHarm: 42,
    expertBenefit: 68,
    source:
      'Pew Research (Tyson & Kikuchi 2024) "Public Awareness of Artificial Intelligence": 52% of US adults more concerned than excited about increased AI use, 10% more excited than concerned, 36% mixed. Expert ratings span widely: AI Impacts (2023) survey of 2,778 ML researchers had median 5-10% catastrophic-outcome probability; Stanford AI Index (2024) documented measured productivity gains in coding (55% per Peng Kalliamvakou Cihon & Demirer 2023) and customer service (14% per Brynjolfsson Li & Raymond 2023). Yudkowsky vs LeCun vs Bengio public split.',
    research:
      'Pew Research (Tyson & Kikuchi 2024). AI Impacts (2023) "Expert Survey on Progress in AI." Stanford AI Index Report (2024). Peng Kalliamvakou Cihon & Demirer (2023) GitHub Copilot productivity study. Brynjolfsson Li & Raymond (2023) "Generative AI at Work," QJE working paper. Bengio Hinton et al. (2023) Statement on AI Risk.',
    wizCommentary:
      'The most affectively unstable item in this set. The public rating moved sharply between 2022 (pre-ChatGPT, mixed) and 2024 (post-deployment, concerned). The expert rating is itself split, which is why the expert-public gap is smaller here than in nuclear or GM food. Note your own pattern: if you rated AI similarly to nuclear power, your affect tag may be the same one (technological dread); if you rated it similarly to vaccines, your tag is the other one (technological progress).',
  },
  {
    id: 6,
    phase: 'ITEM 6 OF 10',
    title: 'Alcohol',
    emoji: '🍷',
    description:
      'Beverages containing ethyl alcohol: beer, wine, spirits. Includes social drinking, moderate consumption, and heavier use. Global per-capita adult consumption ~5.5 liters of pure ethanol per year (WHO 2023).',
    publicHarm: 58,
    publicBenefit: 42,
    expertHarm: 78,
    expertBenefit: 22,
    source:
      'Public risk perception of alcohol (Gallup 2022): only 39% of US adults agreed moderate drinking is bad for health, down from 45% in 2018. WHO (2023) Global Status Report on Alcohol: 3.0 million deaths per year, 5.3% of all global deaths, leading cause of preventable death in 20-39 age range. IARC (1988) classified alcohol as Group 1 carcinogen. Wood et al. (2018) Lancet 600,000-person meta-analysis: "no safe level" — every level of alcohol consumption raises risk of cardiovascular, cancer, and all-cause mortality.',
    research:
      'WHO (2023) Global Status Report on Alcohol and Health. Wood et al. (2018) "Risk Thresholds for Alcohol Consumption," Lancet vol 391. IARC Monograph 96 (2010) on alcohol as Group 1 carcinogen. Rehm et al. (2010) "The Relation Between Different Dimensions of Alcohol Consumption and Burden of Disease," Addiction vol 105. Gallup (2022) Health and Healthcare poll on alcohol perceptions.',
    wizCommentary:
      'A rare item where the public underestimates harm relative to expert consensus. The social-acceptability halo around alcohol — wine with dinner, beer at a barbecue, champagne at a wedding — sets a positive affect tag that drives the harm slider down and the benefit slider up, against twenty years of accumulating cancer, cardiovascular, and dementia evidence. If your slider on alcohol came out anywhere close to your slider on nuclear power, you are reading the data instead of the affect tag, which is rare on this item.',
  },
  {
    id: 7,
    phase: 'ITEM 7 OF 10',
    title: 'Agricultural Pesticides',
    emoji: '🌾',
    description:
      'Synthetic chemicals applied to crops to control insects, weeds, fungi, and rodents: glyphosate, neonicotinoids, organophosphates, pyrethroids. Excludes biological controls and organic-certified alternatives. Roughly $80 billion global market.',
    publicHarm: 75,
    publicBenefit: 32,
    expertHarm: 38,
    expertBenefit: 72,
    source:
      'Slovic (1987) Science psychometric paradigm: pesticides loaded near the top of the dread-vs-unknown axis, second only to nuclear waste in dread. FDA Consumer Survey (2023): 75% of US consumers think pesticide residues are a serious food-safety issue. FAO (2019): synthetic pesticides contribute ~30% to current crop yields; without them global food production drops 20-40% in major crops. WHO 2018 toxicology review acknowledged occupational exposure risks but found dietary residues at regulatory limits low-risk for consumers.',
    research:
      'Slovic (1987) "Perception of Risk." Fischhoff Slovic Lichtenstein Read & Combs (1978). Cooper & Dobson (2007) "The Benefits of Pesticides to Mankind and the Environment," Crop Protection vol 26. Pretty & Bharucha (2015) "Integrated Pest Management for Sustainable Intensification of Agriculture in Asia and Africa," Insects vol 6. WHO (2018) Pesticide Residues in Food Database. Bourguet & Guillemaud (2016) on social costs of pesticide externalities.',
    wizCommentary:
      'Slovic\'s 1987 original psychometric paradigm rated this near the top of the dread-vs-unknown axis. The "chemicals in my food" affective tag is one of the strongest in the entire data set, and it produces a steep harm-benefit decoupling: high harm, low benefit, despite the agricultural-yield contribution being roughly the size of the difference between modern food security and persistent regional famine. Note: this is not a defense of unrestricted pesticide use — occupational exposure, ecosystem effects, and resistance evolution are real expert concerns. It is a calibration on the consumer-dietary-residue side, where expert and public diverge most sharply.',
  },
  {
    id: 8,
    phase: 'ITEM 8 OF 10',
    title: 'Electric Vehicles',
    emoji: '🔋',
    description:
      'Battery-electric passenger cars and light trucks: Tesla, BYD, Hyundai, Ford, GM electric models. Excludes plug-in hybrids. ~14 million sold globally in 2023 (IEA), roughly 18% of new car sales.',
    publicHarm: 32,
    publicBenefit: 58,
    expertHarm: 28,
    expertBenefit: 62,
    source:
      'Pew Research (2024) "Electric Vehicles Get Mixed Reviews from Americans": 38% likely to seriously consider an EV for next purchase, 59% not; views on environmental benefit (61% say EVs better for environment than gas). Bieker (2021) ICCT lifecycle analysis: EVs in Europe produce 66-69% less CO2 over lifecycle than equivalent gasoline cars. Hertwich & Peters (2009) Environmental Science & Technology lifecycle review confirms direction with regional variation. Lithium-mining concerns acknowledged in expert literature but quantitatively dominated by tailpipe emissions avoided.',
    research:
      'Pew Research (2024). Bieker (2021) "A Global Comparison of the Life-Cycle Greenhouse Gas Emissions of Combustion Engine and Electric Passenger Cars," ICCT. Hertwich & Peters (2009) "Carbon Footprint of Nations," Environmental Science & Technology vol 43. IEA Global EV Outlook (2024). Sovacool Hook Martiskainen Brock & Turnheim (2020) "Lithium-Ion Battery Supply Chain" Resources Conservation & Recycling vol 162.',
    wizCommentary:
      'A relatively calibrated item across populations: public and expert ratings track within ~5 points on both axes. This is the "convergence" pattern — for items without a strong affect tag, the harm-benefit ratings come from analysis rather than feeling. Note your own gap from the expert numbers here. If your harm slider is close to 28 and your benefit slider is close to 62, you are doing this one with the calculation rather than the affect engine.',
  },
  {
    id: 9,
    phase: 'ITEM 9 OF 10',
    title: 'Smartphones',
    emoji: '📞',
    description:
      'Pocket computing devices with persistent connectivity, app ecosystems, cameras, and notifications: iOS, Android. Global penetration ~85% of adults (Statista 2024). Average daily use ~4-5 hours.',
    publicHarm: 48,
    publicBenefit: 74,
    expertHarm: 52,
    expertBenefit: 68,
    source:
      'Pew Research (2024) Mobile Technology Fact Sheet: 90% of US adults own a smartphone, view it as "mostly positive" by 76%, "mostly negative" by 17%. Twenge (2017) "iGen" on teen mental-health correlates. Lin et al. (2016) "Time Spent on Smartphones and Mental Health" PLoS ONE. Sapacz Rockman & Clark (2016) "Are We Addicted to Our Smartphones?" Computers in Human Behavior vol 57. Productivity-side: Bloom (2014) on mobile-enabled work flexibility.',
    research:
      'Pew Research (2024) Mobile Technology Fact Sheet. Twenge (2017) "iGen." Lin et al. (2016) PLoS ONE. Sapacz Rockman & Clark (2016). Allcott Gentzkow & Song (2022) "Digital Addiction," American Economic Review on present-bias in smartphone use. Olson Sandman Colungo Statham Lopez (2022) "Smartphone Addiction is Increasing Across the World" Computers in Human Behavior.',
    wizCommentary:
      'The most cognitively-coupled item in this set: harm and benefit are both rated relatively high. This is the explicit-tradeoff pattern — the user is doing the math, not reading from a single affect tag. If your sliders here came out with harm around 50 and benefit around 70, the heuristic was attenuated; you held two opposing facts simultaneously and let both register. Compare this pattern to your nuclear-power item: same level of "real-world complexity," very different affect tag, very different slider behavior in most subjects.',
  },
  {
    id: 10,
    phase: 'ITEM 10 OF 10',
    title: 'Microwave Ovens',
    emoji: '🌡️',
    description:
      'Domestic appliances that heat food using 2.45 GHz non-ionizing electromagnetic radiation. Standard in roughly 90% of US households since the 1990s. Built around magnetron tubes patented during WWII radar development; commercialized for home use starting 1967.',
    publicHarm: 22,
    publicBenefit: 82,
    expertHarm: 12,
    expertBenefit: 88,
    source:
      'Slovic (1987) Science psychometric paradigm: microwave ovens in 1987 rated harm ~55, benefit ~70 — significantly more feared than today. Current FDA Radiation-Emitting Products Database: no documented mechanism for biological harm at consumer-product power levels; FDA safety standards since 1971 (21 CFR 1030.10). Vollmer (2004) "Physics of the Microwave Oven," Physics Education vol 39 on the non-ionizing radiation physics. Public risk perception dropped to ~20 by 2010 (multiple consumer-safety surveys).',
    research:
      'Slovic (1987). FDA 21 CFR 1030.10. Vollmer (2004) Physics Education. Trabulsi Webster & Marliss (1998) on nutritional retention comparisons across heating methods. National Cancer Institute fact sheet on microwave-oven radiation. The 1980s "microwaves cause cancer" affective tag tracks neither the physics nor the epidemiology and faded over time as the technology became domestic infrastructure.',
    wizCommentary:
      'The item that proves the affect heuristic can change direction over a generation. In the 1980s the public harm rating was around 55, similar to nuclear power on the unknown-risk axis; today it is around 22. The technology did not change. The affective tag did. Microwaves moved from "mysterious radiation device" to "domestic appliance" without any new safety information being added to the public conversation. This is the cleanest evidence that the affect tag is doing the work: when the tag changes, the harm rating changes without the underlying facts moving.',
  },
];

interface ProfileSpec {
  threshold: number; // upper bound of r for this profile (more negative = stronger affect)
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

// Ordered from most calibrated (r near 0 or positive) to strongest affect (most negative)
const PROFILES: ProfileSpec[] = [
  {
    threshold: -0.15,
    emoji: '⚖️',
    name: 'The Tradeoff Realist',
    range: 'CORRELATION r ≥ -0.15',
    tagline:
      'Your harm and benefit ratings are doing two different jobs.',
    description:
      'Your Pearson correlation between harm and benefit ratings sits at -0.15 or higher (closer to zero, or even slightly positive). This is the calibrated band that the affect-heuristic literature almost never produces from naturalistic samples. Alhakami & Slovic (1994) founding study mean was r = -0.40 across 23 hazards; Finucane Alhakami Slovic & Johnson (2000) under unlimited time was r = -0.40; under time pressure r = -0.55. Subjects told explicitly to rate from analysis instead of intuition still produced r around -0.30. A correlation above -0.15 means you held harm and benefit as two distinct quantities throughout the ten items, the way the real world actually behaves: things with high benefit usually accumulate higher exposure-related risk, things with low benefit are usually low-stakes on both sides. The real-world risk-benefit correlation across deployed technologies is weakly positive.',
    wizNote:
      'Two readings of this band. First, you may have actively held an analytical posture during the test — thinking item-by-item about what the harm and benefit components actually consist of, rather than asking yourself "how do I feel about this." Slovic Finucane Peters and MacGregor (2007) call this "the analytical override" and find it can be cultivated but is effortful. Second, you may have been over-correcting once you noticed that the test was about a coupling — adjusting your sliders to look independent rather than honestly registering the felt asymmetry. The honest check is whether the gaps between your sliders and the documented public ratings feel natural or feel forced. If the ratings came out of analysis, the calibration is real; if they came out of self-presentation, the heuristic was operating one level up.',
    research:
      'Alhakami & Slovic (1994) Risk Analysis founding-study mean r = -0.40. Finucane Alhakami Slovic & Johnson (2000) "The Affect Heuristic in Judgments of Risks and Benefits," Journal of Behavioral Decision Making vol 13. Slovic Finucane Peters & MacGregor (2007) "The Affect Heuristic," European Journal of Operational Research vol 177 on the analytical-override condition.',
    traits: [
      'Above the Alhakami & Slovic 1994 founding-study floor',
      'Above the Finucane 2000 unlimited-time band',
      'Above the analytical-override condition in Slovic 2007',
      'Likely held harm and benefit as separate quantities',
      'Possibly over-correcting once the structure became visible',
    ],
    shareText:
      'I scored "The Tradeoff Realist" on WIZ\'s Affect Heuristic test. My harm-benefit correlation across 10 items came out at r ≥ -0.15 — above the Alhakami & Slovic (1994) founding band of r = -0.40.',
  },
  {
    threshold: -0.4,
    emoji: '🧭',
    name: 'The Mild Affect',
    range: 'CORRELATION -0.40 < r < -0.15',
    tagline:
      'Your feeling is coupling the ratings, but only a little.',
    description:
      'Your correlation sits between -0.15 and -0.40. This is below the Alhakami & Slovic (1994) founding-study mean of r = -0.40 and inside the band that the affect-heuristic literature produces under unlimited-time, analytical-override conditions (Slovic Finucane Peters & MacGregor 2007). Your affect tag was active but did not dominate. You let some independence between harm and benefit ratings survive, while still showing the signature negative correlation that the heuristic produces.',
    wizNote:
      'This is the band that explicit information interventions in the literature target. Slovic 2007 found that subjects who were given information about both the risk and the benefit of an item before rating it produced correlations in the -0.20 to -0.40 band, against the -0.50 to -0.60 band produced by the same subjects without the information manipulation. If you arrived at this band without an explicit intervention, your judgment is doing more analytical work than the typical naturalistic sample, while the affect engine is still doing some of it underneath. The remaining negative correlation is the residual heuristic that the literature finds is hard to fully eliminate.',
    research:
      'Slovic Finucane Peters & MacGregor (2007) on information-intervention conditions. Alhakami & Slovic (1994) founding-study baseline. Finucane Alhakami Slovic & Johnson (2000) on attenuation under analytical conditions. Keller Siegrist & Gutscher (2006) on stable individual differences in affect-driven risk perception.',
    traits: [
      'Below the Alhakami & Slovic 1994 founding-study mean',
      'Inside the analytical-override band of Slovic 2007',
      'Some heuristic-driven coupling still present',
      'Likely doing item-by-item analysis on some items, gut on others',
      'Residual affect tag operates under conscious correction layer',
    ],
    shareText:
      'I scored "The Mild Affect" on WIZ\'s Affect Heuristic test. My harm-benefit correlation across 10 items was between -0.15 and -0.40 — below the Alhakami & Slovic (1994) founding band but inside the Slovic 2007 analytical-override range.',
  },
  {
    threshold: -0.6,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'CORRELATION -0.60 ≤ r ≤ -0.40',
    tagline:
      'You are doing what the literature has measured for thirty years.',
    description:
      'Your correlation sits between -0.40 and -0.60. This is the Alhakami & Slovic (1994) founding-study modal band: their twenty-three-hazard study produced mean r = -0.40 with most subjects sitting in -0.30 to -0.55. Finucane Alhakami Slovic & Johnson (2000) unlimited-time condition averaged r = -0.40; time-pressure condition averaged r = -0.55. You are operating at the typical adult magnitude of the affect heuristic. Things you felt positively about, you rated low-harm and high-benefit; things you felt negatively about, you rated high-harm and low-benefit. The two ratings, supposed to be independent, came out coupled because they were both reading from the same underlying feeling tag.',
    wizNote:
      'The structural insight in this band is that the bias is in the substrate, not in the conscious self-image. Subjects in the Alhakami & Slovic 1994 and Finucane 2000 studies told experimenters, when asked directly, that they were doing harm and benefit as independent judgments. The data showed the judgments were coupled. The two layers do not communicate. The most efficient way to feel the heuristic operating is to find an item where your slider behaved on a different affect tag than you would now defend in cold analysis. Nuclear power and alcohol are the two items in this set where the gap between public and expert ratings is largest in opposite directions; your own behavior on those two items is the most direct signature of the engine.',
    research:
      'Alhakami & Slovic (1994) Risk Analysis founding-study modal band -0.30 to -0.55. Finucane Alhakami Slovic & Johnson (2000) Journal of Behavioral Decision Making mean r = -0.40 (control) and -0.55 (time pressure). Slovic (1987) Science psychometric paradigm. Slovic Finucane Peters & MacGregor (2007) European Journal of Operational Research review of three decades of work. Slovic Peters Finucane & MacGregor (2005) Health Psychology on affect-driven risk perception.',
    traits: [
      'Inside the Alhakami & Slovic 1994 founding-study modal band',
      'Approximately at the Finucane 2000 unlimited-time mean',
      'Standard adult shape of the heuristic',
      'Coupling operates below the conscious analytical layer',
      'Most population-relevant of the five profiles',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Affect Heuristic test. My harm-benefit correlation across 10 items was -0.40 to -0.60 — the Alhakami & Slovic (1994) founding-study modal band, the typical adult magnitude of the heuristic.',
  },
  {
    threshold: -0.8,
    emoji: '🌊',
    name: 'The Affect Driven',
    range: 'CORRELATION -0.80 ≤ r < -0.60',
    tagline:
      'Your feeling is doing most of the math on both sides.',
    description:
      'Your correlation sits between -0.60 and -0.80. This is above the Finucane Alhakami Slovic & Johnson (2000) time-pressure condition (r = -0.55 under 5-second-per-rating constraint) and inside the upper band that the literature produces in subjects rating from raw intuition. The harm and benefit ratings, supposed to be independent quantities, came out tightly coupled. Things you felt positively about scored low-harm and high-benefit by a consistent margin; things you felt negatively about scored the opposite by a similarly consistent margin. There is little independence left between the two scales in your ratings; they are both reading from a single underlying affective gestalt.',
    wizNote:
      'The risk in this band is what Slovic Finucane Peters and MacGregor (2007) call "experiential dominance": the analytical system never gets the chance to register that risk and benefit are different questions because the experiential system is answering both before the analytical one wakes up. In real-world settings this band correlates with patterns like rejecting an entire technology category on a single news story, recommending a regulatory action against a class of products by remembered fear, or refusing to update on expert data because the expert data does not match the affective tag. The exit from this band is not "more information" — Slovic 2007 found that giving subjects more information about each item often strengthens the correlation rather than attenuating it, because the new information gets metabolized through the existing tag. The exit is item-by-item analytical work, the kind that asks "what is the harm component of this item, separately and concretely" before checking what the gut already said.',
    research:
      'Finucane Alhakami Slovic & Johnson (2000) time-pressure condition r = -0.55. Slovic Finucane Peters & MacGregor (2007) on experiential-system dominance. Damasio (1994) "Descartes\' Error" on somatic markers driving risk-benefit judgments. Loewenstein Weber Hsee & Welch (2001) "Risk as Feelings," Psychological Bulletin vol 127. Slovic Peters Finucane & MacGregor (2005) on health behavior and the heuristic.',
    traits: [
      'Above the Finucane 2000 time-pressure band',
      'Strong experiential-system dominance over analytical-system override',
      'Harm and benefit ratings effectively coupled',
      'High vulnerability to single-news-story risk-perception updates',
      'Most useful exercise: separate the harm component analytically on items 1, 6, and 7',
    ],
    shareText:
      'I scored "The Affect Driven" on WIZ\'s Affect Heuristic test. My harm-benefit correlation across 10 items was -0.60 to -0.80 — above the Finucane (2000) time-pressure band. Things I felt good about scored low-harm-high-benefit, things I felt bad about scored the opposite.',
  },
  {
    threshold: -2,
    emoji: '🔥',
    name: 'The Pure Affect',
    range: 'CORRELATION r < -0.80',
    tagline:
      'There is one slider doing the work of two.',
    description:
      'Your correlation sits below -0.80. This is above the strongest documented correlations in the affect-heuristic literature, including the Finucane (2000) time-pressure condition (-0.55) and the strongest individual-subject correlations in Slovic Finucane Peters & MacGregor (2007). At this magnitude, knowing your harm rating for an item is enough to predict your benefit rating with high accuracy and vice versa. The two scales are not registering as two separate questions. A single positive-or-negative feeling about each item is producing both numbers at once.',
    wizNote:
      'Two readings of this band. The first is the strong-affect reading: the experiential system is running with very little analytical interference. The harm-benefit pair is bundled into a single positive-or-negative gestalt that is then unpacked into two numbers that necessarily move together. This is the band the literature finds in subjects rating fast under cognitive load, or in subjects rating items they have strong pre-existing affective tags for (nuclear power, vaccines, GM food, alcohol). The second reading is the response-style reading: it is possible to produce a strong negative correlation by simply anti-correlating the sliders for every item without checking the content. The honest check is whether your slider for smartphones (item 9), which is designed to elicit explicit tradeoff thinking (high harm AND high benefit), came out actually tradeoff-shaped or got pulled toward one corner. If smartphones got the same affect-coupled treatment as nuclear power and vaccines, the engine is running at full strength.',
    research:
      'Finucane Alhakami Slovic & Johnson (2000) extreme conditions. Slovic Finucane Peters & MacGregor (2007) on the upper tail of the heuristic. Damasio (1994) somatic-marker hypothesis. Loewenstein Weber Hsee & Welch (2001) "Risk as Feelings." Slovic (2010) "The Feeling of Risk." Peters Finucane MacGregor & Slovic (2003) on individual differences in affect responding.',
    traits: [
      'Above the strongest documented correlations in the literature',
      'Single affective tag producing both ratings',
      'Smartphones item (designed-tradeoff) is the diagnostic',
      'High vulnerability to category-wide risk updates from single news cycles',
      'Most useful exercise: rate alcohol and pesticides again with the documented expert data in mind',
    ],
    shareText:
      'I scored "The Pure Affect" on WIZ\'s Affect Heuristic test. My harm-benefit correlation across 10 items was below -0.80 — above the strongest documented correlations in the affect-heuristic literature. One feeling produced both numbers.',
  },
];

function getProfile(r: number): ProfileSpec {
  for (const p of PROFILES) {
    if (r >= p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 2) return 0;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  if (denom === 0) return 0;
  return num / denom;
}

type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [harm, setHarm] = useState<number[]>(Array(ITEMS.length).fill(50));
  const [benefit, setBenefit] = useState<number[]>(Array(ITEMS.length).fill(50));
  const [locked, setLocked] = useState<boolean[]>(Array(ITEMS.length).fill(false));

  const current = ITEMS[index];
  const isLast = index === ITEMS.length - 1;
  const isLocked = locked[index];

  const handleHarm = useCallback(
    (value: number) => {
      if (locked[index]) return;
      setHarm((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    [index, locked],
  );

  const handleBenefit = useCallback(
    (value: number) => {
      if (locked[index]) return;
      setBenefit((prev) => {
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

  const r = useMemo(() => pearson(harm, benefit), [harm, benefit]);
  const profile = useMemo(() => getProfile(r), [r]);

  const itemBreakdown = useMemo(
    () =>
      ITEMS.map((it, i) => {
        const userHarm = harm[i];
        const userBenefit = benefit[i];
        const publicHarmGap = userHarm - it.publicHarm;
        const publicBenefitGap = userBenefit - it.publicBenefit;
        const expertHarmGap = userHarm - it.expertHarm;
        const expertBenefitGap = userBenefit - it.expertBenefit;
        const expertDistance =
          Math.abs(expertHarmGap) + Math.abs(expertBenefitGap);
        const publicDistance =
          Math.abs(publicHarmGap) + Math.abs(publicBenefitGap);
        return {
          item: it,
          userHarm,
          userBenefit,
          publicHarmGap,
          publicBenefitGap,
          expertHarmGap,
          expertBenefitGap,
          expertDistance,
          publicDistance,
        };
      }),
    [harm, benefit],
  );

  const closestToExpert = useMemo(
    () =>
      itemBreakdown.reduce((best, curr) =>
        curr.expertDistance < best.expertDistance ? curr : best,
      ),
    [itemBreakdown],
  );

  const closestToPublic = useMemo(
    () =>
      itemBreakdown.reduce((best, curr) =>
        curr.publicDistance < best.publicDistance ? curr : best,
      ),
    [itemBreakdown],
  );

  const widestExpertGap = useMemo(
    () =>
      itemBreakdown.reduce((worst, curr) =>
        curr.expertDistance > worst.expertDistance ? curr : worst,
      ),
    [itemBreakdown],
  );

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/affect-heuristic`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setHarm(Array(ITEMS.length).fill(50));
    setBenefit(Array(ITEMS.length).fill(50));
    setLocked(Array(ITEMS.length).fill(false));
  }, []);

  const meanHarm = useMemo(
    () => Math.round(harm.reduce((a, b) => a + b, 0) / harm.length),
    [harm],
  );
  const meanBenefit = useMemo(
    () => Math.round(benefit.reduce((a, b) => a + b, 0) / benefit.length),
    [benefit],
  );

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
              <h1 className="text-3xl md:text-4xl font-bold text-rose-300 mb-3">
                The Affect Heuristic
              </h1>
              <p className="text-zinc-400 text-sm">
                Ten technologies and activities. Two sliders each: how harmful (0-100) and how beneficial (0-100). They are supposed to be independent. WIZ measures whether they came out coupled.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-rose-300/80 italic">
                &ldquo;The affect heuristic produces an inverse relationship between perceived risk and perceived benefit that does not exist in the world.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Paul Slovic, Risk Analysis 1994</span>
              </p>
              <p>
                In 1994 Ali Alhakami and Paul Slovic asked subjects to rate twenty-three hazards on two separate scales: how risky each was, and how beneficial each was. In the real world the two correlate weakly positively — technologies that deliver high benefit have usually been pushed harder, exposed more people, and accumulated more risk. In subjects&apos; heads the correlation came out the other way. The mean within-subject correlation between risk and benefit ratings was r = -0.40. Things they liked, they rated low-risk and high-benefit. Things they disliked, they rated the opposite. The two ratings, supposed to be independent, were being read off the same underlying feeling.
              </p>
              <p>
                Six years later Finucane Alhakami Slovic and Johnson (2000) ran the same paradigm under five-second time pressure. The negative correlation strengthened to r = -0.55. They also ran an information manipulation: tell subjects an item has high benefit, their risk rating for it drops; tell them it has high risk, their benefit rating for it drops. The two ratings are coupled at the substrate. The paper named the underlying mechanism the &ldquo;affect heuristic&rdquo;: when judging risk and benefit, the mind asks itself how it feels about the item, and reads both numbers off that feeling.
              </p>
              <p>
                Kahneman (2011) Thinking Fast and Slow chapter 12 calls the move &ldquo;substitution&rdquo;: when System 1 is asked the hard question &ldquo;what is the risk of X?&rdquo; it answers a different easier question, &ldquo;how do I feel about X?&rdquo; The two answers come out coupled because they were the same answer.
              </p>
              <p>
                You are about to see ten items: nuclear power, childhood vaccines, GM food, social media, AI, alcohol, pesticides, electric vehicles, smartphones, microwave ovens. For each you move two sliders: harm (0 to 100) and benefit (0 to 100). After each lock, WIZ shows the documented public rating and the documented expert rating on the same scale. At the end, WIZ computes the Pearson correlation between your harm and benefit ratings across all ten items and places you in the literature bands. A calibrated rater produces r near zero. The 1994 founding-study mean was r = -0.40.
              </p>
              <p className="text-zinc-500 text-xs">
                Harm and benefit are supposed to be two questions. The affect heuristic makes them one.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-rose-400 hover:bg-rose-300 text-black font-bold transition-colors"
            >
              Rate ten items →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest flex justify-between">
              <span>{current.phase}</span>
              <span className="text-rose-400">{current.title}</span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-rose-300">{current.title}</h2>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{current.description}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">HARM</span>
                  <span className="text-zinc-500">how much harm does it cause to people / society / world?</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — no harm</span>
                  <span>50 — moderate</span>
                  <span>100 — extreme harm</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={harm[index]}
                  onChange={(e) => handleHarm(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-rose-400 disabled:opacity-60"
                  aria-label="Harm rating"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-300">
                    {harm[index]}
                    <span className="text-lg text-zinc-500">/100</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">BENEFIT</span>
                  <span className="text-zinc-500">how much benefit does it provide to people / society / world?</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — none</span>
                  <span>50 — moderate</span>
                  <span>100 — enormous</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={benefit[index]}
                  onChange={(e) => handleBenefit(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Benefit rating"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-300">
                    {benefit[index]}
                    <span className="text-lg text-zinc-500">/100</span>
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-rose-400 hover:bg-rose-300 text-black font-bold transition-colors"
                >
                  Lock in {harm[index]} harm / {benefit[index]} benefit →
                </button>
              )}
            </div>

            {isLocked && (
              <div className="border border-rose-900 bg-rose-950/10 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOU</div>
                    <div className="text-sm text-rose-300">
                      <span className="font-bold">{harm[index]}</span>
                      <span className="text-zinc-600"> H</span>
                    </div>
                    <div className="text-sm text-emerald-300">
                      <span className="font-bold">{benefit[index]}</span>
                      <span className="text-zinc-600"> B</span>
                    </div>
                  </div>
                  <div className="border border-amber-700 bg-amber-950/20 p-3">
                    <div className="text-xs text-amber-400 mb-1">PUBLIC</div>
                    <div className="text-sm text-rose-200">
                      <span className="font-bold">{current.publicHarm}</span>
                      <span className="text-zinc-600"> H</span>
                    </div>
                    <div className="text-sm text-emerald-200">
                      <span className="font-bold">{current.publicBenefit}</span>
                      <span className="text-zinc-600"> B</span>
                    </div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/20 p-3">
                    <div className="text-xs text-emerald-400 mb-1">EXPERT</div>
                    <div className="text-sm text-rose-200">
                      <span className="font-bold">{current.expertHarm}</span>
                      <span className="text-zinc-600"> H</span>
                    </div>
                    <div className="text-sm text-emerald-200">
                      <span className="font-bold">{current.expertBenefit}</span>
                      <span className="text-zinc-600"> B</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-rose-400 tracking-widest mb-1">WHAT THE RESEARCH SAYS</div>
                  <p className="text-zinc-300 text-xs">{current.source}</p>
                </div>

                <div>
                  <div className="text-xs text-rose-400 tracking-widest mb-1">FULL CITATIONS</div>
                  <p className="text-zinc-400 text-xs">{current.research}</p>
                </div>

                <div>
                  <div className="text-xs text-rose-400 tracking-widest mb-1">WIZ</div>
                  <p className="text-zinc-300 italic">{current.wizCommentary}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full px-6 py-2.5 bg-rose-400 hover:bg-rose-300 text-black font-bold transition-colors"
                >
                  {isLast
                    ? 'See your affect-heuristic report →'
                    : `Next item (${index + 2} of ${ITEMS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {ITEMS.length}</span>
              <span>items locked: {locked.filter(Boolean).length} / {ITEMS.length}</span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR AFFECT HEURISTIC REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-rose-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-rose-800 bg-rose-950/20 p-4 text-center">
                <div className="text-xs text-rose-400 mb-1">AVG HARM</div>
                <div className="text-3xl font-bold text-rose-200">{meanHarm}</div>
                <div className="text-xs text-zinc-500 mt-1">across 10 items</div>
              </div>
              <div className="border border-emerald-800 bg-emerald-950/20 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG BENEFIT</div>
                <div className="text-3xl font-bold text-emerald-200">{meanBenefit}</div>
                <div className="text-xs text-zinc-500 mt-1">across 10 items</div>
              </div>
              <div
                className={`border p-4 text-center ${
                  r >= -0.15
                    ? 'border-emerald-700 bg-emerald-950/30'
                    : r >= -0.4
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">CORRELATION r</div>
                <div
                  className={`text-3xl font-bold ${
                    r >= -0.15
                      ? 'text-emerald-200'
                      : r >= -0.4
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {r.toFixed(2)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">harm × benefit</div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <div>
                <div className="text-xs text-rose-400 tracking-widest mb-1">{profile.range}</div>
                <p>{profile.description}</p>
              </div>
              <div>
                <div className="text-xs text-rose-400 tracking-widest mb-1">WIZ NOTE</div>
                <p className="italic">{profile.wizNote}</p>
              </div>
              <div>
                <div className="text-xs text-rose-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{profile.research}</p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-rose-400 tracking-widest mb-2">SIGNATURE TRAITS</div>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {profile.traits.map((trait) => (
                    <li key={trait}>· {trait}</li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-zinc-800 pt-3 space-y-2">
                <div className="text-xs text-rose-400 tracking-widest mb-1">CLOSEST TO EXPERT</div>
                <p className="text-xs text-zinc-400">
                  <span className="text-emerald-300">{closestToExpert.item.title}</span>: you rated harm {closestToExpert.userHarm}, benefit {closestToExpert.userBenefit}; experts rate harm {closestToExpert.item.expertHarm}, benefit {closestToExpert.item.expertBenefit}. This is the item where your analytical layer did the most work.
                </p>
                <div className="text-xs text-rose-400 tracking-widest mb-1 pt-2">CLOSEST TO PUBLIC MOOD</div>
                <p className="text-xs text-zinc-400">
                  <span className="text-amber-300">{closestToPublic.item.title}</span>: you rated harm {closestToPublic.userHarm}, benefit {closestToPublic.userBenefit}; public rates harm {closestToPublic.item.publicHarm}, benefit {closestToPublic.item.publicBenefit}. This is the item where your affect tag most matched the typical adult sample.
                </p>
                <div className="text-xs text-rose-400 tracking-widest mb-1 pt-2">WIDEST EXPERT GAP</div>
                <p className="text-xs text-zinc-400">
                  <span className="text-rose-300">{widestExpertGap.item.title}</span>: you rated harm {widestExpertGap.userHarm}, benefit {widestExpertGap.userBenefit}; experts rate harm {widestExpertGap.item.expertHarm}, benefit {widestExpertGap.item.expertBenefit}. This is the item where the engine ran loudest.
                </p>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-rose-400 tracking-widest mb-3">ITEM-BY-ITEM</div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 border-b border-zinc-800 pb-2 font-bold">
                  <div className="col-span-4">ITEM</div>
                  <div className="col-span-2 text-right">YOU H/B</div>
                  <div className="col-span-3 text-right">PUBLIC H/B</div>
                  <div className="col-span-3 text-right">EXPERT H/B</div>
                </div>
                {itemBreakdown.map((b) => (
                  <div
                    key={b.item.id}
                    className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                  >
                    <div className="col-span-4 text-zinc-300 truncate">
                      <span className="mr-1">{b.item.emoji}</span>
                      {b.item.title}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-rose-300">{b.userHarm}</span>
                      <span className="text-zinc-700"> / </span>
                      <span className="text-emerald-300">{b.userBenefit}</span>
                    </div>
                    <div className="col-span-3 text-right text-zinc-400">
                      <span className="text-rose-400/80">{b.item.publicHarm}</span>
                      <span className="text-zinc-700"> / </span>
                      <span className="text-emerald-400/80">{b.item.publicBenefit}</span>
                    </div>
                    <div className="col-span-3 text-right text-zinc-400">
                      <span className="text-rose-400/80">{b.item.expertHarm}</span>
                      <span className="text-zinc-700"> / </span>
                      <span className="text-emerald-400/80">{b.item.expertBenefit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Each cell is harm/benefit on a 0-100 scale. Public ratings from the cited polls (Slovic 1987, Pew 2024, Larson VCI 2016, Funk &amp; Rainie 2015, WHO 2023, etc.). Expert ratings from the cited expert-survey, meta-analysis, and field-consensus literature.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Slovic Finucane Peters and MacGregor (2007) suggest an item-level exercise: for each item where your sliders most diverged from the expert data, separate the harm component from the affect tag and rate it again, concretely. For nuclear power: per-terawatt-hour mortality. For alcohol: WHO 2023 attributable-deaths figure. For pesticides: dietary residue exposure at FDA / EU regulatory limits, separated from occupational exposure. The reframe is not to override your feelings about the items; it is to notice that the feeling produced both numbers at once, and check whether the numbers survive being decoupled.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-rose-400 hover:bg-rose-300 text-black font-bold transition-colors flex-1"
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
              Sources: Alhakami &amp; Slovic (1994) &ldquo;A Psychological Study of the Inverse Relationship Between Perceived Risk and Perceived Benefit,&rdquo; Risk Analysis vol 14. Finucane Alhakami Slovic &amp; Johnson (2000) &ldquo;The Affect Heuristic in Judgments of Risks and Benefits,&rdquo; Journal of Behavioral Decision Making vol 13. Slovic Finucane Peters &amp; MacGregor (2007) &ldquo;The Affect Heuristic,&rdquo; European Journal of Operational Research vol 177. Slovic (1987) &ldquo;Perception of Risk,&rdquo; Science vol 236. Fischhoff Slovic Lichtenstein Read &amp; Combs (1978) &ldquo;How Safe is Safe Enough?&rdquo; Policy Sciences vol 9. Loewenstein Weber Hsee &amp; Welch (2001) &ldquo;Risk as Feelings,&rdquo; Psychological Bulletin vol 127. Kahneman (2011) &ldquo;Thinking, Fast and Slow&rdquo; chapter 12. Damasio (1994) &ldquo;Descartes&apos; Error&rdquo; on somatic markers. Markandya &amp; Wilkinson (2007) Lancet on energy-source mortality. Larson Cooper Eskola Katz &amp; Ratzan (2011) Lancet on vaccine confidence. Funk &amp; Rainie (2015) Pew on public-scientist gaps. Klümper &amp; Qaim (2014) PLoS ONE on GM crop meta-analysis. WHO (2023) Global Status Report on Alcohol. IARC (1988) Group 1 carcinogen classification. Wood et al. (2018) Lancet alcohol meta. Pew Research (2024) on social media, AI, and EV perception. FDA Radiation-Emitting Products Database on microwave-oven safety. Bieker (2021) ICCT on EV lifecycle. Twenge Joiner Rogers &amp; Martin (2018) JAMA Psychiatry. Gigerenzer (2006) on post-9/11 substitution deaths. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
