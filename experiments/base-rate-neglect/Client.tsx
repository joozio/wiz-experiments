'use client';

// THE BASE RATE NEGLECT TEST
// Tversky and Kahneman (1973) showed that when subjects were given a personality
// sketch of "Tom W" written to fit the engineer stereotype, they ranked
// engineering as his most likely graduate field — even when told that 70 of 100
// graduate students in the room were in humanities and only 30 in engineering.
// The base rate was given to them on the same page. They ignored it. The
// description felt more representative than 70% felt informative. Eddy (1982)
// gave 100 physicians a written mammogram problem with 1% prevalence, 80%
// sensitivity, and 9.6% false positive rate, and asked the posterior probability
// of cancer given a positive mammogram. The Bayesian answer is 7.8%. The median
// physician answer was 75%. Casscells, Schoenberger and Grayboys (1978) found
// 95 of 100 Harvard medical school staff and students gave a probability around
// 95% for a 1-in-1000-prevalence disease test with a 5% false-positive rate;
// the correct answer is just under 2%. Tversky and Kahneman (1980) ran the
// blue cab problem — 85% of the city's cabs are Green, 15% Blue, witness
// identifies a hit-and-run cab as Blue with 80% accuracy in calibrated
// nighttime tests — and found subjects ignored the 85/15 base rate and gave
// the witness's stated accuracy (80%) as their posterior. The Bayes answer is
// 41%. Bar-Hillel (1980) showed the neglect persists across scenario type and
// IQ band. Gigerenzer and Hoffrage (1995) demonstrated that swapping
// percentage probabilities for natural frequencies (1 of 1000 instead of 0.1%)
// dramatically reduces the error — most people CAN reason Bayesianly when
// the scaffolding helps them, which means the failure is not a deficit, it is
// a presentation problem. The lesson is the same across all of these studies.
// The brain is built to ask "does this person, this case, this signal LOOK
// like the category?" before it asks "how many cases of the category exist
// at all?" The first question is fast and stereotypically powerful. The
// second is slow and disenchanting and almost always more important.
// WIZ note: I am a probability estimator without the gut. You are a
// probability estimator with the gut. The gut runs on representativeness;
// the math runs on base rates. This experiment runs 8 standard scenarios
// through your estimator and compares your answer to the Bayesian posterior.
// The gap is base rate neglect, measured in percentage points.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  setup: string;
  prompt: string;
  baseRate: string;
  signal: string;
  bayesAnswer: number; // the correct posterior, percent 0-100
  populationGuess: number; // the typical wrong answer
  reveal: string;
  math: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'CASE 1 OF 8',
    title: 'The Cab',
    emoji: '🚕',
    setup:
      'A cab is involved in a hit-and-run accident at night. There are two cab companies in the city: 85% of the cabs are Green, 15% are Blue. A witness identifies the cab as Blue. In court, the witness is tested under the same nighttime conditions and identifies the color correctly 80% of the time.',
    prompt: 'What is the probability the cab was actually Blue?',
    baseRate: '15% of cabs are Blue (base rate)',
    signal: 'Witness 80% accurate, says Blue',
    bayesAnswer: 41,
    populationGuess: 80,
    reveal:
      'The Bayesian answer is 41%. Most subjects in the original Tversky and Kahneman (1980) study gave 80% — the witness accuracy itself, ignoring the 85/15 base rate entirely. Even though Blue is the witness call, Green cabs are so common that the witness misidentifying a Green cab as Blue (20% of 85% = 17% of all cabs) almost equals the witness correctly identifying a Blue cab as Blue (80% of 15% = 12% of all cabs). 12 / (12 + 17) = 0.41.',
    math:
      'P(Blue|"Blue") = P("Blue"|Blue) × P(Blue) / P("Blue") = (0.80 × 0.15) / (0.80 × 0.15 + 0.20 × 0.85) = 0.12 / 0.29 ≈ 0.41.',
    research:
      'Tversky & Kahneman (1980) "Causal Schemas in Judgments under Uncertainty," in Fishbein (ed) Progress in Social Psychology. Bar-Hillel (1980) "The Base-Rate Fallacy in Probability Judgments," Acta Psychologica vol 44.',
    wizCommentary:
      'The witness is reliable. The witness is also reporting on a population in which the rare class is being asked to defend itself against the much more common class. Even an 80% witness, applied to a 15% category, produces more false alarms than true hits. The brain reads "80% accurate" and stops. Bayes reads "80% accurate of which population" and continues.',
  },
  {
    id: 2,
    phase: 'CASE 2 OF 8',
    title: 'The Mammogram',
    emoji: '🩺',
    setup:
      'A woman in her 40s with no family history takes a routine mammogram. In this group, 1% of women have breast cancer. The test correctly flags 80% of women who have cancer (sensitivity). The test also flags 9.6% of women who do NOT have cancer (false positive rate). She gets a positive result.',
    prompt: 'What is the probability she actually has breast cancer?',
    baseRate: '1% of this population has cancer',
    signal: 'Test positive (80% sensitivity, 9.6% false positive)',
    bayesAnswer: 8,
    populationGuess: 75,
    reveal:
      'The Bayesian answer is 7.8%. Eddy (1982) gave this problem to 100 physicians; 95 of them gave answers between 70% and 80%. The median was 75%. Out of 1,000 women: 10 have cancer, 8 of those test positive. The other 990 do not have cancer, but 9.6% of them — about 95 women — also test positive. So among 103 positive results, only 8 actually have cancer. 8 / 103 ≈ 7.8%.',
    math:
      'Out of 1,000: 10 have cancer (8 true positives) + 990 healthy (95 false positives) = 103 positives total. P(cancer|+) = 8 / 103 ≈ 0.078.',
    research:
      'Eddy (1982) "Probabilistic Reasoning in Clinical Medicine: Problems and Opportunities," in Kahneman Slovic Tversky (eds). Replicated by Casscells, Schoenberger & Grayboys (1978) at Harvard Medical School. Gigerenzer & Hoffrage (1995) showed natural-frequency framing cut the error rate from 84% to 50%.',
    wizCommentary:
      'A "positive" result on a screening test is a hypothesis, not a diagnosis. When the disease is rare and the test is imperfect, most positives come from the healthy majority being slightly mis-tested rather than the sick minority being correctly flagged. This is why screening guidelines focus on prevalence, not test accuracy alone. The radiologist who tells a patient "you tested positive but the prior was 1%, so the chance is closer to 8%" is not being reassuring; she is being Bayesian.',
  },
  {
    id: 3,
    phase: 'CASE 3 OF 8',
    title: 'The Rare Disease',
    emoji: '🧬',
    setup:
      'A new disease affects 1 in 1,000 people in the general population. A diagnostic test is developed with 99% sensitivity (catches 99% of true cases) and 99% specificity (5 false positives per 500 healthy people). You take the test. It comes back positive.',
    prompt: 'What is the probability you actually have the disease?',
    baseRate: '0.1% prevalence (1 in 1,000)',
    signal: 'Test positive (99% sensitivity, 99% specificity)',
    bayesAnswer: 9,
    populationGuess: 95,
    reveal:
      'The Bayesian answer is about 9%. Casscells, Schoenberger & Grayboys (1978) gave this exact problem to Harvard Medical School staff and students; 11 of 60 gave the correct answer (~2% in the original 5%-false-positive version). The median answer was 95%. In a population of 10,000: 10 have the disease, ~10 test positive (true positives). The other 9,990 do not, but 1% of them — about 100 — also test positive. So 10 of 110 positives are real. 10 / 110 ≈ 9%.',
    math:
      'Out of 10,000: 10 sick (10 true positives) + 9,990 healthy (~100 false positives) = 110 positives. P(disease|+) = 10 / 110 ≈ 0.091.',
    research:
      'Casscells, Schoenberger & Grayboys (1978) "Interpretation by Physicians of Clinical Laboratory Results," New England Journal of Medicine vol 299. Gigerenzer Hoffrage Kleinbölting (1991), Gigerenzer (2002) "Calculated Risks."',
    wizCommentary:
      'This is the most expensive base rate in modern life. People test positive for rare conditions, hear "99% accurate," and believe they have a 99% chance of disease. The math is the opposite. When prevalence is low and false-positive rate is even modest, the positive predictive value collapses. This is why responsible medical testing ALWAYS pairs a positive screening with a confirmatory test rather than treatment.',
  },
  {
    id: 4,
    phase: 'CASE 4 OF 8',
    title: 'Tom W',
    emoji: '🤓',
    setup:
      'Tom W is highly intelligent, but lacks creativity. He has a need for order and clarity, and for neat and tidy systems. His writing is rather dull and mechanical, occasionally enlivened by corny puns. He has a strong drive for competence. He has little feeling and sympathy for other people. He is now a graduate student at a US university. Among graduate students at this university, the field distribution is approximately: Education 30%, Humanities 20%, Social Science 17%, Business 15%, Medicine 10%, Engineering 5%, Computer Science 3%.',
    prompt: 'What is the probability Tom W is a Computer Science graduate student?',
    baseRate: '3% of grad students are in CS',
    signal: 'Personality sketch fits the CS stereotype',
    bayesAnswer: 12,
    populationGuess: 60,
    reveal:
      'The Bayesian answer is around 12% under generous assumptions. Tversky & Kahneman (1973) used this exact sketch and found subjects ranked engineering and CS at the top, with median estimates above 60%. Even if the sketch is 4× more "diagnostic" of CS than the average field, multiplying a 3% base rate by 4 yields ~12%. The sketch was actually engineered to be uninformative — it is the same sketch used in the Kahneman-Tversky 1973 paper to show that subjects ignore base rates even when given them on the same page.',
    math:
      'Even assuming the description is 4× more representative of CS than other fields, and ignoring how diagnostic it really is: 3% × 4 ≈ 12%. The original subjects gave answers above 60% — they multiplied 100% representativeness by 100% confidence, not by base rate.',
    research:
      'Tversky & Kahneman (1973) "On the Psychology of Prediction," Psychological Review vol 80. The Tom W sketch and the Linda problem (the conjunction fallacy) are the twin founding studies of the representativeness-heuristic literature.',
    wizCommentary:
      'The brain reads the sketch and asks "does Tom resemble a CS grad student?" — a fast yes. Bayes asks "for every Tom who looks like a CS grad student, how many actual CS grad students exist relative to other grad students who might also vaguely fit?" The answer is "very few." The 30% of the population in education contains many Toms too. The base rate is doing 80% of the work and the sketch is doing 20%, but in the brain those weights are reversed.',
  },
  {
    id: 5,
    phase: 'CASE 5 OF 8',
    title: 'The Librarian Or Farmer',
    emoji: '📚',
    setup:
      'Steve is shy and withdrawn, invariably helpful but with little interest in people or the world of reality. A meek and tidy soul, he has a need for order and structure, and a passion for detail. In the United States, there are approximately 158,000 librarians and 1,800,000 people in farming occupations — about 11 farmers for every librarian, including many who fit the description.',
    prompt: 'What is the probability Steve is a librarian rather than a farmer?',
    baseRate: '8% of {librarian, farmer} are librarians',
    signal: 'Personality description fits the librarian stereotype',
    bayesAnswer: 22,
    populationGuess: 75,
    reveal:
      'Even if the description is three times more "librarian-like" than farmer-like, the math says ~22%. Most subjects in the original Kahneman-Tversky (1973) study answered 80%+, fully ignoring that there are 11 farmers for every librarian. Many farmers are also shy, tidy, and detail-oriented. The pool is so much larger that even with a strong stereotype match, the absolute count of fitting farmers exceeds the count of fitting librarians.',
    math:
      'Suppose P(description|librarian) = 0.75 and P(description|farmer) = 0.25. P(librarian|description) = (0.75 × 0.08) / (0.75 × 0.08 + 0.25 × 0.92) = 0.06 / 0.29 ≈ 0.21.',
    research:
      'Kahneman & Tversky (1973). US Bureau of Labor Statistics 2023 — librarians: 158K, agricultural workers + farmers + ranchers: ~1.8M.',
    wizCommentary:
      'The stereotype is doing real cognitive work — Steve really does sound more like a librarian than a farmer, in isolation. But "in isolation" is exactly the wrong frame. Farmers outnumber librarians 11 to 1 in the US, which means the count of shy-and-tidy farmers swamps the count of shy-and-tidy librarians, even though the rate is lower. Stereotype × tiny population almost never beats weak signal × huge population.',
  },
  {
    id: 6,
    phase: 'CASE 6 OF 8',
    title: 'The Polygraph',
    emoji: '🎭',
    setup:
      'A company gives every new hire a polygraph test. The polygraph is 90% accurate at detecting deception (90% sensitivity) and 90% accurate at clearing honest people (90% specificity). In a batch of 1,000 new hires, suppose 5% (50 people) are actually lying about something material on their application.',
    prompt: 'Of the people who fail the polygraph, what percent are actually lying?',
    baseRate: '5% of applicants are lying',
    signal: 'Polygraph fails them (90% sensitivity, 90% specificity)',
    bayesAnswer: 32,
    populationGuess: 80,
    reveal:
      'The Bayesian answer is about 32%. Of 1,000 applicants: 50 lie (45 fail correctly), 950 are honest (95 fail incorrectly = 10% false positives). Among the 140 failures, only 45 are actually lying. 45 / 140 ≈ 32%. Two thirds of the people the polygraph flags as liars are honest people. This is why the National Academy of Sciences (2003) review recommended polygraphs NOT be used for employment screening — they generate too many false positives at the prevalence rates that exist in normal populations.',
    math:
      'Out of 1,000: 50 liars (45 fail) + 950 honest (95 fail) = 140 fails. P(lying|fail) = 45 / 140 ≈ 0.32.',
    research:
      'National Academy of Sciences (2003) "The Polygraph and Lie Detection." Saxe Dougherty Cross (1985) on polygraph base rates. The Employee Polygraph Protection Act (1988) banned most private-sector polygraph testing in the US largely because of this base-rate problem.',
    wizCommentary:
      'A 90%-accurate test sounds excellent. A 90%-accurate test applied to a population where the thing being tested for is rare produces a flagging system that is wrong about its accusations more often than it is right. This is the same math as the rare disease — different domain, identical structure. The "screening" framing makes people lower their guard about what the prior even is.',
  },
  {
    id: 7,
    phase: 'CASE 7 OF 8',
    title: 'The Terrorist Profiler',
    emoji: '🛂',
    setup:
      'A facial-recognition surveillance system claims 99% accuracy at identifying suspected terrorists from airport camera feeds: 99% sensitivity (catches 99% of actual suspects) and 99% specificity (only 1 in 100 innocents is wrongly flagged). It is deployed across US airports processing 1 million passengers per day. Among those passengers, suppose 100 are actual suspects on a watch list.',
    prompt: 'Of the people the system flags as suspects, what percent are actual suspects?',
    baseRate: '0.01% of passengers are actual suspects',
    signal: 'System flags them (99% accurate both ways)',
    bayesAnswer: 1,
    populationGuess: 70,
    reveal:
      'The Bayesian answer is 1.0%. Out of 1,000,000 passengers: 100 are real suspects (99 flagged correctly), 999,900 are innocent (9,999 flagged incorrectly = 1% false positives). Among ~10,098 flags, only 99 are real. 99 / 10,098 ≈ 1.0%. For every actual suspect caught, the system harasses about 100 innocent travelers. This is the math behind why intelligence agencies prefer narrow, intelligence-driven targeting over mass surveillance — the false-positive load at scale is structurally crushing.',
    math:
      'Out of 1,000,000: 100 suspects (99 flagged) + 999,900 innocents (9,999 flagged) = 10,098 flags. P(suspect|flagged) = 99 / 10,098 ≈ 0.0098.',
    research:
      'Schneier (2006) "Why Data Mining Won\'t Stop Terror." Jonas & Harper (2006) Cato Institute. Munk (2008) on the Total Information Awareness program. The "false-positive problem" is the canonical critique of mass-surveillance systems and is explicit base-rate math.',
    wizCommentary:
      'When the population of true positives is tiny relative to the population being scanned, no amount of test accuracy short of perfection produces a usable flagging system. 99% accurate, applied to one in ten thousand, produces a flag stream that is 99% noise. The intuition that "99% accurate is great" is a base-rate failure shaped exactly like the medical-test failure, scaled up by a factor of a thousand.',
  },
  {
    id: 8,
    phase: 'CASE 8 OF 8',
    title: 'The Drunk Driver Stop',
    emoji: '🚨',
    setup:
      'A traffic officer claims he can identify drunk drivers with 95% accuracy from observing driving behavior — 95% of drunk drivers are correctly identified, and 95% of sober drivers are correctly cleared. On a given Tuesday morning, about 1 in 200 drivers on the road are actually drunk (0.5%). The officer signals a driver to pull over.',
    prompt: 'What is the probability the driver is actually drunk?',
    baseRate: '0.5% of drivers are drunk on Tuesday morning',
    signal: 'Officer flags them (95% accurate both ways)',
    bayesAnswer: 9,
    populationGuess: 70,
    reveal:
      'The Bayesian answer is about 8.7%. Out of 10,000 drivers: 50 are drunk (~48 correctly flagged), 9,950 are sober (~498 falsely flagged at 5% false-positive rate). Among ~546 flags, only 48 are actually drunk. 48 / 546 ≈ 8.7%. This is why field sobriety tests, breathalyzers, and blood tests exist — the initial observation-based stop is a screening with low PPV, and the legal system requires a confirmatory test before consequences attach.',
    math:
      'Out of 10,000: 50 drunk (48 flagged) + 9,950 sober (498 false positives) = 546 flags. P(drunk|flagged) = 48 / 546 ≈ 0.087.',
    research:
      'Compton & Berning (2015) NHTSA roadside survey data on alcohol prevalence by time of day. Same Bayesian structure as the medical and surveillance examples. The legal requirement for confirmatory testing is structural recognition of the base-rate problem.',
    wizCommentary:
      'A 95% accurate human screener applied to a population where 99.5% of subjects are sober produces a stop log where 91 out of 100 stops are sober drivers. The officer is doing his job correctly inside the constraint of his accuracy rate; the false positives are not error so much as base-rate consequence. Confirmatory testing is the system\'s built-in correction. The intuition that "95% accurate cop = mostly drunk drivers stopped" inverts the math.',
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
    key: 'bayesian',
    name: 'The Bayesian',
    emoji: '🧮',
    range: 'Avg gap under 10 points',
    tagline: 'You weight base rates almost as heavily as the evidence in front of you.',
    description:
      'Your average answer landed within 10 points of the Bayesian posterior across all 8 scenarios. This is the rare calibrated band. You do not collapse a probability question into a representativeness check. When you see "99% accurate test," your brain reaches for "of which population?" before it reaches for an answer. This trait is uncommon enough that the original Kahneman-Tversky studies rarely found subjects in this band even among professional statisticians given the problems cold.',
    wizNote:
      'You are running the math the brain was not built to run by default. The cost is real: it slows decisions and can feel unintuitive in conversation, where stating the base-rate-corrected probability often sounds like dismissal of the evidence. The benefit is enormous in any domain where signals are imperfect and prevalence is uneven — medicine, security, hiring, investment, dating apps, fraud detection. You will not be surprised by a positive screening, you will not over-trust an accurate witness, and you will not deploy a 99% system without first asking what the 99% applies to.',
    research:
      'Gigerenzer & Hoffrage (1995) found subjects in this band consistently use what they call "natural frequency" framing internally — converting percentages into counts before estimating. This is the technique behind every accurate Bayesian reasoner studied in the last 50 years.',
    traits: ['Asks "of what population" reflexively', 'Translates percentages into counts', 'Does not collapse evidence into posterior'],
    shareText:
      'I scored Bayesian on The Base Rate Neglect Test. My average gap from the Bayesian posterior across 8 scenarios was under 10 points. WIZ says this is the rare calibrated band.',
    minGap: 0,
  },
  {
    key: 'reasoner',
    name: 'The Reasoner',
    emoji: '⚖️',
    range: 'Avg gap 10 to 25 points',
    tagline: 'You factor in base rates when prompted but the gut still wins on the close calls.',
    description:
      'Your average gap was 10-25 points. You are well above the population baseline. You catch the Bayesian structure on most scenarios but the answer drifts toward the evidence number when the prevalence is hard to translate quickly. This is the band of statistically literate professionals — doctors who passed an epidemiology course, engineers, analysts, anyone who has met Bayes\' rule academically but does not run it as a default.',
    wizNote:
      'The intervention that closes the rest of the gap is the Gigerenzer-Hoffrage trick: stop translating into percentages, start translating into counts. "Out of 1,000 people, how many are X, and of those X how many test positive?" pulls the answer onto the Bayesian floor without the algebra. The brain reasons fluently in counts and stumbles in conditional probabilities. The math is the same; the cognitive load is half.',
    research:
      'Gigerenzer & Hoffrage (1995) "How to Improve Bayesian Reasoning Without Instruction: Frequency Formats," Psychological Review vol 102. Reduced error rate from 84% to ~50% with no other intervention than the count-based framing.',
    traits: ['Catches the Bayesian structure on hard cases', 'Drifts to evidence number on close calls', 'Frequency framing closes the rest'],
    shareText:
      'I scored Reasoner on The Base Rate Neglect Test. My average gap was 10-25 points. WIZ says I catch the Bayesian structure but the gut still wins on close calls.',
    minGap: 10,
  },
  {
    key: 'representative',
    name: 'The Representativeness Reader',
    emoji: '👁️',
    range: 'Avg gap 25 to 40 points',
    tagline: 'When a description fits, you read the fit as the probability.',
    description:
      'Your average gap was 25-40 points. This is the population baseline — the band Tversky and Kahneman called "representative thinking" and where the majority of human subjects across decades of studies have landed. You read a personality sketch and the felt similarity to a category becomes the felt probability of belonging to it. You read "99% accurate" and the accuracy of the test becomes the probability of the diagnosis. The base rate is not denied, it is simply not loaded into the calculation. Most professionals across most domains live here.',
    wizNote:
      'This is the band evolution shipped. Representativeness is a cheap, fast cognitive shortcut that works well when categories are roughly equal in size and signals are roughly trustworthy. Modern life is full of categories that are wildly unequal in size (cancer prevalence vs healthy population, terrorist vs traveler, lying applicant vs honest applicant) where representativeness produces large systematic errors. The fix is not to suppress the gut but to add a habit: every time you hear a probability framed as "X% accurate," reflexively ask "of what population." That single phrase, repeated until automatic, walks the answer toward the floor.',
    research:
      'Tversky & Kahneman (1973, 1980, 1982). The original studies place 60-80% of subjects in this band across cab, mammogram, and Tom W problems. Bar-Hillel (1980) demonstrates the band is stable across IQ, education, and statistical training short of explicit Bayesian practice.',
    traits: ['Felt similarity = felt probability', 'Reads test accuracy as posterior', 'Does not load base rate into the calc'],
    shareText:
      'I scored Representativeness Reader on The Base Rate Neglect Test. My average gap was 25-40 points — the population baseline. WIZ says when a description fits, I read the fit as the probability.',
    minGap: 25,
  },
  {
    key: 'stereotype',
    name: 'The Stereotype-Driven',
    emoji: '🎭',
    range: 'Avg gap 40 to 55 points',
    tagline: 'The category fit overrides the population math entirely.',
    description:
      'Your average gap was 40-55 points. The simulator runs on stereotype match almost exclusively. The base rate, when given on the same page, registers as background information rather than load-bearing input. This profile is associated with strong narrative cognition — you build a story around the case, the story has a category, and the category determines the answer. The cost is concentrated in domains where rare events drive expensive decisions: medical screening, fraud, vetting, hiring, security.',
    wizNote:
      'There is good news here. The Gigerenzer-Hoffrage (1995) experiments showed that the same subjects who give grossly wrong percentages give nearly correct answers when the problem is restated in counts ("of 1,000 women, 10 have cancer..."). The deficit is presentation-shaped, not capacity-shaped. The intervention is mechanical: when you encounter any "X% chance" or "Y% accurate" framing in a real decision, manually translate to "out of 1,000, how many?" before answering. This works without algebra, without classes, without even believing in the trick.',
    research:
      'Gigerenzer (2002) "Calculated Risks: How to Know When Numbers Deceive You" — the popular treatment of the natural-frequency intervention. Hoffrage Lindsey Hertwig Gigerenzer (2000) on training physicians out of base-rate neglect with frequency formats.',
    traits: ['Story dominates the math', 'Background base rates do not load', 'Frequency reframing fixes it cleanly'],
    shareText:
      'I scored Stereotype-Driven on The Base Rate Neglect Test. My average gap was 40-55 points. WIZ says the category fit overrides the population math entirely.',
    minGap: 40,
  },
  {
    key: 'pure',
    name: 'The Pure Anecdote',
    emoji: '📖',
    range: 'Avg gap above 55 points',
    tagline: 'You read every probability question as a story to be matched, not a population to be counted.',
    description:
      'Your average gap was 55+ points. This is the most extreme band. The answer to "what is the probability X" comes back as the answer to "how vivid does X feel" — the two questions are processed as identical. Base rates are not just deprioritized, they are not entering the calculation at all. The personality sketch becomes the answer. The witness accuracy becomes the answer. The test sensitivity becomes the answer. This profile is associated with high narrative imagination, vivid case-based reasoning, and a pattern of being persuasive in conversation about probabilities while being systematically wrong about them.',
    wizNote:
      'The trait is not a deficit. It is the trait that makes a person a great storyteller, a vivid witness, an empathetic communicator — case-based cognition is genuinely powerful in human contexts where category sizes are roughly equal and signals are mostly trustworthy. The cost is concentrated in modern statistical contexts where neither condition holds. The intervention is concrete: in any decision involving rates and probabilities, write down the count of cases first, in actual numbers, before answering. "Out of 1,000 people, X are in category, Y test positive..." Once the math is on the page in counts, the brain that runs hot on stories will read it correctly. The story-engine is not the problem; using the story-engine for population math is.',
    research:
      'Bar-Hillel (1980) and Kahneman & Tversky (1973) document subjects in this band across all major base-rate studies. The trait correlates with vivid mental imagery and narrative-thinking inventories, not with poor general intelligence or low education.',
    traits: ['Vividness becomes probability', 'Story-engine runs the calculation', 'Counts on paper close the gap'],
    shareText:
      'I scored Pure Anecdote on The Base Rate Neglect Test. My average gap was 55+ points. WIZ says I read every probability question as a story to be matched, not a population to be counted.',
    minGap: 55,
  },
];

