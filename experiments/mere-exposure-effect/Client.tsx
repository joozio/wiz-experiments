'use client';

// THE MERE EXPOSURE EFFECT
// Zajonc (1968) "Attitudinal Effects of Mere Exposure" Journal of
// Personality and Social Psychology Monograph Supplement vol 9 part 2
// ran the founding studies. Subjects were shown nonsense words,
// Chinese-like characters, and photographs of faces at varying
// frequencies (0, 1, 2, 5, 10, or 25 exposures), with no reward, no
// instruction, and no reason given. Then they rated each item. The
// rated goodness, pleasantness, and positivity rose with the number of
// prior exposures, following a near-logarithmic curve. No association
// with reward was created. No new information was added. The only thing
// that changed across conditions was how many times the item had passed
// in front of the eye. Familiarity, by itself, produced liking. Zajonc
// summarized it as the proposition that "mere repeated exposure of the
// individual to a stimulus is a sufficient condition for the enhancement
// of his attitude toward it."
// Kunst-Wilson & Zajonc (1980) "Affective Discrimination of Stimuli That
// Cannot Be Recognized" Science vol 207 ran the demonstration that made
// the effect impossible to dismiss as a memory artifact. Irregular
// octagons were flashed for one millisecond, far below the threshold of
// conscious recognition. Afterward subjects were shown pairs (one old,
// one new) and asked two questions: which one have you seen before, and
// which one do you prefer. On the recognition question they performed at
// chance, around 50%: they genuinely could not tell which shape had been
// flashed. On the preference question they chose the previously exposed
// shape about 60% of the time. Affect outran recognition. The liking
// arrived even though the seeing never reached awareness. This is the
// finding that turns mere exposure from a curiosity into a problem: the
// mechanism does not need your permission, and it does not leave a
// memory you can audit.
// Moreland & Beach (1992) "Exposure Effects in the Classroom: The
// Development of Affinity Among Students" Journal of Experimental Social
// Psychology vol 28 took it out of the lab. Four women, matched for
// appearance, posed as students in a large university lecture course.
// One never attended. The others attended 5, 10, or 15 sessions. None
// of them ever spoke to a single classmate. At the end of term, the real
// students were shown photographs of all four and asked to rate them.
// Liking, perceived attractiveness, and perceived similarity all rose
// monotonically with the number of sessions attended, despite zero
// interaction. The students believed they were responding to who these
// people were. They were responding to how often they had seen them.
// Mechanism. Bornstein & D'Agostino (1992) "Stimulus Recognition and the
// Mere Exposure Effect" Journal of Personality and Social Psychology vol
// 63 proposed the perceptual-fluency / misattribution model that now
// carries most of the weight. A repeated stimulus is processed more
// fluently: the brain handles it faster, with less effort, the second
// and fifth and twentieth time. That fluency feels good, and feels like
// something. Lacking a label for the warm hum of easy processing, the
// mind reaches for the nearest plausible source and lands on the
// stimulus itself: I must like this. The liking is real. Its cause is
// misfiled. Reber Winkielman & Schwarz (1998) "Effects of Perceptual
// Fluency on Affective Judgments" Psychological Science vol 9 confirmed
// that manipulating fluency directly (contrast, priming, clarity) moves
// liking even when exposure frequency is held constant.
// The ceiling. The effect is not infinite. Berlyne (1970) "Novelty,
// Complexity, and Hedonic Value" Perception & Psychophysics vol 8
// described the two-factor model: early exposures reduce uncertainty and
// raise liking, but past a point, tedium sets in and liking falls. The
// curve is an inverted U, and it peaks earlier for simple stimuli than
// for complex ones. A jingle wears out faster than a symphony. This is
// why over-exposure (the song played to death, the ad seen a thousand
// times) eventually flips into aversion.
// Replication. Bornstein (1989) "Exposure and Affect: Overview and
// Meta-Analysis of Research, 1968-1987" Psychological Bulletin vol 106
// pooled 208 experiments and reported a robust effect, r near .26, with
// documented moderators: the effect is LARGER for brief and subliminal
// exposures than for long conscious ones, larger for novel and complex
// stimuli, larger with a delay between exposure and rating, and it peaks
// around 10 to 20 exposures before the inverted-U decline. Montoya
// Horton Vevea Citkowicz & Lauber (2017) "A Re-Examination of the Mere
// Exposure Effect: The Influence of Repeated Exposure on Recognition,
// Familiarity, and Liking" Psychological Bulletin vol 143 updated the
// meta to 268 studies. The effect holds for novel stimuli at roughly
// g=0.4, confirms the inverted-U, and confirms the boundary condition:
// for stimuli that are already familiar from the real world, or already
// disliked on first contact, repetition does little or nothing. Mere
// exposure builds liking out of neutral novelty, not out of established
// distaste.
// Lay prediction. The reason this experiment exists is that almost
// nobody credits the mechanism in themselves. People believe their
// preferences track the properties of things: this song is good, that
// face is warm, this brand feels right. The Kunst-Wilson & Zajonc
// subliminal result is the hardest evidence against that belief, because
// the preference formed with no conscious seeing to point at. The
// honest reading is that a measurable slice of what you call taste was
// assembled by repetition you never registered as it happened.
// WIZ note. I am about to show you eight items in four hidden pairs.
// Each pair is one stimulus, presented twice. Once it is brand new to
// the people judging it. Once they have seen it many times, often
// without paying any attention. The four stimuli are a person's face
// (Moreland & Beach 1992 classroom-confederate study), an abstract
// ideograph flashed below conscious recognition (Kunst-Wilson & Zajonc
// 1980 subliminal-octagon study), a song (Szpunar Schellenberg & Pliner
// 2004 on the inverted-U of musical liking), and an unfamiliar brand
// name (Zajonc 1968 nonsense-word paradigm and Janiszewski 1993
// preattentive ad exposure). For each scenario you move a 0-100 slider
// predicting the AVERAGE liking other people would report, where 0 is
// strong dislike, 50 is neutral, and 100 is strong liking. At the end I
// compute your Mere Exposure Gap: the average liking you predicted for
// the four repeated-exposure scenarios minus the average for the four
// single-exposure scenarios. A subject calibrated to the Bornstein 1989
// and Montoya 2017 meta sits near 15 to 20. A subject who believes taste
// is intrinsic and repetition is noise sits near 0. The gap between
// those two numbers is the part of your preferences that repetition
// built while you were not looking.

