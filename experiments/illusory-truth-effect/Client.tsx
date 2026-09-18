'use client';

// THE ILLUSORY TRUTH EFFECT
// In 1977 Lynn Hasher, David Goldstein, and Thomas Toppino published "Frequency
// and the Conference of Referential Validity" in the Journal of Verbal Learning
// and Verbal Behavior vol 16. They showed subjects 60 plausible trivia
// statements ("the largest ocean is the Pacific," "Tibet has the highest
// per-capita income," etc.) across three sessions two weeks apart. Forty of
// the statements changed every session; twenty repeated unchanged across all
// three. After each statement subjects rated how true it felt on a 1-7 scale.
// The mean truth rating for repeated statements rose from 4.2 in session one
// to 4.6 in session two to 4.7 in session three. The mean rating for new
// statements stayed flat at 4.0 across sessions. The effect was independent
// of whether the statements were actually true. Repeated false statements
// gained as much truth-credit as repeated true ones. Repetition was being
// metabolized as evidence.
// Bacon (1979), Begg Anas & Farinacci (1992), Boehm (1994), Brown & Nix
// (1996), and Roggeveen & Johar (2002) replicated the finding across formats
// (auditory, visual), populations (undergraduates, older adults, clinical
// samples), and statement domains (trivia, advertising claims, political
// statements, urban legends). Dechêne Stahl Hansen & Wänke (2010) ran a
// meta-analysis of 51 illusory-truth studies and reported a mean effect size
// of g = 0.47, with the effect surviving warnings, surviving incentive for
// accuracy, and surviving in subjects who explicitly recognized that a
// statement was a repeat. The mechanism is processing fluency: a statement
// that is easier to process feels more true, and a repeated statement is
// easier to process than a new one because the encoding pathway has already
// been walked. Whittlesea (1993) "Illusions of Familiarity" Journal of
// Experimental Psychology Learning Memory & Cognition vol 19 showed the same
// fluency-feeling-truth pipeline using priming manipulations that did not
// require literal repetition. Reber & Schwarz (1999) "Effects of Perceptual
// Fluency on Judgments of Truth" Consciousness and Cognition vol 8 used font
// contrast and color contrast to manipulate processing fluency without
// touching repetition and got the same lift.
// The killer extension came from Fazio Brashier Payne & Marsh (2015)
// "Knowledge Does Not Protect Against Illusory Truth" Journal of Experimental
// Psychology General vol 144. They showed that repetition lifts truth
// ratings even when the statement contradicts the subject's stored knowledge.
// Subjects who knew the correct answer to "the largest ocean is the Pacific"
// nonetheless rated "the largest ocean is the Atlantic" as more true after
// repetition than after a single exposure. The illusory truth effect runs
// underneath the knowledge layer. The familiarity signal is read as
// truth-evidence before the knowledge check fires, and the knowledge check
// often does not fire at all because the familiarity signal precludes the
// system-two override.
// Brashier Eliseev & Marsh (2020) "An Initial Accuracy Focus Prevents
// Illusory Truth" Cognition vol 194 found one robust intervention: forcing
// subjects to make a true/false judgment on a statement during its first
// exposure (instead of rating ease of processing or interest) cut the
// illusory-truth lift roughly in half. The effect did not disappear, but the
// initial accuracy-focused encoding partially inoculated against the
// later familiarity-as-truth substitution.
// The size of the effect. Hasher Goldstein & Toppino (1977) reported ~0.5
// point lift on a 7-point scale between session one and session two on
// repeated false items (~7 points on a 100-scale). Dechêne et al (2010) meta
// median g = 0.47 translates to roughly 8-10 points on a 100-scale given
// typical SDs in the literature. Fazio Brashier Payne & Marsh (2015) found
// effects of 0.06 to 0.10 on a 6-point scale across multiple experiments
// (~6-10 points on a 100-scale). Brown & Nix (1996) reported between-block
// effects of similar magnitude. The literature converges on a typical adult
// lift of roughly 6-12 points on a 100-scale, with substantial individual
// variation. The most-cited effect-size ceiling is around 25 points on a
// 100-scale, in subjects rating under high cognitive load or no incentive
// for accuracy.
// Things the bias does in the real world. Pennycook Cannon & Rand (2018)
// "Prior Exposure Increases Perceived Accuracy of Fake News" Journal of
// Experimental Psychology General vol 147: a single prior exposure to a fake
// news headline increased its perceived accuracy on a later rating by
// roughly 10 percentage points. The effect held even when the headline was
// tagged with a "Disputed by 3rd Party Fact-Checkers" warning. Polage (2012)
// on illusory autobiographical memory: subjects who repeatedly described
// a childhood event that never happened gave higher truth ratings on the
// event being real over time. Pluviano Watt & Della Sala (2017) on vaccine
// misinformation: repeated exposure to debunked anti-vaccine claims
// increased their perceived accuracy even when the debunking was the
// repetition vehicle (Skurnik Yoon Park & Schwarz 2005 "How Warnings about
// False Claims Become Recommendations" Journal of Consumer Research vol 31).
// Murray Stanley McPhetres Pennycook & Rand (2020) on the spread of
// COVID-19 misinformation: prior exposure to a debunked claim increased
// belief on later exposure, repeating the Pennycook Cannon & Rand 2018
// pattern in pandemic context.
// WIZ note: I am about to show you twelve plausible statements one at a
// time. For each you move a single slider: how true does this feel, on a
// scale of 0 to 100. Then I show you eighteen statements: the twelve you
// already saw, plus six new ones, in shuffled order. You rate them again.
// I never reveal during either round which ones are actually true or false,
// so the only thing changing between round one and round two is your own
// familiarity. At the end I compute two numbers. First: your truth-rating
// lift on the six repeated false statements between round one and round
// two. This is the within-subject signature of the illusory truth effect.
// Hasher Goldstein & Toppino (1977) founding measurement was ~7 points on a
// 100-scale. Dechêne et al (2010) meta median is ~8-10 points. Second:
// your truth-rating gap between repeated false statements and new false
// statements in round two. This is the between-statement signature of the
// same effect. Both should rise above zero if the heuristic is operating.

import { useState, useMemo, useCallback } from 'react';

type Truth = 'true' | 'false';

interface Statement {
  id: number;
  text: string;
  truth: Truth;
  verdict: string;
  source: string;
}

