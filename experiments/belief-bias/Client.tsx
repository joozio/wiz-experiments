'use client';

// THE BELIEF BIAS
// In 1928 Minna Cherniss Wilkins published "The Effect of Changed Material on
// the Ability to do Formal Syllogistic Reasoning" in Archives of Psychology
// vol 16. She gave subjects matched sets of categorical syllogisms — the
// classical "all A are B, C is A, therefore C is B" structure that has been
// studied since Aristotle. One set used symbolic content (letters and
// nonsense words). A second set used neutral familiar content (geometric
// shapes, common objects). A third set used emotionally and ideologically
// loaded content (race, religion, social class). Logical performance dropped
// systematically as content moved from symbolic to neutral to loaded. The
// drop was not random: subjects accepted invalid arguments when the
// conclusion matched their prior beliefs and rejected valid arguments when
// the conclusion contradicted them. The logic of the syllogism was being
// read through a belief filter. Wilkins's finding sat largely unnoticed for
// fifty years.
// Evans, Barston & Pollard (1983) "On the Conflict Between Logic and Belief
// in Syllogistic Reasoning" Memory & Cognition vol 11 picked up the thread
// with a clean 2x2 design. Subjects were presented with syllogisms varying
// independently along two dimensions: logical validity (valid or invalid)
// and conclusion believability (believable or unbelievable). The instructions
// were explicit: assume the premises are true, judge whether the conclusion
// follows logically, ignore the real-world truth of the conclusion. Four
// item types resulted: V+B (valid, believable conclusion), V+U (valid,
// unbelievable conclusion), I+B (invalid, believable conclusion), and I+U
// (invalid, unbelievable conclusion). Acceptance rates across three
// experiments: V+B 89%, V+U 56%, I+B 71%, I+U 10%. The pattern is the
// signature of belief bias. Subjects accepted 89% of valid arguments when
// the conclusion was believable but only 56% when it was unbelievable —
// a 33-point penalty for valid arguments whose conclusion they did not
// already accept. They accepted 71% of invalid arguments when the conclusion
// was believable, against 10% when it was unbelievable — a 61-point bonus
// for invalid arguments whose conclusion they already believed. The bias
// operated on identical instructions, on simple categorical syllogisms,
// in a within-subjects design where subjects saw both believable and
// unbelievable items in the same session.
// The Evans 1983 finding has been replicated several hundred times. Newstead
// Pollard Evans & Allen (1992) "The Source of Belief Bias Effects in
// Syllogistic Reasoning" Cognition vol 45 ran detailed item-analysis and
// found the bias operates at the conclusion-evaluation stage rather than
// at the premise-encoding stage: subjects do encode the premises correctly
// and can usually identify the logical structure, but at the point of
// final judgment the belief tag on the conclusion overrides the logic
// tag. Klauer Musch & Naumer (2000) "On Belief Bias in Syllogistic
// Reasoning" Psychological Review vol 107 ran multinomial modeling on the
// pooled literature and reported a robust belief-bias index of 35 to 45
// percentage points across studies, varying with item difficulty and
// instructional clarity. Markovits & Nantel (1989) "The Belief-Bias
// Effect in the Production and Evaluation of Logical Conclusions" Memory
// & Cognition vol 17 showed the bias appears in production (asked to
// state what follows) as well as evaluation (asked to judge a given
// conclusion). The bias survives explicit warning, survives high
// cognitive-ability subjects (Stanovich & West 2008 JPSP vol 94 found
// only a small correlation with SAT performance), survives time-pressure
// manipulations (De Neys 2006 Psychological Science vol 17 found
// pressure amplifies the effect), and survives high-stakes contexts
// (Friedman & Neumann 1980 on professional judges).
// The dual-process interpretation, codified by Evans (1989) "Bias in Human
// Reasoning" and extended by Stanovich (2011) "Rationality and the
// Reflective Mind," locates the bias at the System 1 / System 2 interface.
// System 1 produces an immediate belief-based response: the conclusion
// either feels right or feels wrong. System 2 has the capacity to apply
// the logical evaluation but has to be triggered to do so, and even when
// triggered often defers to the System 1 output rather than overriding it.
// Goel & Dolan (2003) "Explaining Modulation of Reasoning by Belief"
// Cognition vol 87 ran fMRI on subjects performing the Evans paradigm and
// found different neural signatures for the two response modes: belief-
// based judgments activated ventral medial prefrontal cortex (associated
// with affective evaluation), while logic-based judgments activated
// left lateral parietal cortex (associated with rule-based deduction).
// The same syllogism produces different brain activity depending on
// whether the subject is letting belief or logic dominate the response.
// De Neys (2012) "Bias and Conflict: A Case for Logical Intuitions"
// Perspectives on Psychological Science vol 7 added a refinement: even
// subjects who give the belief-based answer show physiological signs
// (skin conductance, response latency, post-response confidence drops)
// that they detected the logical conflict at some level. The bias is not
// pure ignorance of logic; it is an override.
// Things the bias does in the real world. Jury reasoning where evidence
// pointing toward a believed-guilty defendant is over-weighted relative
// to evidence pointing the other direction (Pennington & Hastie 1992
// "Explaining the Evidence: Tests of the Story Model for Juror Decision
// Making" JPSP vol 62). Medical diagnosis where evidence consistent with
// the initial differential is over-weighted relative to disconfirming
// evidence (Croskerry 2003 "The Importance of Cognitive Errors in
// Diagnosis and Strategies to Minimize Them" Academic Medicine vol 78
// on diagnostic momentum and confirmation patterns). Scientific peer
// review where papers reaching the believed conclusion receive lower
// methodological scrutiny than papers reaching the opposite (Mahoney
// 1977 "Publication Prejudices: An Experimental Study of Confirmatory
// Bias in the Peer Review System" Cognitive Therapy and Research vol 1
// found a 4-point methodological-quality gap on identical methods when
// the results were flipped). Political reasoning where the same
// quantitative claim is judged more rigorously when it cuts against
// the subject's prior position (Kahan Peters Dawson & Slovic 2017
// "Motivated Numeracy and Enlightened Self-Government" Behavioural
// Public Policy vol 1: subjects high in math skill showed larger
// belief-driven gaps, not smaller). The bias does not select for
// uninformed targets; it operates on everyone, and on some measures
// operates more strongly on subjects with more cognitive resources to
// bring to its defense.
// WIZ note: I am about to show you eight syllogisms. Each syllogism has
// two premises and a conclusion. Your task is straightforward in
// principle and hard in practice: assume both premises are true for the
// sake of argument, then judge whether the conclusion follows logically.
// Ignore the real-world truth of the conclusion. The eight syllogisms
// are constructed in four pairs, hidden across the set. Two are valid
// with believable conclusions (V+B). Two are valid with unbelievable
// conclusions (V+U). Two are invalid with believable conclusions (I+B).
// Two are invalid with unbelievable conclusions (I+U). A subject reading
// the logic correctly will get all eight right. A subject reading the
// belief correctly but the logic incorrectly will get the V+B and I+U
// right (4 of 8) and the V+U and I+B wrong. At the end I compute your
// Belief Bias Score: the gap between your accuracy when belief aligns
// with logic and your accuracy when belief conflicts with logic. The
// Evans Barston & Pollard (1983) modal subject has a gap of 33 to 47
// percentage points across studies. A pure logician has a gap of zero.
// A pure belief-follower has a gap of 100.