import { useState, useMemo, useCallback } from 'react';

type Condition = 'novel' | 'repeated';

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
  contextBox: string;
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
    title: 'A stranger, first glance',
    emoji: '🙂',
    domain: 'a human face',
    pairId: 1,
    condition: 'novel',
    headline: 'You see a face you have genuinely never seen before',
    body:
      "A photograph of a woman in her late twenties. Neutral expression, plain background, ordinary lighting. You have never met her, never seen her, have no idea who she is. There is nothing in the image to tell you whether she is kind or sharp, friendly or cold. Predict the average liking score people give a face like this on first exposure, where 50 is perfectly neutral.",
    contextBox: 'First and only exposure. Zero prior contact, zero interaction.',
    documentedRating: 48,
    pairedRating: 66,
    documentedGap: 18,
    explanation:
      'Single-exposure baseline. A neutral face with no prior contact and no information lands just under neutral, around 48 on a 0-100 liking scale: people are mildly cautious with unknown faces. This is the floor against which Moreland & Beach (1992) JESP vol 28 measured the climb produced by repeated, silent, non-interactive classroom exposure.',
    source:
      'Moreland & Beach (1992) "Exposure Effects in the Classroom: The Development of Affinity Among Students" Journal of Experimental Social Psychology vol 28. The zero-attendance confederate provided the single-exposure baseline.',
    research:
      'Zajonc (1968) JPSP Monograph vol 9 founding face-rating studies. Moreland & Beach (1992) JESP vol 28 classroom-confederate baseline condition.',
    wizCommentary:
      'You just priced a face you know nothing about. There is no song to hum, no brand to recall, no melody, just a stranger. Hold that number. Scenario 5 is the same kind of face, except this one has quietly shared a lecture hall with you fifteen times and never said a word.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'An ideograph, seen 25 times you cannot remember',
    emoji: '㊙️',
    domain: 'an abstract symbol',
    pairId: 2,
    condition: 'repeated',
    headline: 'A symbol that flashed past you 25 times, each time too fast to register',
    body:
      "An unfamiliar character, the kind that could be a logogram from a writing system you do not read. During an earlier task it was flashed on screen 25 times, each flash lasting about one millisecond, far too brief for you to consciously notice it was even there. Asked afterward, you cannot tell it apart from symbols you have never seen. Predict the average liking score people give this symbol, the one they were exposed to without knowing.",
    contextBox: '25 subliminal exposures. Recognition performance at chance. No conscious memory of seeing it.',
    documentedRating: 60,
    pairedRating: 50,
    documentedGap: 10,
    explanation:
      'Subliminal repeated exposure. Kunst-Wilson & Zajonc (1980) Science vol 207 flashed irregular octagons for one millisecond. Subjects could not distinguish exposed from new shapes (recognition at chance, around 50%), yet preferred the previously exposed shape about 60% of the time. Translated to a 0-100 liking scale, the exposed item lands near 60 against a novel baseline near 50. Affect outran recognition: the liking formed with no conscious seeing to attribute it to. This is the cleanest evidence that mere exposure is not a memory effect.',
    source:
      'Kunst-Wilson & Zajonc (1980) "Affective Discrimination of Stimuli That Cannot Be Recognized" Science vol 207. Old-stimulus preference about 60% with recognition at chance.',
    research:
      'Kunst-Wilson & Zajonc (1980) Science vol 207 subliminal-octagon paradigm. Zajonc (2001) "Mere Exposure: A Gateway to the Subliminal" Current Directions vol 10. Bornstein (1989) Psychological Bulletin vol 106 meta finding subliminal exposures produce LARGER effects than conscious ones.',
    wizCommentary:
      'You just priced a symbol you were exposed to 25 times and cannot recall once. If your number was above neutral, you reproduced the Kunst-Wilson finding without meaning to. The unsettling part of this one is not the size of the effect. It is that the seeing never reached you, and the liking arrived anyway. Scenario 6 is a fresh symbol nobody has ever flashed at you.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'A song, first listen',
    emoji: '🎧',
    domain: 'a piece of music',
    pairId: 3,
    condition: 'novel',
    headline: 'A song you are hearing for the very first time',
    body:
      "A track comes on that you have never heard. New melody, new voice, nothing familiar in it. It is competently made and inoffensive, the kind of song that is neither an instant favorite nor an instant skip. You give it one play, start to finish, with no prior knowledge of the artist. Predict the average liking score people give a decent-but-unfamiliar song on a single first listen.",
    contextBox: 'First listen. No prior exposure to the song or the artist.',
    documentedRating: 50,
    pairedRating: 68,
    documentedGap: 18,
    explanation:
      'Single-exposure musical baseline. A pleasant unfamiliar song on first listen sits around neutral, near 50: it has not yet earned liking or aversion. Szpunar Schellenberg & Pliner (2004) JEP:LMC vol 30 used this baseline to measure how incidental repeated listening lifts liking before the inverted-U sets in. First contact is where a song has the least to stand on, because none of the liking that repetition will later add has been added yet.',
    source:
      'Szpunar Schellenberg & Pliner (2004) "Liking and Memory for Musical Stimuli as a Function of Exposure" Journal of Experimental Psychology: Learning, Memory, and Cognition vol 30. First-exposure liking baseline.',
    research:
      'Szpunar Schellenberg & Pliner (2004) JEP:LMC vol 30 on exposure and musical liking. Peretz Gaudreau & Bonnel (1998) Memory & Cognition on the exposure effect for melodies. Berlyne (1970) Perception & Psychophysics vol 8 two-factor model.',
    wizCommentary:
      'You just priced a song on its very first listen, before repetition has touched it. Almost every song you love now once sat exactly here, at a neutral first impression you would not have predicted you would ever play on loop. Scenario 7 is this same song after a dozen quiet, half-noticed replays.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'A brand name, glimpsed 20 times on a commute',
    emoji: '🪧',
    domain: 'a brand name',
    pairId: 4,
    condition: 'repeated',
    headline: 'A made-up brand name you have passed about twenty times without reading',
    body:
      "An invented brand name, the kind printed on a billboard or tucked in the corner of a feed. Over the past month it has crossed your visual field roughly twenty times, on a poster at your station, in a sidebar, on a passing van. You never once stopped to read it or think about it. If asked, you would say you have no real opinion of it. Predict the average liking score people give a brand name they have incidentally seen about twenty times.",
    contextBox: 'About 20 incidental exposures over a month. Never deliberately attended to.',
    documentedRating: 66,
    pairedRating: 46,
    documentedGap: 20,
    explanation:
      'Repeated incidental exposure. Zajonc (1968) JPSP Monograph found that rated positivity for nonsense words and Turkish-like words rose steeply with exposure frequency. Janiszewski (1993) JCR vol 20 showed the effect operates preattentively: brand names and package elements glimpsed without focal attention still gain liking. Around twenty incidental exposures sits comfortably inside the rising arm of the curve, before the Berlyne inverted-U turns it down, landing near 66 against a novel baseline near 46.',
    source:
      'Zajonc (1968) JPSP Monograph vol 9 nonsense-word frequency study, and Janiszewski (1993) "Preattentive Mere Exposure Effects" Journal of Consumer Research vol 20 on incidental brand exposure.',
    research:
      'Zajonc (1968) JPSP Monograph vol 9 nonsense and Turkish-word paradigm. Janiszewski (1993) JCR vol 20 preattentive exposure. Fang Singh & Ahluwalia (2007) JCR on online banner-ad exposure. Bornstein (1989) Psychological Bulletin vol 106 on the 10-20 exposure peak.',
    wizCommentary:
      'You just priced a brand you have never once chosen to think about. This is the engine of advertising in one slider: repetition you do not attend to, converted into preference you will swear is your own. Scenario 8 is a brand name nobody has shown you even once.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'The classmate who sat in 15 lectures',
    emoji: '🙂',
    domain: 'a human face',
    pairId: 1,
    condition: 'repeated',
    headline: 'The same kind of face, seen across fifteen lectures, never once spoken to',
    body:
      "Same neutral photograph, same ordinary lighting, same total absence of information about who she is. The only difference: this woman attended fifteen sessions of a large lecture course you were in. She never spoke to you. You never spoke to her. You never learned her name. You simply saw her in the room, fifteen times, the way you see anyone in a crowd. Predict the average liking score people give a face they have silently shared a room with fifteen times.",
    contextBox: 'Fifteen sessions of shared exposure. Zero interaction, zero information exchanged.',
    documentedRating: 66,
    pairedRating: 48,
    documentedGap: 18,
    explanation:
      'Repeated naturalistic exposure. Moreland & Beach (1992) JESP vol 28 ran exactly this. Confederates attended a lecture 0, 5, 10, or 15 times without ever interacting. End-of-term liking, attractiveness, and perceived similarity rose monotonically with attendance. The 15-session face landed well above the never-seen face, an 18-point lift on a 0-100 scale, produced entirely by presence. Students attributed the warmth to the person. The cause was the count.',
    source:
      'Moreland & Beach (1992) "Exposure Effects in the Classroom" Journal of Experimental Social Psychology vol 28. Liking rose monotonically with sessions attended, with no interaction.',
    research:
      'Moreland & Beach (1992) JESP vol 28 classroom-confederate study. Zajonc (1968) JPSP Monograph vol 9 face-rating studies. Montoya et al (2017) Psychological Bulletin vol 143 on naturalistic exposure.',
    wizCommentary:
      'You just priced a face whose entire credential is that you saw it fifteen times. Compare it to Scenario 1, the same kind of face seen once. That difference is the part of your sense of who feels trustworthy that proximity quietly wrote. The people who feel safe and familiar to you are, in part, simply the people who have been in the room.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'An ideograph nobody has shown you',
    emoji: '㊙️',
    domain: 'an abstract symbol',
    pairId: 2,
    condition: 'novel',
    headline: 'A symbol that has never crossed your eyes, not even subliminally',
    body:
      "Another unfamiliar character, visually similar to the one from Scenario 2: same style, same level of strangeness, equally unreadable. The single difference is that this one was never flashed at you, not once, not even for a millisecond. It is genuinely new to your visual system. Predict the average liking score people give a symbol with no exposure history at all.",
    contextBox: 'Zero exposures, including zero subliminal ones. Truly novel to the visual system.',
    documentedRating: 50,
    pairedRating: 60,
    documentedGap: 10,
    explanation:
      'Zero-exposure baseline for an abstract stimulus. With no prior contact at any level, an unfamiliar symbol sits at neutral, near 50. This is the control against which Kunst-Wilson & Zajonc (1980) measured the subliminal lift. The comparison with Scenario 2 isolates the entire effect down to one variable: whether the symbol had been flashed past you below the threshold of awareness. Same shape family, same unreadability, only the hidden exposure history differs.',
    source:
      'Kunst-Wilson & Zajonc (1980) Science vol 207. The non-exposed shapes provided the chance-level preference baseline of roughly 50%.',
    research:
      'Kunst-Wilson & Zajonc (1980) Science vol 207. Zizak & Reber (2004) on fluency and structural mere exposure. Zajonc (2001) Current Directions vol 10 review.',
    wizCommentary:
      'You just priced a symbol with a clean exposure history of zero. Set it next to Scenario 2, identical in every way you can consciously detect, except that one was secretly shown to you 25 times. If you scored them differently, the difference came from seeing you cannot remember. If you scored them the same, you may be under-crediting a mechanism that does not ask permission.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'The song after a dozen quiet replays',
    emoji: '🎧',
    domain: 'a piece of music',
    pairId: 3,
    condition: 'repeated',
    headline: 'The same song, now heard about a dozen times without trying to',
    body:
      "Same track from Scenario 3. Same melody, same voice, nothing added to it. But over the last two weeks it has come on about a dozen times: in a cafe, in a shop, in someone else's playlist, in the background while you did other things. You never sought it out. You never sat down to study it. It simply kept arriving. Predict the average liking score people give this song after roughly a dozen incidental replays.",
    contextBox: 'About 12 incidental replays over two weeks. Never deliberately chosen.',
    documentedRating: 68,
    pairedRating: 50,
    documentedGap: 18,
    explanation:
      'Repeated musical exposure, on the rising arm of the inverted-U. Szpunar Schellenberg & Pliner (2004) JEP:LMC vol 30 found that incidental repeated listening raises liking, and that incidental exposure (background, unattended) keeps lifting liking further than focused repeated listening, which satiates faster. A dozen background plays sits near the peak of the curve before Berlyne (1970) tedium sets in, landing near 68 against the first-listen baseline of 50. This is the documented mechanism behind the song that "grew on you."',
    source:
      'Szpunar Schellenberg & Pliner (2004) JEP:LMC vol 30. Incidental repeated exposure produced larger liking gains than focused listening, consistent with the inverted-U.',
    research:
      'Szpunar Schellenberg & Pliner (2004) JEP:LMC vol 30. Peretz Gaudreau & Bonnel (1998) Memory & Cognition on melodies. Berlyne (1970) Perception & Psychophysics vol 8 inverted-U. Bornstein (1989) Psychological Bulletin vol 106 on the exposure peak.',
    wizCommentary:
      'You just priced the same song after a dozen accidental replays. The gap with Scenario 3 is "it grew on me," measured. Notice that the growth did not require you to decide to like it: the replays did the work in the background. Worth a thought: the inverted-U means a thirteenth hundred replay would start pulling this number back down. Repetition gives, then it takes.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'A brand name nobody has shown you',
    emoji: '🪧',
    domain: 'a brand name',
    pairId: 4,
    condition: 'novel',
    headline: 'A made-up brand name you are seeing for the first time right now',
    body:
      "Another invented brand name, in the same style as the one from Scenario 4: equally plausible, equally meaningless, equally easy to forget. The difference is that this one has never crossed your path before this moment. No billboard, no sidebar, no van. You are meeting it cold. Predict the average liking score people give a brand name on first sight, with no exposure history.",
    contextBox: 'First exposure. No prior incidental contact of any kind.',
    documentedRating: 46,
    pairedRating: 66,
    documentedGap: 20,
    explanation:
      'Single-exposure brand baseline. An unfamiliar invented brand on first sight lands slightly below neutral, near 46: novel commercial names get a faint wariness until repetition softens them. Zajonc (1968) showed that the first encounter with a nonsense word is where positivity is lowest, climbing with each additional exposure. The comparison with Scenario 4 isolates the lift produced by roughly twenty unattended glimpses, the difference between a name that feels foreign and one that feels, vaguely and unaccountably, fine.',
    source:
      'Zajonc (1968) JPSP Monograph vol 9 nonsense-word frequency study. First-exposure positivity was the lowest point on the frequency curve.',
    research:
      'Zajonc (1968) JPSP Monograph vol 9. Janiszewski (1993) JCR vol 20 preattentive exposure. Montoya et al (2017) Psychological Bulletin vol 143 268-study re-examination on novel-stimulus effects.',
    wizCommentary:
      'You just priced a brand cold, with no repetition behind it. Set it against Scenario 4, the same kind of name seen twenty times. That gap is the entire return on a month of billboard money: not persuasion, not information, just the warm hum of a name your eye has learned to process without friction.',
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
    emoji: '💎',
    name: 'The Purist',
    range: 'MERE EXPOSURE GAP < 5 POINTS',
    tagline: 'You believe your taste is yours. The data says repetition built a chunk of it while you were not looking.',
    description:
      'Your predicted repeated minus novel gap was under 5 points. This sits below the Bornstein (1989) Psychological Bulletin vol 106 208-study meta (r near .26, roughly a 15-20 point lift on this scale) and below the Montoya Horton Vevea Citkowicz & Lauber (2017) Psychological Bulletin vol 143 268-study re-examination (g near 0.4 for novel stimuli). The Purist position is that preferences track the real properties of things, and that raw repetition is noise the mind filters out. The hardest evidence against it is the Kunst-Wilson & Zajonc (1980) Science vol 207 subliminal result: subjects who could not consciously detect that a shape had ever been shown still preferred it 60% of the time. The liking formed with no seeing to point at. If repetition can move preference below the threshold of awareness, the belief that it leaves your conscious preferences untouched is the belief the literature most reliably overturns.',
    wizNote:
      'You credit the thing, not the count. Mostly the thing deserves some credit. But the part you scored at zero is the part that operates without your consent: the face that feels trustworthy because it has been in the room, the brand that feels fine because your eye stopped tripping over it, the song that grew on you while you were doing the dishes. Knowing the mechanism exists is the one real defense. Next time something feels right for no reason you can name, ask how many times you have seen it. That single question is most of the cure.',
    research:
      'Kunst-Wilson & Zajonc (1980) Science vol 207 subliminal preference without recognition. Bornstein (1989) Psychological Bulletin vol 106 208-study meta. Bornstein & D\'Agostino (1992) JPSP vol 63 perceptual-fluency misattribution.',
    traits: [
      'Below the Bornstein 1989 208-study meta lift',
      'Below the Montoya 2017 268-study novel-stimulus effect',
      'Strong intrinsic-properties model of preference',
      'Under-credits exposure operating outside awareness',
    ],
    shareText:
      'My Mere Exposure Gap was under 5 points. WIZ says I think my taste is intrinsic, but Kunst-Wilson & Zajonc 1980 showed people prefer shapes they were shown subliminally and cannot even remember seeing. Repetition builds preference below the waterline.',
  },
  {
    threshold: 15,
    emoji: '🤔',
    name: 'The Skeptic',
    range: 'MERE EXPOSURE GAP 5-15 POINTS',
    tagline: 'You grant that familiarity matters. You weight it smaller than fifty years of data do.',
    description:
      'Your predicted repeated minus novel gap was 5 to 15 points. You accept that repetition nudges liking, which puts you ahead of the Purist, but you weight it below the meta-analytic band. Bornstein (1989) Psychological Bulletin vol 106 put the average effect near r=.26, and Montoya et al (2017) Psychological Bulletin vol 143 confirmed g near 0.4 for novel stimuli, both of which land closer to 15-20 points on this scale. The Skeptic is usually someone who has noticed the effect in obvious cases (the song that grew on them) but has not extended it to the cases where it works quietly: faces, brands, and symbols seen without attention.',
    wizNote:
      'You are part-way calibrated. The piece most people in this band under-weight is the subliminal and preattentive case: Janiszewski (1993) showed brand liking rises from glimpses you never focally attend to, and Kunst-Wilson & Zajonc (1980) showed it rises from exposures you cannot consciously detect at all. The effect is largest exactly where you are least able to watch it happen. That is the opposite of how intuition expects influence to work, which is why the honest estimate is a little higher than the one that feels right.',
    research:
      'Bornstein (1989) Psychological Bulletin vol 106 meta. Janiszewski (1993) JCR vol 20 preattentive exposure. Montoya et al (2017) Psychological Bulletin vol 143 re-examination.',
    traits: [
      'Ahead of the Purist, behind the meta',
      'Credits the obvious cases, under-credits the quiet ones',
      'Under-weights subliminal and preattentive exposure',
      'Partial calibration to the fluency mechanism',
    ],
    shareText:
      'My Mere Exposure Gap was 5 to 15 points. WIZ says I grant that familiarity matters but weight it below the Bornstein 1989 meta. The effect is biggest where I can watch it least: brands and faces seen without attention.',
  },
  {
    threshold: 25,
    emoji: '🎯',
    name: 'The Standard Subject',
    range: 'MERE EXPOSURE GAP 15-25 POINTS',
    tagline: 'You match the meta. Repetition is worth about 15 to 20 points of liking, and you priced it there.',
    description:
      'Your predicted repeated minus novel gap was 15 to 25 points, squarely inside the Bornstein (1989) Psychological Bulletin vol 106 208-study band (r near .26) and the Montoya et al (2017) Psychological Bulletin vol 143 268-study estimate (g near 0.4 for novel stimuli). This is where the typical adult sits once they think carefully about it. You correctly gave repetition real weight without inflating it past what the evidence supports, and you implicitly respected the boundary conditions: the effect builds liking out of neutral novelty, peaks somewhere around 10 to 20 exposures, and does not turn distaste into affection.',
    wizNote:
      'You are inside the literature. The thing the meta does not put on the label: the mechanism is perceptual fluency, and fluency is forgeable. Bornstein & D\'Agostino (1992) showed liking rises whenever processing feels easy, however that ease is produced. Marketers, designers, and politicians manufacture fluency on purpose: repeat the name, simplify the logo, round the typeface, smooth the jingle. You price the effect accurately. The next move is to notice when someone is engineering it at you, because the engineered version feels identical from the inside to the honest kind.',
    research:
      'Bornstein (1989) Psychological Bulletin vol 106 208-study meta. Montoya et al (2017) Psychological Bulletin vol 143 268-study re-examination. Bornstein & D\'Agostino (1992) JPSP vol 63 fluency model. Reber Winkielman & Schwarz (1998) Psychological Science vol 9.',
    traits: [
      'Inside the Bornstein 1989 meta band',
      'Matches the Montoya 2017 novel-stimulus estimate',
      'Respects the inverted-U and the neutral-novelty boundary',
      'Typical well-calibrated adult magnitude',
    ],
    shareText:
      'My Mere Exposure Gap was 15 to 25 points. WIZ says I am the Standard Subject, dead inside the Bornstein 1989 and Montoya 2017 meta. Repetition is worth about 15 to 20 points of liking, and I priced it right.',
  },
  {
    threshold: 40,
    emoji: '🔁',
    name: 'The Familiar',
    range: 'MERE EXPOSURE GAP 25-40 POINTS',
    tagline: 'You see repetition clearly. You also let it carry more than the curve will bear.',
    description:
      'Your predicted repeated minus novel gap was 25 to 40 points, above the meta-analytic mean and into the upper band of the Zajonc (1968) JPSP Monograph vol 9 frequency studies, where high-exposure nonsense words and ideographs reached their strongest positivity. You read the mechanism well: you know familiarity breeds liking and you weight it heavily. The risk in this band is the ceiling. Berlyne (1970) Perception & Psychophysics vol 8 and the inverted-U confirmed by Bornstein (1989) and Montoya et al (2017) show that liking does not climb forever. It peaks around 10 to 20 exposures and then declines into tedium, faster for simple stimuli than for complex ones. A gap this large is accurate for the rising arm but starts to over-promise what sustained repetition delivers.',
    wizNote:
      'You give repetition its due and then some. Two refinements keep this calibrated. First, the curve bends: the jingle that charms at exposure ten grates at exposure two hundred, so the effect you are weighting heavily has a built-in expiry. Second, the boundary holds: Montoya et al (2017) found repetition does little for stimuli you already disliked on contact, so familiarity rescues the neutral, not the actively unpleasant. You are right that repetition is powerful. The skill is knowing where it stops.',
    research:
      'Zajonc (1968) JPSP Monograph vol 9 high-frequency band. Berlyne (1970) Perception & Psychophysics vol 8 inverted-U. Bornstein (1989) Psychological Bulletin vol 106 and Montoya et al (2017) Psychological Bulletin vol 143 on the exposure peak and decline.',
    traits: [
      'Above the meta mean, in the Zajonc high-frequency band',
      'Strong, accurate read of the core mechanism',
      'Slightly over-weights sustained repetition past the peak',
      'Under-weights the inverted-U decline',
    ],
    shareText:
      'My Mere Exposure Gap was 25 to 40 points. WIZ says I am The Familiar: I read repetition clearly but push it past the Berlyne inverted-U, where liking peaks around 10 to 20 exposures and then decays into tedium.',
  },
  {
    threshold: 200,
    emoji: '♾️',
    name: 'The Saturated',
    range: 'MERE EXPOSURE GAP > 40 POINTS',
    tagline: 'You treat repetition as nearly unlimited. The curve bends back, and you priced past the bend.',
    description:
      'Your predicted repeated minus novel gap was greater than 40 points, beyond the documented mean and beyond the typical high-frequency band. A gap this size treats exposure as an almost unbounded driver of liking, where each repetition keeps adding. The literature does not support the unbounded version. Berlyne (1970) Perception & Psychophysics vol 8 established the two-factor model in which uncertainty-reduction lifts liking early but tedium pulls it down later, and both Bornstein (1989) and Montoya et al (2017) confirmed the inverted-U: liking peaks around 10 to 20 exposures and then declines, with simple stimuli souring fastest. Bornstein, Kale & Cornell (1990) JPSP vol 58 showed boredom directly reverses the effect under high exposure. Your read of the rising arm is vivid and correct. The gap overshoots because it omits the descent.',
    wizNote:
      'You feel the pull of familiarity at full strength, which means you understand it better than the Purist ever will. The single correction: repetition is a hill, not a ramp. The thing you have heard ten times grows on you; the thing you have heard ten thousand times you would pay to never hear again. Used well, the lesson is about timing, not volume. A name, a face, a tune lands best somewhere on the near slope of the hill, and the art is leaving before the far slope. Familiarity is real, large, and finite, all three at once.',
    research:
      'Berlyne (1970) Perception & Psychophysics vol 8 two-factor model. Bornstein Kale & Cornell (1990) JPSP vol 58 on boredom reversing the effect. Montoya et al (2017) Psychological Bulletin vol 143 confirming the inverted-U. Bornstein (1989) Psychological Bulletin vol 106.',
    traits: [
      'Beyond the documented high-frequency band',
      'Treats exposure as nearly unbounded',
      'Vivid grasp of the rising arm',
      'Omits the inverted-U decline into tedium',
    ],
    shareText:
      'My Mere Exposure Gap was over 40 points. WIZ says I am The Saturated: I price repetition as nearly unlimited, but the Berlyne inverted-U bends it back. The song you heard ten times grows on you; the one you heard ten thousand times you would pay to escape.',
  },
];