// 9 true statements (plausible, well-sourced, but each survives scrutiny)
const TRUE_POOL: Statement[] = [
  {
    id: 1,
    text: 'Octopuses have three hearts and blue blood.',
    truth: 'true',
    verdict: 'TRUE. Two branchial hearts pump blood through the gills; one systemic heart pumps it through the rest of the body. The blood is blue because it uses hemocyanin, a copper-based oxygen carrier, instead of hemoglobin.',
    source: 'Wells (1978) "Octopus: Physiology and Behaviour of an Advanced Invertebrate," Chapman & Hall. Mangum (1997) "Adaptation of the Oxygen Transport System to Hypoxia in the Cephalopoda," American Zoologist vol 37. Confirmed in current marine-biology textbooks.',
  },
  {
    id: 2,
    text: 'A group of crows is called a murder.',
    truth: 'true',
    verdict: 'TRUE. The collective noun "murder" for crows dates to the 15th century, appearing in the Book of St. Albans (1486) alongside other venery terms ("a parliament of owls," "an unkindness of ravens"). It is the standard ornithological collective in English.',
    source: 'Cocker & Mabey (2005) "Birds Britannica," Chatto & Windus. Lipton (1991) "An Exaltation of Larks." OED entry for "murder, n.1" sense 4.',
  },
  {
    id: 3,
    text: 'The shortest war in recorded history lasted around 38 minutes.',
    truth: 'true',
    verdict: 'TRUE. The Anglo-Zanzibar War of 27 August 1896. Sultan Khalid bin Barghash refused to abdicate after an unauthorized succession; British warships bombarded the palace from 09:02 to ~09:40. Casualties: ~500 Zanzibari, 1 British sailor wounded.',
    source: 'Hernon (2003) "Britain\'s Forgotten Wars," Sutton Publishing. Lyne (1936) "An Apostle of Empire" on the British residency. Guinness World Records lists it as the shortest declared war.',
  },
  {
    id: 4,
    text: 'Bananas are botanically classified as berries.',
    truth: 'true',
    verdict: 'TRUE. Botanically, a berry is a fleshy fruit produced from a single ovary with seeds embedded in the flesh. Bananas qualify; so do tomatoes, grapes, and watermelons. Strawberries and raspberries, despite the name, are not berries.',
    source: 'Esau (1977) "Anatomy of Seed Plants," Wiley. USDA Plant Database entry on Musa acuminata. Standard botanical taxonomy textbooks.',
  },
  {
    id: 5,
    text: 'Honey does not spoil and remains edible after thousands of years if sealed.',
    truth: 'true',
    verdict: 'TRUE. Honey is low-water, low-pH, and contains hydrogen peroxide produced by glucose oxidase. Archaeologists have recovered edible honey from sealed jars in Egyptian tombs dated to ~1000 BCE. The same chemistry makes it a USDA-recognized topical wound dressing.',
    source: 'White (1978) "Honey," Advances in Food Research vol 24. Molan (1992) "The Antibacterial Activity of Honey," Bee World vol 73. National Geographic (2013) on the Georgian tomb honey discovery.',
  },
  {
    id: 6,
    text: 'Wombats produce cube-shaped feces.',
    truth: 'true',
    verdict: 'TRUE. Bare-nosed wombats produce roughly cube-shaped scat as a result of differential elasticity in the intestinal wall during the last 8% of the colon. The cubes do not roll, which is thought to help with territory-marking.',
    source: 'Yang Lee Yang Pham Hu (2021) "Intestines of Non-Uniform Stiffness Mold the Corners of Wombat Feces," Soft Matter vol 17. Awarded the 2019 Ig Nobel Prize in Physics.',
  },
  {
    id: 7,
    text: 'Sharks are older as a lineage than trees.',
    truth: 'true',
    verdict: 'TRUE. Shark-like fossils (Doliodus problematicus) date to ~409 million years ago in the Early Devonian. The earliest tree-like plants (Archaeopteris) appear ~385 million years ago in the Middle Devonian. Sharks predate trees by roughly 20-25 million years.',
    source: 'Maisey Miller Pradel Denton Bronson Janvier (2017) on early chondrichthyan fossils. Stein Berry Hernick Mannolini (2012) Nature on the earliest forest. Paleobiology Database entries.',
  },
  {
    id: 8,
    text: 'The Pacific Ocean is wider than the diameter of the Moon.',
    truth: 'true',
    verdict: 'TRUE. The Pacific spans roughly 19,800 km at its widest (Indonesia to Colombia). The Moon\'s diameter is 3,474 km. The Pacific is roughly 5.7x wider than the Moon is across.',
    source: 'NOAA Pacific Ocean Reference. NASA Lunar Fact Sheet. CIA World Factbook ocean dimensions.',
  },
  {
    id: 9,
    text: 'The Eiffel Tower can grow up to 15 cm taller during hot summers due to thermal expansion of its iron.',
    truth: 'true',
    verdict: 'TRUE. Wrought iron has a thermal expansion coefficient of ~12 µm/(m·°C). Over 300 m of tower height, a 40°C summer-vs-winter swing yields ~14 cm of vertical expansion. The figure is published by the tower\'s operating company SETE.',
    source: 'SETE official documentation. Steinman & Watson (1957) "Bridges and Their Builders" on iron thermal expansion. Engineering handbooks for wrought-iron coefficients.',
  },
];