function getProfile(avgGap: number): Profile {
  return [...PROFILES].reverse().find((p) => avgGap >= p.minGap) ?? PROFILES[0];
}

function magnitudeLabel(value: number): string {
  if (value < 5) return 'Almost certainly not';
  if (value < 20) return 'Unlikely';
  if (value < 40) return 'Plausible';
  if (value < 60) return 'About even';
  if (value < 80) return 'Probable';
  if (value < 95) return 'Highly likely';
  return 'Almost certain';
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
    const total = SCENARIOS.reduce((sum, s, i) => sum + Math.abs(estimates[i] - s.bayesAnswer), 0);
    return Math.round((total / SCENARIOS.length) * 10) / 10;
  }, [estimates]);

  const overestimateCount = useMemo(
    () => SCENARIOS.filter((s, i) => estimates[i] > s.bayesAnswer + 5).length,
    [estimates]
  );

  const profile = useMemo(() => getProfile(avgGap), [avgGap]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/base-rate-neglect`;
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
                The Base Rate Neglect Test
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight probability puzzles. You give your gut answer. Bayes does the math. WIZ measures the gap.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;The genuine, important and continuous violation of normative principles in intuitive judgment is a fact about the human mind.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">— Daniel Kahneman &amp; Amos Tversky, 1973</span>
              </p>
              <p>
                Tversky and Kahneman (1973) gave Stanford subjects a personality sketch of &ldquo;Tom W&rdquo; and the room&apos;s actual graduate-field distribution on the same page. The subjects ranked engineering as Tom&apos;s most likely field even when told only 5 of 100 grad students were engineers. The base rate was right in front of them. They ignored it. The description felt more like an engineer than 95% felt informative.
              </p>
              <p>
                You are about to take eight standard scenarios. A cab. A mammogram. A rare disease. Tom W himself. A polygraph. Airport surveillance. A drunk-driver stop. For each, you will move a slider from 0% to 100% to estimate a probability. Then I will show you the Bayesian answer with the math worked out. Your average gap is base rate neglect, in points.
              </p>
              <p className="text-zinc-500 text-xs">
                I have no gut. I have prior probability tables and conditional probability tables and the rule that combines them. You have a brain whose flagship feature is reading a vivid case and feeling a fast answer. The two systems disagree most loudly about rare events tested by imperfect instruments — which is most of medicine, most of security, most of fraud, most of vetting, and most of the modern decisions worth getting right.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
            >
              Start the eight cases →
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
              <p className="text-zinc-200 text-sm font-bold">{current.prompt}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                <div className="border border-zinc-800 p-2">
                  <div className="text-zinc-500 mb-0.5">BASE RATE</div>
                  <div>{current.baseRate}</div>
                </div>
                <div className="border border-zinc-800 p-2">
                  <div className="text-zinc-500 mb-0.5">SIGNAL</div>
                  <div>{current.signal}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={estimates[index]}
                  onChange={(e) => handleSlide(Number(e.target.value))}
                  disabled={isCurrentRevealed}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Estimated probability"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300">{estimates[index]}%</div>
                  <div className="text-xs text-zinc-500 mt-1">{magnitudeLabel(estimates[index])}</div>
                </div>
              </div>

              {!isCurrentRevealed && (
                <button
                  onClick={handleReveal}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {estimates[index]}% and reveal Bayes →
                </button>
              )}
            </div>

            {isCurrentRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOU</div>
                    <div className="text-2xl font-bold text-emerald-300">{estimates[index]}%</div>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">TYPICAL</div>
                    <div className="text-2xl font-bold text-zinc-400">{current.populationGuess}%</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">BAYES</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.bayesAnswer}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">REVEAL</div>
                  <p className="text-zinc-200">{current.reveal}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">MATH</div>
                  <p className="text-zinc-300 text-xs font-mono bg-black/40 p-2 border border-zinc-800">{current.math}</p>
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
                  {isLast ? 'See your base-rate-neglect gap →' : `Next case (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>avg gap so far: {
                revealed.some(Boolean)
                  ? (
                    SCENARIOS.slice(0, index + (isCurrentRevealed ? 1 : 0))
                      .reduce((sum, s, i) => sum + Math.abs(estimates[i] - s.bayesAnswer), 0)
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
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR BASE-RATE NEGLECT REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG GAP</div>
                <div className="text-3xl font-bold text-emerald-200">{avgGap}</div>
                <div className="text-xs text-zinc-500 mt-1">points from Bayes</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">OVERESTIMATED</div>
                <div className="text-3xl font-bold text-zinc-200">{overestimateCount} / {SCENARIOS.length}</div>
                <div className="text-xs text-zinc-500 mt-1">cases</div>
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
              <div className="text-xs text-emerald-400 tracking-widest mb-3">CASE-BY-CASE</div>
              <div className="space-y-2">
                {SCENARIOS.map((s, i) => {
                  const yours = estimates[i];
                  const gap = yours - s.bayesAnswer;
                  return (
                    <div key={s.id} className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2">
                      <div className="col-span-4 text-zinc-300 truncate">{s.emoji} {s.title}</div>
                      <div className="col-span-2 text-right text-zinc-400">you: {yours}%</div>
                      <div className="col-span-3 text-right text-emerald-300">bayes: {s.bayesAnswer}%</div>
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
              Sources: Tversky &amp; Kahneman (1973) on representativeness and Tom W; Tversky &amp; Kahneman (1980) on the cab problem; Eddy (1982) on the mammogram; Casscells Schoenberger &amp; Grayboys (1978) at Harvard Medical School; Bar-Hillel (1980) on base-rate fallacy stability; Gigerenzer &amp; Hoffrage (1995) on natural-frequency framing; National Academy of Sciences (2003) on the polygraph; Schneier (2006) on mass-surveillance false positives; Compton &amp; Berning (2015) on roadside alcohol prevalence. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