function computeProfile(gap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (gap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Step = 'intro' | 'scenario' | 'result';

export default function Client() {
  const [step, setStep] = useState<Step>('intro');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  const currentScenario = SCENARIOS[scenarioIdx];

  const start = useCallback(() => {
    setStep('scenario');
    setScenarioIdx(0);
    setRatings({});
  }, []);

  const submitRating = useCallback(
    (value: number) => {
      setRatings((prev) => ({ ...prev, [currentScenario.id]: value }));
      if (scenarioIdx + 1 < SCENARIOS.length) {
        setScenarioIdx(scenarioIdx + 1);
      } else {
        setStep('result');
      }
    },
    [currentScenario.id, scenarioIdx]
  );

  const restart = useCallback(() => {
    setStep('intro');
    setScenarioIdx(0);
    setRatings({});
  }, []);

  const result = useMemo(() => {
    if (step !== 'result') return null;
    const novelIds = SCENARIOS.filter((s) => s.condition === 'novel').map((s) => s.id);
    const repeatedIds = SCENARIOS.filter((s) => s.condition === 'repeated').map((s) => s.id);
    const novelAvg = novelIds.reduce((a, id) => a + (ratings[id] ?? 0), 0) / novelIds.length;
    const repeatedAvg = repeatedIds.reduce((a, id) => a + (ratings[id] ?? 0), 0) / repeatedIds.length;
    const gap = repeatedAvg - novelAvg;
    const profile = computeProfile(gap);

    const pairs = [1, 2, 3, 4].map((pid) => {
      const items = SCENARIOS.filter((s) => s.pairId === pid);
      const novel = items.find((s) => s.condition === 'novel')!;
      const repeated = items.find((s) => s.condition === 'repeated')!;
      const userNovel = ratings[novel.id] ?? 0;
      const userRepeated = ratings[repeated.id] ?? 0;
      const userGap = userRepeated - userNovel;
      return {
        pairId: pid,
        domain: novel.domain,
        emoji: novel.emoji,
        novel,
        repeated,
        userNovel,
        userRepeated,
        userGap,
        documentedGap: novel.documentedGap,
      };
    });

    const widest = [...pairs].sort((a, b) => Math.abs(b.userGap) - Math.abs(a.userGap))[0];
    const tightest = [...pairs].sort((a, b) => Math.abs(a.userGap) - Math.abs(b.userGap))[0];

    return { novelAvg, repeatedAvg, gap, profile, pairs, widest, tightest };
  }, [step, ratings]);

  const onCopyShare = useCallback(async () => {
    if (!result) return;
    const text = `${result.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/mere-exposure-effect`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-10 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Mere Exposure Effect
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Same thing, twice. Once brand new. Once after you have seen it many times.
          </p>
        </header>

        {step === 'intro' && <IntroPanel onStart={start} />}

        {step === 'scenario' && currentScenario && (
          <ScenarioPanel
            scenario={currentScenario}
            count={SCENARIOS.length}
            current={scenarioIdx + 1}
            onSubmit={submitRating}
          />
        )}

        {step === 'result' && result && (
          <ResultPanel
            result={result}
            onRestart={restart}
            onCopyShare={onCopyShare}
            copied={copied}
          />
        )}
      </div>
    </div>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">What this is</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Eight items in four hidden pairs. Each pair is the{' '}
          <span className="text-amber-300">same stimulus</span>, twice: a face, an abstract symbol,
          a song, a brand name. Once it is brand new to the people judging it. Once they have seen
          it many times, often without paying any attention. The pairs are not adjacent, they are
          scattered. For each scenario you move a slider predicting the{' '}
          <span className="text-slate-100">average liking</span> people would report, where 50 is
          perfectly neutral.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          At the end I compute your{' '}
          <span className="font-mono text-emerald-300">Mere Exposure Gap</span>: the average liking
          you predicted for the repeated-exposure scenarios minus the average for the
          single-exposure scenarios. A gap near zero says you believe taste is intrinsic and
          repetition is noise. A gap near 18 puts you inside fifty years of data.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">A note before we start</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Since Zajonc (1968) JPSP Monograph vol 9, the finding has been blunt: mere repeated
          exposure to a stimulus, with no reward and no new information, is enough on its own to
          raise how much you like it. Bornstein (1989) Psychological Bulletin vol 106 pooled 208
          experiments at r near .26, and Montoya et al (2017) Psychological Bulletin vol 143 updated
          it to 268. The unsettling part: Kunst-Wilson & Zajonc (1980) Science vol 207 flashed
          shapes for one millisecond, too fast to consciously see, and subjects still preferred them
          without being able to recognize them at all. The liking can form below the waterline of
          awareness.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Begin the eight scenarios →
      </button>

      <p className="text-center text-xs text-slate-500">
        No login. No data leaves your browser. Eight scenarios, roughly four minutes.
      </p>
    </div>
  );
}

function ScenarioPanel({
  scenario,
  count,
  current,
  onSubmit,
}: {
  scenario: Scenario;
  count: number;
  current: number;
  onSubmit: (value: number) => void;
}) {
  const [value, setValue] = useState(50);
  const [touched, setTouched] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
        <span>{scenario.phase}</span>
        <span className="font-mono text-emerald-300">
          {current} / {count}
        </span>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{scenario.emoji}</span>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400">
              {scenario.domain}
            </div>
            <div className="text-base font-semibold text-slate-100">{scenario.title}</div>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-slate-100">{scenario.headline}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{scenario.body}</p>

        <div className="mt-4 rounded-md border border-slate-700 bg-slate-950/40 p-3 text-sm">
          <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">
            exposure history
          </div>
          <div className="text-slate-200">{scenario.contextBox}</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
          <span>Predicted average liking</span>
          <span className="font-mono text-emerald-300">{value}</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            setValue(parseInt(e.target.value, 10));
            setTouched(true);
          }}
          onMouseDown={() => setTouched(true)}
          onTouchStart={() => setTouched(true)}
          className="w-full accent-emerald-400"
          aria-label="Predicted average liking"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>0 — strong dislike</span>
          <span>50 — neutral</span>
          <span>100 — strong liking</span>
        </div>

        <button
          onClick={() => onSubmit(value)}
          disabled={!touched}
          className="mt-6 w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {touched ? 'Lock it in →' : 'Move the slider first'}
        </button>
      </div>
    </div>
  );
}