// 9 false statements (well-known plausible myths, each documented as false)
const FALSE_POOL: Statement[] = [
  {
    id: 101,
    text: 'Goldfish have a memory span of only three seconds.',
    truth: 'false',
    verdict: 'FALSE. Goldfish have demonstrated memory retention over periods of three to five months in laboratory studies. They can be trained to associate sounds with feeding, navigate mazes, and recognize their owners.',
    source: 'Vargas Lopez Salas & Thinus-Blanc (2004) Animal Cognition on goldfish memory. Plymouth University (2009) studies showing months-long retention. Brown (2015) "Fish Intelligence, Sentience and Ethics" Animal Cognition vol 18 reviewing fish cognition.',
  },
  {
    id: 102,
    text: 'Humans only use ten percent of their brain at any given time.',
    truth: 'false',
    verdict: 'FALSE. fMRI and PET imaging show essentially all of the brain is active across a 24-hour cycle, with different regions activating for different tasks. The myth has no basis in neuroscience. Damage to even a small region produces measurable deficits.',
    source: 'Beyerstein (1999) "Mind Myths" in S. Della Sala (ed.) "Whence the Myths?" Wiley. Higbee & Clay (1998) "College Students\' Beliefs in the Ten-Percent Myth" Journal of Psychology vol 132. Boyd (2008) Scientific American "Do People Only Use 10 Percent of Their Brains?"',
  },
  {
    id: 103,
    text: 'The Great Wall of China is the only human-made structure visible from the Moon with the naked eye.',
    truth: 'false',
    verdict: 'FALSE. The Great Wall is not visible from the Moon at all, and at low Earth orbit it is no more visible than other long structures (highways, airport runways). Multiple astronauts including Chinese astronaut Yang Liwei have confirmed they could not see it from orbit.',
    source: 'NASA Earth Observatory (2005) "China\'s Wall Less Great in View from Space." Lopez-Alegria & various astronauts on the visibility question. Norberg (2003) "China\'s Astronaut: \'I Did Not See The Great Wall From Space\'" reporting Yang Liwei.',
  },
  {
    id: 104,
    text: 'Bulls become enraged when they see the color red.',
    truth: 'false',
    verdict: 'FALSE. Cattle are dichromats and cannot distinguish red from green well. In bullfighting it is the motion of the cape, not its color, that triggers the charge. The traditional red color hides bloodstains from the audience.',
    source: 'Jacobs Deegan & Neitz (1998) "Photopigment Basis for Dichromatic Color Vision in Cows, Goats, and Sheep" Visual Neuroscience vol 15. MythBusters (2007) Discovery Channel S5E5 controlled bull experiments. American Veterinary Medical Association on cattle vision.',
  },
  {
    id: 105,
    text: 'Lightning never strikes the same place twice.',
    truth: 'false',
    verdict: 'FALSE. Lightning routinely strikes tall objects multiple times. The Empire State Building is hit ~25 times per year. The CN Tower in Toronto is hit ~75 times per year. Lightning is governed by local geometry of charge buildup, not memory of past strikes.',
    source: 'NOAA National Severe Storms Laboratory FAQ on lightning. Uman (2008) "The Art and Science of Lightning Protection" Cambridge University Press. Empire State Building Observatory historical strike count.',
  },
  {
    id: 106,
    text: 'Different regions of the human tongue are responsible for tasting different basic flavors.',
    truth: 'false',
    verdict: 'FALSE. All taste buds across the tongue respond to all five basic tastes (sweet, sour, salty, bitter, umami) with only minor sensitivity variations. The "tongue map" originated from a 1901 German paper by Hänig that was mistranslated and oversimplified in the 1940s.',
    source: 'Bartoshuk (1993) "The Biological Basis of Food Perception and Acceptance" Food Quality and Preference vol 4. Lindemann (1996) Physiological Reviews on taste-bud distribution. Collings (1974) Perception & Psychophysics vol 16 disproving the regional sensitivity claim.',
  },
  {
    id: 107,
    text: 'Albert Einstein failed mathematics as a schoolboy.',
    truth: 'false',
    verdict: 'FALSE. Einstein excelled at mathematics throughout his schooling. He had mastered differential and integral calculus by age 15. The myth originated from a misreading of the Swiss grading system, where 6 (high) and 1 (low) are the reverse of the German system.',
    source: 'Isaacson (2007) "Einstein: His Life and Universe" Simon & Schuster, pp. 16-17. Pais (1982) "Subtle is the Lord" Oxford University Press on Einstein\'s school records. Aarau cantonal school transcripts.',
  },
  {
    id: 108,
    text: 'Vikings wore horned helmets in battle.',
    truth: 'false',
    verdict: 'FALSE. No archaeological evidence supports horned Viking helmets. The image was invented by costume designer Carl Emil Doepler for the 1876 Bayreuth premiere of Wagner\'s "Der Ring des Nibelungen." Actual Viking helmets recovered from the Gjermundbu burial were rounded with a simple iron cap.',
    source: 'Frank (2000) "The Invention of the Viking Horned Helmet" in International Scandinavian and Medieval Studies. Williams (2017) National Geographic on the Bayreuth costume origin. National Museum of Denmark exhibitions on actual Viking armor.',
  },
  {
    id: 109,
    text: 'Napoleon Bonaparte was unusually short for his time.',
    truth: 'false',
    verdict: 'FALSE. Napoleon was approximately 1.68-1.70 m (5\'6"-5\'7"), which was roughly average for a French male of his era. The "short" reputation comes from a confusion between French and English inches and from British propaganda cartoons by James Gillray.',
    source: 'Dwyer (2007) "Napoleon: The Path to Power" Yale University Press. Engerman & Sokoloff (2012) "Anthropometric History and Heights" on 18th-century French stature. Roberts (2014) "Napoleon: A Life" Viking on the inch-conversion error.',
  },
];