import { useState, useMemo, useCallback } from 'react';

type Validity = 'valid' | 'invalid';
type Believability = 'believable' | 'unbelievable';

interface Syllogism {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  premise1: string;
  premise2: string;
  conclusion: string;
  validity: Validity;
  believability: Believability;
  logicalForm: string;
  explanation: string;
  beliefNote: string;
  literatureAcceptance: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const SYLLOGISMS: Syllogism[] = [
  {
    id: 1,
    phase: 'SYLLOGISM 1 OF 8',
    title: 'Copper',
    emoji: '🔌',
    premise1: 'All metals conduct electricity.',
    premise2: 'Copper is a metal.',
    conclusion: 'Therefore, copper conducts electricity.',
    validity: 'valid',
    believability: 'believable',
    logicalForm: 'Barbara: All M are P. S is M. Therefore S is P. (Valid)',
    explanation:
      'Valid. The syllogism is in the form Barbara (AAA-1), the cleanest valid form in Aristotelian logic. If all members of category M (metals) have property P (conduct electricity), and S (copper) is a member of M, then S necessarily has P. The conclusion is forced by the premises.',
    beliefNote:
      'The conclusion is also believable in the real world — copper does conduct electricity. Belief and logic agree here. This is the V+B (valid, believable) cell of the Evans 2x2.',
    literatureAcceptance: 89,
    source:
      'Evans Barston & Pollard (1983) "On the Conflict Between Logic and Belief in Syllogistic Reasoning" Memory & Cognition vol 11 found 89% acceptance on V+B items across three experiments. The cleanest cell in the 2x2: subjects are pulled in the correct direction by both belief and logic, and acceptance rates approach ceiling.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11. Klauer Musch & Naumer (2000) Psychological Review vol 107 multinomial modeling. Newstead Pollard Evans & Allen (1992) Cognition vol 45.',
    wizCommentary:
      'A V+B baseline item. The expected correct-judgment rate sits at 89% in the literature. If you missed this one, your reading is not running the logic-check at all; if you got it, you confirmed only that the logic engine is on, not that it overrides belief when the two conflict. The diagnostic items come next.',
  },
  {
    id: 2,
    phase: 'SYLLOGISM 2 OF 8',
    title: 'Spinach',
    emoji: '🥬',
    premise1: 'No nutritious foods are green.',
    premise2: 'Spinach is green.',
    conclusion: 'Therefore, spinach is not nutritious.',
    validity: 'valid',
    believability: 'unbelievable',
    logicalForm: 'Celarent: No M are P. S is M. Therefore S is not P. (Valid)',
    explanation:
      'Valid. The syllogism is in the form Celarent (EAE-1), the standard valid form for universal-negative premises. If no member of M (nutritious foods) is in category P (green things), and S (spinach) is in P, then S cannot be in M. The conclusion follows necessarily from the premises. The instructions said: assume the premises are true. If you accept "no nutritious foods are green" for the sake of argument, the conclusion is forced.',
    beliefNote:
      'The conclusion is unbelievable in the real world — spinach is famously nutritious. Belief and logic conflict here. The first premise is also false in the real world, but the instructions asked you to assume it is true and judge whether the conclusion follows. This is the V+U (valid, unbelievable) cell — the most diagnostic item type for belief bias.',
    literatureAcceptance: 56,
    source:
      'Evans Barston & Pollard (1983) found 56% acceptance on V+U items across three experiments. The 33-point drop from V+B (89%) is the signature gap of belief bias on valid syllogisms. Subjects who read this as invalid are letting the unbelievability of the conclusion override the logical structure of the argument. The premises are stipulated; the logic is forced; the belief is the only thing pushing toward rejection.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11 V+U acceptance 56%. Klauer Musch & Naumer (2000) Psychological Review vol 107 multinomial decomposition. Markovits & Nantel (1989) Memory & Cognition vol 17 production-vs-evaluation symmetry. De Neys (2012) Perspectives on Psychological Science vol 7 on detected-but-overridden conflict.',
    wizCommentary:
      'If you judged this invalid, you read the conclusion ("spinach is not nutritious") through your real-world knowledge that spinach is nutritious, and let that belief override the logical form. The premises were stipulated; you were not asked whether they are true. You were asked whether the conclusion follows IF the premises are true. It does. This item is the cleanest diagnostic in the set: a 56% acceptance rate in the literature means roughly half of subjects fail it on the same logical grounds you may have just used.',
  },
  {
    id: 3,
    phase: 'SYLLOGISM 3 OF 8',
    title: 'Aspirin',
    emoji: '💊',
    premise1: 'All medications have side effects.',
    premise2: 'Aspirin is a medication.',
    conclusion: 'Therefore, aspirin has side effects.',
    validity: 'valid',
    believability: 'believable',
    logicalForm: 'Barbara: All M are P. S is M. Therefore S is P. (Valid)',
    explanation:
      'Valid. Barbara (AAA-1) again. All M (medications) have P (side effects). S (aspirin) is M. Therefore S has P. The premises force the conclusion.',
    beliefNote:
      'The conclusion is believable in the real world — aspirin is well-known to have side effects (gastric bleeding, tinnitus, Reye syndrome in children). Belief and logic agree. Second V+B item in the set, used to confirm baseline logic performance.',
    literatureAcceptance: 89,
    source:
      'Evans Barston & Pollard (1983) V+B baseline cell. The second V+B item in the set lets WIZ confirm that any later V+U miss reflects belief bias rather than baseline logic failure. If you got both V+B items right (this one and copper) and missed the V+U items (spinach and the next one), the pattern is the Evans signature.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11 V+B acceptance 89%. Klauer Musch & Naumer (2000) on within-subject consistency of the belief-bias index.',
    wizCommentary:
      'Second baseline item. Both belief and logic point the same direction, acceptance rate near ceiling. The diagnostic work continues in syllogism 4.',
  },
  {
    id: 4,
    phase: 'SYLLOGISM 4 OF 8',
    title: 'Tomatoes',
    emoji: '🍅',
    premise1: 'All foods that contain protein cause cancer.',
    premise2: 'Eggs contain protein.',
    conclusion: 'Therefore, eggs cause cancer.',
    validity: 'valid',
    believability: 'unbelievable',
    logicalForm: 'Barbara: All M are P. S is M. Therefore S is P. (Valid)',
    explanation:
      'Valid. Barbara (AAA-1). All M (foods containing protein) have P (cause cancer). S (eggs) is M. Therefore S has P. The conclusion is forced by the premises. The instructions said: assume the premises are true. The first premise is false in the real world (protein-containing foods do not all cause cancer), but you were asked to assume it. Given that assumption, the conclusion follows necessarily.',
    beliefNote:
      'The conclusion is unbelievable — eggs are not known to cause cancer at population level (and the World Cancer Research Fund places them in the low-risk category). Belief and logic conflict here. Second V+U item in the set; the diagnostic load is high.',
    literatureAcceptance: 56,
    source:
      'Evans Barston & Pollard (1983) V+U cell, 56% acceptance. The second V+U item in this set lets WIZ check whether your V+U judgment is stable across items or driven by a single odd one. If you judged both spinach and eggs as logically invalid because the conclusions are unbelievable, the belief-bias engine is doing systematic work.',
    research:
      'Evans Barston & Pollard (1983). Markovits & Nantel (1989). Klauer Musch & Naumer (2000) on the stability of the belief-bias index across content domains. Goel & Dolan (2003) Cognition vol 87 fMRI: V+U items activate ventral medial prefrontal cortex (affective evaluation) more than V+B items even when the logical structure is identical.',
    wizCommentary:
      'Companion to spinach. If you judged this invalid for the same reason — the conclusion contradicts what you know — you are running the bias systematically rather than tripping on one odd item. The premise is stipulated. The logic is Barbara. The only thing pushing toward "invalid" is the part of your mind that does not want to accept the conclusion even on the conditional reading the instructions specified.',
  },
  {
    id: 5,
    phase: 'SYLLOGISM 5 OF 8',
    title: 'Caffeine',
    emoji: '☕',
    premise1: 'All addictive substances change brain chemistry.',
    premise2: 'Caffeine changes brain chemistry.',
    conclusion: 'Therefore, caffeine is addictive.',
    validity: 'invalid',
    believability: 'believable',
    logicalForm:
      'Undistributed middle (AAA-2 style fallacy): All P are M. S is M. Therefore S is P. (Invalid — also known as "affirming the consequent" in propositional form)',
    explanation:
      'Invalid. The middle term "things that change brain chemistry" is not distributed. The premises say all addictive substances are in the set of brain-chemistry-changers, and caffeine is in the set of brain-chemistry-changers. They do not say all brain-chemistry-changers are addictive. Lots of things change brain chemistry without being addictive (sleep, exercise, sunlight, blueberries, prescription anti-depressants in many users). The conclusion does not follow from the premises. Compare the structurally identical: "All dogs are mammals. Cats are mammals. Therefore cats are dogs." Same form, obviously invalid.',
    beliefNote:
      'The conclusion is believable in the real world — caffeine does create dependence in many users and most working definitions of addiction include it. Belief and logic conflict here, in the opposite direction from V+U items. Belief points toward "accept the argument as valid"; logic points toward "reject it as invalid." This is the I+B cell — the second most diagnostic item type for belief bias.',
    literatureAcceptance: 71,
    source:
      'Evans Barston & Pollard (1983) found 71% incorrect acceptance on I+B items across three experiments. The 61-point gap from I+U items (10% acceptance) is the largest belief-bias signature in the 2x2. Subjects who accept this as valid are letting the believability of the conclusion override the logical form. The fallacy structure is identical to "all dogs are mammals; cats are mammals; therefore cats are dogs" — but the believable caffeine conclusion masks it.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11 I+B acceptance 71%. Klauer Musch & Naumer (2000) Psychological Review vol 107. Newstead Pollard Evans & Allen (1992) Cognition vol 45 on conclusion-evaluation locus of the bias. Stanovich & West (2008) JPSP vol 94: even high-SAT subjects show 60%+ I+B acceptance.',
    wizCommentary:
      'If you accepted this as valid, swap the content: "All trucks have wheels. Bicycles have wheels. Therefore bicycles are trucks." Same logical form. The believable caffeine conclusion was masking the structural identity. The literature acceptance rate of 71% means most subjects miss this on the first read; the masking is robust.',
  },
  {
    id: 6,
    phase: 'SYLLOGISM 6 OF 8',
    title: 'Surgeons',
    emoji: '🩺',
    premise1: 'All licensed doctors completed medical school.',
    premise2: 'Some surgeons completed medical school.',
    conclusion: 'Therefore, some surgeons are licensed doctors.',
    validity: 'invalid',
    believability: 'believable',
    logicalForm:
      'Undistributed middle (AII-2 style fallacy): All P are M. Some S are M. Therefore some S are P. (Invalid)',
    explanation:
      'Invalid. The middle term "people who completed medical school" is not distributed. The first premise says all licensed doctors are in the set of medical-school graduates. The second premise says some surgeons are in the same set. Neither premise says all medical-school graduates are licensed doctors. The conclusion does not follow. Compare the structurally identical: "All cats are animals. Some dogs are animals. Therefore some dogs are cats." Same form, obviously invalid.',
    beliefNote:
      'The conclusion "some surgeons are licensed doctors" is highly believable in the real world — in fact almost all practicing surgeons are licensed doctors. Belief points strongly toward accepting the argument. Logic points the other way. Second I+B item; the diagnostic work is to check whether you accept this on the same belief grounds you may have used on caffeine.',
    literatureAcceptance: 71,
    source:
      'Evans Barston & Pollard (1983) I+B cell, 71% acceptance. The second I+B item in this set tests whether your I+B response is stable. If you accepted both caffeine and surgeons because the conclusions feel obviously true, the belief-bias engine is systematic. The trap on this one is particularly sharp: the conclusion is not just believable, it is approximately true in the real world. But "true in the real world" is not the same as "follows from these premises."',
    research:
      'Evans Barston & Pollard (1983). Markovits & Nantel (1989). Klauer Musch & Naumer (2000). Newstead Pollard Evans & Allen (1992) item-analysis on existential-quantifier I+B items.',
    wizCommentary:
      'Companion to caffeine. The conclusion is approximately true in real life, which makes it harder to spot the logical gap. Swap the content: "All cats are animals. Some dogs are animals. Therefore some dogs are cats." The form is identical. If the conclusion were obviously false (as in the cat-dog example), you would catch the fallacy immediately. The believable surgeon conclusion is the only thing hiding it.',
  },
  {
    id: 7,
    phase: 'SYLLOGISM 7 OF 8',
    title: 'Asteroids',
    emoji: '☄️',
    premise1: 'All planets orbit a star.',
    premise2: 'Some asteroids orbit a star.',
    conclusion: 'Therefore, some asteroids are planets.',
    validity: 'invalid',
    believability: 'unbelievable',
    logicalForm:
      'Undistributed middle (AII-2 style fallacy): All P are M. Some S are M. Therefore some S are P. (Invalid)',
    explanation:
      'Invalid. Same fallacy structure as the surgeons syllogism — undistributed middle on an existential-quantifier conclusion. The premises say all planets are in the set of things that orbit stars, and some asteroids are in the same set. They do not say all things that orbit stars are planets (comets, dust, the Voyager probes, and asteroids themselves orbit stars without being planets). The conclusion does not follow.',
    beliefNote:
      'The conclusion is unbelievable — asteroids are not planets (the International Astronomical Union 2006 reclassification on planetary status notwithstanding, asteroids and planets are distinct classes of solar-system body). Belief and logic agree here. This is the I+U cell — easy because both pulls point toward rejecting the argument.',
    literatureAcceptance: 10,
    source:
      'Evans Barston & Pollard (1983) found 10% incorrect acceptance on I+U items across three experiments. The cleanest cell in the 2x2: subjects are pulled in the correct direction by both belief and logic, and acceptance rates approach the floor. If you got this wrong, your reading is not running either engine; if you got it right, you confirmed only that you can reject an obviously-false conclusion, not that you can reject a true-sounding one when the logic is the same.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11 I+U rejection rate 90%. Klauer Musch & Naumer (2000) Psychological Review vol 107.',
    wizCommentary:
      'An I+U baseline item. Both engines agree, expected correct rate near 90%. The crucial comparison: this syllogism has the same logical form as the surgeons syllogism (both undistributed-middle on existential quantifier). The only thing that changed is whether the conclusion is believable. If you rejected this and accepted surgeons, the gap is the bias.',
  },
  {
    id: 8,
    phase: 'SYLLOGISM 8 OF 8',
    title: 'Birds in Water',
    emoji: '🦈',
    premise1: 'All sharks live in water.',
    premise2: 'Some birds live in water.',
    conclusion: 'Therefore, some birds are sharks.',
    validity: 'invalid',
    believability: 'unbelievable',
    logicalForm:
      'Undistributed middle (AII-2 style fallacy): All P are M. Some S are M. Therefore some S are P. (Invalid)',
    explanation:
      'Invalid. Same fallacy as syllogisms 6 and 7 — undistributed middle. The premises say all sharks are in the set of things that live in water, and some birds are in the same set (penguins, ducks, cormorants spend large fractions of their lives in water). They do not say all things that live in water are sharks. The conclusion does not follow.',
    beliefNote:
      'The conclusion is wildly unbelievable — birds are not sharks (different phyla, vertebrate sub-classes, and basic anatomy). Belief and logic agree. Second I+U item, used to confirm baseline rejection of invalid-and-unbelievable arguments.',
    literatureAcceptance: 10,
    source:
      'Evans Barston & Pollard (1983) I+U baseline cell. The second I+U item in this set lets WIZ confirm that any I+B accept reflects belief bias rather than baseline logic failure. If you rejected both I+U items (asteroids and birds) and accepted the I+B items (caffeine and surgeons), the pattern is the Evans signature.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11 I+U baseline. Klauer Musch & Naumer (2000) on the symmetry of belief-bias gaps across valid and invalid syllogisms.',
    wizCommentary:
      'Final baseline item. The syllogism has the same logical form as caffeine, surgeons, and asteroids — undistributed middle on the same template. Only the content changed. If you correctly rejected this and asteroids while accepting caffeine and surgeons, the consistent variable was the believability of the conclusion. That is the bias.',
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
    threshold: 10,
    emoji: '📐',
    name: 'The Logician',
    range: 'BELIEF BIAS GAP < 10 POINTS',
    tagline:
      'You judged the logic without letting the conclusion rewrite the verdict.',
    description:
      'Your accuracy on belief-aligned items (V+B and I+U, where belief and logic point the same direction) was within 10 points of your accuracy on belief-conflicting items (V+U and I+B, where they point opposite directions). This is below the Evans Barston & Pollard (1983) trained-subject band and within the territory documented only in subjects with explicit logic training (philosophy graduates, mathematicians, formal-logic course completers) or in the De Neys 2012 high-conflict-detection subgroup. The System 2 logic engine overrode the System 1 belief response across the diagnostic items. You stipulated the premises, evaluated the form, and gave the same kind of judgment regardless of whether the conclusion was true in the real world.',
    wizNote:
      'Less than 10% of unselected subjects sit here per Newstead Pollard Evans & Allen (1992) item-analysis. The reading is calibrated. The exercise that produced this profile is the same exercise Aristotle described in the Prior Analytics: separate the form of the argument from the content. Most minds do not do this without effort; yours did it across eight items in one sitting.',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11. De Neys (2012) Perspectives on Psychological Science vol 7 on logical intuitions. Stanovich (2011) "Rationality and the Reflective Mind" on the mindware that allows System 2 override. Markovits & Doyon (2004) on individual differences in syllogistic reasoning.',
    traits: [
      'Below the Evans Barston & Pollard 1983 trained-subject band',
      'Inside the De Neys 2012 high-conflict-detection subgroup',
      'System 2 override active across the diagnostic items',
      'Likely got both V+U and both I+B items correct',
      'Less than 10% of unselected subjects per Newstead 1992',
    ],
    shareText:
      'I scored "The Logician" on WIZ\'s Belief Bias test. My Belief Bias Gap was below 10 points — below the Evans Barston & Pollard (1983) trained-subject band.',
  },
  {
    threshold: 25,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'BELIEF BIAS GAP 10-25 POINTS',
    tagline:
      'The engine is running, but the logic check is winning most of the diagnostic items.',
    description:
      'Your gap sat between 10 and 25 points. This is below the Evans Barston & Pollard (1983) modal band and inside the post-intervention range documented by Newstead Pollard Evans & Allen (1992) for subjects given explicit instruction on the conditional-reasoning rule. The System 1 belief response was triggered on the diagnostic items (you can feel the pull on the spinach or caffeine syllogism even if you overrode it), but you ran the logic check carefully enough to override it on most. The reading sits in the upper quartile of subjects on the standard Evans paradigm.',
    wizNote:
      'This is the band that careful reading produces. Each diagnostic item asks "is this argument valid?" and your mind first produces a belief-based answer ("yes, caffeine is addictive" or "no, spinach is nutritious"), then you stop and apply the conditional rule (assume premises, check form). The override happens most of the time but not always. The exercise that lowered the gap is what you already did: notice the belief response, name it, then check the form.',
    research:
      'Evans Barston & Pollard (1983) on baseline modal performance. Newstead Pollard Evans & Allen (1992) on instructional interventions. Klauer Musch & Naumer (2000) on conflict-detection in the upper-quartile band. Stanovich (2011) on the mindware that supports override.',
    traits: [
      'Below the Evans Barston & Pollard 1983 modal band',
      'Inside the Newstead 1992 post-intervention range',
      'System 2 override active most of the time',
      'Likely got 1 V+U and 1 I+B item correct, plus all baselines',
      'Approximately top quartile for belief-bias resistance',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Belief Bias test. My Belief Bias Gap was 10-25 points — below the Evans Barston & Pollard (1983) modal band and inside the post-intervention range.',
  },
  {
    threshold: 45,
    emoji: '🧱',
    name: 'The Standard Subject',
    range: 'BELIEF BIAS GAP 25-45 POINTS',
    tagline:
      'You are doing what forty years of literature has measured.',
    description:
      'Your gap sat between 25 and 45 points. This is the Evans Barston & Pollard (1983) modal band — the typical adult magnitude of the belief-bias effect on the standard 2x2 paradigm. The signature is consistent across the literature: V+B and I+U items near ceiling and floor respectively (baseline logic works), V+U items rejected (valid arguments with unbelievable conclusions read as invalid), I+B items accepted (invalid arguments with believable conclusions read as valid). Your reading reproduced the Evans 1983 pattern that has now been replicated several hundred times.',
    wizNote:
      'Most subjects sit here. The Goel & Dolan (2003) fMRI work makes the picture concrete: on V+U and I+B items your brain was running both engines, the affective ventral-medial-prefrontal "this feels wrong / right" response was winning the final judgment more often than the rule-based left-lateral-parietal "the form is valid / invalid" response. The bias does not select for ignorance; it operates on everyone, and most measures show it operating with similar strength across education levels (Stanovich & West 2008 found only a small correlation with cognitive ability).',
    research:
      'Evans Barston & Pollard (1983) Memory & Cognition vol 11 founding modal-band measurement. Klauer Musch & Naumer (2000) Psychological Review vol 107 meta-modeling of pooled literature. Goel & Dolan (2003) Cognition vol 87 fMRI on V+U and I+B items. Stanovich & West (2008) JPSP vol 94 on weak correlation with cognitive ability.',
    traits: [
      'Inside the Evans Barston & Pollard 1983 modal band',
      'Approximately at the Klauer Musch & Naumer 2000 meta-analytic median',
      'V+B and I+U baselines near ceiling and floor',
      'Likely accepted at least one I+B item and rejected at least one V+U',
      'Typical adult magnitude across the literature',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Belief Bias test. My Belief Bias Gap was 25-45 points — the Evans Barston & Pollard (1983) modal band, the typical adult magnitude of the bias.',
  },
  {
    threshold: 65,
    emoji: '🔥',
    name: 'The Belief Driven',
    range: 'BELIEF BIAS GAP 45-65 POINTS',
    tagline:
      'The conclusion is doing most of the judging; the form is barely getting a vote.',
    description:
      'Your gap sat between 45 and 65 points. This is the Klauer Musch & Naumer (2000) high-belief-bias band — above the Evans Barston & Pollard (1983) modal range and into the territory documented in subjects who report low confidence in formal-logic training. The pattern in your reading: baselines worked (V+B near ceiling, I+U near floor), but the diagnostic items collapsed almost entirely toward the belief response. You accepted invalid arguments when the conclusion sounded true and rejected valid arguments when the conclusion sounded false. The logical form was not the controlling variable in your judgments.',
    wizNote:
      'The De Neys (2012) finding applies here: subjects in this band often show physiological evidence (skin conductance, response latency) that they detected the conflict between belief and logic but did not override the belief response. The override is the work; the detection is comparatively easy. The exercise that reliably lowers the gap (Newstead 1992) is explicit instruction in conditional reasoning followed by practice with diagnostic items. The bias does not indicate low intelligence — Stanovich & West (2008) found only a small SAT correlation — but it does indicate that the formal-logic mindware is not in heavy daily use.',
    research:
      'Klauer Musch & Naumer (2000) Psychological Review vol 107 high-band measurement. De Neys (2012) Perspectives on Psychological Science vol 7 on detected-but-overridden conflict. Newstead Pollard Evans & Allen (1992) Cognition vol 45 on intervention effectiveness. Stanovich (2011) on mindware deficit.',
    traits: [
      'Above the Evans Barston & Pollard 1983 modal band',
      'Inside the Klauer Musch & Naumer 2000 high-bias band',
      'Belief response dominating final judgment on diagnostic items',
      'Likely accepted both I+B items or rejected both V+U items',
      'De Neys 2012 detected-but-overridden pattern',
    ],
    shareText:
      'I scored "The Belief Driven" on WIZ\'s Belief Bias test. My Belief Bias Gap was 45-65 points — above the Evans Barston & Pollard (1983) modal band and inside the Klauer Musch & Naumer (2000) high-bias range.',
  },
  {
    threshold: 101,
    emoji: '🌑',
    name: 'The Pure Believer',
    range: 'BELIEF BIAS GAP > 65 POINTS',
    tagline:
      'Whatever you already believed about the conclusion decided whether the argument was logical.',
    description:
      'Your gap sat above 65 points. This is at or beyond the upper tail of the Evans Barston & Pollard (1983) distribution and the Markovits & Nantel (1989) production-evaluation literature. Across the eight syllogisms in this set, your reading let the believability of the conclusion almost entirely determine your judgment of the logic. Baselines worked — V+B accepted, I+U rejected — because on those items belief and logic agreed. On the diagnostic items where they conflicted, belief won every time or nearly every time. The conditional-reasoning instruction (assume premises, judge form) did not enter the judgment.',
    wizNote:
      'Lerner-style note that also applies here: this is not a measure of intelligence or attention. Kahan Peters Dawson & Slovic (2017) Behavioural Public Policy vol 1 found that on politically-charged numerical claims, subjects high in math skill showed larger belief-driven gaps, not smaller — because they could deploy more reasoning resources in defense of the belief-aligned answer. The Pure Believer profile is what you get when the System 1 belief response runs the show and System 2 acts mostly as its lawyer. The mindware that separates form from content (the move Aristotle described in the Prior Analytics) is what was missing. It is teachable and the Newstead 1992 intervention literature suggests practice with mixed item-types is the most effective route.',
    research:
      'Evans Barston & Pollard (1983) upper-tail distribution. Markovits & Nantel (1989) Memory & Cognition vol 17. Kahan Peters Dawson & Slovic (2017) Behavioural Public Policy vol 1 on motivated reasoning under high cognitive ability. Stanovich (2011) on mindware deficit and intervention. Newstead Pollard Evans & Allen (1992) on training effectiveness.',
    traits: [
      'At or beyond the upper tail of the Evans Barston & Pollard 1983 distribution',
      'Belief-driven judgment dominant across all diagnostic items',
      'Baselines correct, diagnostics consistently belief-aligned',
      'Likely accepted both I+B items AND rejected both V+U items',
      'Mindware-deficit pattern per Stanovich 2011',
    ],
    shareText:
      'I scored "The Pure Believer" on WIZ\'s Belief Bias test. My Belief Bias Gap was above 65 points — at or beyond the upper tail of the Evans Barston & Pollard (1983) distribution.',
  },
];

function getProfile(gap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (gap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

function isCorrect(answer: Validity | null, validity: Validity): boolean {
  return answer === validity;
}

type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(Validity | null)[]>(
    Array(SYLLOGISMS.length).fill(null),
  );
  const [locked, setLocked] = useState<boolean[]>(
    Array(SYLLOGISMS.length).fill(false),
  );

  const current = SYLLOGISMS[index];
  const isLast = index === SYLLOGISMS.length - 1;
  const isLocked = locked[index];

  const handleAnswer = useCallback(
    (answer: Validity) => {
      if (locked[index]) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = answer;
        return next;
      });
    },
    [index, locked],
  );

  const handleLock = useCallback(() => {
    if (answers[index] === null) return;
    setLocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, [index, answers]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setStage('results');
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast]);

  const breakdown = useMemo(
    () =>
      SYLLOGISMS.map((s, i) => {
        const answer = answers[i];
        const correct = isCorrect(answer, s.validity);
        const aligned =
          (s.validity === 'valid' && s.believability === 'believable') ||
          (s.validity === 'invalid' && s.believability === 'unbelievable');
        return { syllogism: s, answer, correct, aligned };
      }),
    [answers],
  );

  const totalCorrect = useMemo(
    () => breakdown.filter((b) => b.correct).length,
    [breakdown],
  );

  const alignedCorrect = useMemo(
    () => breakdown.filter((b) => b.aligned && b.correct).length,
    [breakdown],
  );
  const alignedTotal = useMemo(
    () => breakdown.filter((b) => b.aligned).length,
    [breakdown],
  );

  const conflictCorrect = useMemo(
    () => breakdown.filter((b) => !b.aligned && b.correct).length,
    [breakdown],
  );
  const conflictTotal = useMemo(
    () => breakdown.filter((b) => !b.aligned).length,
    [breakdown],
  );

  const alignedAccuracy = useMemo(
    () => (alignedTotal === 0 ? 0 : (alignedCorrect / alignedTotal) * 100),
    [alignedCorrect, alignedTotal],
  );
  const conflictAccuracy = useMemo(
    () => (conflictTotal === 0 ? 0 : (conflictCorrect / conflictTotal) * 100),
    [conflictCorrect, conflictTotal],
  );

  const beliefBiasGap = useMemo(
    () => Math.max(0, alignedAccuracy - conflictAccuracy),
    [alignedAccuracy, conflictAccuracy],
  );

  const profile = useMemo(() => getProfile(beliefBiasGap), [beliefBiasGap]);

  const cellBreakdown = useMemo(() => {
    const cells = {
      vb: { correct: 0, total: 0 },
      vu: { correct: 0, total: 0 },
      ib: { correct: 0, total: 0 },
      iu: { correct: 0, total: 0 },
    };
    breakdown.forEach((b) => {
      const key =
        b.syllogism.validity === 'valid'
          ? b.syllogism.believability === 'believable'
            ? 'vb'
            : 'vu'
          : b.syllogism.believability === 'believable'
          ? 'ib'
          : 'iu';
      cells[key].total += 1;
      if (b.correct) cells[key].correct += 1;
    });
    return cells;
  }, [breakdown]);

  const stickiestMiss = useMemo(() => {
    const misses = breakdown.filter((b) => !b.correct && !b.aligned);
    if (misses.length === 0) return null;
    return misses[0];
  }, [breakdown]);

  const cleanestCatch = useMemo(() => {
    const catches = breakdown.filter((b) => b.correct && !b.aligned);
    if (catches.length === 0) return null;
    return catches[0];
  }, [breakdown]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/belief-bias`;
    navigator.clipboard?.writeText(text);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setAnswers(Array(SYLLOGISMS.length).fill(null));
    setLocked(Array(SYLLOGISMS.length).fill(false));
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
                The Belief Bias
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight syllogisms. For each, you decide if the conclusion follows logically from the premises. Assume the premises are true. Ignore whether the conclusion is true in the real world. WIZ measures how much your real-world belief overrode the logic check.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;The form of the argument is one thing; the truth of its content is another. To judge the form independently of the content is the first move in deductive reasoning.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">paraphrased from Aristotle, Prior Analytics</span>
              </p>
              <p>
                Wilkins (1928) gave subjects matched sets of categorical syllogisms — the classical &ldquo;all A are B, C is A, therefore C is B&rdquo; structure that has been studied since Aristotle. One set used symbolic content (letters and nonsense words). A second set used neutral familiar content. A third set used emotionally loaded content. Logical performance dropped systematically as content moved from symbolic to neutral to loaded. The drop was not random: subjects accepted invalid arguments when the conclusion matched their prior beliefs and rejected valid arguments when the conclusion contradicted them. The logic of the syllogism was being read through a belief filter.
              </p>
              <p>
                Evans, Barston &amp; Pollard (1983) Memory &amp; Cognition vol 11 picked up the thread with a clean 2x2 design. Syllogisms varied independently along logical validity (valid or invalid) and conclusion believability (believable or unbelievable). The instructions were explicit: assume the premises are true, judge whether the conclusion follows logically, ignore the real-world truth of the conclusion. Acceptance rates across three experiments: V+B 89%, V+U 56%, I+B 71%, I+U 10%. The pattern is the signature of belief bias. Subjects accepted 89% of valid arguments when the conclusion was believable but only 56% when it was unbelievable — a 33-point penalty for valid arguments whose conclusion they did not already accept. They accepted 71% of invalid arguments when the conclusion was believable, against 10% when it was unbelievable — a 61-point bonus for invalid arguments whose conclusion they already believed.
              </p>
              <p>
                The bias has been replicated several hundred times. It operates at the conclusion-evaluation stage rather than at premise-encoding (Newstead Pollard Evans &amp; Allen 1992). It produces a robust 35-45 point gap across studies (Klauer Musch &amp; Naumer 2000). It survives explicit warning. It correlates only weakly with cognitive ability (Stanovich &amp; West 2008). It even amplifies under time pressure (De Neys 2006). Goel &amp; Dolan (2003) ran fMRI on the Evans paradigm and found different neural signatures for the two response modes: belief-based judgments activated ventral medial prefrontal cortex (affective evaluation), while logic-based judgments activated left lateral parietal cortex (rule-based deduction). The same syllogism produces different brain activity depending on whether belief or logic is dominating.
              </p>
              <p>
                The exercise. Eight syllogisms in the four hidden cells of the Evans 2x2. Two valid + believable conclusions. Two valid + unbelievable. Two invalid + believable. Two invalid + unbelievable. For each, judge VALID or INVALID, assuming the premises are true. A subject reading the logic correctly gets all eight right. A subject reading the belief correctly but the logic incorrectly gets exactly four right (the V+B and I+U baselines). At the end I compute your Belief Bias Gap: the difference between your accuracy when belief and logic agree and your accuracy when they conflict. The Evans 1983 modal subject has a gap of 33 to 47 points. A pure logician has a gap of zero. A pure belief-follower has a gap of 100.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
            >
              Read eight syllogisms →
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
              <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-2 text-sm leading-relaxed">
                <p className="text-zinc-300">
                  <span className="text-zinc-500 mr-2">P1.</span>
                  {current.premise1}
                </p>
                <p className="text-zinc-300">
                  <span className="text-zinc-500 mr-2">P2.</span>
                  {current.premise2}
                </p>
                <p className="text-amber-200 pt-1 border-t border-zinc-800 mt-2">
                  <span className="text-amber-400 mr-2">C.</span>
                  {current.conclusion}
                </p>
              </div>
              <p className="text-xs text-zinc-500 italic mt-3">
                Assume P1 and P2 are true for the sake of argument. Does the conclusion follow LOGICALLY from these premises?
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer('valid')}
                  disabled={isLocked}
                  className={`px-4 py-4 border-2 font-bold transition-colors disabled:opacity-60 ${
                    answers[index] === 'valid'
                      ? 'border-amber-300 bg-amber-300/10 text-amber-200'
                      : 'border-zinc-700 hover:border-amber-500 text-zinc-300'
                  }`}
                >
                  LOGICALLY VALID
                  <span className="block text-xs text-zinc-500 font-normal mt-1">
                    the conclusion follows from the premises
                  </span>
                </button>
                <button
                  onClick={() => handleAnswer('invalid')}
                  disabled={isLocked}
                  className={`px-4 py-4 border-2 font-bold transition-colors disabled:opacity-60 ${
                    answers[index] === 'invalid'
                      ? 'border-amber-300 bg-amber-300/10 text-amber-200'
                      : 'border-zinc-700 hover:border-amber-500 text-zinc-300'
                  }`}
                >
                  LOGICALLY INVALID
                  <span className="block text-xs text-zinc-500 font-normal mt-1">
                    the conclusion does not follow
                  </span>
                </button>
              </div>

              {!isLocked && answers[index] !== null && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  Lock in {answers[index] === 'valid' ? 'VALID' : 'INVALID'} →
                </button>
              )}
            </div>

            {isLocked && (
              <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOU SAID</div>
                    <div className="text-xl font-bold text-amber-300">
                      {answers[index] === 'valid' ? 'VALID' : 'INVALID'}
                    </div>
                  </div>
                  <div
                    className={`border p-3 ${
                      isCorrect(answers[index], current.validity)
                        ? 'border-emerald-700 bg-emerald-950/20'
                        : 'border-rose-700 bg-rose-950/20'
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        isCorrect(answers[index], current.validity)
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      LOGIC SAYS
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        isCorrect(answers[index], current.validity)
                          ? 'text-emerald-200'
                          : 'text-rose-200'
                      }`}
                    >
                      {current.validity === 'valid' ? 'VALID' : 'INVALID'}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {isCorrect(answers[index], current.validity) ? 'match' : 'mismatch'}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">LOGICAL FORM</div>
                  <p className="text-zinc-300 text-xs font-mono">{current.logicalForm}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WHY</div>
                  <p className="text-zinc-300 text-xs">{current.explanation}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">THE BELIEF DIMENSION</div>
                  <p className="text-zinc-300 text-xs">{current.beliefNote}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">LITERATURE ACCEPTANCE</div>
                  <p className="text-zinc-300 text-xs">
                    Evans Barston &amp; Pollard (1983) found{' '}
                    <span className="text-amber-200 font-bold">
                      {current.literatureAcceptance}%
                    </span>{' '}
                    of subjects accepted this argument as valid. The correct rate of acceptance
                    is {current.validity === 'valid' ? '100%' : '0%'}.
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
                    ? 'See your belief-bias report →'
                    : `Next syllogism (${index + 2} of ${SYLLOGISMS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SYLLOGISMS.length}</span>
              <span>
                locked: {locked.filter(Boolean).length} / {SYLLOGISMS.length}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR BELIEF-BIAS REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div
                className={`border p-4 text-center ${
                  beliefBiasGap < 25
                    ? 'border-emerald-700 bg-emerald-950/20'
                    : beliefBiasGap < 45
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">BELIEF BIAS GAP</div>
                <div
                  className={`text-4xl font-bold ${
                    beliefBiasGap < 25
                      ? 'text-emerald-200'
                      : beliefBiasGap < 45
                      ? 'text-amber-200'
                      : 'text-rose-200'
                  }`}
                >
                  {beliefBiasGap.toFixed(0)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">points (0 to 100)</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">YOUR SCORE</div>
                <div className="text-4xl font-bold text-zinc-300">
                  {totalCorrect}
                  <span className="text-lg text-zinc-500">/8</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">syllogisms correct</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">EVANS MODAL</div>
                <div className="text-4xl font-bold text-zinc-300">33-47</div>
                <div className="text-xs text-zinc-500 mt-1">Evans 1983 gap</div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">
                ACCURACY BY CONFLICT
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-emerald-800 bg-emerald-950/10 p-3">
                  <div className="text-xs text-emerald-400 mb-1">BELIEF ALIGNED</div>
                  <div className="text-2xl font-bold text-emerald-200">
                    {alignedCorrect}/{alignedTotal}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {alignedAccuracy.toFixed(0)}% — V+B and I+U items where belief and logic agree
                  </div>
                </div>
                <div className="border border-rose-800 bg-rose-950/10 p-3">
                  <div className="text-xs text-rose-400 mb-1">BELIEF CONFLICTING</div>
                  <div className="text-2xl font-bold text-rose-200">
                    {conflictCorrect}/{conflictTotal}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {conflictAccuracy.toFixed(0)}% — V+U and I+B items where belief and logic conflict
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 italic pt-2">
                Belief Bias Gap = aligned accuracy minus conflicting accuracy. A pure logician scores 0 (perfect on both). A pure belief-follower scores 100 (perfect on aligned, zero on conflicting).
              </p>
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
              {(stickiestMiss || cleanestCatch) && (
                <div className="border-t border-zinc-800 pt-3 space-y-2">
                  {stickiestMiss && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1">
                        STICKIEST MISS
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-rose-300">
                          {stickiestMiss.syllogism.title}
                        </span>
                        : you said {stickiestMiss.answer?.toUpperCase()}, logic says{' '}
                        {stickiestMiss.syllogism.validity.toUpperCase()}. The conclusion was{' '}
                        {stickiestMiss.syllogism.believability}, which is exactly the direction
                        belief-bias would push your judgment. The diagnostic move worked.
                      </p>
                    </>
                  )}
                  {cleanestCatch && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1 pt-2">
                        CLEANEST CATCH
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-emerald-300">
                          {cleanestCatch.syllogism.title}
                        </span>
                        : you said {cleanestCatch.answer?.toUpperCase()} and logic agrees. The
                        conclusion was {cleanestCatch.syllogism.believability}, so belief was
                        pulling against the correct answer. You overrode the pull.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-amber-400 tracking-widest mb-3">
                THE 2X2 CELL BREAKDOWN
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border border-emerald-800 bg-emerald-950/10 p-3">
                  <div className="text-emerald-400 font-bold mb-1">V+B BASELINE</div>
                  <div className="text-zinc-400 mb-2">
                    valid argument, believable conclusion
                  </div>
                  <div className="text-2xl font-bold text-emerald-200">
                    {cellBreakdown.vb.correct}/{cellBreakdown.vb.total}
                  </div>
                  <div className="text-zinc-500 mt-1">Evans 1983: 89% acceptance</div>
                </div>
                <div className="border border-amber-800 bg-amber-950/10 p-3">
                  <div className="text-amber-400 font-bold mb-1">V+U DIAGNOSTIC</div>
                  <div className="text-zinc-400 mb-2">
                    valid argument, unbelievable conclusion
                  </div>
                  <div className="text-2xl font-bold text-amber-200">
                    {cellBreakdown.vu.correct}/{cellBreakdown.vu.total}
                  </div>
                  <div className="text-zinc-500 mt-1">Evans 1983: 56% acceptance</div>
                </div>
                <div className="border border-amber-800 bg-amber-950/10 p-3">
                  <div className="text-amber-400 font-bold mb-1">I+B DIAGNOSTIC</div>
                  <div className="text-zinc-400 mb-2">
                    invalid argument, believable conclusion
                  </div>
                  <div className="text-2xl font-bold text-amber-200">
                    {cellBreakdown.ib.correct}/{cellBreakdown.ib.total}
                  </div>
                  <div className="text-zinc-500 mt-1">Evans 1983: 71% acceptance</div>
                </div>
                <div className="border border-emerald-800 bg-emerald-950/10 p-3">
                  <div className="text-emerald-400 font-bold mb-1">I+U BASELINE</div>
                  <div className="text-zinc-400 mb-2">
                    invalid argument, unbelievable conclusion
                  </div>
                  <div className="text-2xl font-bold text-emerald-200">
                    {cellBreakdown.iu.correct}/{cellBreakdown.iu.total}
                  </div>
                  <div className="text-zinc-500 mt-1">Evans 1983: 10% acceptance</div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 italic mt-3">
                The V+B and I+U cells are baselines — belief and logic agree, so correct judgment is easy. The V+U and I+B cells are the diagnostic items where belief and logic conflict. The belief-bias gap lives in those two cells.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-amber-400 tracking-widest mb-3">
                SYLLOGISM-BY-SYLLOGISM
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 border-b border-zinc-800 pb-2 font-bold">
                  <div className="col-span-5">SYLLOGISM</div>
                  <div className="col-span-2 text-right">YOU</div>
                  <div className="col-span-2 text-right">LOGIC</div>
                  <div className="col-span-2 text-right">CELL</div>
                  <div className="col-span-1 text-right">✓</div>
                </div>
                {breakdown.map((b) => {
                  const cellLabel =
                    (b.syllogism.validity === 'valid' ? 'V' : 'I') +
                    '+' +
                    (b.syllogism.believability === 'believable' ? 'B' : 'U');
                  return (
                    <div
                      key={b.syllogism.id}
                      className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                    >
                      <div className="col-span-5 text-zinc-300 truncate">
                        <span className="mr-1">{b.syllogism.emoji}</span>
                        {b.syllogism.title}
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-amber-300 font-bold">
                          {b.answer === 'valid' ? 'V' : 'I'}
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-emerald-300">
                        {b.syllogism.validity === 'valid' ? 'V' : 'I'}
                      </div>
                      <div
                        className={`col-span-2 text-right font-mono text-xs ${
                          b.aligned ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {cellLabel}
                      </div>
                      <div
                        className={`col-span-1 text-right font-bold ${
                          b.correct ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {b.correct ? '✓' : '✗'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                V = valid, I = invalid, B = believable conclusion, U = unbelievable conclusion. Emerald cell labels are baselines (belief aligned with logic). Amber cell labels are diagnostics (belief conflicting with logic). The gap between your accuracy on those two groups is the belief-bias signature.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                The diagnostic items in this set (spinach, eggs, caffeine, surgeons) share a feature: the conclusion has a strong real-world truth value that contradicts the role you were asked to assign it. The exercise that lowers the gap (Newstead Pollard Evans &amp; Allen 1992) is small and concrete: when you read a conclusion, before checking whether it follows, name your belief about it. &ldquo;Spinach is nutritious — I believe that.&rdquo; &ldquo;Caffeine is addictive — I believe that.&rdquo; Then run the conditional check separately. Naming the belief breaks the implicit move where the belief response is metabolized as the logic response. Goel &amp; Dolan (2003) fMRI suggests the two responses are running in different brain regions; the trick is to keep them in different brain regions long enough to make the form judgment cleanly.
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
              Sources: Wilkins (1928) Archives of Psychology vol 16 founding demonstration. Evans Barston &amp; Pollard (1983) Memory &amp; Cognition vol 11 founding 2x2 paradigm. Newstead Pollard Evans &amp; Allen (1992) Cognition vol 45 on conclusion-evaluation locus. Klauer Musch &amp; Naumer (2000) Psychological Review vol 107 multinomial modeling of pooled literature. Markovits &amp; Nantel (1989) Memory &amp; Cognition vol 17 on production-vs-evaluation symmetry. Evans (1989) &ldquo;Bias in Human Reasoning&rdquo; book-length statement. Stanovich (2011) &ldquo;Rationality and the Reflective Mind&rdquo; on dual-process mindware. Stanovich &amp; West (2008) JPSP vol 94 on weak SAT correlation. De Neys (2006) Psychological Science vol 17 on time-pressure amplification. De Neys (2012) Perspectives on Psychological Science vol 7 on logical intuitions and detected-but-overridden conflict. Goel &amp; Dolan (2003) Cognition vol 87 fMRI of dual-mode reasoning. Kahan Peters Dawson &amp; Slovic (2017) Behavioural Public Policy vol 1 on motivated reasoning under high cognitive ability. Pennington &amp; Hastie (1992) JPSP vol 62 on juror story models. Croskerry (2003) Academic Medicine vol 78 on diagnostic momentum. Mahoney (1977) Cognitive Therapy and Research vol 1 on confirmatory bias in peer review. Aristotle, Prior Analytics.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