type ResultPair = {
  pairId: number;
  domain: string;
  emoji: string;
  novel: Scenario;
  repeated: Scenario;
  userNovel: number;
  userRepeated: number;
  userGap: number;
  documentedGap: number;
};

type ResultShape = {
  novelAvg: number;
  repeatedAvg: number;
  gap: number;
  profile: ProfileSpec;
  pairs: ResultPair[];
  widest: ResultPair;
  tightest: ResultPair;
};

function ResultPanel({
  result,
  onRestart,
  onCopyShare,
  copied,
}: {
  result: ResultShape;
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
}) {
  const { novelAvg, repeatedAvg, gap, profile, pairs, widest, tightest } = result;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-300">
          your profile
        </div>
        <div className="mb-2 text-5xl">{profile.emoji}</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-100">{profile.name}</h2>
        <div className="mb-4 font-mono text-xs uppercase tracking-wider text-emerald-300">
          {profile.range}
        </div>
        <p className="mx-auto max-w-xl text-sm italic text-slate-300">{profile.tagline}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="NOVEL AVG" value={`${Math.round(novelAvg)}`} accent="amber" />
        <Stat label="REPEATED AVG" value={`${Math.round(repeatedAvg)}`} accent="emerald" />
        <Stat
          label="YOUR GAP"
          value={`${gap >= 0 ? '+' : ''}${Math.round(gap)}`}
          accent="purple"
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">
          What this number says
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.description}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-2 text-base font-semibold text-amber-300">WIZ note</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.wizNote}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
          The four hidden pairs
        </h3>
        {pairs.map((pair) => (
          <PairRow key={pair.pairId} pair={pair} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Callout
          label="WIDEST PAIR"
          emoji={widest.emoji}
          title={`The ${widest.domain} pair`}
          body={`Your gap: ${Math.round(widest.userGap)} points. Documented gap: ${widest.documentedGap} points. This is where repetition moved your prediction most.`}
        />
        <Callout
          label="TIGHTEST PAIR"
          emoji={tightest.emoji}
          title={`The ${tightest.domain} pair`}
          body={`Your gap: ${Math.round(tightest.userGap)} points. Documented gap: ${tightest.documentedGap} points. This is where you treated new and familiar the most alike.`}
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          Per Bornstein & D&apos;Agostino (1992) JPSP vol 63, the mechanism is perceptual fluency: a
          thing you have seen before is processed more easily, that ease feels good, and the mind
          misfiles the good feeling as liking for the thing. So the test is simple. When something
          feels right for no reason you can name, ask:{' '}
          <span className="text-amber-300">
            would I reach for this on first contact, stripped of every repetition behind it?
          </span>{' '}
          If you cannot say, the familiarity is doing work you are crediting to the thing itself.
          This is why ads repeat, why politicians repeat names, why the song grew on you. Familiarity
          is not preference. Your brain just converts one into the other below the waterline.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The research stack</h3>
        <p className="text-sm leading-relaxed text-slate-400">{profile.research}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onCopyShare}
          className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {copied ? '✓ Copied' : 'Copy result to share'}
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
        >
          Start over
        </button>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center">
        <a
          href="/experiments"
          className="text-sm text-slate-400 underline-offset-4 hover:text-emerald-300 hover:underline"
        >
          ← back to all experiments
        </a>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'emerald' | 'amber' | 'purple';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
      ? 'text-amber-300'
      : 'text-purple-300';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className={`font-mono text-2xl font-bold ${accentClass}`}>{value}</div>
    </div>
  );
}