interface ProfileSpec {
  threshold: number; // upper bound of lift for this profile (in points on 100-scale)
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
    threshold: 2,
    emoji: '🧊',
    name: 'The Skeptic',
    range: 'LIFT < 2 POINTS',
    tagline: 'Your familiarity signal is not being read as truth-evidence.',
    description:
      'Your truth ratings on repeated false statements rose by less than two points between round one and round two. This is below the Brashier Eliseev & Marsh (2020) accuracy-focused-encoding intervention band, which cut the typical illusory-truth lift roughly in half but did not eliminate it. A lift below two points means your familiarity signal is not being read as truth-evidence, or you are actively suppressing the familiarity-to-truth pathway during the second-round rating. Less than five percent of subjects in the standard literature land below this threshold.',
    wizNote:
      'Two readings of this band. First, the genuine reading: you may be running an analytical override on the truth question, reading each statement on its content rather than on its felt familiarity. Hasher Goldstein & Toppino (1977) found a minority of subjects in this band; Brashier Eliseev & Marsh (2020) found that the explicit accuracy-focus intervention moved subjects toward this band without ever fully eliminating the effect. Second, the response-style reading: it is possible to produce a near-zero lift by holding your round-one rating in memory and reproducing it on round two regardless of the felt familiarity. The honest check is whether your truth ratings on the six new statements in round two felt qualitatively different from your ratings on the repeated ones. If they did, the calibration is real; if they felt identical, the engine is operating but the response style is masking it.',
    research:
      'Brashier Eliseev & Marsh (2020) "An Initial Accuracy Focus Prevents Illusory Truth" Cognition vol 194. Hasher Goldstein & Toppino (1977) Journal of Verbal Learning and Verbal Behavior. Stanovich (2009) "What Intelligence Tests Miss" on actively open-minded thinking. Dechêne et al (2010) meta lower tail.',
    traits: [
      'Below the Brashier 2020 trained-debiased band',
      'Bottom 5% of subjects in the standard literature',
      'Familiarity signal not being read as truth',
      'Possibly running analytical override on each rating',
      'Check round-two new-statement ratings against repeated ones',
    ],
    shareText:
      'I scored "The Skeptic" on WIZ\'s Illusory Truth Effect test. My truth-rating lift on repeated false statements between round one and round two came out below 2 points — below the Brashier 2020 trained-debiased band.',
  },
  {
    threshold: 6,
    emoji: '🌫️',
    name: 'The Mild Subject',
    range: 'LIFT 2-6 POINTS',
    tagline: 'Repetition is doing a little of the work, not most of it.',
    description:
      'Your truth-rating lift on repeated false statements between round one and round two sits between two and six points. This is below the Hasher Goldstein & Toppino (1977) founding-study modal band of roughly 7 points (~0.5 on a 7-point scale) and inside the post-warning intervention range of Begg Anas & Farinacci (1992). The familiarity heuristic is operating in your judgments, but at less than typical adult magnitude. You held some independence between felt familiarity and judged truth, while the repetition still nudged the ratings upward.',
    wizNote:
      'This is the band that explicit warnings about illusory truth target in the literature. Begg Anas & Farinacci (1992) and Brashier Eliseev & Marsh (2020) found that subjects who were warned that repeated statements would appear in a later block produced lifts in the 2-6 point range, against the 7-12 point range produced by unwarned subjects. If you arrived at this band without having been warned, your judgment is doing more analytical work than the typical naturalistic sample, with the familiarity signal still doing some of it underneath. The remaining lift is the residual heuristic that the literature finds is hard to fully eliminate even under explicit accuracy-focused instructions.',
    research:
      'Begg Anas & Farinacci (1992) "Dissociation of Processes in Belief: Source Recollection, Statement Familiarity, and the Illusion of Truth" Journal of Experimental Psychology General vol 121. Brashier Eliseev & Marsh (2020) Cognition. Dechêne et al (2010) meta-analysis lower-middle band.',
    traits: [
      'Below the Hasher Goldstein & Toppino 1977 founding-study modal band',
      'Inside the post-warning intervention range',
      'Some familiarity-driven lift still present',
      'Likely running analytic checks on a subset of statements',
      'Residual heuristic operates under conscious correction layer',
    ],
    shareText:
      'I scored "The Mild Subject" on WIZ\'s Illusory Truth Effect test. My truth-rating lift on repeated false statements was 2-6 points — below the Hasher Goldstein & Toppino 1977 founding band but inside the Brashier 2020 warned-subject range.',
  },
  {
    threshold: 12,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'LIFT 6-12 POINTS',
    tagline: 'You are doing what the literature has measured for fifty years.',
    description:
      'Your truth-rating lift on repeated false statements between round one and round two sits between six and twelve points. This is the Hasher Goldstein & Toppino (1977) founding-study modal band: their twenty-statement repetition set produced a mean truth-rating lift of ~0.5 on a 7-point scale (~7 points on a 100-scale) between session one and session two. Dechêne Stahl Hansen & Wänke (2010) meta-analysis of 51 studies reported a median effect size of g = 0.47, which converts to roughly 8-10 points on a 100-scale at typical literature SDs. You are operating at the typical adult magnitude of the illusory truth effect. Statements you saw a second time gained truth-credit purely from the familiarity of having seen them, with no new information added between the two ratings.',
    wizNote:
      'The structural insight in this band is that the lift is in the substrate, not in the conscious self-image. Subjects in Hasher Goldstein & Toppino (1977), Brown & Nix (1996), and Fazio Brashier Payne & Marsh (2015), when asked directly whether they had changed their ratings between blocks, denied that they had. The data showed they had. The two layers do not communicate. The most efficient way to feel the heuristic operating is to find a repeated false statement in the breakdown below where your round-two rating exceeds your round-one rating by more than the average. Your slider moved without any new evidence having been introduced. The slider was reading the familiarity, not the content.',
    research:
      'Hasher Goldstein & Toppino (1977) "Frequency and the Conference of Referential Validity" Journal of Verbal Learning and Verbal Behavior vol 16 founding study. Dechêne Stahl Hansen & Wänke (2010) "The Truth About the Truth: A Meta-Analytic Review of the Truth Effect" Personality and Social Psychology Review vol 14 meta of 51 studies, median g = 0.47. Fazio Brashier Payne & Marsh (2015) Journal of Experimental Psychology General. Brown & Nix (1996) "Turning Lies into Truths" Journal of Experimental Social Psychology vol 32.',
    traits: [
      'Inside the Hasher Goldstein & Toppino 1977 founding-study modal band',
      'Approximately at the Dechêne 2010 meta-analytic median g = 0.47',
      'Standard adult shape of the illusory truth effect',
      'Lift operates below the conscious analytical layer',
      'Most population-relevant of the five profiles',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Illusory Truth Effect test. My truth-rating lift on repeated false statements was 6-12 points — the Hasher Goldstein & Toppino (1977) founding-study modal band, the typical adult magnitude of the heuristic.',
  },
  {
    threshold: 20,
    emoji: '🌀',
    name: 'The Familiarity Believer',
    range: 'LIFT 12-20 POINTS',
    tagline: 'Repetition is doing most of the work on your truth judgments.',
    description:
      'Your truth-rating lift on repeated false statements between round one and round two sits between twelve and twenty points. This is above the Hasher Goldstein & Toppino (1977) founding-study modal band and inside the upper portion of the Dechêne Stahl Hansen & Wänke (2010) meta-analytic distribution. Fazio Brashier Payne & Marsh (2015) found subjects in this band continued to show the lift even on items where they knew the correct answer; the familiarity signal was running underneath the knowledge layer and dominating the eventual truth rating.',
    wizNote:
      'The risk in this band is what Skurnik Yoon Park & Schwarz (2005) call "the warning paradox": telling someone that a statement is false often increases its perceived truth on later exposure, because the warning itself is one more repetition. In real-world settings this band correlates with patterns like remembering a fact-checked headline as true after the fact-check has been forgotten, accepting an advertising claim after the third exposure regardless of its content, or updating toward a position after seeing it repeated across multiple sources that all originally came from a single source. The exit from this band is not "more exposures to the correction" — that strengthens the lift through the warning paradox. The exit is Brashier Eliseev & Marsh (2020) accuracy-focused initial encoding: when first encountering a claim, make a true/false judgment on it rather than processing it for ease, interest, or surprise.',
    research:
      'Fazio Brashier Payne & Marsh (2015) "Knowledge Does Not Protect Against Illusory Truth" Journal of Experimental Psychology General vol 144. Skurnik Yoon Park & Schwarz (2005) "How Warnings about False Claims Become Recommendations" Journal of Consumer Research vol 31. Pennycook Cannon & Rand (2018) "Prior Exposure Increases Perceived Accuracy of Fake News" Journal of Experimental Psychology General vol 147. Dechêne et al (2010) upper-meta band.',
    traits: [
      'Above the Hasher Goldstein & Toppino 1977 modal band',
      'Inside the upper Dechêne 2010 meta distribution',
      'Familiarity signal dominating truth judgments',
      'Vulnerable to the Skurnik 2005 warning paradox',
      'Most useful intervention: Brashier 2020 accuracy-focused initial encoding',
    ],
    shareText:
      'I scored "The Familiarity Believer" on WIZ\'s Illusory Truth Effect test. My truth-rating lift on repeated false statements was 12-20 points — above the Hasher Goldstein & Toppino (1977) founding-study band, inside the upper Dechêne 2010 meta-analytic distribution.',
  },
  {
    threshold: 1000,
    emoji: '🔁',
    name: 'The Echo',
    range: 'LIFT > 20 POINTS',
    tagline: 'A repeated claim is becoming a true claim, regardless of the content.',
    description:
      'Your truth-rating lift on repeated false statements between round one and round two exceeds twenty points. This is above the upper tail of the Dechêne Stahl Hansen & Wänke (2010) meta-analytic distribution, approaching the ceiling of effects documented in the literature. At this magnitude, your familiarity signal is the dominant input to your truth judgment, and the content of the statement is contributing relatively little. A false statement that you saw once and rated skeptically in round one became, on a second exposure with no new evidence introduced, a statement that feels substantially more true.',
    wizNote:
      'Two readings of this band. The first is the strong-fluency reading: your brain is using processing ease as a near-complete proxy for truth, the way Whittlesea (1993) and Reber & Schwarz (1999) document in subjects rating under low cognitive engagement. The familiarity-to-truth conversion is running at full strength and the analytical override is not interrupting it. The second reading is the response-style reading: it is possible to produce a large lift by becoming progressively more lenient in your round-two ratings regardless of which statements are repeated. The honest check is whether the gap between your round-two ratings on repeated false statements and your round-two ratings on new false statements is also large. If it is, the familiarity signal is doing the work; if the gap is small, the lift is response-style drift rather than illusory truth. In real-world settings this band is the load-bearing place for misinformation propagation: a debunked claim that is repeated across enough sources accumulates truth-credit by repetition until the original debunking is itself forgotten.',
    research:
      'Whittlesea (1993) "Illusions of Familiarity" Journal of Experimental Psychology Learning Memory & Cognition vol 19. Reber & Schwarz (1999) "Effects of Perceptual Fluency on Judgments of Truth" Consciousness and Cognition vol 8. Pennycook Cannon & Rand (2018). Pluviano Watt & Della Sala (2017) on repeated vaccine misinformation. Murray Stanley McPhetres Pennycook & Rand (2020) on COVID misinformation. Dechêne et al (2010) upper-tail band.',
    traits: [
      'Above the Dechêne 2010 meta-analytic upper tail',
      'Familiarity signal dominating over statement content',
      'Strong fluency-to-truth conversion at full strength',
      'High vulnerability to repeated-exposure misinformation',
      'Check between-statement gap to distinguish from response-style drift',
    ],
    shareText:
      'I scored "The Echo" on WIZ\'s Illusory Truth Effect test. My truth-rating lift on repeated false statements exceeded 20 points — above the upper tail of the Dechêne 2010 meta distribution. Repetition became truth.',
  },
];