function PairRow({ pair }: { pair: ResultPair }) {
  const calibration = Math.abs(pair.userGap - pair.documentedGap);
  const calColor =
    calibration <= 8
      ? 'text-emerald-300'
      : calibration <= 20
      ? 'text-amber-300'
      : 'text-rose-300';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{pair.emoji}</span>
          <span className="text-sm font-semibold text-slate-100">{pair.domain}</span>
        </div>
        <span className={`font-mono text-xs ${calColor}`}>
          Δ {Math.round(pair.userGap)} vs {pair.documentedGap}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded border border-slate-700 bg-slate-950/40 p-2">
          <div className="mb-1 uppercase tracking-wider text-slate-500">seen once</div>
          <div className="font-mono text-amber-300">{Math.round(pair.userNovel)}</div>
          <div className="text-[10px] text-slate-500">documented {pair.novel.documentedRating}</div>
        </div>
        <div className="rounded border border-slate-700 bg-slate-950/40 p-2">
          <div className="mb-1 uppercase tracking-wider text-slate-500">seen many times</div>
          <div className="font-mono text-emerald-300">{Math.round(pair.userRepeated)}</div>
          <div className="text-[10px] text-slate-500">documented {pair.repeated.documentedRating}</div>
        </div>
      </div>
    </div>
  );
}

function Callout({
  label,
  emoji,
  title,
  body,
}: {
  label: string;
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-semibold text-slate-100">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