function getProfile(lift: number): ProfileSpec {
  for (const p of PROFILES) {
    if (lift < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

// Deterministic seed-free shuffle helper (just splices a random permutation).
function shuffleCopy<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface SessionPlan {
  phase1: Statement[]; // 12 items: 6 true + 6 false
  phase2: Statement[]; // 18 items: phase1 (12) + 6 new (3 true + 3 false), shuffled
  newFalseIds: Set<number>;
  newTrueIds: Set<number>;
  repeatedFalseIds: Set<number>;
  repeatedTrueIds: Set<number>;
}

function buildPlan(): SessionPlan {
  const truesShuffled = shuffleCopy(TRUE_POOL);
  const falsesShuffled = shuffleCopy(FALSE_POOL);

  // First 6 of each = phase 1 set
  const phase1True = truesShuffled.slice(0, 6);
  const phase1False = falsesShuffled.slice(0, 6);
  const phase1Items = shuffleCopy([...phase1True, ...phase1False]);

  // Next 3 of each = new items added in phase 2
  const newTrue = truesShuffled.slice(6, 9);
  const newFalse = falsesShuffled.slice(6, 9);

  // Phase 2 = phase 1 items + new items, all shuffled
  const phase2Items = shuffleCopy([...phase1Items, ...newTrue, ...newFalse]);

  return {
    phase1: phase1Items,
    phase2: phase2Items,
    newFalseIds: new Set(newFalse.map((s) => s.id)),
    newTrueIds: new Set(newTrue.map((s) => s.id)),
    repeatedFalseIds: new Set(phase1False.map((s) => s.id)),
    repeatedTrueIds: new Set(phase1True.map((s) => s.id)),
  };
}

type Stage = 'intro' | 'phase1' | 'phase1-done' | 'phase2' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [plan] = useState<SessionPlan>(() => buildPlan());

  // phase1Ratings[statementId] = rating
  const [phase1Ratings, setPhase1Ratings] = useState<Record<number, number>>({});
  const [phase2Ratings, setPhase2Ratings] = useState<Record<number, number>>({});

  // Current item index within active phase
  const [p1Index, setP1Index] = useState(0);
  const [p2Index, setP2Index] = useState(0);

  const [currentSlider, setCurrentSlider] = useState<number>(50);

  const phase1Item = plan.phase1[p1Index];
  const phase2Item = plan.phase2[p2Index];
  const isLastP1 = p1Index === plan.phase1.length - 1;
  const isLastP2 = p2Index === plan.phase2.length - 1;

  const startPhase1 = useCallback(() => {
    setStage('phase1');
    setP1Index(0);
    setCurrentSlider(50);
  }, []);

  const startPhase2 = useCallback(() => {
    setStage('phase2');
    setP2Index(0);
    setCurrentSlider(50);
  }, []);

  const handlePhase1Next = useCallback(() => {
    if (!phase1Item) return;
    setPhase1Ratings((prev) => ({ ...prev, [phase1Item.id]: currentSlider }));
    if (isLastP1) {
      setStage('phase1-done');
      setCurrentSlider(50);
    } else {
      setP1Index((i) => i + 1);
      setCurrentSlider(50);
    }
  }, [phase1Item, currentSlider, isLastP1]);

  const handlePhase2Next = useCallback(() => {
    if (!phase2Item) return;
    setPhase2Ratings((prev) => ({ ...prev, [phase2Item.id]: currentSlider }));
    if (isLastP2) {
      setStage('results');
    } else {
      setP2Index((i) => i + 1);
      setCurrentSlider(50);
    }
  }, [phase2Item, currentSlider, isLastP2]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setP1Index(0);
    setP2Index(0);
    setPhase1Ratings({});
    setPhase2Ratings({});
    setCurrentSlider(50);
  }, []);

  // RESULTS COMPUTATION
  const results = useMemo(() => {
    if (stage !== 'results') {
      return null;
    }
    const repeatedFalseIds = [...plan.repeatedFalseIds];
    const repeatedTrueIds = [...plan.repeatedTrueIds];
    const newFalseIds = [...plan.newFalseIds];
    const newTrueIds = [...plan.newTrueIds];

    const mean = (xs: number[]) =>
      xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;

    const r1FalseRatings = repeatedFalseIds.map((id) => phase1Ratings[id] ?? 0);
    const r2RepeatedFalseRatings = repeatedFalseIds.map((id) => phase2Ratings[id] ?? 0);
    const r2NewFalseRatings = newFalseIds.map((id) => phase2Ratings[id] ?? 0);

    const r1TrueRatings = repeatedTrueIds.map((id) => phase1Ratings[id] ?? 0);
    const r2RepeatedTrueRatings = repeatedTrueIds.map((id) => phase2Ratings[id] ?? 0);
    const r2NewTrueRatings = newTrueIds.map((id) => phase2Ratings[id] ?? 0);

    const meanR1False = mean(r1FalseRatings);
    const meanR2RepeatedFalse = mean(r2RepeatedFalseRatings);
    const meanR2NewFalse = mean(r2NewFalseRatings);

    const meanR1True = mean(r1TrueRatings);
    const meanR2RepeatedTrue = mean(r2RepeatedTrueRatings);
    const meanR2NewTrue = mean(r2NewTrueRatings);

    // Within-subject lift on false: repeated false r2 - repeated false r1
    const withinSubjectFalseLift = meanR2RepeatedFalse - meanR1False;
    // Within-subject lift on true: repeated true r2 - repeated true r1
    const withinSubjectTrueLift = meanR2RepeatedTrue - meanR1True;
    // Between-statement gap: repeated false r2 - new false r2
    const betweenStatementFalseGap = meanR2RepeatedFalse - meanR2NewFalse;
    // Between-statement gap for true (smaller effect expected)
    const betweenStatementTrueGap = meanR2RepeatedTrue - meanR2NewTrue;

    // Per-statement breakdown for the 6 repeated false items
    const repeatedFalseBreakdown = plan.phase1
      .filter((s) => s.truth === 'false')
      .map((s) => ({
        statement: s,
        r1: phase1Ratings[s.id] ?? 0,
        r2: phase2Ratings[s.id] ?? 0,
        delta: (phase2Ratings[s.id] ?? 0) - (phase1Ratings[s.id] ?? 0),
      }));

    const repeatedTrueBreakdown = plan.phase1
      .filter((s) => s.truth === 'true')
      .map((s) => ({
        statement: s,
        r1: phase1Ratings[s.id] ?? 0,
        r2: phase2Ratings[s.id] ?? 0,
        delta: (phase2Ratings[s.id] ?? 0) - (phase1Ratings[s.id] ?? 0),
      }));

    const newFalseBreakdown = plan.phase2
      .filter((s) => plan.newFalseIds.has(s.id))
      .map((s) => ({
        statement: s,
        r2: phase2Ratings[s.id] ?? 0,
      }));

    const newTrueBreakdown = plan.phase2
      .filter((s) => plan.newTrueIds.has(s.id))
      .map((s) => ({
        statement: s,
        r2: phase2Ratings[s.id] ?? 0,
      }));

    // Largest within-subject delta on a repeated false (the "loudest engine" item)
    const loudestFalseDelta = repeatedFalseBreakdown.reduce(
      (max, curr) => (curr.delta > max.delta ? curr : max),
      repeatedFalseBreakdown[0] ?? {
        delta: 0,
        statement: null,
        r1: 0,
        r2: 0,
      },
    );

    return {
      meanR1False,
      meanR2RepeatedFalse,
      meanR2NewFalse,
      meanR1True,
      meanR2RepeatedTrue,
      meanR2NewTrue,
      withinSubjectFalseLift,
      withinSubjectTrueLift,
      betweenStatementFalseGap,
      betweenStatementTrueGap,
      repeatedFalseBreakdown,
      repeatedTrueBreakdown,
      newFalseBreakdown,
      newTrueBreakdown,
      loudestFalseDelta,
      profile: getProfile(withinSubjectFalseLift),
    };
  }, [stage, plan, phase1Ratings, phase2Ratings]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined' || !results) return;
    const text = `${results.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/illusory-truth-effect`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [results]);

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
              <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-3">
                The Illusory Truth Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Twelve statements. One truth slider each. Then eighteen statements — the same twelve, plus six new ones, in shuffled order. WIZ measures how much familiarity lifted your sense of truth.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-cyan-300/80 italic">
                &ldquo;Frequency information is automatically registered in memory, and it influences judgments of validity even when subjects are explicitly warned about the manipulation.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Hasher Goldstein & Toppino, Journal of Verbal Learning and Verbal Behavior 1977</span>
              </p>
              <p>
                In 1977 Lynn Hasher, David Goldstein, and Thomas Toppino showed subjects sixty plausible trivia statements across three sessions two weeks apart. Forty of the statements changed every session; twenty repeated unchanged. After each statement subjects rated how true it felt on a 1-7 scale. The mean truth rating for repeated statements rose from 4.2 in session one to 4.6 in session two. The mean rating for new statements stayed flat at 4.0. The effect was independent of whether the statements were actually true. Repeated false statements gained as much truth-credit as repeated true ones. Repetition was being metabolized as evidence.
              </p>
              <p>
                Dechêne Stahl Hansen and Wänke (2010) ran a meta-analysis of 51 illusory-truth studies and reported a mean effect size of g = 0.47, with the effect surviving warnings, surviving incentives for accuracy, and surviving in subjects who explicitly recognized that a statement was a repeat. Fazio Brashier Payne and Marsh (2015) showed that the lift even survives knowing the correct answer: subjects who knew that the largest ocean is the Pacific still rated the repeated false claim &ldquo;the largest ocean is the Atlantic&rdquo; as more true on second exposure.
              </p>
              <p>
                The mechanism is processing fluency. A statement that is easier to process feels more true, and a repeated statement is easier to process than a new one because the encoding pathway has already been walked. The familiarity signal is read as truth-evidence before the knowledge check fires, and the knowledge check often does not fire at all because the familiarity signal precludes the system-two override (Reber & Schwarz 1999).
              </p>
              <p>
                You are about to do a two-round version of the paradigm. Round one: twelve statements, one truth slider each (0 = obviously false, 100 = obviously true). Round two: eighteen statements — the twelve from round one, plus six new ones, in shuffled order. Same slider. I never reveal during either round which ones are actually true or false, so the only thing changing between round one and round two is your own familiarity. At the end I show you the lift, the gaps, and the answers.
              </p>
              <p className="text-zinc-500 text-xs">
                Familiarity and truth are supposed to be two separate things. The illusory truth effect makes them one.
              </p>
            </div>

            <button
              onClick={startPhase1}
              className="w-full md:w-auto px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-colors"
            >
              Begin round one →
            </button>
          </section>
        )}

        {stage === 'phase1' && phase1Item && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest flex justify-between">
              <span>ROUND 1 OF 2 — ITEM {p1Index + 1} OF {plan.phase1.length}</span>
              <span className="text-cyan-400">no reveals until the end</span>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-5">
              <p className="text-lg md:text-xl text-zinc-100 leading-relaxed">
                {phase1Item.text}
              </p>

              <div className="space-y-3 border-t border-zinc-800 pt-5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">HOW TRUE DOES THIS FEEL?</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — obviously false</span>
                  <span>50 — could go either way</span>
                  <span>100 — obviously true</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSlider}
                  onChange={(e) => setCurrentSlider(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                  aria-label="Truth rating"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">
                    {currentSlider}
                    <span className="text-lg text-zinc-500">/100</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePhase1Next}
                className="w-full px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-colors"
              >
                {isLastP1 ? 'Finish round one →' : `Lock in ${currentSlider} and continue →`}
              </button>
            </div>

            <div className="text-xs text-zinc-600 flex justify-between">
              <span>{p1Index + 1} / {plan.phase1.length}</span>
              <span>round 1</span>
            </div>
          </section>
        )}

        {stage === 'phase1-done' && (
          <section className="space-y-6">
            <header>
              <div className="text-xs text-zinc-500 tracking-widest mb-3">ROUND ONE COMPLETE</div>
              <h2 className="text-2xl font-bold text-cyan-300 mb-3">
                Now round two.
              </h2>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p>
                Round two has eighteen statements. The twelve you already saw, plus six new ones, shuffled. Same slider. Same instructions: how true does it feel, 0 to 100.
              </p>
              <p>
                Nothing about any statement has changed. No new information has been added. The only thing that has happened between round one and round two is that you have now seen the round-one statements once. The illusory truth effect, if it is operating, will show up as an upward lift on the repeated statements relative to your own round-one ratings, and relative to the six new statements that you have never seen.
              </p>
              <p className="text-zinc-500 text-xs">
                Hasher Goldstein & Toppino (1977) reported a ~7 point lift between session one and session two on a 100-equivalent scale. Dechêne et al (2010) meta median translates to roughly 8-10 points. Brashier Eliseev & Marsh (2020) post-warning condition: 3-6 points. The Skeptic profile sits below 2 points and is rare.
              </p>
            </div>

            <button
              onClick={startPhase2}
              className="w-full md:w-auto px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-colors"
            >
              Begin round two →
            </button>
          </section>
        )}

        {stage === 'phase2' && phase2Item && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest flex justify-between">
              <span>ROUND 2 OF 2 — ITEM {p2Index + 1} OF {plan.phase2.length}</span>
              <span className="text-cyan-400">no reveals until the end</span>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-6 space-y-5">
              <p className="text-lg md:text-xl text-zinc-100 leading-relaxed">
                {phase2Item.text}
              </p>

              <div className="space-y-3 border-t border-zinc-800 pt-5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">HOW TRUE DOES THIS FEEL?</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — obviously false</span>
                  <span>50 — could go either way</span>
                  <span>100 — obviously true</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentSlider}
                  onChange={(e) => setCurrentSlider(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                  aria-label="Truth rating"
                />
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">
                    {currentSlider}
                    <span className="text-lg text-zinc-500">/100</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePhase2Next}
                className="w-full px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-colors"
              >
                {isLastP2 ? 'See your illusory truth report →' : `Lock in ${currentSlider} and continue →`}
              </button>
            </div>

            <div className="text-xs text-zinc-600 flex justify-between">
              <span>{p2Index + 1} / {plan.phase2.length}</span>
              <span>round 2</span>
            </div>
          </section>
        )}

        {stage === 'results' && results && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR ILLUSORY TRUTH REPORT</div>
              <div className="text-7xl mb-3">{results.profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">{results.profile.name}</h2>
              <p className="text-zinc-400 italic">{results.profile.tagline}</p>
            </header>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border p-4 text-center ${
                  results.withinSubjectFalseLift < 2
                    ? 'border-emerald-700 bg-emerald-950/30'
                    : results.withinSubjectFalseLift < 12
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">WITHIN-SUBJECT LIFT</div>
                <div
                  className={`text-3xl font-bold ${
                    results.withinSubjectFalseLift < 2
                      ? 'text-emerald-200'
                      : results.withinSubjectFalseLift < 12
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {results.withinSubjectFalseLift > 0 ? '+' : ''}
                  {results.withinSubjectFalseLift.toFixed(1)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">repeated false: r2 − r1</div>
              </div>
              <div
                className={`border p-4 text-center ${
                  results.betweenStatementFalseGap < 2
                    ? 'border-emerald-700 bg-emerald-950/30'
                    : results.betweenStatementFalseGap < 12
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">BETWEEN-STATEMENT GAP</div>
                <div
                  className={`text-3xl font-bold ${
                    results.betweenStatementFalseGap < 2
                      ? 'text-emerald-200'
                      : results.betweenStatementFalseGap < 12
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {results.betweenStatementFalseGap > 0 ? '+' : ''}
                  {results.betweenStatementFalseGap.toFixed(1)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">round-2 false: repeated − new</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-zinc-500 mb-1">repeated FALSE r1 mean</div>
                <div className="text-zinc-200 font-bold">{results.meanR1False.toFixed(1)}</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-zinc-500 mb-1">repeated FALSE r2 mean</div>
                <div className="text-zinc-200 font-bold">{results.meanR2RepeatedFalse.toFixed(1)}</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-zinc-500 mb-1">new FALSE r2 mean</div>
                <div className="text-zinc-200 font-bold">{results.meanR2NewFalse.toFixed(1)}</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-3">
                <div className="text-zinc-500 mb-1">repeated TRUE r2 − r1</div>
                <div className="text-zinc-200 font-bold">
                  {results.withinSubjectTrueLift > 0 ? '+' : ''}
                  {results.withinSubjectTrueLift.toFixed(1)}
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <div>
                <div className="text-xs text-cyan-400 tracking-widest mb-1">{results.profile.range}</div>
                <p>{results.profile.description}</p>
              </div>
              <div>
                <div className="text-xs text-cyan-400 tracking-widest mb-1">WIZ NOTE</div>
                <p className="italic">{results.profile.wizNote}</p>
              </div>
              <div>
                <div className="text-xs text-cyan-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{results.profile.research}</p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-cyan-400 tracking-widest mb-2">SIGNATURE TRAITS</div>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {results.profile.traits.map((trait) => (
                    <li key={trait}>· {trait}</li>
                  ))}
                </ul>
              </div>

              {results.loudestFalseDelta.statement && (
                <div className="border-t border-zinc-800 pt-3">
                  <div className="text-xs text-cyan-400 tracking-widest mb-1">LOUDEST ENGINE</div>
                  <p className="text-xs text-zinc-400">
                    <span className="text-rose-300">&ldquo;{results.loudestFalseDelta.statement.text}&rdquo;</span> — you rated it {results.loudestFalseDelta.r1} in round one and{' '}
                    <span className="text-rose-300">{results.loudestFalseDelta.r2}</span> in round two, a lift of{' '}
                    <span className="text-rose-300 font-bold">+{results.loudestFalseDelta.delta}</span> points. The statement did not change. Your slider did. This is where the familiarity signal moved your truth judgment the most.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-cyan-400 tracking-widest mb-3">REPEATED FALSE STATEMENTS — THE ENGINE</div>
              <div className="space-y-3">
                {results.repeatedFalseBreakdown.map((b) => (
                  <div key={b.statement.id} className="border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm text-zinc-300 mb-1">{b.statement.text}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="text-zinc-500">
                        r1: <span className="text-zinc-200">{b.r1}</span>
                      </span>
                      <span className="text-zinc-500">
                        r2: <span className="text-zinc-200">{b.r2}</span>
                      </span>
                      <span className={b.delta > 0 ? 'text-rose-300' : b.delta < 0 ? 'text-emerald-300' : 'text-zinc-500'}>
                        Δ: {b.delta > 0 ? '+' : ''}
                        {b.delta}
                      </span>
                      <span className="text-rose-400/70 font-bold uppercase">actually false</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{b.statement.verdict}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-cyan-400 tracking-widest mb-3">REPEATED TRUE STATEMENTS — THE CONTROL</div>
              <div className="space-y-3">
                {results.repeatedTrueBreakdown.map((b) => (
                  <div key={b.statement.id} className="border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm text-zinc-300 mb-1">{b.statement.text}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="text-zinc-500">
                        r1: <span className="text-zinc-200">{b.r1}</span>
                      </span>
                      <span className="text-zinc-500">
                        r2: <span className="text-zinc-200">{b.r2}</span>
                      </span>
                      <span className={b.delta > 0 ? 'text-amber-300' : b.delta < 0 ? 'text-emerald-300' : 'text-zinc-500'}>
                        Δ: {b.delta > 0 ? '+' : ''}
                        {b.delta}
                      </span>
                      <span className="text-emerald-400/70 font-bold uppercase">actually true</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{b.statement.verdict}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 italic mt-3">
                The literature finds the illusory-truth lift on true statements is typically half the lift on false statements (Dechêne et al 2010). True statements have less room to move because they were already rated higher in round one, but the same familiarity-to-truth conversion is operating.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-cyan-400 tracking-widest mb-3">NEW STATEMENTS IN ROUND TWO — THE BASELINE</div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-rose-400/80 mb-2">NEW FALSE (r2 only)</div>
                  <div className="space-y-2">
                    {results.newFalseBreakdown.map((b) => (
                      <div key={b.statement.id} className="text-xs">
                        <p className="text-zinc-300">{b.statement.text}</p>
                        <p className="text-zinc-500">r2: <span className="text-zinc-200">{b.r2}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-emerald-400/80 mb-2">NEW TRUE (r2 only)</div>
                  <div className="space-y-2">
                    {results.newTrueBreakdown.map((b) => (
                      <div key={b.statement.id} className="text-xs">
                        <p className="text-zinc-300">{b.statement.text}</p>
                        <p className="text-zinc-500">r2: <span className="text-zinc-200">{b.r2}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 italic mt-3">
                These six were the &ldquo;new&rdquo; statements you saw only in round two. Their ratings are the baseline against which the repeated statements are measured. If repeated false statements scored substantially higher than new false statements, the familiarity-to-truth conversion was the difference.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Brashier Eliseev & Marsh (2020) identified one robust intervention against illusory truth: at the moment of first encounter with a claim, make a true/false judgment on it. Not a fluency rating, not an interest rating, not a memorability rating. A truth call. This forces the analytical system to engage at encoding rather than at retrieval, and roughly halves the later illusory-truth lift on the same items. The reframe is not to suppress your sense of familiarity; it is to notice that on a second encounter, the slider is registering the ease of processing, and to ask whether the content survives being decoupled from the familiarity. Pennycook Cannon & Rand (2018) showed the same intervention reduces susceptibility to fake-news headlines, even when the headline is tagged as disputed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-colors flex-1"
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
              Sources: Hasher Goldstein &amp; Toppino (1977) &ldquo;Frequency and the Conference of Referential Validity,&rdquo; Journal of Verbal Learning and Verbal Behavior vol 16, founding study. Dechêne Stahl Hansen &amp; Wänke (2010) &ldquo;The Truth About the Truth: A Meta-Analytic Review of the Truth Effect,&rdquo; Personality and Social Psychology Review vol 14, meta-analysis of 51 studies, median g = 0.47. Fazio Brashier Payne &amp; Marsh (2015) &ldquo;Knowledge Does Not Protect Against Illusory Truth,&rdquo; Journal of Experimental Psychology General vol 144. Brashier Eliseev &amp; Marsh (2020) &ldquo;An Initial Accuracy Focus Prevents Illusory Truth,&rdquo; Cognition vol 194. Begg Anas &amp; Farinacci (1992) &ldquo;Dissociation of Processes in Belief,&rdquo; Journal of Experimental Psychology General vol 121. Brown &amp; Nix (1996) &ldquo;Turning Lies into Truths,&rdquo; Journal of Experimental Social Psychology vol 32. Bacon (1979) on the role of familiarity in judgments of truth. Boehm (1994) on the temporal robustness of the truth effect. Roggeveen &amp; Johar (2002) on source-credibility interactions. Whittlesea (1993) &ldquo;Illusions of Familiarity,&rdquo; Journal of Experimental Psychology Learning Memory &amp; Cognition vol 19. Reber &amp; Schwarz (1999) &ldquo;Effects of Perceptual Fluency on Judgments of Truth,&rdquo; Consciousness and Cognition vol 8. Pennycook Cannon &amp; Rand (2018) &ldquo;Prior Exposure Increases Perceived Accuracy of Fake News,&rdquo; Journal of Experimental Psychology General vol 147. Skurnik Yoon Park &amp; Schwarz (2005) &ldquo;How Warnings about False Claims Become Recommendations,&rdquo; Journal of Consumer Research vol 31. Pluviano Watt &amp; Della Sala (2017) on repeated vaccine misinformation. Murray Stanley McPhetres Pennycook &amp; Rand (2020) on COVID-19 misinformation propagation. Polage (2012) on illusory autobiographical memory. Statement sources for the round-one items: Wells (1978), Cocker &amp; Mabey (2005), Hernon (2003), USDA Plant Database, White (1978), Yang et al. (2021), Maisey et al. (2017), NOAA, SETE, Vargas et al. (2004), Beyerstein (1999), NASA Earth Observatory (2005), Jacobs Deegan &amp; Neitz (1998), NOAA NSSL, Bartoshuk (1993), Isaacson (2007), Frank (2000), Dwyer (2007). All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
